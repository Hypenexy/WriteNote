var find = document.getElementsByTagName("find")[0]

function ShowFind(){
    if(find.style.visibility == "visible"){
        if(document.activeElement == notearea){
            findInput.value = rangy.getSelection().toString()    
            MarkFound(findInput.value)
        }
        find.getElementsByTagName("input")[0].focus()
        return;
    }
    find.innerHTML = "<input autocomplete='off'><span class='m-i f x'>search</span>"+
    "<findpanel></findpanel>"

    var findInput = find.getElementsByTagName("input")[0]

    find.style = "visibility:visible;opacity:1;transform:translate(-50%,-50%)"

    setTimeout(() => {
        findInput.focus()
    }, 15);

    find.onkeydown = function(e){
        if(e.key=="Escape"){
            HideFind()
        }
    }
    var findpanel = find.getElementsByTagName("findpanel")[0]
    findpanel.innerHTML = "<occ>You haven't searched anything</occ>"
    var advbuttons = ["find_replace", "text_fields", "pin"]
    for(let i = 0; i < advbuttons.length; i++){
        findpanel.innerHTML += "<a tabindex='0' class='m-i advbtn'>"+advbuttons[i]+"</a>"
    }
    var replacehtml
    advbuttons = ["done_all", "find_replace"]
    replacehtml = "<replace><input placeholder='Replace'>"
    for(let i = 0; i < advbuttons.length; i++){
        replacehtml += "<a tabindex='0' class='m-i advbtn'>"+advbuttons[i]+"</a>"
    }
    findpanel.innerHTML += replacehtml + "</replace>"

    var advbuttonsel = findpanel.getElementsByClassName("advbtn");
    for(let i = 0; i < advbuttonsel.length; i++){
        function click(el){
            if(i==3){
                MarkFound(findInput.value, markcasesens, markwordonly, findpanel.getElementsByTagName("input")[0].value, true)
                return;
            }
            if(i==3){
                MarkFound(findInput.value, markcasesens, markwordonly, findpanel.getElementsByTagName("input")[0].value, false)
                return;
            }

            if(!el.style.color){
                el.style.color = "#df85ff"
                //el.style.outline = "1px solid #df85ff" DO I KEEP!?!?!?
                if(i==0){findpanel.getElementsByTagName("replace")[0].style.height="48px"}
                if(i==1){markcasesens = true}
                if(i==2){markwordonly = true}
            }
            else{
                el.style.removeProperty("color")
                el.style.removeProperty("outline")
                if(i==0){findpanel.getElementsByTagName("replace")[0].style.removeProperty("height")}
                if(i==1){markcasesens = false}
                if(i==2){markwordonly = false}
            }
            MarkFound(findInput.value, markcasesens, markwordonly)
        }
        advbuttonsel[i].onclick = function(){
            click(this)
        }
        advbuttonsel[i].onkeydown = function(e){
            if(e.key == "Enter" || e.key == " "){
                click(this)
            }
        }
    }
    
    if(document.activeElement == notearea){
        findInput.value = rangy.getSelection().toString()    
        MarkFound(findInput.value)
    }
    var findpanelactive
    var markcasesens = false
    var markwordonly = false
    find.oninput = function(){
        MarkFound(findInput.value, markcasesens, markwordonly)
        //var term = findInput.value
        //notearea.innerHTML.replace(new RegExp(term, "gi"), (match) => `<mark>${match}</mark>`);
    }

    function panelactive(){
        findpanelactive = true
        findpanel.style = "visibility:visible;opacity:1;top:60px"
    }
    function panelunactive(){
        if(findInput != document.activeElement){
            findpanelactive = false
            findpanel.style = ""
        }
    }

    find.onmouseover = function(){
        panelactive()

    }
    findpanel.onmouseover = function(){
        panelactive()
    }
    find.onmouseout = function(){
        panelunactive()
    }
    findpanel.onmouseout = function(){
        panelunactive()
    }

    findInput.onkeydown = function(e){
        if(e.key=="Tab" && !e.shiftKey){
            e.preventDefault()
            panelactive()
            findpanel.getElementsByTagName("a")[0].focus()
        }
        if(e.key=="<"&&e.key==">"){//these don't work btw
            e.preventDefault()
        }
    }
}

function HideFind(){
    find.style = ""
    ClearFound()
}

function HideAdditionalFind(){
    var findInput = find.getElementsByTagName("input")[0]
    var findpanel = find.getElementsByTagName("findpanel")[0]
    if(findInput != document.activeElement){
        findpanelactive = false
        findpanel.style = ""
    }
}

notearea.addEventListener("focus", function(){
    if(find.style.visibility == "visible"){
        HideAdditionalFind()
    }
})

function MarkFound(Term, CaseSensitive, WholeWord, Replacee, All){
    //var RegexTerm = "/"+term+"/ig";
    ClearFound()
    if(Term){
        var regex
        if(!CaseSensitive){
            regex = new RegExp(Term, "ig")
            if(WholeWord){
                regex = new RegExp("\\b"+Term+"\\b", "ig")
            }
        }
        else{
            regex = new RegExp(Term, "g")
            if(WholeWord){
                regex = new RegExp("\\b"+Term+"\\b", "g")
            }
        }
        var occs = 0
        if(Replacee){
            if(All){
                notearea.innerHTML = notearea.innerHTML.replaceAll(regex, function(match) {occs++; return "<fmark>"+Replacee+"</fmark>"})
            }
        }
        else{
            notearea.innerHTML = notearea.innerHTML.replaceAll(regex, function(match) {occs++; return "<fmark>"+match+"</fmark>"})
        }
        
        find.getElementsByTagName("occ")[0].innerHTML = occs+" occurrences"
    }
    else{
        find.getElementsByTagName("occ")[0].innerHTML = "You haven't searched anything"
    }
}
function ClearFound(){
    Unwrap(notearea.getElementsByTagName("fmark"))
}
function RemoveFound(){
    var fmarks = notearea.getElementsByTagName("fmark")
    for (let i = 0; i < fmarks.length; i++) {
        fmarks[i].remove()
    }
}
function Unwrap(element){
    while(element.length){
        var parent = element[0].parentNode
        while(element[0].firstChild){
            parent.insertBefore(element[0].firstChild, element[0])
        }
        parent.removeChild(element[0])
    }
}

document.addEventListener("keydown", function(e){
    if(e.ctrlKey && e.key.toLowerCase() == "f"){
        e.preventDefault()
        ShowFind()
    }
})