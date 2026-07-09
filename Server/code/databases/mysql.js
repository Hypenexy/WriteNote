const mysql = require('mysql2/promise');
const settings = require('./dbSettings.json');
const log = require('./../interface/log');
var midelightDB;
var writenoteDB;
var onLoadActions = [];

async function SQLConnection(database){
    async function attemptConnect(){
        log("i", "Connecting to database: " + database);
        return await mysql.createConnection({
            host: settings['mysql.hostname'],
            user: settings['mysql.username'],
            password: settings['mysql.password'],
            database: database
        });
    }
    try {
        return await attemptConnect();
    } catch (error) {
        if(error.code != "ER_BAD_DB_ERROR"){
            log("f", "Mysql undocumented error: ");
            log("f", error.code);
        }
        if(error.code == "ER_BAD_DB_ERROR"){
            log("f", "Database does not exist");
            log("i", "Creating databases");
            var databaseCreationSQL = await mysql.createConnection({
                host: settings['mysql.hostname'],
                user: settings['mysql.username'],
                password: settings['mysql.password'],
                multipleStatements: true
            });
            const result = await databaseCreationSQL.query(`
                CREATE DATABASE IF NOT EXISTS \`${settings['mysql.database.midelight']}\`;
                CREATE DATABASE IF NOT EXISTS \`${settings['mysql.database.writenote']}\`;
            `);
            // log("s", "Databases created, you should now run 'Setup database' command to setup the tables");
            // require("./setup");
            log("s", "Databases created");
            global.databaseCreated = true;
            log("i", "Attempting reconnect");
            return attemptConnect();
            // function (error, results) {
            //     if(error){
            //         log("f", "Could not create databases: ");
            //         console.log(error);
            //         return;
            //     }
            //     log("s", "Databases created, you should now run 'Setup database' command to setup the tables");
            //     return attemptConnect();
            // });
            
        }
    }
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
    await require("./setup")();
    for (let i = 0; i < onLoadActions.length; i++) {
        onLoadActions[i]();
    }
}

module.exports.onLoadActions = onLoadActions;

initiateSQLConnection();