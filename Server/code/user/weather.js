const mysql = require("./../databases/mysql");
const log = require("./../interface/log");
var apiKeys;
try {
    apiKeys = require('./APIKeys.json');
} catch{
    log("i", "Weather API keys are not set. Users won't recieve weather info.");
}
const fs = require("fs");

function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

const weatherFolder = "./assets/images/weather/compressed";
const filenames = fs.readdirSync(weatherFolder);

async function getWeatherImage(data) {
    var i = getRandomArbitrary(1, 74);
    return filenames[i];
}

async function getWeather(userIP, UID){
    if(!apiKeys){
        return;
    }
    var lat, lon;
    if(userIP){
        const ipServer = `https://api.ipinfo.io/lite/${userIP}?token=${apiKeys["ipinfo.token"]}`;
        const response = await fetch(ipServer)
        .catch((error) => {
            return false;
        });
        
        const geolocation = await response.json();// change ip location provider, maybe
        lat = geolocation.latitude;
        lon = geolocation.longitude;
        console.log("User location:", lat, lon);
        console.log("User geo:", geolocation);
    }
    else{
        lat = "42.1354";
        lon = "24.7453";
        // lat = "42.08393";
        // lon = "24.44551";
    }

    const cacheResult = await mysql.midelightDB.query(`SELECT WeatherData, Time FROM weatherlogs WHERE Latitude=${mysql.midelightDB.escape(lat)} AND Longitude=${mysql.midelightDB.escape(lon)} AND Time > ${mysql.midelightDB.escape(Date.now() - (1000 * 60 * 30))}`);

    if(cacheResult[0].length > 0){
        const weatherData = JSON.parse(cacheResult[0][0].WeatherData); // check if in array last one is the first or the last
        weatherData.lastUpdated = cacheResult[0][0].Time;
        // const imageRandom = getRandomArbitrary(1, 42);
        weatherData.image = await getWeatherImage();
        return weatherData;
    }

    const weatherServer = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=en&units=metric&APPID=${apiKeys["weather.api"]}`;

    const responseWeather = await fetch(weatherServer)
    .catch((error) => {
        log("f", "Failure fetching openweathermap data!");
        console.log(error);
        return false;
    })
    const weatherData = await responseWeather.json();
    
    if(weatherData.message == 'Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.'){
        log("f", "Invalid openweathermap key! Check (Server/code/user/APIKeys.json) (clicking it opens the .example for some reason)");
        return false;
    }

    await mysql.midelightDB.query(`
        INSERT INTO weatherlogs (Time, Temperature, WeatherData, Latitude, Longitude, UID, City)
        VALUES (
        ${mysql.midelightDB.escape(Date.now())},
        ${mysql.midelightDB.escape(weatherData.main.temp)},
        ${mysql.midelightDB.escape(JSON.stringify(weatherData))},
        ${mysql.midelightDB.escape(lat)},
        ${mysql.midelightDB.escape(lon)},
        ${mysql.midelightDB.escape(UID)},
        ${mysql.midelightDB.escape(weatherData.name)}
        );
    `);

    weatherData.lastUpdated = Date.now();
    // const imageRandom = getRandomArbitrary(1, 42 + 1);
    weatherData.image = await getWeatherImage();

    return weatherData;
}

module.exports.getWeather = getWeather;