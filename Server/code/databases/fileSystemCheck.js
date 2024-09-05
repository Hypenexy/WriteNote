const log = require("./../interface/log");
const fs = require('fs');

const userdataDir = "userdata";
if(!fs.existsSync(userdataDir)){
    fs.mkdirSync(userdataDir);
    log("s", "Created folder " + userdataDir);
}