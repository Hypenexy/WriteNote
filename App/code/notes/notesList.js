// const notesList = {}; using logonData.notes instead
const notesListElement = document.createElement("div");
notesListElement.classList.add("notesListContainer");

const notesListContextMenu = contextMenu();

notesListContextMenu.add("button", locale.select_all, {
    "icon": "select_all",
    "action": createFolder
});
notesListContextMenu.add("button", locale.new_folder, {"icon": "folder"});


function createNotesListElement(){
    // const element = document.createElement("div");
    const element = notesListElement;
    element.innerHTML = "";

    const filtersAndSuch = mdutils.createAppendElement("top", element);
    topElement(filtersAndSuch);

    const listElement = mdutils.createAppendElement("notesList", element);
    notesListElement.updateList = () => {
        listElement.innerHTML = "";
        var NIDs = Object.keys(logonData.notes);
        var notesArray = [];
        for (let i = 0; i < NIDs.length; i++) {
            notesArray.push({data: logonData.notes[NIDs[i]], NID: NIDs[i]});
        }

        function undefinedCheck(a, b){ // This is still not a fix!
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
            if(notesListElement.classList.contains("list")){
                notesListElement.classList.remove("list");
            }
        }
        else if(currentView == "list"){
            notesListElement.classList.add("list");
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
            createNoteElement(data, notesArray[i].NID, listElement);
        }

        listElement.appendChild(createNewButton());

        // createDragSelector(listElement, "[nid]"); // Scroll is broken anyways
        createDragSelector(element, "[nid]", {dragContainer: element}); // scroll doesnt work at all here
        // const ds = new DragSelect({
        //     selectables: element.querySelectorAll("[nid]"),
        //     area: element
        // });
        
        // ds.subscribe("DS:end", (e) => {
        //     console.log(e);
        // });
    }

    element.updateList();



    return element;
}

const sortsInfo = {
    sorts: [
        "modified_date",
        "opened_date",
        "created_date",
        "alphabetically",
        "size",
        "type",
    ],
    icons: [
        "calendar_month",
        "calendar_month",
        "calendar_month",
        "abc",
        "save",
        "note",
    ]
};

function topElement(element){
    // Sort options

    const sortButton = mdutils.createAppendElement("button", element);
    sortButton.classList.add("i", "sort");
    
    function setSort(sort, option, optionValue){
        if(!settings.noteslist){
            settings.noteslist = {};
        }
        if(sort){
            if(sort == sortsInfo.sorts[0]){
                delete settings.noteslist.sort;
            }
            else{
                settings.noteslist.sort = sort;
            }
            notesListElement.updateList();
        }
        if(option){
            if(optionValue == true){
                settings.noteslist[option] = true;
            }
            else{
                delete settings.noteslist[option];
            }
            notesListElement.updateList();
        }

        var currentSort = sortsInfo.sorts[0];
        if(settings.noteslist && settings.noteslist.sort){
            currentSort = settings.noteslist.sort;
        }
        sortButton.innerHTML = `<i>sort</i> <div><p>${locale.sort_by}</p><p>${locale[currentSort]}</p></div>`;
        var sortMenu = contextMenu();
        document.addEventListener("click", sortMenu.remove);
    
        var indexCurrentSort = sortsInfo.sorts.indexOf(currentSort);
    
        for (let i = 0; i < sortsInfo.sorts.length; i++) {
            const type = sortsInfo.sorts[i];
            if(i==3){
                sortMenu.add("line");
            }
            var selected = false;
            if(indexCurrentSort == i){
                selected = true;
            }
            sortMenu.add("button", locale[type], {
                "action": () => {
                    setSort(type);
                },
                "icon": sortsInfo.icons[i],
                "selected": selected
            });
        }
    
        sortMenu.add("line", locale.options);
        
        const foldersFirst_checkbox = mdutils.createAppendElement("btn", sortMenu.node);
        foldersFirst_checkbox.classList.add("i");
        if(settings && settings.noteslist){
            if(!settings.noteslist.noFolderPriority){
                foldersFirst_checkbox.classList.add("selected");
            }
        }
        foldersFirst_checkbox.innerHTML = `<i>folder</i> ${locale.foldersFirst}`;
        mdutils.ButtonEvent(foldersFirst_checkbox, () => {
            if(foldersFirst_checkbox.classList.contains("selected")){
                setSort(null, "noFolderPriority", true);
            }
            else{
                setSort(null, "noFolderPriority", false);
            }
            foldersFirst_checkbox.classList.toggle("selected");
        });
    
        const reversed_checkbox = mdutils.createAppendElement("btn", sortMenu.node);
        reversed_checkbox.classList.add("i");
        if(settings && settings.noteslist){
            if(settings.noteslist.reversed){
                reversed_checkbox.classList.add("selected");
            }
        }
        reversed_checkbox.innerHTML = `<i>swap_horiz</i> ${locale.reversed}`;
        mdutils.ButtonEvent(reversed_checkbox, () => {
            if(reversed_checkbox.classList.contains("selected")){
                setSort(null, "reversed", false);
            }
            else{
                setSort(null, "reversed", true);
            }
            reversed_checkbox.classList.toggle("selected");
        });
    
        mdutils.ButtonEvent(sortButton, (event) => {sortMenu.append(event, sortButton)}, null, true);
        sortButton.addEventListener("contextmenu", (e) => {
            sortMenu.append(e, sortButton);
        });
    }

    setSort();


    // View options

    const viewButton = mdutils.createAppendElement("button", element);
    viewButton.classList.add("i", "sort");

    var views = [["grid", "grid_view"], ["list", "view_list"]];
    
    function setView(view){
        if(!settings.noteslist){
            settings.noteslist = {};
        }
        if(view){
            if(view == views[0][0]){
                delete settings.noteslist.view;
            }
            else{
                settings.noteslist.view = view;
            }
            notesListElement.updateList();
        }

        var currentView = views[0][0];
        if(settings.noteslist && settings.noteslist.view){
            currentView = settings.noteslist.view;
        }
        viewButton.innerHTML = `<i>view_carousel</i> <div><p>${locale.view_as}</p><p>${locale[currentView]}</p></div>`;
        var viewMenu = contextMenu();
        document.addEventListener("click", viewMenu.remove);
    
        // var indexCurrentView = views.sorts.indexOf(currentView);
    
        for (let i = 0; i < views.length; i++) {
            const type = views[i][0];
            if(i==3){
                viewMenu.add("line");
            }
            var selected = false;
            if(currentView == views[i][0]){
                selected = true;
            }
            viewMenu.add("button", locale[type], {
                "action": () => {
                    setView(type);
                },
                "icon": views[i][1],
                "selected": selected
            });
        }
    
        mdutils.ButtonEvent(viewButton, (event) => {viewMenu.append(event, viewButton)}, null, true);
        viewButton.addEventListener("contextmenu", (e) => {
            viewMenu.append(e, viewButton);
        });
    }

    setView();

}

const typesIcons = {
    "note": "description",
    "folder": "folder",
    "web app": "web_asset",
    "presentation": "web_asset",
    "canvas": "brush"
}

function createNoteElement(data, NID){
    const listElement = notesListElement.querySelector(".notesList");
    const element = document.createElement("div");
    element.classList.add("button");
    element.setAttribute("NID", NID);

    noteContextMenu(data, element);

    if(data.type == "folder"){
        // do folder stuff
    }

    // element.textContent = data.name;
    var icon = "description";
    if(data.type != "note"){
        if(data.type == "folder"){
            icon = "folder";
            element.classList.add("folder");
        }
        // if(data.type == "presentation" || data.type == "web app"){
        //     icon = "web_asset";
        // }
        else{
            icon = typesIcons[data.type];
        }
    }
    const title = mdutils.createAppendElement("title", element);
    title.innerHTML = `<i>${icon}</i> <span>${data.name}</span>`;

    if(data.type != "folder"){
        const summary = mdutils.createAppendElement("summary", element);
        summary.innerHTML = `${data.summary}`;
    }
    
    const sortData = mdutils.createAppendElement("sortData", element);
    
    var currentSort = sortsInfo.sorts[0];
    if(settings.noteslist && settings.noteslist.sort){
        currentSort = settings.noteslist.sort;
    }
    if(currentSort == sortsInfo.sorts[0]){
        var ago = mdutils.timeSince(data.date_modified);
        sortData.innerHTML = `${ago} ${locale.ago}`;
        if(typeof data.date_modified == "undefined"){
            sortData.innerHTML = `${locale.never_modified}`;
        }
    }
    if(currentSort == "opened_date"){
        var ago = mdutils.timeSince(data.date_opened);
        sortData.innerHTML = `${ago} ${locale.ago}`;
        if(typeof data.date_modified == "undefined"){
            sortData.innerHTML = `${locale.never_opened}`;
        }
    }
    if(currentSort == "created_date"){
        var ago = mdutils.timeSince(data.date_created);
        sortData.innerHTML = `${ago} ${locale.ago}`;
    }
    if(currentSort == "alphabetically"){
        sortData.innerHTML = data.name[0];
    }
    if(currentSort == "size"){
        sortData.innerHTML = mdutils.humanFileSize(data.size);
        if(typeof data.size == "undefined"){
            sortData.innerHTML = `0`;
        }
    }
    if(currentSort == "type"){
        sortData.innerHTML = data.type; // Do it with locales
    }

    mdutils.ButtonEvent(element,
        (event) => {
            if(event.ctrlKey == true || event.shiftKey == true){
                
                return;
            }
            openNote(NID, data);
        }, 
    null, true);

    // Drag functionality
    draggableElement(element, null, {
        ghostElement: true,
        onDrop: (event, extra) => {
            const target = event.target;

            // function findElement(targeted, selector){ Moved to MDUtils
            //     if(targeted.matches(selector)){
            //         return targeted;
            //     }
            //     else{
            //         return targeted.closest(selector);
            //     }
            // }

            // Loading note by dropping it on notearea or header
            
            var writenote = mdutils.findElement(target, ".writenote"),
                header = mdutils.findElement(target, "header"),
                folderNid = mdutils.findElement(target, ".folder[nid]");

            if(writenote || header){
                if(extra.length > 0){
                    var NIDs = [];
                    for (let i = 0; i < extra.length; i++) {
                        var NIDextra = extra[i].getAttribute("nid");
                        if(NIDextra){
                            NIDs.push(NIDextra);
                            // openNote(NIDextra, logonData.notes[NIDextra]);
                        }
                    }
                    NIDs.push(NID);
                    openMultipleNotes(NIDs);
                    return;
                }
                
                openNote(NID, data);
            }
            if(folderNid){
                // MOVE INTO THAT FOLDER
            }
        }
    });

    listElement.appendChild(element);
}

function addToNoteList(data){
    logonData.notes[data.NID] = data.note;
    createNoteElement(data.note, data.NID)
}

function removeFromNoteList(data){

}

// function add remove change
