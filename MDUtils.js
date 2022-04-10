/*MDUtils.js
Version: 1.0.0 Dev
Author: Hypenexy
License: https://github.com/Hypenexy/MDUtils/blob/main/LICENSE
*/

/**
 * Load scripts dynamically.
 * @param {*} url The url of the file
 * @param {*} id The id of the loaded script in the dom
 * @param {*} onload A function to call after it's finished loading
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
 * Sets an event of an element.
 * @param {*} element Any element
 * @param {*} action A function
 * @param {*} param A parameter to call the function with
 */
function ButtonEvent(element, action, param){
    element.onclick = function(){
        action(param)
    }
    element.onkeydown = function(e){
        if(e.key == "Enter" || e.key == " "){
            action(param)
        }
    }
}

/**
 * Get's an element's offset.
 * @param {*} el Any element
 * @returns An array of the top and left pixels offset of the element.
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