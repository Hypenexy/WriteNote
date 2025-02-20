var settings = {};

function openSettings(){
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
    }
}

const settings_keys = {
    "account" : {
        icon: "person"
    },
    "editor" : {
        icon: "border_color"
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