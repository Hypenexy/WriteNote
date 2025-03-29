function loadCSSFile(theme, filename){
    var ref = document.createElement("link");
    ref.rel = "stylesheet";
    ref.type = "text/css";
    ref.href = `./assets/themes/${theme}/${filename}`;
    ref.classList.add(`theme${theme}`);
    document.getElementsByTagName("head")[0].appendChild(ref);
}

var activeTheme = "dark";
function loadTheme(theme, loadFromSettings){
    unloadActiveTheme();
    if(theme == "dark"){
        delete settings.theme;
        return;
    }
    settings.theme = theme;
    for (let i = 0; i < themesInfo[theme].files.length; i++) {
        const filename = themesInfo[theme].files[i];
        if(filename.endsWith(".css")){
            loadCSSFile(theme, filename);
        }
    }
    if(loadFromSettings){
        return;
    }
    saveSettings();
}

function unloadActiveTheme(){
    if(activeTheme=="dark"){
        return;
    }
    var themeItems = document.querySelectorAll(`.theme${activeTheme}`);
    themeItems.forEach(element => {
        element.remove();
    });
}

function themesElement(){
    const element = document.createElement("div");
    element.classList.add("themes");


    var themes = Object.keys(themesInfo);
    for (let i = 0; i < themes.length; i++) {
        const theme = themes[i],
            themeElement = document.createElement("div"),
            preview = mdutils.createAppendElement("preview", themeElement),
            title = mdutils.createAppendElement("title", themeElement),
            description = mdutils.createAppendElement("description", themeElement);

        themeElement.classList.add("theme");
        if(settings.theme && settings.theme == theme){
            themeElement.classList.add("active");
        }
        if(!settings.theme && theme == "dark"){
            themeElement.classList.add("active");
        }

        const previewHTML = `<div class="headerTheme" style="background-color:#${themesInfo[theme].colors.header}"></div><div class="writenoteTheme" style="background-color:#${themesInfo[theme].colors.writenote}"></div>`;
        preview.innerHTML = previewHTML;
        title.textContent = locale[themesInfo[theme].title];
        description.textContent = locale[themesInfo[theme].description];

        mdutils.ButtonEvent(themeElement, () => {
            loadTheme(theme);
            var actives = element.querySelectorAll(".active");
            actives.forEach(element => {
                element.classList.remove("active");
            });

            themeElement.classList.add("active");
        });

        element.appendChild(themeElement);
    }

    return element;
}

onsettingsloadActions.push(()=>{
    if(settings.theme){
        loadTheme(settings.theme, true);
    }
});