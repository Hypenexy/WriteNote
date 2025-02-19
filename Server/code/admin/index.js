const bcrypt = require('bcrypt');

async function getUIDfromUsername(con, username){
    const adminIds = await con.query(`SELECT UID FROM accounts WHERE Username = ${con.escape(username)}`);
    if(adminIds[0].length < 1){
        return false;
    }
    
    return adminIds[0][0].UID;
}

/**
 * View list of admins.
 * It can only be used in the command interface
 * @param {String} con MySQL connection
 * @param {Int} page Displays specific page
 * @returns Hopefully nothing
 */
const adminList = async (con, page) => {
    if(!page){
        page = 1;
    }
    const adminsCount = await con.query(`SELECT COUNT(*) FROM admins`);
    const count = adminsCount[0][0][Object.keys(adminsCount[0][0])[0]];
    const adminIds = await con.query(`SELECT UID FROM admins LIMIT ${(page - 1) * 10}, ${page * 10}`);
    if(count< 10 && page > 1){
        console.log("\x1b[31mDon't have that many pages\x1b[0m");
        return;
    }
    if(count < 1){
        console.log("\x1b[31mNo admins yet\x1b[0m");
        return;
    }
    console.log("\x1b[33m------ Admin list ------\x1b[0m");
    for (let i = 0; i < adminIds[0].length; i++) {
        const UID = adminIds[0][i].UID;
        const user = await con.query(`SELECT Username, Date FROM accounts WHERE UID = ${con.escape(UID)}`);
        const date = new Date(user[0][0].Date);
        console.log(`${user[0][0].Username} - ${date.toLocaleString()}`);
    }
    var pages = parseInt((count / 10).toString().split('.')[0]);
    if(count % 10 != 0){
        pages += 1;
    }
    console.log(`\x1b[33m${count} total admins. \x1b[93mPage [${page}/${pages}]\x1b[0m`);
};

module.exports.adminList = adminList;

const addAdmin = async (con, username, key) => {
    const UID = await getUIDfromUsername(con, username);
    if(UID != false){
        const hash = bcrypt.hashSync(key, 6);
        try {
            await con.query(`INSERT INTO admins VALUES (${con.escape(UID)}, ${con.escape(hash)}, ${con.escape(Date.now())})`);
            return "success";
        } catch (error) {
            console.log(error);
            if(error.code == "ER_DUP_ENTRY"){
                return "username already admin";
            }
        }
    }
    else{
        return "username not found";
    }
}

module.exports.addAdmin = addAdmin;

const removeAdmin = async (con, username) => {
    const UID = await getUIDfromUsername(con, username);
    if(UID != false){
        const adminIds = await con.query(`DELETE FROM admins WHERE UID = ${con.escape(UID)}`);
        if(adminIds[0].affectedRows == 1){
            return "success";
        }
        else{
            return "username not admin";
        }
    }
    else{
        return "username not found";
    }
}

module.exports.removeAdmin = removeAdmin;

const updateAdminKey = async (con, username, newKey) => {
    const UID = await getUIDfromUsername(con, username);
    if(UID != false){
        const adminResult = await con.query(`SELECT 'Key' FROM admins WHERE UID = ${con.escape(UID)}`);
        if(adminResult[0].length < 1){
            return "username not admin";
        }

        const hash = bcrypt.hashSync(newKey, 6);
        const adminIds = await con.query(`
            REPLACE INTO admins (\`UID\`, \`Key\`)
            VALUES (${con.escape(UID)}, ${con.escape(hash)})
        `);

        if(adminIds[0].affectedRows == 2){
            return "success";
        }
    }
    else{
        return "username not found";
    }
}

module.exports.updateAdminKey = updateAdminKey;


const logonAdmin = async (con, UID, key) => {
    const adminResult = await con.query(`SELECT \`Key\` FROM admins WHERE UID = ${con.escape(UID)}`);
    console.log(adminResult[0][0].Key);
    if(adminResult[0].length > 0){
        const match = bcrypt.compareSync(key, adminResult[0][0].Key);
        if(match) {
            return true;
        }
        return false;
    }
    else{
        return false;
    }
}

module.exports.logonAdmin = logonAdmin;