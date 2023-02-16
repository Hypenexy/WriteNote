function initWidget(element){
    var widget = document.createElement("widget")
    var closebtn = document.createElement("x")
    closebtn.classList.add('m-i')
    closebtn.innerText = "close"
    widget.removeFunction = function(){
        widget.classList.add("transition")
        setTimeout(function(){
            widget.remove()
        }, 200);
    }
    ButtonEvent(closebtn, widget.removeFunction)
    widget.appendChild(closebtn)
    widget.appendChild(element)
    widget.classList.add("transition")
    app.appendChild(widget)
    setTimeout(function(){
        widget.classList.remove("transition")
    }, 10);
}

function timer(){
    var element = document.createElement("div")
    element.innerHTML = "Timer"

    initWidget(element)
}