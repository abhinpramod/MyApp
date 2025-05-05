const multer = require("multer");

// Set up Multer for memory storage
const storage = multer.memoryStorage();

// File filter configuration with better MIME type checking
const fileFilter = (req, file, cb) => {
  try {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-m4v'];
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

    // More flexible MIME type checking
    const isAllowed = allowedTypes.some(type => 
      file.mimetype === type || 
      file.mimetype.startsWith('image/') || 
      file.mimetype.startsWith('video/')
    );

    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Only images (JPEG, PNG, WEBP) and videos (MP4, MOV) are allowed. Received: ${file.mimetype}`), false);
    }
  } catch (error) {
    cb(error, false);
  }
};

// Initialize Multer with better error handling
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
    files: 3 // Max 3 files
  },
  fileFilter: fileFilter
});

// Error handling middleware
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE' 
        ? 'File size too large. Max 20MB allowed.' 
        : err.message
    });
  } else if (err) {
    // Other errors
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error'
    });
  }
  next();
};

module.exports = {
  upload,
  handleMulterErrors
};