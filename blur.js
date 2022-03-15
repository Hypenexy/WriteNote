function BlurElement(element, amount){

    function getOffset(el) {
        var _x = 0
        var _y = 0
        while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft
            _y += el.offsetTop - el.scrollTop
            el = el.offsetParent
        }
        return { top: _y, left: _x }
    }

    function getStyle(el, styleProp)
    {
        if (window.getComputedStyle)
        {
            var y = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp) 
        }
        else if (el.currentStyle){
            var y = el.currentStyle[styleProp]
        }
        return y
    }

    var offset = getOffset(element)
    var zIndex = getStyle(element, "z-index")
    var borderRadius = getStyle(element, "border-radius")
    var transform = getStyle(element, "transform")

    var blur = document.createElement("blur")
    blur.style.display = "block"
    blur.style.position = "absolute"
    blur.style.top = offset.top + "px"
    blur.style.left = offset.left + "px"
    blur.style.transform = transform
    blur.style.zIndex = zIndex-1//change to - after debugging TODO: add blur bro
    blur.style.width = element.offsetWidth + "px"
    blur.style.height = element.offsetHeight + "px"
    blur.style.backdropFilter = "blur("+amount+"px)"
    blur.style.borderRadius = borderRadius

    document.getElementsByTagName("app")[0].appendChild(blur)
}