function openFileShare(){
    const windowElement = createWindow("fileshare");
    if(typeof windowElement == "string"){
        return;
    }

    const main = mdutils.createAppendElement("main", windowElement);
    const share = mdutils.createAppendElement("share", main);

    var textElement = document.createElement("h2");
    textElement.textContent = locale.create_join_room_share;
    share.appendChild(textElement);

    const createbtn = mdutils.createAppendElement("button", share);
    createbtn.textContent = locale.create_room;
    mdutils.ButtonEvent(createbtn, ()=>{
        share.classList.add("hide");
        share.onanimationend = () => {
            share.remove();
            createRoom(main);
        }
    });

    const joinbtn = mdutils.createAppendElement("button", share);
    joinbtn.textContent = locale.join_room;

    const options = mdutils.createAppendElement("options", windowElement);
    
    const serverElement = serverStatusElement();
    options.appendChild(serverElement);

    const profileElement = createProfileElement();
    options.appendChild(profileElement);
}

function createRoom(main){
    const element = document.createElement("div");
    element.classList.add("room");
    
    var options = [
        ["WebRTC", locale.peer_to_peer],
        ["Server", locale.server_pass],
        ["Host", locale.server_host]
    ]
    const select_Method = createSelect(options);
    element.appendChild(select_Method);

    const test = createPfpElement();
    test.style.width = "50%";
    element.appendChild(test);

    main.prepend(element);
}


document.addEventListener("keydown", (e) => {
    if(e.ctrlKey && e.code == "KeyE"){
        e.preventDefault();
        openFileShare();
    }
});
