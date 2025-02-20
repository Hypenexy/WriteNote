function saveNote(NID){
    if(openNotes[NID].saved == false){
        // changeHeaderNote(NID, {type: "saveChange"});

        // loading mechnaism

        var content;
        if(writenote.workspaceData.save){
            if(activeNID == NID){
                content = writenote.getData();
                if(writenote.workspaceData.save){
                    content.data = writenote.workspaceData.save();
                }
            }
            else{
                content = openNotes[NID].content;
            }
        }
        else{
            if(activeNID == NID){
                content = writenote.getData();
            }
            else{
                content = openNotes[NID].content;
            }
        }
        if(typeof content == "object"){
            content = JSON.stringify(content);
        }

        socket.emit("notes", {
            type: "save",
            NID: NID,
            content: content
        },
        (response) => {
            if(response.success){
                openNotes[NID].saved = true;
                changeHeaderNote(NID, {type: "saveChange"});
            }
        });
    }
}

window.addEventListener("keydown", function(e){
    if(e.ctrlKey && e.code == "KeyS"){
        e.preventDefault();
        saveNote(activeNID);
    }
});

writenote.notearea.addEventListener("input", () => {
    if(openNotes[activeNID].saved == true){
        openNotes[activeNID].saved = false;
        changeHeaderNote(activeNID, {type: "saveChange"});
    }
});