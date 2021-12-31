function selectText() {
  document.getElementById('notearea').focus();
  document.getElementById('notearea').select();
}
var copiedText;
var lastText;
var functionsChangeText = false;

function copy(){
  var selectedText = document.querySelector("#notearea");
  selectedText.focus();
  document.execCommand('copy');
  var s = notearea.selectionStart;
  var e = notearea.selectionEnd;
  copiedText = notearea.value.substring(s,e);
}
String.prototype.replaceAt = function(index, replacement, indexend) {
  return this.substr(0, index) + replacement + this.substr(index + indexend);
}
function isEmpty(value){
  return (value == null || value.length === 0);
}
var timesFailed = 1;
function paste(){
  if(isEmpty(copiedText)){
    SendTooltip("You should copy something first.", "info");
    timesFailed = timesFailed + 1;
    if(timesFailed>4 && timesFailed<9){SendTooltip("You.. are supposed to copy something... from the copy button in the menu..", "warn");}
  }
  else{
    var s = notearea.selectionStart;
    var e = notearea.selectionEnd;
    lastText = notearea.value;
    functionsChangeText = true;
    notearea.value = notearea.value.replaceAt(s, copiedText, e);
  }
}

function undo(){
  if (functionsChangeText==true){
    functionsChangeText = false;
    notearea.value = lastText;
  }
  notearea.focus();
  document.execCommand("undo");
}
function redo(){
  notearea.focus();
  document.execCommand("redo");
}
function cut(){
  var pasteText = document.querySelector("#notearea");
  pasteText.focus();
  document.execCommand("cut");
}

$(document).ready(function() {
  var ctrlDown = false,
      ctrlKey = 17,
      cmdKey = 91,
      vKey = 86,
      cKey = 67;

  $(document).keydown(function(e) {
      if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
  }).keyup(function(e) {
      if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
  });

  $(".no-copy-paste").keydown(function(e) {
      if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)) return false;
  });
  
  $(document).keydown(function(e) {
      if (ctrlDown && (e.keyCode == cKey)){ 
        var s = notearea.selectionStart; 
        var e = notearea.selectionEnd; 
        copiedText = notearea.value.substring(s,e);
      }
  });
});