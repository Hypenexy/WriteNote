var notearea = document.createElement("notearea")
app.appendChild(notearea)

var workspace = "note"

notearea.contentEditable = "true"

document.execCommand("defaultParagraphSeparator", false, "p");

notearea.addEventListener('input', function (e) {
    if(!notearea.innerHTML.includes("<p")){
        document.execCommand('formatBlock', false, "p");
    }
})

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
    return notearea.innerHTML.replaceAll("</p><p>", "<->").replaceAll(' alt=""', "").replaceAll("<p><br></p>", "<n>").replaceAll("<p> </p>", "")
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