function openFolder(NID, isBackwards){
    if(isBackwards){
        notesListElement.classList.add("folderIn");
    }
    else{
        notesListElement.classList.add("folderOut");
    }
    notesListElement.onanimationend = () => {
        const folderElement = mdutils.createAppendElement("notesListContainer", notesListElement.parentElement);
        createNotesListElement_inFolder(folderElement, NID);
        notesListElement.remove();
        if(isBackwards){
            folderElement.classList.add("folderOut");
        }
        else{
            folderElement.classList.add("folderIn");
        }
        var folderNotes = [];
        
        var NIDs = Object.keys(logonData.notes);

        if(NID == "bin"){
            folderElement.classList.add("binFolder");
            for (let i = 0; i < NIDs.length; i++) {
                if(logonData.notes[NIDs[i]].binned == true){
                    folderNotes.push(NIDs[i]);
                }
            }
        }
        else{
            for (let i = 0; i < NIDs.length; i++) {
                if(logonData.notes[NIDs[i]].folder == NID){
                    folderNotes.push(NIDs[i]);
                }
            }
        }

        for (let i = 0; i < folderNotes.length; i++) {
            console.log(logonData.notes[folderNotes[i]], folderNotes[i], folderElement)
            createNoteElement(logonData.notes[folderNotes[i]], folderNotes[i], folderElement);
            
        }
        console.log(folderNotes);
    }
}
function createNotesListElement_inFolder(folderElement, folderNID){
    const element = folderElement;
    element.innerHTML = "";

    const filtersAndSuch = mdutils.createAppendElement("top", element);
    topElement(filtersAndSuch);

    const listElement = mdutils.createAppendElement("notesList", element);
    element.updateList = () => {
        listElement.innerHTML = "";
        var NIDs = Object.keys(logonData.notes);
        var notesArray = [];
        for (let i = 0; i < NIDs.length; i++) {
            notesArray.push({data: logonData.notes[NIDs[i]], NID: NIDs[i]});
        }

        function undefinedCheck(a, b){
            if(typeof a == "undefined" && typeof b == "undefined"){
                return 0;
            }
            if(typeof a == "undefined"){
                return 1;
            }
            if(typeof b == "undefined"){
                return -1;
            }
        }

        var currentView = "grid";
        if(settings.noteslist && settings.noteslist.view){
            currentView = settings.noteslist.view;
        }
        if(currentView == "grid"){
            if(element.classList.contains("list")){
                element.classList.remove("list");
            }
        }
        else if(currentView == "list"){
            element.classList.add("list");
        }
        
        var currentSort = sortsInfo.sorts[0];
        if(settings.noteslist && settings.noteslist.sort){
            currentSort = settings.noteslist.sort;
        }
        if(currentSort == sortsInfo.sorts[0]){
            notesArray.sort(function(a, b){
                var check = undefinedCheck(a.data.date_modified, b.data.date_modified);
                if(check != 0){
                    return check;
                }
                return b.data.date_modified - a.data.date_modified;
            });
        }
        if(currentSort == "opened_date"){
            notesArray.sort(function(a, b){
                var check = undefinedCheck(a.data.date_opened, b.data.date_opened);
                if(check != 0){
                    return check;
                }
                return b.data.date_opened - a.data.date_opened;
            });
        }
        if(currentSort == "created_date"){
            notesArray.sort(function(a, b){
                return b.data.date_created - a.data.date_created;
            });
        }
        if(currentSort == "alphabetically"){
            notesArray.sort(function(a, b){
                if(a.data.name < b.data.name) { return -1; }
                if(a.data.name > b.data.name) { return 1; }
                return 0;
            })
        }
        if(currentSort == "size"){
            notesArray.sort(function(a, b){
                var check = undefinedCheck(a.data.size, b.data.size);
                if(check != 0){
                    return check;
                }
                return b.data.size - a.data.size;
            });
        }
        if(currentSort == "type"){
            notesArray.sort(function(a, b){
                if(a.data.type < b.data.type) { return -1; }
                if(a.data.type > b.data.type) { return 1; }
                return 0;
            });
        }

        if(settings.noteslist && settings.noteslist.reversed){
            notesArray.reverse();
        }
        
        if(settings.noteslist && !settings.noteslist.noFolderPriority){
            notesArray.sort(function(a, b){
                if(a.data.type == "folder" && b.data.type != "folder") { return -1; }
                if(a.data.type != "folder" && b.data.type == "folder") { return 1; } // This second line isn't really needed.
                return 0;
            });
        }
    
        for (let i = 0; i < notesArray.length; i++) {
            const data = logonData.notes[notesArray[i].NID];
            createNoteElement(data, notesArray[i].NID);
        }

        listElement.appendChild(createNewButton(folderNID));

        createDragSelector(element, "[nid]", {dragContainer: element});
    }

    element.updateList();



    return element;
}