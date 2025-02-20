const log = require("./../interface/log");
const fs = require('fs');

function folderChecks(URL){
    if(!fs.existsSync(URL)){
        fs.mkdirSync(URL);
        log("s", "Created folder " + URL);
    }
}

const userdataDir = "userdata";
folderChecks(userdataDir);

folderChecks(`${userdataDir}/images`);