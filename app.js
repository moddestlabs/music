// Music library state
let musicLibrary = []; // Will be populated from /music/ folder
let filteredMusic = [];
let currentSong = null;
let audioPlayer = null;
let isPlaying = false;
let decryptedAudioCache = new Map(); // Cache decrypted audio blobs

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
    audioPlayer = document.getElementById('audioPlayer');
    setupEventListeners();
    await loadMusicLibrary();
    renderMusicList();
});

// Load music library from /music/ folder
async function loadMusicLibrary() {
    const musicList = document.getElementById('musicList');
    const songCount = document.getElementById('songCount');
    
    try {
        // Fetch the music catalog (you'll need to create this file or use a directory listing)
        // For GitHub Pages, we'll need to maintain a catalog.json file
        const response = await fetch('music/catalog.json');
        
        if (!response.ok) {
            throw new Error('Could not load music catalog');
        }
        
        const catalog = await response.json();
        
        // Load metadata for each song
        const metadataPromises = catalog.songs.map(async (songFilename) => {
            try {
                const metadataResponse = await fetch(`music/${songFilename}.json`);
                if (metadataResponse.ok) {
                    const metadata = await metadataResponse.json();
                    return {
                        ...metadata,
                        id: generateId(metadata.filename)
                    };
                }
            } catch (error) {
                console.error(`Failed to load metadata for ${songFilename}:`, error);
            }
            return null;
        });
        
        const loadedMetadata = await Promise.all(metadataPromises);
        musicLibrary = loadedMetadata.filter(m => m !== null);
        filteredMusic = [...musicLibrary];
        
        // Populate genre filter
        populateGenreFilter();
        
        // Update song count
        updateSongCount();
        
    } catch (error) {
        console.error('Error loading music library:', error);
        musicList.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <h3 style="margin-bottom: 1rem;">No music catalog found</h3>
                <p>Create a <code>music/catalog.json</code> file to get started.</p>
                <p style="margin-top: 1rem; font-size: 0.9rem;">
                    Example: <code>{"songs": ["song1", "song2"]}</code>
                </p>
            </div>
        `;
        songCount.textContent = '0 songs';
    }
}

// Generate unique ID from filename
function generateId(filename) {
    let hash = 0;
    for (let i = 0; i < filename.length; i++) {
        hash = ((hash << 5) - hash) + filename.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// Populate genre filter checkboxes
function populateGenreFilter() {
    const genreFiltersContainer = document.getElementById('genreFilters');
    const allGenres = new Set();
    
    musicLibrary.forEach(song => {
        if (song.genres && Array.isArray(song.genres)) {
            song.genres.forEach(genre => allGenres.add(genre));
        }
    });
    
    // Sort genres alphabetically
    const sortedGenres = Array.from(allGenres).sort();
    
    // Clear existing checkboxes
    genreFiltersContainer.innerHTML = '';
    
    if (sortedGenres.length === 0) {
        genreFiltersContainer.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.85rem;">No genres available</p>';
        return;
    }
    
    // Add genre checkboxes
    sortedGenres.forEach(genre => {
        const item = document.createElement('div');
        item.className = 'genre-filter-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `genre-${genre.replace(/\s+/g, '-').toLowerCase()}`;
        checkbox.className = 'genre-checkbox';
        checkbox.value = genre;
        checkbox.addEventListener('change', handleGenreFilterChange);
        
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.className = 'genre-label';
        label.textContent = genre;
        
        item.appendChild(checkbox);
        item.appendChild(label);
        genreFiltersContainer.appendChild(item);
    });
}

// Handle genre filter changes
function handleGenreFilterChange() {
    const selectedGenres = getSelectedGenres();
    const clearButton = document.getElementById('clearFilters');
    
    // Show/hide clear button
    if (selectedGenres.length > 0) {
        clearButton.style.display = 'block';
    } else {
        clearButton.style.display = 'none';
    }
    
    filterByGenres(selectedGenres);
}

// Get currently selected genres
function getSelectedGenres() {
    const checkboxes = document.querySelectorAll('.genre-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// Filter music by selected genres (OR logic - show if song matches ANY selected genre)
function filterByGenres(selectedGenres) {
    if (selectedGenres.length === 0) {
        // No filters selected - show all
        filteredMusic = [...musicLibrary];
    } else {
        // Show songs that have at least one of the selected genres
        filteredMusic = musicLibrary.filter(song => {
            if (!song.genres || !Array.isArray(song.genres)) {
                return false;
            }
            return song.genres.some(genre => selectedGenres.includes(genre));
        });
    }
    updateSongCount();
    renderMusicList();
}

// Clear all genre filters
function clearAllFilters() {
    const checkboxes = document.querySelectorAll('.genre-checkbox');
    checkboxes.forEach(cb => cb.checked = false);
    handleGenreFilterChange();
}

// Update song count display
function updateSongCount() {
    const songCount = document.getElementById('songCount');
    const total = musicLibrary.length;
    const filtered = filteredMusic.length;
    
    if (filtered === total) {
        songCount.textContent = `${total} song${total !== 1 ? 's' : ''}`;
    } else {
        songCount.textContent = `${filtered} of ${total} song${total !== 1 ? 's' : ''}`;
    }
}

// Render music list
function renderMusicList() {
    const musicList = document.getElementById('musicList');
    
    if (filteredMusic.length === 0) {
        musicList.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <p>No songs found matching the selected filter.</p>
            </div>
        `;
        return;
    }
    
    musicList.innerHTML = filteredMusic.map(song => {
        const genreTags = song.genres && song.genres.length > 0
            ? `<div class="genre-tags">${song.genres.map(g => `<span class="genre-tag">${g}</span>`).join('')}</div>`
            : '';
        
        return `
            <div class="music-item" onclick="openPasswordModal(${song.id})">
                <div class="music-item-content">
                    <div class="music-item-header">
                        <div class="music-icon">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                                <circle cx="10" cy="17" r="2"/>
                            </svg>
                        </div>
                        <div>
                            <div class="music-item-title">${song.title}</div>
                            ${genreTags}
                        </div>
                    </div>
                    <div class="music-item-meta">
                        <span class="music-duration">${song.duration}</span>
                        <span class="lock-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Clear filters button
    const clearButton = document.getElementById('clearFilters');
    if (clearButton) {
        clearButton.addEventListener('click', clearAllFilters);
    }
    
    // Password modal
    const modalClose = document.getElementById('modalClose');
    const passwordForm = document.getElementById('passwordForm');
    
    if (modalClose) modalClose.addEventListener('click', closePasswordModal);
    if (passwordForm) passwordForm.addEventListener('submit', handlePasswordSubmit);
    
    // Player modal
    const playerClose = document.getElementById('playerClose');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const progressBar = document.getElementById('progressBar');
    
    if (playerClose) playerClose.addEventListener('click', closePlayerModal);
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    if (prevBtn) prevBtn.addEventListener('click', playPrevious);
    if (nextBtn) nextBtn.addEventListener('click', playNext);
    if (volumeSlider) volumeSlider.addEventListener('input', handleVolumeChange);
    if (progressBar) progressBar.addEventListener('click', handleProgressClick);
    
    // Audio events
    if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('ended', handleSongEnd);
    }
    
    // Close modals on background click
    const passwordModal = document.getElementById('passwordModal');
    const playerModal = document.getElementById('playerModal');
    
    if (passwordModal) {
        passwordModal.addEventListener('click', (e) => {
            if (e.target.id === 'passwordModal') closePasswordModal();
        });
    }
    if (playerModal) {
        playerModal.addEventListener('click', (e) => {
            if (e.target.id === 'playerModal') closePlayerModal();
        });
    }
}

// Open password modal
function openPasswordModal(songId) {
    const song = musicLibrary.find(s => s.id === songId);
    if (!song) return;
    
    currentSong = song;
    
    document.getElementById('modalSongTitle').textContent = song.title;
    document.getElementById('modalArtist').textContent = song.genres && song.genres.length > 0 
        ? song.genres.join(', ') 
        : 'No genre';
    document.getElementById('modalDuration').textContent = song.duration;
    document.getElementById('passwordInput').value = '';
    document.getElementById('errorMessage').textContent = '';
    
    document.getElementById('passwordModal').classList.add('active');
    document.getElementById('passwordInput').focus();
}

// Close password modal
function closePasswordModal() {
    document.getElementById('passwordModal').classList.remove('active');
}

// Handle password submission
async function handlePasswordSubmit(e) {
    e.preventDefault();
    
    const password = document.getElementById('passwordInput').value;
    const errorMessage = document.getElementById('errorMessage');
    
    try {
        // Show loading state
        errorMessage.textContent = '🔓 Decrypting...';
        errorMessage.style.color = 'var(--text-secondary)';
        
        // Try to decrypt the file
        const decryptedBlob = await decryptAudioFile(currentSong, password);
        
        // If successful, close modal and open player
        closePasswordModal();
        openPlayerModal(decryptedBlob);
        
    } catch (error) {
        console.error('Decryption error:', error);
        errorMessage.textContent = '❌ Incorrect password. Please try again.';
        errorMessage.style.color = 'var(--error)';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }
}

// Decrypt audio file using Web Crypto API
async function decryptAudioFile(song, password) {
    // Check cache first
    const cacheKey = `${song.filename}-${password}`;
    if (decryptedAudioCache.has(cacheKey)) {
        return decryptedAudioCache.get(cacheKey);
    }
    
    try {
        // Fetch encrypted file
        const response = await fetch(`music/${song.filename}.encrypted`);
        if (!response.ok) {
            throw new Error('Could not load encrypted file');
        }
        
        const encryptedData = await response.arrayBuffer();
        
        // Convert base64 salt and IV to ArrayBuffer
        const salt = base64ToArrayBuffer(song.salt);
        const iv = base64ToArrayBuffer(song.iv);
        
        // Derive key from password using PBKDF2
        const passwordBuffer = new TextEncoder().encode(password);
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            'PBKDF2',
            false,
            ['deriveBits', 'deriveKey']
        );
        
        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt']
        );
        
        // Decrypt the data
        const decryptedData = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            encryptedData
        );
        
        // Create blob from decrypted data
        const blob = new Blob([decryptedData], { type: 'audio/mpeg' });
        
        // Cache the decrypted blob
        decryptedAudioCache.set(cacheKey, blob);
        
        return blob;
        
    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error('Decryption failed - incorrect password or corrupted file');
    }
}

// Convert base64 string to ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// Open player modal
function openPlayerModal(decryptedBlob) {
    document.getElementById('playerSongTitle').textContent = currentSong.title;
    document.getElementById('playerArtist').textContent = currentSong.genres && currentSong.genres.length > 0
        ? currentSong.genres.join(', ')
        : 'No genre';
    
    // Create object URL from decrypted blob
    const audioUrl = URL.createObjectURL(decryptedBlob);
    audioPlayer.src = audioUrl;
    audioPlayer.load();
    
    // Clean up old object URLs when audio is loaded
    audioPlayer.addEventListener('loadeddata', () => {
        // Store the URL to revoke it later
        if (audioPlayer.dataset.currentUrl) {
            URL.revokeObjectURL(audioPlayer.dataset.currentUrl);
        }
        audioPlayer.dataset.currentUrl = audioUrl;
    }, { once: true });
    
    // Reset player state
    isPlaying = false;
    document.getElementById('playIcon').style.display = 'block';
    document.getElementById('pauseIcon').style.display = 'none';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('currentTime').textContent = '0:00';
    document.getElementById('totalTime').textContent = currentSong.duration;
    
    document.getElementById('playerModal').classList.add('active');
    
    // Auto-play
    playAudio();
}

// Close player modal
function closePlayerModal() {
    document.getElementById('playerModal').classList.remove('active');
    audioPlayer.pause();
    isPlaying = false;
}

// Toggle play/pause
function togglePlayPause() {
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
}

// Play audio
function playAudio() {
    audioPlayer.play().catch(err => {
        console.log('Playback error:', err);
    });
    isPlaying = true;
    document.getElementById('playIcon').style.display = 'none';
    document.getElementById('pauseIcon').style.display = 'block';
}

// Pause audio
function pauseAudio() {
    audioPlayer.pause();
    isPlaying = false;
    document.getElementById('playIcon').style.display = 'block';
    document.getElementById('pauseIcon').style.display = 'none';
}

// Play previous song
function playPrevious() {
    const currentIndex = filteredMusic.findIndex(s => s.id === currentSong.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredMusic.length - 1;
    
    // Close player and open password modal for previous song
    closePlayerModal();
    setTimeout(() => {
        openPasswordModal(filteredMusic[prevIndex].id);
    }, 100);
}

// Play next song
function playNext() {
    const currentIndex = filteredMusic.findIndex(s => s.id === currentSong.id);
    const nextIndex = currentIndex < filteredMusic.length - 1 ? currentIndex + 1 : 0;
    
    // Close player and open password modal for next song
    closePlayerModal();
    setTimeout(() => {
        openPasswordModal(filteredMusic[nextIndex].id);
    }, 100);
}

// Update player with new song (deprecated - now using prev/next with password modal)
function updatePlayerWithNewSong() {
    // This function is no longer used since each song requires password entry
    // Kept for compatibility but should use playNext/playPrevious instead
}

// Handle volume change
function handleVolumeChange(e) {
    audioPlayer.volume = e.target.value / 100;
}

// Handle progress bar click
function handleProgressClick(e) {
    const progressBar = e.currentTarget;
    const clickPosition = e.offsetX;
    const barWidth = progressBar.offsetWidth;
    const percentage = clickPosition / barWidth;
    
    audioPlayer.currentTime = audioPlayer.duration * percentage;
}

// Update progress
function updateProgress() {
    if (audioPlayer.duration) {
        const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        document.getElementById('progressFill').style.width = percentage + '%';
        document.getElementById('currentTime').textContent = formatTime(audioPlayer.currentTime);
    }
}

// Handle song end
function handleSongEnd() {
    playNext();
}

// Format time (seconds to mm:ss)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
