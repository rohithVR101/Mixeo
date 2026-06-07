const multer = require('multer');
const path = require('path');

// Stores uploaded files temporarily in /tmp at the project root before they
// are streamed to Cloudinary. Files are deleted after a successful upload.
const upload = multer({
    dest: path.join(__dirname, '..', '..', 'tmp'),
});

module.exports = upload;
