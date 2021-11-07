drag(document.getElementById("calculator"));
drag(document.getElementById("timer"));

function drag(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closecalculator;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    if (elmnt.offsetTop - pos2<0){elmnt.offsetTop=0;pos2=0}
    if (elmnt.offsetLeft - pos1<0){elmnt.ofoffsetLeftfsetTop=0;pos1=0}
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closecalculator() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

calc = document.getElementById("calculator");
calculatorcheckmark = document.getElementById("calculatorcheckmark");
calc.style.display = "none";

function showCalculator(){
  calc.style.display = "block";
  calculatorcheckmark.style.display = "block";
}
function hideCalculator(){
  calc.style.display = "none";
  calculatorcheckmark.style.display = "none";
}

function toggleCalculator(){
  if(calc.style.display == "none"){
      showCalculator();
  }
  else{
      hideCalculator();
  }
}

var calculatorinput = document.getElementById("calculatorinput");
var CalculatorlastExpression = document.getElementById("CalculatorlastExpression")

function evalc(val)
{
  if(val=="c"){calculatorinput.value = "";CalculatorlastExpression.innerHTML = ""}
  if(val=="="){if(calculatorinput.value){CalculatorlastExpression.innerHTML=calculatorinput.value + "="; calculatorinput.value = eval(calculatorinput.value);}}
  if(val=="+/-"){calculatorinput.value = eval(calculatorinput.value)*-1}
  if(val=="<"){calculatorinput.value = calculatorinput.value.slice(0, -1)}
  if(val=="l"){calculatorinput.value = CalculatorlastExpression.innerHTML.slice(0, -1); CalculatorlastExpression.innerHTML = ""}

  if(val!="c"&&val!="="&&val!="+/-"&&val!="<"&&val!="l"){calculatorinput.value+=val}
}


timer = document.getElementById("timer");
timercheckmark = document.getElementById("timercheckmark");
timer.style.display = "none";

function showTimer(){
  timer.style.display = "block";
  timercheckmark.style.display = "block";
}
function hideTimer(){
  timer.style.display = "none";
  timercheckmark.style.display = "none";
}

function toggleTimer(){
  if(timer.style.display == "none"){
      showTimer();
  }
  else{
      hideTimer();
  }
}

var timerTime = 0;
var timer;

function Timer() {
  const d = new Date();
  console.log(timerTime);
  timerTime = timerTime - 1;
  document.getElementById("demo").innerHTML = d.toLocaleTimeString();
  if (timerTime<0){window.clearInterval(timerVariable)}
}

function startTimer(){
  document.getElementById("timerStart").style.display = "none";
  document.getElementById("timerPause").style.display = "block";
  if (document.getElementById("timerHours").value){
    timerTime = document.getElementById("timerHours").value*3600;
  }
  if (document.getElementById("timerMinutes").value){
    timerTime = timerTime + document.getElementById("timerMinutes").value*60;
  }
  if (document.getElementById("timerSeconds").value){
    timerTime = timerTime + document.getElementById("timerSeconds").value;
  }
  console.log(timerTime);
  timer = setInterval(Timer, 1000);
}
function pauseTimer(){
  document.getElementById("timerPause").style.display = "none";
  document.getElementById("timerPlay").style.display = "block";
}
function playTimer(){
  document.getElementById("timerPause").style.display = "block";
  document.getElementById("timerPlay").style.display = "none";
}
function resetTimer(){
  timer.clearInterval(timerVariable)
  document.getElementById("timerStart").style.display = "block";
  document.getElementById("timerPlay").style.display = "none";
  document.getElementById("timerPause").style.display = "none";
}

var wordwrapcheckmark = document.getElementById("wordwrapcheckmark");
wordwrapcheckmark.style.display = "block";
notearea.wrap="on";

function togglewordwrap(){
  if(notearea.wrap=="off"){
    delete settings.wordwrap;
    notearea.wrap="on";
    wordwrapcheckmark.style.display = "block";
  }
  else{
    settings = {...settings, wordwrap: "false"};
    notearea.wrap="off";
    wordwrapcheckmark.style.display = "none";
  }
  saveSettings();
}

var fullscreencheckmark = document.getElementById("fullscreencheckmark");

function togglefullscreen(){
  if(fullscreen==false){
    openFullscreen();
  }
  else{
    closeFullscreen();
  }
}

document.addEventListener('fullscreenchange', (event) => {
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

/*
function togglespellcheck(){
  if(notearea.spellcheck == true){
    notearea.spellcheck = false;
    document.getElementById("spellcheckcheckmark").style.display = "block";
  }
  else{
    notearea.spellcheck = true;
    document.getElementById("spellcheckcheckmark").style.display = "none";
  }
}
*/