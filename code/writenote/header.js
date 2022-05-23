var header = document.createElement("header")
header.innerHTML = `
<c tabindex="0">
<svg width="32" height="32" viewBox="0 0 64 64">
    <rect x="4" y="8" width="56" height="8" rx="4" ry="4"></rect>
    <rect x="4" y="28" width="56" height="8" rx="4" ry="4"></rect>
    <rect x="4" y="48" width="56" height="8" rx="4" ry="4"></rect>
</svg>
</c>
<a>Note</a>
<dropdown>
    <v onclick="newNote()"><p class="m-i">note_add</p> New</v>
    <hr>
    <v onclick="openNote()"><p class="m-i">file_open</p> Open</v>
    <v onclick="saveNote()"><p class="m-i">save</p> Save</v>
    <v id="saveasbtn" onclick="saveAsNote()"><p class="m-i">save_as</p> Save As</v>
    <v onclick="showshare()"><p class="m-i">share</p> Share</v>
    <v onclick="printwn()"><p class="m-i">print</p> Print</v>
    <hr>
    <v onclick="fileHistory()"><p class="m-i">history</p> File History</v>
</dropdown>
<a>Edit</a>
<dropdown>
    <v class="subdropdownbtns"><p class="m-i">add_to_photos</p> Insert<p style="float: right" class="m-i">chevron_right</p></v>
    <v onclick="ShowFind()"><p class="m-i">search</p> Find</v>
    <hr>
    <v onclick="Undo()"><p class="m-i">undo</p> Undo</v>
    <v onclick="Redo()"><p class="m-i">redo</p> Redo</v>
    <hr>
    <v onclick="Cut()"><p class="m-i">cut</p> Cut</v>
    <v onclick="Copy()"><p class="m-i">copy</p> Copy</v>
    <v onclick="Paste()"><p class="m-i">paste</p> Paste</v>
    <v onclick="Paste()"><p class="m-i">content_paste_search</p> Paste Styled</v>
    <v id="pastewoformat" onclick="paste()"><p class="m-i">content_paste_go</p> Paste Text</v>
    <hr>
    <v onclick="SelectAll()"><p class="m-i">select_all</p> Select All</v>
</dropdown>

<subdropdown id="directions" class="subdropdownmenu subdropdownmenu2">
    <v onclick=""><p class="m-i">image</p>Image</v>
    <v onclick=""><p class="m-i">description</p>File</v>
    <v onclick="InsertLink()"><p class="m-i">link</p>Link</v>
    <v onclick="ShowAddDate()"><p class="m-i">event</p>Date</v>
    <v onclick=""><p class="m-i">audiotrack</p>Audio</v>
    <v onclick=""><p class="m-i">phone</p>Contact</v>
    <v onclick=""><p class="m-i">calculate</p>Calculation</v>
</subdropdown>

<a>View</a>
<dropdown>
    <v onclick="toggleCounter()"><p class="m-i">pin</p> Word Counter<tick id="wordcountercheckmark"></tick></v>
    <v onclick="toggleCalculator()"><p class="m-i">calculate</p> Calculator<tick id="calculatorcheckmark"></tick></v>
    <v onclick="toggleTimer()"><p class="m-i">timer</p> Timer<tick id="timercheckmark"></tick></v>
    <hr>
    <v onclick="togglefullscreen()"><p class="m-i">fullscreen</p> Full Screen<tick id="fullscreencheckmark"></tick></v>
    <!-- <v onclick="togglespellcheck()"><p class="m-i">spellcheck</p> Spell Check<tick id="spellcheckcheckmark"></tick></v> -->
    <v onclick="togglewordwrap()"><p class="m-i">wrap_text</p> Word Wrap<tick id="wordwrapcheckmark"></tick></v>
    <v onclick="togglelines()"><p class="m-i">toc</p> Show Lines<tick id="linescheckmark"></tick></v>
    <v class="subdropdownbtns"><p class="m-i">format_textdirection_l_to_r</p> Writing Directio<p style="float: right" class="m-i">chevron_right</p>n</v>
    <v class="subdropdownbtns"><p class="m-i">widgets</p> Menu Positio<p style="float: right" class="m-i">chevron_right</p>n</v>
    <v onclick="opensetting('Appearance'),opensubsetting('font')" class="writingdirection"><p class="m-i">text_fields</p> Change Font</v>
    <v onclick="opensetting('Appearance'),opensubsetting('theme')"><p class="m-i">style</p> Theme</v>
</dropdown>

<subdropdown id="directions" class="subdropdownmenu">
    <v onclick="direction(false)">Left to Right<tick id="ltrcheckmark"></tick></v>
    <v onclick="direction(true)">Right to Left<tick id="rtlcheckmark"></tick></v>
</subdropdown>

<subdropdown id="directions" class="subdropdownmenu">
    <v onclick="HeaderLocation()">Top<tick id="ptcheckmark"></tick></v>
    <v onclick="HeaderLocation(1)">Left<tick id="plcheckmark"></tick></v>
    <v onclick="HeaderLocation(2)">Right<tick id="prcheckmark"></tick></v>
    <v onclick="HeaderLocation(3)">Bottom<tick id="pbcheckmark"></tick></v>
</subdropdown>

<svg id="profilepanelbtn" width="50" height="50" viewBox="0 0 185.5 185.5" xmlns="http://www.w3.org/2000/svg">
    <g>
    <ellipse ry="87.5" rx="87.5" cy="92.5" cx="93" stroke-width="9" fill="none"/>
    <ellipse fill="none" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke-dashoffset="0" ry="28" rx="28" cy="61" cx="92.5"/>
    <path fill="none" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" d="m43.5,146l98.5,0m-98.5,0a49.5,42.5 0 0 1 0,-3.5a49.57,42.5 0 0 1 49.5,-42.5a49.5,42.5 0 0 1 49.5,42.5l0,0a49.5,42.5 0 0 1 0,3.5"/>
    </g>
</svg>
<svg id="notificationsbtn" xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 611.999 611.999">
    <path d="M570.107,500.254c-65.037-29.371-67.511-155.441-67.559-158.622v-84.578c0-81.402-49.742-151.399-120.427-181.203
    C381.969,34,347.883,0,306.001,0c-41.883,0-75.968,34.002-76.121,75.849c-70.682,29.804-120.425,99.801-120.425,181.203v84.578
    c-0.046,3.181-2.522,129.251-67.561,158.622c-7.409,3.347-11.481,11.412-9.768,19.36c1.711,7.949,8.74,13.626,16.871,13.626
    h164.88c3.38,18.594,12.172,35.892,25.619,49.903c17.86,18.608,41.479,28.856,66.502,28.856
    c25.025,0,48.644-10.248,66.502-28.856c13.449-14.012,22.241-31.311,25.619-49.903h164.88c8.131,0,15.159-5.676,16.872-13.626
    C581.586,511.664,577.516,503.6,570.107,500.254z M484.434,439.859c6.837,20.728,16.518,41.544,30.246,58.866H97.32
    c13.726-17.32,23.407-38.135,30.244-58.866H484.434z M306.001,34.515c18.945,0,34.963,12.73,39.975,30.082
    c-12.912-2.678-26.282-4.09-39.975-4.09s-27.063,1.411-39.975,4.09C271.039,47.246,287.057,34.515,306.001,34.515z
        M143.97,341.736v-84.685c0-89.343,72.686-162.029,162.031-162.029s162.031,72.686,162.031,162.029v84.826
    c0.023,2.596,0.427,29.879,7.303,63.465H136.663C143.543,371.724,143.949,344.393,143.97,341.736z M306.001,577.485
    c-26.341,0-49.33-18.992-56.709-44.246h113.416C355.329,558.493,332.344,577.485,306.001,577.485z"/>
</svg>
`

var headeratags = header.getElementsByTagName("a")
var headerdropdowns = header.getElementsByTagName("dropdown")
var headervtags = header.getElementsByTagName("v")

for (let i = 0; i < headervtags.length; i++) {
    headervtags[i].tabIndex = 0
}

var SidePanelButton = header.getElementsByTagName("c")[0]

ButtonEvent(SidePanelButton, openSidepanel)
app.appendChild(header)




for (let i = 0; i < headeratags.length; i++) {
    ButtonEvent(headeratags[i], headerDropdown, headerdropdowns[i], true)
    headeratags[i].onmouseover = function(e){
        hoverDropdown(e, headerdropdowns[i])
    }
}

headeratags[0].addEventListener("click", function(e){
    if(e.detail>10){
        fun(1)
    }
})

var headerDropdownactive = false

function hoverDropdown(e, element){
    if(headerDropdownactive){
        element.style.transition = ".04s"
        headerDropdownactive = false
        headerDropdown(e, element, true)
    }
}
function hideHeaderDropdowns(){
    lastHeaderElement = ""
    headerDropdownactive = false
    for (let i = 0; i < headerdropdowns.length; i++) {
        hideHeaderDropdown(headerdropdowns[i], headeratags[i])
    }
}
function hideHeaderDropdown(element, btn){
    if(element.style.opacity == 1){
        headerDropdownactive = false
        element.style.removeProperty("transition")
        element.style.removeProperty("visibility")
        element.style.removeProperty("transform")
        element.style.removeProperty("max-height")
        element.style.removeProperty("height")
        element.style.removeProperty("opacity")
        btn.style.removeProperty("color")
        element.style.removeProperty("overflow")
        element.style.removeProperty("padding-bottom")
    }
}
var lastHeaderspaceenough = true
var lastHeaderElement = ""
function headerDropdown(event, element, hover){
    if(lastHeaderElement!=element || hover == true){
        var lastOpacity = element.style.opacity
        hideHeaderDropdowns()
        lastHeaderElement = element
        if(headerDropdownactive==false||mobile==true){
            headerDropdownactive = true
            element.style.visibility = "visible"
            element.style.transform = "translateX(-74px)"
            // if(settings.hl == 2){
            //     element.style.transform = "translate(-227px, -50px)"
            // }
            // if(settings.hl == 1){
            //     element.style.transform = "translate(47px, -50px)"
            // }
            var elementHeight = element.offsetHeight
            if(lastOpacity == 0){
                element.style.maxHeight = "1%"
                setTimeout(() => {
                    element.style.maxHeight = elementHeight + "px"
                }, 10)
            }
            element.style.opacity = 1
            event.target.style.color = "#fff"

            setTimeout(function (){
                if(window.innerHeight<=element.offsetHeight+80){
                    lastHeaderspaceenough = false
                    element.style.overflow = "auto"
                    element.style.height = window.innerHeight - 60 + "px"
                }
                else{
                    lastHeaderspaceenough = true
                }
                // if(settings.hl == 3){
                //     element.style.height = "1000px"//why
                //     element.style.transform = "translateY(-"+element.offsetHeight+"px)"
                // }
            }, 300);
        }
        else{
            headerDropdownactive = false
        }
    }
    else{
        hideHeaderDropdowns()
    }
}

var subdropdownbtns = header.getElementsByClassName("subdropdownbtns")

for (let i = 0; i < subdropdownbtns.length; i++) {
    const element = subdropdownbtns[i]
    element.onclick = function(e){
        e.cancelBubble = true
    }
    element.onmouseenter = element.onfocus = function(e){
        if(lastHeaderspaceenough){
            showSubDropdowns(i)
        }
        else{
            showSubDropdowns(i, e)
        }
    }
    element.onmouseleave = element.onblur = function(){
        hideSubDropdowns(i)
    }
}

var subdropdowns = header.getElementsByTagName("subdropdown")

var subdropdownActive = -1
for (let i = 0; i < subdropdowns.length; i++) {
    const element = subdropdowns[i]
    element.onmouseenter = function(){
        subdropdownActive = i
    }
}

function showSubDropdowns(n, event){
    subdropdowns[n].style.visibility = "visible"
    subdropdowns[n].style.opacity = 1
    subdropdowns[n].style.transform = "initial"
    if(event){
        // console.log(event.screenY) Maybe fix this?
        subdropdowns[n].style.top = event.screenY-350 + "px"
    }
    else{
        subdropdowns[n].style.top = ""
    }
}
function hideSubDropdowns(n){
    subdropdowns[n].style.visibility = ""
    subdropdowns[n].style.opacity = ""
    subdropdowns[n].style.transform = ""
}

window.addEventListener('click', function (e){
    if(!e.target.matches('a')&&!e.target.matches('dropdown')){
        hideHeaderDropdowns()
    }
})



var profilepanelbtn = document.getElementById("profilepanelbtn")
var notificationsbtn = document.getElementById("notificationsbtn")