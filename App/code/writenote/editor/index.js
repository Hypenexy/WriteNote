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
    data.push({ id: 2, text: "Line 2: Another line", styles: { bold: true } })
    data.push({ id: 3, segments: [{ img: "./assets/untitled5-16.png" }] })

    

    
}