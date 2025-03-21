class TextMeasurer {
    constructor(font) {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.font = font;
        this.cache = new Map();
    }

    measureText(text) {
        if (this.cache.has(text)) return this.cache.get(text);
        const width = this.ctx.measureText(text).width;
        this.cache.set(text, width);
        return width;
    }

    getCharWidths(text) {
        let widths = [];
        let totalWidth = 0;

        for (let char of text) {
            let charWidth = this.measureText(char);
            totalWidth += charWidth;
            widths.push(totalWidth);
        }
        return widths; // Array of cumulative widths
    }
}

function getCharacterIndexOptimized(event, lineElement, textContent, measurer) {
    const relativeX = event.clientX - lineElement.getBoundingClientRect().left;
    if (relativeX < 0) return 0; // Clicked before the first character

    const widths = measurer.getCharWidths(textContent);

    // Binary search to find the closest character
    let left = 0, right = widths.length - 1;
    while (left < right) {
        let mid = Math.floor((left + right) / 2);
        if (widths[mid] < relativeX) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    return left;
}