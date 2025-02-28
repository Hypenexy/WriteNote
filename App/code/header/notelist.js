function addHeaderNote(NID, note){
    const element = mdutils.createAppendElement("note", noteList);
    function removeOtherActives(){
        var actives = noteList.getElementsByClassName("active");
        for (let i = 0; i < actives.length; i++) {
            actives[i].classList.remove("active");
        }
    }
    removeOtherActives();
    element.classList.add("active");
    element.setAttribute("NID", NID);
    
    
    // if(note.type == "note"){
    //     element.innerHTML += "<i>description</i>";
    // }
    // if(note.type == "presentation" || note.type == "web app"){
    //     element.innerHTML += "<i>web_asset</i>";
    // }
    // if(note.type == "folder"){
    //     element.innerHTML += "<i>folder</i>";
    // }
    element.innerHTML += "<i>"+typesIcons[note.type]+"</i>";
    element.innerHTML += " <p>"+note.name+"</p>";
    element.innerHTML += "<div class='line'></div>";
    // <i class="status">share</i> Make sure to add the hover tool tips
    // <i class="status">person<p>15</p></i>"

    // element.innerHTML += '<i class="status">person<p>15</p></i>';


    const closeButton = mdutils.createAppendElement("x", element);
    closeButton.innerText = "close";

    notelistDropdown(element, NID);

    mdutils.ButtonEvent(closeButton, function(e){
        e.stopPropagation();
        // if(headerDropdown.innerHTML != ""){
        //     hideHeaderDropdown(true);
        // }
        closeNote(NID, element);
    }, null, true);

    // element.addEventListener("contextmenu", (e) => {
    //     e.stopPropagation();
    // });
    element.addEventListener("click", () => {
        if(!element.classList.contains("active")){
            openNote(NID);
            removeOtherActives();
            element.classList.add("active");
        }
    });
}

function addIconHeaderNote(headerElement, icon, tooltip, customClass){
    const element = document.createElement("i");
    element.classList.add("status");
    if(customClass){
        element.classList.add(customClass);
    }
    element.innerText = icon;
    headerElement.appendChild(element);
    attachTooltip(element, tooltip);
}
function removeIconHeaderNote(headerElement, customClass){
    var iconElement = headerElement.querySelector("."+customClass);
    iconElement.classList.add("hide");
    iconElement.addEventListener("animationend", () => {
        iconElement.remove();
    });
}

function changeHeaderNote(NID, options){
    if(options.type == "error"){
        var element = noteList.querySelector(`[NID="${NID}"]`);
        if(options.status == true){
            element.classList.add("error");
            addIconHeaderNote(element, "warning", locale.note_saving_error, "error");
        }
        else{
            element.classList.remove("error");
            removeIconHeaderNote(element, "error");
        }
    }
    if(options.type == "saveChange"){
        var element = noteList.querySelector(`[NID="${NID}"]`);
        if(openNotes[NID].saved){
            openNotes[NID].changeStatus("saved");
            element.classList.remove("unsaved");
            removeIconHeaderNote(element, "unsaved");
        }
        else{
            element.classList.add("unsaved");
            openNotes[NID].changeStatus("unsaved");
            addIconHeaderNote(element, "save", locale.unsaved_changes, "unsaved");
        }
    }
}

function removeHeaderNote(){

}