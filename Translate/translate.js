function initApp(){
var languages = ["English", "Български", "Turkish", "Deutsch", "Español", "Русский", "Japanese", "Chinese"]
var SelectedLanguage = ""

var strings = Object.keys(locale)

var welcome = document.createElement("div")
welcome.classList.add("translate")
welcome.innerHTML = "<h1>WriteNote <b>Translations</b></h1><h2>Welcome, to the translations page.</h2><div class='bouncy m-i'>language</div><div class='bouncy2 m-i'>translate</div>"
//<i class='m-i'>language</i>
app.appendChild(welcome)

var translations = document.createElement("div")
translations.classList.add("translations")

var languageselectbtn = document.createElement("button")

languageselectbtn.innerHTML = "What language do you want to translate to? <i class='m-i'>expand_more</i>"


var languagesselector = document.createElement("div")
languagesselector.classList.add("languageselector")
for (let i = 0; i < languages.length; i++) {
    languagesselector.innerHTML += "<a>" + languages[i] + "</a>"
}

function initLanguageEditor(){
    welcome.getElementsByClassName("bouncy")[0].classList.add("bouncyfadeout")
    welcome.getElementsByClassName("bouncy2")[0].classList.add("bouncyfadeout")
    welcome.getElementsByTagName("h2")[0].classList.add("h2fadeout")
    // welcome.innerHTML = "<h1>WriteNote <b>Translations</b></h1>"
    var tooltipElement = document.createElement("p")
    tooltipElement.classList.add("tooltip")
    app.appendChild(tooltipElement)
    function Tooltip(element, tooltip){
        function focused(){
            tooltipElement.classList.add("tooltipvisible")
            tooltipElement.innerHTML = tooltip
            var xy = getOffset(element)
            var left = xy.left - tooltipElement.clientWidth/3 //i think this works? No
            var top = xy.top + element.clientHeight + 10
            if(left<5){
                left = 5
            }
            if(left>window.innerWidth){
                left = left - tooltipElement.clientWidth/3*2
            }
            tooltipElement.style.left = left + "px"
            tooltipElement.style.top = top + "px"
        }
        function blurred(){
            tooltipElement.classList.remove("tooltipvisible")
        }
        element.addEventListener("mouseover", focused)
        element.addEventListener("focus", focused)
        element.addEventListener("mouseout", blurred)
        element.addEventListener("blur", blurred)

    }
    
    var tipElement = document.createElement("div")
    tipElement.classList.add("tip")
    app.appendChild(tipElement)
    var tipnextfunction
    function tip(tip, pos, num, next, alt){
        tipElement.style.left = pos[0] + "px"
        tipElement.style.top = pos[1] + "px"
        var arrow = "<div class='arrow-left-border'></div><div class='arrow-left'></div>"
        if(alt){
            arrow = "<div class='arrow-down-border'></div><div class='arrow-down'></div>"
        }
        tipElement.innerHTML = arrow+"<h1>Tip</h1><i class='m-i'>close</i><h2>"+num[0]+"/"+num[1]+"</h2><p>"+tip+"</p>"
        tipElement.classList.add("tipvisible")
        var closebtn = tipElement.getElementsByClassName("m-i")[0]
        if(next){
            tipnextfunction = next
            ButtonEvent(closebtn, next)
        }
        else{
            function closetip(){
                tipElement.classList.remove("tipvisible")
            }
            tipnextfunction = closetip
            ButtonEvent(closebtn, closetip)   
        }
    }
    // document.addEventListener("click", function(){
    //     if(tipElement.innerHTML){
    //         tipnextfunction()
    //     }
    // }) not sure // still not sure, maybe better keep it commented
    setTimeout(() => {
        function next(){
            function next(){
                tip("Here you write in the language you've selected. Remember to be as close as possible to the references.", [275, 55], [3, 3], null, true)
            }
            tip("Click here to add another language to reference from.", [87, 206], [2, 3], next)
        }
        tip("To exit and return to the language selection, you can click here.", [87, 125], [1, 3], next)
        setTimeout(() => {
            if(tipnextfunction == next){
                next()
            }
        }, 4000);
    }, 900);

    translations.classList.remove("translationsdone")
    translations.classList.add("translationnextchapter")
    function getLanguageStrings(){
        var html = ""
        for(let i = 0; i < strings.length; i++){
            html += "<label><b>"+strings[i]+"</b><input></label>"
        }
        return html
    }
    translations.innerHTML = "<div class='languagereference referenceadd'><i class='m-i'>close</i><i class='m-i'>add</i></div><div class='languageedit'><p>"+SelectedLanguage+"</p>"+getLanguageStrings()+"</div>"
    var referenceadd = translations.getElementsByClassName("referenceadd")[0]
    var referenceaddbuttons = referenceadd.getElementsByClassName("m-i")

    Tooltip(referenceaddbuttons[0], "Back")
    ButtonEvent(referenceaddbuttons[0], function(){
        app.innerHTML = ''
        initApp()
    })
    Tooltip(referenceaddbuttons[1], "Add a reference language")
    document.addEventListener("click", function(){
        var languageSelector = app.getElementsByClassName("languageSelectorVisible")
        if(languageSelector.length != 0){
            languageSelector[0].remove()
        }
    })
    ButtonEvent(referenceaddbuttons[1], function(){
        if(app.getElementsByClassName("languageSelector").length == 0){
            var languageSelector = document.createElement("div")
            languageSelector.classList.add("languageSelector")
            var data = {getExistingLanguages : true}
            $.ajax({
                url: server + "app/translate/",
                type: "post",
                data: data,
                success: function (response) {
                    response = JSON.parse(response)
                    if(response.status=="success"){
                        response.languages.forEach(element => {
                            var languageButton = document.createElement("p")
                            languageButton.innerHTML = element
                            ButtonEvent(languageButton, addReference, element)
                            languageSelector.appendChild(languageButton)
                        });
                    }
                },
                error: function() {
                    languageSelector.innerHTML = "Could not connect to server.<br>Check your connection between the server!"
                }
            })
            app.appendChild(languageSelector)
            setTimeout(function() {
                languageSelector.classList.add("languageSelectorVisible")
            }, 10)
        }
    })

    function addReference(language){
        function getReferenceLanguageStrings(){
            var data = {getLanguage : language}
            var strings = ""
            $.ajax({
                url: server + "app/translate/",
                type: "post",
                data: data,
                success: function (response) {
                    response = JSON.parse(response)
                    strings = response.language
                    strings = strings.slice(13)
                    
                    var fixedJSON = strings
                        .replace(/:\s*"([^"]*)"/g, function(match, p1) {
                            return ': "' + p1.replace(/:/g, '@colon@') + '"';
                        })
                        .replace(/:\s*'([^']*)'/g, function(match, p1) {
                            return ': "' + p1.replace(/:/g, '@colon@') + '"';
                        })
                        .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')
                        .replace(/@colon@/g, ':')


                    strings = JSON.parse(fixedJSON)
                    stringsValues = Object.values(strings)
                    var html = ""
                    for(let i = 0; i < stringsValues.length; i++){
                        html += "<label><input value='"+stringsValues[i]+"' disabled></label>"
                    }
                    reference.innerHTML = "<p>"+language+"</p>"+html
                    reference.appendChild(closeBtn)
                },
                error: function() {
                    alert("Could not connect to server.<br>Check your connection between the server!")
                }
            })
            
        }
        var reference = document.createElement("div")
        reference.classList.add("languageedit")
        reference.classList.add("languageeditReference")
        var closeBtn = document.createElement("x")
        closeBtn.classList.add("m-i")
        closeBtn.innerText = "close"
        ButtonEvent(closeBtn, function(){
            reference.remove()
        })
        getReferenceLanguageStrings()
        translations.appendChild(reference)
    }

    var languageedit = translations.getElementsByClassName("languageedit")[0]
}

var specificlanguagebuttons = languagesselector.getElementsByTagName("a")
for (let i = 0; i < specificlanguagebuttons.length; i++) {
    const element = specificlanguagebuttons[i]
    ButtonEvent(element, function(){
        SelectedLanguage = element.innerText
        element.classList.add("selected")
        translations.classList.add("translationsdone")
        setTimeout(function(){
            initLanguageEditor()
        }, 400);
    })
}


//ADD HOVER TOOLTIPS!!! Haven't I done that already?
ButtonEvent(languageselectbtn, function(){
    if(languageselectbtn.classList.contains("btnactive")){
        languageselectbtn.classList.remove("btnactive")
        languagesselector.classList.remove("languageselectoractive")
        languageselectbtn.innerHTML = "What language do you want to translate to? <i class='m-i'>expand_more</i>"
    }
    else{
        languageselectbtn.classList.add("btnactive")
        languagesselector.classList.add("languageselectoractive")
        languageselectbtn.innerHTML = "What language do you want to translate to? <i class='m-i'>expand_less</i>"
    }
})

translations.appendChild(languageselectbtn)
translations.appendChild(languagesselector)

welcome.appendChild(translations)


}
initApp()