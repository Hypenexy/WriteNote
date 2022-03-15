var activefile = {}

function OpenFileDialog() {
    let input = document.createElement('input')
    input.type = 'file'
    input.onchange = function() {
        let files = Array.from(input.files)
        console.log(files)
        return files;
    }
    input.click()
}

function LoadFile(path, space){
    var file = {path:"",name:"",content:"",space:""}
    switch(space){
        case "online":
            $.ajax({
                url: server + "/app/errorlog.php",
                type: "post",
                data: "maybe include version so the api responds accordingly!?!!!!!!!!!!!!",
                success: function (response) {
                    response = JSON.parse(response)
                    if(response.status==200){
                        file = response.data
                    }
                },
                error: function() {
                    pushNotification("Could not connect to server.", "Check your connection between the server!", "warn")
                }
            })
            break;
        case "app":
            file = localStorage.getItem(path)
            break;
        case "device":
            file = OpenFileDialog()
            console.log(file)
            break;
        default:
            PushError("Loading file failed, unexpected app input!")
            break;
    }

    var confirm = modal.getElementsByTagName("confirm")[0]
    function ContinueLoad(){
        InitFile(file.path, file.name, file.content, file.space)
    }
    function close(){
        HideModal()
        confirm.style = ""
    }

    if(activefile.name){
        ShowModal(close)
        confirm.style = "visibility:visible;opacity:1;transform: translate(-50%, -50%);"
        confirm.innerHTML = '<span class="m-i x">close</span><ti>You haven\'t saved your opened file!</ti><buttons><button>Cancel</button><button>Don\'t save</button><button class="alt">Save & Continue</button></buttons>'
        confirm.getElementsByClassName("x")[0].onclick = function(){
            close()
        }
        var buttons = confirm.getElementsByTagName("button")
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].onclick = function(){
                close()
                if(i==1){
                    ContinueLoad()
                }
                if(i==2){
                    SaveFile()
                    ContinueLoad()
                }
            }
        }
    }
    else{
        ContinueLoad()
    }
}

function InitFile(path, name, content, space){
    var notename = document.getElementById("notename")
    activefile.path = path
    notename.value = name
    activefile.name = name
    activefile.space = space
    if(workspace="note"){
        notearea.innerHTML = content
    }
    console.log(workspace)
}

function SaveFile(){
    switch(activefile.space){
        case "online":
            $.ajax({
                url: server + "/app/errorlog.php",
                type: "post",
                data: "maybe include version so the api responds accordingly!?!!!!!!!!!!!!",
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
        case "app":
            file = localStorage.getItem(path)
            break;
        case "device":
            file = OpenFileDialog()
            break;
        default:
            PushError("Loading file failed, unexpected app input!")
            break;
    }
    pushNotification("file saved lol", "")
}

document.addEventListener("keydown", function(e){
    if(e.ctrlKey && e.key.toLowerCase() == "s"){
        e.preventDefault()
        SaveFile()
    }
    if(e.ctrlKey && e.key.toLowerCase() == "l"){
        //e.preventDefault()
        //LoadFile()
    }
})

function NewFile(){
    
}

//debug

//LoadFile("Hey", "online")
//LoadFile("Hey", "device")