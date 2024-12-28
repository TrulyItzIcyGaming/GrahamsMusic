document.addEventListener('DOMContentLoaded', () => {
    fetch('/music-files')
        .then(response => response.json())
        .then(data => {
            const musicGallery = document.getElementById('music-gallery');
            displayAlbums(data.albums, musicGallery);
        })
        .catch(error => console.error('Error fetching music files:', error));
});

function displayAlbums(albums, musicGallery) {
    musicGallery.innerHTML = ''; // Clear the gallery
    albums.forEach(album => {
        const albumBox = document.createElement('div');
        albumBox.classList.add('album-box');

        // Check for different image formats
        const imageFormats = ['jpg', 'jpeg', 'png', 'gif'];
        let albumImageSrc = '';
        for (const format of imageFormats) {
            const imagePath = `src/music/${album.album}/cover.${format}`;
            if (imageExists(imagePath)) {
                albumImageSrc = imagePath;
                break;
            }
        }

        const albumImage = document.createElement('img');
        albumImage.src = albumImageSrc || 'src/music/default-cover.jpg'; // Fallback to a default image if no cover is found
        albumImage.alt = `${album.album} cover`;
        albumBox.appendChild(albumImage);

        const albumTitle = document.createElement('h3');
        albumTitle.textContent = album.album;
        albumBox.appendChild(albumTitle);

        albumBox.addEventListener('click', () => {
            displayAlbum(album, albums, musicGallery);
        });

        musicGallery.appendChild(albumBox);
    });
}

function displayAlbum(album, albums, musicGallery) {
    const albumSection = document.createElement('section');
    albumSection.classList.add('album');

    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.addEventListener('click', () => {
        displayAlbums(albums, musicGallery);
    });
    albumSection.appendChild(backButton);

    const albumTitle = document.createElement('h3');
    albumTitle.textContent = album.album;
    albumSection.appendChild(albumTitle);

    const musicList = document.createElement('ul');
    musicList.classList.add('music-list');
    album.files.forEach(file => {
        const listItem = document.createElement('li');
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = `src/music/${album.album}/${file}`;
        listItem.textContent = file;
        listItem.appendChild(audio);
        musicList.appendChild(listItem);
    });
    albumSection.appendChild(musicList);

    musicGallery.innerHTML = ''; // Clear the gallery
    musicGallery.appendChild(albumSection);
}

// Helper function to check if an image exists
function imageExists(imageUrl) {
    const http = new XMLHttpRequest();
    http.open('HEAD', imageUrl, false);
    http.send();
    return http.status !== 404;
}