
/**
 * Creates a <div class="mselect"> (custom select element), with search functionality.
 * Read the other 2 comments inside this function to learn about using it.
 * @param {String} defaultOption If this is null it will display the first option 
 * @param {Boolean} isPlaceholder If this is not true, the defaultOption parameter will be added as an option
 * @param {String} usingNames If this is not null it will be used as a name for the first option, and the select will be value:name type. 
 * @returns The element "mselect".
 */
function createSelect(defaultOption, isPlaceholder, usingNames){
    const select = document.createElement("div");
    select.classList.add("mselect");
    if(defaultOption){
        if(usingNames){
            select.innerHTML = usingNames + "<i>arrow_drop_down</i>"
        }
        else{
            select.innerHTML = defaultOption + "<i>arrow_drop_down</i>"
        }
    }
    var options = []
    if(!isPlaceholder && defaultOption){
        if(usingNames){
            options.push([defaultOption, usingNames])
        }
        else{
            options.push(defaultOption)
        }
    }
    var action
    /**
     * Adds a function on selecting an option.
     * @param {Function} func the function to run with the value as a parameter
     */
    select.addAction = function(func){
        action = func
    }
    if(usingNames && defaultOption){
        select.selecion = usingNames
    }
    else{
        select.selecion = defaultOption
    }
    /**
     * Adds options to the select menu, if defaultOption is not set first added option will be displayed.
     * @param {String} value The value of the option and also the name if the name is null
     * @param {String} name The name of the option
     */
    select.addOption = function(value, name){
        if(!defaultOption && options.length==0){
            select.selecion = name
            select.innerHTML = name + "<i>arrow_drop_down</i>"
        }
        if(name){
            options.push([value, name])
        }
        else{
            options.push(value)
        }
    }
    /**
     * Select an option from the list
     * @param {*} value The value of the option to select.
     */
    select.selectOption = function(value){
        function exists(arr, search) {
            return arr.some(row => row.includes(search))
        }
        if(exists(options, value)){
            select.selecion = value
            select.innerHTML = value + "<i>arrow_drop_up</i>"
        }
    }
    select.addEventListener("click", function(e){
        if(!select.classList.contains("active")){
            select.classList.add("active")
            select.innerHTML = select.selecion + "<i>arrow_drop_up</i>"
            var show = showContext()
            contextMenu.closeFunc = function(){
                document.removeEventListener("keydown", searchContextMenu)
                select.classList.remove("active")
                select.innerHTML = select.selecion + "<i>arrow_drop_down</i>"
            }
            var boundingRect = this.getBoundingClientRect()
            contextMenu.style.top = Math.trunc((boundingRect.bottom + 4)) + "px"
            contextMenu.style.left = Math.trunc(boundingRect.left) + "px"
            contextMenu.style.maxHeight = "500px"
            var search = document.createElement("input")
            search.placeholder = "Search"
            function searchContextMenu(){
                if(document.activeElement!=search){
                    search.focus()
                }
            }
            document.addEventListener("keydown", searchContextMenu)
            function searchEvent(){
                var options = contextMenu.getElementsByTagName("p")
                for (let i = 0; i < options.length; i++) {
                    const element = options[i]
                    var words = search.value.trim().toLowerCase().split(' ')
                    var item = element.innerText.trim().toLowerCase()
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
                    if(!res){
                        element.style.display = "none"
                    }
                    else{
                        element.style.removeProperty("display")
                    }
                }
            }
            search.addEventListener("input", searchEvent)
            contextMenu.appendChild(search)
            options.forEach(value => {
                var element = document.createElement("div");
                element.classList.add("btn");
                element.addEventListener("click", function(){
                    if(action){
                        if(usingNames){
                            action(value[0])
                        }
                        else{
                            action(value)
                        }
                    }
                    if(usingNames){
                        select.selecion = value[1]
                        select.innerHTML = value[1] + "<i>arrow_drop_up</i>"
                    }
                    else{
                        select.selecion = value
                        select.innerHTML = value + "<i>arrow_drop_up</i>"
                    }
                    hideContext()
                })
                if(usingNames){
                    element.innerHTML = value[1]
                }
                else{
                    element.innerHTML = value
                }
                contextMenu.appendChild(element)
            })
            show()
            e.stopPropagation()
        }
        // else{
        //     select.classList.remove("active")
        //     select.innerHTML = select.selecion + "<i>arrow_drop_down</i>"
        // }
    })







var contextMenu

function hideContext(){
    if(contextMenu.closeFunc){
        contextMenu.closeFunc()
    }
    contextMenu.classList.add("transition")
    var altVar = contextMenu
    contextMenu = ""
    setTimeout(() => {
        altVar.remove()
        altVar = ""
    }, 200);
}

/**
 * Cool contextmenu function
 * @returns The function which shows the context menu
 */
function showContext(){
    if(contextMenu && contextMenu.nodeType){
        hideContext()
    }

    contextMenu = document.createElement("div")
    contextMenu.classList.add("contextMenu")
    contextMenu.classList.add("transition")

    function show(){
        app.appendChild(contextMenu)
        var offset = normalizeOffsetRightBottom(getBoundingClientRectObject(contextMenu))
        contextMenu.style.transition = 'initial'
        contextMenu.style.top = offset.top + "px"
        contextMenu.style.left = offset.left + "px"
        setTimeout(() => {
            contextMenu.style.transition = ''
            contextMenu.classList.remove("transition")
        }, 5);
    }
    return show;
}

// document.addEventListener("contextmenu", function(e){
    // e.preventDefault();
    // Probably uncomment after everything is supported with
    // custom context menus. Yes, even the inputs inside the
    // other context menus so you should make a child context
    // menu.
// })












    return select
}


// REWRITE AS SOON AS YOU FIND MOTIVATION!