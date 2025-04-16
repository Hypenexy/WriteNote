const { readdir, stat } = require('fs/promises');
const { v4 } = require("uuid");
const fs = require("fs");
// const socketStream = require("socket.io-stream");
const gitDiff = require('git-diff');
const { convert } = require('html-to-text');
const { createHash } = require('crypto');

/**
 * Gets the user's notes as a list.
 * @param {Int} UID User ID
 * @returns the user's notes
 */
async function getNotes(UID){
    const projection = {notes: true, _id: false};
    const cursor = await global.collection.find({_id: UID}).project(projection);
    const result = await cursor.toArray();
    
//     return result[0].notes; problem when signing in for the first time? or just this case where I probably deleted the record of mongodb?
//     ^

// TypeError: Cannot read properties of undefined (reading 'notes')
// at Object.getNotes (C:\Users\Hypenexy\WriteNote-New\Server\code\user\notes.js:19:22)
// at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
// at async module.exports (C:\Users\Hypenexy\WriteNote-New\Server\code\user\logon.js:35:18)
    return result[0].notes;
}

module.exports.getNotes = getNotes;


const path = require('path'); // CACHE THIS RIGHT HERE BELOW!

const dirSize = async directory => {
    const files = await readdir( directory );
    const stats = files.map( file => stat( path.join( directory, file ) ) );
  
    return ( await Promise.all( stats ) ).reduce( ( accumulator, { size } ) => accumulator + size, 0 );
}

/**
 * To get the user's size, storage usage.
 * @param {*} UID User ID
 * @returns a number in bytes or bits idk
 */
async function getUsageSize(UID){
    const userDir = `userdata/${UID}`;
    var size = await dirSize(userDir);
    if(!size){
        size = "empty"; // get cache first then run this shite
    }
    return size;
}

module.exports.getUsageSize = getUsageSize;

function updateNoteProperty(UID, NID, property, value) {
    global.collection.updateOne(
        { _id: UID, [`notes.${NID}`]: {$exists: true} },
        {
            $set: {
                [`notes.${NID}.${property}`]: value
            }
        }
    );
}
function deleteNoteProperty(UID, NID, property) {
    global.collection.updateOne(
        { _id: UID, [`notes.${NID}`]: {$exists: true} },
        {
            $unset: {
                [`notes.${NID}.${property}`]: { $exists : true }
            }
        }
    );
}


async function createNote(UID, options, callback, socket){
    // I got 55c600, 72ad03, 348612, d5acfb, 27b8a5, 479d01, 2bf7cf
    // always some green colors (and pink) in a hex color picker!
    if(typeof options.type != "string" || options.type.length > 40){
        callback(null, "Invalid project type");
        return;
    }
    if(typeof options.name != "string"){
        callback(null, "Name is invalid format");
        return;
    }
    if(!options.name){
        callback(null, "Name is not set");
        return;
    }
    if(options.name.length > 50){
        callback(null, "Name is too long");
        return;
    }
    if(!options.name.length > 0){
        callback(null, "Name is nonexistent");
        return;
    }
    options.name = options.name.trim();
    options.type = options.type.toLowerCase();
    if(options.parent){
        if(typeof options.parent != "string" || options.parent.length != 6){
            // maybe check if folder exists
            callback(null, "Parent is invalid format");
            return;
        }

        // This was used to check if folder exists
        // var notes = await getNotes();
        // notes = notes.toString().slice(1, notes.length-1);
        // notes = JSON.parse(notes);
        // log('f', notes);
    }
    if(!["note", "folder", "web app", "presentation", "canvas"].includes(options.type)){
        callback(null, "Type is invalid");
        return;
    }

    const NID = v4().slice(0, 6);
    const dateNow = Date.now();
    var note = {
        // [NID]:{
            "name": options.name,
            "type": options.type,
            "date_created": dateNow
        // }
    }
    
    const noteDir = `userdata/${UID}/${NID}`;
    if(!fs.existsSync(noteDir)){
        fs.mkdirSync(noteDir);
    }

    var notesNID = "notes."+NID;
    const insertResult = await global.collection.updateOne(
        {
            _id: UID,
            notes: { $not: { $elemMatch: { [NID]: { $exists: true } } } }
        },
        {
            $set: { [notesNID] : note }
        }
    );
    if(insertResult.matchedCount==0){
        if(!options.nidattempt){
            options.nidattempt = 1;
            createNote(UID, options, callback, socket);
        }
        else{
            callback(null, "Internal server error or you got really really lucky, 1 in (33 554 432 - number of notes * 2) chance to get this."); // isn't number of notes multiplied by 2? It is yeah.
        }
        return;
    }
    socket.broadcast.to(UID).emit('notesInfo', {type: "createdNote", data: {NID: NID, note: note}});
    // log('server', 'user', "socketid unset", "created a note", insertResult);
    callback({NID: NID, note: note});
}

async function getNoteRecord(UID, NID) {
    const notesNID = "notes."+NID;
    const projection = {[notesNID]: true, _id: false};
    const cursor = await collection.find({
        _id: UID,
        [notesNID]: { $exists: true }
    }).project(projection);
    
    return await cursor.toArray()//.notes[NID];
}

const devices = require("./../devices/devices");
async function openNote(UID, data, callback, socket){
    const result = getNoteRecord(UID, data.NID);

    if(!result.toString().length > 0){
        callback({error: "Not found"});
        return;
    }
    updateNoteProperty(UID, data.NID, "date_opened", Date.now());

    // activeNIDs.push(NID);
    // activeNID = NID;
    socket.join(data.NID);
    devices.updateNote(UID, data.NID, socket, true);

    // socket.broadcast.to(UID).emit('notesInfo', {type: "opened", NID: data.NID});

    if(data.offlineLoad == true){
        callback("success offline");
        return;
    }

    const noteDir = `userdata/${UID}/${data.NID}`;
    const noteDirIndex = `${noteDir}/${(data.version) ? data.version : "0"}`;
    
    if(fs.existsSync(noteDirIndex)){
        // var fileStats = fs.statSync(noteDirIndex);
        // callback({size: fileStats.size});
        var readFile = fs.readFileSync(noteDirIndex);
        // var enc = new TextDecoder("utf-8");
        // readFile = enc.decode(readFile);
        callback({content: readFile});
    }
    else{
        callback({error: "Note empty"});
    }

    callback("success");
}

function closeNote(UID, Data, socket){
    socket.leave(Data.NID);
    devices.updateNote(UID, Data.NID, socket);
    // socket.broadcast.to(UID).emit('notesInfo', {type: "closed", NID: NID});
}

async function openMultipleNotes(UID, data, callback, socket){
    var contents = [];
    for (let i = 0; i < data.NIDs.length; i++) {
        const NID = data.NIDs[i];
        openNote(UID, {NID: NID}, (response) => {
            response.NID = NID;
            contents.push(response);
            if(i == data.NIDs.length - 1){
                callback(contents);
            }
        }, socket);
    }
}

// A concept that didn't work at this moment
// function streamNote(UID, data, callback, socket) {
//     const noteDir = `userdata/${UID}/${data.NID}`;
//     const noteDirIndex = `${noteDir}/${(data.version) ? data.version : "0"}`;
//     if(fs.existsSync(noteDirIndex)){
//         var fileStats = fs.statSync(noteDirIndex);
//         callback({size: fileStats.size});
//         // response = [fs.readFileSync(noteDirIndex)];
//         // var enc = new TextDecoder("utf-8");
//         // response[0] = enc.decode(response[0]);
//         var fileStream = fs.createReadStream(noteDirIndex);


//         data.stream.pipe(fileStream);
//     }
//     else{
//         callback({error: "Note empty"});
//     }
// }

async function saveNote(UID, data, callback, socket) {
    const result = await getNoteRecord(UID, data.NID);
    if(!result.toString().length > 0){
        callback({error: "Not found"});
        return;
    }
    var noteData = result[0].notes[data.NID];

    var newVersion = "1.0";
    if(noteData.v){
        newVersion = noteData.v;
        newVersion = newVersion.split('.');
        if(data.trigger == "autosave"){
            newVersion[1]++;
        }
        else{
            newVersion[0]++;
        }
        newVersion = newVersion.join('.');
    }

    const noteDir = `userdata/${UID}/${data.NID}`;
    const noteDirIndex = `${noteDir}/0`;

    if(noteData.v){
        const noteDirVersion = `${noteDir}/${noteData.v}`;
        var enc = new TextDecoder("utf-8");
        const lastContent = enc.decode(fs.readFileSync(noteDirIndex));
        const verDiff = gitDiff(lastContent, data.content);
        if(typeof verDiff == "undefined"){
            callback(null, "Same content");
            return;
        }
        fs.writeFileSync(noteDirVersion, verDiff);
    }

    fs.writeFileSync(noteDirIndex, data.content);

    const size = await dirSize(noteDir);
    var summary = convert(data.content.slice(0, 30)).slice(0, 20);
    const dateNow = Date.now();

    // Create a hash
    var noteHash = createHash('sha256').update(data.content).digest('hex');

    const updateResult = await collection.updateOne(
        { _id: UID, [`notes.${data.NID}`]: {$exists: true} },
        {
            $set: {
                [`notes.${data.NID}.date_modified`]: dateNow,
                [`notes.${data.NID}.size`]: size,
                [`notes.${data.NID}.v`]: newVersion,
                [`notes.${data.NID}.summary`]: summary,
                [`notes.${data.NID}.hash`]: noteHash
            } 
        }
    );

    if(updateResult.modifiedCount == 1){
        callback({success:true});
    }
    else{
        callback({error: true});
    }
}

async function binNote(UID, data, callback, socket) {
    updateNoteProperty(UID, data.NID, "binned", true);
    callback({status: true});
}
async function binMultipleNotes(UID, data, callback, socket) {
    data[NIDs].forEach(NID => {
        updateNoteProperty(UID, NID, "binned", true);
    });
    callback({status: true});
}

async function unbinNote(UID, data, callback, socket) {
    deleteNoteProperty(UID, data.NID, "binned");
    callback({status: true});
}
async function unbinMultipleNotes(UID, data, callback, socket) {
    data[NIDs].forEach(NID => {
        deleteNoteProperty(UID, NID, "binned");
    });
    callback({status: true});
}

module.exports.protocol = (data, callback, socket, clientInfo, clientsReference, io) => {
    if(data.type == "createNote"){
        createNote(clientInfo.UID, data.options, callback, socket);
    }
    if(data.type == "open"){
        openNote(clientInfo.UID, data, callback, socket);
    }
    if(data.type == "openMultiple"){
        openMultipleNotes(clientInfo.UID, data, callback, socket);
    }
    if(data.type == "save"){
        saveNote(clientInfo.UID, data, callback, socket);
    }
    if(data.type == "close"){
        closeNote(clientInfo.UID, data, socket);
    }
    if(data.type == "bin"){
        binNote(clientInfo.UID, data, callback, socket);
    }
    if(data.type == "binMultiple"){
        binMultipleNotes(clientInfo.UID, data, callback, socket);
    }
}

// module.exports.stream = (data, callback, socket, clientInfo) => {
//     if(data.type == "read"){
//         streamNote(clientInfo.UID, data, callback, socket);
//     }
// }