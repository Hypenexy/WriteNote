function removeNoteFromList(NID){
    if(Object.keys(openNotes).includes(NID)){
        var element = noteList.querySelector(`[NID="${NID}"]`);
        addIconHeaderNote(element, "warning", locale.note_in_bin, "error");
    }
    
}

function displayInBin(NID){
    const bin = notesListElement.querySelector(".button.bin .items"),
        thrownPaper = document.createElement("div");
    
    thrownPaper.setAttribute("NID", NID);
    thrownPaper.style.background = "#"+NID;
    bin.appendChild(thrownPaper);
}

function binNote(NID){
    socket.emit("notes", {
        type: "bin",
        NID: NID
    },
    (response) => {
        if(response.status == true){
            removeNoteFromList(NID);
        }
        if(response.error){

        }
    });
}
function deleteMultipleNotes(NIDs){
    socket.emit("notes", {
        type: "binMultiple",
        NIDs: NIDs
    },
    () => {
        if(response.status == true){
            NIDs.forEach(NID => {
                removeNoteFromList(NID);
            });
        }
        if(response.error){

        }
    });
}
