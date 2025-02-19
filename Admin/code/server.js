const WriteNoteServer = "http://localhost:2053";
var online = false;

var loadStartDate = Date.now();
var connectQuery = {
    admin: true,
    loadStartDate: loadStartDate,
}

socket = io(WriteNoteServer, {
    withCredentials: true,
    query: connectQuery
});

socket.on("connect", () => {
    online = true;
    if(loadStartDate){
        var loadedTime = Date.now() - loadStartDate;
        console.log(loadedTime, "ms");
        loadStartDate = false;
    }
});

var logonData;
socket.on("logon", (data) => {
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