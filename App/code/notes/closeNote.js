function closeNote(NID, element){
    function justClose(){
        socket.emit("notes", {
            type: "close",
            NID: NID
        });


        var headerElement = header.querySelector(`[NID="${NID}"]`);
        var headerElements = header.querySelectorAll("[NID]");
        
        headerElement.remove();
        headerElement.classList.add("hide");

        delete logonData.notes[NID].content;
        delete logonData.notes[NID].saved;
        
        if(activeNID != NID){
            return;
        }
        
        if(lastActiveNID){
            switchNote(lastActiveNID);
        }
        
        
        for (let i = 0; i < headerElements.length; i++) {
            const element = headerElements[i];
            console.log(headerElement == element);
        }
        console.log(headerElements.indexOf(headerElement))
    }
    if(openNotes[NID].saved == false){
        const areYouSure = contextMenu();
    
        areYouSure.node.classList.add("areYouSure");

        areYouSure.add("text", locale.unsaved_progress);
        
        const buttons = document.createElement("div");
        buttons.classList.add("buttons");
        
        function createButton(icon, locale, action){
            const element = document.createElement("div");
            element.classList.add("btn"); // button is different style
            element.classList.add("i");
            element.innerHTML = `<i>${icon}</i><span>${locale}</span>`;
            mdutils.ButtonEvent(element, action);
            
            buttons.appendChild(element);
        }

        createButton("save", locale.save, () => { saveNote(NID);justClose();areYouSure.removeElement() });
        createButton("close", locale.dont_save, () => { justClose();areYouSure.removeElement() });
        createButton("cancel", locale.cancel, areYouSure.removeElement);

        areYouSure.node.appendChild(buttons);
        
        areYouSure.attach();
        areYouSure.append(null, element);
    }
    else{
        justClose();
    }
}