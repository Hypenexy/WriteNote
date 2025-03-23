const sql = require("../databases/mysql");
const protocolCheck = require("./protocolCheck");
// var socketStream = require('socket.io-stream');

module.exports = (socket, clientInfo, chat, clientsReference, io, notes, sessionId, forensic, devices) => {
    socket.on("notes", async (data, callback) => {
        if(!protocolCheck.checkDataAndCallback(data, callback)){
            return;
        }
        if(!data.type){
            callback(null, "Invalid request, type isn't specified");
            return;
        }
        
        notes.protocol(data, callback, socket, clientInfo, clientsReference, io);
        // if(data.type == "register"){
        //     callback(await register(data, sessionId, loginUID));
        // }
    });

    // socketStream(socket).on("streamNote", async (data, callback) => {
    //     notes.stream(data, callback, socket, clientInfo);
    // });

    socket.on("devices", async (data, callback) => {
        if(!protocolCheck.checkDataAndCallback(data, callback)){
            return;
        }
        if(!data.type){
            callback({error: "Invalid request, type isn't specified"});
            return;
        }
        devices.protocol(data, callback, socket, clientInfo, clientsReference);
    });


    socket.on("chat", async (data, callback) => {
        if(!protocolCheck.checkDataAndCallback(data, callback)){
            return;
        }
        if(!data.type){
            callback(null, "Invalid request, type isn't specified");
            return;
        }
        chat(data, callback, socket, clientInfo, clientsReference, io);
    });

    socket.on("forensic", async (data) => {
        forensic(data, sessionId);
    });
}