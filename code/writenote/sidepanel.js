var sidepanelOpen = false
var sidepanel = document.createElement("sidepanel")
var sidepanelHTML = '<svg class="x" width="48" height="48" viewBox="0 0 64 64"><rect x="4" y="8" width="56" height="8" rx="4" ry="4"></rect><rect x="4" y="28" width="56" height="8" rx="4" ry="4"></rect><rect x="4" y="48" width="56" height="8" rx="4" ry="4"></rect></svg>'
sidepanel.innerHTML = sidepanelHTML
app.appendChild(sidepanel)

//This function is not used anywhere.
function toggleSidepanel(){
    if(sidepanelOpen){
        closeSidepanel()
    }
    else{
        openSidepanel()
    }
}

function openSidepanel(menu){
    if(storedResponse){
        if(sidepanel.innerText==""){
            sidepanel.innerHTML += "<content></content>"
            WelcomeGui(storedResponse, sidepanel)
        }
        if(menu=="open"){
            sidepanel.classList.add("sidepanelmoreactive")
            sidepanel.classList.add("sidepanelmostactive")
        }
    }
    ButtonEvent(sidepanel.getElementsByTagName("svg")[0], closeSidepanel)
    sidepanelOpen = true
    sidepanel.classList.add("sidepanelactive")
}

function closeSidepanel(){
    if(sidepanel.classList.contains("sidepanelmoreactive")){
        sidepanel.classList.add("sidepanelmostactivereverse")
        setTimeout(() => {
            sidepanel.classList.remove("sidepanelmostactive")
            sidepanel.classList.remove("sidepanelmoreactive")
            sidepanel.classList.remove("sidepanelmostactivereverse")
            sidepanel.classList.add("sidepanelactive")
        }, 300);
    }
    else{
        sidepanel.classList = ""
        sidepanelOpen = false
    }
}

window.addEventListener('click', function (e) {
    if(sidepanelOpen){
        if (!sidepanel.contains(e.target) && !SidePanelButton.contains(e.target)){
            // if(!e.target.classList.contains("folder") || !e.target.parentNode.classList.contains("folder")){   
            closeSidepanel()
            // }
        }
    }
})

document.addEventListener("keydown", function(e){
    if(sidepanelOpen){
        if(e.key == "Escape"){
            closeSidepanel()
            notearea.focus()
        }
    }
})

document.addEventListener('swiped-left', function(e) {
    if(sidepanelOpen){
        closeSidepanel()
    }
})

document.addEventListener('swiped-right', function(e) {
    if(e.detail.xStart < 100){
        openSidepanel()
    }
})