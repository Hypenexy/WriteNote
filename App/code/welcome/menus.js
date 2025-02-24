function createMOTD(name){
    const motd = document.createElement("div");
    motd.classList.add("motd");

    var now24 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false });
    var hour = parseInt(now24.slice(0, 2));
    var welcomeMessage = locale.goodmorning; // From 6 to 12
    if(hour>12&&hour<18){ // From 13:00 to 17:00
        welcomeMessage = locale.goodafternoon;
    }
    if(hour>17&&hour<23){ // From 18:00 to 22:00
        welcomeMessage = locale.goodevening;
    }
    if(hour>22||hour<6){ // From 23:00 to 5:00
        welcomeMessage = locale.goodnight;
    }
    if(hour==0||hour==24){ // At 00:00 midnight (24:00)
        welcomeMessage = locale.goodmidnight;
    }
    if(name){
        welcomeMessage += ", " + name;
    }

    motd.innerText = welcomeMessage;
    return motd;
}

function WeatherStyled(info){ // reconsider these 💫 cute names ✨
    const temperature = info.main.temp
    const altdesc = info.weather[0].description;
    const desc = info.weather[0].main;
    var Description = desc;
    if(desc=="Thunderstorm"){
        Description = locale.thunderstorm;
    }
    if(desc=="Drizzle"){
        Description = locale.rainy;
    }
    if(desc=="Rain"){
        Description = locale.rainy;
    }
    if(desc=="Snow"){
        Description = locale.snow;
    }
    if(desc=="Clouds"){
        Description = locale.cloudy;
    }
    if(altdesc=="clear sky"){
        Description = locale.clearsky;
    }
    if(altdesc=="few clouds"){
        Description = locale.fewclouds;
    }
    if(altdesc=="scattered clouds"){
        Description = locale.scatteredclouds;
    }
    if(altdesc=="very heavy rain"||altdesc=="extreme rain"||altdesc=="heavy intensity rain"){
        Description = locale.veryrain;
    }
    if(altdesc=="Rain and snow"||altdesc=="Light rain and snow"){
        Description = locale.snowrain;
    }
    if(desc=="Mist"){
        Description = locale.mist;
    }
    if(desc=="Haze"){
        Description = locale.haze;
    }
    
    var now24 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false });
    var hour = parseInt(now24.slice(0, 2));
    var timedescription = info.name;
    var temp = parseInt(temperature.toString().slice(0, 2));
    var feel = locale.feel;
    if(Math.floor(Math.random() * 4)==2){
        feel = locale.peaceful;
    }
    if(temp<1){
        feel = locale.freezing;
    }
    if(temp<14){
        feel = locale.cold;
    }
    if(temp>20){
        feel = locale.mild;
    }
    if(temp>28){
        feel = locale.hot;
    }
    if(temp>36){
        feel = locale.extremelyhot;
    }

    timedescription = `${locale.its} ${feel} `;

    if(hour<12&&hour>=6){ // From 6:00 to 12:00
        timedescription += locale.morningin;
    }
    if(hour==12){ // At 12:00
        timedescription += locale.noonin;
    }
    if(hour>12&&hour<18){ // From 13:00 to 17:00
        timedescription += locale.afternoonin;
    }
    if(hour>17&&hour<23){ // From 18:00 to 22:00
        timedescription += locale.eveningin;
    }
    if(hour>22||hour<6){ // From 23:00 to 5:00
        timedescription += locale.nightin;
    }
    if(hour==0&&hour==24){ // At midnight 0:00, 24:00
        timedescription += locale.midnightin;
    }

    timedescription += " " + info.name;

    const lastUpdated = new Date(info.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });

    return '<img src="'+WriteNoteServer+'/weather/'+info.image+'"><timed> '+locale.lastupdated+ ' ' + lastUpdated + '</timed><p>' + timedescription +'.</p><w>' + temperature.toString().split('.')[0] + "<span class='extra'>."+temperature.toString().split('.')[1]+"</span>" + '°C ' + Description + '</w>';
}

function createUserWeather(userData, weatherData){
    const halves = document.createElement("div");
    halves.classList.add("halves");

    const userHalf = document.createElement("div");
    userHalf.classList.add("userHalf");
    
    const bannerElement = createUserBannerElement();
    userHalf.appendChild(bannerElement);
    
    const justUser = mdutils.createAppendElement("justUser", userHalf);
    const pfpElement = document.createElement("img");
    pfpElement.src = getUserPfpURL(userData, pfpElement);
    justUser.appendChild(pfpElement);
    const userText = document.createElement("p");
    userText.textContent = userData.Username; // One day this will update too
    justUser.appendChild(userText);

    openProfileMenuBind(userHalf);

    // const justUser = userHalf.getElementsByClassName("justUser")[0];
    // attachTooltip(justUser, locale.view_profile);

    halves.appendChild(userHalf);

    if(weatherData){
        const weatherHalf = document.createElement("div");
        weatherHalf.classList.add("weatherHalf");
        weatherHalf.innerHTML = WeatherStyled(weatherData);
        halves.appendChild(weatherHalf);
    }

    return halves;
}