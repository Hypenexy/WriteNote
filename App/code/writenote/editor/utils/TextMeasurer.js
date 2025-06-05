class TextMeasurer {
    constructor() {
        this.measureDiv = document.createElement("div");
        this.measureDiv.style.position = "absolute";
        this.measureDiv.style.visibility = "hidden";
        this.measureDiv.style.whiteSpace = "nowrap";
        this.measureDiv.style.height = "auto";
        this.measureDiv.style.width = "auto";
    }

    measureStyledText(text, styles) {
        Object.assign(this.measureDiv.style, styles);
        this.measureDiv.textContent = text === " " ? "\u00A0" : text; // Use non-breaking space to measure space correctly
        document.body.appendChild(this.measureDiv);
        var width = this.measureDiv.getBoundingClientRect().width;
        this.measureDiv.remove();
        return width;
    }

    getWidthOfNCharacters(lineElement, charCount) {
        let totalWidth = 0;
        let countedChars = 0;

        for (let node of lineElement.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                for (let char of node.textContent) {
                    if (countedChars >= charCount) return totalWidth;
                    const styles = this.getElementStyles(lineElement);
                    totalWidth += this.measureStyledText(char, styles);
                    countedChars++;
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === "IMG") {
                    if (countedChars >= charCount) return totalWidth;
                    totalWidth += node.width || node.getBoundingClientRect().width;
                    countedChars++;
                } else {
                    const styles = this.getElementStyles(node);
                    for (let char of node.textContent) {
                        if (countedChars >= charCount) return totalWidth;
                        totalWidth += this.measureStyledText(char, styles);
                        countedChars++;
                    }
                }
            }
        }
        return totalWidth;
    }


    getElementStyles(element) {
        const computedStyle = window.getComputedStyle(element);
        return {
            font: computedStyle.font,
            fontSize: computedStyle.fontSize,
            fontWeight: computedStyle.fontWeight,
            fontFamily: computedStyle.fontFamily,
            letterSpacing: computedStyle.letterSpacing,
            wordSpacing: computedStyle.wordSpacing
        };
    }
}

// Get clicked character index
function getCharacterIndex(event, lineElement, measurer) {
    const relativeX = event.clientX - lineElement.getBoundingClientRect().left;
    if (relativeX < 0) return 0;

    let totalWidth = 0;
    let index = 0;

    for (let node of lineElement.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            for (let char of node.textContent) {
                const styles = measurer.getElementStyles(lineElement);
                totalWidth += measurer.measureStyledText(char, styles);

                if (totalWidth >= relativeX) return index;
                index++;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === "IMG") {
                totalWidth += node.width || node.getBoundingClientRect().width;
                if (totalWidth >= relativeX) return index;
                index++;
            } else {
                const styles = measurer.getElementStyles(node);
                for (let char of node.textContent) {
                    totalWidth += measurer.measureStyledText(char, styles);

                    if (totalWidth >= relativeX) return index;
                    index++;
                }
            }
        }
    }
    return index;
}