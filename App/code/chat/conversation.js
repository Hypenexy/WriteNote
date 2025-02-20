function openConversation(userData){
    const element = document.createElement("div");
    element.classList.add("conversation");

    const chatheader = document.createElement("div");
    chatheader.classList.add("chatheader")
    element.appendChild(chatheader);

    const profile = document.createElement("div");
    profile.classList.add("profile");
    profile.innerHTML = `<img src="${getUserPfpURL(userData)}">${userData.Username}`;
    chatheader.appendChild(profile);
    
    const headerbuttons = document.createElement("div");
    chatheader.appendChild(headerbuttons);

    const callbutton = document.createElement("i");
    callbutton.textContent = "call";
    headerbuttons.appendChild(callbutton);

    const chatbox = document.createElement("div");
    chatbox.classList.add("chatbox");
    element.appendChild(chatbox);

    function messageElement(data){
        const element = document.createElement("div");
        element.classList = "message";
        element.innerHTML = data.content;
        chatbox.appendChild(element);
        return element;
    }

    function receive(data){
        const element = messageElement(data);
    }

    function send(data){
        const element = messageElement(data);
        element.classList.add("me");
    }

    send({content: "Hello mate"});

    receive({content: "Wassup"});
    receive({content: "pederas"});

    return element;
}