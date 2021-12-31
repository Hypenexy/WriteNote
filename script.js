var notearea = document.getElementById("notearea")
var mobile = false

//dropdowns
var notebtn = document.getElementById("notebtn")
var notedrp = document.getElementById("notedrp")
var editbtn = document.getElementById("editbtn")
var editdrp = document.getElementById("editdrp")
var viewbtn = document.getElementById("viewbtn")
var viewdrp = document.getElementById("viewdrp")

notebtn.onclick = function(){
    dropdown("note")
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
    }
}
function dropdown(n){
    dropdowns.forEach(hidedropdown)
    if(dropdownactive==false||mobile==true){
        dropdownactive = true
        dropdownactivename = n;
        var element = document.getElementById(n + "drp")
        element.style.visibility = "visible"
        element.style.transform = "translate(0)"
        element.style.maxHeight = "100%"
        element.style.opacity = 1
        document.getElementById(n + "btn").style.color = "#fff"
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
  document.getElementById("menuPanel").style.borderRight = "solid 1px white";
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
    window.open("http://midelight.net");
  }
//end of sidepanel


//word counter

var wordCounter = document.getElementById("wordCount");
var wordCounterdiv = document.getElementById("wordCountdiv");
var wordcountercheckmark = document.getElementById("wordcountercheckmark");


function showCounter(){
    //settings = {...settings, wordcounter: "show"};
    //saveSettings();
    if (notearea.value.length){
        var letterCount = notearea.value.length;
        var wordCount = notearea.value.split(" ").length;
        wordCounter.innerHTML = '<a> Words ' + wordCount + ' • Symbols ' + letterCount + '</a>';
    }
    else{
        wordCounter.innerHTML = '<a> Words 0 • Symbols 0</a>';
    }
    wordCounterdiv.style.display = "block";
    wordcountercheckmark.style.display = "block";
    notearea.style.height = "calc(100% - 108px)";
}
function hideCounter(){
    //delete settings.wordcounter;
    //saveSettings();
    wordcountercheckmark.style.display = "none";
    wordCounterdiv.style.display = "none";
    notearea.style.height = "calc(100% - 66px)";
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
    document.getElementById(option).style.color = "#000"
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
    document.getElementById(option).style.color = "#000"
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

function openhome(){
    options.style.display = "block"
    create.style.removeProperty("display")
    open.style.removeProperty("display")
}

function fileoptions(note, event, mouse){
    if (notepreview.classList.contains("active") && lastnotepreview==note){
        hidefileoptions()
    }
    else{
        lastnotepreview = note
        notepreview.style.display = "block"
        //maybe there should be a really small delay cause if it's too fast the animation could not show
        var element = event.path[1]
        var rect = element.getBoundingClientRect();
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

// function fileoptionhover(e){ Leaving this for a later date, not really useful and might have a different menu on hover and stay.
//     setTimeout(function (){ 
//         fileoptions((e.path[0].getElementsByTagName("ti")[0].innerText), e)
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

var open = document.getElementById("open")
function openproject(){
    open.style.display = "block"
    options.style.display = "none"
}

function closeHome(){
    modal.style.display = "none"
    welcome.style.display = "none"
}

//end of home





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
closeHome()

//end of site builder


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
    todos.innerHTML = "<div><todotick></todotick><co contenteditable='true'>" + text + "</co><span onclick=\"editTodo('My summer diary', event)\" class=\"more m-i\">more_vert</span></div>" + todos.innerHTML
}

loadTodo()

//end of to do list


//WriteNote Editor Functions

//load elements

function loadScript(url) {
    var script = document.createElement("script")
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

var texthistory = []

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

//events (keep at end)

var timeoutsave
var timeouthistory

notearea.addEventListener('input', function (e) {
  //unsave status stuff
  if(wordCounterdiv.style.display == "block"){
    updateWordCounter()
  }

  clearTimeout(timeouthistory)
  timeouthistory = setTimeout(function () {
    texthistory.push(notearea.innerHTML)
  }, 300);

  ////console.log(texthistory)
  
//   clearTimeout(timeoutsave);
//   timeoutsave = setTimeout(function () {
//     if(notearea.value!=lastText){
//       if(currentOnlineNote){
//         saveonlinenote();
//       }
//       lastText = notearea.value;

//       if(devMode){
//         runCode();
//       }
//     }
//   }, 2000);

})

notearea.addEventListener('keydown', function (e) {
    if (e.key === 'Tab' || e.keyCode === 9) {
        //e.preventDefault(); this feature is trash
        //insertTextAtCaret("\u00a0\u00a0\u00a0\u00a0")
    }
})

window.addEventListener('click', function (e) {
    mobile = false
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
        if (!e.path[0].matches("span.more") && !e.path[1].matches("div#notepreview.active") &&! e.path[0].matches("div#notepreview.active")){
            hidefileoptions()
        }

        //hidewelcome
        if(e.path[0].matches("div#modal")){
            closeHome()
        }
    }
    catch{}
})

window.addEventListener('touchstart', function (e) {
    mobile = true
})
window.addEventListener('touchend', function (e) {
    mobile = true
})

window.addEventListener('contextmenu', function (e) {
    try{
        if (e.path[0].matches("div")&&e.path[1].matches("div#files")){
            e.preventDefault()
            fileoptions((e.path[0].getElementsByTagName("ti")[0].innerText), e, true)
        }
        if (e.path[1].matches("div")&&e.path[2].matches("div#files")){
            e.preventDefault()
            fileoptions((e.path[1].getElementsByTagName("ti")[0].innerText), e, true)
        }
    }
    catch{}
})