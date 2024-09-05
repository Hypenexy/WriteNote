function getUserPfpURL(userData){
    var pfpURL = WriteNoteServer+"/ui/pfp.png";
    if(userData.Avatar){
        pfpURL = imageServer+"?i="+userData.Avatar;
    }
    return pfpURL;
}