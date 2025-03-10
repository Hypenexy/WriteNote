function getOS(DID, deviceReference){
    if(deviceReference){
        return deviceReference.OS.name + " " + deviceReference.OS.version;
    }
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
function getOSIcon(DID, deviceReference){
    var icon = "computer",
        target = device.Device;

    if(deviceReference){
        target = deviceReference;
    }
    
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