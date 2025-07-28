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


    notearea.addEventListener("input", (event) => {
        if (cursors.length === 0) return;
        let cursor = cursors[0];
        let lineIdx = data.findIndex(l => l.id == cursor.line);
        if (lineIdx < 1) return;

        let value = event.data;
        if (!value) return;

        let line = data[lineIdx];
        let offsetStart = Math.min(cursor.start, cursor.end);
        let offsetEnd = Math.max(cursor.start, cursor.end);
        let segs = line.segments;
        let charCount = 0;
        let segIdxStart = 0, segOffsetStart = 0;
        let segIdxEnd = 0, segOffsetEnd = 0;

        // Find segment and offset for start
        for (; segIdxStart < segs.length; segIdxStart++) {
            let seg = segs[segIdxStart];
            if (seg.t) {
                if (charCount + seg.t.length >= offsetStart) {
                    segOffsetStart = offsetStart - charCount;
                    break;
                }
                charCount += seg.t.length;
            }
        }

        // Find segment and offset for end
        charCount = 0;
        for (; segIdxEnd < segs.length; segIdxEnd++) {
            let seg = segs[segIdxEnd];
            if (seg.t) {
                if (charCount + seg.t.length >= offsetEnd) {
                    segOffsetEnd = offsetEnd - charCount;
                    break;
                }
                charCount += seg.t.length;
            }
        }

        // If selection, remove selected text
        if (offsetStart !== offsetEnd) {
            // Remove text in start segment
            if (segs[segIdxStart] && segs[segIdxStart].t) {
                let seg = segs[segIdxStart];
                if (segIdxStart === segIdxEnd) {
                    // Selection within one segment
                    seg.t = seg.t.slice(0, segOffsetStart) + seg.t.slice(segOffsetEnd);
                } else {
                    seg.t = seg.t.slice(0, segOffsetStart);
                }
            }
            // Remove text in end segment
            if (segIdxEnd !== segIdxStart && segs[segIdxEnd] && segs[segIdxEnd].t) {
                let seg = segs[segIdxEnd];
                seg.t = seg.t.slice(segOffsetEnd);
            }
            // Remove segments in between
            if (segIdxEnd - segIdxStart > 1) {
                segs.splice(segIdxStart + 1, segIdxEnd - segIdxStart - 1);
            }
            // Remove empty segments
            if (segs[segIdxStart] && segs[segIdxStart].t === "") segs.splice(segIdxStart, 1);
            if (segIdxEnd !== segIdxStart && segs[segIdxStart + 1] && segs[segIdxStart + 1].t === "") segs.splice(segIdxStart + 1, 1);
            // After deletion, segIdxStart is where to insert
            segIdxEnd = segIdxStart;
            segOffsetEnd = segOffsetStart;
        }

        // Insert the character at the correct segment/offset
        if (segs[segIdxStart] && segs[segIdxStart].t !== undefined) {
            let seg = segs[segIdxStart];
            seg.t = seg.t.slice(0, segOffsetStart) + value + seg.t.slice(segOffsetStart);
        } else {
            // If not found, append to last segment or create new
            if (segs.length && segs[segs.length - 1].t !== undefined) {
                segs[segs.length - 1].t += value;
            } else {
                segs.push({ t: value });
            }
        }

        // Move cursor to end of inserted text
        let newOffset = offsetStart + value.length;
        cursor.start = newOffset;
        cursor.end = newOffset;

        renderEditor();
    });

    // Handle Backspace and Delete keys for text editing
    notearea.addEventListener("keydown", (event) => {
        if (cursors.length === 0) return;
        let cursor = cursors[0];
        let lineIdx = data.findIndex(l => l.id == cursor.line);
        if (lineIdx < 1) return;
        let line = data[lineIdx];
        let offset = cursor.start;
        let segs = line.segments;
        let charCount = 0;
        let segIdx = 0;
        let segOffset = 0;

        // Find which segment the cursor is in
        for (; segIdx < segs.length; segIdx++) {
            let seg = segs[segIdx];
            if (seg.t) {
                if (charCount + seg.t.length >= offset) {
                    segOffset = offset - charCount;
                    break;
                }
                charCount += seg.t.length;
            }
        }

        // Backspace: remove character before cursor
        if (event.key === "Backspace" && !event.ctrlKey && !event.metaKey && !event.altKey) {
            if (offset === 0) {
                // At start of line, maybe merge with previous line
                if (lineIdx > 1) {
                    let prevLine = data[lineIdx - 1];
                    // Merge segments
                    prevLine.segments = prevLine.segments.concat(line.segments);
                    data.splice(lineIdx, 1);
                    cursor.line = prevLine.id;
                    cursor.start = textLength(lineIdx - 1);
                    cursor.end = cursor.start;
                }
            } else {
                if (segs[segIdx] && segs[segIdx].t && segOffset > 0) {
                    // Remove char in this segment
                    let seg = segs[segIdx];
                    seg.t = seg.t.slice(0, segOffset - 1) + seg.t.slice(segOffset);
                    cursor.start--;
                    cursor.end = cursor.start;
                    // Remove empty segment if needed
                    if (seg.t.length === 0) segs.splice(segIdx, 1);
                } else if (segs[segIdx - 1] && segs[segIdx - 1].t) {
                    // Remove last char of previous segment
                    let prevSeg = segs[segIdx - 1];
                    prevSeg.t = prevSeg.t.slice(0, -1);
                    cursor.start--;
                    cursor.end = cursor.start;
                    if (prevSeg.t.length === 0) segs.splice(segIdx - 1, 1);
                }
            }
            renderEditor();
            event.preventDefault();
        }

        // Delete: remove character after cursor
        if (event.key === "Delete" && !event.ctrlKey && !event.metaKey && !event.altKey) {
            let totalLen = textLength(lineIdx);
            if (offset === totalLen) {
                // At end of line, maybe merge with next line
                if (lineIdx < data.length - 1) {
                    let nextLine = data[lineIdx + 1];
                    line.segments = line.segments.concat(nextLine.segments);
                    data.splice(lineIdx + 1, 1);
                }
            } else {
                if (segs[segIdx] && segs[segIdx].t && segOffset < segs[segIdx].t.length) {
                    // Remove char in this segment
                    let seg = segs[segIdx];
                    seg.t = seg.t.slice(0, segOffset) + seg.t.slice(segOffset + 1);
                    // Remove empty segment if needed
                    if (seg.t.length === 0) segs.splice(segIdx, 1);
                } else if (segs[segIdx + 1] && segs[segIdx + 1].t) {
                    // Remove first char of next segment
                    let nextSeg = segs[segIdx + 1];
                    nextSeg.t = nextSeg.t.slice(1);
                    if (nextSeg.t.length === 0) segs.splice(segIdx + 1, 1);
                }
            }
            renderEditor();
            event.preventDefault();
        }
    });

    // Enable input events by making notearea contenteditable
    notearea.setAttribute("contenteditable", "true");
    

    renderEditor();
}