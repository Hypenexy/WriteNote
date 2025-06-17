class AppBuilder {
    constructor() {
        writenote.workspaceData.save = () => {
        //    return canvas.toDataURL();
        }

        this.data = [
            {
                meta: {v: version}
            }
        ];

        this.data.push({ 
            element: "heading",
            id: "heading1",
            parent: "body",
            order: 0,
            text: "My new app"
        });
        this.data.push({ 
            element: "text",
            id: "sometext",
            parent: "body",
            order: 1,
            text: "Welcome to your new web app editor or a page creator, whatever you wanna call it."
        });
        
        this.workspace = document.createElement("div");
        writenote.workspaceData.element = this.workspace;
        this.workspace.classList.add("webapp");

        this.createExplorer();
        this.createPreview();
        this.createProperties();

        writenote.writenote.appendChild(this.workspace);
        this.render();
    }

    debugData() {
        return this.data;
    }

    createApp() {
        this.app = new Application();
        return this.app;
    }

    openInExternal(){
        var projectName = logonData.notes[activeNID].name;
        var wnd = window.open("about:blank", "", "_blank");
        // wnd.document.write(html);
        wnd.document.title = projectName;
        wnd.document.body.innerHTML = "nou";
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
            preview: "<input class='input'>"
        }
    }

    createExplorer(){
        const explorer = document.createElement("div");
        explorer.classList.add("explorer");
        this.workspace.appendChild(explorer);

        explorer.innerHTML = "<div class='title'>Elements</div>";
        
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
        this.preview = document.createElement("div");
        this.preview.classList.add("preview");
        this.workspace.appendChild(this.preview);
    }

    createProperties(){
        const properties = document.createElement("div");
        properties.classList.add("properties");
        this.workspace.appendChild(properties);

        properties.innerHTML = "<div class='title'>Properties</div>";
    }

    render(){
        this.preview.innerHTML = "";
        this.preview.style = "";

        this.data.sort((a, b) => {
            return a.order - b.order;
        });

        for (let i = 1; i < this.data.length; i++) {
            const data = this.data[i];
            
            const element = document.createElement("div");
            element.classList.add(data.element);

            element.setAttribute("eid", data.id); 

            element.textContent = data.text;

            this.preview.appendChild(element);

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

                    console.log(index);

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
        }
    }
}


// IDK how to use modules!!!
// Export the AppBuilder class
// export default AppBuilder;