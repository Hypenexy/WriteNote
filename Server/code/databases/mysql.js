const mysql = require('mysql2/promise');
const settings = require('./dbSettings.json');
const log = require('./../interface/log');
var midelightDB;
var writenoteDB;
var onLoadActions = [];

async function SQLConnection(database){
    return await mysql.createConnection({
        host: settings['mysql.hostname'],
        user: settings['mysql.username'],
        password: settings['mysql.password'],
        database: database
    });
}

async function initiateSQLConnection(){
    try {
        midelightDB = await SQLConnection(settings['mysql.database.midelight']);
        await midelightDB.connect();
        writenoteDB = await SQLConnection(settings['mysql.database.writenote']);
        await writenoteDB.connect();
    } catch (error) {
        log("f", "MySQL Databases offline");
        throw error;
    }
    log("s", "MySQL Databases online");
    module.exports.midelightDB = midelightDB;
    module.exports.writenoteDB = writenoteDB;
    for (let i = 0; i < onLoadActions.length; i++) {
        onLoadActions[i]();
    }
}

module.exports.onLoadActions = onLoadActions;

initiateSQLConnection();