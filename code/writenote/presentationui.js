function startPresent(){
    openSlide(0)
}

function openSlide(i){
    var slides = presentationUI.getElementsByTagName("slides")[0]
    var IMGs = slides.getElementsByTagName("img")
    openFullscreen(IMGs[i])
}

var presentationUI = document.createElement("presentationUI")
function initPresentation(){
    notearea.style.display = "none"

    var presentButton = document.createElement("present")
    presentButton.innerText = "Present"
    presentButton.classList.add("btn")
    ButtonEvent(presentButton, startPresent)
    presentationUI.appendChild(presentButton)

    var slides = document.createElement("slides")
    for (let i = 0; i < 8; i++) {
        var element = document.createElement("img")
        element.src = "presentation/"+i+".svg"
        slides.appendChild(element)
    }
    presentationUI.appendChild(slides)

    var addSlide = document.createElement("addslide")
    addSlide.innerText = "Add slide"
    addSlide.classList.add("btn")
    presentationUI.appendChild(addSlide)

    app.appendChild(presentationUI)
}
// initPresentation()

