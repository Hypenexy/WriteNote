/**
 * Imported from the unpublished WriteNote-Server, it's the best code I promise (maybe).
 * Use instead of console.log
 * If the first argument is 's' (for success) it will be green
 * If it's 'f' (for failure) it will be red
 */
function log(){
    if(arguments[0]=="s"){
        arguments[0] = "\x1b[32m%s\x1b[0m";
    }
    if(arguments[0]=="f"){
        arguments[0] = "\x1b[31m%s\x1b[0m";
    }
    if(arguments[0]=="server"){
        arguments[0] = "\x1b[34m\x1b[1mServer:\x1b[0m %s\x1b[0m";
        if(arguments[1]=="user"){
            arguments[1] = "\x1b[35mUser";
            arguments[2] = "\x1b[35m\x1b[1m" + arguments[2] + "\x1b[0m";
        }
    }
    console.log.apply(console, arguments);
}

var getNotes;

function writenoteserverconnect(){
    if(notesonline==false && typeof socket == "undefined"){
        socket = io(serverAddress.slice(0, -1)+":2053");
    
        socket.on("connect", () => {
            socket.emit("logon", storedResponse.user.sessionId, (success, error) => {
                if(success){
                    FileFunction(); // If users logs in faster than the declaration of FileFunction(1), program will crash
                    log('s', success);
                }
                if(error){
                    log('f', error);
                }
            });
            notesonline = true;
        })
        var attemptNumber = 0;
        socket.on("connect_error", (err) => {
            if(attemptNumber==0){
                PushNotification(
                    "Connection to WriteNote Notes server failed",
                    "Either something is wrong with the server, probably offline, or with your client not being able to access this address \""+serverAddress.slice(0, -1)+":2053\" with error code: " + err.message + "<br><btn></btn>",
                    "warn",
                    [function(){
                        // writenoteserverconnect();
                        // I wouldn't like a recursion here, results in having multiple connections
                    }]
                );
            }
            attemptNumber++;
        });
        getNotes = async function(){
            return new Promise((resolve, reject) => {
                socket.emit("getNotes", null, (success, error) => {
                    if(success){
                        // notes.innerHTML = ''
                        var notesStr = JSON.stringify(success);
                        notesStr = notesStr.slice(1, notesStr.length - 1);
                        notesStr = JSON.parse(notesStr);
                        // for (let i = 0; i < notesStr.notes.length; i++) {
                        //     const element = notesStr.notes[i];
                        //     var NID = Object.keys(element)[0];
                        //     notes.innerHTML += `<p><a style="background: #${NID}">${NID}</a>${JSON.stringify(notesStr.notes[i][NID])}</p>`;
                        // }
                        resolve(notesStr.notes);
                    }
                    // if(error){
                    //     reject(error);
                    // }
                });
            });
        }

    }
}


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