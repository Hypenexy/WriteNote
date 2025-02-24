const fs = require('fs');
const sql = require("../databases/mysql");
const collection = global.collection;

module.exports = async (socket, UID, notes, weather, clientInfo) => {
    const data = {};

    const userIP = socket.handshake.headers['x-forwarded-for'];

    // Folder and collection checks
    if(!fs.existsSync("userdata/"+UID)){
        fs.mkdirSync("userdata/"+UID);
    }

    if(await collection.countDocuments({_id: UID}, { limit: 1 }) == 0){
        // const insertResult = await
        collection.insertOne({_id : UID, notes : {}});
        // console.log("siuccess")
        // log('server', 'user', socket.id, "added an init record", insertResult);
    }

    // Get user details
    const result = await sql.midelightDB.query("SELECT Avatar, Banner, Date, Email, Username FROM accounts WHERE UID="+sql.midelightDB.escape(UID));
    data.user = result[0][0];
    clientInfo.Username = result[0][0].Username;
    if(result[0][0].Avatar){
        clientInfo.Avatar = result[0][0].Avatar;
    }
    if(result[0][0].Banner){
        clientInfo.Banner = result[0][0].Banner;
    }

    data.usageSize = await notes.getUsageSize(UID);

    data.notes = await notes.getNotes(UID);

    data.weather = await weather.getWeather(userIP, UID);

    socket.emit("logon", data);
}