function showWelcome(options){
    const element = createWindow("welcome");
    element.innerHTML = logoSVG;

    // Unlogged check and screen
    if(typeof options == "number" && options == -1){
        element.classList.add("register");

        const registerElement = createRegisterMenu();
        element.appendChild(registerElement);

        const sideDecorationElement = sideDecoration();
        element.appendChild(sideDecorationElement);
    
        return;
    }

    element.appendChild(createMOTD(options.user.Username));
    
    element.appendChild(createUserWeather(options.user, options.weather));

    console.log(options);
}

function sideDecoration(){
    const element = document.createElement("div");
    element.classList.add("sideDecoration");
    
    // const fill = document.createElement("div");
    // fill.classList.add("fill");
    // element.appendChild(fill);
    
    const line = document.createElement("div");
    line.classList.add("line");

    const wavyLine = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 920">
    <defs>
        <linearGradient id="sunset" x2="1" y2="1">
            <stop offset="0%" stop-color="rgb(198,100,227)" />
            <stop offset="100%" stop-color="rgb(0,153,255)" />
        </linearGradient>
    </defs>
    <path fill="#0099ff" fill-opacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,600L1440,600L1392,600C1344,600,1248,600,1152,600C1056,600,960,600,864,600C768,600,672,600,576,600C480,600,384,600,288,600C192,600,96,600,48,600L0,600Z"></path>
    </svg>`;

    line.innerHTML = `${wavyLine}${wavyLine}${wavyLine}${wavyLine}${wavyLine}${wavyLine}${wavyLine}`//${rectangle}`;
    element.appendChild(line);

    return element;
}

