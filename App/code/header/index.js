const header = document.createElement("header");
const noteList = mdutils.createAppendElement("noteList", header);


function loadHeader(){
    if(window.innerWidth <= 590){
        toggleSubHeader();
    }
    
    const headerContextMenu = contextMenu();
    headerContextMenu.add("button", locale.create_new, {"action": console.log, "icon":"add"});
    headerContextMenu.add("button", locale.open_new, {"action": function(e){
        e.stopPropagation();
        showHeaderDropdown("notes", openNew);
        headerContextMenu.remove(e);
    }, "actionEvent":true, "icon":"file_open"});
    headerContextMenu.attach(header);

    const createNew = document.createElement("i");
    createNew.classList.add("new");
    createNew.innerText = "add";
    attachTooltip(createNew, locale["create_new"]);
    // mdutils.ButtonEvent(createNew, createNewNote);
    noteList.appendChild(createNew);
    const openNew = document.createElement("i");
    openNew.classList.add("new");
    openNew.innerText = "file_open";
    attachTooltip(openNew, locale["open_new"]);
    mdutils.ButtonEvent(openNew, function(e){
        e.stopPropagation();
        showHeaderDropdown("notes", openNew);
    }, null, true);
    noteList.appendChild(openNew);

    const infotainment = mdutils.createAppendElement("infotainment", header);

    const showSubHeader = mdutils.createAppendElement("showSubHeader", infotainment);
    showSubHeader.classList.add("m-i");
    showSubHeader.classList.add("btn");
    showSubHeader.innerText = "expand_more";
    attachTooltip(showSubHeader, locale["show_subheader"]);
    // mdutils.ButtonEvent(showSubHeader, toggleSubHeader);

    const weather = mdutils.createAppendElement("weather", infotainment);
    weather.innerHTML = "<div>" + logonData.weather.main.temp.toString().split('.')[0] + "°C</div>";
    weather.style.backgroundImage = `url("${WriteNoteServer}/weather/${logonData.weather.image}.jpg")`;
    // mdutils.ButtonEvent(weather, openWeather);

    const profile = mdutils.createAppendElement("profile", infotainment);
    // attachOnlineStatus(profile);
    attachTooltip(profile, locale["view_profile"]);
    profile.innerHTML = "<div class='line'></div><p>"+logonData.user.Username+"</p> ";
    const pfpURL = getUserPfpURL(logonData.user);
    profile.innerHTML += "<img src='"+pfpURL+"'>";
    mdutils.ButtonEvent(profile, function(e){
        e.stopPropagation();
        const element = document.createElement("div");
        const closeNotebtn = mdutils.createAppendElement("btn", element);
        closeNotebtn.innerText = "Close";
        mdutils.ButtonEvent(closeNotebtn, function(){
            
        });
        showHeaderDropdown("account", profile, element);
    }, null, true);

    app.appendChild(header);
}