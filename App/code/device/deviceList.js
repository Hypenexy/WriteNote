var devicesList = {};
var devicesElements = [];

function createDeviceElement(element, DID){
    var deviceElement = mdutils.createAppendElement("device", element);
    if(DID){
        deviceElement.setAttribute("DID", DID);
    }
    draggableElement(deviceElement, null, {
        ghostElement: true,
        onDrop: (event) => {
            const target = event.target;

            var noteNid = mdutils.findElement(target, "[nid]");

            if(noteNid){
                var NID = noteNid.getAttribute("nid");
                if(DID){
                    socket.emit("devices", {
                        type: "openOn",
                        DID: DID,
                        NID: NID
                    }, () => {});
                }
                else{
                    openNote(NID, logonData.notes[NID]);
                }
            }
        }
    }); // so many posibilities, like drag to open note on specific device!!!
    
    var icon = document.createElement("i");
    icon.textContent = getOSIcon(DID);
    deviceElement.appendChild(icon);

    var text = document.createElement("span");
    text.textContent = getOS(DID);
    deviceElement.appendChild(text);
}

function addAllDevices(element){
    element.innerHTML = "";
    createDeviceElement(element);
    if(typeof devicesList != "object"){
        return;
    }
    var devicesKeys = Object.keys(devicesList);
    for (let i = 0; i < devicesKeys.length; i++) {
        const DID = devicesKeys[i];
        createDeviceElement(element, DID);
    }
}

function devicesElement(){
    const element = document.createElement("div");
    element.classList.add("deviceList");
    
    addAllDevices(element);

    devicesElements.push(element);
    return element;
    // getOSIcon(device);
}


function setDeviceList(devices){
    devicesList = devices;
    if(typeof logonData.devices != "object"){
        logonData.devices = {};
        devicesList = logonData.devices;
    }
    for (let i = 0; i < devicesElements.length; i++) {
        addAllDevices(devicesElements[i]);
    }
}

function addDeviceList(id, device){
    devicesList[id] = device;
    for (let i = 0; i < devicesElements.length; i++) {
        createDeviceElement(devicesElements[i], id);
    }
}

function removeDeviceList(id){
    delete devicesList[id];
    for (let i = 0; i < devicesElements.length; i++) {
        devicesElements[i].querySelector(`[DID=${id}]`).remove();
    }
}

function deviceOpenNote(NID){
    if(openNotesContain(NID)){
        // start collab
        
    }
}

socket.on("devices", (data) => {
    if(data.type == "join"){
        addDeviceList(data.content.id, data.content.device);
    }
    if(data.type == "leave"){
        removeDeviceList(data.content);
    }
    if(data.type == "openOn"){
        openNote(data.NID, logonData.notes[data.NID]);
    }
    if(data.type == "open"){

    }
    console.log(data);
});