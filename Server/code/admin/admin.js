const sql = require("./../databases/mysql");
const bcrypt = require('bcrypt');

async function key(clientInfo, data, callback, socket){
    if(typeof data.Key != "string" || data.Key.length == 0 || data.Key.length > 500){
        callback({error: true});
        return false;
    }
    const adminResult = await sql.midelightDB.query(`SELECT \`Key\` FROM admins WHERE UID = ${sql.midelightDB.escape(clientInfo.UID)}`);
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

module.exports.protocol = async (data, callback, socket, clientInfo, clientsReference, io) => {
    if(data.type == "key"){
        await key(clientInfo, data, callback, socket);
        return; // key() already answered; the admin switch below would answer a second time
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