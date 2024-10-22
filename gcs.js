const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Initialize Google Cloud Storage with the service account key
const storage = new Storage({
  keyFilename: path.join(__dirname, 'turnkey-mender-436305-s2-78ea7a38baa5.json'),
});


// Reference to the bucket
const bucketName = 'test_1_0';
const bucket = storage.bucket(bucketName);
console.log(bucketName)

module.exports = { bucket };


