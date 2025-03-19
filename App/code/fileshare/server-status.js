function serverStatusElement(){
    const element = document.createElement("div");
    
    const serverConnection = document.createElement("div");
    element.appendChild(serverConnection);
    if(socket.connected){
        serverConnection.classList.add("online");
        serverConnection.innerHTML = locale.server_connection_online;
    }
    else{
        serverConnection.innerHTML = locale.server_connection_offline;
    }

    socket.on("disconnect", () => {
        serverConnection.classList.add("offline");
        serverConnection.innerHTML = locale.server_connection_offline;
    });
    socket.on("connect", () => {
        serverConnection.classList.add("online");
        serverConnection.innerHTML = locale.server_connection_online;
    });
    
    return element;
}