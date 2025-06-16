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
    
    initializeRender(notearea, carets, cursors, data);

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