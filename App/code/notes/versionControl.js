function displayVersions(NID){ // Show this menu on UNDO when no more undo history exists
    const versionsElement = document.createElement("div");
    versionsElement.classList.add("versionControl");
    
    versionsElement.innerHTML = "<h4>Previous Versions</h4><div class='version'>some stff, date, size, version</div><div class='version'>test</div>";

    function removeElement(){
        versionsElement.classList.add("hide");
        versionsElement.onanimationend = () => {
            versionsElement.remove();
        }
    }
    escapeStack.push([versionsElement, removeElement]);


    app.appendChild(versionsElement);
}