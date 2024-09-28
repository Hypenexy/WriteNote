const log = require('./../interface/log');
const fs = require('fs');

const weather_assetsDir = "./assets/images/weather/";

fs.readdir(weather_assetsDir, (err, list) => {
    list.shift();
    list.pop();
    list.sort(
        (a, b) => a.substring(0, a.length - 4) - b.substring(0, b.length - 4)
    );
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        weatherAssets.push(fs.readFileSync(`${weather_assetsDir}${element}`));
    }
});

const weatherAssets = [];

function getWeatherImage(headers, req, res){
    const imageID = req.url.substring(9, req.url.length - 4);
    
    headers["Content-Type"] = "image/jpeg";
    res.writeHead(200, headers);
    res.end(weatherAssets[imageID]);
}

module.exports.getWeatherImage = getWeatherImage;


const ui_assetsDir = "./assets/images/ui/";
const uiAssets = {};

fs.readdir(ui_assetsDir, (err, list) => {
    for (let i = 0; i < list.length; i++) {
        uiAssets[list[i]] = fs.readFileSync(`${ui_assetsDir}${list[i]}`);
    }
});

function fileExtensionToHeaders(filename){
    if(filename.endsWith(".png")){
        return "image/png";
    }
    if(filename.endsWith(".jpg") || filename.endsWith(".jpeg")){
        return "image/jpeg";
    }
    return "";
}

function getUIImage(headers, req, res){
    const filename = req.url.substring(4);
    if(!Object.keys(uiAssets).includes(filename)){
        res.writeHead(404, headers);
        res.end("Not found :("); // Make a 404
        return;
    }
    headers["Content-Type"] = fileExtensionToHeaders(filename);
    res.writeHead(200, headers);
    res.end(uiAssets[filename]);
}

module.exports.getUIImage = getUIImage;

log('s', "Assets loaded");