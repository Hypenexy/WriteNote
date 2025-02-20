socket.on("notesInfo", (response) => {
    console.log(response);
    if(response.type == "createdNote"){
        addToNoteList(response.data);
    }
});