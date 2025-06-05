function removeNoteFromList(NID){
    logonData.notes[NID].binned = true;
    displayInBin(NID);
    if(Object.keys(openNotes).includes(NID)){
        var element = noteList.querySelector(`[NID="${NID}"]`);
        addIconHeaderNote(element, "warning", locale.note_in_bin, "error");
    }
    
    var element = notesListElement.querySelector(`[NID="${NID}"]`);
    element.classList.add("delete");
    element.onanimationend = () => {
        element.remove();
    };
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
function binMultipleNotes(NIDs){
    socket.emit("notes", {
        type: "binMultiple",
        NIDs: NIDs
    },
    (response) => {
        if(response.status == true){
            NIDs.forEach(NID => {
                removeNoteFromList(NID);
            });
        }
        if(response.error){

        }
    });
}

function unbinNote(NID){
    socket.emit("notes", {
        type: "unbin",
        NID: NID
    },
    (response) => {
        if(response.status == true){
            // removeNoteFromList(NID);
        }
        if(response.error){

        }
    });
}
function unbinMultipleNotes(NIDs){
    socket.emit("notes", {
        type: "unbinMultiple",
        NIDs: NIDs
    },
    (response) => {
        if(response.status == true){
            NIDs.forEach(NID => {
                removeNoteFromList(NID);
            });
        }
        if(response.error){

        }
    });
}
