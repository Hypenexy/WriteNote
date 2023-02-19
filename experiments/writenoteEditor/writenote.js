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
        this.writenote = document.createElement("writenote")
        this.features = document.createElement("features")
        this.zoom = 1
        this.workspace = workspace
        this.linkEngine = linkEngine
        this.parent
    }

    init(parent){
        this.parent = parent
        var notearea = this.notearea
        var writenote = this.writenote
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
             // console.log(e.inputType) this could be used elsewhere too! also undo feature is all fixed!
            if(notearea.innerHTML.substring(0, 3)!="<p>" && e.inputType!="historyUndo"){
                document.execCommand('formatBlock', false, "p")
            }
        })

        var getSelectedNode = this.getSelectedNode
        var setCaretAfterElement = this.setCaretAfterElement
        notearea.addEventListener('keydown', function (e){
            var focusedElement = getSelectedNode()
            if(notearea.innerHTML == "<p><br></p>" && e.key == "Backspace"){
                e.preventDefault()
            }
            if(e.key == ' '){
                if(focusedElement.nodeName=='A'){
                    e.preventDefault()
                    // setCaretAfterElement(focusedElement) // I cannot fix the escaping of the element!
                    // document.execCommand("insertHTML", false, "&nbsp;")
                    let selection = window.getSelection()
                    selection.collapse(focusedElement.parentNode, focusedElement.parentNode.childNodes.length)
                    // with this method the cadet goes at the end of the element
                    // need to block the deletion of text after the link

                    // if (e.code === 'Enter' && selectionTag === 'SUP') {
                    //     e.preventDefault()
                    //     // Insert a 'space' symbol at the end
                    //     selection.anchorNode.parentNode.insertAdjacentHTML('beforeend', '&nbsp;')
                    //     // Select the parent node
                    //     selection.selectAllChildren(selection.anchorNode.parentNode)
                    //     // Collapse selection to the end, effectively moving the cursor out of the formatted element
                    //     selection.collapseToEnd()
                    //   } Test this out!
                }
            }
            if(e.key == "Enter"){
                if(focusedElement.nodeName=='A'){
                    e.preventDefault()
                }
            }
        })

        writenote.appendChild(notearea)
        parent.appendChild(writenote)
    }

    setCaretAfterElement(element){
        if(window.getSelection){
            var range, selection   
            range = document.createRange()
            range.setStartAfter(element)
            selection = window.getSelection()
            selection.removeAllRanges()
            selection.addRange(range)
        }
    }

    setCaretAtEndOfElement(element){
        var range, selection
        if(document.createRange){
            range = document.createRange()
            range.selectNodeContents(element)
            range.collapse(false)
            selection = window.getSelection()
            selection.removeAllRanges()
            selection.addRange(range)
        }
        else if(document.selection){
            range = document.body.createTextRange()
            range.moveToElementText(element)
            range.collapse(false)
            range.select()
        }
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

    getSelectedNode(){
        if(document.selection){
            return document.selection.createRange().parentElement();
        }
        else{
            var selection = window.getSelection()
            if(selection.rangeCount > 0){
                return selection.getRangeAt(0).startContainer.parentNode;
            }
        }
    }

    processLink(linkEngine, url, requestWholePage){ // Learn to handle errors, rejection ;(
        return new Promise(function(resolve, reject){
            var xhttp = new XMLHttpRequest()

            xhttp.open("POST", linkEngine, true)
            xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
            var body = 'url='+url
            if(requestWholePage==true){
                body +="&wholePage=true" // debug this
            }
            xhttp.send(body)

            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    resolve(this.responseText)
                }
            }
        });
    }

    getAverageRGB(element){
        var blockSize = 1, // was 5
            defaultRGB = {r:0,g:0,b:0},
            canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height,
            i = -4,
            length,
            rgb = {r:0,g:0,b:0},
            count = 0;
    
        if (!context){
            return defaultRGB;
        }

        height = canvas.height = element.naturalHeight || element.offsetHeight || element.height
        width = canvas.width = element.naturalWidth || element.offsetWidth || element.width

        context.drawImage(element, 0, 0)

        try{
            data = context.getImageData(0, 0, width, height)
        } catch(e){
            return defaultRGB;
        }

        length = data.data.length;

        while ( (i += blockSize * 4) < length ) {
            ++count;
            rgb.r += data.data[i]
            rgb.g += data.data[i+1]
            rgb.b += data.data[i+2]
        }

        rgb.r = ~~(rgb.r/count)
        rgb.g = ~~(rgb.g/count)
        rgb.b = ~~(rgb.b/count)

        return rgb;
    }

    setFeatures(isSet, features, writenote){ // reread this https://stackoverflow.com/questions/28767221/flexbox-resizing
        if(!features){                       // and implement it lol :p
            features = this.features
        }
        if(!writenote){
            writenote = this.writenote
        }
        if(!writenote.contains(features)){
            if(isSet==true){
                writenote.appendChild(features)
            }
        }
        else{
            if(isSet==false){
                features.remove()
            }
        }
        return features;
    }

    insertLink(url){ // if a link is inserted outside this function, either paste or detection, the event handler will not be handlin'
        var parent = this.parent
        var writenote = this.writenote
        var features = this.features
        var setFeatures = this.setFeatures
        var linkEngine = this.linkEngine
        var processLink = this.processLink
        var getAverageRGB = this.getAverageRGB
        var existingLinks = this.notearea.getElementsByTagName("a")
        var id = existingLinks.length
        document.execCommand("insertHTML", false, "<a n="+id+">"+url+"</a>&nbsp;")
        var existingLinksAfterUpdate = this.notearea.getElementsByTagName("a")
        for (let i = 0; i < existingLinksAfterUpdate.length; i++) {
            const element = existingLinksAfterUpdate[i]
            if(element.getAttribute('n')==id){
                var linkPreviewElement = document.createElement("div")
                function remove(){
                    linkPreviewElement.classList.add("transition")
                    setTimeout(() => {
                        linkPreviewElement.remove()
                    }, 400)
                }
                element.addEventListener("mouseenter", function(){
                    processLink(linkEngine, url).then(function(data){
                        var data = JSON.parse(data)
                        var html = "<div class='header'><p>"+url+"</p><div><i class='m-i'>edit</i><i class='m-i'>refresh</i></div></div><div class='metadata'>"
                        if(data.image){
                            html += "<div class='image'><img src='data:image/png;base64,"+data.image+"'></div>"
                        }
                        html += "<div><a>"+data.title+"</a><p>"+data.description+"</p></div></div><div class='buttons'><button>Open in WriteNote</button><button>Open in a new tab</button></div>"
                        linkPreviewElement.innerHTML = html
                        var buttons = linkPreviewElement.getElementsByTagName("button");
                        if(data.image){
                            setTimeout(() => {
                                var accentColor = getAverageRGB(linkPreviewElement.getElementsByTagName("img")[0])
                                linkPreviewElement.getElementsByTagName("button")[0].style.background = `rgb(${accentColor.r},${accentColor.g},${accentColor.b})` // I was going to find a contrast friendly color for the text but seems like every site's logo colors are fine for now.
                                // please animate when you press this button,
                                // match the other element to this' size and position
                                // opacity 0 on this element
                                // then move to the preffered location and boom
                                ButtonEvent(buttons[0], function(){
                                    var element = document.createElement("div")
                                    linkPreviewElement.classList.add("opacity")
                                    element.classList.add("sitepreview")
                                    var dimensions = linkPreviewElement.getBoundingClientRect()
                                    element.style.top = dimensions.top + "px"
                                    element.style.left = dimensions.left + "px"
                                    element.style.width = dimensions.width + "px"
                                    element.style.height = dimensions.height + "px"
                                    app.appendChild(element)
                                    setTimeout(() => {
                                        var top = "8px"
                                        var left = window.innerWidth - dimensions.width + "px"
                                        element.style.top = top
                                        element.style.left = left
                                        linkPreviewElement.style.top = top
                                        linkPreviewElement.style.left = window.innerWidth - dimensions.width + "px"
                                        if(!writenote.classList.contains("flex")){
                                            writenote.classList.add("flex")
                                        }
                                        
                                        setTimeout(() => {
                                            remove()
                                            linkPreviewElement.classList.remove("opacity")
                                            linkPreviewElement.style = ""
                                            element.classList.add("relative")
                                            element.style = ""
                                            features = setFeatures(true, features, writenote)
                                            features.prepend(element)
                                        }, 400)
                                    }, 10)
                                })
                            }, 10)
                        }
                        function openInNew(){
                            window.open(url, '_blank');
                        }
                        ButtonEvent(buttons[1], openInNew)
                        buttons[1].addEventListener("auxclick", openInNew)
                    }).catch(function(err){
                        console.log(err)
                    })
                    linkPreviewElement.classList.add("linkPreview")
                    linkPreviewElement.classList.add("transition")
                    // I need to add a tooltip for the buttons!
                    // Maybe make it in a function at MDUtilities or MDUI
                    parent.appendChild(linkPreviewElement)
                    setTimeout(() => {
                        linkPreviewElement.classList.remove("transition")
                    }, 10)
                })
                // element.addEventListener("mouseleave", function(){
                //     remove()
                // })
            }
        }
    }
}