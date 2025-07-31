const port = 2053,
    version = [1, 0, 0],
    allowURL = "http://127.0.0.1:5500";

global.version = version;
// Server
const startDate = Date.now();

// Settings
const fs = require('fs');
const settingsFileURL = './serverdata/settings';
try {
    let rawdata = fs.readFileSync(settingsFileURL);
    global.settings = JSON.parse(rawdata);
} catch (error) {
    if(error.code == "ENOENT"){
        var dir = './serverdata';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        let data = JSON.stringify({version: version});
        fs.writeFileSync(settingsFileURL, data);
    }
    console.log("Settings file error other than that, that it doesn't exist.");
    // throw new Error("")
}

function setSetting(property, value){
    global.settings[property] = value;
    fs.writeFileSync(settingsFileURL, JSON.stringify({version: version}));
}


function setUptime(){
    const uptime = require("./code/admin/uptime");
    uptime.newUptime(startDate);
}

var http, server;

// QR Codes
const QRCodes = require("./code/user/QRCodes");

// Init server

const images = require("./code/images");

const configuration = require('./configuration.json');
const options = {};

if(configuration['ssl.key']){
    options.key = fs.readFileSync(configuration['ssl.key']);
}
if(configuration['ssl.cert']){
    options.cert = fs.readFileSync(configuration['ssl.cert']);
}

if(configuration['ssl.key'] && configuration["ssl.cert"]){
    http = require('https');
}
else{
    http = require('http');
}

server = http.createServer(options, async function (req, res) {
    const headers = {
      'Access-Control-Allow-Origin': allowURL,
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Max-Age': 2592000,
      'Access-Control-Allow-Credentials': "true",
    };

    if(req.url.startsWith("/avatar/")){
        images.getAvatar(headers, req, res);
        return;
    }
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
    log("s", 'Allowing connections on: ' + allowURL);
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
    require("./code/interface/index")(mysql.midelightDB, mysql.writenoteDB, clients, io, startDate);
}
mysql.onLoadActions.push(initInterface);

// Socket IO
const clients = [];

const io = require("socket.io")(server, {
    maxHttpBufferSize: 1e9,
    cors: {
        origin: allowURL,
        credentials: true,
    }
});

function initiateServer(){
    
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
    
    
    const usageTime = require("./code/user/usageTime"),
        session = require("./code/user/session"),
        notes = require("./code/user/notes"),
        admin = require("./code/admin/admin"),
        weather = require("./code/user/weather"),
        chat = require("./code/chat"),
        forensic = require("./code/user/forensic"),
        devices = require("./code/devices");
    
    io.on('connection', async (socket) => {
        const connectDate = Date.now();
        const clientInfo = new Object();
        clientInfo.socketId = socket.id;
        clients.push(clientInfo);
        var handshakeData = socket.request._query;
    
        log('server', 'user', socket.id, 'connected');
        adminStats.updateAdminStats("socketCount", io.engine.clientsCount);
    
        const cookies = cookie.parse(socket.handshake.headers.cookie || '');
        const sessionId = cookies["MDSess"];
    
        if(sessionId.length != 36){
            // handle invalid session
            return;
        }
    
        var UID = await session.getSessionUID(sessionId);
        clientInfo.UID = UID;

        function loginUID(newUID){
            UID = newUID;
            clientInfo.UID = UID;
            loadUserProtocols();
        }

        function logout(){
            socket.leave(UID);
            UID = -1;
            clientInfo.UID = UID;
            var clientInfoKeys = Object.keys(clientInfo);
            for (let i = 0; i < clientInfoKeys.length; i++) {
                if(clientInfoKeys[i] != "socketId" && clientInfoKeys != "UID"){
                    delete clientInfo[clientInfoKeys[i]];
                }
            }
            
            unloadUserProtocols();
        }

        require("./code/account")(socket, sessionId, clientInfo, loginUID, logout);

        var loadedProtocols = false;
        function loadUserProtocols(){
            // if(handshakeData.admin == true){ No separate client is used
            //     return;
            // }
            if(!loadedProtocols){
                loadedProtocols = true;
                socket.join(UID);
                require("./code/user/logon")(socket, UID, notes, weather, clientInfo, devices, handshakeData);
                require("./code/user/userProtocols")(socket, clientInfo, chat, clients, io, notes, sessionId, forensic, devices);
                require("./code/admin/adminProtocols")(socket, clientInfo, clients, io, admin);
            }
        }

        function unloadUserProtocols(){
            loadedProtocols = false;
            socket.emit("logon", UID);
        }
        
        if(UID == -1){
            socket.emit("logon", UID);
        }
        if(UID != -1){
            loadUserProtocols();
        }
    
        console.log("Client loaded in", Date.now() - handshakeData.loadStartDate, "ms");
        if(handshakeData.disconnectDate){
            console.log("Client reconnected in", Date.now() - handshakeData.disconnectDate, "ms");
        }
    
        usageTime.newUsageTime(socket.id, UID, sessionId, handshakeData.loadStartDate, connectDate, handshakeData.disconnectDate);
    
        socket.on('disconnect', () => {
            const disconnectDate = Date.now();

            var position = clients.indexOf(clientInfo);
            clients.splice(position, 1);
    
            if(UID != -1){
                devices.deviceList.updateDevices(UID, socket);
            }
            log('server', 'user', socket.id, 'disconnected');
            io.to("admin").emit("stats", {socketCount: io.engine.clientsCount});
    
            usageTime.endUsageTime(socket.id, UID, sessionId, disconnectDate)
        });
    
    });

    log('s', "Socket server active");
}
mysql.onLoadActions.push(initiateServer);