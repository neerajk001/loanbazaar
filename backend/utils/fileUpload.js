const fs = require('fs');
const path = require('path');
const multer = require('multer');

const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads', 'gallery');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Ensure upload directory exists
function ensureUploadDir(eventId) {
  const eventDir = path.join(UPLOAD_DIR, eventId);
  console.log('Ensuring upload directory exists:', eventDir);
  
  if (!fs.existsSync(eventDir)) {
    fs.mkdirSync(eventDir, { recursive: true });
    console.log('Created directory:', eventDir);
  }
  
  return eventDir;
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const eventId = req.params.id || req.body.eventId;
    const eventDir = ensureUploadDir(eventId);
    cb(null, eventDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const ext = path.extname(file.originalname);
    const filename = `${timestamp}-${randomStr}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  }
});

// Validate image file
function validateImageFile(file) {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }

  return { valid: true };
}

// Delete image file
function deleteImageFile(imagePath) {
  try {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  } catch (error) {
    console.error('Error deleting image file:', error);
    // Don't throw - allow deletion to continue even if file doesn't exist
  }
}

// Delete entire event directory
function deleteEventDirectory(eventId) {
  try {
    const eventDir = path.join(UPLOAD_DIR, eventId);
    if (fs.existsSync(eventDir)) {
      fs.rmSync(eventDir, { recursive: true, force: true });
    }
  } catch (error) {
    console.error('Error deleting event directory:', error);
  }
}

module.exports = {
  upload,
  ensureUploadDir,
  validateImageFile,
  deleteImageFile,
  deleteEventDirectory,
};
