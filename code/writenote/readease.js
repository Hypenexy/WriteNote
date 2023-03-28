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

function narrator(){
    var msg = new SpeechSynthesisUtterance()
    msg.text = $(notearea).text()
    window.speechSynthesis.speak(msg)
}

function toggleWordFlash(){
    var containsWordFlash = false
    for (let i = 0; i < activeWindows.length; i++) {
        if(activeWindows[i].Title = "Flash Words"){
            containsWordFlash = true
            activeWindows[i].close()
        }
    }
    if(containsWordFlash==false){
        flashWords()
    }
}

function flashWords(){
    var flashwords = document.createElement("flashwords")
    var words = $(notearea).text().split(' ')
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