document.addEventListener('DOMContentLoaded', () => {
    // API ENDPOINTS
    const USER_API_BASE_URL = window.USER_API_BASE_URL;
    const SONG_API_BASE_URL = window.SONG_API_BASE_URL;
    const PLAYLIST_API_BASE_URL = window.PLAYLIST_API_BASE_URL;

    // DOM ELEMENTS
    const messageBox = document.getElementById('message-box');

    // User Service
    const userForm = document.getElementById('user-form');
    const userNameInput = document.getElementById('user-name');
    const userNameDisplay = document.getElementById('user-name-display');
    const userNameDisplay2 = document.getElementById('user-name-display2');

    // Song Service
    const songForm = document.getElementById('song-form');
    const songTitleInput = document.getElementById('song-title');
    const songArtistInput = document.getElementById('song-artist');
    const songDurationInput = document.getElementById('song-duration');
    const songListDiv = document.getElementById('song-list');

    // Playlist Service
    const playlistForm = document.getElementById('playlist-form');
    const playlistNameInput = document.getElementById('playlist-name');
    const playlistListDiv = document.getElementById('playlist-list');
    const playlistListMyDiv = document.getElementById('playlist-list-my');
    const songOptionsDiv = document.getElementById('song-options');
    const addSongsBtn = document.getElementById('add-songs-to-playlist');

    // Navigation buttons
    const goToSongsBtn = document.getElementById('go-to-songs');
    const goToPlaylistsBtn = document.getElementById('go-to-playlists');
    const goToMyPlaylistsBtn = document.getElementById('go-to-my-playlists');
    const backToSongsBtn = document.getElementById('back-to-songs');
    const backToPlaylistCreationBtn = document.getElementById('back-to-playlist-creation');
    const backToSongs2Btn = document.getElementById('back-to-songs2');

    // Sections
    const sectionUser = document.getElementById('section-user');
    const sectionSongs = document.getElementById('section-songs');
    const sectionPlaylists = document.getElementById('section-playlists');
    const sectionMyPlaylists = document.getElementById('section-myplaylists');

    // HELPER FUNCTIONS
    function showSection(section) {
        sectionUser.style.display = 'none';
        sectionSongs.style.display = 'none';
        sectionPlaylists.style.display = 'none';
        sectionMyPlaylists.style.display = 'none';
        section.style.display = 'block';
    }

    function showMessage(msg, isError = false) {
        messageBox.innerText = msg;
        messageBox.style.color = isError ? 'red' : 'green';
    }

    async function loadSongs() {
        try {
            const res = await fetch(`${SONG_API_BASE_URL}/songs/`);
            const songs = await res.json();
            songListDiv.innerHTML = songs.map(
                s => `<p>${s.title} - ${s.artist} (${s.duration})</p>`
            ).join('');
        } catch (err) {
            showMessage('Error loading songs', true);
        }
    }

    async function populateSongOptions() {
        try {
            const res = await fetch(`${SONG_API_BASE_URL}/songs/`);
            const songs = await res.json();
            songOptionsDiv.innerHTML = '';

            songs.forEach(s => {
                const label = document.createElement('label');
                label.innerHTML = `
                    <input type="checkbox" value="${s.id}"> 
                    ${s.title} - ${s.artist} (${s.duration})
                `;
                songOptionsDiv.appendChild(label);
                songOptionsDiv.appendChild(document.createElement('br'));
            });
        } catch (err) {
            showMessage('Error loading songs for playlist', true);
        }
    }

    async function loadPlaylists() {
        try {
            const res = await fetch(`${PLAYLIST_API_BASE_URL}/playlists/`);
            const playlists = await res.json();

            playlistListDiv.innerHTML = playlists.map(
                p => `<div class="playlist">
                         <h3>${p.name}</h3>
                         <ul>${p.songs.map(s => `<li>${s.title} - ${s.artist} (${s.duration})</li>`).join('')}</ul>
                       </div>`
            ).join('');

            playlistListMyDiv.innerHTML = playlists.map(
                p => `<div class="playlist">
                         <h3>${p.name}</h3>
                         <ul>${p.songs.map(s => `<li>${s.title} - ${s.artist} (${s.duration})</li>`).join('')}</ul>
                       </div>`
            ).join('');

        } catch (err) {
            showMessage('Error loading playlists', true);
        }
    }

    // User Form
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = userNameInput.value.trim();
        if (!username) {
            showMessage('Please enter a valid name.', true);
            return;
        }
        try {
            const res = await fetch(`${USER_API_BASE_URL}/users/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: username })
            });
            if (!res.ok) throw new Error('Failed to create user');
            const data = await res.json();
            userNameDisplay.innerText = data.name;
            userNameDisplay2.innerText = data.name;
            showMessage(`Welcome, ${data.name}!`);
            showSection(sectionSongs);
        } catch (err) {
            showMessage(err.message, true);
        }
    });

    // Song Form
    songForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = songTitleInput.value.trim();
        const artist = songArtistInput.value.trim();
        const duration = songDurationInput.value.trim();

        if (!title || !artist || !duration) {
            showMessage('Please fill all song fields.', true);
            return;
        }

        try {
            const res = await fetch(`${SONG_API_BASE_URL}/songs/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, artist, duration })
            });
            if (!res.ok) throw new Error('Failed to add song');
            await loadSongs();
            songForm.reset();
            showMessage('Song added successfully!');
        } catch (err) {
            showMessage(err.message, true);
        }
    });

    // Playlist Form
    playlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = playlistNameInput.value.trim();
        if (!name) {
            showMessage('Playlist name cannot be empty.', true);
            return;
        }
        try {
            const res = await fetch(`${PLAYLIST_API_BASE_URL}/playlists/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            if (!res.ok) throw new Error('Failed to create playlist');
            await loadPlaylists();
            playlistForm.reset();
            showMessage('Playlist created successfully!');
        } catch (err) {
            showMessage(err.message, true);
        }
    });

    // Add selected songs to playlist button
    addSongsBtn.addEventListener('click', async () => {
        const playlistName = playlistNameInput.value.trim();
        if (!playlistName) {
            showMessage('Create a playlist first', true);
            return;
        }
        const checkedBoxes = document.querySelectorAll('#song-options input:checked');
        if (checkedBoxes.length === 0) {
            showMessage('Select at least one song', true);
            return;
        }
        const selectedSongIds = Array.from(checkedBoxes).map(cb => cb.value);

        try {
            const res = await fetch(`${PLAYLIST_API_BASE_URL}/playlists/${playlistName}/add-songs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ song_ids: selectedSongIds })
            });
            if (!res.ok) throw new Error('Failed to add songs to playlist');
            await loadPlaylists();
            showMessage('Songs added to playlist!');
        } catch (err) {
            showMessage(err.message, true);
        }
    });

    // NAVIGATION
    goToPlaylistsBtn.addEventListener('click', () => {
        populateSongOptions();
        showSection(sectionPlaylists);
    });
    goToMyPlaylistsBtn.addEventListener('click', () => {
        loadPlaylists();
        showSection(sectionMyPlaylists);
    });
    backToSongsBtn.addEventListener('click', () => {
        loadSongs();
        showSection(sectionSongs);
    });
    backToPlaylistCreationBtn.addEventListener('click', () => {
        populateSongOptions();
        showSection(sectionPlaylists);
    });
    backToSongs2Btn.addEventListener('click', () => {
        loadSongs();
        showSection(sectionSongs);
    });

    // Start with User section
    showSection(sectionUser);
});