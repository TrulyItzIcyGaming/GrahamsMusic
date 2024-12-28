const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the src directory
app.use('/src', express.static(path.join(__dirname, 'src')));

// Serve the index.html file from the root directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to fetch music files
app.get('/music-files', (req, res) => {
    const musicDir = path.join(__dirname, 'src', 'music');
    fs.readdir(musicDir, (err, albums) => {
        if (err) {
            return res.status(500).send('Error reading music directory');
        }

        const albumPromises = albums.map(album => {
            const albumPath = path.join(musicDir, album);
            return new Promise((resolve, reject) => {
                fs.readdir(albumPath, (err, files) => {
                    if (err) {
                        return reject(err);
                    }
                    const musicFiles = files.filter(file => file.endsWith('.mp3'));
                    resolve({ album, files: musicFiles });
                });
            });
        });

        Promise.all(albumPromises)
            .then(albums => res.json({ albums }))
            .catch(err => res.status(500).send('Error reading album files'));
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});