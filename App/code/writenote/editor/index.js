var debugEditor = {};

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

    debugEditor.data = data;
    debugEditor.cursors = cursors;

    if(typeof state == "object"){
        if(state.data){
            data = state; // this probably shouldnt be JSON.Parse(JSON.stringify())-ed but check anyways. (At time of writing this is the 10th line and I have 8 more after!)
        }
    }

    data.push({ 
        id: 1, 
        segments: [
            { t: "Hel" }, 
            { t: "lo ", s: "b" }, 
            { t: "wo", s: "bi" }, 
            { t: "rld", s: "i" }
        ] 
    });
    data.push({ id: 2, segments: [{ t: "Line 2: Another line" }] });
    data.push({ id: 3, segments: [{ img: "./assets/images/untitled5-16.png" }] });
    data.push({ id: 4, segments: [{ t: "Custom color li", s: "c", c: "f00000" }, { t: "ne", s: "c", c: "00ff00" }] });

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

        
        carets.innerHTML = "";
        for (let i = 0; i < cursors.length; i++) {
            var caret = document.createElement("div");
            caret.classList.add("caret");
            var line = notearea.children[cursors[i].line - 1];
            var top = line.getBoundingClientRect().top;
            var left = new TextMeasurer().getWidthOfNCharacters(line, cursors[i].start);
            
            caret.style.left = left + "px";
            caret.style.top = top + "px";
            // Check if the caret should be placed next to an image segment
            if (line) {
                let charIndex = cursors[i].start;
                let segments = data[cursors[i].line]?.segments || [];
                let runningLength = 0;
                for (let segIdx = 0; segIdx < segments.length; segIdx++) {
                    let seg = segments[segIdx];
                    let segLength = seg.img ? 1 : (seg.t ? seg.t.length : 0);
                    if (charIndex <= runningLength + segLength) {
                        if (seg.img) {
                            // Place caret just after the image and match its height
                            const imgs = line.querySelectorAll("img");
                            const img = imgs[segIdx]; // Match segment index
                            if (img) {
                                const rect = img.getBoundingClientRect();
                                const lineRect = line.getBoundingClientRect();
                                caret.style.left = (rect.right - lineRect.left) + "px";
                                caret.style.top = (rect.top - lineRect.top) + "px";
                                caret.style.height = rect.height + "px";
                                caret.style.width = "2px";
                                // caret.style.background = "black";
                            }
                        }
                        break;
                    }
                    runningLength += segLength;
                }
            }

            carets.appendChild(caret);
            
            console.log(cursors[i]);
            
        }
    }
    
    renderEditor();
    
    function getLineRowIndexes(event){
        var clickedLine = mdutils.findElement(event.target, ".line");
        if(!clickedLine){
            return [notearea.children.length, data[data.length - 1].text.length];
        }
        const font = window.getComputedStyle(clickedLine).font;
        const character = getCharacterIndex(event, clickedLine, new TextMeasurer()) + 1;
        return [clickedLine.getAttribute("data-id"), character];
    }
    
    notearea.addEventListener("click", (event) => {
        var indexes = getLineRowIndexes(event);

        if(event.shiftKey){
            cursors = cursors.map(c => ({ line: indexes[0], start: indexes[1], end: indexes[1] }));
        }
        else{
            cursors = [{ line: indexes[0], start: indexes[1], end: indexes[1] }];
        }

        renderEditor();
    });

}