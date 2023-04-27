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

    if(firstTime==true){
        var firstTimeSetup = document.createElement("div")
        firstTimeSetup.classList.add("firstTimeSetup")
        var mdblock = document.createElement("div")
        mdblock.classList.add("mdblock")
        mdblock.classList.add("relative")
        var welcomeTo = locale.welcomeTo.split("\n")
        var boldText = welcomeTo[1].slice(0, welcomeTo[1].length-1)
        mdblock.innerHTML = "<h1>"+welcomeTo[0]+"<b class='nw'>"+boldText+"<ub>"+welcomeTo[1][welcomeTo[1].length-1]+"</ub></b></h1><p>"+locale.welcomeToSubtext+"</p>"
        // <btns><btn class='skip'>"+locale.continueWithout+"</btn><btn class='continue'>"+locale.continueDownload+"</btn><btn class='continue'>"+locale.continueAcc+"</btn></btns>
        var btns = document.createElement("btns")
        function nextPage(i, lastmdblock){
            var mdblock2 = document.createElement("div")
            mdblock2.classList.add("transitionRight")
            mdblock2.classList.add("mdblock")
            mdblock2.classList.add("relative")
            if(i==0){ // Benefits menu
                mdblock2.innerHTML = "<div class='compare'>"+
                "<div><h2>Limited</h2><fe>• Most WriteNote features</fe><fe>4 Mb of browser storage</fe><btn>Continue</btn></div>"+
                "<div><h2>Download</h2><fe>• More WriteNote features<br>• Available offline<br>• Faster load times</fe><fe>As much as your device has</fe><btn>Download</btn></div>"+
                "<div><h2>Sign Up</h2><fe>• More WriteNote features<br>• Share & collaborate with anyone<br>• Access from any device</fe><fe>2 Gb of free cloud storage</fe><btn>Sign Up</btn></div>"+
                "</div>"
                var btns = mdblock2.getElementsByTagName("btn")
                for (let i = 0; i < btns.length; i++) {
                    const element = btns[i];
                    if(i==1){
                        element.addEventListener("auxclick", openDownload)
                    }
                    ButtonEvent(element, function(){
                        if(i==0){
                            nextPage(5, mdblock2)
                        }
                        if(i==1){
                            openDownload()
                        }
                    })
                }
            }
            if(i==2){
                mdblock2.innerHTML = "<form><h1><img src='"+serverAddress+"mide.png'><c>Midelight</c></h1>"+
                "<h1>"+locale.signIn+"</h1>"+
                "<label><f>Username</f><input name='username'></label>"+
                "<label><f>Password</f><input name='password' type='password'></label>"+
                "<label><btn>"+locale.signIn+"</btn></label>"+
                "</form>"

                var form = mdblock2.getElementsByTagName("form")[0]
                var submitBtn = form.getElementsByTagName("btn")[0]
                ButtonEvent(submitBtn, console.log, 'hii :3')
            }
            if(i==4 || i==5){
                if(i==5){
                    mdblock2.innerHTML = "<p class='err'>Warning, you only have 4 Mb of storage and can be easily lost if your browser deletes its' site data.</p>"
                }
                mdblock2.innerHTML += "<h1>"+locale.customize+"</h1>"+
                "<h2>Theme</h2>"+ // hover to preview
                
                "<h2>Language</h2>"+
                "<h2>Narrator</h2>"

                var btns = document.createElement("btns")
                
                
            }
            firstTimeSetup.appendChild(mdblock2)
            if(lastmdblock){
                lastmdblock.classList.add("transitionLeft")
            }
            else{
                mdblock.classList.add("transitionLeft")
            }
            setTimeout(() => {
                mdblock2.classList.remove("transitionRight")
            }, 10);
        }
        function openDownload(){
            window.open(serverAddress+'WriteNote/download/', '_blank').focus()
        }
        var btnsLocales = [locale.continueWithout, locale.continueDownload, locale.continueAcc]
        for (let i = 0; i < btnsLocales.length; i++) {
            const btnlocale = btnsLocales[i]
            const element = document.createElement("btn")
            element.innerText = btnlocale
            if(i==0){
                element.classList.add("skip")
            }
            if(i==1){
                element.addEventListener("auxclick", openDownload)
            }
            ButtonEvent(element, function(){
                if(i==1){
                    openDownload()
                }
                else{
                    nextPage(i)
                }
            })
            if(i==0 && isApp==true){
                element.innerText = locale.continueWithoutAcc
            }
            if(i==1 && isApp==true){
                continue
            }
            btns.appendChild(element)
        }
        mdblock.appendChild(btns)
        firstTimeSetup.appendChild(mdblock)
        element.appendChild(firstTimeSetup)
        firstTimeSetup.style.transform = "translateY(20px)"
        firstTimeSetup.style.opacity = 0
        setTimeout(() => {
            firstTimeSetup.style.removeProperty("transition")
            firstTimeSetup.style.removeProperty("transform")
            firstTimeSetup.style.opacity = 1
        }, 10)
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
            account.innerHTML = "<img src='"+serverImage+"?s=128&i="+response.user.pfp+"'><name>"+response.user.username+"</name><bio>the world is beautiful by your side</bio><img src='"+serverImage+"?i="+response.user.banner+"'>"
            mobileHeaderMenu.prepend(account)
            mobileHeaderMenu.prepend(mobileHeaderMenu.getElementsByTagName("h1")[0])
            var banner = account.getElementsByTagName("img")[1]
            banner.onload = function(){
                console.log(getAverageRGB(banner)) //think of something better
            }
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
    search.innerHTML = "<i>search</i>"
    search.appendChild(searchinput)

    var info = document.createElement("info")
    var widgets = []

    var account = document.createElement("account")
    widgets.push(account)
    if(response.status!='offline'){
        if(response.user!=false){
            account.innerHTML = "<img src='"+serverImage+"?s=64&i="+response.user.pfp+"'>"+response.user.username+"<a tabindex='0'>"+locale.switchacc+"</a>"
            account.style = "text-shadow: 1px 1px 3px #000;background-position:center;background-size:cover;background-image:url("+serverImage+"?&i="+response.user.banner+")"
            ButtonEvent(account.getElementsByTagName("a")[0], function(){
                 //do ur account switching
            })
        }
        else{
            account.innerHTML = "You're not logged in. <a>Login</a><a>Register</a>"
            ButtonEvent(account.getElementsByTagName("a")[0], function(){
                loadCSS(serverAddress + "img/styles/forms.css")
                loadScript(serverAddress + "login/login.js", "loginscript", function(){
                    showlogin()
                    var xbtn = login.getElementsByTagName("span")[0]
                    xbtn.opacity = 1
                    ButtonEvent(xbtn, hidelogin)
                })
            })
            ButtonEvent(account.getElementsByTagName("a")[1], function(){
                loadCSS(serverAddress + "img/styles/forms.css")
                loadScript(serverAddress + "register/register.js.php", "registerscript", function(){
                    showlogin()
                    var xbtn = login.getElementsByTagName("span")[0]
                    xbtn.opacity = 1
                    ButtonEvent(xbtn, hidelogin)
                })
            })
            // ButtonEvent(account.getElementsByTagName("a")[0], function(){
            //     loadCSS(serverAddress + "styles/forms.css")
            //     loadScript(serverAddress + "login/login.js", "registerscript", function(){
            //         showlogin()
            //         var xbtn = login.getElementsByTagName("span")[0]
            //         xbtn.opacity = 1
            //         ButtonEvent(xbtn, hidelogin)
            //     })
            // })
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

        if(hour<12&&hour>=6){
            timedescription += locale.morningin
        }
        if(hour==12){
            timedescription += locale.noonin
        }
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

        return '<img src="'+serverAddress+'weather/images/'+info.image+'.jpg"><timed> '+locale.lastupdated+' ' + now + '</timed><w>' + info.temp.toString().slice(0, 2) + '°C ' + info.desc + "</w><p>" + timedescription +".</p>"
    }
    // STOP USING FLEX IT BLURS IMAGES WAY TOO MUCH
    var weather = document.createElement("weather")
    if(response.weather){
        widgets.push(weather)
        weather.innerHTML = WeatherStyled(response.weather)
        var imgElement = weather.getElementsByTagName("img")[0]
        imgElement.addEventListener("load", function(){
            // Doesn't work if image is on different domain
            var aRGB = getAverageRGB(imgElement)
            console.log(contrast([aRGB.r, aRGB.g, aRGB.b], [34, 34, 34]))
            weather.getElementsByTagName("w")[0].style.color = `rgb(${aRGB.r}, ${aRGB.g}, ${aRGB.b})`
        })
    }

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
    function FileFunction(sort, reverse, folder){
        filters.innerHTML ="<div tabindex='0' class='sorts'><span class='op m-i'>sort</span><a>"+locale.openeddate+"</a><i>swap_horiz</i><div><p>"+locale.openeddate+"</p><p>"+locale.modifieddate+"</p><p>"+locale.alphabetically+"</p><p>"+locale.size+"</p></div></div>"+
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
                lastFolder.innerHTML = "<i>chevron_left</i> " + lastFolderFolder
                lastFolder.classList.add("folder")
                files.appendChild(lastFolder)
                var displayFolders = folders
                displayFolders.shift()
                lastFolder.outerHTML = "<div style='display: flex;flex-basis: 100%;'>" + lastFolder.outerHTML + '<button class="currentfolder">'+displayFolders.join(' / ')+'</button></div>'
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
                    e.stopPropagation()
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

            if(!reverse){
                filesButtons.reverse()
            }
    
            filesButtons.sort(function(a,b){ //idk if folers are sorted alphabetically? They are not
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
                            button.innerHTML = "<i>folder</i> " + folderName
                        // }
                        // else{
                        //     console.log(path)
                        //     button.innerHTML = "duck"
                        //     button.remove()
                        // }
                    }
                    else{
                        var where
                        switch (space) {
                            case "localstorage":
                                where = '<ic><i class="m-i">web</i><t>App</t></ic>'
                                break;
                        
                            default:
                                break;
                        }
                        var type = '<ty><i class="m-i">description</i></ty>' // I NEED A WAY TO GET WORKPLACE AND SIZE!
                        var bytes = '<si>' + humanFileSize(210) + '</si>'
                        button.innerHTML = where + type + "<ti>" + name + "</ti>" + "<co>" + "some 20 chars here from the fil..." + "</co>" + bytes + "<i class='more m-i'>more_vert</i>"
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
                    function ButtonContextMenu(e){
                        if(e){
                            var show = showContext()

                            if(e.left){
                                contextMenu.style.top = e.top + 20 + "px"
                                contextMenu.style.left = e.left + 20 + "px"
                            }
                            else{
                                contextMenu.style.top = e.clientY + "px"
                                contextMenu.style.left = e.clientX + "px"
                            }
                            if(path&&path!=folder){
                                contextMenu.innerHTML = '<input value="'+path+'">'+
                                "<de>Actions</de>"+
                                "<p><i>delete</i> Delete</p>"+
                                "<de>Properties</de>"+
                                "<p>edited: today</p>"+
                                "<p>size: chonk</p>" //get the combined sizes of the things inside
                            }
                            else{
                                contextMenu.innerHTML = '<input value="'+name+'" placeholder='+name+'>'+
                                "<de>Actions</de>"+
                                "<p><i>share</i> Share</p>"+
                                "<p><i>content_copy</i> Duplicate</p>"+
                                "<p><i>delete</i> Delete</p>"+
                                "<de>Properties</de>"+
                                "<pr><i>calendar_month</i> 2 minutes ago</pr>"+
                                "<pr><i>save</i> 210 B</pr>"
                                var renameInput = contextMenu.getElementsByTagName("input")[0]
                                renameInput.addEventListener("change", function(){
                                    var renameResult = Rename(path, name, space, this.value)
                                    if(renameResult=='all good'){
                                        FileFunction(sort, reverse, folder)
                                    }
                                    else{
                                        PushNotification("Couldn't change the name", renameResult)
                                    }
                                })
                            }

                            show()
                        }
                    }
                    if(path&&path!=folder){}
                    else{
                        var moreIcon = button.getElementsByClassName("more")[0]
                        ButtonEvent(moreIcon, function(e){
                            e.stopPropagation()
                            var offset = moreIcon.getBoundingClientRect()
                            var elementPos = {left:offset.left, top:offset.top}
                            ButtonContextMenu(elementPos)
                        }, null, true)
                    }
                    button.addEventListener("click", function(e){
                        e.stopPropagation()
                    })
                    button.addEventListener("contextmenu", function(e){
                        e.preventDefault()
                        ButtonContextMenu(e)
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
            if(!folder){
                var createnewbutton = document.createElement("button")
                createnewbutton.classList.add("folder")
                createnewbutton.innerHTML = "<i>add</i> " + locale.createnew
                ButtonEvent(createnewbutton, NewFileGui)
                files.appendChild(createnewbutton)
            }
        }

        FilesSort(folder)
    }

    FileFunction(1)

    files.onmousemove = e => {
        for(const button of document.getElementsByTagName("button")) {
            const rect = button.getBoundingClientRect(),
                x = e.clientX - rect.left,
                y = e.clientY - rect.top;
    
            button.style.setProperty("--mouse-x", `${x}px`);
            button.style.setProperty("--mouse-y", `${y}px`);
        };
    }
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
            var InfoFileside = document.createElement("InfoFileside")
            InfoFileside.appendChild(info)
            filesside.appendChild(filters)
            filesside.appendChild(files)
            InfoFileside.appendChild(filesside)
            content.appendChild(InfoFileside)
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