var mobileHeaderButton = document.createElement("button")

function getTime(){
    var time = new Date()

    var minutes = time.getMinutes()
    if(minutes<10){
        minutes = "0" + minutes
    }

    return time.getHours() + ":" + minutes
}

function getMobileStatus(){
    //calculate wifi and stuff, battery :D
    //maybe its too frequent to check battery and connection?
    //nah they will be variables and they have their events!
    return getTime() + " <p class='m-i'>battery_full</p> <p class='m-i'>wifi</p>"
}

function UpdateMobileStatus(){
    mobileHeaderButton.innerHTML = getMobileStatus()
    setTimeout(UpdateMobileStatus, 2000);
}

UpdateMobileStatus()

mobileHeaderButton.classList.add("mobilebutton")
ButtonEvent(mobileHeaderButton, toggleHeaderMobileMenu)
header.appendChild(mobileHeaderButton)

profilepanelbtn.remove()
notificationsbtn.remove()



var mobileHeaderMenu = document.createElement("div")

mobileHeaderMenu.classList.add("mobilemenu")
mobileHeaderMenu.innerHTML = "<vs class='m-i'>account_circle</vs><vs class='m-i'>settings</vs><br><mv>Hypenexy</mv>"
header.appendChild(mobileHeaderMenu)


function toggleHeaderMobileMenu(){
    if(mobileHeaderMenu.style.visibility != "visible"){
        showHeaderMobileMenu()
    }
    else{
        hideHeaderMobileMenu()
    }
}
function showHeaderMobileMenu(){
    mobileHeaderMenu.style.visibility = "visible"
    mobileHeaderMenu.style.height = "calc(90% - 40px)"
    mobileHeaderMenu.style.paddingTop = "12px"
    mobileHeaderButton.style.border = "1px solid #bbb"
    mobileHeaderButton.style.marginRight = "-1px"
}
function hideHeaderMobileMenu(){
    mobileHeaderMenu.style = ""
    mobileHeaderButton.style = ""
}


window.addEventListener('click', function (e){
    if(mobileHeaderMenu.style.visibility == "visible"){
        if(!mobileHeaderMenu.contains(e.target) && !mobileHeaderButton.contains(e.target)){
            hideHeaderMobileMenu()
        }
    }
})