var textPopupsContainer = document.createElement("div");
/**
 * Text popups
 * @param {*} text 
 */
function textPopup(text){
    if(textPopupsContainer.parentNode != app){
        textPopupsContainer.classList.add("textPopupsContainer");
        app.appendChild(textPopupsContainer);
    }
    

    var element = document.createElement("div");
    element.textContent = text;
    element.classList.add("textPopups");
    textPopupsContainer.appendChild(element);

    setTimeout(() => {
        element.classList.add("hide");
        setTimeout(() => {
            element.remove();
            if(textPopupsContainer.childElementCount == 0){
                textPopupsContainer.remove();
            }
        }, element.computedStyleMap().get('animation-duration').value * 1000);
    }, 2000);
}