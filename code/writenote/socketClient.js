function initSocket(){
    var socket = io(serverAddress.slice(0, -1)+":2053")

    socket.on("logon", (data) => {
        console.log(data)
    })
    socket.emit("logon", document.cookie)
    
    function sendData(){
        var data = notearea.innerHTML
        socket.emit("contentChange", data)
    }

    notearea.addEventListener("input", function(){
        sendData()
    })

    socket.on('contentChange', (data) => {
        notearea.innerHTML = data
    })
}