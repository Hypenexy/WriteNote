
function changeUsername(){
    
}

function changeAvatar(){
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => { 
        if(e.target.files.length == 0){
            return;
        }
        var file = e.target.files[0];
        const windowElement = createWindow("avatarChange");
        
        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = readerEvent => {
            var content = readerEvent.target.result;
        
            const imageEditor = document.createElement("div");
            const imageElement = document.createElement("img");

            imageElement.src = content;
            imageEditor.appendChild(imageElement);

            windowElement.appendChild(imageEditor);

            const cropper = new Cropper(imageElement, {
                aspectRatio: 1 / 1,
                autoCrop: true,
                autoCropArea: 1,
                viewMode: 1,

                // zoomable: false,
                // viewMode: 3,
                dragMode: 'move',
            });
        
            const buttonsContainer = mdutils.createAppendElement("buttons", windowElement);

            const cancel_button = mdutils.createAppendElement("button", buttonsContainer);
            cancel_button.classList.add("i");
            cancel_button.innerHTML = `<i>close</i>${locale.cancel}`;
            mdutils.ButtonEvent(cancel_button, openedWindows["avatarChange"].close);

            const change_button = mdutils.createAppendElement("button", buttonsContainer);
            change_button.classList.add("i");
            change_button.innerHTML = `<i>image</i>${locale.change}`;
            mdutils.ButtonEvent(change_button, () => {
                openedWindows["avatarChange"].close();
                input.click();
            });

            const set_button = mdutils.createAppendElement("button", buttonsContainer);
            set_button.classList.add("i");
            set_button.innerHTML = `<i>check</i>${locale.set}`;
            mdutils.ButtonEvent(set_button, () => {
                cropper.getCroppedCanvas({width: 1024, height: 1024}).toBlob((blob) => {
                    socket.emit("account", {
                        type: "Update avatar",
                        data: blob
                    }, (response) => {
                        if(response.success){
                            openedWindows["avatarChange"].close();
                            updateAvatarElements(response.success);
                        }
                        if(response.error){
                            console.log(response.error);
                        }
                    });
                });
            });   
        }
        // console.log(file);
    }

    input.click();

    

}