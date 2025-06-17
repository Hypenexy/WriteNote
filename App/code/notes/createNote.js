function createNewButton(folderNID){
    const element = document.createElement("div");
    element.classList.add("button");
    element.innerHTML = `<i>add</i>${locale.create_new}`;
    mdutils.ButtonEvent(element, createNoteGUI, folderNID);
    return element;
}

function createNoteGUI(folderNID){
    const windowElement = createWindow("createNote");
    
    const header = mdutils.createAppendElement("header", windowElement);
    header.textContent = locale.create_new_project;

    if(folderNID){
        header.textContent = `${locale.create_new_project} ${locale.in} ${logonData.notes[folderNID].name}`;
    }

    // Project name

    const label = document.createElement("label");
    const labelText = mdutils.createAppendElement("text", label);
    labelText.textContent = locale.name;
    const input = document.createElement("input");
    input.classList.add("input");
    label.appendChild(input);
    windowElement.appendChild(label);

    // Project types

    const typeText = mdutils.createAppendElement("text", windowElement);
    typeText.textContent = locale.type;

    var type = "note";

    const typeContainer = mdutils.createAppendElement("typeContainer", windowElement);

    var filetypes = {
        [locale.note] : [locale.note_description, "description"],
        [locale.calculator_type] : [locale.calculator_description, "calculate"],
        [locale.webapp] : [locale.webapp_description, "web_asset"],
        [locale.presentation] : [locale.presentation_description, "web_asset"],
        [locale.canvas] : [locale.canvas_description, "brush"]
    };
    
    var filetypesKeys = Object.keys(filetypes);

    for (let i = 0; i < filetypesKeys.length; i++) {
        const element = mdutils.createAppendElement("type", typeContainer);
        const data = filetypes[filetypesKeys[i]];

        if(i==0){
            element.classList.add("active");
        }
        element.innerHTML = `<div><i>${data[1]}</i><span class="title">${filetypesKeys[i]}</span></div>
        <p class="description">${data[0]}</p>`;

        mdutils.ButtonEvent(element, () => {
            var lastActive = typeContainer.querySelector(".active");
            if(lastActive){
                lastActive.classList.remove("active");
            }
            type = filetypesKeys[i];
            element.classList.add("active");
        });
    }


    // Submit button

    const submitButton = mdutils.createAppendElement("button", windowElement);
    submitButton.classList.add("submit");
    submitButton.textContent = locale.create;
    mdutils.ButtonEvent(submitButton, createNote);


    function createNote(){
        var options = {
            name: input.value,
            type: type
        };
        if(folderNID){
            options.folder = folderNID;
        }

        socket.emit("notes", {
            type: "createNote",
            options: options
        },
        (success, error) => {
            if(success){
                openedWindows["createNote"].close();
                console.log(success);
                addToNoteList(success);
            }
            if(error){
                switch (error) {
                    case "Invalid project type":
                        console.log(error);
                        break;
                    case "Name is invalid format":
                        console.log(error);
                        break;
                    case "Name is not set":
                        
                        break;
                    case "Name is too long":
                        
                        break;
                    case "Name is nonexistent":
                        console.log("???");
                        console.log(error);
                        break;
                    case "Parent is invalid format":
                        
                        break;
                    case "Type is invalid":
                        console.log(error);
                        break;
                    case "Invalid project type":
                        
                        break;
                    default:
                        break;
                }
                
                if(error.startsWith("Internal server error or you got really")){
                    windowElement.classList.add("golden");
                }
            }
        }
        );
    }
}

function createFolder(){
    console.log("Hi kur!s");
    socket.emit("notes", {
        type: "createNote",
        options: {
            name: "New folder",
            type: "folder"
        }
    },
    (success, error) => {
        if(success){
            openedWindows["createNote"].close();
            addToNoteList(success);
        }
        if(error){

        }
    });
}