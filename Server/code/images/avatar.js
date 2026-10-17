const fs = require("fs");

function getAvatar(headers, req, res){
    // Strip any query string, then only allow the exact filename format that
    // avatars.js creates (32 hex characters + .jpg). Anything else, including
    // "../" sequences, is rejected before touching the filesystem.
    var ImageID = (req.url.toString().split('/avatar/')[1] || "").split('?')[0];
    if(!/^[a-f0-9]{32}\.jpg$/.test(ImageID)){
        res.writeHead(404, headers);
        res.end("Not found :(");
        return;
    }

    var filepath = `./userdata/images/${ImageID}`;
    var s = fs.createReadStream(filepath);
    s.on('open', function () {
        headers["Content-Type"] = "image/jpeg";
        res.writeHead(200, headers);
        s.pipe(res);
    });
    s.on('error', function () {
        res.writeHead(404, headers);
        res.end("Not found :("); // Make a 404
        return;
    });
}

module.exports.getAvatar = getAvatar;