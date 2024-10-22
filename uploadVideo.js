const { bucket } = require('./gcs');  // GCS bucket reference
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Function to upload video to GCS and save metadata in MongoDB
async function uploadVideo(filePath) {
  const fileName = path.basename(filePath);  // Get file name from path
  const destination = fileName;              // Destination in GCS bucket

  try {
    // Upload the file to Google Cloud Storage
    const [file]=await bucket.upload(filePath, {
      destination,
      metadata: {
        contentType: 'video/mp4',  // Adjust based on your video type
      },
    });

    // Make the file publicly accessible
    await file.makePublic();

    // Create the GCS URL to the uploaded video
    const gcsUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Save metadata to MongoDB via Prisma
    const videoMetadata = await prisma.video.create({
      data: {
        filename: fileName,
        gcsUrl,
        fileSize: fs.statSync(filePath).size, // Get file size
      },
    });

    console.log('Video uploaded successfully, metadata saved:', videoMetadata);
  } catch (error) {
    console.error('Error uploading video or saving metadata:', error);
  }
}

// Example usage: Upload a video
uploadVideo('sample.mp4');
