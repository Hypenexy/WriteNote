var settings = {};

function openSettings(section){
    const windowElement = createWindow("settings");
    if(typeof windowElement == "string"){
        return;
    }

    const settingsElement = document.createElement("div");
    settingsElement.classList.add("settings");
    windowElement.appendChild(settingsElement);

    const sideButtonsElement = document.createElement("div");
    sideButtonsElement.classList.add("sidebtns");
    settingsElement.appendChild(sideButtonsElement);

    const settings_tabs = Object.keys(settings_keys);
    for (let i = 0; i < settings_tabs.length; i++) {
        const element = document.createElement("div");
        element.classList.add("button");
        const icon = settings_keys[settings_tabs[i]].icon;
        element.classList.add("i");
        element.innerHTML = `<i>${icon}</i>${locale[settings_tabs[i]]}`;
        sideButtonsElement.appendChild(element);

        mdutils.ButtonEvent(element, () => {
            var lastActive = sideButtonsElement.querySelector(".active");
            if(lastActive){
                lastActive.classList.remove("active")
            }
            element.classList.add("active");
            openMain(settings_tabs[i]);
        });
    }

    const settingsMain = document.createElement("div")
    settingsMain.classList.add("settingsMain");
    settingsElement.appendChild(settingsMain);

    function createSetting(setting){
        const element = document.createElement("div");
        element.classList.add("setting");
        const labelElement = mdutils.createAppendElement("label", element);
        labelElement.textContent = locale[setting.label]; 
        if(setting.type == "toggle"){
            // if(settings[]) == true
            // make active

            //else
            var lastState = false;

            lastState = !lastState;

            mdutils.ButtonEvent(element, setting.action, lastState);
        }
        if(setting.type == "input"){
            const inputElement = document.createElement("input");
            element.appendChild(inputElement);
            if(setting.onload){
                setting.onload(inputElement);
            }
        }
        if(setting.type == "avatar"){
            element.classList.add("avatarSetting");
            const pfp = document.createElement("img");
            pfp.src = getUserPfpURL(logonData.user, pfp);
            element.appendChild(pfp);
            const button = document.createElement("div");
            button.classList.add("button", "i");
            button.innerHTML = `<i>image</i>${locale.select_photo}`;
            element.appendChild(button);

            mdutils.ButtonEvent(pfp, changeAvatar);
            mdutils.ButtonEvent(button, changeAvatar);
        }

        if(setting.type == "devices"){
            const devicesElement = createDevicesElement();
            element.appendChild(devicesElement);
        }

        if(setting.type == "notesUsage"){
            const notesUsage = createNotesUsageElement();
            element.appendChild(notesUsage);
        }

        return element;
    }

    function openMain(section){
        settingsMain.innerHTML = "";
        const headerElement = mdutils.createAppendElement("header", settingsMain);
        headerElement.textContent = locale[section];
        if(section == "about"){
            headerElement.addEventListener("click", (e) => {
                if(e.detail == 3){
                    settings_keys["admin"] = {};
                    settings_keys["admin"].icon = "admin_panel_settings";
                }
            });
        }
        if(windowElement.classList.contains("admin") && section != "admin"){
            windowElement.classList.remove("admin");
        }
        if(section == "admin"){
            windowElement.classList.add("admin");
            settingsMain.appendChild(loadAdminPanel());
            return;
        }
        const settingsElement = mdutils.createAppendElement("settingsContainer", settingsMain);
        const settingsList = Object.keys(settings_keys[section].settings);
        for (let i = 0; i < settingsList.length; i++) {
            const element = settings_keys[section].settings[settingsList[i]];
            settingsElement.appendChild(createSetting(element));
        }
    }

    if(section){
        var btns = sideButtonsElement.querySelectorAll(".button");
        switch (section) {
            case "editor":
                btns[1].click();
                break;
            case "about":
                btns[2].click();
            case "admin":
                openMain("admin");
            default:
                // btns[0].click();
                break;
        }
    }
    else{
        sideButtonsElement.querySelector(".button").click();
    }
}

const settings_keys = {
    "account" : {
        icon: "person",
        settings: {
            change_username: {
                label: "change_username",
                type: "input",
                onload: (input) => {
                    input.value = logonData.user.Username;
                    input.name = "fname";
                },
                action: changeUsername
            },
            change_avatar: {
                label: "change_avatar",
                type: "avatar"
            },
            devices: {
                label: "devices",
                type: "devices"
            },
            notesUsage: {
                label: "notesUsage",
                type: "notesUsage"
            }
        }
    },
    "editor" : {
        icon: "border_color",
        settings: {
            // no_animations: { // This looks absolutely horrible
            //     label: "no_animations",
            //     type: "toggle",
            //     action: (state) => {
            //         if(state == true){
            //             document.body.classList.add("noanimations");
            //         }
            //         else{
            //             document.body.classList.remove("noanimations");
            //         }
            //     }
            // }
        }
    },
    "about" : {
        icon: "info"
    }
}

document.addEventListener("keydown", (e) => {
    if(e.ctrlKey && e.code == "Period"){
        openSettings();
    }
});
