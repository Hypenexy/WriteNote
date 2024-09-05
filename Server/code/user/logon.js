const fs = require('fs');
const sql = require("../databases/mysql");
const collection = global.collection;

module.exports = async (socket, UID, notes, weather) => {
    const data = {};

    const userIP = socket.handshake.headers['x-forwarded-for'];

    // Folder and collection checks
    if(!fs.existsSync("userdata/"+UID)){
        fs.mkdirSync("userdata/"+UID);
    }

    if(await collection.countDocuments({_id: UID}, { limit: 1 }) == 0){
        // const insertResult = await
        collection.insertOne({_id : UID, notes : []});
        // log('server', 'user', socket.id, "added an init record", insertResult);
    }

    // Get user details
    const result = await sql.midelightDB.query("SELECT Avatar, Banner, Date, Email, Username FROM accounts WHERE UID="+sql.midelightDB.escape(UID));
    data.user = result[0][0];

    data.usageSize = await notes.getUsageSize(UID);

    data.weather = await weather.getWeather(userIP, UID);

    socket.emit("logon", data);
}