/**
 * Class MDUI
 * Short for MiDelight User Interface
 * Todo:
 *  Add tooltips
 *  Add gradient
 *  Consider removing modals
 */
class MDUI{
    constructor(Quality){
        this.app = document.createElement("app")
        this.Quality = Quality;
    }

    init(){
        document.body.appendChild(this.app)
    }

    updateLocalization(){
        var allElements = this.app.getElementsByTagName("*")
        for (let i = 0; i < allElements.length; i++) {
            if(allElements[i].getAttribute("locale")){
                allElements[i].innerText = locale[allElements[i].getAttribute("locale")]
            }
        }
    }

    highlightElementByLocalization(locale){
        var elementsByLocale = this.app.getElementsByTagName("*")
        for (let i = 0; i < elementsByLocale.length; i++) {
            const element = elementsByLocale[i];
            if(element.getAttribute("locale")==locale){
                // var previous = element.style.backgroundColor
                // element.style.backgroundColor = "#FDFF47"
                // setTimeout(function(){
                //     element.style.backgroundColor = previous
                // }, 2500);
                if(this.app.getElementsByClassName("highlighter").length!=0){
                    this.app.getElementsByClassName("highlighter")[0].remove()
                }
                var rect = element.getBoundingClientRect()
                var highlighter = document.createElement("div")
                highlighter.classList.add("highlighter")
                highlighter.style.borderRadius = window.getComputedStyle(element).borderRadius
                highlighter.style.top = rect.top + 'px'
                highlighter.style.left = rect.left + 'px'
                highlighter.style.width = rect.width + 'px'
                highlighter.style.height = rect.height + 'px'
                this.app.appendChild(highlighter)
                setTimeout(function(){                    
                    highlighter.classList.add("active")
                }, 10)
                setTimeout(function(){
                    highlighter.classList.remove("active")
                    setTimeout(() => {
                        highlighter.remove()
                    }, 300);
                }, 2500);
            }
        }
    }

    //figure out hierarchy of window.keydown tab detection
    createModal(customClass){
        var element = document.createElement("div")
        element.classList.add("modalTransition")
        element.classList.add("mdui")
        if(customClass){
            element.classList.add(customClass)
        }
        element.close = function(){
            element.classList.add("modalTransition")
            setTimeout(() => {
                element.remove()
            }, 200);
        }
        /**
         * Creates a clickable button element
         * @param {String} text Text inside the button
         * @param {Function} action Function to be called on click 
         */
        element.createButton = function(text, action){
            var buttonElement = document.createElement("button")
            buttonElement.setAttribute("locale", text)
            ButtonEvent(buttonElement, action)
            buttonElement.innerText = locale[text]
            element.appendChild(buttonElement)
        }

        this.app.appendChild(element)
        setTimeout(() => {
            element.classList.remove("modalTransition")
        }, 200);
        return element;
    }

    createButton(text, action){
        var element = document.createElement("button")
        element.setAttribute("locale", text)
        ButtonEvent(element, action)
        element.innerText = locale[text]
        return element
    }
}