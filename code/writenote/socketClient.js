function initSocket(){
    var socket = io(serverAddress.slice(0, -1)+":2053")
    
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