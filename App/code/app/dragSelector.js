function createDragSelector(element, selectableElementsSelector){
    const selector = document.createElement("div");
    selector.classList.add("dragSelector");
    
    var selectees = element.querySelectorAll(selectableElementsSelector),
        selecteesCoords = [];

    var i = 0;
    for (const selectee of selectees) {
        selectee.addEventListener("click", (e) => {
            if(e.ctrlKey){
                selectee.classList.toggle("selected");
            }
            if(e.shiftKey){
                e.stopPropagation();
                var firstSelectedElement = element.querySelector(".selected");
                
            }
        });
        i++;
    }

    function isInside(x1, x2, n){
        if(x1 < n && x2 > n){
            return true;
        }
    }

    function onExit(e, selecteeData){
        if(!e.ctrlKey){
            if(!e.shiftKey){
                selecteeData.element.classList.remove("selected");
                selecteeData.lastState = false;
            }
        }
        else{
            if(selecteeData.lastState == true){
                selecteeData.element.classList.toggle("selected");
                selecteeData.lastState = false;
            }
        }
    }
    function checkSelected(e){
        const select = selector.getBoundingClientRect();

        for(const selecteeData of selecteesCoords){
            var left = selecteeData.x,
                top = selecteeData.y,
                right = selecteeData.x + selecteeData.width,
                bottom = selecteeData.y + selecteeData.height;

            if(isInside(left, right, select.left) || select.left < left && select.right > left){
                if(isInside(top, bottom, select.top) || select.top < top && select.bottom > top){
                    if(selecteeData.lastState == false){
                        selecteeData.lastState = true;
                        if(e.ctrlKey == true){
                            selecteeData.element.classList.toggle("selected");
                        }
                        else{
                            selecteeData.element.classList.add("selected");
                        }
                    }
                }
                else onExit(e, selecteeData);
            }
            else onExit(e, selecteeData);
        }
    }
    
    element.onmousedown = (e) => {
        // if(mdutils.findElement(e.target, selectableElementsSelector)){
        //     return;
        // }
        if(e.target != element){
            return;
        }
        const x = e.clientX,
            y = e.clientY;

        // Get locations of elements
        selectees = element.querySelectorAll(selectableElementsSelector);
        function getCoords(){
            selecteesCoords = [];
            for (const selectee of selectees) {
                if(e.ctrlKey != true && e.shiftKey != true){
                    selectee.classList.remove("selected");
                }
                const {x, y, width, height} = selectee.getBoundingClientRect();
                selecteesCoords.push({
                    x: x + window.scrollX,
                    y: y + window.scrollY,
                    width,
                    height,
                    element: selectee,
                    lastState: false
                });
            }
        }
        getCoords();

        element.onscroll = getCoords;

        // Set selector size and position

        selector.style.setProperty("top", y+"px");
        selector.style.setProperty("left", x+"px");
        app.appendChild(selector);
        
        document.onmouseup = () => {
            document.onmouseup = null;
            document.onmousemove = null;
            element.onscroll = null;
            selector.removeAttribute("style");
            selector.remove();
        };

        document.onmousemove = (event) => {
            var x_now = event.clientX,
                y_now = event.clientY;
                

            var scrollX = element.scrollLeft,
                scrollY = element.scrollTop;

            if(x_now < x - scrollX){
                selector.style.setProperty("width", x-x_now - scrollX+"px");
                selector.style.setProperty("left", x_now+"px");
            }
            else{
                selector.style.setProperty("width", x_now-x + scrollX+"px");
                selector.style.setProperty("left", x - scrollX+"px");
            }

            if(y_now < y - scrollY){
                selector.style.setProperty("height", y-y_now - scrollY+"px");
                selector.style.setProperty("top", y_now+"px");
            }
            else{
                selector.style.setProperty("height", y_now-y + scrollY+"px");
                selector.style.setProperty("top", y - scrollY+"px");
            }

            checkSelected(event);
        };
    };
}


// function createDragSelectorTest(element, selectableElementsSelector){
//     const selectables = [];
//     const selectableElems = [...document.querySelectorAll(selectableElementsSelector)];
//     for (const selectable of selectableElems) {
//         const {x, y, width, height} = selectable.getBoundingClientRect();
//         selectables.push({x: x + window.scrollX, y: y + window.scrollY, width, height, elem: selectable});
//         selectable.dataset.info = JSON.stringify({x, y, width, height});
//     }

//     function checkSelected(selectAreaElem) {
//         const select = selectAreaElem.getBoundingClientRect();
//         const {x, y, height, width} = select;
//         for (const selectable of selectables) {
//             if (checkRectIntersection({x: x + window.scrollX, y: y + window.scrollY, height, width}, selectable)){
//                 selectable.elem.classList.add("selected");
//             } else {
//                 selectable.elem.classList.remove("selected");
//             }
//         }
//     }
//     // ------------

//     function checkRectIntersection(r1, r2) {    // stackoverflow.com/a/13390495
//         return !(r1.x + r1.width  < r2.x ||
//                 r2.x + r2.width  < r1.x ||
//                 r1.y + r1.height < r2.y ||
//                 r2.y + r2.height < r1.y);
//     }

//     element.addEventListener("pointerdown", createSelectAreaDiv);
//     async function createSelectAreaDiv(event) { // stackoverflow.com/a/75902998
//         event.preventDefault();
//         const x = event.pageX;
//         const y = event.pageY;

//         const div = document.createElement("div");
//         div.style.position = "absolute";
//         div.style.width = "0";
//         div.style.height = "0";
//         div.style.left = x + "px";
//         div.style.top = y + "px";
//         div.classList.add("drag-select");
//         document.body.append(div);

//         function resize(event) {
//             const diffX = event.pageX - x;
//             const diffY = event.pageY - y;
//             div.style.left = diffX < 0 ? x + diffX + "px" : x + "px";
//             div.style.top = diffY < 0 ? y + diffY + "px" : y + "px";
//             div.style.height = Math.abs(diffY) + "px";
//             div.style.width = Math.abs(diffX) + "px";
//             checkSelected(div); // extra line 1
//         }
//         selectables.forEach(item => item.elem.classList.remove("intersected"));  // extra line 2
//         element.addEventListener("pointermove", resize);
//         element.addEventListener("pointerup", () => {
//             removeEventListener("pointermove", resize);
//             div.remove();
//         });
//     }
// }