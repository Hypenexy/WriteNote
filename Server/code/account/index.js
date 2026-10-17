const sql = require("./../databases/mysql");
const protocolCheck = require("./../user/protocolCheck");
const session = require("./../user/session");
const { v4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (socket, sessionId, clientInfo, loginUID, logoutReference) => {
    socket.on("account", async (data, callback) => {
        if(!protocolCheck.checkDataAndCallback(data, callback)){ // This ain't work with null data
            return;
        }
        if(!data || !data.type){
            callback(null, "Invalid request, type isn't specified");
            return;
        }
        // An error thrown in this async handler (for example a missing field) used to be
        // an unhandled promise rejection, which stops the whole server. Catch it per request.
        try {
            if(data.type == "register"){
                callback(await register(data, sessionId, loginUID));
            }
            if(data.type == "login"){
                callback(await login(data, sessionId, loginUID));
            }
            if(data.type == "Update avatar"){
                require("./avatars")(data, callback, clientInfo);
            }
            if(data.type == "logout"){
                callback(await logout(sessionId, logoutReference));
            }
        } catch (error) {
            console.error("account protocol error:", error);
            try { callback({error: "Internal server error"}); } catch(e) {}
        }
    });
}

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validateUsername = (username) => {
    if(username.length > 30){
        return "Username too long";
    }
    if(username.length < 1){
        return "Username not set";
    }
    return true;
};

const validatePassword = (password) => {
    if(password.length < 1){
        return "Password not set";
    }
    if(password.length > 500){
        return "Password ridiculously long";
    }
    return true;
}
async function register(data, sessionId, loginUID){
    const response = {};
    if(typeof data.username != "string" || typeof data.password != "string"){
        response.error = "Invalid request";
        return response;
    }
    var email_validated = validateEmail(data.email);
    if(!email_validated){
        response.error = "Invalid email";
        return response;
    }

    var username_validated = validateUsername(data.username);
    if(username_validated != true){
        response.error = username_validated;
        return response;
    }

    var password_validated = validatePassword(data.password);
    if(password_validated != true){
        response.error = password_validated;
        return response;
    }

    const UID = v4();
    const username = sql.midelightDB.escape(data.username.trim());
    const hash = bcrypt.hashSync(data.password, saltRounds);
    const email = sql.midelightDB.escape(data.email);

    const date = Date.now();
    
    var result;
    try{
        result = await sql.midelightDB.query(`
            INSERT INTO accounts (Username, UID, Password, Email, Date)
            VALUES (${username}, '${UID}', '${hash}', ${email}, ${date})
        `);
    }
    catch(error){
        if(error.code == "ER_DUP_ENTRY"){
            if(error.sqlMessage.endsWith("Email'")){
                response.error = "Email already taken";
            }
            if(error.sqlMessage.endsWith("Username'")){
                response.error = "Username already taken";
            }
            if(!response.error){
                response.error = "Account already exists";
            }
            return response;
        }
        // Any other failure: stop here. Before, execution continued and the user was
        // logged in to an account that does not exist.
        console.error("register failed:", error);
        response.error = "Internal server error";
        return response;
    }

    await session.createSession(sessionId, UID, data.device);
    loginUID(UID);

    response.status = "success";
    
    return response;
}

async function login(data, sessionId, loginUID){
    const response = {};
    if(typeof data.identity != "string" || typeof data.password != "string" || data.password.length > 500){
        response.error = "Wrong username or password";
        return response;
    }

    const username = sql.midelightDB.escape(data.identity.trim());
    // const dateNow = sql.midelightDB.escape(Date.now());
    
    var result = await sql.midelightDB.query(`
        SELECT * FROM accounts WHERE Username=${username} OR Email=${username};
    `);

    if(result[0].length == 0){
        response.error = "Wrong username or password";
        return response;
    }

    
    const match = bcrypt.compareSync(data.password, result[0][0].Password);

    if(!match) {
        response.error = "Wrong username or password";
        return response;
    }

    const UID = result[0][0].UID;

    await session.createSession(sessionId, UID, data.device);
    loginUID(UID);

    response.status = "success";

    return response;
}

async function logout(sessionId, logoutReference){
    const response = {};
    const sessionResult = await sql.midelightDB.query(`DELETE FROM sessions WHERE ID = ${sql.midelightDB.escape(sessionId)}`);

    // Log this socket out whether or not a session row was found. This used to run only
    // when the delete FAILED, so a normal logout left the socket (and any admin rights)
    // fully active. mysql2 returns [ResultSetHeader, ...], so affectedRows is on [0].
    logoutReference();

    if(sessionResult[0].affectedRows >= 1){
        response.status = "success";
    }
    else{
        response.error = true;
    }

    return response;
}
