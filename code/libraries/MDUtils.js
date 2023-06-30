/*MDUtils.js
Version: 1.0.0 Dev
Author: Hypenexy
License: https://github.com/Hypenexy/MDUtils/blob/main/LICENSE
*/

/**
 * Variables
 */
 
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * Load JavaScript code/file dynamically.
 * @param {URL} url The path of the file
 * @param {String} id The id of the loaded script in the dom
 * @param {Function} onload A function to call after it's finished loading
 */
 function loadScript(url, id, onload) {
    var script = document.createElement("script")
    if(id){
        script.id = id
    }
    script.src = url
    document.body.appendChild(script)

    if(onload){
        script.onload = function(){
            onload()
        }
    }
}

/**
 * Load CSS files dynamically.
 * @param {URL} url The path of the file
 * @param {String} id The id of the loaded script in the dom
 * @param {Function} onload A function to call after it's finished loading
 */
function loadCSS(url, id, onload){
    var file = url

    var link = document.createElement("link")
    link.href = file.substr(0, file.lastIndexOf(".")) + ".css"
    link.type = "text/css"
    link.rel = "stylesheet"
    link.media = "screen,print"
    if(id){
        link.id = id
    }

    document.getElementsByTagName("head")[0].appendChild(link)

    if(onload){ // IDK If this works or not. Too lazy to test. sry
        link.onload = function(){
            onload()
        }
    }
}


/**
 * Sets an event of an element.
 * @param {*} element Any element
 * @param {*} action A function
 * @param {*} param A parameter to call the function with
 * @param {*} event A bool to decide if the event is passed as the first parameter 
 */
function ButtonEvent(element, action, param, event){
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
 * Warning: WIP Function do not use in production builds. 
 * Sets an event of an element with styling.
 * By default it uses one of my styles for buttons. 
 * @param {*} element Any element
 * @param {*} action A function
 * @param {*} hoverstyle CSS to use on mouse over element
 * @param {*} clickstyle CSS to use momentarily when clicking on the element
 */
function ButtonEventStyled(element, action, hoverstyle, clickstyle){
    if(!hoverstyle){
        element.style = 'transition:.2s;cursor:pointer;background:#444;padding: 4px;margin: 4px;border-radius:4px'
    }
    var mouseover = false
    element.onmouseenter = function(){
        mouseover = true
        if(hoverstyle){
            element.style = hoverstyle
        }
        else{
            element.style.color = "#fff"
            element.style.boxShadow = "0 2px 0 #222"
            element.style.transform = "translateY(-2px)"
        }
    }
    element.onmouseleave = function(){
        mouseover = false
        if(hoverstyle){
            //element.style =
            //how do I remove the hover style :/
            //I can't save element.style (not easily) 
        }
        else{
            element.style.color = "#ddd"
            element.style.removeProperty("box-shadow")
            element.style.removeProperty("transform")
        }
    }
    function elementaction(){
        action()
        if(clickstyle){
            element.style = clickstyle
        }
        else{
            element.style.color = "#444"
            element.style.background = "#999"
            var lastStyle1 = element.style.boxShadow
            var lastStyle2 = element.style.transform
            element.style.removeProperty("box-shadow")
            element.style.removeProperty("transform")
        }
        setTimeout(function() {
            if(clickstyle){
                //element.style = \
                //again.. how do I remove it??
            }
            else{
                if(mouseover==true){
                    element.style.boxShadow = lastStyle1
                    element.style.transform = lastStyle2
                }
                element.style.color = "#ddd"
                element.style.background = "#444"
            }
        }, 200);
    }
    ButtonEvent(element, elementaction)
}

/**
 * A function to foreach an array with a delay!
 * @param {*} array Any array.
 * @param {*} action A function to execute. The current element is a paramater.
 * @param {*} delay The delay in milliseconds.
 * @param {*} startInstant Bool to decide if the first element should be immediately executed.
 */
 function foreachDelayed(array, action, delay, startInstant){
    var i = 0
    var delayPreserve = 0
    function forarray(){
        if(startInstant==true){
            if(delay!=0&&delayPreserve==0){
                delayPreserve = delay
                delay = 0
            }
            else{
                startInstant = false
                delay = delayPreserve
            }
        }
        setTimeout(function(){
            action(array[i])        
            i++
            if(i!=array.length){
                forarray()
            }
        }, delay)
    }
    forarray()
}

/**
 * Get's an element's offset.
 * @param {*} el Any element
 * @returns A JSON of the top and left pixels offset, in a number, of the element.
 */
function getOffset(el){
    var _x = 0
    var _y = 0
    while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft
        _y += el.offsetTop - el.scrollTop
        el = el.offsetParent
    }
    return { top: _y, left: _x }
}

/**
 * Returns getBoundingClientRect() as an object
 * @param {Element} element Any DOM node
 * @returns the getBoundingClientRect() as an object
 */
function getBoundingClientRectObject(element) {
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
function normalizeOffset(offset){
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

/**
 * Used to get a specific css property's value.
 * @param {*} el Any element
 * @param {*} styleProp Any computed css property
 * @returns The value of the param styleProp.
 */
function getStyle(el, styleProp){
    if (window.getComputedStyle)
    {
        var y = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp) 
    }
    else if (el.currentStyle){
        var y = el.currentStyle[styleProp]
    }
    return y
}

/**
 * Warning: WIP Function do not use in production builds. 
 * Blurs behind element.
 * Requires getOffset() & getStyle()
 * @param {*} element Any element
 * @param {*} amount The amount of blur in px
 * @returns Function to remove itself
 */
function BlurElement(element, amount){
    function close(){
        blur.remove()
    }

    var offset = getOffset(element)
    var zIndex = getStyle(element, "z-index")
    var borderRadius = getStyle(element, "border-radius")
    var transform = getStyle(element, "transform")
    var width = getStyle(element, "width")
    var height = getStyle(element, "height")

    var blur = document.createElement("mdblur")
    blur.style.display = "block"
    blur.style.position = "absolute"
    blur.style.top = offset.top + "px"
    blur.style.left = offset.left + "px"
    blur.style.transform = transform
    blur.style.zIndex = zIndex-1//change to - after debugging TODO: add blur bro
    blur.style.width = width
    blur.style.height = height
    blur.style.backdropFilter = "blur("+amount+"px)"
    blur.style.borderRadius = borderRadius

    document.getElementsByTagName("body")[0].appendChild(blur)
    return close;

    // window.onresize = function(){ replicate this!

    // }
}

/**
 * Returns a random number between 2 numbers.
 * @param {*} min Minimum number
 * @param {*} max Maximum number
 * @returns A random number between the 2 parameters.
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

/**
 * Shuffles arrays
 * @param {*} array Any array
 * @returns Shuffled parameter array
 */
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

/**
 * Tries to parse a string safely without errors.
 * Wait maybe this is a bad idea and you should just fix your code!
 * @param {*} jsonString 
 * @returns A parsed JSON or false if it failed parsing.
 */
function safeJSONparse(jsonString) {
    try {
        json = JSON.parse(jsonString)
        return json
    } catch (e) {
        return false
    }
}

/**
 * This function isn't mine it's shamelessly stolen by thomas-peter on stackoverflow, thank you! Actually this might be wrong for the string value since it takes 2 bytes for UNICODE!
 * @param {*} object Any object
 * @returns A number of the approximate size of the parameter in bytes.
 */
function roughSizeOfObject(object){
    var objectList = []
    var stack = [object]
    var bytes = 0
    while (stack.length) {
        var value = stack.pop()

        if ( typeof value === 'boolean' ) {
            bytes += 4
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2
        }
        else if ( typeof value === 'number' ) {
            bytes += 8
        }
        else if(
            typeof value === 'object'
            && objectList.indexOf(value) === -1
        ){
            objectList.push( value )

            for( var i in value ) {
                stack.push(value[i])
            }
        }
    }
    return bytes;
}


/**
 * Format bytes as human-readable text.
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use 
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 * @return Formatted string.
 */
function humanFileSize(bytes, si=true, dp=1) {
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

/**
 * Calculates the value of a ratio between the colors.
 * @param {[r,g,b]} colorA First color
 * @param {[r,g,b]} colorB Second color
 * @param {Int} value A number between 0 and 1 (1 is 100%)
 * @returns Result color in [r, g, b] array.
 */
function getStepColor(colorA, colorB, value){
    return colorA.map(function(color, i) {
        return (color + value * (colorB[i] - color)) & 255
    })
}

/**
 * A function that gets the average color of an image
 * Function belongs to James on StackOverflow
 * @param {*} img Image element
 * @param {Int} blockSize Visit every n pixels
 * @returns The "accent" color
 */
function getAverageRGB(img, blockSize) {
    if(!blockSize){
        blockSize = 5
    }
    var defaultRGB = {r:0,g:0,b:0},
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = img.naturalHeight || img.offsetHeight || img.height;
    width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;

    context.drawImage(img, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        return defaultRGB;
    }

    length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    return rgb;
}

/**
 * Gets a parent's parents' node
 * @param {Element} element Element
 * @param {Int} level How many parents up
 * @returns Returns the parent element according to level
 */
function getParentNode(element, level = 1){
    while (level-- > 0) {
      element = element.parentNode;
      if (!element) return null;
    }
    return element;
}

/**
 * Check if string is just a number
 * @param {*} str String that might be a number
 * @returns Bool true or false depending if the string contains a number
 */
function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) &&
           !isNaN(parseFloat(str))
}

/**
 * WRITENOTE ONLY FOR NOW
 * Cloning an element's style to another
 * @param {Element} sourceNode To copy style from
 * @param {Element} targetNode To apply style to
 */
function copyNodeStyle(sourceNode, targetNode) {
    const computedStyle = window.getComputedStyle(sourceNode);
    //default Array.from(computedStyle).forEach(key => targetNode.style.setProperty(key, computedStyle.getPropertyValue(key), computedStyle.getPropertyPriority(key)))
    computedStyleAr = Array.from(computedStyle)
    for (let i = 0; i < computedStyleAr.length; i++) {
        var current = computedStyleAr[i].toString()
        if(current=="background"||current=="background-color"||current=="color"||current=="font-size"||current=="outline"){
            targetNode.style.setProperty(current, computedStyle.getPropertyValue(current), computedStyle.getPropertyPriority(current))
        }
    }
}



/**
 * Caclulates the luminance values according to the constants
 * @param {Int} r Red
 * @param {Int} g Green
 * @param {Int} b Blue
 * @returns The luminance of the RGB values provided
 */
function luminance(r, g, b) {
    const RED = 0.2126;
    const GREEN = 0.7152;
    const BLUE = 0.0722;

    const GAMMA = 2.4;
    var a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, GAMMA);
    });
    return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}

/**
 * Calculates the contrast ratio between 2 colors
 * @param {*} rgb1 Array like [R, G, B]
 * @param {*} rgb2 The same like above (example) [129, 123, 41]
 * @returns A number that represents the ratio in contrast
 */
function contrast(rgb1, rgb2) {
    var lum1 = luminance(...rgb1);
    var lum2 = luminance(...rgb2);
    var brightest = Math.max(lum1, lum2);
    var darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Formats seconds to Minutes:Seconds
 * @param {Number} seconds The value in seconds to format
 * @returns The time formatted as Minutes:Seconds
 */
function formatPlaybackTime(seconds) {
    minutes = Math.floor(seconds / 60);
    minutes = minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
}

/**
 * Used to generate random Ids
 * @param {Number} length Custom length to return if null it's 36
 * @returns A random string
 */
function guidGenerator(length){
    var S4 = function(){
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
    }
    var guid = S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()
    if(length){
        return guid.slice(0, length)
    }
    return guid
}

/**
 * Listener for when an element is removed
 * Something I don't quite understand yet!
 * MutationObserver, code by joe on stackoverflow
 * @param {Element} element 
 * @param {Function} callback 
 */
function onElementRemoved(element, callback){
    new MutationObserver(function(){
        if(!document.body.contains(element)){
            callback()
            this.disconnect()
        }
    }).observe(element.parentElement, {childList: true})
}

/**
 * An advanced search method, should be in a foreach of elements
 * @param {String} Search The string that the user inputted to search
 * @param {String} Item 1 of the looped items that is going to be checked
 * @returns True if it's matched, false otherwise
 */
function matchCharsInString(Search, Item){
    var words = Search.trim().toLowerCase().split(' ')
    var item = Item.trim().toLowerCase()
    var itemWords = item.split(' ')
    var res = false
    itemWords.forEach(element => {
        words.forEach(word => {
            wordChars = Array.from(word)
            if(wordChars.every(char => element.includes(char))){
                res = true
            }
        })
    })
    return res
}

/**
 * Converts color rgba to hex values.
 * @param {Int} r Red value 
 * @param {Int} g Green value 
 * @param {Int} b Blue value
 * @param {Int} a Alpha value
 * @returns The hex variant of the rgba specified.
 */
function rgbaToHex(r, g, b, a){
    function componentToHex(c){
        if(c==0){
            return "00";
        }
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    var hex = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    if(a || a==0){
        if(a!=255){
            hex += componentToHex(a);
        }
    }
    return hex;
}


function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

/**
 * Download data on a file
 * @param {*} data Contents in file
 * @param {*} filename File name
 * @param {*} type Blob type
 */
function downloadFile(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}