var io;

function updateAdminStats(type, value){
    io.to("admin").emit("stats", {[type]: value});
}


module.exports = (passedIO) => {
    io = passedIO;
    return {"updateAdminStats": updateAdminStats};
}

const si = require('systeminformation');

// si.mem(function(data) {
//     console.log('Memory-Information:');
//     console.log(data);
// });
// si.diskLayout(function(data) {
//     console.log(data);
// })
// si.cpu(function(data) {
//     console.log(data);
// })
// si.cpuCurrentSpeed(function(data) {
//     console.log(data);
// })
// si.cpuCache(function(data) {
//     console.log(data);
// })
// si.cpuTemperature(data => {
//     console.log(data);
// })
// const fs = require("fs");
// si.getAllData(data => {
//     console.log("done");
//     fs.writeFileSync("system info.txt", JSON.stringify(data));
// })

// const { DatabaseSync } = require('node:sqlite');
// const database = new DatabaseSync(':memory:');

// database.exec(`
//   CREATE TABLE tempLogs(
//     date INTEGER PRIMARY KEY,
//     CPU_Temp INTEGER
//   ) STRICT
// `);

// Temperature logging
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("serverdata/temperatureLog.sqlite3");

// db.serialize(() => {
//     db.run(`CREATE TABLE IF NOT EXISTS tmpLogs(
//         date INTEGER,
//         CPU_Tmp INTEGER,
//         CPU_Usg INTEGER
//     )`);

//     function storeGetCPUInfo(){
//         const stmt = db.prepare("INSERT INTO tmpLogs VALUES (?, ?, ?)");
//         si.cpuTemperature((temperature) => {
//             si.currentLoad((load) => {
//                 console.log(temperature);
//                 stmt.run(Date.now(), temperature.main, load.currentLoad);
//                 stmt.finalize();
//             });
//         });
//     }

//     const tmpMeasure = setInterval(() => {
//         storeGetCPUInfo();
//     }, 30000);
// });

// db.each("SELECT * FROM tmpLogs", (err, row) => {
//     console.log(row);
//     // console.log(row.date + ": " + row.CPU_Tmp);
// });

// db.close();