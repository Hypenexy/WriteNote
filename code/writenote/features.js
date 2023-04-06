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


function WordCounter(){
    var wordcounter = document.createElement("wordcounter")
    document.getElementById("wordcountercheckmark").style.display = "block"
    wordcounter.close = function(){
        document.getElementById("wordcountercheckmark").style = ""
    }
    windowApp(wordcounter, "Word Counter", "pin")
}

function toggleWordCounter(){
    var check = windowAppExists("Word Counter")
    if(check===false){
        WordCounter()
    }
    else{
        activeWindows[check].close()
    }
}
