const { readdir, stat } = require('fs/promises');
const { v4 } = require("uuid");
const fs = require("fs");

/**
 * Gets the user's notes as a list.
 * @param {Int} UID User ID
 * @returns the user's notes
 */
async function getNotes(UID){
    const projection = {notes: true, _id: false};
    const cursor = await global.collection.find({_id: UID}).project(projection);
    const result = await cursor.toArray();
    
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
            callback(null, "Name is invalid format");
            return;
        }

        // This was used to check if folder exists
        // var notes = await getNotes();
        // notes = notes.toString().slice(1, notes.length-1);
        // notes = JSON.parse(notes);
        // log('f', notes);
    }
    if(!["note", "folder", "web app", "presentation"].includes(options.type)){
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

module.exports.protocol = (data, callback, socket, clientInfo, clientsReference, io) => {
    if(data.type == "createNote"){
        createNote(clientInfo.UID, data.options, callback, socket);
    }
}