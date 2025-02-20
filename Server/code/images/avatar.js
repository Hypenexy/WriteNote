const fs = require("fs");

function getAvatar(headers, req, res){
    var ImageID = req.url.toString().split('/avatar/')[1];

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