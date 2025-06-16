function initializeRender(notearea, carets, cursors, data){

    function renderEditor() {
        notearea.innerHTML = "";
    
        for (let i = 1; i < data.length; i++) {
            const line = data[i];

            const div = document.createElement("div");
            div.classList.add("line");
            div.setAttribute("data-id", line.id);
    
            line.segments.forEach(segment => {
                let elem = segment.img ? document.createElement("img") : document.createElement("span");
    
                if (segment.img) {
                    elem.src = segment.img;
                } else {
                    elem.textContent = segment.t;
                    if(segment.s){
                        applyStyles(elem, segment.s, segment.c);
                    }
                }
    
                div.appendChild(elem);
            });
    
            notearea.appendChild(div);
        }

        renderCarets(carets, cursors, notearea, data);
    }

    // Re-render carets on window resize to keep them in sync with images
    window.onresize = function() {
        renderEditor();
    };
    
    renderEditor();
}