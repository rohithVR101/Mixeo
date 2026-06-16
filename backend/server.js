const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const app = express();

// CORS — allows the Vite dev server (port 5173) to call this API (port 3000)
// credentials: true is required for cookies to be sent cross-origin
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Session middleware ─────────────────────────────────────────────────────
app.use(session({
    store: new pgSession({
        conString: process.env.DATABASE_URL,
        tableName: 'session',        // table name in Postgres
        createTableIfMissing: true,   // auto-create session table on first run
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
        httpOnly: true,                     // not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production',  // HTTPS only in prod
        sameSite: 'lax',
    },
}));

// API routes
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

// Production: serve the Vite-built React frontend as static files
if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '..', 'frontend', 'dist');
    app.use(express.static(distPath));

    // Client-side routing fallback — any non-API GET returns index.html
    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Mixeo API running on port ${PORT}`);
});
