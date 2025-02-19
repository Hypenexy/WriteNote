const openNotes = {};
var activeNID;

function openNotesContain(NID){
    if(openNotes[NID]){
        return true;
    }
    return false;
}

function openNotesPush(NID, note){
    openNotes[NID] = note;
    addHeaderNote(NID, note);
}