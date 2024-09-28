socket.on("chat", (data) => {
    console.log(data);
    if(data.type == "friendRequest"){
        friendRequests.push(data.from);
        addFriendRequestElement(data.from);
    }
});