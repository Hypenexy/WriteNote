const { MongoClient } = require('mongodb');

var client;
var mongodb;
var collection;

const settings = require('./dbSettings.json');
const log = require('./../interface/log');

async function connectMongoDB(){
    const url = settings['mongodb.hostname'];
    client = new MongoClient(url, {
        // pkFactory: { createPk: () => UID }
        // Maybe replace with inserting it manually?
    });
    
    try {
        await client.connect();
        mongodb = client.db(settings['mongodb.database']);
        collection = mongodb.collection(settings['mongodb.collection']);
        chatCollection = mongodb.collection(settings['mongodb.chatCollection']);
        log("s", "MongoDB Database active");
        // GridFS testing

        // const db = client.db("dbName");
        // const bucket = new mongodb.GridFSBucket(db, { bucketName: 'myCustomBucket' });
        
        // const fs = require('fs');
        // fs.createReadStream('./myFile')
        // .pipe(bucket.openUploadStream('myFile', {
        //     chunkSizeBytes: 1048576,
        //     metadata: { field: 'myField', value: 'myValue' }
        // }));

        // Cleanup
        await collection.updateMany({}, { $unset: { devices : 1 } });

        return [collection, chatCollection];
    } catch (error) {
        throw error;
    }
}

module.exports.collection = async () => {
    return await connectMongoDB();
} 