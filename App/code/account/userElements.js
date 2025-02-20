var avatarElements = [];

function getUserPfpURL(userData, element){
    var pfpURL = WriteNoteServer+"/ui/pfp.png";
    if(userData.Avatar){
        pfpURL = `${WriteNoteServer}/avatar/${userData.Avatar}.jpg`;
    }
    if(element){
        avatarElements.push(element);
    }
    return pfpURL;
}

function updateAvatarElements(newURL){
    for (let i = 0; i < avatarElements.length; i++) {
        const element = avatarElements[i];
        element.src = newURL;
    }
}

function logout(){
    socket.emit("account", {
        type: "logout"
    }, (response) => {
        if(response.status){
            console.log(response);
        }
        if(response.error){
            console.log(response.error);
        }
    });
}

const profileMenu = contextMenu();
document.addEventListener("click", profileMenu.remove);
profileMenu.add("button", locale.log_out, {
    "action": logout,
    "icon": "logout"
});

function openProfileMenuBind(button){
    mdutils.ButtonEvent(button, (event) => {profileMenu.append(event, button)}, null, true);
    button.addEventListener("contextmenu", (e) => {
        profileMenu.append(e, button);
    });
}