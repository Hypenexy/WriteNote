const version = [1, 0, 0];

const app = document.createElement("app");
document.body.appendChild(app);

const mdutils = new MDUtils;

const writenote = new WriteNote({linkEngine: `https://midelight.net:2053/Metadata`});