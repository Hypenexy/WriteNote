function createNotesUsageElement(){
    const notesUsage = document.createElement("div");
    notesUsage.classList.add("notesUsage");

    const bar = document.createElement("div");
    bar.classList.add("bar");
    notesUsage.appendChild(bar);

    var totalSize = 0, // Get this from a server
        NIDS = Object.keys(logonData.notes);
    for (let i = 0; i < NIDS.length; i++) {
        totalSize += logonData.notes[NIDS[i]].size;
    }

    var sizes = [];
    for (let i = 0; i < NIDS.length; i++) {
        const element = document.createElement("div"),
            colorElement = document.createElement("div"),
            nameElement = document.createElement("span"),
            size = logonData.notes[NIDS[i]].size,
            name = logonData.notes[NIDS[i]].name;
        
        if(size == 0){
            continue;
        }

        sizes.push([name, size, NIDS[i]]);
        
        element.style.width = size/totalSize*100 + "%";

        colorElement.classList.add("color");
        colorElement.style.backgroundColor = "#"+NIDS[i];
        element.appendChild(colorElement);

        nameElement.textContent = name;
        element.appendChild(nameElement);

        bar.appendChild(element);
    }

    sizes.sort((a, b) => b[1] - a[1]);

    const detailedView = document.createElement("div");
    detailedView.classList.add("detailedView");
    for (let i = 0; i < sizes.length; i++) {
        const element = document.createElement("div");
        
        
        var humanReadable_size = mdutils.humanFileSize(sizes[i][1]),
            name = sizes[i][0],
            color = sizes[i][2];

        element.innerHTML = `<div class="circle" style="background-color:#${color}"></div> ${name} ${humanReadable_size}`;

        detailedView.appendChild(element);
    }

    notesUsage.appendChild(detailedView);

    return notesUsage;
}