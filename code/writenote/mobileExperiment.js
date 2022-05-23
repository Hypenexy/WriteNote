var mobileHeaderButton = document.createElement("button")

var mobileHeaderButtonFile = "Untitled <p class='m-i'>cloud</p> • "

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
    mobileHeaderButton.innerHTML = mobileHeaderButtonFile + getMobileStatus()
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
app.appendChild(mobileHeaderMenu)


function toggleHeaderMobileMenu(){
    if(!mobileHeaderMenu.classList.contains("mobilemenuactive")){
        showHeaderMobileMenu()
    }
    else{
        hideHeaderMobileMenu()
    }
}
function showHeaderMobileMenu(){
    mobileHeaderMenu.classList.add("mobilemenuactive")
    mobileHeaderButton.classList.add("mobilebuttonactive")
}
function hideHeaderMobileMenu(){
    mobileHeaderMenu.classList.remove("mobilemenuactive")
    mobileHeaderButton.classList.remove("mobilebuttonactive")
}


window.addEventListener('click', function (e){
    if(mobileHeaderMenu.classList.contains("mobilemenuactive")){
        if(!mobileHeaderMenu.contains(e.target) && !mobileHeaderButton.contains(e.target)){
            hideHeaderMobileMenu()
        }
    }
})