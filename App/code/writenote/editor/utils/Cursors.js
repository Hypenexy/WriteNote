function renderCarets(carets, cursors, notearea, data) {
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
    }
}