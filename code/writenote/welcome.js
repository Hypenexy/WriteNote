// make the background a hot water
// inspired by Posy

var WelcomeGuiinteractable = true
function WelcomeGui(response, element, error){
    var welcomeguimodal
    var content = element.getElementsByTagName("content")[0]
    if(response=="error"){

        
        $.ajax({
            url: server + "app/errorlog.php",
            type: "post",
            data: {clienterror: error[0], serverresponse: error[1]},
            success: function (response) {
            },
            error: function() {
            }
        })
        
        content.style.transform = "translateY(20px)"
        content.style.opacity = 0

        setTimeout(() => {
            content.style.transition = "initial"
            content.style.transform = "translateY(-20px)"
            content.style.removeProperty("overflow")
            setTimeout(() => {
                content.innerHTML = "<p class='error'>"+locale.oops+"</p> <err><b>"+locale.clienterr+"</b> " + error[0] + "</err><err><b>"+locale.serverres+"</b> " + error[1] + "</err><div class='error'><button>"+locale.retry+"</button><button>"+locale.continueoffline+"</button></div>"
                var buttons = content.getElementsByTagName("button")
                ButtonEvent(buttons[0], connectToMidelightTemporary)
                ButtonEvent(buttons[1], function(){
                    var response = {status:"offline"}
                    storedResponse = response
                    WelcomeGui(response, welcome)
                })
                content.style.removeProperty("transition")
                content.style.removeProperty("transform")
                content.style.opacity = 1
                return;
            }, 10)
        }, 300)


    }
    if(element.classList[0]=="welcome"){
        content.classList.add("contentfull")
    }
    /**
     * Imported from WriteNote 2.0.0,
     * used to display a welcoming message!
     * @param {*} name User's username
     * It actually shows up as 24th hour on chrome lol
     */
     function createMOTD(name){
        var now24 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false });
        var hour = parseInt(now24.slice(0, 2));
        if(name){
            name = "<br>" + name
        }
        var welcomemessage = locale.goodmorning
        if(hour>13&&hour<18){
          welcomemessage = locale.goodafternoon
        }
        if(hour>17&&hour<23){
          welcomemessage = locale.goodevening
        }
        if(hour>22||hour<6){
          welcomemessage = locale.goodnight
        }
        if(hour==0||hour==24){
          welcomemessage = locale.goodmidnight
        }
        welcomemessage += ", " + name
        return welcomemessage;
    }

    var motd = document.createElement("h1")
    if(response.status!='offline'&&response.user!=false){
        motd.innerHTML = createMOTD(response.user.username)
        if(!mobileHeaderMenu.getElementsByTagName("account")[0]){
            var account = document.createElement("account")
            account.innerHTML = "<img src='temp/pfp.jpeg'><name>"+response.user.username+"</name><bio>the world is beautiful by your side</bio><img src='temp/banner.jpeg'>"
            mobileHeaderMenu.prepend(account)
            mobileHeaderMenu.prepend(mobileHeaderMenu.getElementsByTagName("h1")[0])

        }
    }
    else{
        motd.innerHTML = createMOTD("")
    }

    function welcomeClose(){
        welcomeguimodal()
        WelcomeGuiinteractable = false
        welcome.classList.remove("welcometransitioned")
        
        if(storedResponse){
            if(sidepanel.innerText==""){
                sidepanel.innerHTML += "<content></content>"
                WelcomeGui(storedResponse, sidepanel)
            }
        }
        setTimeout(() => {
            element.remove()
            welcome.classList = ""
            WelcomeGuiinteractable = true
        }, 500)
    }

    document.addEventListener("keydown", function(e){
        if(e.key == "Escape"){ //am i optimizing?
            if(welcome.classList[0] == "welcome"){
                if(newfile && newfile.nodeType){
                    
                }
                else{
                    welcomeClose()
                }
            }
        }
    })    

    if(element.classList[0]=="welcome"){
        var closebtn = document.createElement("x")
        closebtn.classList.add("m-i")
        closebtn.innerText = "close"
        ButtonEvent(closebtn, function(){
            welcomeClose()
        })
        welcomeguimodal = ShowModal(welcomeClose)
    }

    var search = document.createElement("search")
    var searchinput = document.createElement("input")
    searchinput.placeholder = locale.search
    searchinput.addEventListener("input", function(){
        var everything = files.getElementsByTagName("button")
        for (let i = 0; i < everything.length; i++) {
            const element = everything[i];
            if(element!=searchinput||element!=search){
                try {
                    if(!element.innerText.toLocaleLowerCase().includes(searchinput.value.toLocaleLowerCase())){
                        element.style.display = "none" // Improve this cuz it's shit!
                    }
                    else{
                        element.style.removeProperty("display")
                    }
                } catch (e) {
                    
                }
            }
        }
    })
    search.innerHTML = "<i class='m-i'>search</i>"
    search.appendChild(searchinput)

    var info = document.createElement("info")
    var widgets = []

    var account = document.createElement("account")
    widgets.push(account)
    if(response.status!='offline'){
        if(response.user!=false){
            account.innerHTML = "<img src='temp/pfp.jpeg'>"+response.user.username+"<a tabindex='0'>"+locale.switchacc+"</a>"
            account.style = "text-shadow: 1px 1px 3px #000;background-position:center;background-size:cover;background-image:url(temp/banner.jpeg)"
            ButtonEvent(account.getElementsByTagName("a")[0], function(){
                 //do ur account switching
            })
        }
        else{
            account.innerHTML = "You're not logged in. <a>Login</a><a>Register</a>"
            ButtonEvent(account.getElementsByTagName("a")[1], function(){
                loadCSS(serveraddress + "img/styles/forms.css")
                loadScript(serveraddress + "register/register.js.php", "registerscript", function(){
                    showlogin()
                    var xbtn = login.getElementsByTagName("span")[0]
                    xbtn.opacity = 1
                    ButtonEvent(xbtn, hidelogin)
                })
            })
        }
    }
    else{
        account.innerHTML = locale.noconnection+" <a tabindex='0'>"+locale.retry+"</a>"

        ButtonEvent(account.getElementsByTagName("a")[0], function(){
            sidepanel.innerHTML = sidepanelHTML
            connectToMidelightTemporary()
        })
    }

    function WeatherStyled(info){//reconsider these 💫 cute names ✨
        if(info.altdesc=="Thunderstorm"){
            info.desc = locale.thunderstorm
        }
        if(info.altdesc=="Drizzle"){
            info.desc = locale.rainy
        }
        if(info.altdesc=="Rain"){
            info.desc = locale.rainy
        }
        if(info.altdesc=="Snow"){
            info.desc = locale.snow
        }
        if(info.altdesc=="Clouds"){
            info.desc = locale.cloudy
        }
        if(info.desc=="clear sky"){
            info.desc = locale.clearsky
        }
        if(info.desc=="few clouds"){
            info.desc = locale.fewclouds
        }
        if(info.desc=="scattered clouds"){
            info.desc = locale.scatteredclouds
        }
        if(info.desc=="very heavy rain"||info.desc=="extreme rain"||info.desc=="heavy intensity rain"){
            info.desc = locale.veryrain
        }
        if(info.desc=="Rain and snow"||info.desc=="Light rain and snow"){
            info.desc = locale.snowrain
        }
        if(info.altdesc=="Mist"){
            info.desc = locale.mist
        }
        
        var now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })
        var now24 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false })
        var hour = parseInt(now24.slice(0, 2))
        var timedescription = info.city
        var temp = parseInt(info.temp.toString().slice(0, 2))
        var feel = locale.feel
        if(Math.floor(Math.random() * 4)==2){
            feel = locale.peaceful
        }
        if(temp<1){
            feel = locale.freezing
        }
        if(temp<14){
            feel = locale.cold
        }
        if(temp>20){
            feel = locale.mild
        }
        if(temp>28){
            feel = locale.hot
        }
        if(temp>36){
            feel = locale.extremelyhot
        }

        timedescription = `${locale.its} ${feel} `

        if(hour>13&&hour<18){
            timedescription += locale.afternoonin
        }
        if(hour>17&&hour<23){
            timedescription += locale.eveningin
        }
        if(hour>22||hour<6){
            timedescription += locale.nightin
        }
        if(hour==0&&hour==24){
            timedescription += locale.midnightin
        }

        timedescription += " " + info.city

        return '<img src="data:image/png;base64,'+info.image+'"><timed> '+locale.lastupdated+' ' + now + '</timed><w>' + info.temp.toString().slice(0, 2) + '°C ' + info.desc + "</w><p>" + timedescription +".</p>"
    }
    
    var weather = document.createElement("weather")
    if(response.weather){
        widgets.push(weather)
        weather.innerHTML = WeatherStyled(response.weather)
    }
    // weather.innerHTML = "<img src='temp/banner.jpeg'><w>Clear 26°C</w><p>It's a nice morning in Plovdiv</p>"

    if(element.classList[0]!="welcome"){
        var create = document.createElement("create")
        widgets.push(create)
        create.innerHTML = "<a><span class='m-i'>add</span> "+locale.createproject+"</a><a><span class='m-i'>file_open</span> "+locale.openproject+"</a>"
        var createbtns = create.getElementsByTagName('a')
        ButtonEvent(createbtns[1], function(){
            sidepanel.classList.add("sidepanelmoreactive")
            setTimeout(() => {
                sidepanel.classList.add("sidepanelmostactive")
            }, 300);
        })
        ButtonEvent(createbtns[0], function(){
            closeSidepanel()
            NewFileGui()
        })
    }

    var space = document.createElement("space")
    widgets.push(space)
    var sizes = getSizes()
    var apptakenInMB = (sizes.apptaken/1000000).toFixed(2)
    if(apptakenInMB[2]==0 && apptakenInMB[3]==0){
        apptakenInMB = apptakenInMB.split('.')[0]
    }
    space.innerHTML = apptakenInMB+" MB "+locale.usedof+" "+sizes.appmax/1000000+" MB"

    for (let i = 0; i < widgets.length; i++) {
        widgets[i].classList.add("widget")
        info.appendChild(widgets[i])
    }

    
    // sidepanel.classList.add("sidepanelmoreactive")

    var filesside = document.createElement("filesside")
    var filters = document.createElement("filters")
    var files = document.createElement("files")
    function FileFunction(sort, reverse){
        filters.innerHTML ="<div tabindex='0' class='sorts'><span class='op m-i'>sort</span><a>"+locale.openeddate+"</a><i class='m-i'>swap_horiz</i><div><p>"+locale.openeddate+"</p><p>"+locale.modifieddate+"</p><p>"+locale.alphabetically+"</p><p>"+locale.size+"</p></div></div>"+
            "<span class='o m-i'>grid_view</span>"+
            "<span class='o m-i'>view_headline</span>"
    
        var sorts = filters.getElementsByClassName("sorts")[0]
        var sorttext = sorts.getElementsByTagName("a")[0]
        var sortbtns = sorts.getElementsByTagName("p")
        switch (sort) {
            case 0:
                sorttext.innerText = locale.openeddate
                break;
            case 1:
                sorttext.innerText = locale.modifieddate
                break;
            case 2:
                sorttext.innerText = locale.alphabetically
                break;
            case 3:
                sorttext.innerText = locale.size
                break;
            default:
                break;
        }
        sortbtns[sort].classList.add("oselected")
        for (let i = 0; i < sortbtns.length; i++) {
            ButtonEvent(sortbtns[i], function(){
                if(reverse){
                    FileFunction(i, true)
                }
                else{
                    FileFunction(i, null)
                }
            })
        }
        
        var reversebtn = sorts.getElementsByTagName("i")[0]
        if(reverse){
            reversebtn.classList.add("oselected")
        }
        ButtonEvent(reversebtn, function(){
            if(reverse){
                FileFunction(sort, null)
            }
            else{
                FileFunction(sort, true)
            }
        })
    
        var fileviews = filters.getElementsByClassName("o")
        ButtonEvent(fileviews[0], function(){
            delete settings.lineview
            SaveSettings()
            fileviews[1].classList.remove("oselected")
            fileviews[0].classList.add("oselected")
            files.classList.remove("lineview")
        })
        ButtonEvent(fileviews[1], function(){
            settings.lineview = true
            SaveSettings()
            fileviews[0].classList.remove("oselected")
            fileviews[1].classList.add("oselected")
            files.classList.add("lineview")
        })
    
        if(settings.lineview){
            fileviews[1].click()
        }
        else{
            fileviews[0].classList.add("oselected")
        }
        var existing = CheckExisting()
    
        var filesButtons = []
    
        var lastFolderAnim = ""
        function FilesSort(folder){
            files.innerHTML = ""
            if(folder){
                var lastFolder = document.createElement("button")
                var folders = []
                if(folder.includes('/')){
                    folders = folder.split('/')
                }
                else{
                    folders.push(folder)
                }
                folders.unshift("Home")
                var lastFolderFolder = folders[folders.length-2]
                lastFolder.innerHTML = "<i class='m-i'>chevron_left</i> " + lastFolderFolder
                lastFolder.classList.add("folder")
                files.appendChild(lastFolder)
                var displayFolders = folders
                displayFolders.shift()
                lastFolder.outerHTML = "<div style='display: flex'>" + lastFolder.outerHTML + '<button class="currentfolder">'+displayFolders.join(' / ')+'</button></div>'
                lastFolder = files.getElementsByTagName("button")[0]
                ButtonEvent(lastFolder, function(){
                    if(lastFolderFolder=="Home"){
                        FilesSort()
                    }
                    else{
                        folders.pop()
                        folders = folders.join('/')
                        FilesSort(folders)
                    }
                })
                lastFolder.addEventListener("click", function(e){
                    e.stopPropagation();
                })
    
                var transition
                if(folder.includes(lastFolderAnim)){
                    transition = "filestransitionforward"
                }
                else{
                    transition = "filestransitionbackward"
                }
                files.classList.add(transition)
                setTimeout(() => {
                    files.classList.remove(transition)
                }, 0);
    
                lastFolderAnim = folder
            }
            filesButtons = []
            var foldersSet = []
    
            for(let i = 0; i < existing.length; i++){
                var parts = existing[i].split(":")
                var space = parts[0]
                var pathname = parts[1]
                pathname = pathname.split("*").slice(1).join('*')
                var path = pathname.split("*")[0]
                var name = pathname.split("*").slice(1).join('*')
    
                var displayName
                if(!folder){
                    if(path&&path.includes('/')){
                        path = path.split('/')[0]
                    }
                }
                else{
                    if(path){
                        displayName = path.split('/')
                        var lastFolder = folder
                        if(folder.includes("/")){
                            lastFolder = folder.split('/')
                            lastFolder = lastFolder.pop()
                        }
                        var index = path.split('/').indexOf(lastFolder)
                        displayName = displayName[index+1]
                    }
                }
    
                if(path&&foldersSet.includes(path)){}
                else{
                    // console.log(foldersSet)
                    if(path){
                        foldersSet.push(path)
                    }
                    if(folder){
                        if(path.includes(folder)){
                            // console.log(path)
                            if(!foldersSet.includes(displayName)){
                                foldersSet.push(displayName)
                                filesButtons.push({path, name, space})
                            }
                        }
                    }
                    else{
                        filesButtons.push({path, name, space})
                    }
                }
            }
    
            filesButtons.sort(function(a,b){
                const nameA = a.name.toUpperCase()
                const nameB = b.name.toUpperCase()
                if (nameA < nameB){
                    return 1
                }
                if (nameA > nameB){
                    return -1
                }
                return 0;
            })
    
            filesButtons.sort(function(a,b){ //idk if folers are sorted alphabetically?
                const folderA = a.path.toUpperCase()
                const folderB = b.path.toUpperCase()
                if (folderA < folderB){
                    return 1
                }
                if (folderA > folderB){
                    return -1
                }
                return 0;
            })
    
            //console.log(filesButtons)
            for(let i = 0; i < filesButtons.length; i++){
                function createButton(path, name, space){
                    var button = document.createElement("button")
                    if(path&&path!=folder){
                        var folderName = path
    
                        if(folderName.includes("/")){
                            var folderName = folderName.split("/")
                            var displayFolder = folder
                            if(displayFolder.includes("/")){
                                displayFolder = displayFolder.split("/")
                                displayFolder = displayFolder.pop()
                            }
                            if(folderName.includes(displayFolder)){
                                var index = folderName.indexOf(displayFolder)
                                folderName = folderName[index + 1]
                            }
                        }
                        // if(path.includes('/')){
                        //     folderName = path.split('/')[0]
                        // }
                        // if(!foldersSet.includes(folderName)){
                        //     foldersSet.push(folderName)
                            button.classList.add("folder")
                            button.innerHTML = "<i class='m-i'>folder</i> " + folderName
                        // }
                        // else{
                        //     console.log(path)
                        //     button.innerHTML = "duck"
                        //     button.remove()
                        // }
                    }
                    else{
                        button.innerHTML = name
                    }
                    ButtonEvent(button, function(){
                        if(WelcomeGuiinteractable){
                            if(path&&path!=folder){
                                FilesSort(path)
                            }
                            else{
                                LoadFile(space, path, name)
                                if(element.classList[0]=="welcome"){
                                    welcomeClose()
                                }
                                else{
                                    closeSidepanel()
                                    setTimeout(() => {
                                        closeSidepanel()
                                    }, 301);
                                }
                            }
                        }
                    })
                    button.addEventListener("click", function(e){
                        e.stopPropagation();
                    })
                    return button;
                }
    
                files.appendChild(createButton(filesButtons[i].path, filesButtons[i].name, filesButtons[i].space))
                
                if(!folder){
                    files.classList.add("filestransitionbackward")
                    setTimeout(() => {
                        files.classList.remove("filestransitionbackward")
                    }, 0);
                }
            }
        }
    
        FilesSort()
    
        var createnewbutton = document.createElement("button")
        createnewbutton.classList.add("folder")
        createnewbutton.innerHTML = "<i class='m-i'>add</i> " + locale.createnew
        ButtonEvent(createnewbutton, NewFileGui)
        files.appendChild(createnewbutton)
    }

    FileFunction(1)

    //finally load

    content.style.transform = "translateY(20px)"
    content.style.opacity = 0

    setTimeout(() => {
        content.style.transition = "initial"
        content.style.transform = "translateY(-20px)"
        content.style.removeProperty("overflow")
        setTimeout(() => {
            content.style.removeProperty("transition")
            content.style.removeProperty("transform")
            content.style.opacity = 1
            content.innerHTML = ""
            if(element.classList[0]=="welcome"){
                content.appendChild(closebtn)
            }
            content.appendChild(motd)
            content.appendChild(search)
            content.appendChild(info)
            filesside.appendChild(filters)
            filesside.appendChild(files)
            content.appendChild(filesside)
        }, 10)
    }, 300)
}



var storedResponse
var welcome = document.createElement("div")
function connectToMidelightTemporary(){
    if(!settings.ft){//This should be used the other way around, it's for "first time"
        welcome.classList.add("welcome")
    
        $.ajax({
            url: server + "app/startup.php",
            type: "post",
            //timeout: 1500,
            timeout: 2300,
            data: datalog,
            success: function (response) {
                try {
                    response = JSON.parse(response)
                } catch (error) {
                    WelcomeGui("error", welcome, [error, response])
                }
                storedResponse = response
                WelcomeGui(response, welcome)
            },
            error: function() {
                var response = {status:"offline"}
                storedResponse = response
                WelcomeGui(response, welcome)
            }
        })
    
    
        welcome.innerHTML = "<content><div class='onlineloaderspiny'><div class='onlineloader'></div></div></content>"
        welcome.getElementsByTagName("content")[0].style.overflow = "hidden"
    
        app.appendChild(welcome)
        setTimeout(() => {
            welcome.classList.add("welcometransitioned")
        }, 0);
    }
}

connectToMidelightTemporary()
























function Startup(){
    /**
     * Imported from WriteNote 2.0.0,
     * used to display a welcoming message!
     * @param {*} name User's username
     * Midnight Doesn't work on chrome but on safari!
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
            "<search><span class='m-i'>search</span><input placeholder='Search'></search>"+//im confusedm, does this element exist?
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
}