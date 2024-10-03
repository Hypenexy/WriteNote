const sharp = require('sharp');
const { v4 } = require('uuid');
const fs = require('fs');
const sql = require("../databases/mysql");

module.exports = (data, callback, clientInfo) => {
    const ImageID = v4().replace(/-/g, "");

    if(!fs.existsSync(`userdata/${clientInfo.UID}/images`)){
        fs.mkdirSync(`userdata/${clientInfo.UID}/images`);
    }

    const imageURL = `userdata/${clientInfo.UID}/images/${ImageID}.jpg`;
    if(data.type == "Update avatar"){
        sharp(data.data)
            .resize(1024, 1024)
            .toFile(imageURL, (err, info) => {
                if(!err){
                    fs.copyFileSync(imageURL, `userdata/images/${ImageID}.jpg`);
                    sql.midelightDB.query(`UPDATE accounts SET Avatar = '${ImageID}' WHERE UID = '${clientInfo.UID}'`);
                    clientInfo.Avatar = ImageID;
                    callback({success: ImageID});
                }
                else{
                    callback({error: true});
                }
            });
    }
}