const sql = require("./../databases/mysql");

// sql.midelightDB.query(`
//     CREATE TABLE \`usageTime\` (
//         \`SocketID\` varchar(20) DEFAULT NULL,
//         \`UID\` varchar(36) DEFAULT NULL,
//         \`Session\` varchar(36) DEFAULT NULL,
//         \`clientStartDate\` bigint DEFAULT NULL,
//         \`connectDate\` bigint DEFAULT NULL,
//         \`disconnectDate\` bigint DEFAULT NULL
//     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
// `);

function newUsageTime(socketID, UID, Session, clientDate, connectDate, reconnectDate){ // if this slows down performance make it async?
    var escape_sockedID = sql.midelightDB.escape(socketID);
    if(UID == -1){
        UID = '';
    }
    var escape_Session = sql.midelightDB.escape(Session);
    var escape_clientDate = sql.midelightDB.escape(clientDate);
    var escape_connectDate = sql.midelightDB.escape(connectDate);
    var escape_reconnectDate = sql.midelightDB.escape(reconnectDate);
    sql.midelightDB.query(`
        INSERT INTO usageTime (SocketID, UID, Session, clientStartDate, connectDate, reconnectDate)
        VALUES (${escape_sockedID}, '${UID}', ${escape_Session}, ${escape_clientDate}, ${escape_connectDate}, ${escape_reconnectDate})
    `);
}

function endUsageTime(socketID, UID, Session, disconnectDate){
    var escape_sockedID = sql.midelightDB.escape(socketID);
    if(UID == -1){
        UID = '';
    }
    var escape_Session = sql.midelightDB.escape(Session);
    var escape_disconnectDate = sql.midelightDB.escape(disconnectDate);
    sql.midelightDB.query(`
        UPDATE usageTime
        SET disconnectDate = '${disconnectDate}'
        WHERE SocketID = '${socketID}'
        AND UID = '${UID}'
        AND Session = '${Session}'
    `);
}

module.exports.newUsageTime = newUsageTime;

module.exports.endUsageTime = endUsageTime;