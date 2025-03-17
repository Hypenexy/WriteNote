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

    var hash = localStorage.getItem(NID),
        offlineLoad = false;

    if(hash){
        offlineLoad = true;
        var encryptedData = localStorage.getItem(hash);
        var decryptedData = CryptoJS.AES.decrypt(encryptedData, logonData.user.Password);
        var content = decryptedData.toString(CryptoJS.enc.Utf8);
        if(note.type != "note" && content){
            content = JSON.parse(content);
        }
        writenote.setData(content, note.type);
    }

    socket.emit("notes", {
        type: "open",
        NID: NID,
        offlineLoad: offlineLoad
    },
    response => {
        if(response == "success offline"){
            return;
        }
        var enc = new TextDecoder("utf-8");
        var content = enc.decode(response.content);

        if(note.type != "note" && content){
            content = JSON.parse(content);
        }

        writenote.setData(content, note.type);
    });
}

function openMultipleNotes(NIDs){
    writenote.initLoad();

    var loadedNIDIndexs = [];
    for (let i = 0; i < NIDs.length; i++)
        if(openNotesContain(NIDs[i]))
            loadedNIDIndexs.push(i);

    
    for (var i = loadedNIDIndexs.length -1; i >= 0; i--)
        NIDs.splice(loadedNIDIndexs[i],1);

    const lastNID = NIDs[NIDs.length - 1];

    if(NIDs.length == 0){
        return;
    }
    switchNote(lastNID);
    activeNID = lastNID;

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
            if(!content){
                content = "<p><br></p>";
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