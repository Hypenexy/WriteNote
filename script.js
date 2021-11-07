var version = "2.0.0";

var settings = { version: 1};

var server = "https://writenote.midelight.net";

var currentOnlineNote;

var devMode = false;

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=WriteNoteApp";
}

// var sessionid = localStorage.getItem('sessionid');
// if (getCookie("PHPSESSID")){
//   setCookie("PHPSESSID", sessionid, 24);
// }

$.ajax({
  url: server + "/app/logon.php",
  success: function (response) {
    loadAccount(response)
  },
  error: function() {
    unloadonline();
  }
});

function changeMOTD(name){
  var now24 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false });
  var hour = parseInt(now24.slice(0, 2));
  var welcomemessage = "Good morning, " + name;
  if(hour>13&&hour<18){
    welcomemessage = "Good afternoon, " + name;
  }
  if(hour>17&&hour<23){
    welcomemessage = "Good evening, " + name;
  }
  if(hour>22||hour<6){
    welcomemessage = "Good night, " + name;
  }
  if(hour==0){
    welcomemessage = "Enjoy the midnight, " + name;
  }
  document.getElementById("welcomemessage").innerHTML = welcomemessage;
}

function timeSince(o){var t=Math.floor((new Date-o)/1e3),r=t/31536e3;return r>1?1==Math.floor(r)?Math.floor(r)+" year":Math.floor(r)+" years":(r=t/2592e3)>1?1==Math.floor(r)?Math.floor(r)+" month":Math.floor(r)+" months":(r=t/86400)>1?1==Math.floor(r)?Math.floor(r)+" day":Math.floor(r)+" days":(r=t/3600)>1?1==Math.floor(r)?Math.floor(r)+" hour":Math.floor(r)+" hours":(r=t/60)>1?1==Math.floor(r)?Math.floor(r)+" minute":Math.floor(r)+" minutes":1==Math.floor(t)?Math.floor(t)+" second":Math.floor(t)+" seconds"}

var notes;
var loggedin;
function loadAccount(data){
  var loginInfo = JSON.parse(data);
  if(loginInfo.name!="not loggedin"){

    changeMOTD(loginInfo.name);

    if(loginInfo.notes){
      notes = loginInfo.notes;
      loginInfo.notes.sort(compareSecondColumn);
      for(var i = 0; i < loginInfo.notes.length; i++){
        document.getElementById("tablenotes").innerHTML = document.getElementById("tablenotes").innerHTML + "<tr onclick=\"loadonlinenote('"+loginInfo.notes[i][0]+"')\" class=\"listedNote\"><td>"+loginInfo.notes[i][0]+"</td><td>"+ timeSince(loginInfo.notes[i][1]*1000) +"</td><td>"+ new Date(loginInfo.notes[i][2]*1000).toLocaleDateString() + " " + new Date(loginInfo.notes[i][2]*1000).toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })+"</td></tr>"
        document.getElementById("tablenotes2").innerHTML = document.getElementById("tablenotes2").innerHTML + "<tr onclick=\"loadonlinenote('"+loginInfo.notes[i][0]+"')\" class=\"listedNote\"><td>"+loginInfo.notes[i][0]+"</td><td>"+ timeSince(loginInfo.notes[i][1]*1000) +"</td><td>"+ new Date(loginInfo.notes[i][2]*1000).toLocaleDateString() + " " + new Date(loginInfo.notes[i][2]*1000).toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })+"</td></tr>"
      }
    }

    if(loginInfo.version){
      if(loginInfo.version != version){
        SendTooltip("You are running an older version!", "warn")
      }
    }

    if(loginInfo.options){
      settings = JSON.parse(loginInfo.options);
      saveSettings("locally");
      loadSettings();
    }

    if(loginInfo.space){
      document.getElementById("spacepercentage").style.width = loginInfo.space/5000000000*100 + "%";
      document.getElementById("spacetext").innerHTML = Math.round(loginInfo.space/1000000000) + " GB of 5 GB used.";
    }

    document.getElementById("mainWelcome").style.display = "block";
    document.getElementById("modal").style.display = "block";
    document.getElementById("newnote").style.display = "none";
    document.getElementById("unsigned").style.display = "none";
    document.getElementById("loggedwelcome").style.display = "block";
  
    unlogin();
    //hideAll();
    document.getElementById("opensectionbtn").style.removeProperty("color");
    document.getElementById("opensectionbtn").style.borderBottom = "2px solid #ccc";

    document.getElementById("accountitems").style.removeProperty("display");
    document.getElementById("usernameplaceone").innerHTML = "<i class='fa fa-user-circle-o'></i> " + loginInfo.name;
    document.getElementById("unsignedAnnotation").style.display = "none";
    document.getElementById("logoutbtn").style.removeProperty("display");
    document.getElementById("anotherloginbtn").style.display = "none";
    document.getElementById("loginbtn").style.display = "none";
    document.getElementById("showprofilepanel").style.removeProperty("display");
    document.getElementById("notificationsbell").style.removeProperty("display");
    document.getElementById("spaceleft").style.display = "block";
    //document.getElementById("showprofilepanel").src = "path/to/image";
    loggedin = true;
  }
  else{
    document.getElementById("logoutbtn").style.display = "none";
    document.getElementById("showprofilepanel").style.display = "none";
    document.getElementById("notificationsbell").style.display = "none";
    document.getElementById("spaceleft").style.removeProperty("display");
    if (getCookie("ignoreMain")!="true"){
      document.getElementById("modal").style.display = "block";
      document.getElementById("mainWelcome").style.display = "block";
    }
    if (getCookie("ignoreAnn")!="true"){
      document.getElementById("unsignedAnnotation").style.display = "block";
    }
  }
}

function unloadonline(){
  document.getElementById("accountitems").style.display = "none";
  document.getElementById("unsignedAnnotation").style.display = "none";
  document.getElementById("anotherloginbtn").style.display = "none";
  document.getElementById("loginbtn").style.display = "none";
  document.getElementById("logoutbtn").style.display = "none";
  document.getElementById("showprofilepanel").style.display = "none";
  document.getElementById("notificationsbell").style.display = "none";
}

function unloadAccount(){       
  document.getElementById("tablenotes").innerHTML = "";
  document.getElementById("tablenotes2").innerHTML = "<tr><th>Name</th><th>Last Opened</th><th>Created</th></tr>";
  document.getElementById("accountitems").style.display = "none";
  document.getElementById("showprofilepanel").style.display = "none";
  document.getElementById("notificationsbell").style.display = "none";
  document.getElementById("logoutbtn").style.display = "none";
  document.getElementById("loginbtn").style.removeProperty("display");
  document.getElementById("anotherloginbtn").style.removeProperty("display");
  loggedin = false;
  document.getElementById("otherwindow").style.removeProperty('display');
  document.getElementById("modal").style.removeProperty('display');
  document.getElementById("spaceleft").style.removeProperty("display");
}

function logout(){
  $.ajax({
    url: server + "/app/logout.php",
    success: function () {
      unloadAccount()
    },
    error: function() {
      SendTooltip("Could not connect to server.", "warn")
    }
  });
}

$.ajax({
  url: server + "/app/weather.php",
  success: function (response) {
    weather(response)
    setInterval(recheck, 1000 * 60 * 60);
  },
  error: function() {
    document.getElementById("weather").style.display = "none";
  }
});

function recheck(){
  $.ajax({
    url: server + "/app/weather.php",
    success: function (response) {
      weather(response)
      document.getElementById("weather").style.display = "block";
    },
    error: function() {
      document.getElementById("weather").style.display = "none";
    }
  });
}

function weather(info){
  if (info=="too many requests"){
    document.getElementById("weather").style.display = "none";
  }
  else{
    const parsedinfo = JSON.parse(info);
    if(parsedinfo.altdesc=="Thunderstorm"){
      parsedinfo.desc = "Thunderstorm";
    }
    if(parsedinfo.altdesc=="Drizzle"){
      parsedinfo.desc = "Rainy";
    }
    if(parsedinfo.altdesc=="Rain"){
      parsedinfo.desc = "Rainy";
    }
    if(parsedinfo.altdesc=="Snow"){
      parsedinfo.desc = "Snowing";
    }
    if(parsedinfo.altdesc=="Clouds"){
      parsedinfo.desc = "Cloudy";
    }
    if(parsedinfo.desc=="clear sky"){
      parsedinfo.desc = "Clear sky";
    }
    if(parsedinfo.desc=="few clouds"){
      parsedinfo.desc = "A little cloudy";
    }
    if(parsedinfo.desc=="scattered clouds"){
      parsedinfo.desc = "Somewhat cloudy";
    }
    if(parsedinfo.desc=="very heavy rain"||parsedinfo.desc=="extreme rain"||parsedinfo.desc=="heavy intensity rain"){
      parsedinfo.desc = "Heavy rain";
    }
    if(parsedinfo.desc=="Rain and snow"||parsedinfo.desc=="Light rain and snow"){
      parsedinfo.desc = "Snowing & raining";
    }
    if(parsedinfo.altdesc=="Mist"){
      parsedinfo.desc = "Mist";
    }
    
    var now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
    var now24 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false });
    var hour = parseInt(now24.slice(0, 2));
    var timedescription = parsedinfo.city;
    var temp = parseInt(parsedinfo.temp.toString().slice(0, 2));
    var feel = "a nice";
    if(Math.floor(Math.random() * 4)==2){
      feel = "a peaceful";
    }
    if(temp<1){
      feel="a freezing"
    }
    if(temp<14){
      feel="a cold"
    }
    if(temp>20){
      feel="a mild"
    }
    if(temp>28){
      feel="a hot"
    }
    if(temp>36){
      feel="an extremely hot"
    }
    if(hour>13&&hour<18){
      timedescription = "It's " + feel + " afternoon in " + parsedinfo.city;
    }
    if(hour>17&&hour<23){
      timedescription = "It's " + feel + " evening in " + parsedinfo.city;
    }
    if(hour>22||hour<6){
      timedescription = "It's " + feel + " night in " + parsedinfo.city;
    }
    if(hour==0){
      timedescription = "It's " + feel + " midnight in " + parsedinfo.city;
    }
    document.getElementById("weatherinfo").innerHTML = '<div id="weathertimed"><timed> Last updated ' + now + '</timed><a class="link" onclick="openotherwindow(' + "'sidepanel'" +')">Options</a></div><h2>' + parsedinfo.temp.toString().slice(0, 2) + '°C ' + parsedinfo.desc + "</h2><h3>" + timedescription +".</h3>"
  }
}
function hideWelcome() {
  ignoreLoad()
  document.getElementById("mainWelcome").style.display = "none";
  document.getElementById("modal").style.display = "none";
}

function newonlinenote(){
  document.getElementById("loggedwelcome").style.display = "none";
  document.getElementById("newnote").style.display = "block";
}

function dropdown(id) {
  var div;
  if (id == 1) {div = "note";hideMenu(2);hideMenu(3);}
  if (id == 2) {div = "edit";hideMenu(1);hideMenu(3);}
  if (id == 3) {div = "view";hideMenu(2);hideMenu(1);}
  document.getElementById(div).classList.toggle("show");
  if (document.getElementById(div).classList.contains('show')) document.getElementById(div + "btn").style.color = "white";
  else document.getElementById(div + "btn").style.removeProperty('color');
}
function hideMenu(id){
  if (id == 1) {note.classList.remove('show'); document.getElementById("notebtn").style.removeProperty('color');}
  if (id == 2) {edit.classList.remove('show'); document.getElementById("editbtn").style.removeProperty('color');}
  if (id == 3) {view.classList.remove('show'); document.getElementById("viewbtn").style.removeProperty('color');}
}
window.addEventListener('click', function (e) {
  if (!e.target.matches('.dropbtn')) {
    var note = document.getElementById("note");
    if (note.classList.contains('show')) note.classList.remove('show'); document.getElementById("notebtn").style.removeProperty('color');
    var edit = document.getElementById("edit");
    if (edit.classList.contains('show')) edit.classList.remove('show'); document.getElementById("editbtn").style.removeProperty('color');
    var view = document.getElementById("view");
    if (view.classList.contains('show')) view.classList.remove('show'); document.getElementById("viewbtn").style.removeProperty('color');
  }
  if (document.getElementById('menuPanel').contains(e.target)) {
  } else {
    if (document.getElementById('menu').contains(e.target)) { }
    else {
      closeNav();
    }
  }
});

notearea.addEventListener("contextmenu",function(event){
  event.preventDefault();
  var contextElement = document.getElementById("context-menu");
  contextElement.style.top = event.offsetY + 70 + "px";
  contextElement.style.left = event.offsetX + 20 + "px";
  contextElement.classList.add("active");
});
window.addEventListener("click",function(){
  document.getElementById("context-menu").classList.remove("active");
});

var sidepanelOpen = false;
function openNav() {
  sidepanelOpen = true;
  document.getElementById("menuPanel").style.width = "300px";
  document.getElementById("menuPanel").style.border = "solid 1px white";
}
function closeNav() {
  if (sidepanelOpen) {
    sidepanelOpen = false;
    document.getElementById("menuPanel").style.width = "0";
    document.getElementById("menuPanel").style.border = "solid 1px #767676";
    setTimeout(function (){ document.getElementById("menuPanel").style.border = "0"; }, 450);
  }
}

function hideprofilepanel(){document.getElementById("profilepanel").style.removeProperty('display');}
function profilepaneltoggle(){
  if (document.getElementById("profilepanel").style.display == "block") {
    document.getElementById("profilepanel").style.removeProperty('display');
  }
  else{
    document.getElementById("profilepanel").style.display = "block";
  }
}
window.addEventListener('click', function (e) {
  if (document.getElementById("profilepanel").contains(e.target)) {}
  else if (document.getElementById("showprofilepanel").contains(e.target)) {} 
  else { hideprofilepanel(); }
});

function logo() {
  window.open("http://midelight.net");
}

function compareSecondColumn(a, b) {
  if (a[1] === b[1]) {
      return 0;
  }
  else {
      return (a[1] > b[1]) ? -1 : 1;
  }
}

function openNote() {
  if(loggedin==true){
    $.ajax({
      url: server + "/app/getnotes.php",
      success: function (data) {
        var loginInfo = JSON.parse(data);
        loginInfo.notes.sort(compareSecondColumn);
        document.getElementById("tablenotes2").innerHTML = "<tr><th>Name</th><th>Last Opened</th><th>Created</th></tr>";

        for(var i = 0; i < loginInfo.notes.length; i++){
          document.getElementById("tablenotes2").innerHTML = document.getElementById("tablenotes2").innerHTML + "<tr onclick=\"loadonlinenote('"+loginInfo.notes[i][0]+"')\" class=\"listedNote\"><td>"+loginInfo.notes[i][0]+"</td><td>"+ timeSince(loginInfo.notes[i][1]*1000) +"</td><td>"+ new Date(loginInfo.notes[i][2]*1000).toLocaleDateString() + " " + new Date(loginInfo.notes[i][2]*1000).toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })+"</td></tr>"
        }
      }
    });

    var name = document.getElementById("newnotename").value;
    if(name){
      if(name.endsWith(".txt")){
        name = name.slice(0, -4);
      }
      document.getElementById("notename").value = name;
      saveonlinenote()
    }
  }
  else{
    openpanels("upload");
    document.getElementById("opensectionbtn").style.color = "#444";
    document.getElementById("opensectionbtn").style.borderBottom = "2px solid #444";
  }
  document.getElementById("uploadform").style.display = "block";
  document.getElementById("modal").style.display = "block";
}

function saveNote() {
  document.getElementById("savef").style.display = "block";
  document.getElementById("modal").style.display = "block";
}
function login() {
  document.getElementById("loginform").style.display = "block";
  document.getElementById("modal").style.display = "block";
}
function unlogin() {
  document.getElementById("loginform").style.removeProperty('display');
}
function hideAll() {
  document.getElementById("mainWelcome").style.removeProperty('display');
  document.getElementById("info").style.removeProperty('display');
  document.getElementById("WaitSave").style.removeProperty('display');
  document.getElementById("uploadform").style.removeProperty('display');
  document.getElementById("savef").style.removeProperty('display');
  document.getElementById("loginform").style.removeProperty('display');
  document.getElementById("otherwindow").style.removeProperty('display');
  document.getElementById("modal").style.removeProperty('display');
  document.getElementById("fileHistory").style.removeProperty('display');
}
window.onclick = function (event) {
  if (event.target == modal) {
    hideAll();
  }
}

function info(){
  closeNav();
  document.getElementById("modal").style.display = "block";
  document.getElementById("info").style.display = "block";
}
function uninfo(){
  document.getElementById("modal").style.display = "none";
  document.getElementById("info").style.display = "none";
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  var e = document.getElementById("filetype");
  var type = e.options[e.selectedIndex].text;
  element.setAttribute('download', filename + type);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function downloadNote() {
  var text = document.getElementById('notearea').value
  var name = document.getElementById('downloadName').value
  if (name) {
    download(name, text);
  }
  else{
    download("Note", text);
  }
}

function ignoreLoad(){
  setCookie("ignoreMain", "true", 4)
}

function loginannotation(){
  login();
  closeNav();
  noplzno();
}
function noplzno(){
  setCookie("ignoreAnn", "true", 24);
  document.getElementById("unsignedAnnotation").style.display = "none";
}

function SendTooltip(text, type){
  if(type=="warn"){ var icon = 'fa fa-exclamation-triangle'}
  if(type=="info"){ var icon = 'fa fa-exclamation-circle'}
  var tooltip = document.getElementById("tooltip");
  tooltip.innerHTML = '<i class="'+ icon +'"></i> <a>'+ text +'</a><div id="tooltiphr" class="tooltiphr"></div>';
  tooltip.style.display = "block";
  setTimeout(function () {
    tooltip.style.opacity = "1";
  }, 100);
  setTimeout(function () {
    document.getElementById("tooltiphr").style.width = "0";
  }, 500);
  setTimeout(function () {
    document.getElementById("tooltiphr").style.transition = "2.5s";
    document.getElementById("tooltiphr").style.opacity = "0";
  }, 3000);
  setTimeout(function () {
    tooltip.style.opacity = "0";
    setTimeout(function () {
      tooltip.style.display = "none";
    }, 500);
  }, 6000);
}

document.getElementById("ltrcheckmark").style.display = "block";
function direction(n){
  if(n){
    settings = {...settings, direction: "r"};
    document.getElementById("rtlcheckmark").style.display = "block";
    document.getElementById("ltrcheckmark").style.display = "none";
    document.getElementById("notearea").style.textAlign = "right";
  }
  else{
    delete settings.direction;
    document.getElementById("ltrcheckmark").style.display = "block";
    document.getElementById("rtlcheckmark").style.display = "none";
    document.getElementById("notearea").style.removeProperty('text-align');
  }
  saveSettings();
}
function showdirection(){
  event.preventDefault();
  document.getElementById("directions").style.display = "block";
}

document.addEventListener('swiped-right', function(e) {
  if(e.detail.xStart<50){
      openNav();
  }
});

document.addEventListener('swiped-left', function(e) {
  closeNav();
});

function openotherwindow(n){
  closeNav();
  panel(n);
  document.getElementById("modal").style.display = "block";
  document.getElementById("otherwindow").style.display = "block";
}
function closeotherwindow(panel){
  document.getElementById("modal").style.removeProperty = "display";
  document.getElementById("otherwindow").style.removeProperty = "display";
}

document.getElementById("account").style.display = "block";
document.getElementById("accountbtn").style.backgroundColor = "white";
document.getElementById("accountbtn").style.color = "black";

const panels = ["account", "profile", "privacy", "devices", "premium", "appearance", "sidepanel", "language", "theme", "font", "about", "help", "feedback", "info"];

var fontopened = true;
function panel(n){
  hideversion();
  panels.forEach(hideactiveloop);
  document.getElementById(n).style.display = "block";
  document.getElementById(n + "btn").style.backgroundColor = "white";
  document.getElementById(n + "btn").style.color = "black";

  if(n=="account"){
    if(loggedin!=true){
      login();
    }
  }

  if(n=="theme"){
    $.ajax({
      url: server + "/app/themes.php",
      success: function (response) {
        document.getElementById("theme").innerHTML = response;
      },
      error: function() {
        SendTooltip("Could not connect to server.", "warn")
      }
    });
  }

  if(n=="font"){
    if(fontopened){
      indexFonts();
      fontopened = false;
      if(localStorage.getItem("options")){
        if(settings.font.fontFamily){
          selectElement("select", settings.font.fontFamily)
        }
      }
    }
  }
}

//idk how to fix this if someone can please help
function hideversion(){
  document.getElementById("info").style.removeProperty("display");
  document.getElementById("infobtn").style.removeProperty("background-color");
  document.getElementById("infobtn").style.removeProperty("color");
}

function hideactiveloop(e) {
  if(document.getElementById(e).style.display == "block"){
    document.getElementById(e).style.removeProperty("display");
    document.getElementById(e + "btn").style.removeProperty("background-color");
    document.getElementById(e + "btn").style.removeProperty("color");
    if(e=="premium"){
      document.getElementById(e + "btn").style.color = "rgb(167, 44, 255)";
    }
  }
}

var currentTheme = "default";

function theme(theme, unsave){
  if(theme=="default"){
    delete settings.theme;
  }
  if(currentTheme!=theme){
    if(currentTheme!="default"){
      unloadcss(currentTheme + ".css")
    }
  }
  if(currentTheme==theme){
    if(!unsave){
      SendTooltip("You are already using that theme.", "info")
    }
  }
  else{
    currentTheme = theme;
    if(currentTheme!="default"){
      loadcss(theme + ".css")
      settings = {...settings, theme: theme};
    }
  }
  if(!unsave){
    saveSettings();
  }
}

function loadcss(name){
  var cssId = 'myCss'
  var head  = document.getElementsByTagName('head')[0];
  var link  = document.createElement('link');
  link.id   = cssId;
  link.rel  = 'stylesheet';
  link.type = 'text/css';
  link.href = server + "/Themes/" + name;
  link.media = 'all';
  head.appendChild(link);
}

function unloadcss(name){
  $("link[href='" + server + "/Themes/"+ name +"']").remove();
}



function biomaxlength(n){
  document.getElementById("biomaxlength").innerHTML = 120 - n;
}

let timeout = null;
var lastText;

notearea.addEventListener('keyup', function (e) {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    if(notearea.value!=lastText){
      if(currentOnlineNote){
        saveonlinenote();
      }
      lastText = notearea.value;

      if(devMode){
        runCode();
      }
    }
  }, 2000);
});

//login
$("#login").submit(function(e) {

  e.preventDefault()

  var values = $(this).serialize();

  $.ajax({
        url: server + "/app/login.php",
        type: "post",
        data: values ,
        success: function (response) {
          loginresponse(response)
        },
        error: function(jqXHR, textStatus, errorThrown) {
        }
    });
});

function loginresponse(response){
  var loginInfo = JSON.parse(response);
  if(loginInfo.name=="already logged in"){
    document.getElementById("logininfo").style.display = "block";
    document.getElementById("logininfo").innerHTML = "You are already logged in!";
  }
  else if(loginInfo.name=="wrong credentials"){
    document.getElementById("logininfo").style.display = "block";
    document.getElementById("password").value = "";
  }
  else{
    loadAccount(response);
    document.getElementById("logininfo").style.display = "none";
    document.getElementById("password").value = "";
    // localStorage.setItem('sessionid', response);
  }
}


function showpassword() {
  var password = document.getElementById("password");
  if (password.type == "password") {
    password.type = "text";
    document.getElementById('logineye').classList.remove('fa-eye')
    document.getElementById('logineye').classList.add('fa-eye-slash')
  }
  else {
    password.type = "password";
    document.getElementById('logineye').classList.remove('fa-eye-slash')
    document.getElementById('logineye').classList.add('fa-eye')
  }
}

//Create writenote specific analytics

const fontAvailable = new Set();

const fontCheck = new Set([
  'Arial', 'Arial Black', 'Bahnschrift', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Ebrima', 'Franklin Gothic Medium', 'Gabriola', 'Gadugi', 'Georgia', 'HoloLens MDL2 Assets', 'Impact', 'Ink Free', 'Javanese Text', 'Leelawadee UI', 'Lucida Console', 'Lucida Sans Unicode', 'Malgun Gothic', 'Marlett', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU-ExtB', 'Mongolian Baiti', 'MS Gothic', 'MV Boli', 'Myanmar Text', 'Nirmala UI', 'Palatino Linotype', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Historic', 'Segoe UI Emoji', 'Segoe UI Symbol', 'SimSun', 'Sitka', 'Sylfaen', 'Symbol', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings', 'Yu Gothic',
  'American Typewriter', 'Andale Mono', 'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS', 'Avenir', 'Avenir Next', 'Avenir Next Condensed', 'Baskerville', 'Big Caslon', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bradley Hand', 'Brush Script MT', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charter', 'Cochin', 'Comic Sans MS', 'Copperplate', 'Courier', 'Courier New', 'Didot', 'DIN Alternate', 'DIN Condensed', 'Futura', 'Geneva', 'Georgia', 'Gill Sans', 'Helvetica', 'Helvetica Neue', 'Herculanum', 'Hoefler Text', 'Impact', 'Lucida Grande', 'Luminari', 'Marker Felt', 'Menlo', 'Microsoft Sans Serif', 'Monaco', 'Noteworthy', 'Optima', 'Palatino', 'Papyrus', 'Phosphate', 'Rockwell', 'Savoye LET', 'SignPainter', 'Skia', 'Snell Roundhand', 'Tahoma', 'Times', 'Times New Roman', 'Trattatello', 'Trebuchet MS', 'Verdana', 'Zapfino',
].sort());

(async() => {
  await document.fonts.ready;


  for (const font of fontCheck.values()) {
    if (document.fonts.check(`12px "${font}"`)) {
      fontAvailable.add(font);
    }
  }
})();

var select = document.getElementById("select");

function indexFonts(){
  for (let item of fontAvailable){
    var opt = document.createElement('option');
    opt.value = opt.innerHTML = item;
    opt.style.fontFamily = item;
    select.add(opt);
  }
}

function fontChange(n){
  if(n=="font"){
    var e = document.getElementById("select");
    var fontSelected = e.options[e.selectedIndex].text;
    notearea.style.fontFamily = fontSelected;
    if(fontSelected=="Midelight's default"){
      notearea.style.removeProperty("font-family");
      delete settings.font.fontFamily;
    }
    else{
      settings.font = {...settings.font, fontFamily: fontSelected};
    }
  }
  if(n=="size"){
    var fontsizeinput = document.getElementById("fontsize");
    notearea.style.fontSize = fontsizeinput.value + "px";
    if(fontsizeinput.value==24){
      notearea.style.removeProperty("font-size");
    }
    if(fontsizeinput.value==24){
      delete settings.font.fontSize;
    }
    else{
      settings.font = {...settings.font, fontSize: fontsizeinput.value};
    }
  }
  if(n=="style"){
    var e = document.getElementById("selectStyle");
    var fontstyleSelected = e.options[e.selectedIndex].text;
    if(fontstyleSelected=="Light"){
      notearea.style.fontWeight = 100;
    }
    if(fontstyleSelected=="Regular"){
      notearea.style.removeProperty("font-weight");
    }
    if(fontstyleSelected=="Bold"){
      notearea.style.fontWeight = 600;
    }
      if(fontstyleSelected=="Light"){
        settings.font = {...settings.font, fontWeight: 100};
      }
      if(fontstyleSelected=="Regular"){
        delete settings.font.fontWeight;
      }
      if(fontstyleSelected=="Bold"){
        settings.font = {...settings.font, fontWeight: 600};
      }
  }
  saveSettings();
}

var timeout4
function saveSettings(arg){
  settingsStr = JSON.stringify(settings);
  if(arg=="locally"){
    localStorage.setItem("options", settingsStr)
  }
  else{
    localStorage.setItem("options", settingsStr)
    clearTimeout(timeout4);
    timeout4 = setTimeout(function () {
      var post = {
          'settings' : settingsStr
      };

      if(loggedin==true){
        $.ajax({
          url: server + "/app/savesettings.php",
          type: "post",
          data: post,
          success: function (response) {
          },
          error: function() {
            SendTooltip("Could not connect to server.", "warn")
          }
      });
      }
    }, 1500);
  }
}

document.getElementById("versiondisplay").innerHTML = version;

function selectElement(id, textToFind) {
  var dd = document.getElementById(id);
  for (var i = 0; i < dd.options.length; i++) {
      if (dd.options[i].text === textToFind) {
          dd.selectedIndex = i;
          break;
      }
  }
}
//Loading settings here
function loadSettings(){
  if(localStorage.getItem("options")){
    settings = JSON.parse(localStorage.getItem("options"));
    if(settings.theme){
      theme(settings.theme, true);
    }
    if(settings.font){
      if(settings.font.fontFamily){
        notearea.style.fontFamily = settings.font.fontFamily;
      }
      if(settings.font.fontSize){
        notearea.style.fontSize = settings.font.fontSize + "px";
        document.getElementById("fontsize").value = settings.font.fontSize;
      }
      if(settings.font.fontWeight){
        notearea.style.fontWeight = settings.font.fontWeight;
        var weightMeaning;
        if(settings.font.fontWeight==100){
          weightMeaning = "Light";
        }
        if(settings.font.fontWeight==600){
          weightMeaning = "Bold";
        }
        selectElement("selectStyle", weightMeaning);
      }
    }
    if(settings.wordcounter){
      showCounter();
    }
    if(settings.wordwrap){
      wordwrapcheckmark.style.display = "none";
      notearea.wrap="off";
    }
    if(settings.direction){
      document.getElementById("rtlcheckmark").style.display = "block";
      document.getElementById("ltrcheckmark").style.display = "none";
      document.getElementById("notearea").style.textAlign = "right";
    }
  }
}

loadSettings();

function saveonlinenote(){
  settingsStr = JSON.stringify(settings);
  var data = {
    'notename' : document.getElementById("notename").value,
    'text' : notearea.value,
    'settings' : settingsStr
  };

  if(loggedin==true){
    $.ajax({
      url: server + "/app/savenote.php",
      type: "post",
      data: data,
      success: function (response) {
        var name = document.getElementById("notename").value;
        currentOnlineNote = name;
        oldname = name;
      },
      error: function() {
        SendTooltip("Couldn't save your note online!", "warn")
      }
    });
  }
  
  if(saved==false){
    saved = true;
    document.getElementById("unsavedchangesnotice").style.removeProperty("display")
    document.getElementById("unsavedchangesnotice").style.removeProperty("opacity")
    document.title = document.getElementById("notename").value + " - WriteNote"
  }
}

function loadonlinenote(name){
  var data = {
    'notename' : name
  };

  if(loggedin==true){
    $.ajax({
      url: server + "/app/loadnote.php",
      type: "post",
      data: data,
      success: function (response) {
        notearea.value = response;
        document.getElementById("notename").value = name;
        document.title = name + ' - WriteNote';
        currentOnlineNote = name;
        oldname = name;
        hideAll();
      },
      error: function() {
        notearea.value = response;
      }
    });
  }
  
  if(saved==false){
    saved = true;
    document.getElementById("unsavedchangesnotice").style.removeProperty("display")
    document.getElementById("unsavedchangesnotice").style.removeProperty("opacity")
    document.title = document.getElementById("notename").value + " - WriteNote"
  }
}

function getnotes(){
  $.ajax({
    url: server + "/app/getnotes.php",
    type: "post",
    data: "nameonly",
    success: function (data) {
      var loginInfo = JSON.parse(data);
      notes = loginInfo.notes;
      console.log(data);
    }
  });
}

var timeoutname;
var timeoutnameserver;
var ifrename = false;
document.getElementById("notename").addEventListener('keyup', function () {
  if(currentOnlineNote){
    clearTimeout(timeoutname);
    unnametaken("notename");
    timeoutname = setTimeout(function () {
      clearTimeout(timeoutnameserver);
      timeoutnameserver = setTimeout(function () {
        getnotes();
      }, 600);
      for(var i=0; i<notes.length; i++){
        if(document.getElementById("notename").value==notes[i]){
          if(document.getElementById("notename").value!=oldname){
            nametaken("notename");
            ifrename = false;
          }
        }
      }
    }, 200);
  }
});

document.getElementById("notename").addEventListener("change", function(){
  if(currentOnlineNote){
    getnotes();
    for(var i=0; i<notes.length; i++){
      if(document.getElementById("notename").value==notes[i]){
        if(document.getElementById("notename").value!=oldname){
          nametaken("notename");
        }
      }
    }
    if(ifrename!=false){
      renameonlinenote();
      updateTitle();
    }
  }
  else{
    updateTitle();
  }
});

document.getElementById("newnotename").addEventListener('keyup', function () {
  if(loggedin){
    clearTimeout(timeoutname);
    unnametaken("newnotename");
    timeoutname = setTimeout(function () {
      clearTimeout(timeoutnameserver);
      timeoutnameserver = setTimeout(function () {
        getnotes();
      }, 600);
      for(var i=0; i<notes.length; i++){
        if(document.getElementById("newnotename").value==notes[i]){
          nametaken("newnotename");
          ifrename = false;
        }
      }
    }, 200);
  }
});

document.getElementById("newnotename").addEventListener("change", function(){
  if(loggedin){
    getnotes();
    for(var i=0; i<notes.length; i++){
      if(document.getElementById("newnotename").value==notes[i]){
        nametaken("newnotename");
      }
    }
    if(ifrename!=false){
      var name = document.getElementById("newnotename").value
      document.getElementById("notename").value = name;
      oldname = name;
      updateTitle();
    }
  }
  else{
    updateTitle();
  }
});

function updateTitle(){
  if(saved==true){
    document.title = document.getElementById("notename").value + " • " + "WriteNote"
  }
  else{
    document.title = document.getElementById("notename").value + " - " + "WriteNote"
  }
}

function nametaken(input){
  ifrename = false;
  document.getElementById(input + "text").style.display = "block";
  document.getElementById(input).style.borderBottom = "1px solid #a00000";
  document.getElementById(input).style.color = "#a00000";
}
function unnametaken(input){
  ifrename = true;
  document.getElementById(input + "text").style.display = "none";
  document.getElementById(input).style.removeProperty("border-bottom");
  document.getElementById(input).style.removeProperty("color");
}


function renameonlinenote(){
  var data = {
    'oldnotename' : oldname,
    'notename' : document.getElementById("notename").value
  };

  if(loggedin==true){
    $.ajax({
      url: server + "/app/renamenote.php",
      type: "post",
      data: data,
      success: function (response) {
        document.getElementById("notename").value = response;
        oldname = response;
      },
      error: function() {
        notearea.value = response;
      }
    });
  }
}

var oldname;
var saved = true;

var wordCounter = document.getElementById("wordCount");
var wordCounterdiv = document.getElementById("wordCountdiv");

notearea.addEventListener("input", function(){
  if(saved==true){
    saved = false;
    document.title = document.getElementById("notename").value + " • " + "WriteNote"
    document.getElementById("unsavedchangesnotice").style.display = "block"
    setTimeout(function () {
      document.getElementById("unsavedchangesnotice").style.opacity = 1
    }, 100);
  }
  if(wordCounterdiv.style.display == "block"){
      if(notearea.value.length>0){
          var letterCount = notearea.value.length;
          var wordCount = notearea.value.split(" ").length;

          wordCounter.innerHTML = '<a> Words ' + wordCount + ' • Symbols ' + letterCount + '</a>';
      }
      else{wordCounter.innerHTML = '<a> Words 0 • Symbols 0</a>';}
  }
});

function clearNote(){
  saved = true;
  document.getElementById("unsavedchangesnotice").style.removeProperty("display")
  document.getElementById("unsavedchangesnotice").style.removeProperty("opacity")
  document.title = 'WriteNote';
  notearea.value = "";
  document.getElementById("notename").value = "Untitled";
  currentOnlineNote = "";
  oldname = "";
}

function newNote() {
  if(saved==false){
    document.getElementById("modal").style.display = "block";
    document.getElementById("WaitSave").style.display = "block";
    document.getElementById("waitsavebutton1").setAttribute('onclick','clearNoteSave()')
    document.getElementById("waitsavebutton2").setAttribute('onclick','clearNote();hideAll()')
  }
  else{
    clearNote();
  }
}
function clearNoteSave() {
  hideAll();
  save();
  clearNote();
}

function fileHistory(){
  document.getElementById("modal").style.display = "block";
  document.getElementById("fileHistory").style.display = "block";
}

function startanew(){
  var name = document.getElementById("newnotename").value;
  notearea.value = "";
  document.getElementById("notename").value = name;
  document.title = name + ' - WriteNote';
  currentOnlineNote = name;
  oldname = name;
  hideAll();
}

function openDev(){
  devMode = true;
  notearea.style.width = "calc(50% - 6px)";
  notearea.placeholder = "Write some code!";
  document.getElementById("dev").style.display = "block";
}

var logOfConsole = [];

var _log = console.log,
    _warn = console.warn,
    _error = console.error;

console.log = function() {
    logOfConsole.push({method: 'log', arguments: arguments});
    //document.getElementById("devConsole").innerHTML = _log.apply(console, arguments);
};

console.warn = function() {
    logOfConsole.push({method: 'warn', arguments: arguments});
    return _warn.apply(console, arguments);
};

console.error = function() {
    logOfConsole.push({method: 'error', arguments: arguments});
    return _error.apply(console, arguments);
};

function runCode(){
  if(notearea!=""){
    document.getElementById("dev").innerHTML = eval(notearea.value);
  }
}

//openDev()