var io;

function updateAdminStats(type, value){
    io.to("admin").emit("stats", {[type]: value});
}


module.exports = (passedIO) => {
    io = passedIO;
    return {"updateAdminStats": updateAdminStats};
}
