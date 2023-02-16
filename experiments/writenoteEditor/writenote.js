/** 
 * WriteNote by Hypenexy, Midelight
 * Todo - Check the following 
 * https://stackoverflow.com/questions/60581285/execcommand-is-now-obsolete-whats-the-alternative
 * https://stackoverflow.com/questions/66059594/how-to-create-a-richtext-editor-in-html-js-without-document-execcommand
 * 
 */
class WriteNote{
    constructor(workspace, linkEngine){
        //somewhere i have to check for support
        this.notearea = document.createElement("notearea")
        this.zoom = 1
        this.workspace = workspace
        this.linkEngine = linkEngine
        this.parent
    }

    init(parent){
        this.parent = parent
        var notearea = this.notearea
        notearea.contentEditable = true // maybe make a change where each p element is contenteditable and all of them have ids
        document.execCommand("defaultParagraphSeparator", false, "p")
        notearea.innerHTML = "<p><br></p>"

        notearea.addEventListener('focus', function () {
            if(notearea.innerHTML.substring(0, 3)!="<p>"){
                setTimeout(() => { // is this needed
                    document.execCommand('formatBlock', false, "p")
                }, 20)
            }
        })

        notearea.addEventListener('input', function (e) {
            console.log(e.inputType) // this could be used elsewhere too! also undo feature is all fixed!
            if(notearea.innerHTML.substring(0, 3)!="<p>" && e.inputType!="historyUndo"){
                document.execCommand('formatBlock', false, "p")
            }
        })

        notearea.addEventListener('keydown', function (e){
            if(notearea.innerHTML == "<p><br></p>" && e.key == "Backspace"){
                e.preventDefault()
            }
            if(e.key == ' '){
                console.log(e.target)
            }
        })

        parent.appendChild(this.notearea)
    }

    changeZoom(value){
        if(CSS.supports("zoom", value)){
            this.notearea.style.zoom = value
        }
        else{
            if(CSS.supports("-moz-transform", `scale(${value})`)){// firefox doesn't support it and no fix i can think of
                this.notearea.style.transform = `scale(${value})`
                this.notearea.style.transformOrigin = '0 0'
            }
        }
    }

    processLink(linkEngine, url){
        var xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                return this.responseText;
            }
        }
     
        xhttp.open("POST", linkEngine, true)
        xhttp.send(url) // debug ofc
    }

    insertLink(url){ // if a link is inserted outside this function, either paste or detection, the event handler will not be handlin'
        var parent = this.parent
        var existingLinks = this.notearea.getElementsByTagName("a")
        var id = existingLinks.length
        document.execCommand("insertHTML", false, "<a n="+id+">"+url+"</a>&nbsp;")
        var existingLinksAfterUpdate = this.notearea.getElementsByTagName("a")
        for (let i = 0; i < existingLinksAfterUpdate.length; i++) {
            const element = existingLinksAfterUpdate[i]
            if(element.getAttribute('n')==id){
                var linkPreviewElement = document.createElement("div")
                element.addEventListener("mouseenter", function(){
                    linkPreviewElement.classList.add("linkPreview")
                    linkPreviewElement.innerHTML = "<p>"+url+"</p>"
                    parent.appendChild(linkPreviewElement)
                })
            }
        }
    }
}