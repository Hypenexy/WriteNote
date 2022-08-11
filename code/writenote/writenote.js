var notearea = document.createElement("notearea")
app.appendChild(notearea)

var workspace = "note"

notearea.contentEditable = "true"

document.execCommand("defaultParagraphSeparator", false, "p")

notearea.addEventListener('focus', function (e) {
    if(!notearea.innerHTML.includes("<p")){
        setTimeout(() => {
            document.execCommand('formatBlock', false, "p") // Probably a stupid fix for my iPhone, really should think about this when smarter.
        }, 20);
    }
})


notearea.addEventListener('input', function (e) {
    if(!notearea.innerHTML.includes("<p")){
        document.execCommand('formatBlock', false, "p")
    }
})

notearea.addEventListener('paste', function(e){ // i also need to sanitize drag and drop text from other tabs!
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
        //let regex = /<(?!(\/\s*)?(a|b|i|em|s|strong|u)[>,\s])([^>])*>/g;
        // pastedText = pastedText.replace(regex, '');
        // let sanitizedText = pastedText.replace(/^\s*\n/gm, '<p><br /></p>')
        // sanitizedText = sanitizedText.replace(/<\/?span[^>]*>/g, '')
        // sanitizedText = sanitizedText.replace(/class='[a-zA-Z0-9:;\\.\\s\\(\\)\\-\\,]*'/g, '')
        // sanitizedText = sanitizedText.replace(/style='[a-zA-Z0-9:;\\.\\s\\(\\)\\-\\,]*'/g, '')

        document.execCommand('formatBlock', false, "p");
        document.execCommand('insertText', false, pastedText);
        document.execCommand('formatBlock', false, "p")
    }
})


function noteCompress(){//find out if <p> </p> are useless
    return notearea.innerHTML.replaceAll("<p><br></p>", "<n>").replaceAll("<p> </p>", "").replaceAll("<p></p>", "").replaceAll("</p><p>", "<->").replaceAll(' alt=""', "")
}

function noteParse(note){
    return note.replaceAll("<->", "</p><p>").replaceAll("<n>", "<p><br></p>")
}

// var noteareatimeout
// notearea.addEventListener('input', function(e){
//     clearTimeout(noteareatimeout)
//     noteareatimeout = setTimeout(function () {
//         var selection = saveCaretPosition()
//         var links = notearea.getElementsByTagName("a")
//         for (let i = 0; i < links.length; i++) {
//             console.log(links[i].outerHTML)
//             console.log(links[i].innerText)
//             if(" " + links[i].href != links[i].innerText){
//                 links[i].remove()
//             }
//         }
//         var urlified = urlify(notearea.innerHTML)
//         if(notearea.innerHTML != urlified){
//             notearea.innerHTML = urlified
//         }
//         selection()
//     }, 500);
// })

// var urlRegex = /\b([^\="\/])(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]/ig;
// function urlify(text){
//     return text.replace(urlRegex, function(url) {
//         return '><a href="' + url + '">' + url + '</a>';
//     })
// }


// function saveCaretPosition(){
//     var savedSel = rangy.saveSelection()

//     return function restore(){
//         rangy.restoreSelection(savedSel)
//     }
// }

// document.addEventListener("keydown", function(){
//     console.log(document.activeElement)
//     if(document.activeElement==document.body){
//         notearea.focus()
//     }
// }) Maybe use if you can fix the selection!


document.addEventListener("dragover", dropChange, false) // work on this lol
document.addEventListener("dragleave", dropChangeBack, false)
document.addEventListener("drop", dropChangeBack, false)//it's flashing?

var dropeffect = document.createElement("dropeffect")
dropeffect.innerHTML = "<headerfx>Drop here to open as a new file</headerfx><noteareafx>Drop here to insert in current file</noteareafx>" //add a choice to insert contents or a file! if it's a file lol
app.appendChild(dropeffect)

function dropChange(){
    dropeffect.classList.add("dropeffectvisible")
}

function dropChangeBack(){
    dropeffect.classList.remove("dropeffectvisible")
}