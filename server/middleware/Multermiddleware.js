// multerConfig.js
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
    // Allow only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

module.exports = upload; // Ensure this line is present