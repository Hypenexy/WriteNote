
// QR Codes
const QRCodes = [];

// socket.on('qrcode', async (data, callback) => {
//     if(typeof callback != "function"){
//         return;
//     }
//     const QRCode = v4().slice(0, 16);
//     QRCodes.push([[socket.id, cookies.MDSess], QRCode]);
//     callback({code: QRCode});
// });

module.exports.QRCodes = QRCodes;