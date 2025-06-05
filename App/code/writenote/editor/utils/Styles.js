function applyStyles(elem, styles, color, backgroundColor) {
    if (styles.includes("b")) elem.style.fontWeight = "bold";
    if (styles.includes("i")) elem.style.fontStyle = "italic";
    if (styles.includes("u")) elem.style.textDecoration = "underline";
    if (styles.includes("s")) elem.style.textDecoration = "line-through";
    if (styles.includes("c")) elem.style.color = "#"+color;
    if (styles.includes("h")) elem.style.backgroundColor = "#"+backgroundColor;
    // font
}