var notearea = document.getElementById("notearea")
var mobile, interacted = false
var electron = false
var online = false
var workspace = "note"
var server = "http://localhost/"
var loggedin = false
var settings = { version: "3.0.0" };
var themes = [{ti : "Default", desc : "Easy on the eyes."}, {ti : "Light", desc : "Enlightening and blinding.", location : "img/ui/themes/light/"}, {ti : "XP", desc : "Nostalgic and alive.", location : "img/ui/themes/xp/", co : "img/ui/themes/previews/xp.jpg"}];

//default colors
var white = "#fff"
var black = "#000"

function DefaultColors(){
    white = "#fff"
    black = "#000"
}

//modal

var modal = document.getElementsByTagName("modal")[0]
function ShowModal(RemoteClose){
    modal.style.visibility = "visible"
    modal.style.opacity = 1
    
    modal.onclick = function(e){
        if(e.target == modal){
            HideModal()
            RemoteClose()
        }
    }
}
function HideModal(){
    modal.style.removeProperty("visibility")
    modal.style.removeProperty("opacity")
}

//dropdowns
var notebtn = document.getElementById("notebtn")
var notedrp = document.getElementById("notedrp")
var editbtn = document.getElementById("editbtn")
var editdrp = document.getElementById("editdrp")
var viewbtn = document.getElementById("viewbtn")
var viewdrp = document.getElementById("viewdrp")

notebtn.onclick = function(e){
    dropdown("note")
    if(e.detail>10){
        fun(1)
    }
}
notebtn.onmouseover = function(){
    hoverdropdown("note")
}
editbtn.onclick = function(){
    dropdown("edit")
}
editbtn.onmouseover = function(){
    hoverdropdown("edit")
}
viewbtn.onclick = function(){
    dropdown("view")
}
viewbtn.onmouseover = function(){
    hoverdropdown("view")
}

const dropdowns = ["note", "edit", "view"]
var dropdownactive = false
var dropdownactivename

function hoverdropdown(n){
    if(dropdownactive){
        document.getElementById(n + "drp").style.transition = "0s"
        dropdownactive = false
        dropdown(n)
    }
}
function hidedropdowns(){
    dropdownactive = false
    dropdowns.forEach(hidedropdown)
}
function hidedropdown(n){
    if(document.getElementById(n + "drp").style.opacity == 1){
        var element = document.getElementById(n + "drp")
        element.style.removeProperty("transition")
        element.style.removeProperty("visibility")
        element.style.removeProperty("transform")
        element.style.removeProperty("max-height")
        element.style.removeProperty("opacity")
        document.getElementById(n + "btn").style.removeProperty("color")
        element.style.removeProperty("overflow")
        element.style.removeProperty("padding-bottom")
    }
}
function dropdown(n){
    dropdowns.forEach(hidedropdown)
    if(dropdownactive==false||mobile==true){
        dropdownactive = true
        dropdownactivename = n;
        var element = document.getElementById(n + "drp")
        element.style.visibility = "visible"
        element.style.transform = "initial"
        if(settings.hl == 2){
            element.style.transform = "translate(-227px, -50px)"
        }
        if(settings.hl == 1){
            element.style.transform = "translate(47px, -50px)"
        }
        element.style.maxHeight = "100%"
        element.style.opacity = 1
        document.getElementById(n + "btn").style.color = white
        
        setTimeout(function (){
            if(window.innerHeight<=element.offsetHeight+80){
                //element.style.transform = "translateY(-60px)"
                element.style.overflow = "auto"
                element.style.paddingBottom = "60px"
            }
            if(settings.hl == 3){
                element.style.height = "1000px"//why
                element.style.transform = "translateY(-"+element.offsetHeight+"px)"
            }
        }, 300);
    }
    else{
        dropdownactive = false
    }
}

//end of dropdowns

//test

var savefile;

function savetext(){
    savefile = notearea.innerHTML
}
function previewtext(){
    console.log(savefile)
}
function loadtext(){
    notearea.innerHTML = savefile
    document.getElementById("saveasbtn").style.display = "block"
}

//success of test

//sidepanel
var sidepanelOpen = false;
function openNav() {
  sidepanelOpen = true;
  document.getElementById("menuPanel").style.width = "300px";
  document.getElementById("menuPanel").style.borderRight = "solid 1px "+ white;
}
function closeNav() {
  if (sidepanelOpen) {
    sidepanelOpen = false;
    document.getElementById("menuPanel").style.width = "0";
    document.getElementById("menuPanel").style.borderRight = "solid 1px #767676";
    setTimeout(function (){ document.getElementById("menuPanel").style.borderRight = "0"; }, 450);
  }
}

function logo() {
    window.open("https://midelight.net");
  }
//end of sidepanel


//word counter

var wordCounter = document.getElementById("wordCount");
var wordCounterdiv = document.getElementById("wordCountdiv");
var wordcountercheckmark = document.getElementById("wordcountercheckmark");

function showCounter(){
    //settings = {...settings, wordcounter: "show"};
    //saveSettings();
    if (notearea.innerText.length){
        var letterCount = notearea.innerText.length;
        var wordCount = notearea.innerText.split(" ").length;
        wordCounter.innerHTML = '<a> Words ' + wordCount + ' • Symbols ' + letterCount + '</a>';
    }
    else{
        wordCounter.innerHTML = '<a> Words 0 • Symbols 0</a>';
    }
    wordCounterdiv.style.display = "block";
    wordcountercheckmark.style.display = "block";
    //notearea.style.height = "calc(100% - 108px)";
}
function hideCounter(){
    //delete settings.wordcounter;
    //saveSettings();
    wordcountercheckmark.style.display = "none";
    wordCounterdiv.style.display = "none";
    //notearea.style.removeProperty("height");
}

function toggleCounter(){
    if(wordCounterdiv.style.display == "none"){
        showCounter();
    }
    else{
        hideCounter();
    }
}

function updateWordCounter(){
    if(notearea.innerText.length>0){
        var letterCount = notearea.innerText.length;
        var wordCount = notearea.innerText.split(" ").length;

        wordCounter.innerHTML = '<a> Words ' + wordCount + ' • Symbols ' + letterCount + '</a>';
    }
    else{wordCounter.innerHTML = '<a> Words 0 • Symbols 0</a>';}
}

//end of word counter


//project creation
var
options = document.getElementById("options"),
create = document.getElementById("create"),
createname = document.getElementById("createname"),
createcloud = document.getElementById("createcloud"),
createbrowser = document.getElementById("createbrowser"),
createdevice = document.getElementById("createdevice"),

createnote = document.getElementById("createnote"),
createtext = document.getElementById("createtext"),
createweb = document.getElementById("createweb"),
createtodo = document.getElementById("createtodo"),
createimage = document.getElementById("createimage"),
createjavascript = document.getElementById("createjavascript"),
createcalculator = document.getElementById("createcalculator"),

createcloudfolderselect = document.getElementById("createcloudfolderselect"),
createaddfoldername = document.getElementById("createaddfoldername"),
createaddfolder = document.getElementById("createaddfolder"),

projectname,
projecttype,
projectplace,
lastcreatetypeoption,
lastcreatestoreoption;

function createproject(){
    options.style.display = "none"
    create.style.display = "flex"
    createStoreOption("createcloud")
    createTypeOption("createnote")
}

function createStoreOption(option){
    if(lastcreatestoreoption){
        document.getElementById(lastcreatestoreoption).style.removeProperty("background")
        document.getElementById(lastcreatestoreoption).style.removeProperty("color")
    }
    document.getElementById(option).style.background = "#8d96e4"
    document.getElementById(option).style.color = black
    if(option=="createdevice"){
        document.getElementById("createcloudfolder").style.display = "none"
    }
    else{
        if(lastcreatestoreoption=="createdevice"){
            document.getElementById("createcloudfolder").style.removeProperty("display")
        }
    }
    projectplace = option
    lastcreatestoreoption = option
}

function createTypeOption(option){
    if(lastcreatetypeoption){
        document.getElementById(lastcreatetypeoption).getElementsByTagName("p")[0].style.removeProperty("color")
        document.getElementById(lastcreatetypeoption).style.removeProperty("background")
        document.getElementById(lastcreatetypeoption).style.removeProperty("color")
    }
    document.getElementById(option).getElementsByTagName("p")[0].style.color = "#333"
    document.getElementById(option).style.background = "#8d96e4"
    document.getElementById(option).style.color = black
    projecttype = option
    lastcreatetypeoption = option
}

createname.addEventListener('blur', function () {
    projectname = createname.value
});

createcloud.onclick = function(){
    createStoreOption("createcloud")
}

createbrowser.onclick = function(){
    createStoreOption("createbrowser")
}

createdevice.onclick = function(){
    createStoreOption("createdevice")
}

createnote.onclick = function(){
    createTypeOption("createnote")
}

createtext.onclick = function(){
    createTypeOption("createtext")
}

createtodo.onclick = function(){
    createTypeOption("createtodo")
}

createimage.onclick = function(){
    createTypeOption("createimage")
}

createweb.onclick = function(){
    createTypeOption("createweb")
}

createjavascript.onclick = function(){
    createTypeOption("createjavascript")
}

createcalculator.onclick = function(){
    createTypeOption("createcalculator")
}

createaddfolder.onclick = function(){
    addonlinefolder()
}

createaddfoldername.addEventListener("keyup", function(event) {
    if (event.keyCode == 13 || event.key == "Enter") {
      event.preventDefault();
      addonlinefolder()
    }
});

function addonlinefolder(){
    addtoselect(createcloudfolderselect, createaddfoldername.value)
    selectlast(createcloudfolderselect)
    createaddfoldername.value = ""
}

function addtoselect(select, option){
    var opt = document.createElement('option');
    opt.value = option;
    opt.innerHTML = option;
    select.appendChild(opt);
}

function selectlast(select){
    select.selectedIndex = select.length-1
}

//adding
//addtoselect(createcloudfolderselect, "new folder")

//end of project creation


//home
var files = document.getElementById("files")
var notepreview = document.getElementById("notepreview")
var lastnotepreview;

// var modal = document.getElementById("modal")
// var welcome = document.getElementById("welcome")
// var options = document.getElementById("options")
// var unsigned = document.getElementById("unsigned")

function openHome(){
    ShowModal()
    welcome.style.display = "block"
    options.style.display = "block"
    create.style.removeProperty("display")
    openexisting.style.removeProperty("display")
}

function ShowWelcome(){
    function close(){
        welcome.style.removeProperty("opacity")
        welcome.style.removeProperty("transform")
        welcome.style.removeProperty("visibility")
        HideModal()
        localStorage.setItem("settings", "fts")
    }
    function x(){
        welcome.getElementsByTagName("span")[0].onclick = function(){
            close()
        }
    }
    function animate(alt){
        var animpanel = welcome.getElementsByTagName("animpanel")[0]
        welcome.style.overflow = "hidden"
        animpanel.style.opacity = 0.3
        animpanel.style.transform = "translateX(60px)"
        if(alt){
            animpanel.style.transform = "translateY(60px)"
        }
        animpanel.style.transition = "0.3s"
        animpanel.style.display = "block"
        setTimeout( function() {
            animpanel.style.removeProperty("transform")
            animpanel.style.removeProperty("opacity")
        }, 10);
        setTimeout( function() {
            welcome.style.removeProperty("overflow")
        }, 400)
    }
    function setPlace(n){
        if(electron){
            if(n>2){
                n-=1
            }
        }
        var places = welcome.getElementsByClassName("place")[0].getElementsByTagName("span")
        places[n-1].innerText = "radio_button_checked"
        for (let i = 0; i < places.length; i++) {
            places[i].onclick = function(){
                var eli = i
                if(electron){
                    if(eli>0){
                        eli+=1
                    }
                }
                if(eli==0){
                    ShowWelcome()
                }
                if(eli==1){
                    second()
                }
                if(eli==2){
                    third()
                }
                if(eli==3){
                    forth()
                }
            }
        }
    }
    var place = "<div class='place'>"
    var places = 4
    if(electron){places = 3}
    for (let i = 0; i < places; i++) {
        place += "<span class='m-i'>circle</span>"
    }
    place += "</div>"

    function download(){
        open("https://writenote.midelight.net/download")
    }
    function ButtonEvent(element, event){
        element.onclick = function(){
            event()
        }
    }
    function secondanim(){
        second(true)
    }
    function second(anim){
        var os = navigator.platform
        var features = ""
        if(os=="Win32" || os=="Win16"){
            os = "Windows"
            features = "<li class='first third'>WriteNote easily accessible right there on your desktop!</li>" +
            "<li class='first third'>Copy-paste anything you'd like with a copy history!</li>"+
            "<li class='first third'>Faster load times</li>"+
            "<li class='first third'>Use even when offline</li>"
        }
        
        welcome.innerHTML = defaults +
        "<animpanel>"+
        "<h1 style='width:80%' class='first'>Why not download for <b>"+os+"</b></h1>"+
        features +
        "</animpanel>"+
        place +
        "<button class='skip'>Back</button>"+
        "<button class='continue undown'>Continue in browser</button>"+
        "<button class='continue download'>Download</button>"
        ButtonEvent(buttons[0], ShowWelcome)
        ButtonEvent(buttons[1], thirdanim)
        ButtonEvent(buttons[2], download)
        x()
        setPlace(2)
        if(anim){
            animate()
        }
    }
    function login(){
        var loginstuff = welcome.getElementsByTagName("loginstuff")[0]
        loginstuff.innerHTML = '<div style="transform:translateY(-50px);" class="login first rellyshort">'+
        '<span class="m-i x">arrow_back</span>'+
        "<div class='loginform'>"+
        "<div class='brand'><img width='64px' src='lowpolyc.png'><ti>Midelight</ti></div>" +
        "<form>" +
        "<label><text>Username or Email</text><input name='username'></label>" +
        "<label><text>Password</text><input name='password' type='password'><span tabindex='0' class='m-i'>visibility</label>" +
        "<a tabindex='0'>Forgot Password or Username?</a>" +
        "<button onclick='SubmitForm()'>Login</button>" +
        "</form>"+
        '</div>'+
        '</div>'
        
        implementLogin(loginstuff)

        setTimeout(function() {
            loginstuff.getElementsByTagName("div")[0].style = 'transition: 0.2s'
        }, 1);
        ButtonEvent(loginstuff.getElementsByTagName("span")[0], thirdanimalt)
    }
    function register(){

    }
    function thirdanim(){
        third(true)
    }
    function thirdanimalt(){
        third(false)
    }
    function third(anim){
        welcome.innerHTML = defaults +
        "<animpanel>"+
        "<loginstuff>"+
        "<h1 class='first short'>Sign in or register an <b>account on Midelight</b>.</h1>"+
        "<li class='first third'>Save & Load everything entirely free on a cloud!</li>"+
        "<li class='first third'>Sync your settings on all devices</li>"+
        "<li class='first third'>More benefits like custom encryption with Premium</li>"+
        "<div class='first short'><button>Login</button><button>Register</button></div>"+
        "</loginstuff>"+
        "</animpanel>"+
        place +
        "<button class='skip'>Back</button>"+
        "<button class='continue'>Skip</button>"
        ButtonEvent(buttons[0], login)
        ButtonEvent(buttons[1], register)
        if(electron){
            ButtonEvent(buttons[2], ShowWelcome)
        }
        else{
            ButtonEvent(buttons[2], second)
        }
        ButtonEvent(buttons[3], forthanim)
        x()
        setPlace(3)
        if(anim){
            animate()
        }
        if(anim==false){
            animate(true)
        }
    }
    function forthanim(){
        forth(true)
    }
    function forth(anim){
        var themesHTML = ""
        themes.forEach(element => {
            if(!element.co){
                element.co = "img/ui/themes/previews/" + element.ti + ".png"
            }
            var style = ""
            var onclick = ""
            if(settings.theme.name == element.ti){
                style = "style='border: 1px solid #a78de4'"
            }
            else{
                onclick = "onclick='setTheme(\""+element.ti+"\",\""+element.location+"\")'"
            }
            themesHTML += "<theme " + onclick + style + " ><ti>"+element.ti+"</ti><desc>"+element.desc+"</desc><img src='"+element.co+"'></theme>"
        })

        welcome.innerHTML = defaults +
        "<animpanel>"+
        "<h1 class='first short'>Customize to your <b>heart's content</b>.</h1><somthemes>"+
        themesHTML+
        "</somthemes></animpanel>"+
        place +
        "<button class='skip'>Back</button>"+
        "<button class='continue'>Finish</button>"
        var themesupdate = welcome.getElementsByTagName("theme")
        for (let i = 0; i < themesupdate.length; i++) {
            themesupdate[i].addEventListener("click", function(){
                forth()
            })   
        }
        ButtonEvent(buttons[0], third)
        ButtonEvent(buttons[1], close)
        x()
        setPlace(4)
        if(anim){
            animate()
        }
    }
    ShowModal(close)
    welcome = document.getElementsByTagName("welcome")[0]
    welcome.style.visibility = "visible"
    welcome.style.opacity = 1
    welcome.style.transform = "translate(-50%, -50%)"
    var defaults = "<span class='m-i x'>close</span><brand><a href='https://midelight.net/WriteNote'><img width='64px' height='64px' src='wn.png'><h1>WriteNote</h1></a></brand>"
    welcome.innerHTML = defaults +
    "<h1 class='first'>Welcome to your new <b>text editor</b>.</h1>"+
    "<h2 class='first second'>Making it easier <b>for you</b> to <br> write a story, organize a calendar, manage a todo or even a website</h2>" +
    place +
    "<button style='visibility:hidden;opacity:0' class='skip'>Skip</button>"+
    "<button class='continue'>Continue</button>"
    var buttons = welcome.getElementsByTagName("button")
    ButtonEvent(buttons[0], close)
    if(electron){
        ButtonEvent(buttons[1], third)
    }
    else{
        ButtonEvent(buttons[1], secondanim)
    }
    setTimeout( function() {
        buttons[0].style = 'transition: 2s'
        setTimeout( function() {
            buttons[0].style = ''
        }, 1000);
    }, 600);
    // welcome.innerHTML = "<span class='m-i x'>close</span>"+//Think if the link should be here 🤔
    // "<brand><a href='https://midelight.net/WriteNote'><img width='64px' height='64px' src='wn.png'><h1>WriteNote</h1></a></brand>"+
    // `<features>
    //     <h2>Do more with an account</h2>
    //     <li>Save and load notes entirely online</li>
    //     <li>Share files with others</li>
    //     <li>Customize to your liking</li>
    // </features>`+
    // '<img class="key" width="512px" src="img/ui/signinlight.png">'+
    // `<div class="unsignedbtn">
    // <button onclick="close()">No, Thanks</button>
    // <button class="blue" onclick="close();login()">
    //   <svg stroke="#c8c8c8" viewBox="0 0 185.5 185.5" width="185.5" height="185.5" xmlns="http://www.w3.org/2000/svg">
    //     <g>
    //       <ellipse ry="87.5" rx="87.5" cy="92.5" cx="93" stroke-width="7"/>
    //       <ellipse stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke-dashoffset="0" ry="28" rx="28" cy="61" cx="92.5"/>
    //       <path stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" d="m43.5,146l98.5,0m-98.5,0a49.5,42.5 0 0 1 0,-3.5a49.57,42.5 0 0 1 49.5,-42.5a49.5,42.5 0 0 1 49.5,42.5l0,0a49.5,42.5 0 0 1 0,3.5"/>
    //     </g>
    //  </svg>
    //  Sign In
    // </button>
    // <button class="blue" onclick="close();login()">
    //  <span style='height:10px;font-size:28px;transform:translate(-5px, -6px);float:left' class='m-i'>how_to_reg</span>
    //  Register
    // </button>
    // </div>`+
    // `<more>
    //     <h2>Why not download instead?</h2>
    //     <li>Faster load times</li>
    //     <li>Easier to find and use</li>
    //     <li>No internet required</li>
    // </more>`
    setPlace(1)
    x()

    // var buttons = welcome.getElementsByTagName("button")

    // ButtonEvent(buttons[0], close)
    // ButtonEvent(buttons[1], showlogin)
    // ButtonEvent(buttons[2], login)
}

function fileoptions(note, event, mouse){
    if (notepreview.classList.contains("active") && lastnotepreview==note){
        hidefileoptions()
    }
    else{
        lastnotepreview = note
        notepreview.style.display = "block"
        //maybe there should be a really small delay cause if it's too fast the animation could not show
        var element = event.composedPath[1]
        var rect = element.getBoundingClientRect();
        notepreview.style.removeProperty("top")
        notepreview.style.removeProperty("left")
        notepreview.style.removeProperty("right")
        notepreview.style.removeProperty("bottom")
        if(mouse == true){
            notepreview.style.top = event.y + "px"
            notepreview.style.left = event.x + "px"
        }
        else{
            notepreview.style.top = rect.top + 40 + "px"
            notepreview.style.left = rect.left + 40 + "px"
        }
        notepreview.innerHTML = "<input id='renamefileoption' onblur='rename(\""+note+"\", this.value)' value=\"" + note + "\">" +
        "<a onclick='document.getElementById(\"renamefileoption\").select()'><span class='m-i'>edit</span> Rename</a>" + "<a style='margin-top: 5px;color: #c54848'><span class='m-i'>delete</span> Delete</a><hr>" +
        "<p>Viewed 21 days ago 12:23 AM 12/25/2021</p><p>Created 32 days ago 12:23 AM 12/25/2021</p><p>Versions: 67</p><p>Size: 2.12 MB</p>"
        notepreview.classList.add("active")
    }
}
function hidefileoptions(){
    notepreview.classList.remove("active")
    notepreview.style.removeProperty("display")
}

// function fileoptionhover(e){ Leaving this for a later date, not really useful and might have a different menu on hover and stay. // Like a preview instead
//     setTimeout(function (){ 
//         fileoptions((e.composedPath[0].getElementsByTagName("ti")[0].innerText), e)
//     }, 1000);
// }

//yo! you can loop all div elements and then get [0] title element and match it with the seach!
//if it matches don't hide!


lineview = document.getElementById("lineview")
gridview = document.getElementById("gridview")

gridview.onclick = function(){
    lineview.style.removeProperty("color")
    gridview.style.color = "#a78de4"
    files.style.removeProperty("display");
    var tostyle = files.getElementsByTagName("div")
    tostyle[0].style.removeProperty("margin-top")
    for (let i = 0; i < tostyle.length; i++) {
        tostyle[i].style.removeProperty("width")
        tostyle[i].style.removeProperty("padding")
    }
}

lineview.onclick = function(){
    gridview.style.removeProperty("color")
    lineview.style.color = "#a78de4"
    files.style.display = "block"
    var tostyle = files.getElementsByTagName("div")
    tostyle[0].style.marginTop = "32px"
    for (let i = 0; i < tostyle.length; i++) {
        tostyle[i].style.width = "initial"
        tostyle[i].style.padding = "12px"
    }
}

//change this according to setting if(settings.view=="grid")
gridview.style.color = "#a78de4"


var searchfiles = document.getElementById("searchfiles")

searchfiles.oninput = function(){
    var toshow = files.getElementsByTagName("div")
    for (let i = 0; i < toshow.length; i++) {
        toshow[i].style.removeProperty("display")
        var showname = toshow[i].getElementsByTagName("ti")[0].innerText.toLowerCase()
        var showtext = toshow[i].getElementsByTagName("p")[0].innerText.toLowerCase()
        var search = searchfiles.value.toLowerCase()
        if(!showname.includes(search) && !showtext.includes(search)){
            toshow[i].style.display = "none"
        }
    }
}

var openexisting = document.getElementById("openexisting")
function openproject(){
    openexisting.style.display = "block"
    options.style.display = "none"
}

function closeHome(){
    HideModal()//bruh fix this
    welcome.style.display = "none"
}

//closeHome()

//end of home

//login

var loginusername, loginpassword, loginbtn, labelusername, labelpassword, textusername, textpassword, loginform

function implementLogin(element){
    loginform = element.getElementsByTagName("form")[0]
    loginbtn = element.getElementsByTagName("button")[0]
    labelusername = element.getElementsByTagName("label")[0]
    loginusername = labelusername.getElementsByTagName("input")[0]
    textusername = labelusername.getElementsByTagName("text")[0]
    labelpassword = element.getElementsByTagName("label")[1]
    loginpassword = labelpassword.getElementsByTagName("input")[0]
    textpassword = labelpassword.getElementsByTagName("text")[0]
    loginpasswordview = labelpassword.getElementsByTagName("span")[0]

    loginusername.oninput = function(){
        textusername.innerHTML = "Username or Email"
        loginusername.style.removeProperty("border")
        refreshloginbutton()
    }

    loginpassword.oninput = function(){
        textpassword.innerHTML = "Password"
        loginpassword.style.removeProperty("border")
        refreshloginbutton()
    }

    loginform.onsubmit = function(e) {
        e.preventDefault()
    }

    loginpasswordview.style.opacity = 0
    
    labelpassword.onmouseover = loginpassword.onfocus = loginpasswordview.onfocus = function(){
        loginpasswordview.style.opacity = 1
    }
    labelpassword.onmouseout = loginpassword.onblur = loginpasswordview.onblur = function(){
        if(loginpassword != document.activeElement && loginpasswordview != document.activeElement){
            loginpasswordview.style.opacity = 0
        }
    }
    loginpasswordview.onclick = function(){
        if(loginpasswordview.innerText=="visibility"){
            loginpasswordview.innerText = "visibility_off"
            loginpassword.type = "text"
        }
        else{
            loginpasswordview.innerText = "visibility"
            loginpassword.type = "password"
        }
    }
    loginpasswordview.addEventListener('keydown', function(e) {
        if(e.keyCode == 13 || e.keyCode == 32) {
            loginpasswordview.click()
            e.preventDefault()
        }
    })
}

function showlogin(){
    var login = document.getElementById("login")
    login.innerHTML = "<span onclick='hidelogin()' class='m-i x'>close</span>" +
    "<div class='brand'><img width='64px' src='lowpolyc.png'><ti>Midelight</ti></div>" +
    "<h1>Sign In</h1>" +
    "<form>" +
    "<label><text>Username or Email</text><input name='username'></label>" +
    "<label><text>Password</text><input name='password' type='password'><span tabindex='0' class='m-i'>visibility</label>" +
    "<a tabindex='0'>Forgot Password or Username?</a>" +
    "<button onclick='SubmitForm()'>Login</button>" +
    "</form>"
    login.style.visibility = "visible"
    login.style.opacity = 1
    login.style.transform = "translate(-50%, -50%)"
    implementLogin(login)
}

function refreshloginbutton(){
    if(loginusername.value!=""){
        if(loginpassword.value!=""){
            loginbtn.style.border = "1px solid #65baff"
            loginbtn.style.background = "#65baff"
            loginbtn.style.color = black
        }
        else{
            loginbtn.style.border = "1px solid #65baff55"
            loginbtn.style.background = "#65baff55"
            loginbtn.style.removeProperty("color")
            loginbtn.style.removeProperty("border")
        }
    }
    else{
        loginbtn.style.removeProperty("background")
    }
}

function hidelogin(){
    login.style.removeProperty("opacity")
    login.style.removeProperty("transform")
    login.style.removeProperty("visibility")
}

function SubmitForm(){
    if(loginusername.value==""){
        FormError(loginusername, textusername, "Username or Email", "Empty")
    }
    if(loginpassword.value==""){
        FormError(loginpassword, textpassword, "Password", "Empty")
    }
}

function FormError(input, field, defaulttext, message){
    input.style.border = "1px solid #c54848"
    field.innerHTML = `${defaulttext} <er>- ${message}</er>`
}

//end of login

//profile

var profilepanelbtn = document.getElementById("profilepanelbtn")
var profilepanel = document.getElementById("profilepanel")

function openprofilepanel(){
    profilepanelbtn.style.stroke = white
    profilepanel.style.visibility = "visible"
    profilepanel.style.opacity = 1
    profilepanel.style.transform = "translate(0)"
    profilepanel.innerHTML = "<a onclick='opensetting(\"Account\")'><span class='m-i'>person</span>Hypenexy</a>"+
    "<hr>"+
    "<a onclick='opensetting(\"Appearance\"),opensubsetting(\"theme\")'><span class='m-i'>style</span>Theme</a>"+
    "<a><span class='m-i'>translate</span>Language</a>"+
    "<hr>"+
    "<a><span class='m-i'>support</span>Support</a>"+
    "<a><span class='m-i'>feedback</span>Feedback</a>"
    
    setTimeout(function () {
        if(profilepanel.style.visibility == "visible"){
            profilepanel.style.lol = "true"
        }//weird fix but it works!
    }, 50);
}

function closeprofilepanel(){
    profilepanelbtn.style.removeProperty("stroke")
    profilepanel.style.removeProperty("opacity")
    profilepanel.style.removeProperty("transform")
    profilepanel.style.lol = "false"
    profilepanel.style.removeProperty("visibility")
}

profilepanelbtn.onclick = function(){
    openprofilepanel()
}

//end of profile

//notifications

var notificationsbtn = document.getElementById("notificationsbtn")
var notifications = document.getElementById("notifications")
var shownnotifications = document.getElementById("shownnotifications")

var activenotifications = []

function opennotifications(){
    notificationsbtn.style.fill = white
    notifications.style.visibility = "visible"
    notifications.style.opacity = 1
    notifications.style.transform = "translate(0)"
    notifications.innerHTML = "<h1>Notifications</h1>"
    for (let i = 0; i < activenotifications.length; i++) {
        var div = "<div>"
        var z = activenotifications.length-i-1
        if(activenotifications[z]!=undefined){
            if(activenotifications[z].type=="warn"){
                div = "<div style='border: 1px solid #c54848'>"
            }
            notifications.innerHTML += div + "<ti>" + activenotifications[z].title + "</ti><co>" + activenotifications[z].content + "</co><span onclick='closeNotificationGui(event)' class='m-i x'>close</span></div>"
        }
    }
    
    setTimeout(function () {
        if(notifications.style.visibility == "visible"){
            notifications.style.lol = "true"
        }
    }, 50);
}

function closenotifications(){
    notificationsbtn.style.removeProperty("fill")
    notifications.style.removeProperty("opacity")
    notifications.style.removeProperty("transform")
    notifications.style.lol = "false"
    notifications.style.removeProperty("visibility")
}

notificationsbtn.onclick = function(){
    opennotifications()
}

function pushNotification(title, content, type){
    shownnotifications.style.display = "block"
    playSound("img/sounds/notification.mp3")
    var div = document.createElement("div")
    
    if(type=="warn"){
        div.style.border = "1px solid #c54848"//"<div style='border:1px solid #c54848'>"
    }
    div.innerHTML = "<ti>" + title + "</ti><co>" + content + "</co><hr>"
    shownnotifications.prepend(div)
    activenotifications.push({"title":title, "content":content, "type":type})

    setTimeout(function (){
        var nots = shownnotifications.getElementsByTagName("div")
        for (let i = 0; i < nots.length; i++) {
            nots[i].getElementsByTagName("hr")[0].style.width = "0%"
            nots[i].style.transform = "translateX(0)"
            nots[i].style.opacity = 1
        }
    }, 10);
    
    setTimeout(function (){
        var nots = shownnotifications.getElementsByTagName("div")
        for (let i = 0; i < nots.length; i++) {
            if (nots[i].innerText.includes(content)) {
                nots[i].style.removeProperty("transform")
                nots[i].style.removeProperty("opacity")
                setTimeout(function (){
                    nots[i].remove()
                    if(shownnotifications.innerHTML == ""){
                        shownnotifications.style.removeProperty("display")
                    }
                }, 300);
            }
        }
    }, 5000);
}

function closeNotification(title){
    for (let i = 0; i < activenotifications.length; i++) {
        if(activenotifications[i].title == title){
            delete activenotifications[i]
        }
    }
}

function closeNotificationGui(e){
    closeNotification(e.composedPath[1].getElementsByTagName("ti")[0].innerText)
}

// pushNotification("File saved with different settings","Would you like to load these settings?","info")
// setTimeout(function (){
//     pushNotification("Security issue","Lmao you logged in from a different location.","warn")
// }, 1000);

//end of notifications

//settings

var settingsbrowser = document.getElementById("settingsbrowser")
var selectedsettings = document.getElementById("selectedsettings")
var lastselectedsetting

function opensettings(){
    settingsbrowser.style.visibility = "visible"
    settingsbrowser.style.transform = "translate(-50%, -50%)"
    settingsbrowser.style.opacity = 1
}

function opensetting(panel, element, animation, subsetting){//might have to use ids cuz i can't access it or i can just simulate a click but how? I SIMULATED THE CLICK
    if(settingsbrowser.style.visibility != "visible"){
        opensettings()
    }
    if(animation!=false){
        selectedsettings.style.transition = "0s"
        selectedsettings.style.transform = "translateY(50px)"
    }
    selectedsettings.innerHTML = ""
    if(element == undefined && animation != false){
        simulateopensetting(panel)
        return;
    }
    if(animation != false){
        if(lastselectedsetting){
            lastselectedsetting.style.removeProperty("color")
            lastselectedsetting.style.removeProperty("background")
        }
        element.style.color = black
        element.style.background = white
        lastselectedsetting = element
    }
    if(panel=="account"){
        selectedsettings.innerHTML = "<h1>Account</h1>" +
        "<div class='profile'><div class='banner'></div><div class='avatar'></div><h2>Hypenexy</h2></div>" +
        "<div onclick='opensubsetting(\"account\")' class='optionsubsection'><ti><span class='m-i'>person</span>Account</ti><co>Change username, password and email.</co></div>"+
        "<div onclick='opensubsetting(\"profile\")' class='optionsubsection'><ti><span class='m-i'>badge</span>Profile</ti><co>A place to edit your public picture picture, banner or status.</co></div>"+
        "<div onclick='opensubsetting(\"privacy\")' class='optionsubsection'><ti><span class='m-i'>verified_user</span>Privacy</ti><co>Change your privacy preferences.</co></div>"+
        "<div onclick='opensubsetting(\"devices\")' class='optionsubsection'><ti><span class='m-i'>devices</span>Devices</ti><co>Preview and choose which devices you should stay logged in from.</co></div>"
    }
    if(panel=="appearance"){
        selectedsettings.innerHTML = "<h1>Appearance</h1>" +
        "<div class='hepreview'></div><div contenteditable='true' class='wnpreview'>Hey there, Hypenexy!</div>" +
        "<div onclick='opensubsetting(\"sidepanel\")' class='optionsubsection'><ti><span class='m-i'>menu</span>Sidepanel</ti><co>Change options for the sidepanel.</co></div>"+
        "<div onclick='opensubsetting(\"language\")' class='optionsubsection'><ti><span class='m-i'>translate</span>Language</ti><co>Switch to your prefered language.</co></div>"+
        "<div onclick='opensubsetting(\"theme\")' class='optionsubsection'><ti><span class='m-i'>style</span>Theme</ti><co>Change to your prefered theme.</co></div>"+
        "<div onclick='opensubsetting(\"font\")' class='optionsubsection'><ti><span class='m-i'>text_fields</span>Font</ti><co>Change the size, boldness and font of the text.</co></div>"
        var wnpreview = selectedsettings.getElementsByClassName("wnpreview")[0]
        var hepreview = selectedsettings.getElementsByClassName("hepreview")[0]
        copyNodeStyle(document.getElementById("notearea"), wnpreview)
        copyNodeStyle(document.getElementsByTagName("header")[0], hepreview)
        wnpreview.style.removeProperty("position")
        wnpreview.style.width = "100%"
        wnpreview.style.height = "300px"
        wnpreview.style.padding = "8px 4px"
        wnpreview.style.outline = "0"
        wnpreview.style.borderRadius = "0 0 8px 8px"
        hepreview.style.width = "100%"
        hepreview.style.height = "60px"
        hepreview.style.marginTop = "20px"
        hepreview.style.borderRadius = "8px 8px 0 0"
    }
    if(panel=="about"){
        selectedsettings.innerHTML = "<h1>About</h1>" +
        "<div class='about'>"+
        "<h1 class='brand'><b>WriteNote</b> by <m>Midelight</m></h1>"+
        "<wnsplit></wnsplit>"+
        "<p>&nbsp;&nbsp;&nbsp;&nbsp;Written by Hypenexy, WriteNote is the ultimate text editor that should fit all your text editing needs!</p>"+
        "<p>Release "+settings.version+"</p>"+
        "<p><a target='_blank' href='https://midelight.net/WriteNote/History'>WriteNote's history</a></p>"+
        "</div>"
    }
    if(subsetting){
        opensubsetting(subsetting, animation)
    }
    setTimeout(function (){
        selectedsettings.style.transition = "0.3s"
        selectedsettings.style.transform = "translateY(0)"
    }, 10);
}


function simulateopensetting(panel){
    var aelements = settingsbrowser.getElementsByTagName("a")
    for (let i = 0; i < aelements.length; i++) {
        var text = aelements[i].innerHTML.toString()
        if(text.includes(panel)){
            aelements[i].click()
        }
    }
}

function closesettings(){
    settingsbrowser.style.removeProperty("transform")
    settingsbrowser.style.removeProperty("opacity")
    settingsbrowser.style.removeProperty("visibility")
}

function opensubsetting(panel, animation){
    if(animation!=false){
        selectedsettings.style.transition = "0s"
        selectedsettings.style.transform = "translateX(70px)"
    }
    var section = selectedsettings.getElementsByTagName("h1")[0].innerText
    var navbar = "<h1><a onclick='simulateopensetting(\""+section+"\")'>"+section+"</a> > ";
    if(panel=="account"){
        selectedsettings.innerHTML = navbar + "Details</h1>" +
        "Username"
    }
    if(panel=="theme"){
        selectedsettings.innerHTML = navbar + "Theme</h1>" +
        "<h2>Installed Themes ("+themes.length+")</h2>";
        themes.forEach(element => {
            if(!element.co){
                element.co = "img/ui/themes/previews/" + element.ti + ".png"
            }
            var style = ""
            var onclick = ""
            if(settings.theme.name == element.ti){
                style = "style='border: 1px solid #a78de4'"
            }
            else{
                onclick = "onclick='setTheme(\""+element.ti+"\",\""+element.location+"\")'"
            }
            selectedsettings.innerHTML += "<theme " + onclick + style + " ><ti>"+element.ti+"</ti><desc>"+element.desc+"</desc><img src='"+element.co+"'></theme>"
        })
        selectedsettings.innerHTML += "<h2>Official Themes</h2>" +
        "<h2>Custom Background</h2>"+
        "<h2>Custom Theme</h2>"
    }
    setTimeout(function (){
        selectedsettings.style.transition = "0.3s"
        selectedsettings.style.transform = "translateX(0)"
    }, 15);
}

// opensettings()
// opensetting("Appearance")
//opensubsetting("theme")

//end of settings

//header location

function HeaderLocation(orientation){
    var header = document.getElementsByTagName("header")[0]
    var ticks = header.getElementsByTagName("tick")
    for (let i = 0; i < ticks.length; i++) {
        ticks[i].style = ""
    }
    function side(){
        var as = header.getElementsByTagName("a")
        for (let i = 0; i < as.length; i++) {
            as[i].style = "padding: 12px 1px;margin: 0;width: 45px;text-align: center;"
        }
        var dropdowns = header.getElementsByClassName("dropdown")
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].getElementsByTagName("div")[0].style = "min-width: 220px;"
        }
    }
    var classes = ["notearealeft", "notearearight", "notearearight"]
    for (let i = 0; i < classes.length; i++) {
        notearea.classList.remove(classes[i])
    }
    switch (orientation) {
        case 1:
            settings.hl = 1
            plcheckmark.style.display = "block"
            header.style = "position: fixed;z-index: 1;width:60px;height:100%;border:0;border-right: 1px solid #555"
            notearea.classList.add("notearealeft")
            side()
            break;
        case 2:
            settings.hl = 2
            plcheckmark.style.display = "block"
            header.style = "position: fixed;right:0;z-index: 1;width:60px;height:100%;border:0;border-left: 1px solid #555"
            notearea.classList.add("notearearight")
            side()
            break;
        case 3:
            settings.hl = 3
            pbcheckmark.style.display = "block"
            header.style = "position: fixed;bottom:0;z-index: 1;border:0;border-top: 1px solid #555"
            notearea.classList.add("noteareabottom")
            break;
    
        default:
            delete settings.hl
            ptcheckmark.style.display = "block"
            header.style = ""
            var as = header.getElementsByTagName("a")
            for (let i = 0; i < as.length; i++) {
                as[i].style = ""
            }
            var dropdowns = header.getElementsByClassName("dropdown")
            for (let i = 0; i < dropdowns.length; i++) {
                dropdowns[i].getElementsByTagName("div")[0].style = ""
            }
            break;
    }
}
//on load
if(settings.hl){
    HeaderLocation(1)
}
else{
    ptcheckmark.style.display = "block"
}

//themes
function setTheme(name, location){
    try {
        DefaultColors()
        document.getElementById("usedtheme").remove()
        for (let i = 0; i < 2; i++) { //YEAh but WHY?
            document.getElementById("usedthemeloader").remove()
        }
    } catch (e) {}
    settings.theme = {name : name, location : location}
    if(name!="Default" || location==""){
        console.log(name)
        loadScript(location + name + ".js", "usedthemeloader")
    }
    if(selectedsettings.style.transform == "translateX(0px)"){
        opensetting("appearance", null, false, "theme")
    }
}

setTheme("Default")
//

//Photo Edit
function LoadPhotoEditor(){
    var canvas
    loadScript("libraries/fabric.min.js")
    notearea.style.position = "relative"
    notearea.style.background = "#111"
    notearea.style.padding = "initial"
    notearea.style.overflow = "initial"
    notearea.contentEditable = false
    document.getElementsByTagName("header")[0].style.borderBottom = "initial"
    notearea.innerHTML = "<ptools>"+
    "<btn><span class='m-i'>mode_edit</span>Pencil</btn>"+
    "<btn><span class='m-i'>brush</span>Brush</btn>"+
    "<btn><span class='m-i'>cleaning_services</span>Eraser</btn>"+
    "<btn><span class='m-i'>all_out</span>Shapes</btn>"+
    "</ptools>"+
    "<canvas id='drawing'></canvas>"

    var c = document.getElementById("drawing")
    setTimeout(function (){
        canvas = new fabric.Canvas(c);
        canvas.setDimensions({width:window.innerWidth, height:window.innerHeight});
        
        var rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: '#fff',
        width: 20,
        height: 20
        });
        
        canvas.add(rect);
    }, 100);

    window.addEventListener("resize", function(){
        canvas.setDimensions({width:window.innerWidth, height:window.innerHeight});
    })
}

//LoadPhotoEditor()

//

//site builder

function loadSitebuilder(){
    var defaultsitecode = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        #sitepreview{
            color: #eee;
            background: #050505;
        }
        h1{
            margin: 16px;
        }
    </style>
</head>
<body>
    
    <h1>Hello there!</h1>

</body>
</html>`
    notearea.contentEditable = false
    notearea.style.overflow = "hidden"
    notearea.style.background = "#111"
    notearea.style.display = "flex"
    notearea.style.justifyContent = "space-between"
    notearea.style.padding = "0"
    notearea.style.fontSize = "initial"
    notearea.innerHTML = "<div id='siteexplorer'></div><div id='sitepreview'></div><div id='sitedetails'><textarea id='sitecode'></textarea><div id='siteproperties'></div></div>"
    var siteexplorer = document.getElementById("siteexplorer")
    siteexplorer.innerHTML = "<input placeholder='Search in elements'>" +
    "<hr>" +
    "<a><span class='m-i'>title</span>Heading</a>" +
    "<a><span class='m-i'>article</span>Text</a>" +
    "<hr>" +
    "<a><span class='m-i'>keyboard_alt</span>Input</a>" +
    "<a><span class='m-i'>wysiwyg</span>TextBox</a>" +
    "<a><span class='m-i'>description</span>RichTextBox</a>" +
    "<a><span class='m-i'>ads_click</span>Button</a>" +
    "<hr>" +
    "<a><span class='m-i'>image</span>Image</a>"
    
    var sitecode = document.getElementById("sitecode")
    sitecode.wrap = "off"
    sitecode.value = defaultsitecode
    sitecode.oninput = function(){
        sitepreview.innerHTML = sitecode.value
    }

    var sitepreview = document.getElementById("sitepreview")
    sitepreview.innerHTML = sitecode.value
}

//loadSitebuilder()

//end of site builder

//widget calculator

var calculator = document.getElementsByTagName("calculator")[0]

function ToggleCalculator(){
    if(calculator.style.visibility!="visibile"){
        calculator.style.visibility = "visible"
        calculator.style.opacity = 1
        calculator.style.transform = "initial"
    }
}

//calculator
function loadCalculator(){
    loadScript("libraries/math.js")
    notearea.contentEditable = false
    notearea.style.overflow = "hidden"
    notearea.style.background = "#111"
    notearea.style.display = "flex"
    notearea.style.padding = "0"
    notearea.style.fontSize = "initial"
    notearea.innerHTML = "<div style='border-right: 1px solid #555;min-width:50%' class='resizablerow'><div id='calculatormain'></div></div> <div style='resize:none;width: 500px' class='resizablerow'><div id='calculatorbuttons'></div><div id='calculatorhistory'></div></div>"
    var calculatormain = document.getElementById("calculatormain")
    calculatormain.innerHTML = "<div id='calculatestory'></div>" +
    "<textarea wrap='off' spellcheck='off' autocomplete='off' id='calculatorinput' placeholder='Type an arithmetic expression'></textarea>" +
    "<div id='calculatorquick'><p>Result</p></div>" +
    "<div id='calculatorfinal'><p>Final Result</p></div>"
    var calculatorbuttons = document.getElementById("calculatorbuttons")
    calculatorbuttons.innerHTML = `
    <div class="calculator">
    <!--<a class="link">Fact about this number</a>-->
    <div class="calculatornumbers">
      <button onclick="evalc('/')">÷</button>
      <button onclick="evalc('*')">×</button>
      <button onclick="evalc('c')">c</button>
      <button onclick="evalc('7')">7</button>
      <button onclick="evalc('8')">8</button>
      <button onclick="evalc('9')">9</button>
      <button onclick="evalc('4')">4</button>
      <button onclick="evalc('5')">5</button>
      <button onclick="evalc('6')">6</button>
      <button onclick="evalc('1')">1</button>
      <button onclick="evalc('2')">2</button>
      <button onclick="evalc('3')">3</button>
      <button onclick="evalc('+/-')">+/-</button>
      <button onclick="evalc('0')">0</button>
      <button onclick="evalc('.')">.</button>
    </div>
    <div class="calculatornumbersright">
      <button style="transform: scale(-1, 1);" onclick="evalc('<')">⌦</button>
      <button onclick="evalc('-')">-</button>
      <button onclick="evalc('+')">+</button>
      <button style="height: 6.5vw;max-height: 100px" onclick="evalc('=')">=</button>
    </div>
  </div>`
    var calculatorinput = document.getElementById("calculatorinput")
    var calculatorquick = document.getElementById("calculatorquick")
    var calculatorfinal = document.getElementById("calculatorfinal")
    var calculatestory = document.getElementById("calculatestory")
    calculatorinput.oninput = function(){
        var expressions = calculatestory.getElementsByTagName("div")
        var allexpressions = "";
        for (let i = 0; i < expressions.length; i++) {
            allexpressions = allexpressions + "\n" + expressions[i].getElementsByTagName("co")[0].innerText
        }
        allexpressions += "\n" + calculatorinput.value
        var calculated = calculate(allexpressions)
        var allcalculated = calculate(allexpressions)
        calculateResult(calculatorquick, mathLast(calculated), "Result", "inline-block")
        calculateResult(calculatorfinal, allcalculated, "Final Results", "block")
    }
    calculatorinput.onkeydown = function(e){
        if(e.key == "Enter" && !e.shiftKey){
            e.preventDefault()
            if(calculatorquick.style.background != "rgb(197, 72, 72)"){
                submitcalculation()
            }
            else{
                calculatorquick.style.transform = "scale(1.05)"
                
                setTimeout(function (){ 
                    calculatorquick.style.removeProperty("transform") 
                    setTimeout(function (){ 
                        calculatorquick.style.transform = "scale(1.02)" 
                        setTimeout(function (){ 
                            calculatorquick.style.removeProperty("transform") 
                        }, 250);
                    }, 210);
                }, 200);
            }
        }
    }
}

function mathLast(calculation){
    try {
        if(calculation.entries){
            return calculation.entries[calculation.entries.length-1]
        }
        else{
            return calculation
        }
    } catch {
        return ""
    }
}

function calculateResult(element, calculated, text, display){
    element.style.display = display
    element.style.removeProperty("background")
    element.innerHTML = "<p>" + text + "</p>" + calculated
    if(calculated==""||calculated==undefined){
        element.style.removeProperty("display")
    }
    else{
        if(calculated.toString().includes("Error")){
            element.style.background = "#c54848"
        }
    }
}

function submitcalculation(){
    var calculatestory = document.getElementById("calculatestory")
    var expressions = calculatestory.getElementsByTagName("div")
    var allexpressions = "";
    for (let i = 0; i < expressions.length; i++) {
        allexpressions = allexpressions + "\n" + expressions[i].getElementsByTagName("co")[0].innerText
    }
    allexpressions += "\n" + calculatorinput.value
    var calculation = calculate(allexpressions)
    if(calculation!=undefined || !calculation.toString().includes("Error")){
        calculation = "<re>" + mathLast(calculation) + "</re>"
    }
    calculatestory.innerHTML = calculatestory.innerHTML + "<div><co oninput='calculatorRefresh()' contenteditable='true'>" + calculatorinput.value + "</co>" + calculation + "</div>"
    calculatorinput.value = ""
}

function calculatorRefresh(){
    calculatorinput.oninput()
}

//loadCalculator()

//end of calculator

//to do list


function loadTodo(){
    notearea.innerHTML = "<div class='mdblock'><div id='todos'></div><div id='todoaddspace'><textarea onkeydown='todokeydown(event)'></textarea></div></div>"
    notearea.contentEditable = false

}

function todokeydown(e){
    var textarea = todoaddspace.getElementsByTagName("textarea")[0]
    if(e.key == "Enter" && !e.shiftKey){
        e.preventDefault()
        addtodo("", textarea.value)
        textarea.value = ""
    }
}

function addtodo(type, text){
    var todos = document.getElementById("todos")
    todos.innerHTML = "<div oncontextmenu='editTodo(this.parentElement, event, true)'><todotick></todotick><co contenteditable='true'>" + text + "</co><span onclick=\"editTodo(this.parentElement, event)\" class=\"more m-i\">more_vert</span></div>" + todos.innerHTML
}

var selectedtodo

function editTodo(todo, event, mouse){
    if (notepreview.classList.contains("active") && lastnotepreview==todo){
        hidefileoptions()
    }
    else{
        selectedtodo = todo.getElementsByTagName("co")[0]
        lastnotepreview = todo
        notepreview.style.display = "block"
        //maybe there should be a really small delay cause if it's too fast the animation could not show
        var element = event.composedPath[1]
        var rect = element.getBoundingClientRect();
        notepreview.style.removeProperty("top")
        notepreview.style.removeProperty("left")
        notepreview.style.removeProperty("right")
        notepreview.style.removeProperty("bottom")
        if(mouse == true){
            event.preventDefault()
            notepreview.style.top = event.y + "px"
            notepreview.style.left = event.x + "px"
        }
        else{
            notepreview.style.top = rect.top + 40 + "px"
            notepreview.style.right = rect.left + 40 + "px"
        }
        notepreview.innerHTML = "<input disabled value=\"" + todo.innerText.slice(0,-9) + "\">" +
        "<a style='margin-bottom: 5px;color: #4ee398'><span class='m-i'>task_alt</span> Mark as done</a>"+"<a onclick='selectedtodo.focus()'><span class='m-i'>edit</span> Edit</a>" + "<a style='margin-top: 5px;color: #c54848'><span class='m-i'>delete</span> Delete</a><hr>" +
        "<p>Finished 21 days ago 12:23 AM 12/25/2021</p><p>Created 32 days ago 12:23 AM 12/25/2021</p>"
        notepreview.classList.add("active")
    }
}



//loadTodo()

//end of to do list

//lines
var linestoggle = false
var lines = document.getElementById("lines")
var lastlinesnumber
var timeoutlines = false
var lineheight

lines.onclick = function(){
    console.log(getCaretCharacterOffsetWithin(notearea))
}

function togglelines(){
    if(linestoggle==false){
        linestoggle=true
        var divs = notearea.getElementsByTagName("p")
        UpdateLines(divs)
        linescheckmark.style.display = "block"
        notearea.style.marginLeft = "40px"
        notearea.style.width = "calc(100% - 40px)"
        lines.style.display = "block"
        lines.style.width = "40px"
    }
    else{
        linestoggle=false
        linescheckmark.style.removeProperty("display")
        notearea.style.removeProperty("margin-left")
        notearea.style.removeProperty("width")
        lines.style.removeProperty("width")
        setTimeout(function() {
            lines.style.removeProperty("display")
        }, 500);
    }
}

notearea.addEventListener('input', function() {
    if(linestoggle==true){
        var divs = notearea.getElementsByTagName("p")
        if(lastlinesnumber!=divs.length){
            if(timeoutlines==false){
                timeoutlines = true
                UpdateLines(divs)
                setTimeout(function (){ 
                    timeoutlines = false
                }, 150);
            }
        }
    }
})

function UpdateLines(divs){
    lastlinesnumber = divs.length
    lines.innerHTML = ""
    if(divs.length>99){
        notearea.style.marginLeft = "50px"
        lines.style.width = "50px"
        notearea.style.width = "calc(100% - 50px)"
        if(divs.length>999){
            notearea.style.marginLeft = "60px"
            lines.style.width = "60px"
            notearea.style.width = "calc(100% - 60px)"
        }
    }
    try {
        for (let i = 0; i < divs.length; i++) {
            var linenumber = i+1
            lines.innerHTML += "<l>" + linenumber + "</l>"
            if(!lineheight){
                lineheight = divs[i].offsetHeight
            }
            for (let j = 0; j < divs[i].offsetHeight/lineheight; j++) {
                lines.innerHTML += "<br>"
            }
        }
    } catch (e) {
        
    }
    lines.scrollTop = notearea.scrollTop
}

var linesresizetimeout;
window.addEventListener("resize", function(){
    if(linestoggle==true && settings.wordwrap==true){
        var divs = notearea.getElementsByTagName("p")
        clearTimeout(linesresizetimeout);
        linesresizetimeout = setTimeout(UpdateLines(divs), 100);
    }
})

notearea.addEventListener("scroll", function(){
    if(linestoggle==true){
        lines.scrollTop = notearea.scrollTop
    }
})
//

//Writing direction

document.getElementById("ltrcheckmark").style.display = "block";
function direction(n){
  var all = notearea.getElementsByTagName("p")//* is creating problems
  if(n){
    //settings = {...settings, direction: "r"};
    document.getElementById("rtlcheckmark").style.display = "block";
    document.getElementById("ltrcheckmark").style.display = "none";
    if(notearea.innerHTML){
        for (let i = 0; i < all.length; i++) {
            all[i].style = "display:inline-block"
            var animmove = window.innerWidth - all[i].offsetWidth-24
            if(linestoggle==true){
                animmove -= 38
            }
            all[i].style = "transition: 1s;transform: translateX("+animmove+"px);"
        }
        
        setTimeout(function (){
            for (let i = 0; i < all.length; i++) {
                all[i].style = ""
            }
            document.getElementById("notearea").style.textAlign = "right";
        }, 1000);
    }
    else{
        document.getElementById("notearea").style.textAlign = "right";
    }
  }
  else{
    //delete settings.direction;
    document.getElementById("ltrcheckmark").style.display = "block";
    document.getElementById("rtlcheckmark").style.display = "none";
    if(notearea.innerHTML){
        var all = notearea.getElementsByTagName("p")
        for (let i = 0; i < all.length; i++) {
            all[i].style = "display:inline-block"
            var animmove = window.innerWidth - all[i].offsetWidth-24
            if(linestoggle==true){
                animmove -= 38
            }
            all[i].style = "transition: 1s;transform: translateX(-"+animmove+"px);"
        }
        
        setTimeout(function (){
            for (let i = 0; i < all.length; i++) {
                all[i].style = ""
            }
            document.getElementById("notearea").style.removeProperty('text-align');
        }, 1000);
    }
    else{
        document.getElementById("notearea").style.removeProperty('text-align');
    }
  }
  saveSettings();
}
// function showdirection(event){ this is cool to cancel stuff!
//   event.cancelBubble = true;
//   //document.getElementById("directions").style.display = "block";
// }


//

//fullscreen

var fullscreencheckmark = document.getElementById("fullscreencheckmark");

function togglefullscreen(){
  if(fullscreen==false){
    openFullscreen();
  }
  else{
    closeFullscreen();
  }
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

var documentelem = document.documentElement;
var fullscreen = false;

function openFullscreen() {
  fullscreen = true;
  fullscreencheckmark.style.display = "block";
  if (documentelem.requestFullscreen) {
    documentelem.requestFullscreen();
  } else if (documentelem.webkitRequestFullscreen) {
    documentelem.webkitRequestFullscreen();
  } else if (documentelem.msRequestFullscreen) {
    documentelem.msRequestFullscreen();
  }
}

function closeFullscreen() {
  fullscreen = false;
  fullscreencheckmark.style.display = "none";
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

//end of fullscreen

//word wrap

var wordwrapcheckmark = document.getElementById("wordwrapcheckmark");
wordwrapcheckmark.style.display = "block";
settings.wordwrap = true

function togglewordwrap(){
  if(settings.wordwrap==true){
    delete settings.wordwrap
    wordwrapcheckmark.style.display = "block"
    notearea.classList.remove("wordwrap")
  }
  else{
    settings.wordwrap = true
    wordwrapcheckmark.style.display = "none"
    notearea.classList.add("wordwrap")
  }
  if(linestoggle==true){
    var divs = notearea.getElementsByTagName("p")
    UpdateLines(divs)
  }
  //saveSettings();
}

//end of word wrap

//share

var sharegui = document.getElementById("sharegui")

function showshare(){
    function close(){
        hideshare()
    }
    ShowModal(close)
    sharegui.innerHTML = "<span onclick='hideshare()' class='m-i x'>close</span>"+
    "<h1>Share</h1>"+
    "<oaction><ti>Create a shareable link</ti><co>A link you can use to share this note with everyone.</co></oaction>"+
    "<oaction><ti>Send to a specific user</ti><co>Choose specifically who can see this.</co></oaction>"
    sharegui.style.visibility = "visible"
    sharegui.style.opacity = 1
    sharegui.style.transform = "translate(-50%, -50%)"
}

function hideshare(){
    HideModal()
    sharegui.style.removeProperty("visibility")
    sharegui.style.removeProperty("opacity")
    sharegui.style.removeProperty("transform")
}

//end of share

//WriteNote Editor Functions

//getting position

function getPos(){
    //BRAT NE ZNAM
    var sel = document.getSelection(),
    sel = sel.outerHTML
    nd = sel.anchorNode,
    text = notearea.textContent.slice(0, sel.focusOffset);
    texthtml = notearea.innerHTML.slice(0, sel.focusOffset);

    console.log(text)
    console.log(texthtml)

    console.log(sel.focusOffset)

    var line = texthtml.match(/<p>/g, "").length;
    var col = text.split("\n").pop().length;
    console.log("row:"+line+", col:"+col)
}

//playing sounds

function playSound(url) {
    if(interacted==true){
        const audio = new Audio(url);
        audio.play();
    }
}

//copy elements' style

function copyNodeStyle(sourceNode, targetNode) {
    const computedStyle = window.getComputedStyle(sourceNode);
    //default Array.from(computedStyle).forEach(key => targetNode.style.setProperty(key, computedStyle.getPropertyValue(key), computedStyle.getPropertyPriority(key)))
    computedStyleAr = Array.from(computedStyle)
    for (let i = 0; i < computedStyleAr.length; i++) {
        var current = computedStyleAr[i].toString()
        if(current=="background"||current=="background-color"||current=="color"||current=="font-size"||current=="outline"){
            targetNode.style.setProperty(current, computedStyle.getPropertyValue(current), computedStyle.getPropertyPriority(current))
        }
    }
}

//load elements

function loadScript(url, id) {
    var script = document.createElement("script")
    if(id){
        script.id = id
    }
    script.src = url
    document.body.appendChild(script)
}

//calculate

function calculate(expression){
    try {
        return math.evaluate(expression)
    } 
    catch (error) {
        return error.toString()
    }
}

function safeeval(expression){
    try {
        return eval(expression)
    } 
    catch (error) {
        return "Error"
    }
}

//rename
function rename(note, name){
    if(note!=name){
        console.log(note + ", " + name)
    }
}
//end of rename

//Caret
function saveCaretPosition(){
    var savedSel = rangy.saveSelection()

    return function restore(){
        rangy.restoreSelection(savedSel)
    }
}

function getTextNodeAtPosition(root, index){
    const NODE_TYPE = NodeFilter.SHOW_TEXT;
    var treeWalker = document.createTreeWalker(root, NODE_TYPE, function next(elem) {
        if(index > elem.textContent.length){
            index -= elem.textContent.length;
            return NodeFilter.FILTER_REJECT
        }
        return NodeFilter.FILTER_ACCEPT;
    });
    var c = treeWalker.nextNode();
    return {
        node: c? c: root,
        position: index
    };
}

function insertTextAtCaret(text) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            var textNode = document.createTextNode(text)
            range.insertNode( textNode );

            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}

function setCaretAtEnd(element) {
    const selection = window.getSelection();  
    const range = document.createRange();  
    selection.removeAllRanges();  
    range.selectNodeContents(element);  
    range.collapse(false);  
    selection.addRange(range);  
    element.focus();
}

function insertHTMLAtCaret(text) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode( text );

            range.setStartAfter(text);
            range.setEndAfter(text);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}

//Thanks to Tim Down on stackoverflow for the caret function! <3
//nvm it has to be focused.
function getCaretCharacterOffsetWithin(element){
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type != "Control"){
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

function setCaret(element, position){//if only i can get the column and line?
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(element.childNodes[0], position);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    element.focus();
}

//Links
function removeurls(element){
    var links = element.getElementsByTagName("a")
    for (let i = 0; i < links.length; i++) {
        links[i].outerHTML = links[i].href
        
    }
}

//thx stackoverflow for the 100th time
// var urlRegex = /\b([^\="\/])(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]/ig;
// function urlify(text){
//     return text.replace(urlRegex, function(url) {
//         return '><a href="' + url + '">' + url + '</a>';
//     })
// } BRAT MI ZASHTO NE RABOTI?!

//fun
var hadfun = false
function fun(funny){
    if(funny==1){
        if(!hadfun){
            hadfun = true
            pushNotification("A lot of clicks!", "You clicked that button 10 times")
        }
    }
}

//events (keep at end)

//offline online

window.addEventListener('offline', function(e) {
    pushNotification("You're now offline!", "To work on your online space you need to be connected.", "warn")
});

window.addEventListener('online', function(e) { 
    pushNotification("You've connected!", "Welcome back to the internet.")
});

//implement battery

const batteryIsSupported = navigator && 'getBattery' in navigator 

if(batteryIsSupported){
    navigator.getBattery().then(function(battery) {
        battery.addEventListener('chargingchange', function(){
            if(battery.charging==true){
                pushNotification("Device is charging!", "")
            }
            else{
                pushNotification("Device is no longer charging.", "")
            }
        });
    
        battery.addEventListener('levelchange', function(){
            if(battery.level * 100 == 30){
                if(battery.charging==false){
                    pushNotification("Battery is draining.", "A friendly reminder to charge your device")
                }
            }//will && 5 work??
            if(battery.level * 100 == 10 && 5){
                if(battery.charging==false){
                    pushNotification("Battery critically low!", "Make sure your work is saved.", "warn")
                }
            }
        })
    })
}

//

var timeoutsave, timeouthistory, timeoutcheck, inputcount = 0

notearea.addEventListener('input', function (e) {
  //unsave status stuff
  if(wordCounterdiv.style.display == "block"){
    updateWordCounter()
  }

  clearTimeout(timeouthistory)
  timeouthistory = setTimeout(function () {
    if(inputcount<6){
        PushUndo(notearea.innerHTML)
    }
  }, 300);
  inputcount++
  if(inputcount>8){
    PushUndo(notearea.innerHTML)  
    inputcount = 0
  }

  clearTimeout(timeoutsave)
  timeoutsave = setTimeout(function () {
      
    var restore = saveCaretPosition(notearea)
    removeurls(notearea)
    notearea.innerHTML = urlify(notearea.innerHTML)
    restore()

  }, 500);

//   clearTimeout(timeoutsave);
//   timeoutsave = setTimeout(function () {
//     if(notearea.innerText!=lastText){
//       if(currentOnlineNote){
//         saveonlinenote();
//       }
//       lastText = notearea.innerText;

//       if(devMode){
//         runCode();
//       }
//     }
//   }, 2000);

})

function setSelection(ranged) {
    var sel = window.getSelection()
    sel.removeAllRanges()
    //range.selectNodeContents(element)
    sel.addRange(ranged)
}

// function loghistory(){
//     console.log(texthistory)
//     console.log(redohistory)
// }

notearea.addEventListener('keydown', function (e) {
    interacted = true
    if (e.key === 'Tab' || e.keyCode === 9) {
        //e.preventDefault(); this feature is trash
        insertTextAtCaret("\u00a0\u00a0\u00a0\u00a0")
        e.preventDefault()
    }
})

window.addEventListener('click', function (e) {
    mobile = false
    interacted = true
    //dropdowns
    //think about this :/
    if (!e.target.matches('a')&&!e.target.matches('v')) {
        hidedropdowns()
    }

    if (e.target.matches('v')){//this system is bad
        var element = document.getElementById(dropdownactivename + "drp")
        element.style.opacity = 0
        element.style.transition = "0.15s"
        setTimeout(function () {
            element.style.opacity = 1
            element.style.removeProperty("transition")
            hidedropdowns()
        }, 150);
    }

    //sidepanel
    if (document.getElementById('menuPanel').contains(e.target)) {
        } else {
        if (document.getElementById('navBtn').contains(e.target)) { }
        else {
            closeNav();
        }
    }
    //context menus
    try{
        if (!e.composedPath[0].matches("span.more") && !e.composedPath[1].matches("div#notepreview.active") &&! e.composedPath[0].matches("div#notepreview.active")){
            hidefileoptions()
        }

        //hidewelcome
        if(e.composedPath[0].matches("div#modal")){
            closeHome()
        }
    }
    catch{}

    //profile menus
    if(profilepanel.style.lol == "true"){
        closeprofilepanel()
    }

    if(notifications.style.lol == "true"){
        closenotifications()
    }
    //context
    if(context.classList[1]=="contextactive"){
        context.classList.remove("contextactive")
    }
})

notearea.addEventListener('scroll', function (){
    if(context.classList[1]=="contextactive"){
        context.classList.remove("contextactive")
    }
})

window.addEventListener('touchstart', function (e) {
    interacted = true
    mobile = true
})
window.addEventListener('touchend', function (e) {
    interacted = true
    mobile = true
})

window.addEventListener('contextmenu', function (e) {
    interacted = true
    try{
        if (e.composedPath[0].matches("div")&&e.composedPath[1].matches("div#files")){
            e.preventDefault()
            fileoptions((e.composedPath[0].getElementsByTagName("ti")[0].innerText), e, true)
        }
        if (e.composedPath[1].matches("div")&&e.composedPath[2].matches("div#files")){
            e.preventDefault()
            fileoptions((e.composedPath[1].getElementsByTagName("ti")[0].innerText), e, true)
        }
    }
    catch{}
})

//WriteNote Editor

var settingstimeout
function saveSettings(){
    settingsStr = JSON.stringify(settings)
    localStorage.setItem("options", settingsStr)
    if(loggedin == true){
        clearTimeout(settingstimeout);
        settingstimeout = setTimeout(function () {
            var post = {
                'settings' : settingsStr
            };
            $.ajax({
                url: server + "/app/savesettings.php",
                type: "post",
                data: post,
                success: function (response) {},
                error: function() {
                    pushNotification("Could not connect to server.", "", "warn")
                }
            });
        }, 1500);
    }
}

function printwn() {
    //maybe there's more efficient solution?! Nope, but u should probably make this fancier.
    var oPrntWin = window.open("","_blank","width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
    oPrntWin.document.open();
    oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><style>*{box-sizing: border-box;font-family: 'Roboto', sans-serif}<\/style><\/head><body onload=\"print();\">" + notearea.innerHTML + "<\/body><\/html>");
    oPrntWin.document.close();
}

function SelectAll(){
    var sel, range
    if (window.getSelection && document.createRange) {
        range = document.createRange()
        range.selectNodeContents(notearea)
        sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
    } else if (document.body.createTextRange) {
        range = document.body.createTextRange()
        range.moveToElementText(notearea)
        range.select()
    }
}

var wnclipboard = []

function Copy(){
    wnclipboard.push()
}
//maybe detect program switch and if there was one tell user
//that this is probably not what he wanted to paste and tell him
//to download writenote :>
function Paste(n){
    if(!n){
        insertTextAtCaret("hey")
    }
    else{
        insertTextAtCaret(wnclipboard[n])
    }
}

//const removeStyle = function(e) {
notearea.addEventListener('paste', function(e){
    var isImage = false
    var items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (var index in items) {
        var item = items[index];
        if (item.kind === 'file') {
            var blob = item.getAsFile();
            var reader = new FileReader();
            isImage = true
            // reader.onload = function (event) {
            //     console.log(event.target.result);
            // }; 
            //reader.readAsDataURL(blob);
        }
    }
    if(!isImage){
        e.preventDefault();
        var pastedText = e.clipboardData.getData('Text')
        let sanitizedText = pastedText.replace(/^\s*\n/gm, '<p><br /></p>')
        sanitizedText = sanitizedText.replace(/<\/?span[^>]*>/g, '')
        sanitizedText = sanitizedText.replace(/class='[a-zA-Z0-9:;\\.\\s\\(\\)\\-\\,]*'/g, '')
        sanitizedText = sanitizedText.replace(/style='[a-zA-Z0-9:;\\.\\s\\(\\)\\-\\,]*'/g, '')
        setTimeout( function () {document.execCommand('formatBlock', false, "p");document.execCommand('insertHTML', false, sanitizedText);document.execCommand('formatBlock', false, "p")}, 15)
    }
})

function experiment(){
    
}


// notearea.addEventListener('focus', function (e) {
//     if(!notearea.innerHTML.includes("<p>")){
//         notearea.innerHTML = "<p>&nbsp;</p>"
//         setCaretAtEnd(notearea)
//         focus(notearea.getElementsByTagName("p")[0])//huh?
//     }
// })

notearea.addEventListener('input', function (e) {
    if(!notearea.innerHTML.includes("<p")){
        document.execCommand('formatBlock', false, "p");
        setCaretAtEnd(notearea)//on iphone i need this <--
        // if(e.data!=null){
        //     notearea.innerHTML = "<p>" + e.data + "</p>"
        // }
    }
})

notearea.addEventListener('keydown', function (e) {
    if(e.key == "Enter"){
        if(!notearea.innerHTML.includes("<p>")){
            notearea.innerHTML = "<p><br></p>"
        }
    }
    if(e.shiftKey && e.key == "Enter"){
        e.preventDefault()
        //var caretPosition = getCaretCharacterOffsetWithin(notearea)
        notearea.innerHTML += "<p><br></p>"
        setCaretAtEnd(notearea)
        //setCaret(notearea, caretPosition)
    }
})


//context
var context = document.getElementsByClassName("context")[0]

notearea.oncontextmenu = function(e){
    e.preventDefault()
    var link = "";
    if(e.target.matches("a")){//maybe have a different context for links!
        link = "<a target='_blank' href='"+e.target.href+"'>Open Link</a>" + "<hr>"
    }
    context.innerHTML = link +
    "<a onclick='Undo()'>Undo</a>"+
    "<a onclick='Redo()'>Redo</a>"+
    "<hr>"+
    "<a onclick='Cut()'>Cut</a>"+
    "<a onclick='Copy()'>Copy</a>"+
    "<a onclick='Paste()'>Paste</a>"+
    "<hr>"+
    "<a onclick='SelectAll()'>Select All</a>"
    var positions = ContextMenuPosition(context, e)
    context.style.left = positions[0] + "px"
    context.style.top = positions[1] + "px"
    context.classList.add("contextactive")
    
    context.onclick = function(event){
        if(event.target == context){
            event.cancelBubble = true;
        }
    }
}

context.onclick = function(event){
    if(event.target == context){
        event.cancelBubble = true;
    }
}

function ContextMenuPosition(el,e){
    var left = e.clientX;
    if(e.clientX + el.offsetWidth > window.innerWidth){
        left = window.innerWidth - el.offsetWidth
    }
    var top = e.clientY;
    if(e.clientY + el.offsetHeight > window.innerHeight){
        top = window.innerHeight - el.offsetHeight
    }
    return [left, top]
}

function CustomMenuPosition(el, top, left){
    if(left + el.offsetWidth > window.innerWidth){
        left = window.innerWidth - el.offsetWidth
    }
    if(top + el.offsetHeight > window.innerHeight){
        top = window.innerHeight - el.offsetHeight
    }
    return [left, top]
}

//linkpreview

var linkinfoallowclose = true
var linkinfo = document.getElementsByClassName("linkinfo")[0]
var linkinfourl

notearea.addEventListener('dblclick', function (e) {
    if(e.target.href){
        open(e.target.href)
    }
})
notearea.addEventListener('mouseover', function (e) {
    if(e.target.href){
        if(linkinfo.classList[1]!="linkinfoactive"){
            allowclose = false
            linkinfourl = e.target.href
            linkinfo.innerHTML = "<div id='linkmetadata'><img width='48px' src='" + "wn.png" + "'><linktle id='linktitle'>" + "WriteNote" + "</linktle><linkdes>" + "Write, share, save notes with an upgraded online experience." +"</linkdes></div>" + "<p>Links to " + e.target.href + "</p>"
            //AdjustOnScreen(e.target.offsetLeft - 10, e.target.offsetTop + 100, linkinfo.width, linkinfo.height)
            //console.log(CustomMenuPosition(linkinfo, e.target.offsetTop + 100, e.target.offsetLeft - 10))
            linkinfo.style.top = e.target.offsetTop + 100 + "px"
            //console.log(e.target.offsetWidth)
            var left = e.target.offsetLeft;
            if(linkinfo.offsetWidth < e.target.offsetWidth){
                left = e.target.offsetLeft + e.target.offsetWidth/10
            }
            linkinfo.style.left = left + "px"
            linkinfo.classList.add("linkinfoactive")
        }
    }
})
//i think this is annoying
linkinfo.addEventListener('mouseover', function (e) {
    allowclose = false
    document.getElementById("linktitle").style.textDecoration = "underline";
})
linkinfo.addEventListener('click', function () {
    open(linkinfourl)
})
linkinfo.addEventListener('mouseout', function (e) {
    allowclose = true
    document.getElementById("linktitle").style.removeProperty("text-decoration")
    setTimeout(function () {
        if(allowclose){
            linkinfo.classList.remove("linkinfoactive")
        }
    }, 500);
})
notearea.addEventListener('mouseout', function (e) {
    if(e.target.href){
        allowclose = true
        setTimeout(function () {
            if(allowclose){
                linkinfo.classList.remove("linkinfoactive")
            }
        }, 1000);
    }
})

var emptynotearea = ""//this should change on the different project types
var texthistory = []
var curtexthistory = []
var redohistory = []
var curredohistory = []

function PushUndo(content){
    texthistory.push(content)
    // curtexthistory.push(saveCaretPosition(notearea))
    // curtexthistory[curtexthistory.length-1]()
}

function PushRedo(content){
    redohistory.push(content)
    // curredohistory.push(saveCaretPosition(notearea)) 
}

function Undo(){
    //var last = texthistory.pop()//data can be lost if too fast and no last element
    // if(last==notearea.innerHTML){
    //     //loss data
    // }
    var lastnow = texthistory[texthistory.length-1]
    var curnow = curtexthistory[curtexthistory.length-1]

    if(notearea.innerHTML){
        PushRedo(notearea.innerHTML)
    }
    if(lastnow){
        notearea.innerHTML = lastnow //last ? last : notearea.innerHTML
        curnow()
    }
    else{
        notearea.innerHTML = emptynotearea
    }
}

function Redo(){
    var last = redohistory.pop()
    if(last){
        notearea.innerHTML = last ? last : notearea.innerHTML
        PushUndo(last)
    }
}

notearea.addEventListener("input", function(){
    redohistory = []
})

//keep notearea for now for other inputs (change to document when stable) 
notearea.addEventListener("keydown", function(e){   
    if (e.ctrlKey && !e.shiftKey && e.key == "z"){
        e.preventDefault()
        Undo()
    }
    if(e.ctrlKey && e.key == "Z" && e.shiftKey || e.ctrlKey && e.key == "y"){//lmao shift affects .key but caps lock doesn't 🤷‍♂️
        e.preventDefault()
        Redo()
    }
})

//CALENDAR

function CustomContext(html){
    context.innerHTML = html
    context.style.left = "100px"
    context.style.top = "100px"
    setTimeout(function (){ context.classList.add("contextactive") }, 10)//why
}

function ShowAddDate(){

    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
    });

    var html = "<h2>Insert a date</h2>" +
    "<de>Date</de>" +
    "<input type='date'>" +
    "<de>Title</de>" +
    "<input>" +
    "<de>Description</de>" +
    "<textarea></textarea>" +
    "<de>Remind me the day before</de>" +
    "<input type='checkbox'>" +
    "<button>Create</button>"

    CustomContext(html)

    var calendargui = context.getElementsByTagName("input")[0]
    calendargui.value = new Date().toDateInputValue()
    
    context.onclick = function(event){
        event.cancelBubble = true;
    }

    var submit = context.getElementsByTagName("button")[0]
    submit.onclick = function(){
        var inputs = context.getElementsByTagName("input")
        var date = inputs[0].value
        var ti = inputs[1].value
        var desc = inputs[2].value
        notearea.innerHTML += "<cal><da>"+date+"</da><ti>"+ti+"</ti></cal>"
        context.classList.remove("contextactive")
    }
}



//Link
function InsertLink(){
    var html = "<h2>Insert a link</h2>" +
    "<de>Phrase</de>" +
    "<input>" +
    "<de>Link</de>" +
    "<input>" +
    "<button>Create</button>"
    CustomContext(html)
    
    context.onclick = function(event){
        event.cancelBubble = true;
    }    

    var submit = context.getElementsByTagName("button")[0]
    submit.onclick = function(){
        var linkname = context.getElementsByTagName("input")[0]
        var link = context.getElementsByTagName("input")[1]
        
        var toInsert = "<a href='"+link.value+"'>"+linkname.value+"</link>"
        notearea.focus()
        document.execCommand('insertHTML', false, toInsert)
        context.classList.remove("contextactive")
    }    
}


//scroll style
// var scrolled
// notearea.addEventListener("scroll", function(){
//     console.log(notearea.scrollTop)
//     if(notearea.scrollTop>0){
//         if(!notearea.style.boxShadow){    
//             notearea.style.boxShadow = "inset -1px 4px 3px #1a1a1a55"
//         }
//     }
//     else{
//         notearea.style.removeProperty("box-shadow")
//     }
// })

//File Managment

//file.js

//load

function LoadSettings(){
    var localsettings = localStorage.getItem("settings")
    if(!localsettings){
        ShowWelcome()
        
        //localStorage.setItem("settings", localsettings)
    }     
}    

function VerifyApp(version, custom){
    //If you modify this function
    //you are not eligible for support
    var versionform = document.getElementsByTagName("version")[0]
    try {
        var localversion = settings.version.split(".")
        var localmajor = localversion[0]
        var localminor = localversion[1]
        var localpatch = localversion[2]
        version = version.split(".")
        var globalmajor = version[0]
        var globalminor = version[1]
        var globalpatch = version[2]

        var form = "<span class='m-i x'>close</span>"
        function close(){
            versionform.style = ""
            HideModal()
        }    
        function open(){
            ShowModal(close)
            versionform.style = "transform:translate(-50%, -50%);opacity:1;visibility:visible"
            versionform.innerHTML = form
            versionform.getElementsByTagName("span")[0].onclick = function(){
                close()
            }    
            var buttons = versionform.getElementsByTagName("button")
            buttons[buttons.length-1].onclick = function(){
                close()
            }    
            $.ajax(server + 'app/changelogs.php',{
                success: function (data) {
                    versionform.getElementsByTagName("changelog")[0].innerHTML = data
                }    
            })    
        }    
        if(globalmajor>localmajor){
            form += "<h1>You need to update</h1>" +
            "<p>This version may not be supported anymore.</p>" +
            "<changelog>" +
            "<h2>What's New</h2>" +
            "<h3>Version "+version.join('.')+"</h3>" +
            "</changelog>" +
            "<buttons>" +
            "<button class='alt'>Update</button>" +
            "<button>Continue anyway, I understand the risk.</button>" +
            "</buttons>"
            open()
        }    
        else{
            if(globalminor>localminor||globalpatch>localpatch){
                form += "<h1>There's an update!</h1>" +
                "<changelog>" +
                "<h2>What's New</h2>" +
                "<h3>Version "+version.join('.')+"</h3>" +
                "</changelog>" +
                "<buttons>" +
                "<button class='alt'>Update</button>" +
                "<button>Continue with older version.</button>" +
                "</buttons>"
                open()
            }    
        }    
    } catch(e) {
        pushNotification("Unable to verify WriteNote Version!", e, "warn")
    }    
}    

function CheckConnectivity(){
    var connectivity = document.createElement("connectivity")
    connectivity.innerHTML = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div> <p>Checking internet connectivity</p>'
    document.getElementsByTagName("app")[0].appendChild(connectivity)
    function wrapup(msg){
        connectivity.innerHTML = msg
        setTimeout(function() {
            connectivity.remove()//animate this >:(
        }, 1000);        
    }    
    $.ajax({
        url: server + "/app/status.php",
        success: function (response) {
            response = JSON.parse(response)
            if(response.status){
                wrapup("<a>Connected!</a>")
            }
        },    
        error: function() {
            wrapup("<a>Could not reach server!</a>")
        }    
    })    
}    

window.addEventListener("load", function(){
    notearea.style.removeProperty("background-color")
    document.getElementsByTagName("loader")[0].remove()
    //VerifyApp("3.1.0")
    LoadSettings()
})

