const sql = require("./../databases/mysql");

async function sessionsList(UID, callback){
    var result = await sql.midelightDB.query(`SELECT ID, Device, Date FROM sessions WHERE UID='${UID}'`);
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