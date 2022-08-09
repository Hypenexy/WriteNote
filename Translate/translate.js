function initApp(){
var languages = ["English", "Български", "Turkish", "Deutsch", "Español", "Русский", "Japanese", "Chinese"]
var SelectedLanguage = ""

var strings = ["welcome", "heythere"]

var welcome = document.createElement("div")
welcome.classList.add("translate")
welcome.innerHTML = "<h1>WriteNote <b>Translations</b></h1><h2>Welcome, to the translations page.</h2>"
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
    welcome.getElementsByTagName("h2")[0].classList.add("h2fadeout")
    // welcome.innerHTML = "<h1>WriteNote <b>Translations</b></h1>"
    var tooltipElement = document.createElement("p")
    tooltipElement.classList.add("tooltip")
    app.appendChild(tooltipElement)
    function Tooltip(element, tooltip){
        element.addEventListener("mouseover", function(){
            tooltipElement.classList.add("tooltipvisible")
            tooltipElement.innerHTML = tooltip
            var xy = getOffset(element)
            var left = xy.left - tooltipElement.clientWidth/3
            var top = xy.top + element.clientHeight + 10
            if(left<5){
                left = 5
            }
            if(left>window.innerWidth){
                left = left - tooltipElement.clientWidth/3*2
            }
            tooltipElement.style.left = left + "px" //i think this works? No
            tooltipElement.style.top = top + "px"
        })
        element.addEventListener("mouseout", function(){
            tooltipElement.classList.remove("tooltipvisible")
        })

    }
    
    var tipElement = document.createElement("div")
    tipElement.classList.add("tip")
    app.appendChild(tipElement)
    function tip(tip, pos, num){
        tipElement.innerHTML = "<h1>Tip</h1><h2>"+num+"</h2><p>"+tip+"</p>"
    }
    tip("This is your workspace, to exit and return to last menu you can click here.")

    translations.classList.remove("translationsdone")
    translations.classList.add("translationnextchapter")
    function getLanguageStrings(){
        var html = ""
        for(let i = 0; i < strings.length; i++){
            html += "<label><b>"+strings[i]+"</b><input></label>"
        }
        return html
    }
    translations.innerHTML = "<div class='languagereference referenceadd'><i class='m-i'>arrow_back</i><i class='m-i'>add</i></div><div class='languageedit'><p>"+SelectedLanguage+"</p>"+getLanguageStrings()+"</div>"
    var referenceadd = translations.getElementsByClassName("referenceadd")[0]
    var referenceaddbuttons = referenceadd.getElementsByClassName("m-i")

    Tooltip(referenceaddbuttons[0], "Back")
    ButtonEvent(referenceaddbuttons[0], function(){
        app.innerHTML = ''
        initApp()
    })
    Tooltip(referenceaddbuttons[1], "Add a reference language")
    ButtonEvent(referenceaddbuttons[1], function(){
        //reference language
    })
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


//ADD HOVER TOOLTIPS!!!
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