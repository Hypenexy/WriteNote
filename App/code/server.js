const WriteNoteServer = "http://localhost:2053";
var online = false;

var loadStartDate = Date.now();
var connectQuery = {
    version: version,
    loadStartDate: loadStartDate,
}

socket = io(WriteNoteServer, {
    withCredentials: true,
    query: connectQuery
});

socket.on("connect", () => { // Can't pass data here!
    online = true;
    if(loadStartDate){
        var loadedTime = Date.now() - loadStartDate;
        console.log(loadedTime, "ms");
        loadStartDate = false;
    }
});

function removeRetries(){
    // Removes menu for retrying connection if present
    var retriedConnections = app.querySelectorAll(".retryConnection");
    // for (let i = 0; i < retriedConnections.length; i++) {
    //     retriedConnections[i].remove();
    // }
    retriedConnections.forEach(element => {
        element.remove();
    });
}

var logonData;
socket.on("logon", (data) => {
    removeRetries();
    logo_loadedConnection(); // fix this animation flows
    writenote.loadAnimation();
    if(openedWindows["welcome"]){
        openedWindows["welcome"].close();
    }
    
    logonData = data;
    if(data == -1){
        showWelcome(data);
    }
    else{
        // openSettings();
        showWelcome(data);
        // openChat() //temp design
    }

})

var failedAttempts = 0;
socket.on("connect_error", () => {
    failedAttempts++;
    if(failedAttempts == 3){
        logo_failedConnection();
    }
    if(failedAttempts > 5){
        socket.disconnect();
        logo_errorAttempts();
        showRetryConnection();
    }
});

socket.on("disconnect", () => {
    online = false;
    delete connectQuery.loadStartDate;
    connectQuery.disconnectDate = Date.now();
});