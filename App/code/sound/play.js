function loadSound(URL, soundID){

}

/**
 * Play a sound
 * @param {String} URL Link to the audio file 
 * @param {Int} volume Volume from 0 (0%) to 1 (100%)
 */
function playSound(URL, volume) {
    // if(interacted==true){
        const audio = new Audio(URL);
        if(volume){
            audio.volume = volume;
        }
        audio.play();
    // }
}