function noteContextMenu(noteData, element){
    const NID = noteData.nid;
    const name = noteData.name;
    if(!noteData.size){
        noteData.size = 0;
    }
    const size = mdutils.humanFileSize(noteData.size);
    const dateOpen = new Date(noteData.date_opened);
    const dateOpenFormatted = dateOpen.toLocaleDateString() + ", " + dateOpen.toLocaleTimeString();
    const dateModified = new Date(noteData.date_modified);
    const dateModifiedFormatted = dateModified.toLocaleDateString() + ", " + dateModified.toLocaleTimeString();
    
    const noteContextMenu = contextMenu();

    noteContextMenu.add("input", name); // add rename functions

    noteContextMenu.add("text", locale.actions); // make so that the line can have text alongside it

    noteContextMenu.add("button", locale.share, {"icon":"share", "disabled":true});
    noteContextMenu.add("button", locale.duplicate, {"icon":"content_copy"});
    noteContextMenu.add("button", locale.delete, {"icon":"delete", "action":()=>{deleteNote(NID, (success, error)=>{
        if(success){
            element.remove();
        }
    });}});

    noteContextMenu.add("text", locale.properties);
    
    noteContextMenu.add("text", dateOpenFormatted, {"icon":"calendar_month"});
    noteContextMenu.add("text", dateModifiedFormatted, {"icon":"calendar_month"});
    noteContextMenu.add("text", size, {"icon":"save"});

    noteContextMenu.attach(element);
}