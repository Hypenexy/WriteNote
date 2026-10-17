const sharp = require('sharp');
const { v4 } = require('uuid');
const fs = require('fs');
const sql = require("../databases/mysql");

const MAX_AVATAR_BYTES = 10 * 1000 * 1000;

module.exports = (data, callback, clientInfo) => {
    // Must be logged in: otherwise UID is -1/undefined and this creates "userdata/-1/...".
    if(typeof clientInfo.UID != "string" || clientInfo.UID.length == 0){
        callback({error: true});
        return;
    }
    // sharp() treats a string argument as a FILE PATH on the server, so the client's
    // data must be a real binary buffer. Also cap the size.
    if(!Buffer.isBuffer(data.data) || data.data.length == 0 || data.data.length > MAX_AVATAR_BYTES){
        callback({error: true});
        return;
    }

    const ImageID = v4().replace(/-/g, "");

    fs.mkdirSync(`userdata/${clientInfo.UID}/images`, {recursive: true});

    const imageURL = `userdata/${clientInfo.UID}/images/${ImageID}.jpg`;
    if(data.type == "Update avatar"){
        sharp(data.data, {limitInputPixels: 50 * 1000 * 1000, failOn: "error"})
            .resize(1024, 1024)
            .toFile(imageURL, (err, info) => {
                if(!err){
                    fs.copyFileSync(imageURL, `userdata/images/${ImageID}.jpg`);
                    sql.midelightDB.query(`UPDATE accounts SET Avatar = ${sql.midelightDB.escape(ImageID)} WHERE UID = ${sql.midelightDB.escape(clientInfo.UID)}`);
                    clientInfo.Avatar = ImageID;
                    callback({success: ImageID});
                }
                else{
                    callback({error: true});
                }
            });
    }
}