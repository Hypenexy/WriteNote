var friendRequests = [],
    friendRequestsOutgoing = [];

function addFriendMenu(){
    const element = document.createElement("div");

    const form = document.createElement("div");
    form.classList.add("form");
    element.appendChild(form);

    const inputContainer = document.createElement("div");
    inputContainer.classList.add("inputContainer");
    form.appendChild(inputContainer);

    const input = document.createElement("input");
    input.classList.add("input");
    // input.placeholder = locale.add_friend;
    inputContainer.appendChild(input);

    input.addEventListener("input", () => {
        textResponse.textContent = "";
        if(textResponse.textContent.length > 0){
            textResponse.classList.add("hide");
            textResponse.onanimationend = () => {
                textResponse.className = "";
                textResponse.onanimationend = "";
            };
        }
        if(input.value.length > 0){
            inputContainer.classList.add("hide");
        }
        else{
            inputContainer.classList.remove("hide");
        }
    });

    input.addEventListener("keydown", (e) => {
        if(e.key == "Enter"){
            submit();
        }
    });

    const texthide = document.createElement("div");
    texthide.classList.add("texthide");

    const textElement = document.createElement("span");
    textElement.textContent = locale.add_friend;
    texthide.appendChild(textElement);

    const textResponse = document.createElement("span");
    texthide.appendChild(textResponse);

    inputContainer.appendChild(texthide);

    function setResponse(type, code){
        textResponse.classList = "";
        if(type == "error"){
            textResponse.classList.add("error");
        }
        if(type == "success"){
            textResponse.classList.add("success");
        }
        textResponse.textContent = code;
    }

    const button = document.createElement("div");
    button.classList.add("button", "i");
    button.innerHTML = `<i>mail</i>${locale.send_friend_request}`;
    form.appendChild(button);

    mdutils.ButtonEvent(button, submit);

    function submit(){
        if(input.value.length == 0){
            setResponse("error", locale.empty_username);
            return;
        }
        if(input.value == logonData.user.Username){
            setResponse("error", locale.error_friend_yourself);
            return;
        }

        
        
        socket.emit("chat", {
            type: "friendRequest",
            Username: input.value
        }, (data) =>{
            if(data.error){
                switch (data.error) {
                    case "You can't friend yourself silly":
                        setResponse("error", locale.error_friend_yourself);
                        break;
                    case "Empty username":
                        setResponse("error", locale.empty_username);
                        break;
                    case "Couldn't find username":
                        setResponse("error", locale.couldnt_find_username);
                        break;
                    case "Already friends":
                        setResponse("error", locale.already_friends);
                        break;
                    case "Already pending":
                        setResponse("error", locale.already_pending);
                        break;
                    default:
                        setResponse("error", locale.unknown_error);
                        break;
                }
            }
            if(data.success){
                setResponse("success", data.success);
                addPendingFriendElement(input.value);
                friendRequestsOutgoing.push(input.value);
            }
        });
    }

    const hrText = document.createElement("div");
    hrText.classList.add("hrtext");
    hrText.innerHTML = `<span>${locale.pending_requests}</span>`;
    element.appendChild(hrText);

    const friendRequestsElement = document.createElement("div");
    friendRequestsElement.classList.add("friendRequestsElement");
    element.appendChild(friendRequestsElement);

    addFriendRequestElement = (from) => {
        console.log(element)
        if(true){
            const requestElement = document.createElement("div");
            requestElement.classList.add("friendRequest");
            requestElement.textContent = from;
            requestElement.setAttribute("username", from);

            const btns = document.createElement("div");
            requestElement.appendChild(btns);

            const acceptBtn = document.createElement("div");
            acceptBtn.classList.add("m-i", "accept");
            acceptBtn.textContent = "check";
            mdutils.ButtonEvent(acceptBtn, () => {
                socket.emit("chat", {
                    type: "friendAccept",
                    from: from
                },
                (data) => {
                    console.log(data);
                });
            });
            btns.appendChild(acceptBtn);

            const declineBtn = document.createElement("div");
            declineBtn.classList.add("m-i", "decline");
            declineBtn.textContent = "close";
            mdutils.ButtonEvent(declineBtn, () => {
                socket.emit("chat", {
                    type: "friendCancel",
                    from: from
                },
                (data) => {
                    console.log(data);
                });
            });
            btns.appendChild(declineBtn);

            friendRequestsElement.appendChild(requestElement);
        }
    }

    for (let i = 0; i < friendRequests.length; i++) {
        const element = friendRequests[i];
        addFriendRequestElement(element);
    }

    function addPendingFriendElement(username){
        const requestElement = document.createElement("div");
        requestElement.classList.add("friendRequest");
        requestElement.textContent = username;
        requestElement.setAttribute("username", username);

        const btns = document.createElement("div");
        requestElement.appendChild(btns);

        const declineBtn = document.createElement("div");
        declineBtn.classList.add("m-i", "decline");
        declineBtn.textContent = "close";
        mdutils.ButtonEvent(declineBtn, () => {
            socket.emit("chat", {
                type: "friendCancel",
                self: true,
                from: username
            },
            (data) => {
                console.log(data);
                if(data.success == "Friend request cancelled"){
                    removeFriendElement(username);
                }
            });
        });
        btns.appendChild(declineBtn);
        
        friendRequestsElement.appendChild(requestElement);
    }

    function removeFriendElement(username){
        friendRequestsElement.querySelector(`[username='${username}']`).remove();
        var index = friendRequests.indexOf(username);
        if(index !== -1){
            friendRequests.splice(index, 1);
        }
        else{
            var index = friendRequestsOutgoing.indexOf(username);
            if(index !== -1){
                friendRequestsOutgoing.splice(index, 1);
            }
        }
        

    }

    for (let i = 0; i < friendRequestsOutgoing.length; i++) {
        const element = friendRequestsOutgoing[i];
        addPendingFriendElement(element);
    }

    return element;
}


var addFriendRequestElement;