const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const { bucket } = require('./gcs');

const app = express();

const fs = require('fs');
const cors=require('cors');
const bodyParser=require('body-parser')
app.use(cors())
app.set('view engine', 'ejs');
app.use(bodyParser.json());

//db update
const mongoose = require('mongoose');
const uri = "mongodb+srv://Auroravisionaries:<db_password>@cluster0.4pauh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);
// db update end


const helmet = require('helmet'); // Helmet helps secure your Express apps

// Configure Helmet to set the Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts
    scriptSrcAttr: ["'self'", "'unsafe-inline'"], // Allow inline script attributes
    imgSrc: ["'self'", "data:", "http://localhost:3000"],
    mediaSrc: ["'self'", "https://storage.googleapis.com"],
        // Add other directives as needed
  },
}));

const prisma = new PrismaClient();

// Configure Multer for handling file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    // Use the original file name
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

const upload = multer({ storage: storage }); 

// Upload video route
app.get('/', (req,res) => {
    res.render('pages/index',{ gcsUrl: '' })
})


app.post('/upload', upload.single('video'), async (req, res) => {
    console.log(req.file);
    const filePath = req.file.path;
  const fileName = req.file.originalname;
  const destination = fileName;
  try {
    // Upload the file to GCS
    const [file]=await bucket.upload(filePath, {
      destination,
      metadata: {
        contentType: 'video/mp4/mp3', // Adjust based on your video type
      },
      
    });

     // Make the file public
     await file.makePublic();
    // Generate GCS URL
    const gcsUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Save metadata to MongoDB using Prisma
    const video = await prisma.video.create({
      data: {
        filename: fileName,
        gcsUrl,
        fileSize: req.file.size,
      },
    });
    try {
      await fs.promises.unlink(filePath);
      console.log('Temporary file deleted successfully');
  } catch (unlinkError) {
      console.error('Error deleting temporary file:', unlinkError);
      // Log but don't fail the request as upload was successful
  }
    // Respond with the saved video metadata
    // res.json(video);
    // res.json({ id: video.id });
    res.json({gcsUrl:video.gcsUrl})
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// Retrieve all video metadata route
app.get('/view-video', async (req, res) => {
    try {
      // Fetch all videos from the database
      const videos = await prisma.video.findMany(); // Find all videos in the database
  
      if (videos.length === 0) {
        return res.status(404).json({ error: 'No videos found' });
      }
  
      // Respond with the list of video URLs and other metadata
      const videoUrls = videos.map(video => ({ title: video.filename, gcsUrl: video.gcsUrl }));
  
      // If rendering a page with the list of videos
      res.render('pages/view-videos', { videos: videoUrls }); // Render the video URLs in the view template
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve videos' });
    }
  });
  
// Cleanup function to remove old files from uploads directory
function cleanupUploadsFolder() {
  const uploadsDir = 'uploads/';
  
  fs.readdir(uploadsDir, (err, files) => {
      if (err) {
          console.error('Error reading uploads directory:', err);
          return;
      }

      files.forEach(file => {
          const filePath = path.join(uploadsDir, file);
          
          // Get file stats
          fs.stat(filePath, (err, stats) => {
              if (err) {
                  console.error('Error getting file stats:', err);
                  return;
              }

              // Check if file is older than 1 hour
              const now = new Date().getTime();
              const fileAge = now - stats.mtime.getTime();
              
              if (fileAge > 3600000) { // 1 hour in milliseconds
                  fs.unlink(filePath, err => {
                      if (err) {
                          console.error('Error deleting old file:', err);
                      } else {
                          console.log(`Deleted old file: ${file}`);
                      }
                  });
              }
          });
      });
  });
}

// Run cleanup every hour
setInterval(cleanupUploadsFolder, 3600000);

// Run cleanup on server start
cleanupUploadsFolder();


// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
