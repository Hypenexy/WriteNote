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