// var socket = io(serverAddress.slice(0, -1)+":2053")

// socket.on("logon", (data) => {
//     addDevice(data[0], data[1])
// })
// socket.on("getOtherDevices", (data) => {
//     var you = data.you
//     var devices = data.devices
//     for (let i = 0; i < devices.length; i++) {
//         if(devices[i][0]!=you){
//             addDevice(devices[i][0], devices[i][1])
//         }
//     }
// })
// socket.on("logout", (data) => {
//     removeDevice(data)
// })

// socket.on("connect", () => { socket.emit("logon", document.cookie) });

// function sendData(){
//     var data = notearea.innerHTML
//     socket.emit("contentChange", data)
//     //timeout
// }

// notearea.addEventListener("input", function(){
//     sendData()
// })

// socket.on('contentChange', (data) => {
//     notearea.innerHTML = data
// })


// function onSettingsChange(){
//     socket.emit("saveSettings", JSON.stringify(settings))
// }
// socket.on('saveSettings', (data) => {
//     settings = JSON.parse(data)
// })

// function getLatency(){
//     const start = Date.now()
  
//     socket.emit("ping", () => {
//       const duration = Date.now() - start
//       console.log(duration);
//     })
// }

// // getLatency() to get latency (ping) in ms