function calculator(){
    var calculator = document.createElement("div")
    calculator.classList.add("calculator")
    var output = document.createElement("input")
    var history = document.createElement("history")
    var buttons = document.createElement("buttons")
    function normalizeForEval(input){
        input = input.replace(/÷/g, '/')
        input = input.replace(/×/g, '*')
        input = input.replace(/÷/g, '/')
        return input
    }
    function calculate(){
        try {
            var historydiv = document.createElement("div")
            historydiv.innerHTML = "<calc>"+output.value+"</calc><result>"
            lasthistory.innerText = output.value
            output.value = eval(normalizeForEval(output.value))
            historydiv.innerHTML+=output.value+"</result>"
            history.prepend(historydiv)
            ButtonEvent(historydiv, function(){
                output.value = historydiv.getElementsByTagName("calc")[0].innerText
                history.classList.remove("active")
            })
        } catch (error) {
            output.classList.add("error")
            setTimeout(() => {
                output.classList.remove("error")
            }, 900);
        }
    }
    function insertCalc(char){
        switch (char) {
            case '<i class="m-i">backspace</i>':
                output.value = output.value.slice(0, -1)
                break;
            case 'c':
                lasthistory.innerText = ''
                output.value = ''
                break;
            case '=':
                calculate()
                break;
            case '±':
                if(output.value.startsWith("-(") && output.value.endsWith(")")){
                    output.value = output.value.slice(2, -1)
                }
                else{
                    output.value = "-("+output.value+")"
                }
                break;
            default:
                output.value += char
                break;
        }
    }
    // var buttonsArray = ['÷', '×', 'c', '<i class="m-i">backspace</i>', 7, 8, 9, '-', 4, 5, 6, '+', 1, 2, 3, '=', '+/-', 0, '.']
    var buttonsArray = ['÷', 7, 4, 1, '±', '×', 8, 5, 2, 0, 'c', 9, 6, 3, '.', '<i class="m-i">backspace</i>', '-', '+', '=']
    for (let i = 0; i < buttonsArray.length; i++){
        const element = buttonsArray[i];
        var el = document.createElement("btn")
        el.innerHTML = element
        ButtonEvent(el, insertCalc, element)
        if(element=='='){
            el.classList.add("big")
        }
        buttons.appendChild(el)
    }

    var historybtn = document.createElement("i")
    historybtn.classList.add("m-i")
    historybtn.classList.add("historybtn")
    historybtn.innerText = "history"
    ButtonEvent(historybtn, function(){
        history.classList.add("active")
        if(history.childElementCount==1){
            var noYet = document.createElement("p")
            noYet.innerText = "There's no history yet. Go do some math!"
            history.appendChild(noYet)
        }
    })
    var closehistory = document.createElement('x')
    closehistory.classList.add("m-i")
    closehistory.innerText = "close"
    ButtonEvent(closehistory, function(){
        history.classList.remove("active")
        setTimeout(() => {
            if(history.querySelector('p')){
                history.children[1].remove()
            }
        }, 300);
    })
    history.appendChild(closehistory)

    var lasthistory = document.createElement("lasthistory")
    ButtonEvent(lasthistory, function(){
        output.value = lasthistory.innerText
        lasthistory.innerText = ''
    })
    calculator.appendChild(lasthistory)

    calculator.appendChild(output)
    calculator.appendChild(history)
    calculator.appendChild(historybtn)
    calculator.appendChild(buttons)
    document.getElementById("calculatorcheckmark").style.display = "block"
    calculator.close = function(){
        document.getElementById("calculatorcheckmark").style = ""
    }
    windowApp(calculator, "Calculator", "calculate")
}

function toggleCalculator(){
    var check = windowAppExists("Calculator")
    if(check===false){
        calculator()
    }
    else{
        activeWindows[check].close()
    }
}


var wordcounterVisible = false
var wordcounter
function WordCounter(){
    wordcounter = document.createElement("wordcounter")
    wordcounter.classList.add("transition")
    var info = document.createElement("p")
    var wordsEl = document.createElement("words")
    var wordsText = document.createTextNode(" Words • ");
    var symbolsEl = document.createElement("symbols")
    var symbolsText = document.createTextNode(" Symbols");
    var selectionEl = document.createElement("selection")
    info.appendChild(wordsEl)
    info.appendChild(wordsText)
    info.appendChild(symbolsEl)
    info.appendChild(symbolsText)
    info.appendChild(selectionEl)
    wordcounter.update = function(){
        var text = $(notearea).text()
        var words = text.split(' ')
        if(text.length==0){
            words = ''
        }
        wordsEl.innerText = words.length
        symbolsEl.innerText = text.length 
    }
    wordcounter.updateSelection = function(){
        var selectedText = getSeletedText()
        if(selectedText.length != 0){
            selectionEl.innerText = " • " + selectedText.length + " Selected"
        }
        else{
            selectionEl.innerText = ""
        }
    }
    wordcounter.update()
    wordcounter.appendChild(info)
    wordcounterVisible = true
    notearea.classList.add("wordcounter")
    document.getElementById("wordcountercheckmark").style.display = "block"
    wordcounter.close = function(){
        wordcounterVisible = false
        notearea.classList.remove("wordcounter")
        document.getElementById("wordcountercheckmark").style = ""
        wordcounter.classList.add("transition")
        setTimeout(() => {
            wordcounter.classList.remove("transition")
            wordcounter.remove()
        }, 200);
    }
    var closeBtn = document.createElement("x")
    closeBtn.classList.add('m-i')
    closeBtn.innerText = "close"
    ButtonEvent(closeBtn, wordcounter.close)
    wordcounter.appendChild(closeBtn)
    var maximizeBtn = document.createElement("x")
    maximizeBtn.classList.add('m-i')
    maximizeBtn.innerText = "open_in_new"
    ButtonEvent(maximizeBtn, function(){
        notearea.classList.remove("wordcounter")
        windowApp(wordcounter, "Word Counter", "pin")
    })
    wordcounter.appendChild(maximizeBtn)
    app.appendChild(wordcounter)
    setTimeout(() => {
        wordcounter.classList.remove("transition")
    }, 10);
}

notearea.addEventListener("input", function(e){
    if(wordcounterVisible==true){
        wordcounter.update()
        if(e.inputType=="deleteContentBackward" || e.inputType=="deleteContentForward"){
            wordcounter.updateSelection()
        }
    }
})
document.addEventListener("selectionchange", function(){
    if(wordcounterVisible==true){ // detect if the parent parent is notearea
        wordcounter.updateSelection()
    }
})

function toggleWordCounter(){
    var check = windowAppExists("Word Counter")
    if(check===false){
        if(wordcounterVisible==true){
            wordcounter.close()
        }
        else{
            WordCounter()
        }
    }
    else{
        activeWindows[check].close()
    }
}


var fullscreencheckmark = document.getElementById("fullscreencheckmark");

function togglefullscreen(){
  if(fullscreen==false){
    openFullscreen();
  }
  else{
    closeFullscreen();
  }
}


var hadfun = false
function fun(funny){
    if(funny==1){
        if(!hadfun){
            hadfun = true
            PushNotification("A lot of clicks!", "You clicked that button 10 times")
        }
    }
}


var clipboard = document.createElement("clipboard")

function showClipboard(){
    var show = showContext()
    const selObj = window.getSelection()
    const selRange = selObj.getRangeAt(0)
    const selectionPosition = selRange.getBoundingClientRect()
    contextMenu.style.top = selectionPosition.bottom + "px"
    contextMenu.style.left = selectionPosition.right + "px"
    var heading = document.createElement("pr")
    heading.classList.add("heading")
    heading.innerText = 'Clipboard history'
    contextMenu.appendChild(heading)
    contextMenu.style.maxHeight = "400px"
    contextMenu.style.overflow = "auto"
    for(let i = 0; i < wnclipboard.length; i++){
        const clipboardData = wnclipboard[i]
        var element = document.createElement("p")
        element.innerHTML = clipboardData
        ButtonEvent(element, function(){
            document.execCommand("insertHTML", false, clipboardData)
            hideContext()
        })
        contextMenu.appendChild(element)
    }
    show()
}

document.addEventListener("keydown", function(e){
    if(e.ctrlKey && e.altKey && e.key == "v"){
        showClipboard()
    }
})


function numeralConvert(range, e){
    var number = range.toString()
    const show = showContext()
    contextMenu.style.top = e.clientY + 260 + "px"
    contextMenu.style.left = e.clientX + "px"
    contextMenu.style.maxWidth = "320px"

    var processedNumber = ''
    var heading = document.createElement("pr")
    heading.classList.add("heading")
    heading.style.whiteSpace = "initial"
    heading.style.overflow = "auto"
    heading.innerText = 'Convert '+number+' to '+processedNumber
    contextMenu.appendChild(heading)

    var input = document.createElement("input")
    input.placeholder = "A number (from 2 to 36)"
    input.addEventListener("input", function(){
        if(this.value >= 2 && this.value <=36){
            number = parseInt(number)
            processedNumber = number.toString(this.value)
            heading.innerText = 'Convert '+number+' to '+processedNumber
        }
    })
    contextMenu.appendChild(input)

    var convert = document.createElement("p")
    convert.innerText = "Convert"
    convert.style.marginTop = "8px"
    ButtonEvent(convert, function(){
        replaceSelection(range, processedNumber)
        hideContext()
    })
    contextMenu.appendChild(convert)

    show()
}


// Word Wrap

var wordwrapcheckmark = document.getElementById("wordwrapcheckmark");
if(settings.wordwrap!=false){
    wordwrapcheckmark.style.display = "block";
}
else{
    notearea.classList.add("wordwrap")
}

function togglewordwrap(){
    console.log(settings.wordwrap)
    if(settings.wordwrap==false){
        delete settings.wordwrap
        wordwrapcheckmark.style.display = "block"
        notearea.classList.remove("wordwrap")
    }
    else{
        settings.wordwrap = false
        wordwrapcheckmark.style.display = "none"
        notearea.classList.add("wordwrap")
    }
    SaveSettings()

    if(linestoggle==true){
        var divs = notearea.getElementsByTagName("p")
        UpdateLines(divs)
    }
}

// Lines

var linestoggle = false
var lines = document.createElement("div")
lines.id = "lines"
app.appendChild(lines)
var lastlinesnumber
var timeoutlines = false
var lineheight

function togglelines(){
    if(linestoggle==false){
        linestoggle=true
        var divs = notearea.getElementsByTagName("p")
        UpdateLines(divs)
        linescheckmark.style.display = "block"
        notearea.style.marginLeft = "40px"
        notearea.style.width = "calc(100% - 40px)"
        lines.style.left = "0"
    }
    else{
        linestoggle=false
        linescheckmark.style.removeProperty("display")
        notearea.style.removeProperty("margin-left")
        notearea.style.removeProperty("width")
        lines.style.removeProperty("left")
        setTimeout(function() {
            lines.innerHTML = ""
        }, 300);
    }
}

notearea.addEventListener('input', function() {
    if(linestoggle==true){
        var divs = notearea.getElementsByTagName("p")
        if(lastlinesnumber!=divs.length){
            if(timeoutlines==false){
                timeoutlines = true
                UpdateLines(divs)
                setTimeout(function (){ 
                    timeoutlines = false
                }, 150);
            }
        }
    }
})

function UpdateLines(divs){
    lastlinesnumber = divs.length
    lines.innerHTML = ""
    if(divs.length>99){
        lines.style.width = "50px"
        notearea.style.marginLeft = "50px"
        notearea.style.width = "calc(100% - 50px)"
        if(divs.length>999){
            lines.style.width = "60px"
            notearea.style.marginLeft = "60px"
            notearea.style.width = "calc(100% - 60px)"
        }
    }
    try {
        for (let i = 0; i < divs.length; i++) {
            var linenumber = i+1
            lines.innerHTML += "<l>" + linenumber + "</l>"
            if(!lineheight){
                lineheight = divs[i].offsetHeight
            }
            for (let j = 0; j < divs[i].offsetHeight/lineheight; j++) {
                lines.innerHTML += "<br>"
            }
        }
    } catch (e) {
        
    }
    lines.scrollTop = notearea.scrollTop
}

var linesresizetimeout;
window.addEventListener("resize", function(){
    if(linestoggle==true && settings.wordwrap==true){
        var divs = notearea.getElementsByTagName("p")
        clearTimeout(linesresizetimeout);
        linesresizetimeout = setTimeout(UpdateLines(divs), 100);
    }
})

notearea.addEventListener("scroll", function(){
    if(linestoggle==true){
        lines.scrollTop = notearea.scrollTop
    }
})
//

//Writing direction

document.getElementById("ltrcheckmark").style.display = "block";
function direction(n){
  var all = notearea.getElementsByTagName("p")//* is creating problems
  if(n){
    //settings = {...settings, direction: "r"};
    document.getElementById("rtlcheckmark").style.display = "block";
    document.getElementById("ltrcheckmark").style.display = "none";
    if(notearea.innerHTML){
        for (let i = 0; i < all.length; i++) {
            all[i].style = "display:inline-block"
            var animmove = window.innerWidth - all[i].offsetWidth-24
            if(linestoggle==true){
                animmove -= 38
            }
            all[i].style = "transition: 1s;transform: translateX("+animmove+"px);"
        }
        
        setTimeout(function (){
            for (let i = 0; i < all.length; i++) {
                all[i].style = ""
            }
            notearea.style.textAlign = "right";
        }, 1000);
    }
    else{
        notearea.style.textAlign = "right";
    }
  }
  else{
    //delete settings.direction;
    document.getElementById("ltrcheckmark").style.display = "block";
    document.getElementById("rtlcheckmark").style.display = "none";
    if(notearea.innerHTML){
        var all = notearea.getElementsByTagName("p")
        for (let i = 0; i < all.length; i++) {
            all[i].style = "display:inline-block"
            var animmove = window.innerWidth - all[i].offsetWidth-24
            if(linestoggle==true){
                animmove -= 38
            }
            all[i].style = "transition: 1s;transform: translateX(-"+animmove+"px);"
        }
        
        setTimeout(function (){
            for (let i = 0; i < all.length; i++) {
                all[i].style = ""
            }
            notearea.style.removeProperty('text-align');
        }, 1000);
    }
    else{
        notearea.style.removeProperty('text-align');
    }
  }
  SaveSettings();
}


function insertRich(type){
    var gui = document.createElement("div")
    gui.classList.add("insertRich")
    app.appendChild(gui)

    function closeGui(){
        newfile.classList.remove("newfiletransitioned")
        setTimeout(() => {
            newfile.remove()
        }, 200);
    }
    var closeModal = ShowModal(closeGui, null, 31)
}