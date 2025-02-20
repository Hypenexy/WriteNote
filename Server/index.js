const port = 2053;
// Server
const startDate = Date.now();
function setUptime(){
    const uptime = require("./code/admin/uptime");
    uptime.newUptime(startDate);
}

var http, server;

// var isWin = process.platform === "win32";
// const fs = require('fs');
// if(!isWin){
//     options = {
//         key: fs.readFileSync('/etc/apache2/sites-enabled/midelight.net.key'),
//         cert: fs.readFileSync('/etc/apache2/sites-enabled/midelight.net.pem')
//     }
//     http = require('https');
//     server = http.createServer(options);
// }
// else{

http = require('http');

const images = require("./code/images");

server = http.createServer(async function (req, res) {
    const headers = {
      'Access-Control-Allow-Origin': "http://127.0.0.1:5500",
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Max-Age': 2592000,
      'Access-Control-Allow-Credentials': "true",
    };

    if(req.url.startsWith("/ui/")){
        images.getUIImage(headers, req, res);
        return;
    }
    if(req.url.startsWith("/weather/")){
        images.getWeatherImage(headers, req, res);
        return;
    }
});
// }

const log = require("./code/interface/log");
server.listen(port, () => {
    log("s", 'Server listening on *:' + port);
});

// Database

const mongodb = require("./code/databases/mongodb");
global.collection;
(async() => {
    var collection = await mongodb.collection();
    global.collection = collection[0];
    global.chatCollection = collection[1];
})();

const mysql = require("./code/databases/mysql");

mysql.onLoadActions.push(setUptime);

require("./code/databases/fileSystemCheck");

// Command Interface

function initInterface(){
    require("./code/interface/index")(mysql.midelightDB, mysql.writenoteDB);
}
mysql.onLoadActions.push(initInterface);

// Socket IO

function initiateServer(){
    const io = require("socket.io")(server, {
        // maxHttpBufferSize: 1e9,
        cors: {
            origin: "http://127.0.0.1:5500",
            credentials: true,
        }
    });
    
    const adminStats = require("./code/admin/stats")(io);
    
    const { v4 } = require('uuid');
    const cookie = require("cookie");
    
    io.engine.on("initial_headers", (headers, request) => {
        const cookies = cookie.parse(request.headers.cookie || '');
        
        if(!cookies["MDSess"]){
            const sessionId = v4();
            const sessionCookie = cookie.serialize("MDSess", sessionId, {
                sameSite: "none", // Change this cookie to same site only later
                secure: true,
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7
            });
    
            headers["set-cookie"] = sessionCookie;
            request.headers.cookie = `MDSess=${sessionId}`;
        }
    });
    
    
    const usageTime = require("./code/user/usageTime");
    const session = require("./code/user/session");
    const notes = require("./code/user/notes");
    const weather = require("./code/user/weather");
    const chat = require("./code/chat");
    
    io.on('connection', async (socket) => {
        const connectDate = Date.now();
    
        log('server', 'user', socket.id, 'connected');
        adminStats.updateAdminStats("socketCount", io.engine.clientsCount);
    
        const cookies = cookie.parse(socket.handshake.headers.cookie || '');
        const sessionId = cookies["MDSess"];
    
        if(sessionId.length != 36){
            // handle invalid session
            return;
        }
    
        var UID = await session.getSessionUID(sessionId);

        function loginUID(newUID){
            UID = newUID;
            loadUserProtocols();
        }


        require("./code/account")(socket, sessionId, loginUID);

        function loadUserProtocols(){
            require("./code/user/logon")(socket, UID, notes, weather);
            require("./code/user/userProtocols")(socket, sessionId, UID, chat);
        }
        
        if(UID == -1){
            socket.emit("logon", UID);
        }
        if(UID != -1){
            loadUserProtocols();
        }
    
        var handshakeData = socket.request._query;
        console.log("Client loaded in", Date.now() - handshakeData.loadStartDate, "ms");
        if(handshakeData.disconnectDate){
            console.log("Client reconnected in", Date.now() - handshakeData.disconnectDate, "ms");
        }
    
        usageTime.newUsageTime(socket.id, UID, sessionId, handshakeData.loadStartDate, connectDate, handshakeData.disconnectDate);
    
        socket.on('disconnect', () => {
            const disconnectDate = Date.now();
    
            log('server', 'user', socket.id, 'disconnected');
            io.to("admin").emit("stats", {socketCount: io.engine.clientsCount});
    
            usageTime.endUsageTime(socket.id, UID, sessionId, disconnectDate)
        });
    
    });

    log('s', "Socket server active");
}
mysql.onLoadActions.push(initiateServer);