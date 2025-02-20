const logoSVG = '<svg class="logo"width="1024"height="1024"xmlns="http://www.w3.org/2000/svg"><g><path stroke-width="0"d="m167.75,318.5c0,0 101.5,395.5 101.5,395.5c0,0 44.00284,0 44,0c0.00284,0 94,-316.5 94,-316.5c0,0 91.5,316.5 91.5,316.5c0,0 44.50281,0 44.5,0c0.00281,0 8.5,-32.5 8.5,-32.5c0,0 0,25.005 0,25c0,0.005 7,7 7,7c0,0 34.0147,0 34,0c0.0147,0 7,-7 7,-7c0,0 0,-213.5 0,-213.5c0,0 18,-68.5 18,-68.5c0,0 195,290 195,290c0,0 36.00347,0 36,0c0.00347,0 7.5,-8.5 7.5,-8.5c0,0 0,-388.50032 0,-389c0,0.49968 -7,-7 -7,-7c0,0 -33.00379,0 -33.5,0c0.49621,0 -6.5,7.5 -6.5,7.5c0,0 0,309.0004 0,309c0,0.0004 -176.5,-262 -176.5,-262c0,0 11.5,-45 11.5,-45c0,0 -6.5,-9.5 -6.5,-9.5c0,0 -77.50161,0 -78,0c0.49839,0 -7.5,7 -7.5,7c0,0 0,171.00073 0,171c0,0.00073 -33,136.5 -33,136.5c0,0 -91,-315 -91,-315c0,0 -42.5,0 -42.5,0c0,0 -91.5,313.5 -91.5,313.5c0,0 -77.5,-313 -77.5,-313c0,0 -41,0 -41,0c0,0 -8,8.5 -8,8.5z" stroke="#000" fill="#000000"/></g></svg>';

const logoElement = document.createElement("div");
logoElement.innerHTML = `${logoSVG}${logoSVG}<div class='waiting'></div>`;
logoElement.classList.add("loading");
app.appendChild(logoElement);

setTimeout(() => {
    if(online == false){
        logoElement.classList.add("waiting");
    }
}, 5000);

function logo_failedConnection(){
    logoElement.classList.add("errored", "waiting");
}

function logo_loadedConnection(){
    if(logoElement.classList.contains("waiting")){
        logoElement.classList.remove("errored", "waiting", "errorAttempt");
    }
    logoElement.classList.add("loaded");
}

function logo_errorAttempts(){
    logoElement.classList.add("errorAttempt");
}

function showRetryConnection(){ // Update this
    removeRetries();
    
    const element = document.createElement("div");
    element.classList.add("loadingRetry", "retryConnection");
    app.appendChild(element);

    const text = document.createElement("div");
    text.classList.add("motd");
    text.textContent = locale.no_connection;
    element.appendChild(text);

    const retryText = document.createElement("div");
    retryText.classList.add("retry");
    
    function displaySeconds(second){
        retryText.textContent = `${locale.attempt_reconnect} ${second} ${second == 1 ? locale.second : locale.seconds}`;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async function retryTimer(seconds){
        for (let i = 0; i < seconds; i++) {
            await sleep(1000);
            displaySeconds(30 - (i + 1));
        }
        socket.connect();
    }

    retryTimer(30);


    element.appendChild(retryText);
}