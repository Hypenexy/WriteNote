function checkDataAndCallback(data, callback){
    if(typeof callback != "function"){
        return false;
    }
    if(typeof data != "object"){
        callback(null, "Invalid request, data isn't an object");
        return false;
    }
    return true;
}

module.exports.checkDataAndCallback = checkDataAndCallback;