function closeNote(NID){
    if(openNotes[NID].saved == false){
        const areYouSure = contextMenu();
    
        areYouSure.add("button", locale.options);
        
        areYouSure.append()
    }
}