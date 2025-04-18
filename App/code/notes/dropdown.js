function noteContextMenu(noteData, element){
    const NID = noteData.nid;
    const name = noteData.name;
    if(!noteData.size){
        noteData.size = 0;
    }


    // if(element.classList.contains("selected")){
    //     var allSelectedElements = element.parentElement.querySelectorAll("");
    // }

    const noteContextMenu = contextMenu();

    noteContextMenu.preventRun = () => {
        if(element.classList.contains("selected")){
            var allSelectedElements = element.parentElement.querySelectorAll(".selected");
            var NIDs = [];
            allSelectedElements.forEach(element => {
                NIDs.push(element.getAttribute("NID"));
            });
            
            console.log(NIDs);
            var manyNotesContextMenu = contextMenu();
            return true;
        }
        return false;
    }

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

    const dateCreatedFormatted = `${locale.created} ${moment(noteData.date_created).fromNow()}`;
    noteContextMenu.add("text", dateCreatedFormatted, {
        "icon":"calendar_month",
        "tooltip":moment(noteData.date_created).format()
    });
    
    
    if(noteData.date_opened){
        const dateOpenFormatted = `${locale.opened} ${moment(noteData.date_opened).fromNow()}`;
        noteContextMenu.add("text", dateOpenFormatted, {"icon":"calendar_month", "tooltip":moment(noteData.date_opened).format()});
    }
    if(noteData.date_modified){
        const dateModifiedFormatted = `${locale.modified} ${moment(noteData.date_modified).fromNow()}`;
        noteContextMenu.add("text", dateModifiedFormatted, {"icon":"calendar_month", "tooltip":moment(noteData.date_modified).format()});
    }

    const size = mdutils.humanFileSize(noteData.size);
    noteContextMenu.add("text", size, {"icon":"save"});

    noteContextMenu.attach(element);
}