const header = document.createElement("header");
const noteList = mdutils.createAppendElement("noteList", header);
var loadedApp = false;

function loadHeader(isApp){
    if(header.parentElement != null && loadedApp == true){
        return;
    }

    if(isApp){
        loadedApp = true;

        document.body.classList.add("app-round");
        header.classList.add("app");

        const headerContextMenu = contextMenu();

        const btnsContainer = mdutils.createAppendElement("osHeaderButtons", header);

        buttons = ["minimize", "maximize", "close"];

        for (let i = 0; i < buttons.length; i++) {
            const icon = buttons[i];

            var buttonElement = document.createElement("i");
            buttonElement.textContent = icon;

            var action = () => {
                window.ipcRender.send(`window:${icon}`);
            };
            
            headerContextMenu.add("button", locale[icon], {action: action});

            mdutils.ButtonEvent(buttonElement, action);

            btnsContainer.appendChild(buttonElement);
        }

        headerContextMenu.attach(header); // drag area doesnt allow this other than the buttons

        window.addEventListener('focus', function() {
            header.classList.remove('blur');
        });
          
        window.addEventListener('blur', function() {
            header.classList.add('blur');
        });

        header.addEventListener("click", (e) => {
            if(e.detail == 2){
                window.ipcRender.send(`window:maximize`); // doesnt allow this either ^
            }
        })

        app.appendChild(header);
        return;
    }

    // if(window.innerWidth <= 590){
    //     toggleSubHeader();
    // }
    
    const headerContextMenu = contextMenu();
    headerContextMenu.add("button", locale.create_new, {"action": createNoteGUI, "icon":"add"});
    headerContextMenu.add("button", locale.open_new, {"action": function(e){
        reshowWelcome(logonData);
    }, "icon":"file_open"});
    headerContextMenu.attach(header);


    const createNew = document.createElement("i");
    createNew.classList.add("new");
    createNew.innerText = "add";
    attachTooltip(createNew, locale["create_new"]);
    mdutils.ButtonEvent(createNew, createNoteGUI);
    noteList.appendChild(createNew);

    const openNew = document.createElement("i");
    openNew.classList.add("new");
    openNew.innerText = "file_open";
    attachTooltip(openNew, locale["open_new"]);
    mdutils.ButtonEvent(openNew, reshowWelcome, logonData);
    noteList.appendChild(openNew);

    const infotainment = mdutils.createAppendElement("infotainment", header);

    const showSubHeader = mdutils.createAppendElement("showSubHeader", infotainment);
    showSubHeader.classList.add("m-i");
    showSubHeader.classList.add("btn");
    showSubHeader.innerText = "expand_more";
    attachTooltip(showSubHeader, locale["show_subheader"]);
    // mdutils.ButtonEvent(showSubHeader, toggleSubHeader);

    const weather = mdutils.createAppendElement("weather", infotainment);
    if(logonData && logonData.weather){
        weather.innerHTML = "<div>" + logonData.weather.main.temp.toString().split('.')[0] + "°C</div>";
        weather.style.backgroundImage = `url("${WriteNoteServer}/weather/${logonData.weather.image}")`;
        // mdutils.ButtonEvent(weather, openWeather);
    }

    const profile = mdutils.createAppendElement("profile", infotainment);
    // attachOnlineStatus(profile);
    attachTooltip(profile, locale["view_profile"]);
    // profile.innerHTML = "<div class='line'></div><i class='status'>devices</i>1<p>"+logonData.user.Username+"</p> ";

    const userStatusElement = mdutils.createAppendElement("line", profile);
    addUserOnlineStatusElement(userStatusElement);

    const imgElement = document.createElement("img");
    if(logonData){
        const pfpURL = getUserPfpURL(logonData.user, imgElement);
        imgElement.src = pfpURL;
        profile.appendChild(imgElement);
    }
    // mdutils.ButtonEvent(profile, function(e){
    //     e.stopPropagation();
    //     const element = document.createElement("div");
    //     const closeNotebtn = mdutils.createAppendElement("btn", element);
    //     closeNotebtn.innerText = "Close";
    //     mdutils.ButtonEvent(closeNotebtn, function(){
            
    //     });
    //     showHeaderDropdown("account", profile, element);
    // }, null, true);
    
    gestureElement(profile, null, {
        contextMenu: profileMenu,
        direction: "down",
        diff: 300
    });
    

    openProfileMenuBind(profile);

    app.appendChild(header);
}