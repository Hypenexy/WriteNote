
var wordCounter = document.getElementById("wordCount");
var wordCounterdiv = document.getElementById("wordCountdiv");
var wordcountercheckmark = document.getElementById("wordcountercheckmark");
wordCounterdiv.style.display = "none";

function showCounter(){
    settings = {...settings, wordcounter: "show"};
    saveSettings();
    if (notearea.value.length){
        var letterCount = notearea.value.length;
        var wordCount = notearea.value.match(/(\w+)/g).length;
        wordCounter.innerHTML = '<a> Words ' + wordCount + ' • Symbols ' + letterCount + '</a>';
    }
    else{
        wordCounter.innerHTML = '<a> Words 0 • Symbols 0</a>';
    }
    wordCounterdiv.style.display = "block";
    wordcountercheckmark.style.display = "block";
    notearea.style.height = "calc(100vh - 108px)";
}
function hideCounter(){
    delete settings.wordcounter;
    saveSettings();
    wordcountercheckmark.style.display = "none";
    wordCounterdiv.style.display = "none";
    notearea.style.height = "calc(100vh - 66px)";
}

function toggleCounter(){
    if(wordCounterdiv.style.display == "none"){
        showCounter();
    }
    else{
        hideCounter();
    }
}