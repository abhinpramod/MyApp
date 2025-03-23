const multer = require("multer");

// Set up Multer for memory storage
const storage = multer.memoryStorage(); // Store files in memory

// Initialize Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    console.log(`Processing file: ${file.originalname}`); // Log file being processed
    // Allow images and PDFs
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      console.log(`Rejected file: ${file.originalname} (Invalid file type)`); // Log rejected files
      cb(new Error("Only image and PDF files are allowed!"), false);
    }
  },
});

module.exports = upload;