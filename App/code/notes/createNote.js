function createNewButton(){
    const element = document.createElement("div");
    element.classList.add("button");
    element.textContent = locale.create_new;
    mdutils.ButtonEvent(element, createNoteGUI);
    return element;
}

function createNoteGUI(){
    const windowElement = createWindow("createNote");
    
    const header = mdutils.createAppendElement("header", windowElement);
    header.textContent = locale.create_new_project;

    // Project name

    const label = document.createElement("label");
    const labelText = mdutils.createAppendElement("text", label);
    labelText.textContent = locale.name;
    const input = document.createElement("input");
    input.classList.add("input");
    label.appendChild(input);
    windowElement.appendChild(label);

    // Project types

    var type = "note";

    var filetypes = {
        [locale.note] : [locale.note_description, "description"],
        [locale.calculator] : [locale.calculator_description, "calculate"],
        [locale.webapp] : [locale.webapp_description, "web_asset"],
        [locale.presentation] : [locale.presentation_description, "web_asset"]
    };

    const typeText = mdutils.createAppendElement("text", windowElement);
    typeText.textContent = locale.type;


    // Submit button

    const submitButton = mdutils.createAppendElement("button", windowElement);
    submitButton.classList.add("submit");
    submitButton.textContent = locale.create;
    mdutils.ButtonEvent(submitButton, createNote);

    function createNote(){
        socket.emit("notes", {
            type: "createNote",
            options: {
                name: input.value,
                type: type
            }
        },
        (success, error) => {
            if(success){
                openedWindows["createNote"].close();
                console.log(success);
            }
            if(error){


                if(error.startsWith("Internal server error or you got really")){
                    windowElement.classList.add("golden");
                }
            }
        }
        );
    }
}