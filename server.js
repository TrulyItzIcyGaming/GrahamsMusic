const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/music-files', (req, res) => {
    const musicDir = path.join(__dirname, 'src/music');
    fs.readdir(musicDir, (err, albums) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read music directory' });
        }
        const albumPromises = albums.map(album => {
            return new Promise((resolve, reject) => {
                const albumPath = path.join(musicDir, album);
                fs.readdir(albumPath, (err, files) => {
                    if (err) {
                        return reject(err);
                    }
                    const musicFiles = files.filter(file => file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.m4a'));
                    resolve({ album, files: musicFiles });
                });
            });
        });
        Promise.all(albumPromises)
            .then(albums => res.json(albums))
            .catch(error => res.status(500).json({ error: 'Failed to read music files' }));
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});