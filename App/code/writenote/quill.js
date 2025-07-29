function InitializeEditor(state) {
    var writenoteNode = writenote.writenote,
        notearea = writenote.notearea,
        overlay = document.createElement("div"),
        carets = document.createElement("div");

    overlay.classList.add("overlay");
    writenoteNode.appendChild(overlay);

    carets.classList.add("carets");
    overlay.appendChild(carets);

    writenote.workspaceData.save = () => {
        const delta = quill.getContents();
        console.log(delta)
    //    return canvas.toDataURL();
    }

    var data = [
        {meta: {v: version}}
    ],
        cursors = [{ line: 1, start: 0, end: 0 }];




    const quill = new Quill('.notearea', {
        toolbar: {
            handlers: {
            image: function() {
                let fileInput = this.container.querySelector('input.ql-image[type=file]');
                if (fileInput == null) {
                fileInput = document.createElement('input');
                fileInput.setAttribute('type', 'file');
                fileInput.setAttribute(
                    'accept',
                    'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
                );
                fileInput.classList.add('ql-image');
                fileInput.addEventListener('change', () => {
                    if (fileInput.files != null && fileInput.files[0] != null) {
                    // Do your own stuff here
                    }
                });
                this.container.appendChild(fileInput);
                }
                fileInput.click();
            }
            }
        }
    });
}