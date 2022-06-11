var activefile = {}
var workspace = "note"
var saved = true

var currentSize
var maxSize

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
        notearea.innerHTML = content
    }

    setMobileStatusFile(name, space)
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
    var existing = CheckExisting()

    if(existing.includes("localstorage:*" + path + name)){
        if(name=="Untitled"){
            var n = 1
            while(existing.includes("localstorage:*" + path + name)){
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

            localStorage.setItem("*" + activefile.path + activefile.name, JSON.stringify(DataToSave))
            SavedStatus(true)
            break;
        case "device":
            // file = OpenFileDialog()
            break;
        default:
            PushError("Saving file failed, unexpected app input!")
            break;
    }
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
            file = localStorage.getItem("*" + path + name)
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

notearea.addEventListener("input", function(){
    SavedStatus(false)
})
window.onbeforeunload = function() {
    if(saved==false){
        return "";
    }
}


