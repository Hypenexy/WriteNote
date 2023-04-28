function showSettings(panel, submenu){
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
    var miIcons = ["person", "style", "border_color", "info", "logout"]
    var tabs = ["Account", "Appearance", "Editor", "About", "Log Out"]
    for (let i = 0; i < tabs.length; i++) {
        const element = tabs[i]
        var button = document.createElement("button")
        button.innerHTML = "<i>"+miIcons[i]+"</i><p>"+element+"</p>"
        ButtonEvent(button, openPanel, element)
        if(i+1==tabs.length){
            ButtonEvent(button, logout)
        }
        buttons.appendChild(button)
    }
    
    sidepanel.appendChild(buttons)

    settingsGUI.appendChild(sidepanel)

    var pageSettings = document.createElement("div")
    pageSettings.classList.add("pageSettings")
    settingsGUI.appendChild(pageSettings)
    var lasti = -1

    function openPanel(panel, submenuParam){
        var animationTime = 0
        if(animations){
            animationTime = 150
        }
        var lastActive = buttons.getElementsByClassName("active")
        for (let i = 0; i < lastActive.length; i++) {
            lastActive[i].classList.remove("active")
        }

        var navButtons = buttons.getElementsByTagName("button")
        var navButtonIndex = tabs.indexOf(panel)
        var animIn = "anim1" // For the animations I could make dynamic speed like 1 and divise it by the |lasti-i|
        var animOut = "animf"
        if(lasti<navButtonIndex){
            animIn = "animf"
            animOut = "anim1"
        }
        if(lasti==navButtonIndex){
            animIn = "anims"
            animOut = "anims"
        }
        var subpanel = settingsGUI.getElementsByTagName("subpanel")
        if(subpanel.length>0){
            if(lasti==navButtonIndex){
                animOut = "animfh"
                subpanel[0].classList.add("anim1h")
            }
            else{
                subpanel[0].classList.add("animst")
            }
            setTimeout(() => {
                subpanel[0].remove()
                pageSettings.classList.remove("nodisplay")
            }, animationTime);
        }
        pageSettings.classList.add(animIn)
        lasti = navButtonIndex
        navButtons[navButtonIndex].classList.add("active")
        setTimeout(() => {
            pageSettings.classList.remove(animIn)
            pageSettings.classList.add("notransition")
            pageSettings.classList.add(animOut)
            setTimeout(() => {
                pageSettings.classList.remove("notransition")
                pageSettings.classList.remove(animOut)
            }, 5);
            pageSettings.innerHTML = ""
            var heading = document.createElement("h1")
            heading.innerHTML = panel
            pageSettings.appendChild(heading)
            function submenu(menu){
                var subHeading = document.createElement("h1")
                var headerTextAppend = document.createElement("headermore")
                headerTextAppend.innerHTML = " <i>navigate_next</i> " + menu
                subHeading.innerText = heading.innerText
                headerTextAppend.prepend(subHeading)
                ButtonEvent(subHeading, openPanel, heading.innerText)
                var submenu = document.createElement("div")
                submenu.classList.add("submenu")
                pageSettings.classList.add("animfh")
                var subMenu = settingsSubMenus(menu)
                subMenu.prepend(headerTextAppend)
                setTimeout(() => {
                    pageSettings.classList.add("nodisplay")
                    pageSettings.classList.remove("animfh")
                    settingsGUI.appendChild(subMenu)
                    setTimeout(() => {
                        subMenu.classList.remove("anim1h")
                    }, 10);
                }, animationTime);
            }
            if(submenuParam){
                submenu(submenuParam)
            }
            function submenuButtons(buttonsList){
                for (let i = 0; i < buttonsList.length; i++) {
                    const buttonData = buttonsList[i].split(';')
                    var element = document.createElement("bigBtn")
                    element.innerHTML = "<ti><i>"+buttonData[0]+"</i>"+buttonData[1]+"</ti><co>"+buttonData[2]+"</co>"
                    ButtonEvent(element, submenu, buttonData[1])
                    pageSettings.appendChild(element)
                }
            }
            var display = document.createElement("div")
            display.classList.add("display")
            if(panel=="Account"){
                var buttonsList
                if(storedResponse.user){
                    display.style.height = "initial"
                    if(storedResponse.user.banner){
                        display.innerHTML += "<img class='banner' src='"+serverImage+"?i="+storedResponse.user.banner+"'>"
                    }
                    if(storedResponse.user.pfp){
                        display.innerHTML += "<img class='avatar' src='"+serverImage+"?s=128&i="+storedResponse.user.pfp+"'>"
                    }
                    display.innerHTML += "<p class='username'>"+storedResponse.user.username+"</p>"
                    buttonsList = [
                        "person;Account;Change your account details",
                        "badge;Profile;A place to edit your profile picture, banner and status.",
                        "verified_user;Privacy;Change your privacy preferences.",
                        "devices;Devices;Preview and choose what devices you are logged in from."
                    ]
                }
                else{
                    display.innerHTML = "You're not signed in"
                    buttonsList = [
                        "person;Sign In;",
                        "badge;Sign Up;"
                    ]
                }
                pageSettings.appendChild(display)
                submenuButtons(buttonsList)
            }
            if(panel == "Appearance"){
                var headerbox = document.createElement("headerbox")
                var noteareabox = document.createElement("noteareabox")
                display.appendChild(headerbox)
                display.appendChild(noteareabox)
                noteareabox.contentEditable = true
                copyNodeStyle(header, headerbox)
                copyNodeStyle(notearea, noteareabox)
                pageSettings.appendChild(display)
                var buttonsList = [
                    "style;Theme;Choose a theme or create one to your liking",
                    "translate;Language;Switch to your preferred language.",
                    "menu;Sidepanel;Change options for the sidepanel.",
                    "text_fields;Font;Change the size, boldness and font of the text."
                ]
                submenuButtons(buttonsList)
            }

            if(panel == "Editor"){
                var buttonsList = [
                    "record_voice_over;Narrator;Customize the way the narrator speaks",
                    "dns;Services;Change the default search engine and more."
                ]
                submenuButtons(buttonsList)
            }

            if(panel == "About"){
                var about = document.createElement("div")
                about.classList.add("about")
                about.innerHTML = `<h1 class="brand">
                <b>WriteNote</b> by <m>Midelight</m></h1>
                <wnsplit></wnsplit>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;Written by Hypenexy, WriteNote is the ultimate text editor that should fit all your text editing needs!</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;Firstly written in 2016 and shown to my classmates and principal. Rewritten in 2020 due to boredom. In 2022 and forward it's one of my biggest projects.</p>
                <p>Release ${settings.version}</p>
                <p><a target="_blank" href="${serverAddress}WriteNote/History">WriteNote\'s history</a></p>`
                pageSettings.appendChild(about)
            }
        }, animationTime);
    }

    openPanel(panel, submenu)

    app.appendChild(settingsGUI)
    setTimeout(() => {
        settingsGUI.classList.remove("transition")
    }, 10);
}

function settingsSubMenus(subpanel){
    function addLabel(child, title){
        var label = document.createElement("div")
        label.classList.add("label")
        label.innerHTML = "<p>"+title+"</p>"
        label.appendChild(child)
        element.appendChild(label)
    }

    var element = document.createElement("subpanel")
    element.classList.add("pageSettings")
    element.classList.add("anim1h")
    if(subpanel=="Account"){
        element.innerHTML = "hiii"
    }

    if(subpanel=="Sign In"){
        showLogin()
    }
    if(subpanel=="Sign Up"){
        showRegistration()
    }

    if(subpanel=="Theme"){
        element.appendChild(getThemesMenu())
    }

    if(subpanel=="Sidepanel"){
        var cityInput = document.createElement("input")
        addLabel(cityInput, "Weather info")
    }

    if(subpanel=="Narrator"){
        var voices
        const inputForm = document.createElement("form")
        const inputTxt = document.createElement("input")
        const inputBtn = document.createElement("button")
        inputBtn.innerText = "Speak"
        inputForm.appendChild(inputTxt)
        inputForm.appendChild(inputBtn)
        addLabel(inputForm, "Preview")


        const synth = window.speechSynthesis

        const voiceSelect = createSelect(null, null, true)
        addLabel(voiceSelect, "Voice")

        // msg.volume = 1; // From 0 to 1
        // msg.rate = 1; // From 0.1 to 10
        // msg.pitch = 2; // From 0 to 2
        const volumeInput = document.createElement("input")
        const rateInput = document.createElement("input")
        const pitchInput = document.createElement("input")
        var arrInputs = [volumeInput, rateInput, pitchInput]
        arrInputs.forEach(element => {
            element.type = "number"
        })
        volumeInput.min = 0.1
        if(settings.narrator && settings.narrator.volume){
            volumeInput.value = settings.narrator.volume
        }
        else{
            volumeInput.value = 1
        }
        volumeInput.max = 2
        rateInput.min = 0.1
        if(settings.narrator && settings.narrator.rate){
            rateInput.value = settings.narrator.rate
        }
        else{
            rateInput.value = 1
        }
        rateInput.max = 10
        pitchInput.min = 0
        if(settings.narrator && settings.narrator.pitch){
            pitchInput.value = settings.narrator.pitch
        }
        else{
            pitchInput.value = 1
        }
        pitchInput.max = 2
        arrInputs.forEach(element => {
            element.addEventListener("change", function(){
                var attribute = this.parentNode.getElementsByTagName("p")[0].innerText.toLowerCase()
                if(!settings.narrator){
                    settings.narrator = {}
                }
                if(this.value==1){
                    delete settings.narrator[attribute]
                }
                else{   
                    settings.narrator[attribute] = this.value
                }
                SaveSettings()
            })
        })
        addLabel(volumeInput, "Volume")
        addLabel(rateInput, "Rate")
        addLabel(pitchInput, "Pitch")
        
        function populateVoiceList() {
            voices = synth.getVoices()

            for(const voice of voices){
                const option = document.createElement("option")
                option.textContent = `${voice.name} (${voice.lang})`

                if(voice.default){
                    option.textContent += " — DEFAULT"
                }

                option.setAttribute("data-lang", voice.lang)
                option.setAttribute("data-name", voice.name)
                // voiceSelect.appendChild(option)
                voiceSelect.addOption(voice.name, option.textContent)
            }
            for(const voice of voices){
                if(settings.narrator && settings.narrator.voice){
                    if(voice.name == settings.narrator.voice){
                        voiceSelect.value = `${voice.name} (${voice.lang})`
                    }
                }
            }
        }
        
        populateVoiceList()
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = populateVoiceList
        }
        voiceSelect.addAction(
            (value) => {
                // const selectedOption = voiceSelect.selectedOptions[0].getAttribute("data-name")
                const selectedOption = value
                if(!settings.narrator){
                    settings.narrator = {}
                }
                console.log(voiceSelect.innerText.split('\n')[0]) // fix here!
                if(!voiceSelect.innerText.split('\n')[0].endsWith("DEFAULT")){
                    settings.narrator.voice = selectedOption
                }
                else{
                    delete settings.narrator.voice
                }
                SaveSettings()
            }
        )

        inputForm.onsubmit = (event) => {
            event.preventDefault()

            Narrator(inputTxt.value)
            inputTxt.blur()
        }
    }
    return element
}

function getThemesMenu(){
    var elementThemes = document.createElement("div")
    elementThemes.innerHTML = "<h2>Theme</h2>"
    var themesList = Object.keys(themes)
    themesList.forEach(theme => {
        var element = document.createElement("theme")
        element.innerHTML = `<ti>${theme}</ti><desc>${themes[theme].desc}</desc>`
        element.style.background = themes[theme].wncolor
        element.style.color = themes[theme].textcolor
        var animationTime = 0
        if(animations){
            animationTime = 5000
        }
        element.addEventListener("mouseenter", function(){
            notearea.classList.add("slowtransition")
            notearea.style.background = themes[theme].wncolor
            setTimeout(() => {
                notearea.classList.remove("slowtransition")
            }, animationTime)
        })
        element.addEventListener("mouseleave", function(){
            notearea.classList.add("slowtransition")
            notearea.style.removeProperty("background")
            setTimeout(() => {
                notearea.classList.remove("slowtransition")
            }, animationTime)
        })
        element.addEventListener("click", function(){
            notearea.classList.remove("slowtransition")
            notearea.classList.add("transition")
            changeTheme(theme)
            setTimeout(() => {
                notearea.classList.remove("transition")
            }, 500)
        })
        elementThemes.appendChild(element)
    })
    return elementThemes
}

function getLanguagesMenu(){
    var elementLanguages = document.createElement("div")
    elementLanguages.innerHTML = "<h2>Language</h2>"
    var select = createSelect("en", null, 'English')
    select.addOption("bg", "Bulgarian")
    select.addAction(function(language){
        changeLanguage(language)
    })
    elementLanguages.appendChild(select)
    return elementLanguages
}