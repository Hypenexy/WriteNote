socket.on("notesInfo", (response) => {
    console.log(response);
    if(response.type == "createdNote"){
        addToNoteList(response.data);
    }
});

function unloadPage(){
    var unsaved = false;
    var openNIDs = Object.keys(openNotes);
    for (let i = 0; i < openNIDs.length; i++) {
        if(openNotes[openNIDs[i]].saved == false)
            unsaved = true;
    }
    if(unsaved){
        return "Unsaved notes!";
    }
}
        
window.onbeforeunload = unloadPage;