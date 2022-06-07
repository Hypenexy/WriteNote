var sidepanelOpen = false
var sidepanel = document.createElement("sidepanel")
sidepanel.innerHTML = '<svg class="x" width="48" height="48" viewBox="0 0 64 64"><rect x="4" y="8" width="56" height="8" rx="4" ry="4"></rect><rect x="4" y="28" width="56" height="8" rx="4" ry="4"></rect><rect x="4" y="48" width="56" height="8" rx="4" ry="4"></rect></svg>'
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

function openSidepanel(){
    sidepanelOpen = true
    sidepanel.style.width = "300px"
    sidepanel.style.borderRight = "solid 1px #eeeeee33"
}

function closeSidepanel(){
    sidepanelOpen = false
    sidepanel.style.width = "0"
    sidepanel.style.borderRight = "solid 0px #111"
}

window.addEventListener('click', function (e) {
    if(sidepanelOpen){
        if (!sidepanel.contains(e.target) && !SidePanelButton.contains(e.target)) {
            closeSidepanel()
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

var SidePanelXBtn = sidepanel.getElementsByTagName("svg")[0]
ButtonEvent(SidePanelXBtn, closeSidepanel)