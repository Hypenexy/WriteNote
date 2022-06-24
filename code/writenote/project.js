var activefile = {}
var workspace = "note"
var saved = true

var currentSize
var maxSize
var isNewFile = false
var savedNoteContent = ""

function setSizes(space){
    switch (space) {
        case "localstorage":
            maxSize = 4000000
            currentSize = new Blob(Object.values(localStorage)).size
            break;
        case "device":
            
            break;
        case "online":
            
            break;
        default:
            //error
            break;
    }
}

function InitFile(path, name, space, content, metadata){

    function execute(){
        setSizes(space)

        if(metadata){
            activefile.fD = metadata.fD
            activefile.fM = metadata.fM
        }


        activefile.path = path
        
        activefile.fO = Date.now()

        // var notename = document.getElementById("notename")
        // notename.value = name
        activefile.name = name
        activefile.space = space
        if(workspace="note"){
            notearea.innerHTML = noteParse(content)
        }

        setMobileStatusFile(name, space)
    }

    SaveChangesQuestion(execute)

}

function CheckExisting(){
    var existingPaths = []
    //localstorage
    for (var i = 0; i < localStorage.length; i++){
        if(localStorage.key(i)[0] == '*'){
            existingPaths.push("localstorage:" + localStorage.key(i))
        }
    }
    return existingPaths
}

function CreateFile(path, name, space){
    isNewFile = true
    var existing = CheckExisting() //Maybe I should store metadata in a separate place? Cause i don't wanna load every file!

    if(existing.includes("localstorage:*" + path + "*" + name)){
        if(name=="Untitled"){
            var n = 1
            while(existing.includes("localstorage:*" + path + "*" + name)){
                n++
                name = "Untitled-" + n
            }
        }
        else{
            //error name taken
        }
    }

    InitFile(path, name, space, "")
    activefile.fD = Date.now()
}


CreateFile("", "Untitled", "localstorage", "")

function NewFile(path, name, space){
    CreateFile(path, name, space, "")
}

function SaveFile(updateOpen){
    activefile.content = noteCompress()
    var DataToSave = {}
    DataToSave.content = activefile.content
    DataToSave.fD = activefile.fD
    DataToSave.fO = activefile.fO
    DataToSave.fM = Date.now()
    var roughSize = roughSizeOfObject(DataToSave)
    setSizes(activefile.space)
    switch(activefile.space){
        case "online":
            var data = {version : settings.version}
            $.ajax({
                url: server + "/app/errorlog.php",
                type: "post",
                data: data,
                success: function (response) {
                    response = JSON.parse(response)
                    if(response.status==200){
                        
                    }
                },
                error: function() {
                    pushNotification("Could not connect to server.", "Check your connection between the server!", "warn")
                }
            })
            break;
        case "localstorage":
            if(updateOpen){
                DataToSave.fM = activefile.fM
            }
            if(roughSize + currentSize > maxSize){
                //send error
                console.log("send error")
                return;
            }

            localStorage.setItem("*" + activefile.path + "*" + activefile.name, JSON.stringify(DataToSave))
            SavedStatus(true)
            break;
        case "device":
            // file = OpenFileDialog()
            break;
        default:
            PushError("Saving file failed, unexpected app input!")
            break;
    }
    setSizes(activefile.space)
    isNewFile = false
    savedNoteContent = notearea.innerHTML
}

function LoadFile(space, path, name){
    var file
    switch(space){
        case "online":
            var data = {version : settings.version}
            $.ajax({
                url: server + "/app/errorlog.php",
                type: "post",
                data: data,
                success: function (response) {
                    response = JSON.parse(response)
                    if(response.status==200){
                        
                    }
                },
                error: function() {
                    pushNotification("Could not connect to server.", "Check your connection between the server!", "warn")
                }
            })
            break;
        case "localstorage":
            file = localStorage.getItem("*" + path + "*" + name)
            break;
        case "device":
            file = OpenFileDialog()
            break;
        default:
            PushError("Loading file failed, unexpected app input!")
            break;
    }
    file = JSON.parse(file)
    file.space = space
    file.path = path
    file.name = name
    InitFile(file.path, file.name, file.space, file.content, file)
    SavedStatus(true)
    if(notearea.innerHTML!=noteParse(file.content)){
        //File was loaded incorrectly!
        return;
    }
    SaveFile(true)
}



//Fix status when undoing to a saved state!
function SavedStatus(status){
    if(status==true){
        saved = true
        document.title = activefile.name + " - WriteNote"
        setMobileStatusFile(activefile.name, activefile.space)
    }
    if(status==false){
        saved = false
        document.title = activefile.name + " • WriteNote"
        setMobileStatusFile(activefile.name + "*", activefile.space)
    }
}



document.addEventListener("keydown", function(e){
    if (e.repeat) { return }

    if(e.ctrlKey && e.key.toLowerCase() == "s"){
        e.preventDefault()
        SaveFile()
    }
    if(e.ctrlKey && e.key.toLowerCase() == "l"){
        //e.preventDefault()
        //LoadFile()
    }
})

// notearea.addEventListener("copy", function){
//     isNewFile
// }

notearea.addEventListener("input", function(){
    if(notearea.innerHTML=="<p><br></p>"&&isNewFile==true){
        SavedStatus(true)
    }
    else{
        SavedStatus(false)
    }
    if(savedNoteContent==notearea.innerHTML){
        SavedStatus(true)
    }
})
window.onbeforeunload = function(e) {
    if(saved==false){
        SaveChangesQuestion(function(){
            saved = true
            close()//Idk if I need a timeout just in case.
            //There's no (easy) way to detect refresh

            //add a modal that allows u to close or refresh the tab! like windows xp shutdown menu
        })
        return "";
    }
}

var savechanges
function SaveChangesQuestion(nextStep){
    if(saved==true){
        nextStep()
    }
    else{
        function close(){
            savechanges.classList.remove("newfiletransitioned")
            setTimeout(() => {
                savechanges.remove()
            }, 200);
        }
        savechanges = document.createElement("div")
        savechanges.innerHTML += "<x class='m-i'>close</x>"+
        '<ti>You have unsaved changes to '+activefile.name+'!</ti>'+
        "<co>Do you want to save them?</co>"+
        "<div style='text-align:center;margin-top:20px'><button>Save</button><button>Don't save</button><button>Cancel</button></div>"
    
        ButtonEvent(savechanges.getElementsByTagName('x')[0], close)
    
        var buttons = savechanges.getElementsByTagName("button")
    
        ButtonEvent(buttons[0], function(){
            SaveFile()
            close()
            nextStep()
        })
        ButtonEvent(buttons[1], function(){
            close()
            nextStep()
        })
        ButtonEvent(buttons[2], function(){
            close()
        })
    
        savechanges.classList.add("newfile", "savechanges")
        app.appendChild(savechanges)
        setTimeout(() => {
            savechanges.classList.add("newfiletransitioned")
        }, 0);
    }
}

var newfile
function NewFileGui(close){
    if(close==true){
        newfile.classList.remove("newfiletransitioned")
        setTimeout(() => {
            newfile.remove()
        }, 200);
        return;
    }
    function execute(){
        var isNameSet = false
        var isOptionSelected = false
        var doesMatch = false
        function isChecks(name, option, matches){
            if(name){
                isNameSet = name
            }
            if(option){
                isOptionSelected = option
            }
            if(matches){
                doesMatch = matches
            }
            if(isNameSet==true&&isOptionSelected==true&&doesMatch==false){
                completebtn.classList.add("completebtnallowed")
            }
            else{
                completebtn.classList.remove("completebtnallowed")
            }
        }

        newfile = document.createElement("div")
        newfile.innerHTML += "<x class='m-i'>close</x>"+
        "<ti>Create a new project</ti>" +
        "<p>Name</p><input>"+
        //"add folers"+
        "<p>Storage</p>"

        var closebtn = newfile.getElementsByTagName("x")[0]
        ButtonEvent(closebtn, NewFileGui, true)

        var newfilename = newfile.getElementsByTagName("input")[0]
        newfilename.addEventListener("input", function(){
            if(newfilename.value!=""){
                isChecks(true)
            }
            else{
                isChecks(false)
            }
        })

        var buttonsDiv = document.createElement("buttons")
        buttonsDiv.innerHTML = "<button><i class='m-i'>cloud</i> Cloud</button>"+
        "<button><i class='m-i'>web</i> App</button>"+
        "<button><i class='m-i'>desktop_windows</i> Device</button>"

        var buttons = buttonsDiv.getElementsByTagName("button")
        var buttonoptions = ['online', 'localstorage', 'device']
        var buttonselected
        for (let i = 0; i < buttons.length; i++) {
            const element = buttons[i];
            ButtonEvent(element, function(){
                isChecks(undefined, true)
                buttonselected = i
                for (let i = 0; i < buttons.length; i++) {
                    const element = buttons[i];
                    element.classList.remove("buttonSelected")
                }
                element.classList.add("buttonSelected")
            })
        }

        newfile.appendChild(buttonsDiv)


        var selectedPath = ""

        var folderselect = document.createElement("div")
        folderselect.classList.add("folderselect")
        folderselect.innerHTML = "<p>Folder</p>"

        var existing = CheckExisting()
        existing.unshift("localStorage:*Home*")

        for(let i = 0; i < existing.length; i++){
            var parts = existing[i].split(":")
            var space = parts[0]
            var pathname = parts[1]
            pathname = pathname.split("*").slice(1).join('*')
            var path = pathname.split("*")[0]
            var name = pathname.split("*").slice(1).join('*')

            function createButton(){
                var folder = document.createElement("button")
                folder.innerText = path
                ButtonEvent(folder, function(){
                    folder.classList.add("folderselected")
                })
                return folder
            }
            if(path!=""){
                folderselect.appendChild(createButton())
            }
        }

        newfile.appendChild(folderselect)








        var completebtn = document.createElement("button")
        completebtn.innerText = "Create"
        completebtn.classList.add("completebtn")
        ButtonEvent(completebtn, function(){
            if(isNameSet == false || isOptionSelected == false){
                completebtn.classList.add("completebtnerror")
                setTimeout(() => {
                    completebtn.classList.remove("completebtnerror")
                }, 400);
            }
            else{
                NewFile("", newfilename.value, buttonoptions[buttonselected])
                newfile.classList.add("newfiletransitionout")
                setTimeout(() => {
                    newfile.remove()
                }, 300);
            }
        })
        newfile.appendChild(completebtn)

        newfile.classList.add("newfile")
        app.appendChild(newfile)
        setTimeout(() => {
            newfile.classList.add("newfiletransitioned")
        }, 0);
    }
    SaveChangesQuestion(execute)
}

var loadfile
function LoadFileGui(){

}


document.addEventListener("keydown", function(e){
    if(e.key == "Escape"){
        function closeNode(node){
            node.classList.remove("newfiletransitioned")
            setTimeout(() => {
                node.remove()
            }, 200);
            notearea.focus()
        }
        if(newfile && newfile.nodeType){
            closeNode(newfile)
        }
        if(savechanges && savechanges.nodeType){
            closeNode(savechanges)
        }
    }
})