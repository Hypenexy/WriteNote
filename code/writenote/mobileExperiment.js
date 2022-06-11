var mobileHeaderButton = document.createElement("button") // Consider removing the background and border, gets more clean!

var mobileHeaderButtonFile = ""

function getTime(){
    var time = new Date()

    var minutes = time.getMinutes()
    if(minutes<10){
        minutes = "0" + minutes
    }

    return time.getHours() + ":" + minutes
}
var batterystatus = {empty:true}
var onlinestatus = ""
var batterystatusprocessed = ""
function setMobileStatusFile(name, space){
    var statusProcessed = name
    //e.g. "Untitled <p class='m-i'>cloud</p> • "
    switch (space) {
        case "localstorage":
            statusProcessed += " <p class='m-i'>web</p> • "
            break;
        case "online":
            statusProcessed += " <p class='m-i'>cloud</p> • "
            break;
        case "device":
            statusProcessed += " <p class='m-i'>desktop_windows</p> • "
            break;
        default:
            break;
    }
    mobileHeaderButtonFile = statusProcessed
    UpdateMobileStatus(false)
}
function setMobileStatus(){
    if(online){
        onlinestatus = "<p class='m-i'>wifi</p>"
    }
    else{
        onlinestatus = "<p class='m-i'>wifi_off</p>"
    }
    if(batteryIsSupported){
        if(batterystatus.empty == false){
            if(batterystatus.charging==true&&batterystatus.chargingTime==0){
                batterystatusprocessed = ""
            }
            else{
                if(batterystatus.charging){
                    batterystatusprocessed = "<p class='m-i'>battery_charging_full</p>"
                }
                else{
                    var batterylevel = batterystatus.level*100
                    var batteryicon = "<p class='m-i'>battery_full</p>"
                    if(batterylevel<87.5){//is there a better way to do this?? maybe
                        batteryicon = "<p class='m-i'>battery_6_bar</p>"
                        if(batterylevel<75){
                            batteryicon = "<p class='m-i'>battery_5_bar</p>"
                            if(batterylevel<62.5){
                                batteryicon = "<p class='m-i'>battery_4_bar</p>"
                                if(batterylevel<50){
                                    batteryicon = "<p class='m-i'>battery_3_bar</p>"
                                    if(batterylevel<37.5){
                                        batteryicon = "<p class='m-i'>battery_2_bar</p>"
                                        if(batterylevel<25){
                                            batteryicon = "<p class='m-i'>battery_1_bar</p>"
                                            if(batterylevel<12.5){
                                                batteryicon = "<p class='m-i'>battery_0_bar</p>"
                                                if(batterylevel<1){
                                                    batteryicon = "<p class='m-i'>battery_alert</p>"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    batterystatusprocessed = batteryicon + batterylevel + "%"
                }
            }
        }
        else{
            batterystatusprocessed = ""
        }
    }
}
function getMobileStatus(){
    //calculate wifi and stuff, battery :D
    //maybe its too frequent to check battery and connection?
    //nah they will be variables and they have their events!
    return getTime() + " " + batterystatusprocessed + " " + onlinestatus
}


const batteryIsSupported = navigator && 'getBattery' in navigator 

if(batteryIsSupported){
    navigator.getBattery().then(function(battery) {
        batterystatus = battery
        batterystatus.empty = false
        battery.addEventListener('chargingchange', function(){
            batterystatus.charging = battery.charging.
            setMobileStatus()
            if(battery.charging==true){
                batterystatus.charging = true
                // pushNotification("Device is charging!", "")
            }
            else{
                batterystatus.charging = false
                // pushNotification("Device is no longer charging.", "")
            }
        })
    
        battery.addEventListener('levelchange', function(){
            batterystatus.level = battery.level
            setMobileStatus()
            if(battery.level * 100 == 30){
                if(battery.charging==false){
                    // pushNotification("Battery is draining.", "A friendly reminder to charge your device")
                }
            }
            if(battery.level * 100 == 10 && battery.level * 100 == 5){
                if(battery.charging==false){
                    // pushNotification("Battery critically low!", "Make sure your work is saved.", "warn")
                }
            }
        })

        // battery.addEventListener('chargingtimechange', () => {
        //     updateChargingInfo()
        // })
        // battery.addEventListener('dischargingtimechange', () => {
        //     updateDischargingInfo()
        // })
    })
}


function UpdateMobileStatus(loop){
    mobileHeaderButton.innerHTML = mobileHeaderButtonFile + getMobileStatus()
    if(loop!=false){
        setTimeout(UpdateMobileStatus, 2000);
    }
}

setMobileStatus()
UpdateMobileStatus()

mobileHeaderButton.classList.add("mobilebutton")
ButtonEvent(mobileHeaderButton, toggleHeaderMobileMenu)
header.appendChild(mobileHeaderButton)

profilepanelbtn.remove()
notificationsbtn.remove()



var mobileHeaderMenu = document.createElement("div")

mobileHeaderMenu.classList.add("mobilemenu")
mobileHeaderMenu.innerHTML = "<actionmenu><vs class='m-i'>account_circle</vs><vs class='m-i'>volume_up</vs><vs class='m-i'>light_mode</vs><vs class='m-i'>contrast</vs><vs class='m-i'>settings</vs></actionmenu><mv>Hypenexy</mv>"
if(!settings.ft){
    if(mobile){
        mobileHeaderMenu.innerHTML += "<helper>Swipe Up to close</helper>"
    }
    else{
        mobileHeaderMenu.innerHTML += "<helper>Press Esc to close</helper>"
    }
}
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

window.addEventListener('keydown', function(e){
    if(e.key == "Escape"){
        if(mobileHeaderMenu.classList.contains("mobilemenuactive")){
            hideHeaderMobileMenu()
            notearea.focus()
        }
    }
})

//cool looking filter, might add into mobile menu later ;)
//filter: contrast(1.5)brightness(1)sepia(1);





document.addEventListener('swiped-up', function(e) {
    if(mobileHeaderMenu.classList.contains("mobilemenuactive")){
        // if(e.detail.yStart > window.innerHeight/2){
            hideHeaderMobileMenu()
        // }
    }
})

document.addEventListener('swiped-down', function(e) {
    if(e.detail.yStart < 100){
        showHeaderMobileMenu()
    }
})