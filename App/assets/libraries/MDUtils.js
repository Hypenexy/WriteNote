class MDUtils{
    /**
     * A function to foreach an array with a delay!
     * @param {*} array Any array.
     * @param {*} action A function to execute. The current element is a paramater.
     * @param {*} delay The delay in milliseconds.
     * @param {*} startInstant Bool to decide if the first element should be immediately executed.
     */
    foreachDelayed(array, action, delay, startInstant){
        var i = 0;
        var delayPreserve = 0;
        function forarray(){
            if(startInstant==true){
                if(delay!=0&&delayPreserve==0){
                    delayPreserve = delay;
                    delay = 0;
                }
                else{
                    startInstant = false;
                    delay = delayPreserve;
                }
            }
            setTimeout(function(){
                action(array[i]);
                i++;
                if(i!=array.length){
                    forarray();
                }
            }, delay);
        }
        forarray();
    }
    
    /**
     * Sets an event of an element.
     * @param {*} element Any element
     * @param {*} action A function
     * @param {*} param A parameter to call the function with
     * @param {*} event A bool to decide if the event is passed as the first parameter 
     */
    ButtonEvent(element, action, param, event){
        element.tabIndex = 0
        element.onclick = function(e){
            if(event==true){
                action(e, param)
            }
            else{
                action(param)
            }
        }
        element.onkeydown = function(e){
            if(e.key == "Enter" || e.key == " "){
                e.preventDefault()
                if(event==true){
                    action(e, param)
                }
                else{
                    action(param)
                }
            }
        }
    }

    /**
     * Validate emails
     * @param {String} email Checks a string with regex
     * @returns Wether or not the email is correctly formatted
     */
    validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    /**
     * Creates an element and appends it
     * @param {String} tag The class of the element
     * @param {Element} parent The parent to append it to
     * @returns The created element
     */
    createAppendElement(tag, parent){
        const element = document.createElement("div");
        element.classList.add(tag);
        parent.appendChild(element);
        return element;
    }

    
    /**
     * Returns getBoundingClientRect() as an object
     * @param {Element} element Any DOM node
     * @returns the getBoundingClientRect() as an object
     */
    getBoundingClientRectObject(element) {
        var rect = element.getBoundingClientRect()
        return {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y
        }
    }

    
    /**
     * Takes an elements position and size and returns a position that doesn't put it out the screen
     * @param {JSON} offset Takes a JSON as a parameter
     * @returns the same JSON but with calculated value if it's out of the screen 
     */
    normalizeOffsetRightBottom(offset){
        if(offset.right === undefined){ // I'm not sure if this is a proper way to check for undefined
            if(offset.width&&offset.left){
                offset.right = offset.left+offset.width
            }
        }
        if(offset.right > window.innerWidth){
            offset.left = offset.left - (offset.right - window.innerWidth)
        }
        if(offset.bottom === undefined){
            if(offset.height&&offset.top){
                offset.bottom = offset.top+offset.height
            }
        }
        if(offset.bottom > window.innerHeight){
            offset.top = offset.top - (offset.bottom - window.innerHeight)
        }
        return offset
    }
    
    normalizeOffset(offset){
        if(offset[0] <= 0){
            offset[0] = 0;
        }
        if(offset[1] <= 0){
            offset[1] = 0;
        }
        if(offset[2] >= window.innerWidth){
            offset[0] = offset[0] - (offset[2] - window.innerWidth);
        }
        if(offset[3] >= window.innerHeight){
            offset[1] = offset[1] - (offset[3] - window.innerHeight); 
        }
        return offset;
    }
    
}