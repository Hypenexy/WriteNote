function showSettings(panel){
    var settingsGUI = document.createElement("div")
    settingsGUI.classList.add("bigWindow")
    settingsGUI.classList.add("settings")
    settingsGUI.classList.add("transition")
    function close(){
        settingsGUI.classList.add("transition")
        setTimeout(() => {
            settingsGUI.remove()
        }, 200);
    }
    var HideModal = ShowModal(close)
    function localClose(){
        HideModal()
        close()
    }

    var xbtn = document.createElement("x")
    xbtn.classList.add("m-i")
    xbtn.innerText = "close"
    ButtonEvent(xbtn, localClose)
    settingsGUI.appendChild(xbtn)

    var sidepanel = document.createElement("div")
    sidepanel.classList.add("sidepanel")

    var account = mobileHeaderMenu.getElementsByTagName("account")[0]
    if(account){
        var accountClone = account.cloneNode(true)
        sidepanel.appendChild(accountClone)
    }

    var buttons = document.createElement("div")
    buttons.classList.add("buttons")
    var miIcons = ["person", "style", "border_color", "info"]
    var tabs = ["Account", "Appearance", "Editor", "About"]
    for (let i = 0; i < tabs.length; i++) {
        const element = tabs[i]
        var button = document.createElement("button")
        button.innerHTML = "<i class='m-i'>"+miIcons[i]+"</i><p>"+element+"</p>"
        ButtonEvent(button, openPanel, element)
        buttons.appendChild(button)
    }
    
    sidepanel.appendChild(buttons)

    settingsGUI.appendChild(sidepanel)

    var pageSettings = document.createElement("div")
    pageSettings.classList.add("pageSettings")
    settingsGUI.appendChild(pageSettings)

    function openPanel(panel){
        pageSettings.innerHTML = ""
        var lastActive = buttons.getElementsByClassName("active")
        for (let i = 0; i < lastActive.length; i++) {
            lastActive[i].classList.remove("active")
        }
        var navButtons = buttons.getElementsByTagName("button")
        var navButtonIndex = tabs.indexOf(panel)
        navButtons[navButtonIndex].classList.add("active")
        var heading = document.createElement("h1")
        heading.innerHTML = panel
        pageSettings.appendChild(heading)
        if(panel=="Account"){
            var display = document.createElement("div")
            display.classList.add("display")
            if(storedResponse.user){
                if(storedResponse.user.banner){
                    display.innerHTML += "<img class='banner' src='"+serverImage+"?i="+storedResponse.user.banner+"'>"
                }
                if(storedResponse.user.avatar){
                    display.innerHTML += "<img class='avatar' src='"+serverImage+"?s=128&i="+storedResponse.user.pfp+"'>"
                }
                display.innerHTML += "<p class='username'>"+storedResponse.user.username+"</p>"
            }
            else{
                display.innerHTML = ""
            }
            pageSettings.appendChild(display)
        }
    }

    openPanel(panel)

    app.appendChild(settingsGUI)
    setTimeout(() => {
        settingsGUI.classList.remove("transition")
    }, 10);
}