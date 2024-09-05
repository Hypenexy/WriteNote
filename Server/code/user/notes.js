const { readdir, stat } = require('fs/promises');

/**
 * Gets notes sometime
 */
async function getNotes(){
    return getNotes;
}

module.exports.getNotes = getNotes;





const dirSize = async directory => {
    const files = await readdir( directory );
    const stats = files.map( file => stat( path.join( directory, file ) ) );
  
    return ( await Promise.all( stats ) ).reduce( ( accumulator, { size } ) => accumulator + size, 0 );
}

/**
 * To get the user's size, storage usage.
 * @param {*} UID User ID
 * @returns a number in bytes or bits idk
 */
async function getUsageSize(UID){
    const userDir = `userdata/${UID}`;
    var size = await dirSize(userDir);
    if(!size){
        size = "empty"; // get cache first then run this shite
    }
    return size;
}

module.exports.getUsageSize = getUsageSize;

