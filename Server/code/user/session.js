const sql = require("./../databases/mysql");

/**
 * Returns the UID of the session if the user is logged into an account
 * @param {String} sessionId Session ID of user
 * @returns UID number, -1 if not logged in
 */
async function getSessionUID(sessionId){
    var UID;
    if(sessionId){
        const result = await sql.midelightDB.query("SELECT UID FROM sessions WHERE ID="+sql.midelightDB.escape(sessionId));
        if(result){
            if(result[0][0]){
                if(result[0][0].UID){
                    UID = await result[0][0].UID;
                }
                else{
                    UID = -1;
                }
            }
            else{
                UID = -1;
            }
        }
        else{
            UID = -1;
        }
    }
    
    return UID;
}

module.exports.getSessionUID = getSessionUID;

/**
 * Saves UID to user's session
 * @param {String} sessionId sessionId of user
 * @param {String} UID UID of user
 * @param {Object} Device Device information
 */
async function createSession(sessionId, UID, Device){
    const escapedSessionId = sql.midelightDB.escape(sessionId);
    const dateNow = sql.midelightDB.escape(Date.now());
    if(typeof Device == "object"){
        Device = JSON.stringify(Device);
    }
    const device = sql.midelightDB.escape(Device);

    await sql.midelightDB.query(`
        REPLACE INTO sessions (ID, Device, UID, Date)
        VALUES (${escapedSessionId}, ${device}, ${UID}, ${dateNow})
    `);
}

module.exports.createSession = createSession;