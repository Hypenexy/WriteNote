const sql = require("../databases/mysql");
const protocolCheck = require("../user/protocolCheck");

module.exports = (socket, clientInfo, clientsReference, io, admin) => {
    socket.on("admin", async (data, callback) => {
        admin.protocol(data, callback, socket, clientInfo, clientsReference, io, admin)
    });
    // if(!handshakeData.key){
    //     callback("...");
    //     return;
    // }
}