function noteareaContextMenu(e, mobile){
    e.preventDefault()
    var show = showContext()

    if(mobile==true){
        contextMenu.classList.add("mobile")
    }
    else{
        contextMenu.style.minWidth = "200px"
        contextMenu.style.top = e.clientY + "px"
        contextMenu.style.left = e.clientX + "px"
    }
    contextMenu.style.userSelect = "none"

    var selectedText
    var range
    try {
        range = window.getSelection().getRangeAt(0)
        selectedText = range.toString();
    } catch (e) {
        selectedText = ''
    }
    var length = selectedText.length
    var charsCount = document.createElement("pr")
    charsCount.classList.add("heading")
    charsCount.innerText = length+' characters selected'
    charsCount.style.userSelect = "none"
    contextMenu.appendChild(charsCount)

    var richBtns = document.createElement("horizontalbtns")
    richBtnsArr = ["format_bold", "format_italic", "format_underline", "format_strikethrough"]
    var selStyles = getSelectionStyles()
    var richBtnsBtnsArr = []
    for (let i = 0; i < richBtnsArr.length; i++) {
        const icon = richBtnsArr[i]
        var element = document.createElement("i")
        element.classList.add("m-i")
        element.innerText = icon
        richBtns.appendChild(element)
        richBtnsBtnsArr.push(element)
    }
    for (let i = 0; i < richBtnsBtnsArr.length; i++) {
        const element = richBtnsBtnsArr[i]
        if(i==0 && selStyles.isBold==true){
            element.classList.add("active")
        }
        if(i==1 && selStyles.isItalic==true){
            element.classList.add("active")
        }
        if(i==2 && selStyles.isUnderlined==true){
            element.classList.add("active")
        }
        if(i==3 && selStyles.isStrikeThrough==true){
            element.classList.add("active")
        }
        function toggleStyle(type){
            document.execCommand(type)
            if(element.classList.contains("active")){
                element.classList.remove("active")
            }
            else{
                element.classList.add("active")
            }
        }
        if(i==0){
            ButtonEvent(element, toggleStyle, "bold")
        }
        if(i==1){
            ButtonEvent(element, toggleStyle, "italic")
        }
        if(i==2){
            ButtonEvent(element, toggleStyle, "underline")
        }
        if(i==3){
            ButtonEvent(element, toggleStyle, "strikethrough")
        }
    }
    contextMenu.appendChild(richBtns)

    function speakSelection(){
        Narrator(selectedText)
    }

    function addToMenu(name, icon, action, isDisabled, isDropdown){
        if(name=="hr"){
            var element = document.createElement("hr")
            contextMenu.appendChild(element)
            return
        }
        var element = document.createElement("p")
        element.innerHTML="<i class='m-i'>"+icon+"</i> "+name
        if(isDisabled==true){
            element.classList.add("disabled")
        }
        else{
            if(isDropdown!=true){
                ButtonEvent(element, function(){
                    hideContext()
                    action()
                })
            }
            else{
                ButtonEvent(element, function(){
                    setTimeout(() => {
                        action()
                    }, 5);
                })
            }
        }
        contextMenu.appendChild(element)
    }

    if(e.target.tagName === 'IMG'){

        addToMenu("Open image in editor", "tune", function(){
            var img = e.target
            var image = e.target.parentNode
            openimageEditor(img, image)
        })
        addToMenu("Save image", "add_photo_alternate", function(){downloadBase64File(e.target.src, "Image")})
        addToMenu("Extract text", "text_fields", function(){getTextFromImage(e.target.src)})
        // addToMenu("Copy image", "image", function(){copyBase64(e.target.src)})
        addToMenu("hr")
    }

    addToMenu("Undo", "undo", Undo)
    addToMenu("Redo", "redo", Redo)
    addToMenu("hr")
    if(length==0){
        addToMenu("Cut", "cut", null, true)
        addToMenu("Copy", "copy", null, true)
    }
    else{
        addToMenu("Cut", "cut", Cut)
        addToMenu("Copy", "copy", Copy)
    }
    addToMenu("Paste", "paste", Paste)
    addToMenu("Clipboard history", "assignment", showClipboard, null, true)
    addToMenu("Select All", "select_all", SelectAll)
    addToMenu("hr")
    if(length==0){
        addToMenu("Search on Ixeo", "search", null, true)
        addToMenu("Find in note", "search", null, true)
        addToMenu("Speak selection", "record_voice_over", null, true)
        addToMenu("Convert selection", "pin", null, true)
    }
    else{
        if(isNumeric(selectedText)){
            addToMenu("Convert selection", "pin", function(){numeralConvert(range, e)}, null, true)
        }
        else{
            addToMenu("Convert selection", "pin", null, true)
        }
        addToMenu("Search on Ixeo", "search", null)
        addToMenu("Find in note", "search", null)
        addToMenu("Speak selection", "record_voice_over", speakSelection)
    }
    addToMenu("hr")
    addToMenu("Share", "share", function(){})
    // "<de>Properties</de>"+
    // "<pr><i class='m-i'>calendar_month</i> 2 minutes ago</pr>"+
    // "<pr><i class='m-i'>save</i> 210 B</pr>"

    show()
}

notearea.addEventListener("contextmenu", noteareaContextMenu)
document.addEventListener("selectionchange", function(e){
    if(mobile){
        if(contextMenu && contextMenu.nodeType){
            hideContext()
        }
        if(getSeletedText().length!=0){
            noteareaContextMenu(e, true)
        }
    }
})
document.addEventListener("input", function(e){
    if(mobile){
        if(contextMenu && contextMenu.nodeType){
            hideContext()
        }
    }
})