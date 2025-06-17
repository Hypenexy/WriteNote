/**
 * TODO: I need to figure out how to remove tooltips!
 * 
 * ! This function is compatible only with app.js and app.css from the newest WriteNote repo. 
 * Displays tooltip on hover of element
 * @param {HTMLElement} element The element that will have a tooltip
 * @param {String} text Text displayed at the tooltip
 * @param {Boolean} isInstant True if the tooltip will show instantly and not when hovered for .5 seconds
 */
function attachTooltip(element, text, isInstant){
    const tooltipElement = document.createElement("div");
    tooltipElement.classList.add("tooltip");
    tooltipElement.innerHTML = text;
    function toolClick(){
        tooltipElement.remove();
        tooltipElement.classList.remove("active");
    }
    element.addEventListener("click", toolClick);

    function toolMouseMove(e){
        var offset = mdutils.getBoundingClientRectObject(tooltipElement);
        tooltipElement.style.left = (e.clientX - offset.width / 2) + "px";
        var normalOffset = mdutils.normalizeOffsetRightBottom(mdutils.getBoundingClientRectObject(tooltipElement));
        tooltipElement.style.left = normalOffset.left + "px"
    }
    element.addEventListener("mousemove", toolMouseMove);

    function toolMouseEnter(e){
        app.appendChild(tooltipElement);
        var elementRects = element.getClientRects();
        tooltipElement.style.top = (e.clientY + 22) + "px";
        if(e.clientY + 22 < elementRects[0].bottom){
            tooltipElement.style.top = elementRects[0].bottom + "px";
        }
        var offset = mdutils.normalizeOffset(mdutils.getBoundingClientRectObject(tooltipElement))
        tooltipElement.style.top = offset.top + "px"
        tooltipElement.style.left = offset.left + "px"
        if(!isInstant){
            tooltipElement.classList.add("delayed");
        }
        tooltipElement.classList.add("active");
    }
    element.addEventListener("mouseenter", toolMouseEnter);

    function toolMouseLeave(){
        tooltipElement.remove();
        tooltipElement.classList.remove("active");
    }
    element.addEventListener("mouseleave", toolMouseLeave);

    var in_dom = document.body.contains(element);
    var observer = new MutationObserver(function(mutations) {
        if (document.body.contains(element)) {
            if (!in_dom) {
                // console.log("element inserted"); Could improve this.
            }
            in_dom = true;
        } else if (in_dom) {
            in_dom = false;
            toolMouseLeave();
        }

    });
    observer.observe(document.body, {childList: true, subtree: true});



    function removeTooltip(){
        tooltipElement.remove();
        tooltipElement.classList.remove("active");
        element.removeEventListener("click", toolClick);
        element.removeEventListener("mousemove", toolMouseMove);
        element.removeEventListener("mouseenter", toolMouseEnter);
        element.removeEventListener("mouseleave", toolMouseLeave);
        observer.disconnect();
    }

    return removeTooltip;
}