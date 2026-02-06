# Music Project - Secure Music Library

A password-protected music web application with client-side encryption, built for GitHub Pages.

## Features

- "Just works."

## Quick Start

### For Users

1. Visit the website
2. Browse the music library
3. Click on a song and enter its password
4. Use the genre filter to find specific types of music
5. Enjoy secure playback!

### For Admins (Adding Songs)

1. Open `admin.html` in your browser
2. Upload an MP3 file
3. Add genres (optional, comma-separated)
4. Enter a password for the song
5. Download the generated `.encrypted` and `.json` files
6. Upload both files to the `/music/` folder via GitHub
7. Update `/music/catalog.json` with the new song filename

**Example catalog.json:**
```json
{
  "songs": [
    "my-first-song",
    "another-track"
  ]
}
```

## 📁 Project Structure

```
music/
├── index.html           # Main music player interface
├── admin.html           # Song encryption tool
├── app.js              # Player logic and decryption
├── styles.css          # Styling and animations
├── favicon.svg         # Main favicon (SVG, all modern browsers)
├── apple-touch-icon.svg # iOS home screen icon
├── icon-192.svg        # Android/Chrome icon
├── icon-512.svg        # High-res icon for PWA
├── site.webmanifest    # PWA manifest
├── music/              # Encrypted songs folder
│   ├── catalog.json    # List of available songs
│   ├── song.encrypted  # Encrypted audio file
│   ├── song.json       # Song metadata
│   └── README.md       # Music folder documentation
├── README.md           # This file
├── QUICKSTART.md       # Quick start guide
└── FAVICON.md          # Favicon setup guide
```

## 🔐 How Encryption Works

### Admin Tool (admin.html)
- Uses Web Crypto API for client-side encryption
- Generates random salt and IV for each file
- Derives encryption key using PBKDF2 (100,000 iterations)
- Encrypts file with AES-256-GCM
- Outputs two files:
  - `.encrypted` - The encrypted audio data
  - `.json` - Metadata including salt, IV, title, genres, duration

### Player (index.html + app.js)
- Loads metadata from `/music/` folder
- When user enters password:
  - Fetches encrypted file
  - Derives same encryption key from password + stored salt
  - Decrypts using stored IV
  - Creates audio blob for playback
- Caches decrypted audio for performance

## 🎭 Genre Filtering

Songs can be tagged with multiple genres:
- Filter dropdown automatically populates with all available genres
- Click a genre to show only matching songs
- Select "All Genres" to see the complete library

Genre examples: Electronic, Ambient, Chill, Rock, Jazz, Classical, etc.

## � Progressive Web App (PWA)

Music can be installed as a standalone app on any device:

### Desktop (Chrome, Edge)
1. Visit your Music site
2. Click the install icon in the address bar
3. Confirm installation
4. Music opens in its own window

### iOS/iPadOS (Safari)
1. Open Music in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Custom icon appears on your home screen

### Android (Chrome)
1. Visit Music in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home Screen" or "Install app"
4. App icon added to your launcher

Once installed, Music works like a native app with offline capabilities for the interface (songs still require internet to load initially).

## �🔧 Technologies Used

- **HTML5** - Structure and audio element
- **CSS3** - Modern styling with gradients, animations, grid/flexbox
- **Vanilla JavaScript (ES6+)** - No frameworks, pure JS
- **Web Crypto API** - Browser-native encryption/decryption
- **GitHub Pages** - Static hosting (no server needed)

## 🌐 Browser Compatibility

Requires modern browsers with support for:
- Web Crypto API (AES-GCM, PBKDF2)
- CSS Grid & Flexbox
- HTML5 Audio API
- ES6+ JavaScript (async/await, Promises, arrow functions)

Tested on: Chrome, Firefox, Safari, Edge (latest versions)

## 📝 Adding Your First Song

1. **Prepare your MP3 file**
   - Any standard MP3 file will work

2. **Open admin.html**
   - Can be opened locally or served via GitHub Pages

3. **Upload and encrypt**
   - Select your MP3
   - Add genres (e.g., "Electronic, Chill")
   - Choose a strong password
   - Click "Encrypt & Generate Files"

4. **Download both files**
   - `song-name.encrypted`
   - `song-name.json`

5. **Add to repository**
   - Upload both files to `/music/` folder
   - Edit `/music/catalog.json`:
     ```json
     {
       "songs": ["song-name"]
     }
     ```

6. **Commit and push**
   - Changes go live automatically on GitHub Pages

## 🔒 Security Notes

- **Password Storage**: Passwords are NEVER stored anywhere
- **Encryption**: Uses industry-standard AES-256-GCM
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Unique Keys**: Each file has unique salt and IV
- **Client-Side Only**: All encryption/decryption happens in browser
- **No Server Required**: Fully static application

**Important**: This provides confidentiality for audio files, but remember:
- Anyone with the password can decrypt the file
- Choose strong, unique passwords for each song
- Don't share passwords in public repositories

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary: #6366f1;
    --secondary: #a855f7;
    --background: #0f0f1a;
}
```

### Genres
Add any genres you want - the filter automatically adapts

### Branding
Update logo SVG in `index.html` and page titles

## 📄 License

MIT License - Feel free to use and modify

## 🙋 Support

For issues or questions:
1. Check `/music/README.md` for song management help
2. Review browser console for error messages
3. Ensure all files are properly uploaded to GitHub
