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
        correctLevel : QRCode.CorrectLevel.L
    });

    function handleQRCodeSocket() {
        if (socket.connected) {
            emitQRCode();
        } else {
            socket.once("connect", emitQRCode);
        }
    }

    function emitQRCode() {
        socket.emit("qrcode", null, (data) => {
            if (Object.keys(data)[0] === "code") {
                QRLoader.remove();    
                qrcode.makeCode(`${WriteNoteServer}/code/${data.code}`);
                
                mdutils.ButtonEvent(QRCodeElement, () => {
                    navigator.clipboard.writeText(`${WriteNoteServer}/code/${data.code}`)
                        .then(() => {
                            // mdutils.showToast(locale.copied_to_clipboard);
                        })
                        .catch(() => {
                            // mdutils.showToast(locale.copy_failed);
                        });
                });
            }
        });
    }

    handleQRCodeSocket();
    qrcode.makeCode(`${WriteNoteServer}/code/unloaded`);
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