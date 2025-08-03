const fs = require("fs");

// QR Codes
const QRCodes = {};

QRCodes.list = {};


const v4 = require("uuid").v4;
const cookie = require("cookie");

const page = fs.readFileSync(__dirname + "/../../assets/pages/code.html", "utf-8");

QRCodes.getHTML = function(headers, req, res) {
    const code = req.url.split("/").pop();
    headers["Content-Type"] = "text/html";
    res.writeHead(200, headers);
    
    const cookies = cookie.parse(req.headers.cookie || "");
    if(!cookies["MDSess"]){
        res.end(page.replace("{$status}", "'Unlogged!'"));
        return;
    }
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || "";

    if(QRCodes.list[code]){
        console.log("cookie yum ymu");
        console.log(cookies);
        if(
            QRCodes.list[code].ip == ip &&
            QRCodes.list[code].userAgent == userAgent
        )
        {
            res.end(page.replace("{$status}", "'Already logged in!'"));
            return;
        }
    }

    res.end(page.replace("{$status}", "'OK!'"));
};

QRCodes.getHTMLAccept = function(headers, req, res) {
    
    // headers["Content-Type"] = "text/html";
    // res.writeHead(200, headers);
    // res.end(page);
};

QRCodes.getQRCode = function(socket, callback){
    const QRCode = v4().slice(0, 16);
    QRCodes.list[QRCode] = {
        ip: socket.handshake.headers['x-forwarded-for'] || socket.handshake.address,
        userAgent: socket.handshake.headers['user-agent'] || "",
        socketId: socket.id,
        cookies: socket.request.headers.cookie || "",
        date: Date.now()
    };
    callback({code: QRCode});
}

module.exports = QRCodes;