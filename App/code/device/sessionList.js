function createDevicesElement(){
    const deviceContainer = document.createElement("div");
    deviceContainer.classList.add("deviceContainer");

    socket.emit("devices",
        {type:"sessionList"},
        (response) => {
            if(response.error){
                console.log(response);
            }
            if(response){
                for (let i = 0; i < response.length; i++) {
                    const element = mdutils.createAppendElement("device", deviceContainer),
                        data = response[i];
                    
                    var deviceInfo = JSON.parse(data.Device);

                    var date = new Date(data.Date);
                    var dateFormatted = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(); 

                    element.innerHTML = `
                    <div class="title">
                        <p><i>${getOSIcon(null, deviceInfo)}</i><span>${getOS(null, deviceInfo)}</span></p>
                        <p><i>public</i><span>${deviceInfo.Browser.name}</span></p>
                    </div>
                    <div class="content">
                        <p><i>access_time</i><span>${dateFormatted}</span></p>
                        <p><i>lan</i><span>${data.IP}</span></p>
                        <p><i>location_on</i><span>${data.Country}</span></p>
                    </div>
                    
                    `;
                }
            }
        }
    );


    return deviceContainer;
}