function draggableElement(element, header, options){
    var pos1 = 0, 
        pos2 = 0,
        pos3 = 0,
        pos4 = 0,
        target = element;
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

            function copyElement(element, clonedElementReference){
                mdutils.copyComputedStyle(element, clonedElementReference, true);
                
                clonedElementReference.style.setProperty("position", "absolute");
                clonedElementReference.style.setProperty("z-index", 60);
                clonedElementReference.style.setProperty("transition", "initial");
                clonedElementReference.style.setProperty("opacity", "0.95"); // Alternative is 0.6 but visiblity is bad
                element.style.setProperty("opacity", "0.4")
                // clonedElementReference.style.setProperty("cursor", "grab!important"); Wouldn't work with pointer events none
                
                clonedElementReference.style.setProperty("pointer-events", "none");

                var clonedElements = clonedElementReference.getElementsByTagName("*");
                for (var i = clonedElements.length; i--;) {
                    clonedElements[i].style.setProperty("pointer-events", "none");
                }
            }

            var boundingRect = element.getBoundingClientRect();

            var extraElements = [];
            if(element.matches(".selected")){
                const selectedElements = element.parentNode.querySelectorAll(".selected");

                var i = 0;
                for(const selectedElement of selectedElements){
                    if(selectedElement == element){
                        continue;
                    }
                    i++;
                    const clonedElement = selectedElement.cloneNode(true);
                    clonedElement.elementReference = selectedElement;
                    extraElements.push(clonedElement);

                    copyElement(selectedElement, clonedElement);

                    var selected_boundingRect = selectedElement.getBoundingClientRect();

                    clonedElement.style.setProperty("z-index", 60 - i);
                    clonedElement.style.setProperty("transition", "transform .4s");

                    var x = Math.abs(selected_boundingRect.left - boundingRect.left),
                        y = -(Math.sqrt(i)*5*Math.PI + Math.abs(selected_boundingRect.top - boundingRect.top));
                        // Math.log(20 * i)*10 Is an alternative
                        // As is (20 * i)
                        // Math.sqrt(i)*5*Math.pow(Math.PI, 2)

                    var minusConditionX = "";
                    if(boundingRect.left < selected_boundingRect.left){
                        minusConditionX = "-";
                    }

                    if(boundingRect.top > selected_boundingRect.top){
                        y = -(Math.sqrt(i)*5*Math.PI - Math.abs(selected_boundingRect.top - boundingRect.top));
                    }
                    
                    clonedElement.toTransition = `translateY(${y}px)translateX(${minusConditionX}${x}px)`;
                    clonedElement.style.setProperty("opacity", (100 - Math.sqrt(selectedElements.length-i)*5*Math.PI)/100 + .1);

                    setTimeout(() => {
                        clonedElement.style.setProperty("transform", clonedElement.toTransition);
                    }, 10 * i);

                    clonedElement.style.setProperty("left", selected_boundingRect.x+"px");
                    clonedElement.style.setProperty("top", selected_boundingRect.y+"px");


                    app.appendChild(clonedElement);
                }
                
            }

            copyElement(element, clonedElement);
            
            clonedElement.style.setProperty("left", boundingRect.x+"px");
            clonedElement.style.setProperty("top", boundingRect.y+"px");

            app.appendChild(clonedElement);
    
            document.onmouseup = () => {closeDragElement(event, clonedElement, extraElements)};
            document.onmousemove = (event) => {elementDrag(event, clonedElement, extraElements)};

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

    function elementDrag(e, clonedElement, extraElements){
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

        if(extraElements){
            for (let i = 0; i < extraElements.length; i++) {
                extraElements[i].style.left = extraElements[i].offsetLeft - pos1 + "px";
                extraElements[i].style.top = extraElements[i].offsetTop - pos2 + "px";
            }
        }
        
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

    function closeDragElement(e, clonedElement, extraElements){
        if(options && options.changePosition){
            element.style.removeProperty("position");
            element.style.removeProperty("top");
            element.style.removeProperty("left");
        }
        if(options && typeof options.onDrop == "function"){
            options.onDrop(e, extraElements);
        }
        if(clonedElement){
            element.style.removeProperty("opacity");
            clonedElement.remove();
            for (let i = 0; i < extraElements.length; i++) {
                extraElements[i].elementReference.style.removeProperty("opacity");
                extraElements[i].remove();
            }
        }
        document.onmouseup = null;
        document.onmousemove = null;
    }
}