var notearea = document.createElement("notearea")
app.appendChild(notearea)

var workspace = "note"

notearea.contentEditable = "true"
notearea.tabIndex = '0'

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
    //return notearea.innerHTML.replaceAll("<p><br></p>", "<n>").replaceAll("<p> </p>", "").replaceAll("<p></p>", "").replaceAll("</p><p>", "<->").replaceAll(' alt=""', "")
    return notearea.innerHTML
}

function noteParse(note){
    //return note.replaceAll("<->", "</p><p>").replaceAll("<n>", "<p><br></p>")
    return note
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

//my attempt at dropfx
// document.addEventListener("dragover", function(e){
//     dropChange()
//     console.log(e.dataTransfer)
    
// }, false) // work on this lol
// document.addEventListener("dragleave", dropChangeBack, false)
// document.addEventListener("drop", dropChangeBack, false)//it's flashing? yes because ur stupid and when the element appears u hover on it then it dissapears and u hover on the notearea and it returns causing an infinite loop bro

// var dropeffect = document.createElement("dropeffect")
// dropeffect.innerHTML = "<headerfx>Drop here to open as a new file</headerfx><noteareafx>Drop here to insert in current file</noteareafx>" //add a choice to insert contents or a file! if it's a file lol
// app.appendChild(dropeffect)

// function dropChange(){
//     dropeffect.classList.add("dropeffectvisible")
// }

// function dropChangeBack(){
//     dropeffect.classList.remove("dropeffectvisible")
// }


/**
 * This function has been stolen from stackoverflow,
 * so love <3 goes out to RobM and chiliNUT.
 * It also uses jquery which i dont work with lmao
 */
$(document).ready(function() {
    var handleDrag = function(e) {
        e.stopPropagation();
        e.preventDefault();
    };
    var handleDrop = function(e) {
        //kill any default behavior
        e.stopPropagation();
        e.preventDefault();
        //console.log(e);
        //get x and y coordinates of the dropped item
        x = e.clientX;
        y = e.clientY;
        //drops are treated as multiple files. Only dealing with single files right now, so assume its the first object you're interested in
        var file = e.dataTransfer.files[0];
        //don't try to mess with non-image files
        if (file.type.match('image.*')) {
            //then we have an image,

            //we have a file handle, need to read it with file reader!
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                //get the data uri
                var dataURI = theFile.target.result;
                //make a new image element with the dataURI as the source
                var img = document.createElement("image")
                img.contentEditable = false
                var image = document.createElement("img");
                image.src = dataURI;
                img.appendChild(image)

                //Insert the image at the carat

                // Try the standards-based way first. This works in FF
                if (document.caretPositionFromPoint) {
                    var pos = document.caretPositionFromPoint(x, y);
                    range = document.createRange();
                    range.setStart(pos.offsetNode, pos.offset);
                    range.collapse();
                    range.insertNode(img);
                    SavedStatus(false)
                }
                // Next, the WebKit way. This works in Chrome.
                else if (document.caretRangeFromPoint) {
                    range = document.caretRangeFromPoint(x, y);
                    range.insertNode(img);
                    SavedStatus(false)
                }
                else
                {
                    PushNotification("We couldn't find your cursor!", "You may be using an outdated or unsupported browser.")
                }


            });
            //this reads in the file, and the onload event triggers, which adds the image to the div at the carat
            reader.readAsDataURL(file);
        }
        if (file.type.match('audio.*')) {
            var reader = new FileReader();

            reader.onload = (function(theFile) {
                var dataURI = theFile.target.result;

                var img = document.createElement("audio");
                img.controls = true
                var audio = document.createElement("source");
                audio.src = dataURI;
                audio.type = file.type
                img.appendChild(audio)

                if (document.caretPositionFromPoint) {
                    var pos = document.caretPositionFromPoint(x, y);
                    range = document.createRange();
                    range.setStart(pos.offsetNode, pos.offset);
                    range.collapse();
                    range.insertNode(img);
                    SavedStatus(false)
                }
                else if (document.caretRangeFromPoint) {
                    range = document.caretRangeFromPoint(x, y);
                    range.insertNode(img);
                    SavedStatus(false)
                }
                else
                {
                    PushNotification("We couldn't find your cursor!", "You may be using an outdated or unsupported browser.")
                }
            });
            //this reads in the file, and the onload event triggers, which adds the image to the div at the carat
            reader.readAsDataURL(file);
        }
        else{
            console.log("not an image but a")
            console.log(file.type)
        }
    };

   
    notearea.addEventListener('dragover', handleDrag, false);
    notearea.addEventListener('drop', handleDrop, false);
});

//change this to context menu lol
notearea.addEventListener("click", function(e){
    if(e.target.tagName == "IMG"){
        var img = e.target
        var image = e.target.parentNode
        openimageEditor(img, image)
    }
})


// Remove this when you're smarter and have time
// to create your own undo redo stack
//
// Maybe command-pattern shits? Idk yet. (rewrite writenote)
function Undo(){
    document.execCommand('undo');
}
function Redo(){
    document.execCommand('redo');
}
function Cut(){
    document.execCommand('cut');
}
var wnclipboard = []
function Copy(){
    document.execCommand('copy');
    wnclipboard.push(getSeletedText()) //maybe check character size
}
function Paste(){
    document.execCommand('paste');
}
function SelectAll(){
  window.getSelection().selectAllChildren(notearea)
  notearea.focus()
}

notearea.addEventListener('click', function (e){
    if(e.detail === 3){
        e.preventDefault()
        SelectAll()
    }
})


function printwn(){
    var printWin = window.open('', 'PRINT', 'width=914,height=639,left=400,top=100,location="writenote"');

    printWin.document.write('<html><head><title>' + document.title  + '</title>');
    printWin.document.write('</head><body >');
    printWin.document.write(notearea.innerHTML);
    printWin.document.write('</body></html>');

    printWin.document.close();
    printWin.focus();

    printWin.print();
    printWin.close();

    return true;
}

document.addEventListener("keydown", function(e){
    if(e.ctrlKey && e.key == "p"){
        e.preventDefault()
        printwn()
    }
})

function getSeletedText(){
    try { // found it
        const range = window.getSelection().getRangeAt(0)
        if(range.startContainer.parentElement.parentElement===this.notearea || range.startContainer.parentElement===this.notearea || range.startContainer===this.notearea){
            return range.toString();
        }
        else{
            return ''
        }
    } catch (e) {
        return ''
    }
}

function getSelectionStyles(){
    return {
        "isBold" : isSelectionEl("b"),
        "isItalic" : isSelectionEl("i"),
        "isUnderlined" : isSelectionEl("u"),
        "isStrikeThrough" : isSelectionEl("strike")
    }
}

function isSelectionEl(el){
    var sel;
    if (window.getSelection){
        sel = window.getSelection(); 
    }
    else if (document.getSelection){
        sel = document.getSelection(); 
    }

    var raw_html = getSelectionAsHtml();

    if(raw_html==="") return false;

    var tempDiv = document.createElement('div')
    tempDiv.innerHTML = raw_html

    var el_nodes = []
    for (var node of tempDiv.childNodes){
        var tags = [node.nodeName.toLowerCase()]
        if(tags.includes("#text")){
        for (let i = 0; i < 4; i++){
                var tagName = getParentNode(sel.anchorNode, i+1).nodeName.toLowerCase()
                el_nodes.push(tagName)
            }
        }
    }

    if(el_nodes.includes(el)){
        return (true)
    }
    return false
}

function getSelectionAsHtml() {
    var html = "";
    if(typeof window.getSelection != "undefined"){
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i){
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    }else if (typeof document.selection != "undefined"){
        if (document.selection.type == "Text"){
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}

function replaceSelection(range, replacementText) {
    range.deleteContents();
    range.insertNode(document.createTextNode(replacementText))
}


function getTextFromImage(base64){
    socket.emit("img2text", base64)
    socket.on('img2text', (data) => {
        var show = showContext()
        contextMenu.innerHTML = data
        console.log(data)
        show()
    })
}