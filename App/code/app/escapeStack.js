const escapeStack = [];

function ESC_Close(event){
    if(event.code == "Escape"){
        const element = escapeStack.pop();
        if(!element[0].parentNode){
            ESC_Close(event);
            return;
        }
        element[1]();
    }
}
document.addEventListener("keydown", ESC_Close);