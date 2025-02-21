function draggableElement(element, header, options){
    var pos1 = 0, 
        pos2 = 0,
        pos3 = 0,
<<<<<<< HEAD
        pos4 = 0,
        target = element;
=======
        pos4 = 0;
>>>>>>> 5e5a15a7c4e6bb4e5db6add18b3d5fefc4a975b8
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

        if(options && options.ghostElement){
            const clonedElement = element.cloneNode(true);

            target = clonedElement;

            mdutils.copyComputedStyle(element, clonedElement, true);
            
            clonedElement.style.setProperty("position", "absolute");
            clonedElement.style.setProperty("z-index", 50);
            clonedElement.style.setProperty("transition", "initial");
            clonedElement.style.setProperty("opacity", "0.6");
            // clonedElement.style.setProperty("cursor", "grab!important"); Wouldn't work with pointer events none
            
            clonedElement.style.setProperty("pointer-events", "none");

            var clonedElements = clonedElement.getElementsByTagName("*");
            for (var i = clonedElements.length; i--;) {
                clonedElements[i].style.setProperty("pointer-events", "none");
            }
            
            var boundingRect = element.getBoundingClientRect();
            
            clonedElement.style.setProperty("left", boundingRect.x+"px");
            clonedElement.style.setProperty("top", boundingRect.y+"px");

            app.appendChild(clonedElement);
    
            document.onmouseup = () => {closeDragElement(event, clonedElement)};
            document.onmousemove = (event) => {elementDrag(event, clonedElement)};

            return;
        }
        if(options){
            if(options.changePosition){
                element.style.setProperty("position", "fixed");
            }
        }
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e){
        e = e || window.event;
        e.preventDefault();

        // if(ghostElement){
        //     target = ghostElement;
        // }
        // console.log(element);
        
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        target.style.left = target.offsetLeft - pos1 + "px";
        target.style.top = target.offsetTop - pos2 + "px";
        
        // var normalized = mdutils.normalizeOffset([(element.offsetLeft - pos1), (element.offsetTop - pos2), (element.offsetLeft + element.offsetWidth) + 10, (element.offsetTop + element.offsetHeight) + 10]);
        // if(options && options.isSelection == true){
        //     // element.style.right = normalized[0] + "px";
        //     // element.style.bottom = normalized[1] + "px";
        //     element.style.width = (e.clientX - options.x) + "px";
        //     element.style.height = (e.clientY - options.y) + "px";
        //     return;
        // }
        // element.style.left = normalized[0] + "px";
        // element.style.top = normalized[1] + "px";
    }

    function closeDragElement(e, clonedElement){
        if(options && options.changePosition){
            element.style.removeProperty("position");
            element.style.removeProperty("top");
            element.style.removeProperty("left");
        }
        if(options && typeof options.onDrop == "function"){
            options.onDrop(e);
        }
        if(clonedElement){
            clonedElement.remove();
        }
        document.onmouseup = null;
        document.onmousemove = null;
    }
}