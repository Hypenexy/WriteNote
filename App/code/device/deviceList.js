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