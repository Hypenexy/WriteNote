const sql = require("./../databases/mysql");

async function sessionsList(UID, callback){
    var result = await sql.midelightDB.query(`SELECT ID, Device, Date FROM sessions WHERE UID='${UID}'`);
    if(result.error){ // double check
        callback({error: result.error});
        return;
    }
    
    callback(result[0]);
}


module.exports.protocol = (data, callback, socket, clientInfo, clientsReference, io) => {
    if(data.type == "sessionList"){
        sessionsList(clientInfo.UID, callback);
    }
}