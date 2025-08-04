const fs = require("fs");

// QR Codes
const QRCodes = {};

QRCodes.list = {};


const v4 = require("uuid").v4;
const cookie = require("cookie");
const url = require("url");
const session = require("./session");
const sql = require("../databases/mysql");

const page = fs.readFileSync(__dirname + "/../../assets/pages/code.html", "utf-8");

QRCodes.getHTML = async function(headers, req, res) {
    headers["Content-Type"] = "text/html";
    res.writeHead(200, headers);
    const cookies = cookie.parse(req.headers.cookie || "");
    // if (!cookies["MDSess"]) { this scenario is impossible
    //     res.end(page.replace("{$status}", "'Unlogged!'"));
    //     return;
    // }
    var UID = await session.getSessionUID(cookies["MDSess"]);
    // console.log(UID)
    
    if(UID == -1){
        res.end(page.replace("{$status}", "'Unlogged!'"));
        return;
    }

    var code = req.url.split("/").pop();
    if(code.includes("?")) {
        code = code.split("?")[0];
    }

    if(!code || !QRCodes.list[code]) {
        res.end(page.replace("{$status}", "'Invalid code!'"));
        return;
    }

    const query = url.parse(req.url, true).query;
    if (("confirm" in query)) {
        console.log("logged in");
        // Log the user in
        res.end(page.replace("{$status}", "'Logged in!'"));
        return;
    }
    
    var response = page;
    
    const clientInfo = {};
    const result = await sql.midelightDB.query("SELECT Avatar, Email, Username FROM accounts WHERE UID="+sql.midelightDB.escape(UID));
    clientInfo.Username = result[0][0].Username;
    clientInfo.Email = result[0][0].Email;
    if(result[0][0].Avatar){
        clientInfo.Avatar = result[0][0].Avatar;
    }
    response = response.replace("{$clientInfo}", JSON.stringify(clientInfo));

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || "";

    // Warn if different IP
    if(QRCodes.list[code].ip !== ip){
        console.log("IP mismatch: " + QRCodes.list[code].ip + " != " + ip);
        res.end(response.replace("{$status}", "'IP mismatch!'"));
        return;
    }

    // We have traced the call, it's coming from inside the house.
    if(
        QRCodes.list[code].ip == ip &&
        QRCodes.list[code].userAgent == userAgent
    )
    {
        res.end(response.replace("{$status}", "'Already logged in!'"));
        return;
    }
    

    res.end(response.replace("{$status}", "'OK!'"));
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