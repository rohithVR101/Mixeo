const express = require('express');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const upload = require('../middleware/upload');
const { requireAuth } = require('../middleware/auth');
const prisma = require('../lib/db');

const router = express.Router();

// POST /api/upload — Receive a video file, upload to Cloudinary, return JSON metadata.
// Previously: POST /new → res.render('pages/new', { publicId, secureUrl, duration })
router.post('/upload', requireAuth, upload.single('upload'), async (req, res) => {
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

        // Persist video record in database
        const video = await prisma.video.create({
            data: {
                userId: req.user.id,
                cloudinaryId: result.public_id,
                secureUrl: result.secure_url,
                duration: result.duration,
            },
        });

        res.json({
            success: true,
            id: video.id,
            publicId: video.cloudinaryId,
            secureUrl: video.secureUrl,
            duration: video.duration,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, error: 'Video upload failed. Please try again.' });
    }
});

// POST /api/stage — Generate a Cloudinary URL with trim transformations.
// Previously: POST /stage → res.json({ trimmedUrl })  (unchanged behaviour, just moved)
router.post('/stage', requireAuth, async (req, res) => {
    try {
        const { publicId, start, end } = req.body;

        if (!publicId || start === undefined || end === undefined) {
            return res.status(400).json({
                success: false,
                error: 'publicId, start, and end are required.',
            });
        }

        const trimmedUrl = cloudinary.url(publicId, {
            resource_type: 'video',
            start_offset: start,
            end_offset: end,
            secure: true,
        });

        // Find the source video by its Cloudinary public_id
        const video = await prisma.video.findFirst({
            where: { cloudinaryId: publicId, userId: req.user.id },
        });

        // Persist clip record in database
        let clip = null;
        if (video) {
            clip = await prisma.clip.create({
                data: {
                    videoId: video.id,
                    userId: req.user.id,
                    startOffset: start,
                    endOffset: end,
                    trimmedUrl,
                },
            });
        }

        res.json({
            success: true,
            trimmedUrl,
            clipId: clip?.id || null,
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
