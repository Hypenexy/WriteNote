var focusedWindow;
var openedWindows = {};

function createWindow(id){
    if(Object.keys(openedWindows).includes(id)){
        return "already opened";
    }

    var window = document.createElement("div");

    var onCloseActions = [];

    function close(){
        delete openedWindows[id];
        window.classList.add("hide");
        window.addEventListener("animationend", () => {
            window.remove();
        });
        
        for (let i = 0; i < onCloseActions.length; i++) {
            onCloseActions[i]();
        }
    }
    
    escapeStack.push([window, close]);
    mdutils.onRemoveEvent(window, ()=>{
        escapeStack.splice(escapeStack.findIndex(item => item[0] === window), 1);
    });

    const closeButton = document.createElement("div");
    closeButton.classList.add("x");
    closeButton.textContent = "close";
    mdutils.ButtonEvent(closeButton, close);
    window.appendChild(closeButton);

    openedWindows[id] = {
        element: window,
        id: id,
        close: close,
        onCloseActions: onCloseActions
    };

    window.classList.add("window");
    window.classList.add(id);
    app.appendChild(window);

    focusedWindow = id;

    return window;
}


/**
 * Dims the background and focuses on the element.
 * @param {Function} RemoteClose A function that executes when the modal is clicked.
 * @param {Color} Intensity The background's color.
 * @param {Number} Index A custom Z-Index for the modal. Default is 29
 * @returns The modal element to remove it.
 */

function ShowModal(RemoteClose, Intensity, Index){
    var modal = document.createElement("modal")
    app.appendChild(modal)
    setTimeout(() => {
        modal.style.opacity = 1
    }, 10);
    if(Intensity){
        modal.style.background = Intensity
    }
    if(Index){
        modal.style.zIndex = Index
    }
    
    function HideModal(){
        modal.style = ""
        setTimeout(() => {
            modal.remove()
        }, 300);
    }
    modal.onclick = function(e){
        if(e.target == modal){
            HideModal()
            RemoteClose()
        }
    }
    modal.close = function(){
        HideModal();
        RemoteClose();
    }

    return HideModal;
}

function CreateModal(Element, ClassName, Intensity, Index){
    const element = document.createElement("div");
    element.classList.add("modalElement");
    if(ClassName){
        element.classList.add(ClassName);
    }

    const closeButton = document.createElement("x");
    closeButton.innerText = "close";
    function modalClose(e){
        if(e){
            e.stopPropagation();
        }
        closeModal();
        element.remove();
    }
    ButtonEvent(closeButton, modalClose, null, true);
    element.appendChild(closeButton);

    element.appendChild(Element);
    const closeModal = ShowModal(modalClose, Intensity, Index);
    app.appendChild(element);

    return modalClose;
}

document.addEventListener("keydown", function(e){
    if(e.key == "Escape"){
        var modals = app.getElementsByTagName("modal");
        if(modals.length > 0){
            modals[modals.length - 1].close();
        }
    }
});
