startup = document.getElementsByTagName("startup")[0]

function Startup(){
    function close(){
        hideStartup()
    }
    ShowModal(close)


    /**
     * Imported from WriteNote 2.0.0,
     * used to display a welcoming message!
     * @param {*} name User's username
     */
    function createMOTD(name){
        var now24 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false });
        var hour = parseInt(now24.slice(0, 2));
        var welcomemessage = "Good morning, " + name;
        if(hour>13&&hour<18){
          welcomemessage = "Good afternoon, " + name;
        }
        if(hour>17&&hour<23){
          welcomemessage = "Good evening, " + name;
        }
        if(hour>22||hour<6){
          welcomemessage = "Good night, " + name;
        }
        if(hour==0){
          welcomemessage = "Enjoy the midnight, " + name;
        }
        return welcomemessage;
    }


    /**
     * Also imported from WriteNote 2.0.0,
     * and used to get the type of weather.
     * @param {*} info Parsed retrieved message about weather.
     */
    function weather(info){
        if(info.status==429){
            // document.getElementById("weather").style.display = "none";
            return false;
        }
        else{
            if(info.altdesc=="Thunderstorm"){
                info.desc = "Thunderstorm";
            }
            if(info.altdesc=="Drizzle"){
                info.desc = "Rainy";
            }
            if(info.altdesc=="Rain"){
                info.desc = "Rainy";
            }
            if(info.altdesc=="Snow"){
                info.desc = "Snowing";
            }
            if(info.altdesc=="Clouds"){
                info.desc = "Cloudy";
            }
            if(info.desc=="clear sky"){
                info.desc = "Clear sky";
            }
            if(info.desc=="few clouds"){
                info.desc = "A little cloudy";
            }
            if(info.desc=="scattered clouds"){
                info.desc = "Somewhat cloudy";
            }
            if(info.desc=="very heavy rain"||info.desc=="heavy intensity rain"){
                info.desc = "Heavy rain";
            }
            if(info.desc=="extreme rain"){
                info.desc = "Extreme Rain"
            }
            if(info.desc=="Rain and snow"||info.desc=="Light rain and snow"){
                info.desc = "Snowing & raining";
            }
            if(info.altdesc=="Mist"){
                info.desc = "Mist";
            }

            var now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
            var now24 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false });
            var hour = parseInt(now24.slice(0, 2));
            var timedescription = info.city;
            var temp = parseInt(info.temp.toString().slice(0, 2));
            var feel = "a nice";
            if(Math.floor(Math.random() * 4)==2){
                feel = "a peaceful";
            }
            if(temp<1){
                feel="a freezing"
            }
            if(temp<14){
                feel="a cold"
            }
            if(temp>20){
                feel="a mild"
            }
            if(temp>28){
                feel="a hot"
            }
            if(temp>36){
                feel="an extremely hot"
            }
            if(hour>13&&hour<18){
                timedescription = "It's " + feel + " afternoon in " + info.city;
            }
            if(hour>17&&hour<23){
                timedescription = "It's " + feel + " evening in " + info.city;
            }
            if(hour>22||hour<6){
                timedescription = "It's " + feel + " night in " + info.city;
            }
            if(hour==0){
                timedescription = "It's " + feel + " midnight in " + info.city;
            }
            return '<div id="weathertimed"><timed> Last updated ' + now + '</timed><a class="link" onclick="openotherwindow(' + "'sidepanel'" +')">Options</a></div><h2>' + info.temp.toString().slice(0, 2) + '°C ' + info.desc + "</h2><h3>" + timedescription +".</h3>"
        }
    }

    var storedResponse

    $.ajax({
        url: server + "app/startup.php",
        type: "post",
        //timeout: 1500,
        timeout: 2300,
        data: "steal user data ;)",
        success: function (response) {
            response = JSON.parse(response)
            load(response)
        },
        error: function() {
            load({status:'offline'})
        }
    })

    startup.style.visibility = "visible"
    startup.style.opacity = 1
    startup.style.transform = "translate(-50%, -50%)"

    startup.innerHTML = "<content><div class='startuploader'></div><content>"
    var content = startup.getElementsByTagName("content")[0]
    var other

    function homeContent(anim, retur, info){
        var HTMLinfo = "<account class='widget'><img src='IMG_2363.jpg'>Hypenexy<a tabindex='0'>Switch account</a></account>"+
        "<weather class='widget'><img src='littlecloudy.jpeg'><w>Sunny 38°C</w><p>It's a nice morning in Plovdiv</p></weather>"+
        "<create class='widget'><a tabindex='0'><span class='m-i'>add</span> Create Project</a><a tabindex='0'><span class='m-i'>file_open</span> Open Project</a></create>"+
        "<space class='widget'>2 GB used of 5 GB</space>"
        var HTMLcontent =  "<info>"+HTMLinfo+"</info>"
        if(retur){
            if(info){
                return HTMLinfo
            }
            return '<svg tabindex="0" class="x" width="48" height="48" viewBox="0 0 64 64"><rect x="4" y="8" width="56" height="8" rx="4" ry="4"></rect><rect x="4" y="28" width="56" height="8" rx="4" ry="4"></rect><rect x="4" y="48" width="56" height="8" rx="4" ry="4"></rect></svg><content class="contentfull">' + HTMLcontent + "</content>"
        }
        if(anim){
            content.style = "display:block;overflow:hidden"
            other.style = "display:block;transform: translateY(50px);transition: 0.4s"
            setTimeout(() => {
                other.style = "display:block;transform: translateY(-30px);transition: 0s"
                other.innerHTML = HTMLcontent

                setTimeout(() => {
                    other.style = "display:block;transition: 0.4s"
                    setTimeout(() => {
                        content.style = "display:block"
                    }, 400);
                }, 10);
            }, 100);
        }
        else{
            other.innerHTML = HTMLcontent
        }
        setTimeout(() => {
            var buttons = other.getElementsByTagName("a")

            ButtonEvent(buttons[0], switchAccount)
            ButtonEvent(buttons[1], function(){manageProject(null, "create")})
            ButtonEvent(buttons[2], function(){manageProject(null, "open")})
        }, 150);
    }

    function switchAccount(isSidepanel){
        other = content.getElementsByTagName("other")[0]
        if(isSidepanel){
            other = sidepanel.getElementsByTagName("info")[0]
        }
        content.style = "display:block;overflow:hidden"
        other.style = "display:block;transform: translateY(-50px);transition: 0.4s"
        setTimeout(() => {
            other.style = "display:block;transform: translateY(50px);transition: 0s"
            other.innerHTML = "<span tabindex='0' class='m-i x' style='display:block;width:44px'>arrow_back</span>"+
            "<account class='widget chacc achac'><img src='IMG_2363.jpg'>Hypenexy<a tabindex='0'>Remove</a></account>"+
            "<account class='widget chacc'><img src='IMG_2363.jpg'>Cooler hype<a tabindex='0'>Switch</a><a tabindex='0'>Remove</a></account>"+
            "<account class='widget chacc'><a tabindex='0'>Add another account</a></account>"
            var backbtn = other.getElementsByTagName("span")[0]
            if(isSidepanel){
                backbtn.style.position = "relative"
                backbtn.style.left = "8px"
                backbtn.style.top = "0"
                ButtonEvent(backbtn, sidePanelLoad, true)
            }
            else{
                ButtonEvent(backbtn, function(){homeContent(true)})
            }

            setTimeout(() => {
                other.style = "display:block;transition: 0.4s"
                setTimeout(() => {
                    content.style = "display:block"
                }, 400);
            }, 10);
        }, 100);
    }

    
    function manageProject(isSidepanel, type){
        other = content.getElementsByTagName("other")[0]
        if(isSidepanel){
            other = sidepanel.getElementsByTagName("info")[0]
        }
        content.style = "display:block;overflow:hidden"
        other.style = "display:block;transform: translateY(-50px);transition: 0.4s"
        setTimeout(() => {
            var buttonsgui = "<buttons>"
            if(type=="create"){
                buttonsgui += "<a style='color: #df85ff;box-shadow:0 0 2px 1px #df85ff'>Create</a><a tabindex='0'>Open</a></buttons>"
            }
            else{
                buttonsgui += "<a tabindex='0'>Create</a><a style='color: #df85ff;box-shadow:0 0 2px 1px #df85ff'>Open</a></buttons>"
            }
            other.style = "display:block;transform: translateY(50px);transition: 0s"
            other.innerHTML = "<span tabindex='0' class='m-i x' style='display:block;width:44px'>arrow_back</span>"+
            buttonsgui+
            `<div class="name">
                <divbel>
                <p>Name your new project</p>
                <input class="createname" placeholder="Untitled">
                </divbel>
                <divbel>
                <p>Store your project</p>
                <button class="createcloud"><span class="m-i">cloud</span> Cloud</button>
                <button class="createbrowser"><span class="m-i">web</span> App</button>
                <button class="createdevice"><span class="m-i">desktop_windows</span> Device</button>
                </divbel>
                <divbel>
                <div class="createcloudfolder">
                    <p>Folder</p>
                    <button class='createcloudfolderbutton'>Choose a folder<span class='m-i'>expand_more</span></button>
                    <div class="createcloudfolderselect">
                        <folder><span class='m-i'>home</span></folder>
                        <folder><span class='m-i'>folder</span>folder lmao</folder>
                        <folder><span class='m-i'>folder</span>codes</folder>
                        <folder><span class='m-i'>add_circle_outline</span></folder>
                    </div>
                </div>
                </divbel>
                <divbel>
                <div class="bottom">
                <!-- <p>Create the project</p> -->
                <button class="blue"><span class="m-i">add</span> Create</button> <button onclick="openHome()"><span class="m-i">close</span> Cancel</button>
                </div>
                </divbel>
            </div>`
            var createcloudfolderselect = other.getElementsByClassName("createcloudfolderselect")[0]
            function toggleFolders(button){
                var icon = button.getElementsByClassName("m-i")[0]
                if(!createcloudfolderselect.style.visibility){
                    icon.innerText = "expand_less"
                    button.style.color = "#df85ff"
                    button.style.background = "#df85ff22"
                    button.style.border = "1px solid #df85ff"
                    createcloudfolderselect.style.visibility = "initial"
                    createcloudfolderselect.style.transform = "initial"
                    createcloudfolderselect.style.opacity = 1
                }
                else{
                    icon.innerText = "expand_more"
                    button.style = ""
                    createcloudfolderselect.style.transform = "translateY(-10px)"
                    createcloudfolderselect.style.opacity = 0
                    setTimeout(() => {
                        createcloudfolderselect.style = ""
                    }, 300);
                }
            }
            var folderbutton = other.getElementsByClassName("createcloudfolderbutton")[0]
            ButtonEvent(folderbutton, toggleFolders, folderbutton)
            var buttons = other.getElementsByTagName("a")
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].tabindex = '0'
            }
            ButtonEvent(buttons[0], function(){manageProject(isSidepanel, "create")})
            ButtonEvent(buttons[1], function(){manageProject(isSidepanel, "open")})
            var backbtn = other.getElementsByTagName("span")[0]
            if(isSidepanel){
                backbtn.style.position = "relative"
                backbtn.style.left = "8px"
                backbtn.style.top = "0"
                ButtonEvent(backbtn, sidePanelLoad, true)
            }
            else{
                ButtonEvent(backbtn, function(){homeContent(true)})
            }

            setTimeout(() => {
                other.style = "display:block;transition: 0.4s"
                setTimeout(() => {
                    content.style = "display:block"
                }, 400);
            }, 10);
        }, 100);
    }

    function sidePanelLoad(anim){
        function load(){
            if(anim){
                sidepanel.getElementsByTagName("info")[0].innerHTML = homeContent(true, true, true)
            }
            else{
                sidepanel.innerHTML = homeContent(true, true)
            }
            var buttons = sidepanel.getElementsByTagName("a")
            ButtonEvent(buttons[0], switchAccount, true)
            ButtonEvent(buttons[1], function(){manageProject(true, "create")})
            ButtonEvent(buttons[2], function(){manageProject(true, "open")})
            ButtonEvent(sidepanel.getElementsByTagName("svg")[0], closeNav)
        }
        if(anim){
            var sidepanelanim = sidepanel.getElementsByTagName("info")[0]
            sidepanelanim.style = "display:block;transform: translateY(50px);transition: 0.4s"
            setTimeout(() => {
                load()
                sidepanelanim.style = "display:block;transform: translateY(-50px);transition: 0s"
                setTimeout(() => {
                    sidepanelanim.style = "display:block;transition: 0.4s"
                }, 10);
            }, 100);
        }
        else{
            load()
        }
    }

    function load(response){
        if(!response){
            response = storedResponse
        }
        else{
            storedResponse = response
        }
        if(response.status=="offline"){
            response = {
                name: ""
            }
        }

        content.style = "display:block;transform: translateY(-50px);transition: 0.4s"
        setTimeout(() => {
            content.style = "display:block;transform: translateY(50px);transition: 0s"
            content.innerHTML = "<span tabindex='0' class='m-i x'>close</span>"+
            "<motd>"+createMOTD(response.name)+"</motd>"+
            "<search><span class='m-i'>search</span><input placeholder='Search'></search>"+
            "<other>"+
            "</other>"

            other = content.getElementsByTagName("other")[0]
            homeContent()

            ButtonEvent(content.getElementsByTagName("span")[0], close)

            setTimeout(() => {
                content.style = "display:block;transition: 0.4s"
            }, 10);
        }, 100);
    }

    function hideStartup(){
        var elements = startup.getElementsByTagName("*")

        for (let i = 0; i < elements.length; i++) {
            elements[i].style.transform = "translateX(-200px)";
        }

        startup.style.removeProperty("opacity")
        startup.style.removeProperty("transform")
        startup.style.removeProperty("visibility")
        HideModal()

        sidePanelLoad()
    }

    //startup.innerHTML = "<motd>"+createMOTD()+"</motd>"
}



//dev

window.addEventListener("load", function(){
    Startup()
})



/**
    <input id="notename" value="Untitled"><p id="notenametext" style="display: none">Name is already taken.</p>
    <span onclick="closeNav()" class="m-i x">close</span>
    <div class="smallMenuPanelElements">
      <a onclick="dropdown('note');closeNav()">Note</a>
      <a onclick="dropdown('edit');closeNav()">Edit</a>
      <a onclick="dropdown('view');closeNav()">View</a>
      <a id="anotherloginbtn" onclick="login(); closeNav()">Sign In</a>
      <hr style="width: 80%;">
    </div>
    <a onclick="opensetting('Account'),opensubsetting('profile')">Profile</a>
    <a onclick="opensetting('About')">About</a>
    
    <div id="weather">
      <div id="weatherinfo">
        <a class="link" onclick="openotherwindow('sidepanel')">Options</a>
      </div>
    </div>

    <div class="unsignedAnnotation" id="unsignedAnnotation">
      <h2>You are not signed in.</h2>
      <h3>WriteNote is better with an account!</h3>
      <button onclick="loginannotation()">Sign In</button> <button onclick="noplzno()">Dismiss</button>
    </div>

    <div id="spaceleft" class="prograssdiv">
      <spacey id="spacetext">0 GB of 5 GB used.</spacey>
      <div class="progress">
        <div id="spacepercentage" class="progress-bar" style="width: 0%"></div>
      </div>
    </div>

    <div class="logo" onclick="logo()"><a><img width="64px" height="64px" src="lowpolyc.png"></a><h2>Midelight</h2></div>
 */