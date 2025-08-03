module.exports = (socket, clientInfo, QRCodes) => {
    socket.on("qrcode", async (nothing, callback) => {
        if (!callback || typeof callback !== "function") {
            return;
        }
        QRCodes.getQRCode(socket, callback);
    });
    

    // socket.on("getQRCodeHTML", (data, callback) => {
    //     if (!callback || typeof callback !== "function") {
    //         return;
    //     }
    //     QRCodes.getHTMLAccept(socket.handshake.headers, data, callback);
    // });
}