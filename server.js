const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Global variable to hold the most recent data packet from ESP32
let latestTelemetry = {
    solar: { v: 0, c: 0, p: 0 },
    wind: { v: 0, c: 0, p: 0 },
    ac: { v: 0, p: 0 }
};

// 1. Hardware posts data here every few seconds
app.post('/api/data', (req, res) => {
    latestTelemetry = req.body;
    res.status(200).json({ status: "success" });
});

// 2. UI fetches data from here ONLY when the button is clicked
app.get('/api/data', (req, res) => {
    // Explicitly prevent browsers from caching older sensor packets
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    });
    res.json(latestTelemetry);
});

const PORT = process.env.PORT || 3000;
server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));