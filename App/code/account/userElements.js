var avatarElements = [];
var bannerElements = [];

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

function createPfpElement(){
    const element = document.createElement("img");
    if(logonData.user.Avatar){
        element.src = `${WriteNoteServer}/avatar/${logonData.user.Avatar}.jpg`;
    }
    else{
        element.src = WriteNoteServer+"/ui/pfp.png";
    }
    avatarElements.push(element);

    return element;
}

function createUserBannerElement(){
    var banner = document.createElement("div");
    banner.classList.add("banner");

    // banner.style.setProperty("background-image", url);
    // banner.src = WriteNoteServer+"/ui/banner.jpg";
    return banner;
}

function updateAvatarElements(newID){
    for (let i = 0; i < avatarElements.length; i++) {
        const element = avatarElements[i];
        element.src = `${WriteNoteServer}/avatar/${newID}.jpg`;
        logonData.user.Avatar = newID;
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

function initMiniProfileMenu(){
    profileMenu.node.classList.add("miniprofile");
    
    const banner = createUserBannerElement();
    profileMenu.node.appendChild(banner);
    
    const pfp = createPfpElement();
    banner.appendChild(pfp);

    const nameBio = mdutils.createAppendElement("nameBio", banner);
    nameBio.innerHTML = `<p>${logonData.user.Username}</p><p>${(logonData.user.Bio) ? logonData.user.Bio : logonData.user.Email}</p>`;

    var switchBtn = mdutils.createAppendElement("button", banner);
    switchBtn.classList.add("m-i");
    switchBtn.textContent = "switch_account";
    attachTooltip(switchBtn, locale.switch_profile, true);

    var logoutBtn = mdutils.createAppendElement("button", banner);
    logoutBtn.classList.add("m-i");
    logoutBtn.textContent = "logout";
    attachTooltip(logoutBtn, locale.log_out, true);
    mdutils.ButtonEvent(logoutBtn, logout);
    
    profileMenu.add("button", locale.log_out, {
        "action": logout,
        "icon": "logout"
    });
}

function openProfileMenuBind(button){
    mdutils.ButtonEvent(button, (event) => {profileMenu.append(event, button)}, null, true);
    button.addEventListener("contextmenu", (e) => {
        profileMenu.append(e, button);
    });
}

var statuses = [
    "Online",
    "Away",
    "DND",
    "Offline"
    // Maybe invisible but it's a bad idea in a text editor
];

var userOnlineStatus = statuses[0];
window.addEventListener("DOMContentLoaded", () => {
    if(settings.user && settings.user.status){
        userOnlineStatus = settings.user.status;
    }
});
var userOnlineStatusElements = [];

function addUserOnlineStatusElement(element){
    userOnlineStatusElements.push(element);
    element.classList.add(userOnlineStatus);
}