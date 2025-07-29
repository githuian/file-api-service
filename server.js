const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up storage
const uploadDir = 'uploads';

const uploadDirFull = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDirFull)) {
  fs.mkdirSync(uploadDirFull);
}

// Configure storage with custom filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // or any directory
  },
  filename: function (req, file, cb) {
    // Example: use original name with timestamp
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const uniqueName = `${name}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });


// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  res.send({ filename: req.file.filename, originalName: req.file.originalname });
});

// Download route
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
  res.download(filePath);
});

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/files', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read files' });
    }

    res.json({ files });
  });
});

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
