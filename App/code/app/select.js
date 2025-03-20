/**
 * Creates a <div class="select"> (custom select element), with search functionality
 * @param {Array} options 2D array of options [[Value, Name], [Value, Name]]
 * @param {Function} action Function with the selected value as a parameter
 * @returns The <div class="select"> element
 */
function createSelect(options, action){
    const select = document.createElement("div");
    select.classList.add("select");

    // Options
    if(options.length > 0){
        select.innerHTML = `${options[0][1]}<i>arrow_drop_down</i>`;
    }

    select.addOption = (value, name) => {
        options.push(value, name);
    }


    // Dropped down menu
    const selectMenu = contextMenu();
    selectMenu.node.classList.add("selectMenu");

    const search = document.createElement("input");
    search.placeholder = locale.search_the_list;

    // Rendering to DOM, very optimized!
    function renderList(visible, lastVisible){
        if(visible == "all"){
            var hidden = selectMenu.node.querySelectorAll(".hide");
            for (let i = 0; i < hidden.length; i++) {
                hidden[i].classList.remove("hide");
            }
            return;
        }
        for (let i = 0; i < visible.length; i++) {
            var index = options.indexOf(visible[i]);
            selectMenu.node.children[index+2].classList.remove("hide");
        }
        if(lastVisible){
            const filteredArray = lastVisible.filter(value => !visible.includes(value));
            for (let i = 0; i < filteredArray.length; i++) {
                var index = options.indexOf(filteredArray[i]);
                if(index == -1)
                    continue;

                selectMenu.node.children[index+2].classList.add("hide");
            }
        }
        else{
            for (let i = 0; i < options.length; i++) {
                selectMenu.node.children[i+2].classList.add("hide");
            }
        }
    }

    // Searching algorithm
    const MIN_DISTANCE = 10;
    var lastFilteredOptions;
    search.addEventListener("input", () => {
        const searchText = search.value.toLowerCase();
        if(searchText.length == 0){
            lastFilteredOptions = "";
            renderList("all");
            return;
        }

        var scores = [];
        const filteredOptions = options.filter((option) => {
            // var score = 0,
            //     words = option[1].toLowerCase().split(/[\s.,<>;:'"{}\[\]]+/),
            //     searchTextWords = searchText.split(/[\s.,<>;:'"{}\[\]]+/);
            // for (let i = 0; i < words.length; i++) {
            //     for (let j = 0; j < searchTextWords.length; j++) {
            //         score += mdutils.levenshtein(words[i], searchTextWords[j]);
            //     }
            // }

            // var score = mdutils.levenshtein(option[1].toLowerCase(), searchText);
            // scores.push([score, options.indexOf(option)]);
    
            // console.log(score)
            // return score <= MIN_DISTANCE;
            const distance = mdutils.levenshtein(option[1].toLowerCase(), searchText);
            return distance <= MIN_DISTANCE;
        });

        // scores.sort((a, b) => a[0] - b[0]);
        // filteredOptions.sort((a, b) => scores[options.indexOf(a)][0] - scores[options.indexOf(b)][0]);
        // console.log(filteredOptions);

        // for (let i = 0; i < scores.length - 1; i++) {
        //     [filteredOptions[scores[i][1]], filteredOptions[scores[i+1][1]]] = [filteredOptions[scores[i+1][1]], filteredOptions[scores[i][1]]];
        // }

        // console.log(filteredOptions);

        if(lastFilteredOptions === filteredOptions){
            return;
        }

        renderList(filteredOptions, lastFilteredOptions);
        lastFilteredOptions = filteredOptions;
    });
    selectMenu.node.appendChild(search);

    for (let i = 0; i < options.length; i++) {
        selectMenu.add("button", options[i][1], {action: () => {action(options[i][0])}});
    }

    selectMenu.attach(select, select, true);

    return select;
}