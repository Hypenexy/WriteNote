function createQRCode(){
    const QRCodeContainer = document.createElement("div");
    QRCodeContainer.classList.add("QRContainer");
    QRCodeContainer.innerHTML = `<p>${locale.sign_in_qr}</p>`;
    const QRLoader = mdutils.createAppendElement("loader", QRCodeContainer);
    const QRCodeElement = mdutils.createAppendElement("QR", QRCodeContainer);
    var qrcode = new QRCode(QRCodeElement, {
        width: 200,
        height: 200,
        colorDark : "#222248",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    socket.on("connect", () => { // make sure to disable this after no longer needed
        socket.emit("qrcode", null, (data) => {
            if(Object.keys(data)[0] == "code"){
                QRLoader.remove();
            }
        });
    });
    qrcode.makeCode(`${WriteNoteServer}/?code=sadafewf3ffef`);
    socket.on("qrcode", (data) => {
        console.log(data);
        console.log("logged in!!!!!");
        WriteNoteLogin({
            refetch: true,
            user: {sessionId: data}}
        );
    });

    return QRCodeContainer;
}