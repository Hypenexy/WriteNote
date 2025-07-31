function noteContextMenu(NID, element){
    const name = logonData.notes[NID].name;
    if(!logonData.notes[NID].size){
        logonData.notes[NID].size = 0;
    }


    // if(element.classList.contains("selected")){
    //     var allSelectedElements = element.parentElement.querySelectorAll("");
    // }

    const noteContextMenu = contextMenu();

    noteContextMenu.preventRun = (event) => {
        if(element.classList.contains("selected")){
            var allSelectedElements = element.parentElement.querySelectorAll(".selected");
            if(allSelectedElements.length == 1){
                return false;
            }
            var NIDs = [];
            allSelectedElements.forEach(element => {
                NIDs.push(element.getAttribute("nid"));
            });
            
            console.log(NIDs);
            var manyNotesContextMenu = contextMenu();
            manyNotesContextMenu.add("text", `${NIDs.length} ${locale.notes_selected}`);
            
            manyNotesContextMenu.add("button", `${locale.delete} (${NIDs.length})`, {"icon":"delete",
                "action":()=>{binMultipleNotes(NIDs, (success, error)=>{
                    if(success){
                        allSelectedElements.forEach(element => {
                            element.classList.add("delete");
                        });
                    }
                });
            }});

            manyNotesContextMenu.append(null, element);
            event.preventDefault();
            return true;
        }
        return false;
    }

    noteContextMenu.add("input", name); // add rename functions

    noteContextMenu.add("text", locale.actions); // make so that the line can have text alongside it

    noteContextMenu.add("button", locale.share, {"icon":"share", "disabled":true});
    noteContextMenu.add("button", locale.duplicate, {"icon":"content_copy"});
    const deleteBtn = noteContextMenu.add("button", locale.delete, {"icon":"delete", "action":()=>{
        if(logonData.notes[NID].binned == true){
            unbinNote(NID);
            element.remove();
        }
        else{
            binNote(NID, (success, error)=>{
                if(success){
                    element.remove();
                }
            });
        }
    }});

    if(logonData.notes[NID].binned == true){
        deleteBtn.innerHTML = '<i>restore_from_trash</i>' + locale.recover;
    }

    noteContextMenu.add("text", locale.properties);

    const dateCreatedFormatted = `${locale.created} ${moment(logonData.notes[NID].date_created).fromNow()}`;
    noteContextMenu.add("text", dateCreatedFormatted, {
        "icon":"calendar_month",
        "tooltip":moment(logonData.notes[NID].date_created).format()
    });
    
    
    if(logonData.notes[NID].date_opened){
        const dateOpenFormatted = `${locale.opened} ${moment(logonData.notes[NID].date_opened).fromNow()}`;
        noteContextMenu.add("text", dateOpenFormatted, {"icon":"calendar_month", "tooltip":moment(logonData.notes[NID].date_opened).format()});
    }
    if(logonData.notes[NID].date_modified){
        const dateModifiedFormatted = `${locale.modified} ${moment(logonData.notes[NID].date_modified).fromNow()}`;
        noteContextMenu.add("text", dateModifiedFormatted, {"icon":"calendar_month", "tooltip":moment(logonData.notes[NID].date_modified).format()});
    }

    const size = mdutils.humanFileSize(logonData.notes[NID].size);
    noteContextMenu.add("text", size, {"icon":"save"});

    noteContextMenu.attach(element);
}