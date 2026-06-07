const express = require('express');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const upload = require('../middleware/upload');

const router = express.Router();

// POST /api/upload — Receive a video file, upload to Cloudinary, return JSON metadata.
// Previously: POST /new → res.render('pages/new', { publicId, secureUrl, duration })
router.post('/upload', upload.single('upload'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded.' });
    }

    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'video',
            folder: 'mixeo',
        });

        // Clean up temp file from disk after Cloudinary has it
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Temp file cleanup error:', err);
        });

        res.json({
            success: true,
            publicId: result.public_id,
            secureUrl: result.secure_url,
            duration: result.duration,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, error: 'Video upload failed. Please try again.' });
    }
});

// POST /api/stage — Generate a Cloudinary URL with trim transformations.
// Previously: POST /stage → res.json({ trimmedUrl })  (unchanged behaviour, just moved)
router.post('/stage', async (req, res) => {
    try {
        const { publicId, start, end } = req.body;

        if (!publicId || start === undefined || end === undefined) {
            return res.status(400).json({ success: false, error: 'publicId, start, and end are required.' });
        }

        const trimmedUrl = cloudinary.url(publicId, {
            resource_type: 'video',
            start_offset: start,
            end_offset: end,
            secure: true,
        });

        res.json({
            success: true,
            trimmedUrl,
            publicId,
            start,
            end,
        });
    } catch (error) {
        console.error('Trim error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
