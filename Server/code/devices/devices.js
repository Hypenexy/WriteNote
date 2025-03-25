/**
 * Adding, removing devices from
 * the NoSQL database for the user
 * @param {UID} UID User's ID
 * @param {Socket} socket User's socket
 * @param {Boolean} isAdd Whether we are adding (if true) or removing (false/not set)
 * @param {Int} ipAddress User's IP address
 * @param {Object} deviceInfo Device details 
 */
function updateDevices(UID, socket, isAdd, ipAddress, deviceInfo){
    var device = {IP: ipAddress, device: deviceInfo};
    var deviceID = "devices."+socket.id;
    if(isAdd==true){
        socket.to(UID).emit("devices", {type: "join", content:{id: socket.id, device: device}});

        global.collection.updateOne(
            {_id: UID},
            { $set: { [deviceID] : device} }
        );
    }
    else{
        socket.to(UID).emit("devices", {type: "leave", content:socket.id});

        collection.updateOne(
            {_id: UID},
            { $unset: {[deviceID] : { $exists : true }} }
        );
    }
}

module.exports.updateDevices = updateDevices;

/**
 * Used to get the user's notes as a list.
 * @param {Int} UID User ID
 * @returns the user's notes
 */
async function getDevices(UID){
    const projection = {devices: true, _id: false};
    const cursor = await global.collection.find({_id: UID}).project(projection);
    const result = await cursor.toArray();

    return result[0].devices;
}

module.exports.getDevices = getDevices;

/**
 * Opens a note on another device the user has online.
 * @param {UID} UID User's ID
 * @param {Data} data Data from client
 * @param {Socket} socket User's socket
 * @param {Array} clientsReference All clients connected
 */
function openOn(UID, data, socket, clientsReference){
    const deviceBelongsToUser = clientsReference.find(item => item.UID === UID && item.socketId === data.DID);
    if(deviceBelongsToUser){
        socket.to(data.DID).emit("devices", {type: "openOn", NID: data.NID});
    }
}

module.exports.openOn = openOn;


function updateNote(UID, NID, socket, isJoin){
    var deviceIDopenNote = "devices."+socket.id+".openNotes."+NID;
    if(isJoin==true){
        socket.to(UID).emit("devices", {type: "open", data:{id: socket.id, NID: NID}});

        global.collection.updateOne(
            {_id: UID},
            { $set: { [deviceIDopenNote] : true} }
        );
    }
    else{
        socket.to(UID).emit("devices", {type: "close", data:{id: socket.id, NID: NID}});

        collection.updateOne(
            {_id: UID},
            { $unset: {[deviceIDopenNote] : { $exists : true }} }
        );
    }
}

module.exports.updateNote = updateNote;

