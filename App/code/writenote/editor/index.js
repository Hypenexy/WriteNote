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
    data.push({ id: 5, segments: [{ t: "Line 5: A line with a very long text that should wrap around to the next line if it is too long." }] });
    



    function renderEditor() {
        notearea.innerHTML = "";





    // // Only update changed lines instead of clearing and re-rendering all
    const existingLines = Array.from(notearea.children);
    for (let i = 1; i < data.length; i++) {
        const line = data[i];
        let div = existingLines.find(el => el.getAttribute("data-id") == line.id);

        // If line doesn't exist, create it
        if (!div) {
        div = document.createElement("div");
        div.classList.add("line");
        div.setAttribute("data-id", line.id);
        notearea.appendChild(div);
        } else {
        // Clear previous segments if line exists
        div.innerHTML = "";
        }

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
    }

    // Remove lines that no longer exist in data
    existingLines.forEach(el => {
        if (!data.some(line => String(line.id) === el.getAttribute("data-id"))) {
        notearea.removeChild(el);
        }
    });




    // for (let i = 1; i < data.length; i++) {
    //         const line = data[i];

    //         const div = document.createElement("div");
    //         div.classList.add("line");
    //         div.setAttribute("data-id", line.id);
    
    //         line.segments.forEach(segment => {
    //             let elem = segment.img ? document.createElement("img") : document.createElement("span");
    
    //             if (segment.img) {
    //                 elem.src = segment.img;
    //             } else {
    //                 elem.textContent = segment.t;
    //                 if(segment.s){
    //                     applyStyles(elem, segment.s, segment.c);
    //                 }
    //             }
    
    //             div.appendChild(elem);
    //         });
    
    //         notearea.appendChild(div);
    //     }

        renderCarets(carets, cursors, notearea, data);
    }

    // Re-render carets on window resize to keep them in sync with images
    window.onresize = function() {
        renderEditor();
    };




/**
     * Return length of line
     * @param {Int} line Line number)
     * @returns The length of the text in the line
     */
    function textLength(line){
        var length = 0;
        // Check if data[line] and data[line].segments exist and data[line].segments is an array
        if (data[line] && data[line].segments && Array.isArray(data[line].segments)) {
            for (let i = 0; i < data[line].segments.length; i++) {
                const element = data[line].segments[i];
                // Also check if the element and its 't' property exist
                if (element && element.t !== undefined) {
                    length += element.t.length;
                }
            }
        }
        return length;
    }


    /**
     * Gets clicked line and row
     * @param {Event} event 
     * @returns 
     */
    function getLineRowIndexes(event){
        var clickedLine = mdutils.findElement(event.target, ".line");
        if(!clickedLine){
            return [notearea.children.length, textLength(data.length-1)];
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

    notearea.tabIndex = 0; // Make notearea focusable
    notearea.addEventListener("keydown", (event) => {
        if (cursors.length === 0) return;
        let cursor = cursors[0];
        let lineIdx = data.findIndex(l => l.id == cursor.line);
        let line = data[lineIdx];
        let lineLen = textLength(lineIdx);

        switch (event.key) {
            case "ArrowLeft":
            if (event.ctrlKey) {
                // Move to previous word
                if (cursor.start > 0) {
                let text = "";
                if (line && Array.isArray(line.segments)) {
                    text = line.segments.map(seg => seg.t || "").join("");
                }
                let pos = cursor.start - 1;
                // Skip spaces first
                while (pos > 0 && /\s/.test(text[pos])) pos--;
                // Then skip non-spaces
                while (pos > 0 && !/\s/.test(text[pos - 1])) pos--;
                cursor.start = pos;
                cursor.end = cursor.start;
                } else if (lineIdx > 1) {
                // Move to end of previous line
                lineIdx--;
                cursor.line = data[lineIdx].id;
                cursor.start = textLength(lineIdx);
                cursor.end = cursor.start;
                }
            } else {
                if (cursor.start > 0) {
                cursor.start--;
                cursor.end = cursor.start;
                } else if (lineIdx > 1) {
                // Move to end of previous line
                lineIdx--;
                cursor.line = data[lineIdx].id;
                cursor.start = textLength(lineIdx);
                cursor.end = cursor.start;
                }
            }
            event.preventDefault();
            break;
            case "ArrowRight":
            if (event.ctrlKey) {
                // Move to next word
                let text = "";
                if (line && Array.isArray(line.segments)) {
                text = line.segments.map(seg => seg.t || "").join("");
                }
                let pos = cursor.start;
                // Skip spaces first
                while (pos < text.length && /\s/.test(text[pos])) pos++;
                // Then skip non-spaces
                while (pos < text.length && !/\s/.test(text[pos])) pos++;
                if (pos <= text.length) {
                cursor.start = pos;
                cursor.end = cursor.start;
                } else if (lineIdx < data.length - 1) {
                // Move to start of next line
                lineIdx++;
                cursor.line = data[lineIdx].id;
                cursor.start = 0;
                cursor.end = 0;
                }
            } else {
                if (cursor.start < lineLen) {
                cursor.start++;
                cursor.end = cursor.start;
                } else if (lineIdx < data.length - 1) {
                // Move to start of next line
                lineIdx++;
                cursor.line = data[lineIdx].id;
                cursor.start = 0;
                cursor.end = 0;
                }
            }
            event.preventDefault();
            break;
            case "ArrowUp":
            if (lineIdx > 1) {
                lineIdx--;
                cursor.line = data[lineIdx].id;
                let prevLen = textLength(lineIdx);
                cursor.start = Math.min(cursor.start, prevLen);
                cursor.end = cursor.start;
            }
            event.preventDefault();
            break;
            case "ArrowDown":
            if (lineIdx < data.length - 1) {
                lineIdx++;
                cursor.line = data[lineIdx].id;
                let nextLen = textLength(lineIdx);
                cursor.start = Math.min(cursor.start, nextLen);
                cursor.end = cursor.start;
            }
            event.preventDefault();
            break;
        }
        renderEditor();
    });

    // Focus notearea to receive keyboard events
    notearea.addEventListener("mousedown", () => {
        notearea.focus();
    });


    

    renderEditor();
}