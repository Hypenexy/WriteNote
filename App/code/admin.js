function loadAdminPanel(){
    const element = document.createElement("div");

    const status = document.createElement("div");
    status.classList.add("keyStatus");
    element.appendChild(status);

    const inputKey = document.createElement("input");
    inputKey.placeholder = locale.key;
    inputKey.type = "password";
    
    inputKey.addEventListener("keydown", (e) => {
        if(e.key == "Enter"){
            socket.emit("admin", {
                type: "key",
                Key: inputKey.value
            }, (response) => {
                if(response.success){
                    status.textContent = locale.success;
                    loadDashboard();
                }
                if(response.error){
                    status.textContent = locale.wrong_key_or_not_an_admin;
                }
            });
        }
    });
    element.appendChild(inputKey);

    function loadDashboard(){
        var elements = element.querySelectorAll("*");
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            element.classList.add("hide");
            element.onanimationend = () => {
                element.remove();
            }
        }

        // const weatherFullImage = document.createElement("img");
        // weatherFullImage.src = WriteNoteServer+'/weather/'+logonData.weather.image;
        // element.appendChild(weatherFullImage);
    }

    return element;
}