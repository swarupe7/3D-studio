const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const { Readable } = require('stream');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const mongoUri = 'mongodb+srv://20pa1a05e7:20pa1a05e7@cluster0.3nvkdcu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, { bucketName: 'models' });
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('model'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const readableFileStream = new Readable();
  readableFileStream.push(req.file.buffer);
  readableFileStream.push(null);

  const uploadStream = gfs.openUploadStream(req.body.name, {
    contentType: req.file.mimetype,
  });

  readableFileStream.pipe(uploadStream);

  uploadStream.on('error', (error) => {
    return res.status(500).send('Error uploading file: ' + error.message);
  });

  uploadStream.on('finish', () => {
    res.status(201).send('Model uploaded!');
  });
});

app.get('/models', async(req, res) => {
  try {
    const files = await conn.db.collection('models.files').find().toArray();

    if (files.length === 0) {
      console.log('No files found');
      return res.status(404).send('No files found');
    }

    console.log(files);
   return res.json(files);
  } catch (err) {
    console.error('Error fetching models:', err.message);
    res.status(500).send('Error fetching models: ' + err.message);
  }
});

app.get('/models/:id', (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = gfs.openDownloadStream(fileId);

    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });

    downloadStream.on('error', (err) => {
      console.error('Error downloading file:', err.message);
      res.status(404).send('File not found');
    });

    downloadStream.on('end', () => {
      res.end();
    });
  } catch (err) {
    console.error('Error fetching file:', err.message);
    res.status(500).send('Error fetching file: ' + err.message);
  }
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
