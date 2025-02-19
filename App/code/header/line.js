function createLine(){
    const element = document.createElement("div");
    element.classList.add("progressiveLine");
    app.appendChild(element);
    setTimeout(() => {
        // element.classList.add("error");
        element.classList.add("switch");
    }, 1000);
}

createLine();