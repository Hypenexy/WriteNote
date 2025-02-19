var mysql = {};
var clientsReference,
    ioReference,
    startDateReference;

module.exports = (midelightDB, writenoteDB, clients, io, startDate) => { // I don't think there's need for passing but leave it as is for example
    mysql.midelightDB = midelightDB;
    mysql.writenoteDB = writenoteDB;
    clientsReference = clients;
    ioReference = io;
    startDateReference = startDate;
}

const uptime = require("./../admin/uptime");
const log = require("./log");
const fs = require('fs');
const historyFileURL = './serverdata/history';

var dir = './serverdata';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

fs.readFile(historyFileURL, 'utf8', (err, data) => {
    if(err){
        return;
    }
    var history = data.split("\n");
    history.pop();
    history.reverse();

    // var index = 0;

    // function setCommand(){
    //     if(index == 0){
    //         rl.setPrompt(""); // save last input
    //         console.log("empty")
    //     }
    //     else{
    //         rl.setPrompt(history[index + 1]);
    //         console.log(history[index + 1]);
    //     }
    // }

    // process.stdin.on('keypress', (chunk, key) => {
    //     if(key){
    //         if(key.name == "up"){
    //             if(history.length < index + 3){
    //                 return;
    //             }
    //             index++;
    //             setCommand();
    //         }
    //         if(key.name == "down"){
    //             if(index <= 0){
    //                 return;
    //             }
    //             index--;
    //             setCommand();
    //         }
    //     }
    // });

    log('s', "Command history loaded (not implemented)");
});

// For now disabled unless implemented correctly
function appendHistory(command){
    // if(command == ""){
    //     return;
    // }
    // fs.appendFile(historyFileURL, `${command}\n`, function (err) {
    //     if (err) throw err;
    // });
}


const colors = {
    blue: "\x1b[34m",
    purple: "\x1b[35m",
    darkGray: "\x1b[90m",
    darkWhite: "\x1b[37m",
    darkYellow: "\x1b[33m",
    reset: "\x1b[0m",
}

const admin = require("./../admin");
const os = require("os");
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function info(){
    console.log();
    console.log(`${colors.blue} WriteNote Server`);
    console.log(`${colors.blue} Version: ${colors.purple}${version.join(".")}`);
    console.log();
    console.log(`${colors.blue} Commands:`)
    console.log(`${colors.purple}Status ${colors.darkWhite}[1] ${colors.darkGray}- Shows stats of server${colors.reset}`);
    console.log(`${colors.purple}Help ${colors.darkGray}- Displays this info${colors.reset}`);
    console.log(`${colors.purple}List ${colors.darkGray}- Displays all connected users${colors.reset}`);
    console.log(`${colors.purple}Update (Username) password (New password) ${colors.darkGray}- Updates a user's password${colors.reset}`);
    console.log(`${colors.purple}Admin list (Page) ${colors.darkGray}- Shows list of administrators${colors.reset}`);
    console.log(`${colors.purple}Admin add (Username) (Key) ${colors.darkGray}- Makes a user an admin with a key${colors.reset}`);
    console.log(`${colors.purple}Admin update (Username) key (Key) ${colors.darkGray}- Updates an admin's key${colors.reset}`);
    console.log(`${colors.purple}Admin remove (Username) ${colors.darkGray}- Revokes admin priveleges from a user${colors.reset}`);
    console.log(`${colors.purple}Setup database ${colors.darkGray}- Creates tables and columns for the mysql database${colors.reset}`);
    console.log(`${colors.purple}Crop weather images ${colors.darkGray}- Compresses and crops images in the "fullResolution" folder${colors.reset}`);
    console.log(`${colors.purple}Lock ${colors.darkWhite}[2] ${colors.darkGray}- Locks this console interface${colors.reset}`);
    console.log(`${colors.purple}Safe exit ${colors.darkWhite}[3] ${colors.darkGray}- Attempts a safe shutdown by warning clients of disconnect${colors.reset}`);
    console.log(`${colors.purple}Exit ${colors.darkWhite}[4] ${colors.darkGray}- Shutsdown server immediately${colors.reset}`);
}
info();

function status(){
    function roundTwoDecibels(number){
        return Math.round((number + Number.EPSILON) * 100) / 100;
    }

    var memoryUsed = process.memoryUsage().heapTotal,
        humanizedMemoryUsed = memoryUsed + " B";
    if(memoryUsed.toString().length > 6){
        humanizedMemoryUsed = roundTwoDecibels(memoryUsed/1000000) + " MB";
    }
    if(memoryUsed.toString().length > 9){
        humanizedMemoryUsed = roundTwoDecibels(memoryUsed/1000000000) + " GB";
    }
    var totalMemory = os.totalmem(),
        humanizedTotalMemory = roundTwoDecibels(os.totalmem()/1000000000) + " GB",
        usagePercentage = memoryUsed / totalMemory * 100,
        humanizedUsagePercentage = roundTwoDecibels(usagePercentage);  
        
    return {
        ram: {
            humanizedMemoryUsed: humanizedMemoryUsed,
            humanizedTotalMemory: humanizedTotalMemory,
            humanizedUsagePercentage: humanizedUsagePercentage,
        }
    }
}

function commandInterface(){
    rl.question("", async function(command) {
        var tLC_command = command.toLowerCase();
        appendHistory(command);
        if(tLC_command == "help" || command == "?"){
            info();
        }
        if(tLC_command == "safe exit"){
            safeShutdown();
        }
        if(tLC_command == "exit" || command == 4){
            rl.close();
        }
        if(tLC_command == "list"){
            for (let i = 0; i < clientsReference.length; i++) {
                const element = clientsReference[i];
                if(element.UID == -1){
                    console.log("Unlogged user");
                    continue;
                }
                console.log(`${element.Username} | UID: ${element.UID}`);
                console.log(element);
            }
        }
        if(tLC_command == "setup database"){
            require("./../databases/setup");
        }
        if(tLC_command == "crop weather images"){
            require("./cropWeatherImages");
        }
        if(tLC_command == "status" || command == 1){
            const stats = status();

            console.log(`${colors.blue}Status`);
            console.log(`${colors.blue}Online users: ${colors.purple}${ioReference.engine.clientsCount}`);
            console.log(`${colors.blue}Memory usage: ${colors.purple}${stats.ram.humanizedMemoryUsed} / ${stats.ram.humanizedTotalMemory} (${stats.ram.humanizedUsagePercentage}%)`);

            var delta = Date.now() - startDateReference;
            var deltaInSeconds = delta / 1000;
            var days = Math.floor(deltaInSeconds / 86400);
            var hours = Math.floor(deltaInSeconds / 3600) % 24;
            var minutes = Math.floor(deltaInSeconds / 60) % 60;
            var seconds = deltaInSeconds % 60;
            

            console.log(`${colors.blue}Uptime: ${colors.purple}${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
            console.log(colors.reset);
        }
        if(tLC_command.startsWith("update")){
            var commandArgs = command.split(" ");
            var execute = true;
            if(commandArgs.length < 3){
                log('f', "Username not set");
                execute = false;
            }
            if(commandArgs.length < 4){
                log('f', "New password not set");
                execute = false;
            }
            if(execute == true){
                var result = await changePassword(commandArgs[2], commandArgs[3]);
                if(result[0].changedRows == 1){
                    log('s', `Successfully updated ${commandArgs[2]}'s password`);
                }
                else{
                    log('f', "Failure changing password");
                    console.log(result);
                }
            }
        }
        
// console.log("\x1b[35mAdmin update (Username) key (Key)\x1b[0m");
// console.log("\x1b[35mAdmin remove (Username)\x1b[0m");
        if(tLC_command.startsWith("admin")){
            var commandArgs = command.split(" ");
            var result;
            switch (commandArgs[1]) {
                case "list":
                    if(commandArgs.length < 2){
                        await admin.adminList(mysql.midelightDB);
                    }
                    else{
                        await admin.adminList(mysql.midelightDB, commandArgs[2]);
                    }
                    break;
                case "add":
                    if(commandArgs.length < 3){
                        log('f', "Username not set");
                        break;
                    }
                    if(commandArgs.length < 4){
                        log('f', "Key not set");
                        break;
                    }
                    result = await admin.addAdmin(mysql.midelightDB, commandArgs[2], commandArgs[3]);
                    if(result == "success"){
                        console.log(`\x1b[32mSuccessfully made ${commandArgs[2]} an admin\x1b[0m`);
                    }
                    break;
                case "update":
                    if(commandArgs.length < 3){
                        log('f', "Username not set");
                        break;
                    }
                    if(commandArgs.length < 5){
                        log('f', "Key not set");
                        break;
                    }
                    result = await admin.updateAdminKey(mysql.midelightDB, commandArgs[2], commandArgs[4]);
                    if(result == "success"){
                        console.log(`\x1b[32mSuccessfully changed ${commandArgs[2]}'s key\x1b[0m`);
                    }
                    break;
                case "remove":
                    if(commandArgs.length < 3){
                        log('f', "Username not set");
                        break;
                    }
                    result = await admin.removeAdmin(mysql.midelightDB, commandArgs[2]);
                    if(result == "success"){
                        console.log(`\x1b[32mSuccessfully revoked ${commandArgs[2]}'s admin priveleges\x1b[0m`);
                    }
                    break;
                default:
                    log('f', "No supplied subcommand for admin");
                    break;
            }
            if(result == "username not found"){
                console.log("\x1b[31mUsername not found\x1b[0m");
            }
            if(result == "username not admin"){
                console.log("\x1b[31mUser not an admin\x1b[0m");
            }
            if(result == "username already admin"){
                console.log("\x1b[31mUser already an admin\x1b[0m");
            }
        }
        commandInterface();
    });
}

commandInterface();

rl.on("close", function(){
    closeServer();
});

async function closeServer(){
    await uptime.endUptime();
    process.exit(0);
}

function safeShutdown(){
    ioReference.emit("serverShutdown");
    setTimeout(() => {
        closeServer();
    }, 1000 * 30);
}