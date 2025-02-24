const sql = require("./../databases/mysql");
const bcrypt = require('bcrypt');

async function key(clientInfo, data, callback){
    const adminResult = await sql.midelightDB.query(`SELECT \`Key\` FROM admins WHERE UID = ${sql.midelightDB.escape(clientInfo.UID)}`);
    console.log(adminResult);
    if(adminResult[0].length > 0){
        const match = bcrypt.compareSync(data.Key, adminResult[0][0].Key);
        if(match) {
            clientInfo.admin = true;
            socket.join("admin");
            callback({success: true});
            return true;
        }
        callback({error: true});
        return false;
    }
    else{
        callback({error: true});
        return false;
    }
}

module.exports.protocol = (data, callback, socket, clientInfo, clientsReference, io) => {
    if(data.type == "key"){
        key(clientInfo, data, callback);
    }

    if(clientInfo.admin == true){
        switch (data.type) {
            case "value":
                
                break;
        
            default:
                callback({error: "Invalid request type"});
                break;
        }
        // if(data.type == "open"){
        //     openNote(clientInfo.UID, data, callback, socket);
        // }
        // if(data.type == "save"){
        //     saveNote(clientInfo.UID, data, callback, socket);
        // }
    }
}