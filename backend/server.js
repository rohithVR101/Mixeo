require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS — allows the Vite dev server (port 5173) to call this API (port 3000)
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API routes — all endpoints are under /api
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

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
