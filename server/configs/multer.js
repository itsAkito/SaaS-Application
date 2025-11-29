// server/configs/multer.js
import multer from 'multer';

// Use memoryStorage so you can access req.file.buffer directly
const storage = multer.memoryStorage();

// Create the upload middleware
const upload = multer({ storage: multer.memoryStorage() });

// Export a single variable
export default upload;