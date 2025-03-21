function InitializeEditor(notearea, state) {
    writenote.workspaceData.save = () => {
    //    return canvas.toDataURL();
    }

    var data = [
        {meta: {v: version}}
    ];

    if(typeof state == "object"){
        if(state.data){
            data = state; // this probably shouldnt be JSON.Parse(JSON.stringify())-ed but check anyways. (At time of writing this is the 10th line and I have 8 more after!)
        }
    }

    data.push({ id: 1, text: "Line 1: Editable text", styles: {} })
    data.push({ id: 2, text: "Line 2: Another line", styles: { bold: true } })

    function renderEditor() {
        notearea.innerHTML = "";
    
        for (let i = 1; i < data.length; i++) {
            const line = data[i];
            const div = document.createElement("div");
            div.classList.add("line");
            div.setAttribute("data-id", line.id);
            div.contentEditable = "true";

            div.innerHTML = applyStyles(line.text, line.styles);
            
            notearea.appendChild(div);
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