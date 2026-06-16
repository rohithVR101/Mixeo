const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../lib/db');

const router = express.Router();

const SALT_ROUNDS = 12;

// ── POST /api/auth/signup ──────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
    try {
        const { email, displayName, password } = req.body;

        // Validation
        if (!email || !displayName || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email, display name, and password are required.',
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 8 characters.',
            });
        }

        // Check if user already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({
                success: false,
                error: 'An account with this email already exists.',
            });
        }

        // Hash password and create user
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await prisma.user.create({
            data: { email, displayName, passwordHash },
            select: { id: true, email: true, displayName: true, createdAt: true },
        });

        // Set session
        req.session.userId = user.id;

        res.status(201).json({ success: true, user });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, error: 'Signup failed. Please try again.' });
    }
});

// ── POST /api/auth/login ───────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required.',
            });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password.',
            });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password.',
            });
        }

        // Set session
        req.session.userId = user.id;

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Login failed. Please try again.' });
    }
});

// ── POST /api/auth/logout ──────────────────────────────────────────────────
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ success: false, error: 'Logout failed.' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});

// ── GET /api/auth/me ───────────────────────────────────────────────────────
// Returns the currently authenticated user, or 401 if not logged in.
// Called by AuthContext on app mount to restore session after page refresh.
router.get('/me', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, error: 'Not authenticated.' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.session.userId },
            select: { id: true, email: true, displayName: true, createdAt: true },
        });

        if (!user) {
            return res.status(401).json({ success: false, error: 'User not found.' });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({ success: false, error: 'Auth check failed.' });
    }
});

module.exports = router;
