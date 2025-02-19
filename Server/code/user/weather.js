const mysql = require("./../databases/mysql");
const apiKeys = require('./APIKeys.json');
const fs = require("fs");

function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

const weatherFolder = "./assets/images/weather";
const filenames = fs.readdirSync(weatherFolder);

async function getWeatherImage(data) {
    var i = getRandomArbitrary(0, 74);
    return filenames[i];
}

async function getWeather(userIP, UID){
    var lat, lon;
    if(userIP){
        const ipServer = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKeys["geo.api"]}&ip=${userIP}`;
        const response = await fetch(ipServer)
        .catch((error) => {
            return false;
        });
        
        const geolocation = await response.json();// change ip location provider, maybe
        lat = geolocation.latitude;
        lon = geolocation.longitude;
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
        return false;
    })
    const weatherData = await responseWeather.json();

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