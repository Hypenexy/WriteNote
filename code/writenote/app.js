var app = document.getElementsByTagName("app")[0]
var mobile, interacted = false
if(isApp!=true){
    var isApp = false
}
var animations = true
var online
var serverAddress = "http://localhost/"
var serverImage = "http://i.localhost/"
var server =  "http://writenote.localhost/"
var settings = {}
var firstTime = false
if(localStorage.getItem("options")){
    settings = JSON.parse(localStorage.getItem("options"))
}
else{
    firstTime = true
}
settings.version = "3.0.0"
var themes = {
    "Dark" : {
        "desc" : "The default WriteNote look",
        "wncolor" : "#222242",
        "textcolor" : "#fff",
    },
    "Light" : {
        "desc" : "Bright and enlightening",
        "wncolor" : "#fff",
        "textcolor" : "#111",
    },
    "Experience" : {
        "desc" : "Nostalgic and alive",
        "wncolor" : "#00FF7F",
        "textcolor" : "#111", 
    }
}
if(settings.theme){
    changeTheme(settings.theme)
}
if(settings.language){ // Languages will be updated to use the method in experiments/mduiTesting/index.html at ui.updateLocalization()
    changeLanguage(settings.language)
}
// background: rgb(112,91,128); background: linear-gradient(36deg, rgba(112,91,128,1) 0%, rgba(239,183,229,1) 47%, rgba(34,34,66,1) 100%);

var contextMenu

function hideContext(){
    if(contextMenu.closeFunc){
        contextMenu.closeFunc()
    }
    contextMenu.classList.add("transition")
    var altVar = contextMenu
    contextMenu = ""
    setTimeout(() => {
        altVar.remove()
        altVar = ""
    }, 200);
}

/**
 * Cool contextmenu function
 * @returns The function which shows the context menu
 */
function showContext(){
    if(contextMenu && contextMenu.nodeType){
        hideContext()
    }

    contextMenu = document.createElement("div")
    contextMenu.classList.add("contextmenu")
    contextMenu.classList.add("transition")

    function show(){
        app.appendChild(contextMenu)
        var offset = normalizeOffset(getBoundingClientRectObject(contextMenu))
        contextMenu.style.transition = 'initial'
        contextMenu.style.top = offset.top + "px"
        contextMenu.style.left = offset.left + "px"
        setTimeout(() => {
            contextMenu.style.transition = ''
            contextMenu.classList.remove("transition")
        }, 5);
    }
    return show;
}

// document.addEventListener("contextmenu", function(e){
    // e.preventDefault();
    // Probably uncomment after everything is supported with
    // custom context menus. Yes, even the inputs inside the
    // other context menus so you should make a child context
    // menu.
// })

document.addEventListener("click", function(e){
    if(contextMenu && contextMenu.nodeType){
        if(e.target != contextMenu && e.target.parentElement != contextMenu && e.target.parentElement.parentElement != contextMenu){
            hideContext()
        }
        else{
            e.preventDefault()
            e.stopPropagation()
        }
    }
})

function createSelect(defaultOption, isPlaceholder, usingNames){
    var select = document.createElement("mselect")
    if(usingNames){
        select.innerHTML = usingNames + "<i>arrow_drop_down</i>"
    }
    else{
        select.innerHTML = defaultOption + "<i>arrow_drop_down</i>"
    }
    var options = []
    if(!isPlaceholder){
        if(usingNames){
            options.push([defaultOption, usingNames])
        }
        else{
            options.push(defaultOption)
        }
    }
    var action
    select.addAction = function(func){
        action = func
    }
    if(usingNames){
        select.selecion = usingNames
    }
    else{
        select.selecion = defaultOption
    }
    select.addOption = function(value, name){
        if(name){
            options.push([value, name])
        }
        else{
            options.push(value)
        }
    }
    select.addEventListener("click", function(e){
        if(!select.classList.contains("active")){
            select.classList.add("active")
            select.innerHTML = select.selecion + "<i>arrow_drop_up</i>"
            var show = showContext()
            contextMenu.closeFunc = function(){
                document.removeEventListener("keydown", searchContextMenu)
                select.classList.remove("active")
                select.innerHTML = select.selecion + "<i>arrow_drop_down</i>"
            }
            var boundingRect = this.getBoundingClientRect()
            contextMenu.style.top = Math.trunc((boundingRect.bottom + 4)) + "px"
            contextMenu.style.left = Math.trunc(boundingRect.left) + "px"
            var search = document.createElement("input")
            search.placeholder = "Search"
            function searchContextMenu(){
                if(document.activeElement!=search){
                    search.focus()
                }
            }
            document.addEventListener("keydown", searchContextMenu)
            function searchEvent(){
                var options = contextMenu.getElementsByTagName("p")
                for (let i = 0; i < options.length; i++) {
                    const element = options[i]
                    if(!element.innerText.toLowerCase().includes(search.value.toLowerCase())){
                        element.style.display = "none"
                    }
                    else{
                        element.style.removeProperty("display")
                    }
                }
            }
            search.addEventListener("input", searchEvent)
            contextMenu.appendChild(search)
            options.forEach(value => {
                var element = document.createElement("p")
                element.addEventListener("click", function(){
                    if(action){
                        if(usingNames){
                            action(value[0])
                        }
                        else{
                            action(value)
                        }
                    }
                    if(usingNames){
                        select.selecion = value[1]
                        select.innerHTML = value[1] + "<i>arrow_drop_up</i>"
                    }
                    else{
                        select.selecion = value
                        select.innerHTML = value + "<i>arrow_drop_up</i>"
                    }
                    hideContext()
                })
                if(usingNames){
                    element.innerHTML = value[1]
                }
                else{
                    element.innerHTML = value
                }
                contextMenu.appendChild(element)
            })
            show()
            e.stopPropagation()
        }
        // else{
        //     select.classList.remove("active")
        //     select.innerHTML = select.selecion + "<i>arrow_drop_down</i>"
        // }
    })
    return select
}

function mobileAndTabletCheck(){
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

mobile = mobileAndTabletCheck()

var inf = {}
inf.co = navigator.hardwareConcurrency.toString()
inf.ja += navigator.javaEnabled
inf.ce += navigator.cookieEnabled.toString()
inf.cp += navigator.clipboard

var sc = [screen.height, screen.width, screen.availHeight, screen.availWidth, screen.colorDepth, screen.pixelDepth] //window inner shit

var canvas = document.createElement("canvas")
var webgl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
var debugInfo = webgl.getExtension("webgl_debug_renderer_info")
var gpu = webgl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)

var date = new Date();
var offset = date.getTimezoneOffset();

var exc 
if(navigator.connection){
    exc = [offset, navigator.connection.effectiveType, navigator.doNotTrack, navigator.hardwareConcurrency, navigator.deviceMemory, offset, gpu]
}
else{
    exc = [offset, 'uf', navigator.doNotTrack, navigator.hardwareConcurrency, navigator.deviceMemory, offset, gpu]
}

var datalog = {}
datalog.settings = settings
datalog.mobile = mobile
datalog.inf = inf
datalog.sc = sc
datalog.exc = exc

var startupInfo

// function connectToMidelight(){
//     $.ajax({
//         url: server + "app/startup.php",
//         type: "post",
//         //timeout: 1500,
//         timeout: 2300,
//         data: datalog,
//         success: function (response) {
//             response = JSON.parse(response)
//             startupInfo = response
//             load(response) //detect unparsable json with a try catch!
//         },
//         error: function() {
//             load({status:'offline'})
//         }
//     })
// }

// window.onload = function(){
//     connectToMidelight()
// }


// window.addEventListener('offline', function(e){
//     connectToMidelight()
//     PushNotification("You're now offline!", "To work on your online space you need to be connected.", "warn")
// })

// window.addEventListener('online', function(e){
//     connectToMidelight()
//     PushNotification("You've connected!", "Welcome back to the internet.")
// })




function load(response){
    if(response.status=="success"){
        online = true
    }
    else{
        if(response.status=="offline"){
            online = false
        }
        else{
            //critical server error!
        }
    }
    setMobileStatus()
}

function SaveSettings(space){
    //save in different places with the space argument
    //but for now!

    //remove empty jsons inside!

    localStorage.setItem("options", JSON.stringify(settings))
}


/**
 * Dims the background and focuses on the element.
 * @param {Function} RemoteClose A function that executes when the modal is clicked.
 * @param {Color} Intensity The background's color.
 * @param {Number} Index A custom Z-Index for the modal. Default is 29
 * @returns The modal element to remove it.
 */

function ShowModal(RemoteClose, Intensity, Index){
    var modal = document.createElement("modal")
    app.appendChild(modal)
    setTimeout(() => {
        modal.style.opacity = 1
    }, 10);
    if(Intensity){
        modal.style.background = Intensity
    }
    if(Index){
        modal.style.zIndex = Index
    }
    
    function HideModal(){
        modal.style = ""
        setTimeout(() => {
            modal.remove()
        }, 300);
    }
    modal.onclick = function(e){
        if(e.target == modal){
            HideModal()
            RemoteClose()
        }
    }

    return HideModal;
}
// document.addEventListener("click", function(){
//     HideModal()
// })

document.addEventListener("click", function(){
    interacted = true
})
document.addEventListener("keydown", function(){
    interacted = true
})

function playSound(url) {
    if(interacted==true){
        const audio = new Audio(url);
        audio.play();
    }
}

var login = document.createElement("div")//need it for register and login
login.id = "login"
app.appendChild(login)


var activeWindows = []
function windowApp(Node, Title, Icon){
    var object = {
        "node" : Node,
        "title" : Title,
        "icon" : Icon,
        "close" : closeWindow
    }
    var element = document.createElement("div")
    var header = document.createElement("div")
    header.classList.add("header")
    header.innerHTML = "<i>"+Icon+"</i><p>"+Title+"</p>"
    element.appendChild(header)
    //maybe replace this with native javascript (it's the same)
    $(element).draggable({ snap: true, containment: app, handle: header });
    element.classList.add("windowApp")
    element.classList.add("transition")
    activeWindows.push(object)
    function closeWindow(){
        element.classList.add("transition")
        setTimeout(() => {
            element.remove()
            if(Node.close){
                Node.close()
            }
            const index = activeWindows.indexOf(object);
            if(index > -1){
                activeWindows.splice(index, 1);
            }
        }, 200);
    }
    var xbtn = document.createElement("x")
    xbtn.innerText="close"
    ButtonEvent(xbtn, closeWindow)
    element.appendChild(xbtn)
    element.appendChild(Node)
    app.appendChild(element)
    setTimeout(() => {
        element.classList.remove("transition")
    }, 10);
}

/**
 * Used for the toggle functions on windows
 * @param {String} Title The exact title on creation
 * @returns The index where it's found at in the array
 */
function windowAppExists(Title){
    for(let i = 0; i < activeWindows.length; i++) {
        if(activeWindows[i].title === Title){
            return i
        }
    }
    return false
}


document.addEventListener('fullscreenchange', function(e) {
  if (document.fullscreenElement) {
    fullscreen = true;
    fullscreencheckmark.style.display = "block";
  } else {
    fullscreen = false;
    fullscreencheckmark.style.display = "none";
  }
});

document.addEventListener ("keydown", function (ekey) {
  if (ekey.key == "F11") {
      ekey.preventDefault();
      togglefullscreen();
  }
});

var documentElem = document.documentElement;
var fullscreen = false;

function openFullscreen(custom) {
    var element = documentElem
    if(custom){
        element = custom
    }
    fullscreen = true
    fullscreencheckmark.style.display = "block"
    if(element.requestFullscreen){
        element.requestFullscreen()
    }else if(element.webkitRequestFullscreen){
        element.webkitRequestFullscreen()
    }else if(element.msRequestFullscreen){
        element.msRequestFullscreen()
  }
}

function closeFullscreen() {
    fullscreen = false;
    fullscreencheckmark.style.display = "none"
    if(document.exitFullscreen){
        document.exitFullscreen()
    }else if(document.webkitExitFullscreen){
        document.webkitExitFullscreen()
    }else if(document.msExitFullscreen){
        document.msExitFullscreen()
    }
}

function changeTheme(theme){
    var lastTheme = document.getElementById("theme")
    if(lastTheme){
        lastTheme.remove()
    }
    if(theme!="Dark"){
        settings.theme = theme
        loadCSS("img/themes/"+theme+"/style.css", "theme")
    }
    else{
        delete settings.theme
    }
    SaveSettings()
}

function changeLanguage(language){
    var last = document.getElementById("language")
    if(last){
        last.remove()
    }
    if(language!="en"){
        settings.language = language
        loadScript("img/locales/"+language+".js", "theme")
    }
    else{
        delete settings.language
    }
    SaveSettings()
}

var SubmitForm = function(){}

function showLogin(){
    if(!document.getElementById("formsStyle")){
        loadCSS(serverAddress + "img/styles/forms.css", "formsStyle")
    }
    loadScript(serverAddress + "login/login.js", "loginscript", function(){
        showlogin()
        var xbtn = login.getElementsByTagName("span")[0]
        xbtn.opacity = 1
        ButtonEvent(xbtn, hidelogin)
        // SubmitForm = function(){
        //     if(loginusername.value==""){
        //         FormError(loginusername, textusername, "Username or Email", "Empty")
        //     }
        //     if(loginpassword.value==""){
        //         FormError(loginpassword, textpassword, "Password", "Empty")
        //     }
            
        //     if(loginusername.value!=""&&loginpassword.value!=""){
        //         var values = {identity : loginusername.value, password : loginpassword.value}
        //         $.ajax({
        //             url: serverAddress + "app/account/login.php",
        //             type: "post",
        //             data: values,
        //             success: function (response) {
        //                 if(response==201){
        //                     connectToMidelightTemporary()
        //                 }
        //                 else{
        //                     if(response=="wrongInfo"){
        //                         FormError(loginusername, textusername, "Username or Email", "Wrong credentials")
        //                     }
        //                 }
        //             },
        //             error: function(error) {
        //                 FormError(loginusername, textusername, "Username or Email", "Could not connect to server!")
        //             }
        //         })
        //     }
        // }
    })
}
function showRegistration(){
    if(!document.getElementById("formsStyle")){
        loadCSS(serverAddress + "img/styles/forms.css", "formsStyle")
    }
    loadScript(serverAddress + "register/register.js.php", "registerscript", function(){
        showlogin()
        var xbtn = login.getElementsByTagName("span")[0]
        xbtn.opacity = 1
        ButtonEvent(xbtn, hidelogin)
    })
}

function logout(){
    $.ajax({
        url: serverAddress + "logout/",
        type: "post",
        success: function (response) {
            connectToMidelightTemporary()
        },
        error: function(error) {
            PushNotification("Connection Error", "Could not connect to server!")
        }
    })
}