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
    
    /**
     * Gets how long ago was a date
     * @param {*} date Timestamp
     * @returns String of date
     */
    timeSince(date) {
        var seconds = Math.floor((new Date() - date) / 1000);
    
        var interval = seconds / 31536000;
    
        if (interval > 1) {
            return Math.floor(interval) + " " + locale.years;
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " " + locale.months;
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " " + locale.days;
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " " + locale.hours;
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " " + locale.minutes;
        }
        return Math.floor(seconds) + " " + locale.seconds;
    }
      
    /**
     * Format bytes as human-readable text.
     * @param bytes Number of bytes.
     * @param si True to use metric (SI) units, aka powers of 1000. False to use 
     *           binary (IEC), aka powers of 1024.
     * @param dp Number of decimal places to display.
     * @return Formatted string.
     */
    humanFileSize(bytes, si=true, dp=1) {
        const thresh = si ? 1000 : 1024;
    
        if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
        }
    
        const units = si 
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10**dp;
    
        do {
        bytes /= thresh;
        ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
    
    
        return bytes.toFixed(dp) + ' ' + units[u];
    }

    realStyle = function(_elem, _style) {
        var computedStyle;
        if ( typeof _elem.currentStyle != 'undefined' ) {
            computedStyle = _elem.currentStyle;
        } else {
            computedStyle = document.defaultView.getComputedStyle(_elem, null);
        }
    
        return _style ? computedStyle[_style] : computedStyle;
    };
    
    copyComputedStyle = function(src, dest, recursively) {
        if(recursively){
            var SrcElements = src.getElementsByTagName("*");
            var DstElements = dest.getElementsByTagName("*");
            for (var i = SrcElements.length; i--;) {
                var srcEl = SrcElements[i];
                var dstEl = DstElements[i];
                this.copyComputedStyle(srcEl, dstEl);
            }

        }
        var s = this.realStyle(src);
        for ( var i in s ) {
            // Do not use `hasOwnProperty`, nothing will get copied
            if ( typeof s[i] == "string" && s[i] && i != "cssText" && !/\d/.test(i) ) {
                // The try is for setter only properties
                try {
                    dest.style[i] = s[i];
                    // `fontSize` comes before `font` If `font` is empty, `fontSize` gets
                    // overwritten.  So make sure to reset this property. (hackyhackhack)
                    // Other properties may need similar treatment
                    if ( i == "font" ) {
                        dest.style.fontSize = s.fontSize;
                    }
                } catch (e) {}
            }
        }
    };
}