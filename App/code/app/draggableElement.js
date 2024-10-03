function draggableElement(element, header, options){
    var pos1 = 0, 
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if(header){
        header.onmousedown = dragMouseDown;
    }
    else{
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e){
        e = e || window.event;
        e.preventDefault();
        
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e){
        e = e || window.event;
        e.preventDefault();
        
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        var normalized = mdutils.normalizeOffset([(element.offsetLeft - pos1), (element.offsetTop - pos2), (element.offsetLeft + element.offsetWidth) + 10, (element.offsetTop + element.offsetHeight) + 10]);
        if(options && options.isSelection == true){
            // element.style.right = normalized[0] + "px";
            // element.style.bottom = normalized[1] + "px";
            element.style.width = (e.clientX - options.x) + "px";
            element.style.height = (e.clientY - options.y) + "px";
            return;
        }
        element.style.left = normalized[0] + "px";
        element.style.top = normalized[1] + "px";
    }

    function closeDragElement(){
        document.onmouseup = null;
        document.onmousemove = null;
    }
}