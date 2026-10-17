const collection = global.chatCollection;
const sql = require("../databases/mysql");

// Every value that ends up in a query goes through escape(), including values that
// came from the database or from the session. Never put raw text inside quotes.
const esc = (value) => sql.midelightDB.escape(value);

// Usernames are at most 30 characters (see account registration).
const isUsername = (value) => typeof value == "string" && value.length > 0 && value.length <= 30;

function sendMessage(UID, CID, Body){
    
}

function loadChat(UID){

}

async function sendFriendRequest(data, callback, socket, clientInfo, clientsReference, io){
    if(typeof data.Username != "string"){
        callback({error: "Empty username"});
        return;
    }
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
        WHERE Friend1 = ${esc(toUID)} AND Friend2 = ${esc(clientInfo.UID)}
        OR Friend1 = ${esc(clientInfo.UID)} AND Friend2 = ${esc(toUID)}
    `)
    if(friendCheck[0][0]["COUNT(*)"] > 0){
        callback({error: "Already friends"});
        return;
    }

    var result;
    try{
        result = await sql.writenoteDB.query(`
            INSERT INTO friendrequests (\`From\`, \`To\`, \`Date\`)
            VALUES (${esc(clientInfo.UID)}, ${esc(toUID)}, ${esc(date)})
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
    if(!isUsername(data.from)){
        callback({error: "No such friend request found"});
        return;
    }
    const onlineCheckIndex = onlineCheck(data.from, null, clientsReference);
    var acceptedUID = await UsernameToUID(data.from, clientsReference, onlineCheckIndex);
    if(!acceptedUID){
        callback({error: "No such friend request found"});
        return;
    }

    const result = await sql.writenoteDB.query(`
        DELETE FROM friendrequests
        WHERE \`From\` = ${esc(acceptedUID)}
        AND \`To\` = ${esc(clientInfo.UID)}
    `);

    if(result[0].affectedRows == 0){
        callback({error: "No such friend request found"});
        return;
    }

    const date = Date.now();

    await sql.writenoteDB.query(`INSERT INTO friends VALUES (${esc(acceptedUID)}, ${esc(clientInfo.UID)}, ${esc(date)})`);

    if(onlineCheckIndex != -1){
        io.to(clientsReference[onlineCheckIndex].socketId).emit("chat", {type: "friendAccepted", from: clientInfo.Username});
    }

    callback({success: "Friend request accepted"});
}

async function cancelFriendRequest(data, callback, clientInfo, clientsReference, io) {
    if(!isUsername(data.from)){
        callback({error: "No such friend request found"});
        return;
    }
    const onlineCheckIndex = onlineCheck(data.from, null, clientsReference);
    var foreignUID = await UsernameToUID(data.from, clientsReference, onlineCheckIndex);
    if(!foreignUID){
        callback({error: "No such friend request found"});
        return;
    }

    var result;

    if(data.self == true){
        result = await sql.writenoteDB.query(`
            DELETE FROM friendrequests
            WHERE \`From\` = ${esc(clientInfo.UID)}
            AND \`To\` = ${esc(foreignUID)}
        `);
    }
    else{
        result = await sql.writenoteDB.query(`
            DELETE FROM friendrequests
            WHERE \`From\` = ${esc(foreignUID)}
            AND \`To\` = ${esc(clientInfo.UID)}
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
        // Username comes straight from the client: it MUST be escaped (it used to be
        // pasted into the query, which allowed SQL injection).
        var result = await sql.midelightDB.query("SELECT UID from accounts WHERE Username = " + esc(Username));
        if(result[0].length == 0){
            return undefined; // unknown user
        }
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
        var result = await sql.midelightDB.query("SELECT Username from accounts WHERE UID = " + esc(UID));
        if(result[0].length == 0){
            return "[deleted user]";
        }
        return result[0][0].Username;
    }
}

async function load(callback, clientInfo, clientsReference){
    const data = new Object;

    data.friends = new Array;
    var friendCheckResult = await sql.writenoteDB.query(`
        SELECT Friend1, Friend2 FROM friends
        WHERE Friend1 = ${esc(clientInfo.UID)} OR Friend2 = ${esc(clientInfo.UID)}
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
        WHERE \`To\` = ${esc(clientInfo.UID)}
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
        WHERE \`From\` = ${esc(clientInfo.UID)}
    `);

    
    var friendRequestsOutgoing = friendRequestsOutgoingResult[0];
    if(friendRequestsOutgoing.length > 0){
        for (let i = 0; i < friendRequestsOutgoing.length; i++) {
            data.friendRequestsOutgoing.push(await UIDtoUsername(friendRequestsOutgoing[i].To, clientsReference));
        }
    }
    

    callback(data);
}


module.exports = (data, callback, socket, clientInfo, clientsReference, io) => {
    // Handlers are async: an error thrown inside one is an unhandled promise rejection,
    // which stops the whole server on modern Node. Catch it per request instead.
    const guarded = (fn, ...args) => {
        Promise.resolve()
            .then(() => fn(...args))
            .catch((error) => {
                console.error("chat protocol error:", error);
                try { callback({error: "Internal server error"}); } catch(e) {}
            });
    };
    if(data.type == "friendRequest"){
        guarded(sendFriendRequest, data, callback, socket, clientInfo, clientsReference, io);
    }
    if(data.type == "friendAccept"){
        guarded(acceptFriendRequest, data, callback, clientInfo, clientsReference, io);
    }
    if(data.type == "friendCancel"){
        guarded(cancelFriendRequest, data, callback, clientInfo, clientsReference, io);
    }
    if(data.type == "load"){
        guarded(load, callback, clientInfo, clientsReference);
    }
};
