function detectTouch(){
    app.classList.add("touchscreen");

    document.addEventListener("mousemove", detectMouse);
    document.removeEventListener("touchmove", detectTouch);
}

function detectMouse(e){
    if(e.sourceCapabilities.firesTouchEvents){
        return;
    }
    app.classList.remove("touchscreen");

    document.removeEventListener("mousemove", detectMouse);
    document.addEventListener("touchmove", detectTouch);
}

document.addEventListener("touchmove", detectTouch);
document.addEventListener("mousemove", detectMouse);