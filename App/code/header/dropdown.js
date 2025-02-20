function notelistDropdown(element, NID){
    // const element = document.createElement("div");
    // element.classList.add("notelistDropdown");
    // app.appendChild(element);

    
    const dropdownElement = contextMenu();
    // dropdownElement.add("button", "locale.create_new", {"action": createNoteGUI, "icon":"add"});
    // dropdownElement.add("button", locale.open_new, {"action": function(e){
    //     reshowWelcome(logonData);
    // }, "icon":"file_open"});

    dropdownElement.node.classList.add("headerDropdown");

    const lineElement = document.createElement("div");
    lineElement.classList.add("line");

    var existingLine = element.getElementsByClassName("line")[0];

    dropdownElement.node.appendChild(lineElement);

    const buttonsRow = mdutils.createAppendElement("buttonsRow", dropdownElement.node);
    
    var button_icons = ["save", "edit", "delete", "close"];
    var button_locales = ["save", "rename", "move_to_bin", "close"];
    var button_actions = [() => { saveNote(NID) }, () => {}, () => {}, () => {}];

    for (let i = 0; i < button_icons.length; i++) {
        const icon = button_icons[i];
        const element = document.createElement("i");
        element.classList.add("button");
        element.textContent = icon;
        attachTooltip(element, locale[button_locales[i]], true);
        mdutils.ButtonEvent(element, button_actions[i]);
        buttonsRow.appendChild(element);
    }

    dropdownElement.node.appendChild(buttonsRow);

    lineElement.changeStatus = (status) => {
        if(status == "saved"){
            lineElement.classList.remove("unsaved");
            lineElement.innerHTML = `<i>save</i> ${locale.note_is_saved}`;
        }
        if(status == "unsaved"){
            lineElement.classList.add("unsaved");
            lineElement.innerHTML = `<i>save</i> ${locale.note_isnt_saved}`;
        }
    }

    openNotes[NID].changeStatus = lineElement.changeStatus;

    lineElement.changeStatus("saved");

    function showDropdown(event){
        var existingLine_dimensions = existingLine.getBoundingClientRect();
        lineElement.style.width = existingLine_dimensions.width + "px";


        if(dropdownElement.node.parentElement != app){
            dropdownElement.append(event, element);
        }
    }

    var timeout = null;
    element.onmouseover = function(event) {
        timeout = setTimeout(() => {showDropdown(event)}, 500);
    };

    element.onmouseout = function() {
        clearTimeout(timeout);
    }

    // dropdownElement.attach(element);
    element.addEventListener("contextmenu", (e) => {
        showDropdown(e);
    });

    document.addEventListener("click", dropdownElement.remove);

    element.addEventListener("click", (e) => {
        if(element.classList.contains("active")){
            showDropdown(e);
        }
    });
}