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
      
}