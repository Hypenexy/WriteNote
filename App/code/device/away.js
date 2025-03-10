var awayAltTab_interval,
    clickInterval;

document.addEventListener("visibilitychange", function(){
    awayAltTab_interval.clearInterval();
    if(document.visibilityState !== "visible"){
        awayAltTab_interval = setTimeout(() => {
            // set away status
        }, 2 * 60 * 1000);
    }
});