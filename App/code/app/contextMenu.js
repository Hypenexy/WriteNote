/**
 * Creates a contextMenu to attach to specific element
 * @param {*} type not used 
 * @returns An object with functions and properties.
 */
function contextMenu(type){
    const contextMenu = {};
    contextMenu.node = document.createElement("div");
    contextMenu.node.classList.add("contextMenu", "hide");
    contextMenu.type = type;
    contextMenu.submenus = [];
    contextMenu.selectedConditions = [];

    const dragElement = document.createElement("div");
    dragElement.classList.add("drag");
    contextMenu.node.appendChild(dragElement);
    dragElement.addEventListener("click", function(e){
        e.stopPropagation();
    });
    draggableElement(contextMenu.node, dragElement);

    function hideSubmenu(submenu){
        submenu.classList.remove("visible");
    }

    /**
     * Add elements to the context menu.
     * @param {String} type Type of element, either Text, Line, Button, Input, Extra
     * @param {String} text Display text of the element
     * @param {JSON} options Option of element, either {disabled: Boolean, action: Function, actionEvent: Boolean, icon: String, input: Function, selected: Boolean, selectedReason: Function}
     */
    contextMenu.add = (type, text, options) => {
        const element = document.createElement("div");
        if(options){
            if(typeof options.action == "function" && options.disabled != true){
                mdutils.ButtonEvent(element, options.action, null, options.actionEvent);
            }
            if(options.disabled == true){
                element.classList.add("disabled");
            }
            if(options.icon){
                text = '<i>'+options.icon+'</i>' + text;
                element.classList.add("i");
            }
            if(options.selected == true){
                element.classList.add("selected");
            }
            if(typeof options.selectedReason == "function"){
                contextMenu.selectedConditions.push(() => {
                    if(options.selectedReason()){
                        element.classList.add("selected");
                    }
                    else{
                        element.classList.remove("selected");
                    }
                });
            }
        }
        switch (type) {
            case "text":
                element.classList.add("text");
                break;
            case "button":
                element.classList.add("btn");
                break;
            case "line":
                element.classList.add("hr");
                if(typeof text == "string"){
                    element.innerHTML = `<span>${text}</span>`;
                }
                break;
            case "extra":
                element.classList.add("extra", "btn");
                text += '<i>chevron_right</i>';
                element.classList.add("i");
                break;
            default:
                break;
            }
        if(typeof text == "string" && type != "line"){
            element.innerHTML = text;
        }
        if(options && typeof options.submenu == "object"){
            options.submenu.appendChild(element);
        }
        else{
            contextMenu.node.appendChild(element);
        }
        if(type == "extra"){
            const subMenu = document.createElement("div");
            subMenu.classList.add("contextMenu", "submenu");
            function showSubmenu(){
                var getPosition = element.getBoundingClientRect();
                subMenu.style.left = getPosition.right + "px";
                subMenu.style.top = getPosition.top + "px";
                subMenu.classList.add("visible");
            }
            function mouseOut(event){ // I need to figure a way for when user TABs after the last child element.
                if(event.type == "focusout" && event.relatedTarget != element.previousElementSibling){
                    event.preventDefault();
                    subMenu.children[0].focus();
                    return;
                }
                if(event.toElement != subMenu && event.toElement != element){
                    hideSubmenu(subMenu);
                }
            }
            element.addEventListener("mouseenter", showSubmenu);
            element.addEventListener("focusin", showSubmenu);
            element.addEventListener("focusout", mouseOut);
            element.addEventListener("mouseleave", mouseOut);
            subMenu.addEventListener("mouseleave", mouseOut);
            app.appendChild(subMenu);
            contextMenu.submenus.push(subMenu);
            return subMenu;
        }
        if(type == "input"){
            element.innerHTML = "";
            const input = document.createElement("input");
            element.appendChild(input);
            input.value = text;
            input.addEventListener("click", function(e){
                e.stopPropagation();
            });
            if(options){
                if(options.action && typeof options.action == "function"){
                    input.addEventListener("change", options.action);
                }
                if(options.input && typeof options.input == "function"){
                    input.addEventListener("input", options.input);
                }
            }
        }
    }

    /**
     * Attach to specific element to contain context menu.
     * @param {HTMLElement} element An html element that
     * if context clicked will spawn the menu
     */
    contextMenu.attach = (element) =>{
        element.addEventListener("contextmenu", contextMenu.append);
        document.addEventListener("click", contextMenu.remove);
    }

    /**
     * Display the created context menu.
     * @param {Object} Event event info
     * @param {HTMLElement} toElement If an element is specified
     * the context menu will position (appear) under it
     */
    contextMenu.append = (event, toElement) => {
        for (let i = 0; i < contextMenu.selectedConditions.length; i++) {
            const element = contextMenu.selectedConditions[i];
            element();   
        }

        // function ESC_Close(event){
        //     if(event.code == "Escape"){
        //         const allContextMenus = app.querySelectorAll(".contextMenu"); // test for performance
        //         if(allContextMenus.length > 0){
        //             allContextMenus[0].remove();
        //         }
        //         event.stopPropagation();
        //     }
        // }
        // document.addEventListener("keydown", ESC_Close);
        
        const allContextMenus = app.querySelectorAll(".contextMenu"); // test for performance
        if(allContextMenus.length > 0){
            allContextMenus[0].remove();
        }
        event.stopPropagation();
        event.preventDefault();
        if(contextMenu.node.classList.contains("hide")){
            contextMenu.node.classList.remove("hide");
        }
        
        if(toElement){
            const bounds = toElement.getBoundingClientRect();
            contextMenu.node.style.top = bounds.bottom + "px";
            contextMenu.node.style.left = bounds.left + "px";
        }
        else{
            // compute width here
            contextMenu.node.style.top = event.clientY + "px"; // test event.clientY with buttons and mobile browsers
            contextMenu.node.style.left = event.clientX + "px";// done, the upper isn't.
        }

        app.appendChild(contextMenu.node);

        var normalOffset = mdutils.normalizeOffsetRightBottom(mdutils.getBoundingClientRectObject(contextMenu.node));
        contextMenu.node.style.left = normalOffset.left + "px";
        contextMenu.node.style.top = normalOffset.top + "px";

        // contextMenu.node.children[0].focus(); Doesn't focus
        for (let i = 0; i < contextMenu.submenus.length; i++) {
            const element = contextMenu.submenus[i];
            app.appendChild(element);
        }
    }

    contextMenu.remove = (event) => {
        if(!contextMenu.node.classList.contains("hide")){
            var animationDuration = contextMenu.node.computedStyleMap().get('animation-duration');
            animationDuration = animationDuration ? animationDuration : 0.1;
            
            // var composedPath = event.composedPath();
            // if(composedPath.includes(contextMenu.node) || composedPath.some(r=> contextMenu.submenus.includes(r))){
            // this is way too slow!
            if(event.target == contextMenu.node || contextMenu.submenus.includes(event.target)){
                return;
            }
            for (let i = 0; i < contextMenu.submenus.length; i++) {
                const element = contextMenu.submenus[i];
                if(element.classList.contains("visible")){
                    hideSubmenu(element);
                }
            }
            contextMenu.node.classList.add("hide");
            setTimeout(() => {
                contextMenu.node.remove();
            }, animationDuration * 1000);
        }
    }

    return contextMenu;
}