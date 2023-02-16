class WriteNote{
    constructor(workspace){
        //somewhere i have to check for support
        this.notearea = document.createElement("notearea")
        this.zoom = 1
        this.workspace = workspace
    }

    init(parent){
        var notearea = this.notearea
        notearea.contentEditable = true
        document.execCommand("defaultParagraphSeparator", false, "p")
        notearea.innerHTML = "<p><br></p>"

        notearea.addEventListener('focus', function () {
            if(notearea.innerHTML.substring(0, 3)!="<p>"){
                setTimeout(() => {
                    document.execCommand('formatBlock', false, "p")
                }, 20);
            }
        })

        notearea.addEventListener('input', function () { // with this method undo becomes unavaliable when everything is cut!
            if(notearea.innerHTML.substring(0, 3)!="<p>"){
                document.execCommand('formatBlock', false, "p")
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
}