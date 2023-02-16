class MDUI{
    constructor(Quality){
        this.app = document.createElement("app")
        this.Quality = Quality;
    }

    init(){
        document.body.appendChild(this.app)
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
            ButtonEvent(buttonElement, action)
            buttonElement.innerText = text
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
        ButtonEvent(element, action)
        element.innerText = text
        return element
    }
}