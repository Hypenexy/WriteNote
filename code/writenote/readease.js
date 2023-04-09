function colorize(){
    document.getElementById("colorizecheckmark").style.display = "block"
    notearea.classList.add("readease")
    if(!settings.ease){
        settings.ease = {}
    }
    settings.ease.colorize = true
    SaveSettings()
}
function uncolorize(){
    document.getElementById("colorizecheckmark").style = ""
    notearea.classList.remove("readease")
    delete settings.ease.colorize
    SaveSettings()
}

function toggleColorize(){
    if(settings.ease && settings.ease.colorize){
        uncolorize()
    }
    else{
        colorize()
    }
}

if(settings.ease && settings.ease.colorize){
    colorize()
}

function toggleWordFlash(){
    var check = windowAppExists("Flash Words")
    if(check===false){
        flashWords()
    }
    else{
        activeWindows[check].close()
    }
}

function flashWords(){
    var flashwords = document.createElement("flashwords")
    
    var pEls = notearea.getElementsByTagName("p")
    var text = []
    for(let i = 0; i < pEls.length; i++){
        if(pEls[i].innerText!=''){
            text.push(pEls[i].innerText)
        }
    }
    text = text.join(' ')
    var words = text.split(' ')
    // var words = $(notearea).text().split(' ')
    var word = document.createElement("word")
    var startbtn = document.createElement("button")
    if(words.length == 1 && words[0] == ""){
        word.innerText = "Write something first!"
        startbtn.classList.add("disabled")
    }
    else{
        word.innerText = words[0]
    }
    flashwords.appendChild(word)

    var speed = document.createElement("speed")
    speed.innerHTML = "<label><p>Words per second</p><input type='number' placeholder='10 (Default)' value='10'></label>"
    var inputSpeed = speed.getElementsByTagName("input")[0]
    var delay = 1000 / 10
    inputSpeed.addEventListener("change", function(){
        delay = 1000 / inputSpeed.value
    })
    flashwords.appendChild(speed)

    startbtn.innerText = "Start"
    flashwords.appendChild(startbtn)
    function renderWord(){
        foreachDelayed(words, function(element){word.innerText = element}, delay)
    }
    ButtonEvent(startbtn, renderWord)
    document.getElementById("flashwordscheckmark").style.display = "block"
    flashwords.close = function(){
        document.getElementById("flashwordscheckmark").style = ""
    }
    windowApp(flashwords, "Flash Words", "format_shapes")
}



function Narrator(text){
    if('speechSynthesis' in window) {}
    else{
        PushNotification("Sorry, your browser doesn't support text to speech!", "You can't use the narrator in this browser or device.", "warn");
    }
    window.speechSynthesis.onvoiceschanged = function() {
        window.speechSynthesis.getVoices()
        const narator = new SpeechSynthesisUtterance(text)
        var voices = window.speechSynthesis.getVoices()
        
        if(settings.narrator){
            var optionsArr = ["volume", "rate", "pitch"]
            optionsArr.forEach(element => {
                if(settings.narrator[element]){
                    narator[element] = settings.narrator[element]
                }
            })
            if(settings.narrator.voice){
                const selectedOption = settings.narrator.voice
                narator.voice = voices.find((v) => v.name === selectedOption)
            }
        }

        window.speechSynthesis.speak(narator)
    }
}

function toggleNarrator(){
    var check = windowAppExists("Narrator")
    if(check===false){
        NarratorGui()
    }
    else{
        activeWindows[check].close()
    }
}

function NarratorGui(){
    var narrator = document.createElement("narrator")
    function readSel(){
        Narrator(getSeletedText())
    }
    function readWhole(){
        Narrator(notearea.innerText)
    }
    var readSelBtn = document.createElement("p")
    readSelBtn.innerText = "Read current selection"
    var readWholeBtn = document.createElement("p")
    readWholeBtn.innerText = "Read entire text"
    var stopBtn = document.createElement("p")
    stopBtn.innerText = "Stop narrator"
    ButtonEvent(readSelBtn, readSel)
    ButtonEvent(readWholeBtn, readWhole)
    ButtonEvent(stopBtn, function(){
        window.speechSynthesis.cancel()
    })
    narrator.appendChild(readSelBtn)
    narrator.appendChild(readWholeBtn)
    narrator.appendChild(stopBtn)
    document.getElementById("narratorcheckmark").style.display = "block"
    narrator.close = function(){
        document.getElementById("narratorcheckmark").style = ""
    }
    windowApp(narrator, "Narrator", "record_voice_over")
}