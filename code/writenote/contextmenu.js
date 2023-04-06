notearea.addEventListener("contextmenu", function(e){
    e.preventDefault()
    var show = showContext()

    contextMenu.style.minWidth = "200px"
    contextMenu.style.top = e.clientY + "px"
    contextMenu.style.left = e.clientX + "px"

    var selectedText
    try {
        const range = window.getSelection().getRangeAt(0)
        selectedText = range.toString();
    } catch (e) {
        selectedText = ''
    }
    var length = selectedText.length
    var charsCount = document.createElement("pr")
    charsCount.classList.add("heading")
    charsCount.innerText = length+' characters selected'
    contextMenu.appendChild(charsCount)

    var richBtns = document.createElement("horizontalbtns")
    richBtnsArr = ["format_bold", "format_italic", "format_underline", "format_strikethrough"]
    for (let i = 0; i < richBtnsArr.length; i++) {
        const icon = richBtnsArr[i];
        var element = document.createElement("i")
        element.classList.add("m-i")
        element.innerText = icon
        richBtns.appendChild(element)
        ButtonEvent(element, function(){
            if(icon[7]=='b'){
                console.log("create bold text")
            }
            if(icon[7]=='i'){

            }
            if(icon[7]=='u'){

            }
            if(icon[7]=='s'){

            }
        })
    }
    contextMenu.appendChild(richBtns)

    function speakSelection(){
        if('speechSynthesis' in window) {}
        else{
            PushNotification("Sorry, your browser doesn't support text to speech!", "You can't use the narrator in this browser or device.", "warn");
        }
        var msg = new SpeechSynthesisUtterance();
        msg.text = selectedText;
        window.speechSynthesis.speak(msg);
        //https://github.com/mdn/dom-examples/tree/main/web-speech-api/speak-easy-synthesis
        // read this
        // var msg = new SpeechSynthesisUtterance();
        // var voices = window.speechSynthesis.getVoices();
        // msg.voice = voices[7]; // Choose a voice
        // msg.volume = 1; // From 0 to 1
        // msg.rate = 1; // From 0.1 to 10
        // msg.pitch = 2; // From 0 to 2
        // msg.text = "Dónde está el baño";
        // msg.lang = 'es';
        // speechSynthesis.speak(msg);
        // speechSynthesis.getVoices().forEach(function(voice) {
        //     console.log(voice.name, voice.default ? voice.default :'');
        // });
    }

    function addToMenu(name, icon, action, isDisabled){
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
            ButtonEvent(element, action)
        }
        contextMenu.appendChild(element)
    }

    if(e.target.tagName === 'IMG'){
        addToMenu("Open image in editor", "tune", function(){})
        addToMenu("Save image at", "add_photo_alternate", function(){})
        addToMenu("Copy image", "image", function(){})
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
        addToMenu("Cut", "cut", function(){})
        addToMenu("Copy", "copy", function(){})
    }
    addToMenu("Paste", "paste", function(){})
    addToMenu("Select All", "select_all", SelectAll)
    addToMenu("hr")
    addToMenu("Speak selection", "record_voice_over", speakSelection)
    addToMenu("hr")
    addToMenu("Share", "share", function(){})
    // "<de>Properties</de>"+
    // "<pr><i class='m-i'>calendar_month</i> 2 minutes ago</pr>"+
    // "<pr><i class='m-i'>save</i> 210 B</pr>"

    show()
})
