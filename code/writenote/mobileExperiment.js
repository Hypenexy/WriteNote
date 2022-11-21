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
var onlinestatus, batterystatusprocessed, notificationstatus = ""
function setMobileStatusFile(name, space){
    currentNoteEdit.value = name
    currentnote.getElementsByTagName("notespace")[0].innerHTML = activefile.space
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
                            batteryicon = "<p class='m-i'>battery_5_bar</p>"//This doesn't load!
                            if(batterylevel<62.5){
                                batteryicon = "<p class='m-i'>battery_4_bar</p>"//This as well
                                if(batterylevel<50){
                                    batteryicon = "<p class='m-i'>battery_3_bar</p>"//Also it shows 57.9999999999999999% ??
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
    if(notificationslog){
        if(notificationslog.length!=0){
            notificationstatus = "<p class='m-i'>mark_email_unread</p>"
        }
        else{
            notificationstatus = ""
        }
    }
    else{
        notificationstatus = ""
    }
}
function getMobileStatus(){
    return getTime() + " " + batterystatusprocessed + " " + onlinestatus + " " + notificationstatus
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
mobileHeaderMenu.innerHTML = "<h1>11/11/2022</h1><currentnote><i class='m-i'>description</i><input><workspace></workspace><notespace></notespace><notesize></notesize></currentnote>"+
"<actionmenu><vs class='m-i'>account_circle</vs><vs class='m-i'>volume_up</vs><vs class='m-i'>light_mode</vs><vs class='m-i'>contrast</vs><vs class='m-i'>settings</vs></actionmenu>"
if(!settings.ft){
    if(mobile){
        mobileHeaderMenu.innerHTML += "<helper>Swipe Up to close</helper>"
    }
    else{
        mobileHeaderMenu.innerHTML += "<helper>Press Esc to close</helper>"
    }
}
app.appendChild(mobileHeaderMenu)

var currentnote = mobileHeaderMenu.getElementsByTagName("currentnote")[0]
var currentNoteEdit = currentnote.getElementsByTagName("input")[0]
currentNoteEdit.onkeydown = currentNoteEdit.onchange = function(){
    // this.style.width = ((this.value.length + 1) * 8) + "px"
}

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
    setTimeout(function(){
        mobileHeaderMenu.classList.add("mobilemenuoverflow")
    }, 210);
    var date = new Date();
    var todaydate = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear()
    mobileHeaderMenu.getElementsByTagName("h1")[0].innerHTML = todaydate
    var notesize = currentnote.getElementsByTagName("notesize")[0]
    var roughSize = roughSizeOfObject(notearea.innerHTML)
    notesize.innerHTML = humanFileSize(roughSize)
    var notespace = currentnote.getElementsByTagName("notespace")[0]
    notespace.innerHTML = activefile.space
    var noteworkspace = currentnote.getElementsByTagName("workspace")[0]
    noteworkspace.innerHTML = workspace
    // var notifications = notificationspace.getElementsByTagName("notification")
    // var length = notifications.length
    // for (let i = 0; i < length; i++) {
    //     mobileHeaderMenu.appendChild(notifications[i])
    // }
    
    while (notificationspace.childNodes.length > 0) {
        mobileHeaderMenu.appendChild(notificationspace.childNodes[0]);
    }
}
function hideHeaderMobileMenu(){
    mobileHeaderMenu.classList.remove("mobilemenuoverflow")
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


var notificationspace = document.createElement("notificationspace")
app.appendChild(notificationspace)

var notificationslog = []
/**
 * 
 * @param {String} ti Title
 * @param {HTMLElement} desc Contents
 * @param {String} type Type, either null or "warn" 
 * @param {ArrayWithFunctions} action Array of actions for button elements
 */
function PushNotification(ti, desc, type, action){
    var notificationid = getRandomInt(1, 4)
    var notificationsound = "notification"
    switch (notificationid) {
        case 2:
            notificationsound = "notification2"
            break;
        case 3:
            notificationsound = "notificationalt"
            break;
    }
    playSound("img/sounds/"+notificationsound+".mp3")
    var time = new Date()
    var minutes = time.getMinutes()
    if(minutes<10){
        minutes = "0" + minutes
    }
    var timeformatted = time.getHours() + ":" + minutes

    notificationslog.push([ti, desc, type, action, time])
    setMobileStatus()
    getMobileStatus()// what
    var notification = document.createElement("notification")
    var removed = false
    notification.tabIndex = 0
    notification.innerHTML = "<x class='m-i'>close</x><date>"+timeformatted+"</date><ti>"+ti+"</ti><desc>"+desc+"</desc>"
    if(mobileHeaderMenu.classList[1] == "mobilemenuactive"){
        mobileHeaderMenu.appendChild(notification)
    }
    else{
        notificationspace.appendChild(notification)
    }
    if(type){
        switch(type){
            case "warn":
                notification.classList.add("notificationwarn")
                break;
            case "succ":
                notification.classList.add("notificationsucc")
                break;
        }
    }
    setTimeout(function(){
        notification.classList.add("notificationshown")
    }, 10);

    function moveNotificationTimeout(){
        setTimeout(function(){
            if(!removed){
                if(notification.parentElement != mobileHeaderMenu){
                    if(!notificationspace.matches(':hover')){
                        notification.classList.add("notificationmove")
                        setTimeout(function(){
                            mobileHeaderMenu.appendChild(notification)
                            notification.classList.remove("notificationmove")
                        }, 300)
                    }
                    else{
                        moveNotificationTimeout()
                    }
                }
            }
        }, 5000)
    }
    moveNotificationTimeout()

    ButtonEvent(notification.getElementsByTagName("x")[0], function(){
        removed = true
        notification.classList.remove("notificationshown")

        var otherNotifications = notification.parentElement.getElementsByTagName("notification")
        var reachedYet = false
        for (let i = 0; i < otherNotifications.length; i++) {
            const element = otherNotifications[i];
            if(reachedYet){
                var heigth = notification.offsetHeight + 20 //not the best but good enough
                element.style.transform = "translateY(-"+heigth+"px)"
            }
            if(element==notification){
                reachedYet = true
            }
        }

        setTimeout(function(){
            for (let i = 0; i < otherNotifications.length; i++) {
                otherNotifications[i].style = "transition: initial"
            }
            notification.remove()

            var index = -1
            for (let i = 0; i < notificationslog.length; i++) {
                const element = notificationslog[i]
                index++
                if(element==[ti, desc, type, action, time]){
                    return;
                }
            }

            if (index > -1) {
                notificationslog.splice(index, 1)
            }

            if(otherNotifications.length==0){
                setMobileStatus()
                getMobileStatus()
            }

            for (let i = 0; i < otherNotifications.length; i++) {
                otherNotifications[i].style = ""
            }
        }, 300)
    })
}


// Just realized I could remove the background and add smooth appearing animation to all elements and
// make it like Chrome OS and Windows 11 notifications. But why would i
setTimeout(() => {

    PushNotification("Hey there!", "You've successfully installed WriteNote!")
    PushNotification("A second one?!", "Whoa there can be a lot of notifications right? I mean what am I thinking.")
    setTimeout(() => {
        PushNotification("<i class='m-i'>warning</i> oh god", "There has been a change in login details.", "warn")
    }, 1500);
}, 2050);