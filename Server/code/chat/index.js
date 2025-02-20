const collection = global.chatCollection;
const sql = require("../databases/mysql");

function sendMessage(UID, CID, Body){
    
}

function loadChat(UID){

}

async function sendFriendRequest(data, callback, socket, clientInfo, clientsReference, io){
    if(data.Username == clientInfo.Username){
        callback({error: "You can't friend yourself silly"});
        return;
    }
    if(data.Username.length == 0){
        callback({error: "Empty username"});
        return;
    }
    // .map might be unperformant and memory hogging function (it duplicates array). Check performance with many active users
    const onlineCheck = clientsReference.map(e => e.Username).indexOf(data.Username);
    var toUID;
    if(onlineCheck > -1){
        toUID = clientsReference[onlineCheck].UID;
    }
    else{
        const result = await sql.midelightDB.query("SELECT UID FROM accounts WHERE Username="+sql.midelightDB.escape(data.Username));
        if(result[0].length > 0){
            toUID = result[0][0].UID;
        }
        else{
            callback({error: "Couldn't find username"});
            return;
        }
    }
    
    const date = Date.now();

    var friendCheck = await sql.writenoteDB.query(`
        SELECT COUNT(*) FROM friends
        WHERE Friend1 = '${toUID}' AND Friend2 = '${clientInfo.UID}'
        OR Friend1 = '${clientInfo.UID}' AND Friend2 = '${toUID}'
    `)
    console.log(friendCheck); // test this
    if(friendCheck[0][0]["COUNT(*)"] > 0){
        callback({error: "Already friends"});
        return;
    }

    var result;
    try{
        result = await sql.writenoteDB.query(`
            INSERT INTO friendrequests (\`From\`, \`To\`, \`Date\`)
            VALUES ('${clientInfo.UID}', '${toUID}', '${date}')
        `);
    }
    catch(error){
        if(error.code == "ER_DUP_ENTRY"){
            callback({error: "Already pending"});
            return;
        }
    }

    
    if(onlineCheck > -1){
        io.to(clientsReference[onlineCheck].socketId).emit("chat", {type: "friendRequest", from: clientInfo.Username});
    }

    callback({success: "Sent a request"});
}

async function acceptFriendRequest(data, callback, clientInfo, clientsReference, io){
    const onlineCheckIndex = onlineCheck(data.from, null, clientsReference);
    var acceptedUID = await UsernameToUID(data.from, clientsReference, onlineCheckIndex);

    const result = await sql.writenoteDB.query(`
        DELETE FROM friendrequests
        WHERE \`From\` = '${acceptedUID}'
        AND \`To\` = '${clientInfo.UID}'
    `);

    if(result[0].affectedRows == 0){
        callback({error: "No such friend request found"});
        return;
    }

    const date = Date.now();

    await sql.writenoteDB.query(`INSERT INTO friends VALUES ('${acceptedUID}', '${clientInfo.UID}', ${date})`);

    if(onlineCheckIndex != -1){
        io.to(clientsReference[onlineCheckIndex].socketId).emit("chat", {type: "friendAccepted", from: clientInfo.Username});
    }

    callback({success: "Friend request accepted"});
}

async function cancelFriendRequest(data, callback, clientInfo, clientsReference, io) {
    const onlineCheckIndex = onlineCheck(data.from, null, clientsReference);
    var foreignUID = await UsernameToUID(data.from, clientsReference, onlineCheckIndex);

    var result;

    if(data.self == true){
        result = await sql.writenoteDB.query(`
            DELETE FROM friendrequests
            WHERE \`From\` = '${clientInfo.UID}'
            AND \`To\` = '${foreignUID}'
        `);
    }
    else{
        result = await sql.writenoteDB.query(`
            DELETE FROM friendrequests
            WHERE \`From\` = '${foreignUID}'
            AND \`To\` = '${clientInfo.UID}'
        `);
    }

    if(result[0].affectedRows == 0){
        callback({error: "No such friend request found"});
        return;
    }

    if(onlineCheckIndex != -1){
        io.to(clientsReference[onlineCheckIndex].socketId).emit("chat", {type: "friendCancelled", from: clientInfo.Username});
    }

    callback({success: "Friend request cancelled"});
}

/**
 * Use this to save on pefrormane in functions.
 * @param {*} Username Either fill
 * @param {*} UID or that they are optinal if the other is used
 * @param {*} clientsReference The array of clients online
 * @returns Index of user if he is online, otherwise returns -1
 */
function onlineCheck(Username, UID, clientsReference){
    if(Username){
        return clientsReference.map(e => e.Username).indexOf(Username);
    }
    if(UID){
        return clientsReference.map(e => e.UID).indexOf(UID);
    }
}

/**
 * Get the UID from a Username
 * @param {*} Username Known username
 * @param {*} clientsReference The array of clients online
 * @param {*} onlineCheckIndex If the search was done in a parent function, pass it here to save performance
 * @returns UID of username
 */
async function UsernameToUID(Username, clientsReference, onlineCheckIndex) {
    if(!onlineCheckIndex){
        onlineCheckIndex = onlineCheck(Username, null, clientsReference);
    }
    if(onlineCheckIndex > -1){
        return clientsReference[onlineCheckIndex].UID;
    }
    else{
        var result = await sql.midelightDB.query(`SELECT UID from accounts WHERE Username = '${Username}'`);
        return result[0][0].UID;
    }
}

async function UIDtoUsername(UID, clientsReference, onlineCheckIndex){
    if(!onlineCheckIndex){
        console.log("QJ MI PISHKATA KURVO")
        onlineCheckIndex = onlineCheck(null, UID, clientsReference);
    }
    console.log(onlineCheckIndex);
    if(onlineCheckIndex > -1){
        return clientsReference[onlineCheckIndex].Username;
    }
    else{
        var result = await sql.midelightDB.query(`SELECT Username from accounts WHERE UID = '${UID}'`);
        return result[0][0].Username;
    }
}

async function load(callback, clientInfo, clientsReference){
    const data = new Object;

    data.friends = new Array;
    var friendCheckResult = await sql.writenoteDB.query(`
        SELECT Friend1, Friend2 FROM friends
        WHERE Friend1 = '${clientInfo.UID}' OR Friend2 = '${clientInfo.UID}'
    `);
    var friendCheck = friendCheckResult[0];
    if(friendCheck.length > 0){
        for (let i = 0; i < friendCheck.length; i++) {
            if(friendCheck[i].Friend1 == clientInfo.UID){
                data.friends.push(await UIDtoUsername(friendCheck[i].Friend2, clientsReference));
            }
            else{
                data.friends.push(await UIDtoUsername(friendCheck[i].Friend1, clientsReference));
            }
        }
    }

    data.friendRequests = new Array;

    var friendRequestsResult = await sql.writenoteDB.query(`
        SELECT \`From\` FROM friendrequests
        WHERE \`To\` = '${clientInfo.UID}'
    `);
    
    var friendRequests = friendRequestsResult[0];
    if(friendRequests.length > 0){
        for (let i = 0; i < friendRequests.length; i++) {
            data.friendRequests.push(await UIDtoUsername(friendRequests[i].From, clientsReference));
        }
    }

    // Can't i do this in one query?
    data.friendRequestsOutgoing = new Array;

    var friendRequestsOutgoingResult = await sql.writenoteDB.query(`
        SELECT \`To\` FROM friendrequests
        WHERE \`From\` = '${clientInfo.UID}'
    `);

    console.log(friendRequestsOutgoingResult);
    
    var friendRequestsOutgoing = friendRequestsOutgoingResult[0];
    if(friendRequestsOutgoing.length > 0){
        for (let i = 0; i < friendRequestsOutgoing.length; i++) {
            data.friendRequestsOutgoing.push(await UIDtoUsername(friendRequestsOutgoing[i].To, clientsReference));
        }
    }
    

    callback(data);
}


module.exports = (data, callback, socket, clientInfo, clientsReference, io) => {
    if(data.type == "friendRequest"){
        sendFriendRequest(data, callback, socket, clientInfo, clientsReference, io);
    }
    if(data.type == "friendAccept"){
        acceptFriendRequest(data, callback, clientInfo, clientsReference, io)
    }
    if(data.type == "friendCancel"){
        cancelFriendRequest(data, callback, clientInfo, clientsReference, io)
    }
    if(data.type == "load"){
        load(callback, clientInfo, clientsReference);
    }
};