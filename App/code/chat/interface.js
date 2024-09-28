function openChat(){
    const windowElement = createWindow("chat");
    if(typeof windowElement == "string"){
        return;
    }

    var friends = [];

    socket.emit("chat", {type: "load"}, (data) => {
        console.log(data);
        friends = data.friends;
        friendRequests = data.friendRequests;
        friendRequestsOutgoing = data.friendRequestsOutgoing;
        listUsers();
    });

    function addUser(data){
        const friendElement = document.createElement("div");
        friendElement.classList.add("button", "friend");
        friendElement.textContent = data;
        
        mdutils.ButtonEvent(friendElement, () => {mainDisplay("conversation", friendElement, {Username: data})});

        messagesList.appendChild(friendElement);
    }

    function listUsers(){
        for (let i = 0; i < friends.length; i++) {
            addUser(friends[i]);
        }
    }

    const messages = document.createElement("div");
    messages.classList.add("messages");
    windowElement.appendChild(messages);

    (() =>  {
        const searchPeople = document.createElement("div");
        searchPeople.classList.add("searchPeople");

        const searchPart = document.createElement("div");
        searchPart.classList.add("searchPart");
        searchPeople.appendChild(searchPart);

        const searchIcon = document.createElement("i");
        searchIcon.textContent = "search";
        searchPart.appendChild(searchIcon);

        const input = document.createElement("input");
        input.placeholder = locale.search_for_people;
        searchPart.appendChild(input);

        messages.appendChild(searchPeople);

        const result = document.createElement("div");
        result.classList.add("result");
        searchPeople.appendChild(result);


        input.addEventListener("input", () => {
            searchPeople.classList.add("visible");
            result.textContent = input.value;
        });
    })();

    const addFriend = document.createElement("div");
    addFriend.classList.add("button");
    addFriend.classList.add("i");
    addFriend.innerHTML = `<i>person</i> ${locale.add_friend}`;
    mdutils.ButtonEvent(addFriend, () => {mainDisplay("friend", addFriend)});
    messages.appendChild(addFriend);

    const messagesList = document.createElement("div");
    messagesList.classList.add("messagesList");
    messages.appendChild(messagesList);

    const main = document.createElement("div");
    main.classList.add("main");
    windowElement.appendChild(main);

    var lastDisplayButton;
    function mainDisplay(menu, button, data){
        main.innerHTML = '';
        if(lastDisplayButton){
            lastDisplayButton.classList.remove("active");
        }
        lastDisplayButton = button;
        button.classList.add("active");

        if(menu == "conversation"){
            main.appendChild(openConversation(data));
        }
        if(menu == "friend"){
            main.appendChild(addFriendMenu());
        }
    }
}



document.addEventListener("keydown", (e) => {
    if(e.ctrlKey && e.code == "KeyY"){
        openChat();
    }
});