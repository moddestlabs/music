// Music data with encrypted passwords (using simple hash for demo)
const musicData = [
    {
        id: 1,
        title: "Midnight Dreams",
        artist: "Luna Echo",
        duration: "3:45",
        // Password: "music123"
        passwordHash: "000000000000000000000000324be1ed",
        audioUrl: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
    },
    {
        id: 2,
        title: "Electric Sunrise",
        artist: "Neon Waves",
        duration: "4:12",
        // Password: "sunset99"
        passwordHash: "00000000000000000000000066667bca",
        audioUrl: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
    },
    {
        id: 3,
        title: "Ocean Whispers",
        artist: "Blue Horizon",
        duration: "5:20",
        // Password: "wave2024"
        passwordHash: "000000000000000000000000658a3a04",
        audioUrl: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
    },
    {
        id: 4,
        title: "Desert Storm",
        artist: "Sand Dunes",
        duration: "3:58",
        // Password: "storm456"
        passwordHash: "000000000000000000000000674a5e3d",
        audioUrl: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
    },
    {
        id: 5,
        title: "City Lights",
        artist: "Urban Pulse",
        duration: "4:30",
        // Password: "city777"
        passwordHash: "0000000000000000000000002f5f4d62",
        audioUrl: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
    },
    {
        id: 6,
        title: "Mountain Echo",
        artist: "Alpine Sounds",
        duration: "6:15",
        // Password: "peak2026"
        passwordHash: "00000000000000000000000062ca60db",
        audioUrl: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
    }
];

// Simple hash function for demo purposes ONLY
// WARNING: This is NOT secure for production use!
// For real applications, use proper cryptographic hashing like bcrypt or Web Crypto API
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(32, '0');
}

// Current state
let currentSong = null;
let audioPlayer = null;
let isPlaying = false;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderMusicList();
    setupEventListeners();
    audioPlayer = document.getElementById('audioPlayer');
});

// Render music list
function renderMusicList() {
    const musicList = document.getElementById('musicList');
    musicList.innerHTML = musicData.map(song => `
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
                        <div class="music-item-artist">${song.artist}</div>
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
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
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
    const song = musicData.find(s => s.id === songId);
    if (!song) return;
    
    currentSong = song;
    
    document.getElementById('modalSongTitle').textContent = song.title;
    document.getElementById('modalArtist').textContent = song.artist;
    document.getElementById('modalDuration').textContent = song.duration;
    document.getElementById('passwordInput').value = '';
    document.getElementById('errorMessage').textContent = '';
    
    document.getElementById('passwordModal').classList.add('active');
    document.getElementById('passwordInput').focus();
}

// Close password modal
function closePasswordModal() {
    document.getElementById('passwordModal').classList.remove('active');
    // Don't clear currentSong here as it's needed for the player
}

// Handle password submission
function handlePasswordSubmit(e) {
    e.preventDefault();
    
    const password = document.getElementById('passwordInput').value;
    const hashedPassword = simpleHash(password);
    
    if (hashedPassword === currentSong.passwordHash) {
        closePasswordModal();
        openPlayerModal();
    } else {
        document.getElementById('errorMessage').textContent = '❌ Incorrect password. Please try again.';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }
}

// Open player modal
function openPlayerModal() {
    document.getElementById('playerSongTitle').textContent = currentSong.title;
    document.getElementById('playerArtist').textContent = currentSong.artist;
    
    // Set audio source
    audioPlayer.src = currentSong.audioUrl;
    audioPlayer.load();
    
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
    const currentIndex = musicData.findIndex(s => s.id === currentSong.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : musicData.length - 1;
    currentSong = musicData[prevIndex];
    
    updatePlayerWithNewSong();
}

// Play next song
function playNext() {
    const currentIndex = musicData.findIndex(s => s.id === currentSong.id);
    const nextIndex = currentIndex < musicData.length - 1 ? currentIndex + 1 : 0;
    currentSong = musicData[nextIndex];
    
    updatePlayerWithNewSong();
}

// Update player with new song
function updatePlayerWithNewSong() {
    document.getElementById('playerSongTitle').textContent = currentSong.title;
    document.getElementById('playerArtist').textContent = currentSong.artist;
    document.getElementById('totalTime').textContent = currentSong.duration;
    
    audioPlayer.src = currentSong.audioUrl;
    audioPlayer.load();
    playAudio();
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

// Add helpful hints for users (displayed in console)
console.log('%c🎵 JMusic - Password Protected Music Library', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cPassword hints for demo:', 'font-size: 14px; color: #a855f7;');
console.log('Midnight Dreams: music123');
console.log('Electric Sunrise: sunset99');
console.log('Ocean Whispers: wave2024');
console.log('Desert Storm: storm456');
console.log('City Lights: city777');
console.log('Mountain Echo: peak2026');
