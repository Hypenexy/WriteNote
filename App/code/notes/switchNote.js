function switchNote(NID){
    if(activeNID){
        openNotes[activeNID].content = writenote.getData();
        if(writenote.workspaceData.save){
            openNotes[activeNID].content.data = writenote.workspaceData.save();
        }
        if(openNotes[NID] && openNotes[NID].content){
            writenote.setData(openNotes[NID].content, openNotes[NID].type);
        }
        // else{ Commenting this line out fixed the issue. It took me around 30 mins to read my own code...
            // writenote.setData("", openNotes[NID].type);
        // }
    }
}