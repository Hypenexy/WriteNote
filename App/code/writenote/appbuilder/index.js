class AppBuilder {
    constructor(content) {
        this.NID = activeNID;
        this.runningState = false;

        writenote.workspaceData.save = () => {
        //    return canvas.toDataURL();
        }

        this.overlay = document.createElement("div"),
        this.overlay.classList.add("overlay", "webapp");
        writenote.writenote.appendChild(this.overlay);

        this.data = [
            {
                meta: {v: version}
            }
        ];

        this.data.push({ 
            element: "heading",
            eid: "heading1",
            parent: "body",
            order: 0,
            text: "My new app"
        });
        this.data.push({ 
            element: "text",
            eid: "sometext2",
            parent: "body",
            order: 2,
            text: "Some other text bruh."
        });
        this.data.push({ 
            element: "text",
            eid: "sometext",
            parent: "body",
            order: 1,
            text: "Welcome to your new web app editor or a page creator, whatever you wanna call it."
        });
        
        this.workspace = document.createElement("div");
        writenote.workspaceData.element = this.workspace;
        this.workspace.classList.add("webapp");

        this.createActions();

        this.viewContainer = document.createElement("div"),
        this.viewContainer.classList.add("viewContainer");
        this.workspace.appendChild(this.viewContainer);
        
        this.createExplorer();
        this.createPreview();
        this.createProperties();

        writenote.writenote.appendChild(this.workspace);
        this.render();
        this.selectedElementId = "body";

        this.preview.addEventListener("click", (e)=>{
            if(e.target == this.preview){
                this.selectElement();
            }
        });
    }

    debugData() {
        return this.data;
    }

    createApp() {
        this.app = new Application();
        return this.app;
    }

    loadCSSFile(DOM, href){
        var ref = document.createElement("link");
        ref.rel = "stylesheet";
        ref.type = "text/css";
        ref.href = href;
        // ref.classList.add(`theme${theme}`);
        DOM.getElementsByTagName("head")[0].appendChild(ref);
    }

    openInExternal(){
        var projectName = logonData.notes[this.NID].name;
        var wnd = window.open("about:blank", "", "_blank");
        // wnd.document.write(html);
        wnd.document.title = projectName;
        // wnd.document.body.innerHTML = "nou";

        this.loadCSSFile(wnd.document, "./");
        
        for (let i = 1; i < this.data.length; i++) {
            const data = this.data[i];
            
            const element = this.createElement(data);
            wnd.document.body.appendChild(element);
        }
    }

    elements = {
        heading: {
            preview: "<h1>Heading</h1>"
        },
        text: {
            preview: "<p>Text</p>"
        },
        button: {
            preview: "<div class='button'>Button</div>"
        },
        input: {
            preview: "<input placeholder='Input' class='input'>"
        }
    }

    bodyProperties = {
        name: "String",
        version: "String",
    }

    savedStatus(saved){
        if(saved){
            openNotes[activeNID].saved = true;
            changeHeaderNote(activeNID, {type: "saveChange"});
        }
        if(openNotes[activeNID].saved == true){
            openNotes[activeNID].saved = false;
            changeHeaderNote(activeNID, {type: "saveChange"});
        }
    }

    createExplorer(){
        const explorer = document.createElement("div");
        explorer.classList.add("explorer");
        this.viewContainer.appendChild(explorer);

        explorer.innerHTML = `<div class='title'>${locale.elements}</div>`;
        
        Object.keys(this.elements).forEach(info => {
            var element = document.createElement("div");
            element.innerHTML = this.elements[info].preview;
            element.classList.add("elementPreview");
            explorer.appendChild(element);

            draggableElement(element, null, {
                ghostElement: true,
                onDrop: (event) => {
                    // const target = event.target;

                    // var noteNid = mdutils.findElement(target, "[nid]");

                    // if(noteNid){
                    //     var NID = noteNid.getAttribute("nid");
                    //     if(DID){
                    //         socket.emit("devices", {
                    //             type: "openOn",
                    //             DID: DID,
                    //             NID: NID
                    //         }, () => {});
                    //     }
                    //     else{
                    //         openNote(NID, logonData.notes[NID]);
                    //     }
                    // }
                }
            });
        });
    }

    createPreview(){
        this.viewport = document.createElement("div");
        this.viewport.classList.add("viewport");
        this.viewContainer.appendChild(this.viewport);

        const zoompan = document.createElement("div");
        zoompan.classList.add("zoompan");
        this.viewport.appendChild(zoompan);

        
        this.preview = document.createElement("div");
        this.preview.classList.add("preview");
        zoompan.appendChild(this.preview);
        panzoom(zoompan, {
            maxZoom: 2,
            minZoom: 0.5,
            initialX: 300,
            initialY: 500,
            initialZoom: 1,
            contain: 'inside',

            beforeMouseDown: function(e) {
                var shouldIgnore = !e.ctrlKey;
                return shouldIgnore;
            },
            beforeWheel: function(e) {
                var shouldIgnore = !e.ctrlKey;
                return shouldIgnore;
            },
            zoomSpeed: 1,
            zoomDoubleClickSpeed: 1,
        });
    }

    createActions(){
        const actions = document.createElement("div");
        actions.classList.add("actions");
        this.workspace.appendChild(actions);

        actions.innerHTML = `<div class='title'>${locale.actions}</div>`;

        var button_icons = ["play_arrow", "open_in_new"];
        var button_locales = ["run", "run_in_external"];
        var button_actions = ["runStop", "openInExternal"];

        for (let i = 0; i < button_icons.length; i++) {
            const icon = button_icons[i];
            const element = document.createElement("i");
            element.classList.add("button");
            element.textContent = icon;
            attachTooltip(element, locale[button_locales[i]], true);
            // mdutils.ButtonEvent(element, button_actions[i]);
            element.addEventListener("click", () => this[button_actions[i]]());
            actions.appendChild(element);
        }

        this.playButton = actions.querySelector(".button");
        this.playButton.classList.add("play");
    }

    createProperties(){
        const properties = document.createElement("div");
        properties.classList.add("properties");
        this.viewContainer.appendChild(properties);

        properties.innerHTML = `<div class='title'>${locale.properties}</div>`;
    }

    setProperties(){
        
    }

    selectElement(element){
        if(this.selectedElementId != "body"){
            this.preview.querySelector(`[eid="${this.selectedElementId}"]`).classList.remove("selected");
        }
        if(!element){
            this.selectedElementId = "body";
            return;
        }
        this.selectedElementId = element.getAttribute("eid");
        element.classList.add("selected");
    }

    editText(element){
        const EID = element.getAttribute("eid");
        var input = document.createElement("input");
        input.classList.add("input");
        this.overlay.appendChild(input);
        element.contentEditable = true;

        var data = this.data.find(element => element.eid == EID);
        var rect = element.getBoundingClientRect();

        input.value = data.text;
        input.style.top = rect.top + "px";
        input.style.left = rect.left + "px";
        input.style.width = rect.width + "px";
        input.style.height = rect.height + "px";

        this.overlay.appendChild(input);
        input.focus();
        
        function finishWriting(){
            data.text = input.value;
            element.textContent = input.value;
            input.remove();
        }

        input.addEventListener("keydown", (e) => {
            if(e.key == "Enter"){
                finishWriting();
            }
        });
        document.addEventListener("click", () => {
            finishWriting();
        }, {once: true});
    }
    running(status){
        if(status == true){
            this.playButton.classList.add("stop");
            this.playButton.textContent = "stop";
        }
        else{
            this.playButton.classList.remove("stop");
            this.playButton.textContent = "play_arrow";
        }
    }

    runStop(){
        if(this.runningState == false){
            this.runningState = true;
            this.render(true);
        }
        else{
            this.runningState = false;
            this.render();
        }
    }

    createElement(data){
        const element = document.createElement("div");
        element.classList.add(data.element);

        element.setAttribute("eid", data.eid); 

        element.textContent = data.text;

        return element;
    }

    render(run){
        this.running(run);

        if(!run){
            this.preview.classList.add("editor");
        }
        else{
            this.preview.classList.remove("editor");
        }
        this.preview.innerHTML = "";
        this.preview.style = "";

        this.data.sort((a, b) => {
            return a.order - b.order;
        });

        for (let i = 1; i < this.data.length; i++) {
            const data = this.data[i];
            
            const element = this.createElement(data);

            this.preview.appendChild(element);

            if(!run){
                draggableElement(element, null, {
                    ghostElement: true,
                    onDrop: (event) => {
                        const Y = event.y;
                        const allYCoords = [];

                        var allElements = this.preview.querySelectorAll("*");
                        for (let i = 0; i < allElements.length; i++) {
                            const allElement = allElements[i];
                            if(allElement === element){
                                continue;
                            }
                            var rect = allElement.getBoundingClientRect();
                            allYCoords.push(rect.y + rect.height/2);
                        }

                        var index = allYCoords.findIndex(n => n > Y);
                        if (index === -1) {
                            index = allYCoords.length;
                        }

                        if(index === data.order){
                            return;
                        }

                        var inbetween = this.data.filter(a => 
                            typeof a.order === "number" &&
                            (
                                (a.order > data.order && a.order <= index) ||
                                (a.order < data.order && a.order >= index)
                            )
                        );

                        if(index > data.order){
                            data.order = index;
                            inbetween.forEach(element => {
                                element.order--;
                            });
                        }
                        if(index < data.order){
                            data.order = index;
                            inbetween.forEach(element => {
                                element.order++;
                            });
                        }

                        this.savedStatus(false);
                        this.render();
                        // varthis.data.filter(a => typeof a.order === "number" && a.order > index);


                        // const target = event.target;

                        // var noteNid = mdutils.findElement(target, "[nid]");

                        // if(noteNid){
                        //     var NID = noteNid.getAttribute("nid");
                        //     if(DID){
                        //         socket.emit("devices", {
                        //             type: "openOn",
                        //             DID: DID,
                        //             NID: NID
                        //         }, () => {});
                        //     }
                        //     else{
                        //         openNote(NID, logonData.notes[NID]);
                        //     }
                        // }
                    }
                });

                // Context menu

                const elementContextMenu = contextMenu();
    
                elementContextMenu.add("line");
                
                elementContextMenu.add("button", locale["type"], {
                    "action": () => {
                        setSort(type);
                    },
                    "icon": sortsInfo.icons[i]
                });
                
            
                elementContextMenu.add("line", locale.options);

                elementContextMenu.attach(element);


                // Selecting
                
                element.addEventListener("click", () => {
                    this.selectElement(element);
                });
                
                element.addEventListener("dblclick", () => {
                    this.editText(element);
                });
            }
        }
    }
}


// IDK how to use modules!!!
// Export the AppBuilder class
// export default AppBuilder;