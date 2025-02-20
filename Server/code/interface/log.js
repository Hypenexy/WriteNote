/**
 * Use instead of console.log
 * If the first argument is 's' (for success) it will be green
 * If it's 'f' (for failure) it will be red
 */
function log(){
    if(arguments[0]=="s"){
        arguments[0] = "\x1b[32m%s\x1b[0m";
    }
    if(arguments[0]=="f"){
        arguments[0] = "\x1b[31m%s\x1b[0m";
    }
    if(arguments[0]=="i"){
        arguments[0] = "\x1b[33m%s\x1b[0m";
    }
    if(arguments[0]=="server"){
        arguments[0] = "\x1b[34m\x1b[1mServer:\x1b[0m %s\x1b[0m";
        if(arguments[1]=="user"){
            arguments[1] = "\x1b[35mUser";
            arguments[2] = "\x1b[35m\x1b[1m" + arguments[2] + "\x1b[0m";
        }
    }
    console.log.apply(console, arguments);
}

module.exports = log;