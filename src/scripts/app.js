document.addEventListener('DOMContentLoaded', () => {
    const musicGallery = document.getElementById('albums');

    fetch('/music-files')
        .then(response => response.json())
        .then(data => {
            data.albums.forEach(album => {
                const albumSection = document.createElement('section');
                albumSection.innerHTML = `<h3>${album.album}</h3>`;
                const musicList = document.createElement('ul');

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
                musicGallery.appendChild(albumSection);
            });
        })
        .catch(error => console.error('Error fetching music files:', error));
});

// Helper function to check if an image exists
function imageExists(imageUrl) {
    const http = new XMLHttpRequest();
    http.open('HEAD', imageUrl, false);
    http.send();
    return http.status !== 404;
}