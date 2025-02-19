function openFileShare(){
    const windowElement = createWindow("fileshare");
    if(typeof windowElement == "string"){
        return;
    }

    const share = mdutils.createAppendElement("share", windowElement);

    var textElement = document.createElement("h2");
    textElement.textContent = locale.create_join_room_share;
    share.appendChild(textElement);

    const createbtn = mdutils.createAppendElement("button", share);
    createbtn.textContent = locale.create_room;

    const joinbtn = mdutils.createAppendElement("button", share);
    joinbtn.textContent = locale.join_room;

    const options = mdutils.createAppendElement("options", windowElement);
    options.innerHTML = "HeY";
    

}


document.addEventListener("keydown", (e) => {
    if(e.ctrlKey && e.code == "KeyE"){
        e.preventDefault();
        openFileShare();
    }
});
