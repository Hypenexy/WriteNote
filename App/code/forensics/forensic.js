function logForensic(type, data){
    socket.emit("forensic", {type: type, data: data});
}

document.addEventListener("visibilitychange", function(){
    if(document.visibilityState === "visible"){
        logForensic("app_visibility", true);
    }
    else{
        logForensic("app_visibility", false);
    }
});