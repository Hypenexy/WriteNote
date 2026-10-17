/*

    MideLight Server

    https://github.com/Hypenexy/WriteNote/Server

    Below are the default variables for the server.
    You can change them in the configuration.json file. (Look at the example file configuration.example.json)
*/

var port = 2053,
    version = [1, 0, 0],
    allowURL = "http://127.0.0.1:5500";

global.version = version;
// Server
const log = require("./code/interface/log");
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
// Safety net: log unexpected errors to a file instead of letting one bad request stop the server.
// This is a stopgap, the handlers should still validate their input.
const errorLogDir = "./serverdata";
const errorLogFile = errorLogDir + "/errors.log";

function logErrorToFile(type, error){
    const text = (error && error.stack) ? error.stack : String(error);
    const line = `[${new Date().toISOString()}] ${type}: ${text}\n`;
    console.error(line.trim());
    try {
        fs.mkdirSync(errorLogDir, { recursive: true }); // does nothing if it already exists
        fs.appendFileSync(errorLogFile, line);
    } catch (writeError) {
        // Never let the logger itself throw inside an error handler
        console.error("Could not write to " + errorLogFile + ":", writeError.message);
    }
}

process.on("unhandledRejection", (reason) => {
    logErrorToFile("Unhandled promise rejection", reason);
    console.error("Unhandled promise rejection:", reason);
});
process.on("uncaughtException", (error) => {
    logErrorToFile("Uncaught exception", error);
    console.error("Uncaught exception:", error);
});

var http, server;


// Init server

const images = require("./code/images");
var configuration;
try {
    configuration = require('./configuration.json');
}
catch (error) {
    log("i", "Configuration file is not created, if you want to use Https you'll have to manually create it.");
}

const optionsServer = {};

optionsServer.withCredentials = true;

if(configuration){
    if(configuration['ssl.key']){
        optionsServer.key = fs.readFileSync(configuration['ssl.key']);
    }
    if(configuration['ssl.cert']){
        optionsServer.cert = fs.readFileSync(configuration['ssl.cert']);
    }
    
    
    if(configuration['server.port']){
        port = configuration['server.port'];
    }
    if(configuration['server.allowURL']){
        allowURL = configuration['server.allowURL'];
    }
}

if(configuration && configuration['ssl.key'] && configuration["ssl.cert"]){
    http = require('https');
}
else{
    http = require('http');
}


// QR Codes
const QRCodes = require("./code/user/QRCodes");
const cookie = require("cookie");
const { v4 } = require('uuid');

server = http.createServer(optionsServer, async function (req, res) {
    const headers = {
      'Access-Control-Allow-Origin': allowURL,
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Max-Age': 2592000,
      'Access-Control-Allow-Credentials': "true",
    };
    
    if(req.url.startsWith("/code/")){
        const cookies = cookie.parse(req.headers.cookie || '');
        if (!cookies["MDSess"]) {
            const sessionId = v4();
            // const isHttps = configuration && configuration['ssl.key'] && configuration["ssl.cert"];
            const sessionCookie = cookie.serialize("MDSess", sessionId, {
                sameSite: "none",
                secure: true,
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7,
                path: '/'
            });
            headers["Set-Cookie"] = sessionCookie;
            req.headers.cookie = `MDSess=${sessionId}`;
        }
    }

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

    if(req.url.startsWith("/code/")){
        QRCodes.getHTML(headers, req, res);
        // QRCodes.getQRCode(headers, req, res);
        return;
    }
});

server.listen(port, () => {
    log("s", 'Allowing connections on: ' + allowURL);
    log("s", 'Server listening on *:' + port);
    
    var isHttps = configuration && configuration['ssl.key'] && configuration["ssl.cert"];
    if(isHttps){
        log("s", 'HTTPS server active');
    }

    // log("s", isHttps ? "https" : "http", "://" + allowURL + ":" + port);
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
    // Was 1e9 (1 GB) per message, which lets any client (logged in or not) exhaust
    // memory with one packet. 25 MB covers notes and avatars. Raise it if you need to.
    maxHttpBufferSize: 25e6,
    cors: {
        origin: allowURL,
        credentials: true,
    }
});

function initiateServer(){
    
    const adminStats = require("./code/admin/stats")(io);
    
    io.engine.on("initial_headers", (headers, request) => {
        const cookies = cookie.parse(request.headers.cookie || '');
        
        if(!cookies["MDSess"]){
            const sessionId = v4();
            const sessionCookie = cookie.serialize("MDSess", sessionId, {
                sameSite: "none", // Change this cookie to same site only later
                secure: true,
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7,
                path: '/'
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

        // A client that connects over websocket only has no cookie, so sessionId can be undefined.
        if(typeof sessionId != "string" || sessionId.length != 36){
            // Invalid session: drop the socket and forget it. Before, this returned and left the
            // entry in `clients` forever (the disconnect handler was never registered).
            clients.splice(clients.indexOf(clientInfo), 1);
            socket.disconnect(true);
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
            // Leave every room this socket joined while logged in (the user room, the
            // "admin" room and any open-note rooms), otherwise it keeps receiving events.
            for (const room of Array.from(socket.rooms)) {
                if(room != socket.id){
                    socket.leave(room);
                }
            }
            UID = -1;
            clientInfo.UID = UID;
            var clientInfoKeys = Object.keys(clientInfo);
            for (let i = 0; i < clientInfoKeys.length; i++) {
                // Was `clientInfoKeys != "UID"` (array vs string, always true), which deleted UID as well.
                if(clientInfoKeys[i] != "socketId" && clientInfoKeys[i] != "UID"){
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
                require("./code/user/userProtocols")(socket, clientInfo, chat, clients, io, notes, sessionId, forensic, devices, QRCodes);
                require("./code/admin/adminProtocols")(socket, clientInfo, clients, io, admin);
            }
        }

        function unloadUserProtocols(){
            loadedProtocols = false;
            socket.emit("logon", UID);
        }
        
        if(UID == -1){
            socket.emit("logon", UID);
            require("./code/user/qrCodeProtocol")(socket, clientInfo, QRCodes);
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