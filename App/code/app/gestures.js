function gestureElement(element, openedElement, options){
    if(options){
        if(options.diff){
            diff = options.diff;
        }
        if(options.contextMenu){
            openedElement = options.contextMenu.node;
        }
    }
    var touchstartX = 0,
        touchstartY = 0,
        diff = diff ? diff : 50,
        animationDuration = 0.1,
        percentageDown = 0;

    element.addEventListener('touchstart', function(e) {
        const { touches, changedTouches } = e.originalEvent ?? e;
        const touch = touches[0] ?? changedTouches[0];
        x = touch.pageX;
        y = touch.pageY;
    
        touchstartX = x;
        touchstartY = y;

        if(options && options.contextMenu){
            options.contextMenu.append(null, element);
        }
        
        animationDuration = openedElement.computedStyleMap().get("animation-duration").value ? openedElement.computedStyleMap().get("animation-duration").value : 0.1;

        openedElement.style.setProperty("animation-play-state", "paused");
    }, false);

    element.addEventListener("touchmove", function(e) {
        const { touches, changedTouches } = e.originalEvent ?? e;
        const touch = touches[0] ?? changedTouches[0];
        x = touch.pageX;
        y = touch.pageY;

        percentageDown = (y - touchstartY)/diff*100;
        var currentPosition = -(percentageDown/100*animationDuration);
        
        if(currentPosition <= 0){
            openedElement.style.setProperty("animation-delay", currentPosition+"s");
        }
    });

    element.addEventListener("touchend", function() {
        // if(percentageDown > 15 && percentageDown < 40){ This is a bad idea!
        //     if(options && options.contextMenu){
        //         options.contextMenu.removeElement();
        //     }
        //     // openedElement.style.setProperty("animation-direction", "reverse");
        //     // setTimeout(() => {
                
        //     // }, animationDuration*1000);
        // }
        
        openedElement.style.removeProperty("animation-play-state");
        
        setTimeout(() => {
            openedElement.style.removeProperty("animation-delay");
        }, animationDuration*1000);
    });



    var secondaryStartX = 0,
        secondaryStartY = 0;
    
    openedElement.addEventListener('touchstart', function(e) {
        const { touches, changedTouches } = e.originalEvent ?? e;
        const touch = touches[0] ?? changedTouches[0];
        secondaryStartX = touch.pageX;
        secondaryStartY = touch.pageY;
        // openedElement.style.setProperty("animation-direction", "reverse");
        openedElement.style.setProperty("animation-play-state", "paused");
    });
    openedElement.addEventListener('touchmove', function(e) {
        const { touches, changedTouches } = e.originalEvent ?? e;
        const touch = touches[0] ?? changedTouches[0];
        x = touch.pageX;
        y = touch.pageY;
        var percentageDown = (y - secondaryStartY)/(diff-diff/2); // how is that not the same as diff/2
        var currentPosition = -(percentageDown*animationDuration);

        console.log(currentPosition);
        
        if(currentPosition >= 0){
            openedElement.style.setProperty("animation-delay", currentPosition+"s");
        }
        if(currentPosition > animationDuration){
            if(options && options.contextMenu){
                options.contextMenu.removeElement();
            }
        }
    });

    openedElement.addEventListener("touchend", function() {
        openedElement.style.removeProperty("animation-play-state");
        openedElement.style.removeProperty("animation-direction");
        openedElement.style.removeProperty("animation-delay");
    });
}