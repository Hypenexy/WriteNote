// sql.midelightDB.query(`
//     CREATE TABLE \`serverUptime\` (
//         \`LaunchID\` int NOT NULL AUTO_INCREMENT,
//         \`startDate\` bigint DEFAULT NULL,
//         \`exitDate\` bigint DEFAULT NULL,
//         PRIMARY KEY (\`LaunchID\`)
//     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
// `);
const sql = require("./../databases/mysql");

var startDate_stored;

function newUptime(startDate){
    startDate_stored = startDate;
    sql.midelightDB.query(`
        INSERT INTO serverUptime (startDate)
        VALUES ('${startDate}')
    `);
}

async function endUptime(){
    await sql.midelightDB.query(`
        UPDATE serverUptime
        SET exitDate = '${Date.now()}'
        WHERE startDate = '${startDate_stored}'
    `);
}

module.exports.newUptime = newUptime;

module.exports.endUptime = endUptime;