const sql = require("../databases/mysql");
const protocolCheck = require("./protocolCheck");

module.exports = (socket, sessionId, clientInfo, chat, clientsReference, io) => {
    socket.on("notes", async (data, callback) => {
        if(!protocolCheck.checkDataAndCallback(data, callback)){
            return;
        }
        if(!data.type){
            callback(null, "Invalid request, type isn't specified");
            return;
        }
        // if(data.type == "register"){
        //     callback(await register(data, sessionId, loginUID));
        // }
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
}