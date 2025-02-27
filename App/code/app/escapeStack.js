const escapeStack = [];

function ESC_Close(event){
    if(event.code == "Escape"){
        if(escapeStack.length == 0){
            return;
        }
        const element = escapeStack.pop();
        if(!element[0].parentNode){
            ESC_Close(event);
            return;
        }
        element[1]();
    }
}
document.addEventListener("keydown", ESC_Close);