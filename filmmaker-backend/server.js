const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

// Serve static files (optional if you have images or assets)
app.use(express.static('public'));

// Middleware to parse JSON data from the form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file
  }
});

const upload = multer({ storage: storage });

// Route to handle form submission
app.post('/submit-film', upload.fields([{ name: 'film' }, { name: 'thumbnail' }]), (req, res) => {
  const { name, branch, section, year, phone, instaHandle } = req.body;
  const filmFile = req.files['film'][0];
  const thumbnailFile = req.files['thumbnail'][0];

  console.log('Form Data:', req.body);
  console.log('Film File:', filmFile);
  console.log('Thumbnail File:', thumbnailFile);

  // Save form data to a database or perform any additional logic

  // Send a response back to the client
  res.status(200).json({ message: 'Film submitted successfully!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
