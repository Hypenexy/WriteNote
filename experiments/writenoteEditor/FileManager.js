class FileManager{
    constructor(workspace, linkEngine){
        this.notearea = document.createElement("notearea")
        this.writenote = document.createElement("writenote")
        this.features = document.createElement("features")
        this.lastSave
        this.zoom = 1
        this.workspace = workspace
        this.linkEngine = linkEngine
        this.parent
    }

    init(parent){

    }
}