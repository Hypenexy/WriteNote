const devicesList = {};

function devicesElement(){
    const element = document.createElement("div");
    element.classList.add("deviceList");

    function createDeviceElement(DID){
        var deviceElement = mdutils.createAppendElement("device", element);
        
        var icon = document.createElement("i");
        icon.textContent = getOSIcon(DID);
        deviceElement.appendChild(icon);

        var text = document.createElement("span");
        text.textContent = getOS(DID);
        deviceElement.appendChild(text);
    }
    
    createDeviceElement();
    
    var devicesKeys = Object.keys(devicesList);
    for (let i = 0; i < devicesKeys.length; i++) {
        const DID = devicesKeys[i];
        createDeviceElement(DID);
    }

    return element;
    // getOSIcon(device);
}

socket.on("deviceInfo", (response) => {
    console.log(response);
});


function getOS(DID){
    if(DID){
        if(devicesList[DID] && devicesList[DID].device){
            return devicesList[DID].device.OS.name + " " + devicesList[DID].device.OS.version;
        }
        else{
            return "No system information";
        }
    }
    else{
        return device.OS.name + " " + device.OS.version + " • " + locale.you;
    }
}
function getOSIcon(DID){
    var icon = "computer",
        target = device.Device;
    
    if(DID){
        if(devicesList[DID] && devicesList[DID].device){
            target = devicesList[DID].device.Device;
        }
    }

    if(target.type == "mobile"){
        icon = "smartphone";
    }
    if(target.model == "iPhone"){
        icon = "phone_iphone";
    }
    if(target.model == "android"){
        icon = "phone_android";
    }
    
    return icon;
}