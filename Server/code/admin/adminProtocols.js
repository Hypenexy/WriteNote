const sql = require("../databases/mysql");
const protocolCheck = require("../user/protocolCheck");

module.exports = (socket, clientInfo, clientsReference, io, admin) => {
    socket.on("admin", async (data, callback) => {
        // Same input check the other handlers use. Without it a missing callback or
        // null data threw inside this async handler and stopped the server.
        if(!protocolCheck.checkDataAndCallback(data, callback) || !data || typeof data.type != "string"){
            return;
        }
        try {
            await admin.protocol(data, callback, socket, clientInfo, clientsReference, io, admin);
        } catch (error) {
            console.error("admin protocol error:", error);
            try { callback({error: "Internal server error"}); } catch(e) {}
        }
    });
    // if(!handshakeData.key){
    //     callback("...");
    //     return;
    // }
}