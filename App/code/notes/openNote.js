function openNote(NID, note){
    writenote.initLoad();

    switchNote(NID);
    activeNID = NID;
    if(openNotesContain(NID)){
        return;
    }

    openNotesPush(NID, note);
    
    note.date_opened = Date.now();
    note.saved = true;

    socket.emit("notes", {
        type: "open",
        NID: NID
    },
    response => {
        var enc = new TextDecoder("utf-8");
        var content = enc.decode(response.content);

        if(note.type != "note"){
            content = JSON.parse(content);
        }

        writenote.setData(content, note.type);
        // if(content){
        // }
    });
}

function openMultipleNotes(NIDs){
    writenote.initLoad();

    const lastNID = NIDs[NIDs.length];
    
    switchNote(lastNID);
    activeNID = lastNID;

    var loadedNIDIndexs = [];
    for (let i = 0; i < NIDs.length; i++)
        if(openNotesContain(NIDs[i]))
            loadedNIDIndexs.push(i);

    
    for (var i = loadedNIDIndexs.length -1; i >= 0; i--)
        NIDs.splice(loadedNIDIndexs[i],1);


    // var versions = [];
    // for (let i = 0; i < NIDs.length; i++) {
    //     const element = NIDs[i];
    //     versions.push()
    // }

    // const data = {
    //     NIDs: NIDs,
    //     versions: logonData.notes[element.NID]
    // }

    socket.emit("notes", {
        type: "openMultiple",
        // data: data this may not be the issue
        NIDs: NIDs
    },
    response => {
        for (let i = 0; i < response.length; i++) {
            const element = response[i],
                NID = element.NID,
                note = logonData.notes[NID];
            
            if(element == "success")
                continue;
            
            var enc = new TextDecoder("utf-8");
            var content = enc.decode(element.content);

            if(note.type != "note" && content){
                content = JSON.parse(content);
            }
            
            openNotesPush(NID, note);
            
            note.date_opened = Date.now();
            note.saved = true;

            if(i == response.length - 1){
                writenote.setData(content, note.type);
            }
            else{
                note.content = content;
            }
        }
    });

}