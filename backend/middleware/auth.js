const prisma = require('../lib/db');

/**
 * Middleware that requires a valid session.
 * Attaches the full user object (sans passwordHash) to req.user.
 * Returns 401 if not authenticated.
 */
async function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required. Please log in.',
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.session.userId },
            select: { id: true, email: true, displayName: true, createdAt: true },
        });

        if (!user) {
            // Session references a deleted user — destroy the stale session
            req.session.destroy();
            return res.status(401).json({
                success: false,
                error: 'Session expired. Please log in again.',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ success: false, error: 'Authentication check failed.' });
    }
}

module.exports = { requireAuth };
