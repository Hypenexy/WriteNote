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
 * This function isn't mine it's shamelessly stolen by thomas-peter on stackoverflow, thank you!
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
            bytes += value.length
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
 * 
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use 
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 * 
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