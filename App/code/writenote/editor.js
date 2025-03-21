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
        cursors = [{ line: 0, start: 0, end: 0 }];

    if(typeof state == "object"){
        if(state.data){
            data = state; // this probably shouldnt be JSON.Parse(JSON.stringify())-ed but check anyways. (At time of writing this is the 10th line and I have 8 more after!)
        }
    }

    data.push({ id: 1, text: "Line 1: Editable text", styles: {} })
    data.push({ id: 2, text: "Line 2: Another line", styles: { bold: true } })

    notearea.addEventListener("keydown", (event) => {
        event.preventDefault();

        // New line on Enter
        if (event.key === "Enter") {
            const newLine = { id: data.length + 1, text: "", styles: {} };
            data.push(newLine);
            renderEditor();
        }

        // if(event.key === "Backspace"){
        //     const lastLine = data[data.length - 1];
        //     if(lastLine.text.length == 0){
        //         data.pop();
        //         renderEditor();
        //     }
        // }
        // if(event.key === "Delete"){
        //     const line = notearea.children[cursors[0].line - 1];
        //     if(cursors[0].start < line.innerText.length){
        //         line.innerText = line.innerText.slice(0, cursors[0].start) + line.innerText.slice(cursors[0].start + 1);
        //         renderEditor();
        //     }
        // }
        // if(event.key === "Tab"){
        //     const line = notearea.children[cursors[0].line - 1];
        //     line.innerText = line.innerText.slice(0, cursors[0].start) + "    " + line.innerText.slice(cursors[0].start);
        //     cursors[0].start += 4;
        //     renderEditor();
        // }
        // if(event.key === "Control"){
        //     console.log("Control");
        // }
        // if(event.key === "Shift"){
        //     console.log("Shift");
        // }

        if(event.key === "ArrowLeft"){
            for (let i = 0; i < cursors.length; i++) {
                if(cursors[i].start > 0){
                    cursors[i].start--;
                }
            }
            renderEditor();
        }
        if(event.key === "ArrowRight"){
            for (let i = 0; i < cursors.length; i++) {
                var line = notearea.children[cursors[i].line - 1];
                if(cursors[i].start < line.innerText.length){
                    cursors[i].start++;
                }
            }
            renderEditor();
        }
        if(event.key === "ArrowUp"){
            for (let i = 0; i < cursors.length; i++) {
                if(cursors[i].line > 1){
                    cursors[i].line--;
                }
            }
            renderEditor();
        }
        if(event.key === "ArrowDown"){
            for (let i = 0; i < cursors.length; i++) {
                if(cursors[i].line < notearea.children.length){
                    cursors[i].line++;
                }
            }
            renderEditor();
        }
        
        // const editedLine = event.target;
        // const lineId = parseInt(editedLine.getAttribute("data-id"));
    
        // console.log(lineId, editedLine.innerText);
        // const line = data.find(l => l.id === lineId);
        // if (line) {
        //     line.text = editedLine.innerText;
        //     console.log("Updated Model:", data);
        // }
    });

    function getLineRowIndexes(event){
        var clickedLine = mdutils.findElement(event.target, ".line");
        if(!clickedLine){
            return [notearea.children.length, data[data.length - 1].text.length];
        }
        const font = window.getComputedStyle(clickedLine).font;
        const character = getCharacterIndexOptimized(event, clickedLine, clickedLine.innerText, new TextMeasurer(font));
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

    
    function renderEditor() {
        notearea.innerHTML = "";
    
        for (let i = 1; i < data.length; i++) {
            const line = data[i];
            const div = document.createElement("div");
            div.classList.add("line");
            div.setAttribute("data-id", line.id);

            div.innerHTML = applyStyles(line.text, line.styles);
            
            notearea.appendChild(div);
        }

        carets.innerHTML = "";
        for (let i = 0; i < cursors.length; i++) {
            var caret = document.createElement("div");
            caret.classList.add("caret");
            var line = notearea.children[cursors[i].line - 1];
            var top = line.getBoundingClientRect().top;
            const font = window.getComputedStyle(line).font;
            var left = new TextMeasurer(font).getCharWidths(line.innerText.slice(0, cursors[i].start));
            left = left[left.length-1];
            
            caret.style.left = left + "px";
            caret.style.top = top + "px";

            carets.appendChild(caret);
            
            console.log(cursors[i]);
            
        }
    }
    
    function applyStyles(text, styles) {
        if (styles.bold) text = `<b>${text}</b>`;
        if (styles.italic) text = `<i>${text}</i>`;
        return text;
    }
    
    renderEditor();
    
    
    console.log(notearea);
    console.log(data);

    writenote.workspaceData.state = {};
}