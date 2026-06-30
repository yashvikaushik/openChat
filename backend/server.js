const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static assets from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback for SPA routing/direct access (redirects unrecognized paths to index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
