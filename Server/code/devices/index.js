const sql = require("./../databases/mysql");

async function sessionsList(UID, callback){
    // The session ID is the login secret (it is the MDSess cookie value), so it
    // must never be sent to the browser. Only return display information.
    var result = await sql.midelightDB.query("SELECT Device, Date FROM sessions WHERE UID=" + sql.midelightDB.escape(UID));
    if(result.error){ // double check
        callback({error: result.error});
        return;
    }

    callback(result[0]);
}

const devices = require("./devices");

module.exports["deviceList"] = devices;


module.exports.protocol = (data, callback, socket, clientInfo, clientsReference) => {
    if(data.type == "sessionList"){
        sessionsList(clientInfo.UID, callback);
    }
    if(data.type == "openOn"){
        devices.openOn(clientInfo.UID, data, socket, clientsReference);
    }
}