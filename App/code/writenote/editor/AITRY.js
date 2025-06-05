function InitializeEditor(state) {
    var writenoteNode = writenote.writenote,
        notearea = writenote.notearea,
        overlay = document.createElement("div"),
        carets = document.createElement("div");

    overlay.classList.add("overlay");
    writenoteNode.appendChild(overlay);

    carets.classList.add("carets");
    overlay.appendChild(carets);

    notearea.setAttribute("tabindex", "0");
    notearea.style.outline = "none";
    notearea.focus();

    var data = [
        { meta: { v: version } }
    ];
    var cursors = [{ line: 1, start: 0, end: 0 }];
    var history = [];
    var redoStack = [];

    if (typeof state == "object" && state.data) {
        data = state;
    }

    data.push({ id: 1, text: "Hello bold", styles: { bold: false } });
    data.push({ id: 2, text: "Line 2: Another line", styles: { bold: true } });
    data.push({ id: 3, segments: [{ img: "./assets/untitled5-16.png" }] });

    function pushHistory() {
        history.push({
            data: JSON.parse(JSON.stringify(data)),
            cursors: JSON.parse(JSON.stringify(cursors))
        });
        if (history.length > 100) history.shift();
        redoStack = [];
    }

    function undo() {
        if (history.length === 0) return;
        redoStack.push({
            data: JSON.parse(JSON.stringify(data)),
            cursors: JSON.parse(JSON.stringify(cursors))
        });
        let prev = history.pop();
        data = JSON.parse(JSON.stringify(prev.data));
        cursors = JSON.parse(JSON.stringify(prev.cursors));
        renderEditor();
    }

    function redo() {
        if (redoStack.length === 0) return;
        history.push({
            data: JSON.parse(JSON.stringify(data)),
            cursors: JSON.parse(JSON.stringify(cursors))
        });
        let next = redoStack.pop();
        data = JSON.parse(JSON.stringify(next.data));
        cursors = JSON.parse(JSON.stringify(next.cursors));
        renderEditor();
    }

    function getCurrentLines() {
        return cursors.map(c => data[c.line]);
    }

    function clampCursor(cursor) {
        let line = data[cursor.line];
        let len = line.text ? line.text.length : 0;
        cursor.start = Math.max(0, Math.min(cursor.start, len));
        cursor.end = Math.max(0, Math.min(cursor.end, len));
    }

    // Keyboard input
    notearea.addEventListener("keydown", (event) => {
        // Undo/Redo
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
            event.preventDefault();
            if (event.shiftKey) redo();
            else undo();
            return;
        }
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
            event.preventDefault();
            redo();
            return;
        }

        // Multicursor: Ctrl+Click handled in mouse event

        // Allow tab navigation out of editor
        if (event.key === "Tab") return;

        // Only handle text lines for all cursors
        let lines = getCurrentLines();
        let changedLines = new Set();

        // Handle character input
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
            pushHistory();
            cursors.forEach((cursor, idx) => {
                let line = data[cursor.line];
                if (!line.text) line.text = "";
                let pos = cursor.start;
                line.text = line.text.slice(0, pos) + event.key + line.text.slice(pos);
                cursor.start++;
                cursor.end = cursor.start;
                changedLines.add(cursor.line);
            });
            renderEditor([...changedLines]);
            return;
        }

        // Handle Enter (split line)
        if (event.key === "Enter") {
            pushHistory();
            cursors.forEach(cursor => {
                let line = data[cursor.line];
                if (!line.text) line.text = "";
                let pos = cursor.start;
                let newText = line.text.slice(pos);
                line.text = line.text.slice(0, pos);
                let newLine = { id: data.length, text: newText, styles: { ...line.styles } };
                data.splice(cursor.line + 1, 0, newLine);
                cursor.line++;
                cursor.start = 0;
                cursor.end = 0;
                changedLines.add(cursor.line - 1);
                changedLines.add(cursor.line);
            });
            renderEditor([...changedLines]);
            return;
        }

        // Handle Backspace
        if (event.key === "Backspace") {
            pushHistory();
            cursors.forEach(cursor => {
                let line = data[cursor.line];
                if (!line.text) line.text = "";
                let pos = cursor.start;
                if (pos > 0) {
                    line.text = line.text.slice(0, pos - 1) + line.text.slice(pos);
                    cursor.start--;
                    cursor.end = cursor.start;
                    changedLines.add(cursor.line);
                } else if (cursor.line > 1) {
                    let prev = data[cursor.line - 1];
                    if (prev.text !== undefined) {
                        let prevLen = prev.text.length;
                        prev.text += line.text;
                        data.splice(cursor.line, 1);
                        cursor.line--;
                        cursor.start = prevLen;
                        cursor.end = prevLen;
                        changedLines.add(cursor.line);
                    }
                }
            });
            renderEditor([...changedLines]);
            return;
        }

        // Handle Delete
        if (event.key === "Delete") {
            pushHistory();
            cursors.forEach(cursor => {
                let line = data[cursor.line];
                if (!line.text) line.text = "";
                let pos = cursor.start;
                if (pos < line.text.length) {
                    line.text = line.text.slice(0, pos) + line.text.slice(pos + 1);
                    changedLines.add(cursor.line);
                } else if (cursor.line < data.length - 1) {
                    let next = data[cursor.line + 1];
                    if (next.text !== undefined) {
                        line.text += next.text;
                        data.splice(cursor.line + 1, 1);
                        changedLines.add(cursor.line);
                    }
                }
            });
            renderEditor([...changedLines]);
            return;
        }

        // Style toggling (Ctrl+B/Ctrl+I)
        if (event.ctrlKey && (event.key === "b" || event.key === "B")) {
            pushHistory();
            cursors.forEach(cursor => {
                let line = data[cursor.line];
                line.styles = line.styles || {};
                line.styles.bold = !line.styles.bold;
                changedLines.add(cursor.line);
            });
            renderEditor([...changedLines]);
            return;
        }
        if (event.ctrlKey && (event.key === "i" || event.key === "I")) {
            pushHistory();
            cursors.forEach(cursor => {
                let line = data[cursor.line];
                line.styles = line.styles || {};
                line.styles.italic = !line.styles.italic;
                changedLines.add(cursor.line);
            });
            renderEditor([...changedLines]);
            return;
        }

        // Cursor movement (Arrow keys, selection with Shift)
        // ...implement multicursor movement and selection logic here...
        // For brevity, not fully expanded in this snippet

        // After movement, call renderEditor() if needed
    });

    // Mouse click: set cursor or add multicursor with Ctrl
    notearea.addEventListener("click", (event) => {
        let target = event.target.closest(".line");
        if (!target) return;
        let lineId = parseInt(target.getAttribute("data-id"));
        let lineIdx = data.findIndex(l => l.id === lineId);
        let text = data[lineIdx].text || "";
        let rect = target.getBoundingClientRect();
        let x = event.clientX - rect.left;
let tm = new TextMeasurer();
let approxChar = getCharacterIndex(event, target, tm);
approxChar = Math.max(0, Math.min(text.length, approxChar));
        if (event.ctrlKey) {
            // Add new cursor
            cursors.push({ line: lineIdx, start: approxChar, end: approxChar });
        } else {
            cursors = [{ line: lineIdx, start: approxChar, end: approxChar }];
        }
        renderEditor();
    });

    // Only render updated lines and carets
    function renderEditor(updatedLines) {
        // If updatedLines is undefined, full render
        if (!updatedLines) {
            notearea.innerHTML = "";
            for (let i = 1; i < data.length; i++) {
                renderLine(i);
            }
        } else {
            updatedLines.forEach(i => renderLine(i));
        }
        renderCarets();
        renderSelections();
    }

    function renderLine(i) {
        let line = data[i];
        let div = notearea.querySelector(`.line[data-id="${line.id}"]`);
        if (!div) {
            div = document.createElement("div");
            div.classList.add("line");
            div.setAttribute("data-id", line.id);
            notearea.appendChild(div);
        }
        if (line.segments && line.segments[0].img) {
            div.innerHTML = "";
            let img = document.createElement("img");
            img.src = line.segments[0].img;
            img.style.maxHeight = "32px";
            div.appendChild(img);
        } else {
            div.innerHTML = applyStyles(line.text || "", line.styles || {});
        }
    }

    function renderCarets() {
        carets.innerHTML = "";
        cursors.forEach(cursor => {
            let lineDiv = notearea.querySelector(`.line[data-id="${data[cursor.line].id}"]`);
            if (lineDiv) {
                let caret = document.createElement("div");
                caret.classList.add("caret");
                caret.style.position = "absolute";
                caret.style.height = "1.2em";
                caret.style.width = "2px";
                caret.style.top = (lineDiv.offsetTop) + "px";
let tm = new TextMeasurer();
let left = tm.getWidthOfNCharacters(lineDiv, cursor.start);
caret.style.left = (lineDiv.offsetLeft + left) + "px";
                carets.appendChild(caret);
            }
        });
    }

    function renderSelections() {
        // Render selection highlights for all cursors with selection
        // You may want to add a .selection div for each selection range
        // For brevity, not fully implemented here
    }

    function applyStyles(text, styles) {
        if (styles.bold) text = `<b>${text}</b>`;
        if (styles.italic) text = `<i>${text}</i>`;
        return text;
    }

    renderEditor();
    notearea.focus();
}