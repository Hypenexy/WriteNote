// const notesList = {}; using logonData.notes instead
const notesListElement = document.createElement("div");

function createNotesListElement(){
    // const element = document.createElement("div");
    const element = notesListElement;

    var NIDs = Object.keys(logonData.notes);
    for (let i = 0; i < NIDs.length; i++) {
        const data = logonData.notes[NIDs[i]];
        createNoteElement(data);
    }


    element.appendChild(createNewButton());

    return element;
}

function createNoteElement(data){
    const element = document.createElement("div");
    element.classList.add("button");

    element.textContent = data.name;

    notesListElement.appendChild(element);
}

function addToNoteList(data){
    logonData.notes[data]
}

function removeFromNoteList(data){

}

// function add remove change
