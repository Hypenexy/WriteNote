const fs = require('fs');
const sql = require("../databases/mysql");
const collection = global.collection;

module.exports = async (socket, UID, notes, weather, clientInfo, devices, handshakeData) => {
    const data = {};

    const userIP = socket.handshake.headers['x-forwarded-for'];

    // Folder and collection checks
    if(!fs.existsSync("userdata/"+UID)){
        fs.mkdirSync("userdata/"+UID);
    }

    if(await collection.countDocuments({_id: UID}, { limit: 1 }) == 0){
        // const insertResult = await
        await collection.insertOne({_id : UID, notes : {}});
        // console.log("siuccess")
        // log('server', 'user', socket.id, "added an init record", insertResult);
    }

    // Get user details. The password hash must never be selected here: this object
    // is sent to the browser in full.
    const result = await sql.midelightDB.query("SELECT Avatar, Banner, Date, Email, Username FROM accounts WHERE UID="+sql.midelightDB.escape(UID));
    data.user = result[0][0];

    // Per-account random key the client uses to encrypt its offline note cache.
    // It replaces the old behaviour of using the bcrypt password hash as the key.
    var userDoc = await collection.findOne({_id: UID}, {projection: {cacheKey: true}});
    var cacheKey = userDoc && userDoc.cacheKey;
    if(!cacheKey){
        cacheKey = require("crypto").randomBytes(32).toString("hex");
        await collection.updateOne({_id: UID}, {$set: {cacheKey: cacheKey}});
    }
    data.user.CacheKey = cacheKey;
    clientInfo.Username = result[0][0].Username;
    if(result[0][0].Avatar){
        clientInfo.Avatar = result[0][0].Avatar;
    }
    if(result[0][0].Banner){
        clientInfo.Banner = result[0][0].Banner;
    }

    data.usageSize = await notes.getUsageSize(UID);

    data.notes = await notes.getNotes(UID);
    data.devices = await devices.deviceList.getDevices(UID);
    var deviceInfo;
    try {
        deviceInfo = JSON.parse(handshakeData.device);
    } catch (error) {
        deviceInfo = {}; // missing or malformed device info must not stop the logon
    }
    devices.deviceList.updateDevices(UID, socket, true, userIP, deviceInfo);

    data.weather = await weather.getWeather(userIP, UID);

    socket.emit("logon", data);
}