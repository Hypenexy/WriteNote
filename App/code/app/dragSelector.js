// function createDragSelector(element, selectableElementsSelector){
//     const selector = document.createElement("div");
//     selector.classList.add("dragSelector");
    
//     element.onmousedown = (e) => {
//         element.appendChild(selector);
//         // var startX = e.clientX,
//         //     startY = e.clientY;
        
//         selector.style.setProperty("right", e.clientX+"px");
//         selector.style.setProperty("bottom", e.clientY+"px");
        
//         document.onmouseup = () => {
//             document.onmouseup = null;
//             document.onmousemove = null;
//         };

//         document.onmousemove = (event) => {
//             selector.style.setProperty("left", event.clientX+"px");
//             selector.style.setProperty("top", event.clientY+"px");
//         };
//     };
// }
function createDragSelector(element, selectableElementsSelector){
    const selectables = [];
    const selectableElems = [...document.querySelectorAll(selectableElementsSelector)];
    for (const selectable of selectableElems) {
        const {x, y, width, height} = selectable.getBoundingClientRect();
        selectables.push({x: x + window.scrollX, y: y + window.scrollY, width, height, elem: selectable});
        selectable.dataset.info = JSON.stringify({x, y, width, height});
    }

    function checkSelected(selectAreaElem) {
        const select = selectAreaElem.getBoundingClientRect();
        const {x, y, height, width} = select;
        for (const selectable of selectables) {
            if (checkRectIntersection({x: x + window.scrollX, y: y + window.scrollY, height, width}, selectable)){
                selectable.elem.classList.add("intersected");
            } else {
                selectable.elem.classList.remove("intersected");
            }
        }
    }
    // ------------

    function checkRectIntersection(r1, r2) {    // stackoverflow.com/a/13390495
        return !(r1.x + r1.width  < r2.x ||
                r2.x + r2.width  < r1.x ||
                r1.y + r1.height < r2.y ||
                r2.y + r2.height < r1.y);
    }

    element.addEventListener("pointerdown", createSelectAreaDiv);
    async function createSelectAreaDiv(event) { // stackoverflow.com/a/75902998
        event.preventDefault();
        const x = event.pageX;
        const y = event.pageY;

        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.width = "0";
        div.style.height = "0";
        div.style.left = x + "px";
        div.style.top = y + "px";
        div.classList.add("drag-select");
        document.body.append(div);

        function resize(event) {
            const diffX = event.pageX - x;
            const diffY = event.pageY - y;
            div.style.left = diffX < 0 ? x + diffX + "px" : x + "px";
            div.style.top = diffY < 0 ? y + diffY + "px" : y + "px";
            div.style.height = Math.abs(diffY) + "px";
            div.style.width = Math.abs(diffX) + "px";
            checkSelected(div); // extra line 1
        }
        selectables.forEach(item => item.elem.classList.remove("intersected"));  // extra line 2
        element.addEventListener("pointermove", resize);
        element.addEventListener("pointerup", () => {
            removeEventListener("pointermove", resize);
            div.remove();
        });
    }
}