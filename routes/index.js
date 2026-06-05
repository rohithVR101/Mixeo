const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configure multer for temporary file storage
const upload = multer({ dest: path.join(__dirname, '..', 'tmp') });

// --- ROUTES ---

// GET / — Landing page
router.get('/', (req, res) => {
    res.render("pages/index", {});
});

// GET /community — Community page
router.get('/community', (req, res) => {
    res.render("pages/community", {});
});

// POST /new — Upload video to Cloudinary, render editor
router.post("/new", upload.single('upload'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "video",
            folder: "mixeo"
        });

        // Clean up temp file
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Temp file cleanup error:", err);
        });

        res.render("pages/new", {
            publicId: result.public_id,
            secureUrl: result.secure_url,
            duration: result.duration
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).render("pages/index", {
            error: "Video upload failed. Please try again."
        });
    }
});

// POST /stage — Generate trimmed Cloudinary URL
router.post("/stage", async (req, res) => {
    try {
        const { publicId, start, end } = req.body;

        const trimmedUrl = cloudinary.url(publicId, {
            resource_type: 'video',
            start_offset: start,
            end_offset: end,
            secure: true
        });

        res.json({
            success: true,
            trimmedUrl: trimmedUrl,
            publicId: publicId,
            start: start,
            end: end
        });
    } catch (error) {
        console.error("Trim error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /preview — Preview trimmed video
router.get("/preview", (req, res) => {
    const { url } = req.query;
    res.render("pages/preview", {
        videoUrl: url || ''
    });
});

module.exports = router;