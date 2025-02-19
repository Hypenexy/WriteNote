/** 
 * WriteNote by Hypenexy, Midelight
 */
class WriteNote{
    /**
     * Initialize the writenote class
     * @param {JSON} options Possible options are linkEngine: string
     */
    constructor(options){
        this.notearea = document.createElement("div");
        this.notearea.classList.add("notearea");
        this.isEnabled = false;
        this.mediaData = {};
        this.workspaceData = {};
        this.writenote = document.createElement("div");
        this.writenote.classList.add("writenote");
        // this.features = document.createElement("features");
        this.lastSave;
        this.zoom = 1;
        // this.workspace = workspace; think about this
        this.linkEngine = options.linkEngine; // debug this being null or incorrect
        // this.parent;
        this.typeLoaded = false;

        // this.insertFile = this.insertFile.bind(this);

        // Init editor
        
        this.notearea.contentEditable = true;
        this.notearea.tabIndex = '0';
        this.enabled(false);

        this.writenote.appendChild(this.notearea);
        app.appendChild(this.writenote);
        
        // Select all
        function SelectAll(){
            window.getSelection().selectAllChildren(this.notearea);
            this.notearea.focus();
        }
        
        this.notearea.addEventListener('click', function (e){
            if(e.detail === 3){
                if(e.target.classList[0] == "notearea" || e.target.nodeName == "P"){
                    e.preventDefault();
                    SelectAll();
                }
            }
        });

        // First line in editor
        var initP = document.createElement("p");
        initP.innerHTML = "<br>";
        this.notearea.appendChild(initP);
        // this.lastSave = this.data();


    }

    
    enabled(isEnabled){
        this.isEnabled = isEnabled;
        if(isEnabled==true){
            this.notearea.classList.remove("disabled");
        }
        if(isEnabled==false){
            this.notearea.classList.add("disabled");
        }
    }

    backgroundColor(isEnabled){
        if(isEnabled == false){
            this.writenote.style.setProperty("background", "var(--main-bg)");
        }
        else{
            this.writenote.style.removeProperty("background");
        }
    }

    loadAnimation(){
        this.writenote.classList.add("loaded");
    }

    initLoad(){
        if(openedWindows["welcome"]){
            openedWindows["welcome"].close();
        }
        loadHeader();
        this.enabled(true);
    }

    setData(data, type){
        this.setWorkplace(data, type);
        if(this.workspaceData.type != "note"){
            return;
        }
        if(data){
            this.notearea.innerHTML = data;
        }
        else{
            this.notearea.innerHTML = "";
            var initP = document.createElement("p");
            initP.innerHTML = "<br>";
            this.notearea.appendChild(initP);
        }
        
        // if(this.workspaceData.type){
        //     delete this.workspaceData.type;
        //     this.setWorkplace(type);
        // }
        // this.workspaceData.type = type;
    }

    getData(){
        if(this.workspaceData.type != "note"){
            return this.workspaceData.state;
        }
        return this.notearea.innerHTML;
    }

    setWorkplace(data, type){
        if(this.workspaceData.type){
            if(this.workspaceData.element){
                this.backgroundColor(true);
                this.workspaceData.element.remove();
                // delete this.workspaceData.element;
            }
            this.workspaceData = {};
        }
        this.workspaceData.type = type;

        if(type == "web app"){
            this.loadWorkplace_Webapp();
        }
        if(type == "canvas"){
            this.loadWorkplace_Canvas(data);
        }
    }

    loadWorkplace_Webapp(){
        const workspace = document.createElement("div");
        this.workspaceData.element = workspace; 
        workspace.classList.add("webapp");

        const explorer = document.createElement("div");
        explorer.classList.add("explorer");
        workspace.appendChild(explorer)

        const preview = document.createElement("div");
        preview.classList.add("preview");
        workspace.appendChild(preview);

        this.writenote.appendChild(workspace);
    }

    
    loadWorkplace_Canvas(data){
        this.enabled(false);
        this.backgroundColor(false);

        const workspace = document.createElement("div");
        this.workspaceData.element = workspace; 
        workspace.classList.add("canvas");

        const tools = document.createElement("div");
        tools.classList.add("tools");
        workspace.appendChild(tools)

        const canvasContainer = document.createElement("div");
        canvasContainer.classList.add("canvasContainer");
        workspace.appendChild(canvasContainer);

        // const canvas = document.createElement("canvas");
        // canvasContainer.appendChild(canvas);
        InitializeCanvas(canvasContainer, data); // for multiple layers pass the conteiner

        this.writenote.appendChild(workspace);
    }
}