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
    //    return canvas.toDataURL();
    }

    var data = [
        {meta: {v: version}}
    ],
        cursors = [{ line: 1, start: 0, end: 0 }];

    if(typeof state == "object"){
        if(state.data){
            data = state; // this probably shouldnt be JSON.Parse(JSON.stringify())-ed but check anyways. (At time of writing this is the 10th line and I have 8 more after!)
        }
    }

    data.push({ id: 1, segments: [{ t: "Hello ", s: "" }, { t: "bold", s: "b" }] })
    data.push({ id: 2, segments: [{ t: "Line 2: Another line" }]});
    data.push({ id: 3, segments: [{ img: "./assets/images/untitled5-16.png" }] })

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
                        applyStyles(elem, segment.s);
                    }
                }
    
                elem.addEventListener("dblclick", () => startEditing(line.id, line.segments.indexOf(segment)));
                div.appendChild(elem);
            });
    
            notearea.appendChild(div);
        }
    }

    function applyStyles(elem, styles) {
        if (styles.includes("b")) elem.style.fontWeight = "bold";
        if (styles.includes("i")) elem.style.fontStyle = "italic";
    }    
    
    renderEditor();

    
}