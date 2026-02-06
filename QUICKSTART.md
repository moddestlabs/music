# 🎵 JMusic - Quick Start Guide

## For First-Time Setup

### 1. Clone or Fork This Repository
```bash
git clone https://github.com/maddestlabs/jmusic.git
cd jmusic
```

### 2. Enable GitHub Pages
- Go to repository Settings → Pages
- Select Source: `main` branch
- Save and wait for deployment
- Your site will be at: `https://maddestlabs.github.io/jmusic/`

### 3. Add Your First Song

#### Open Admin Tool
Visit: `https://maddestlabs.github.io/jmusic/admin.html`

Or open `admin.html` locally in your browser.

#### Encrypt a Song
1. Click "Select Audio File" and choose an MP3
2. (Optional) Add genres: `Electronic, Chill, Ambient`
3. Enter a password (you'll share this with listeners)
4. Click "Encrypt & Generate Files"
5. Download both files:
   - `your-song-name.encrypted`
   - `your-song-name.json`

#### Upload to GitHub
1. Go to your repo → `music` folder
2. Click "Add file" → "Upload files"
3. Drag both files
4. Edit `catalog.json` (click the file, then pencil icon)
5. Add your song's filename:
   ```json
   {
     "songs": [
       "your-song-name"
     ]
   }
   ```
6. Commit changes

### 4. Share Your Music
- Share the main URL: `https://yourusername.github.io/jmusic/`
- Share the password privately with listeners
- They can now play your encrypted music!

## For Listeners

### Playing a Song
1. Visit the JMusic website
2. (Optional) Filter by genre using the dropdown
3. Click on a song
4. Enter the password provided by the uploader
5. Enjoy! Use play/pause, skip, volume controls

### Troubleshooting
- **"Incorrect password"** - Ask the uploader for the correct password
- **Song won't load** - Check your internet connection
- **Player not working** - Try a modern browser (Chrome, Firefox, Safari, Edge)

## Adding More Songs

Once you've added your first song, adding more is easy:

1. Open `admin.html`
2. Encrypt new song
3. Upload `.encrypted` and `.json` to `/music/`
4. Add filename to `catalog.json`
5. Done!

## Pro Tips

### Organizing with Genres
- Use consistent genre names: "Electronic" not "electronic" or "ELECTRONIC"
- Popular genres: Rock, Pop, Jazz, Classical, Electronic, Ambient, Chill, etc.
- Songs can have multiple genres: "Electronic, Ambient, Chill"

### Managing Passwords
- Each song can have a different password
- For public releases: Use one password for all songs
- For private collections: Use unique passwords per song or album

### Performance
- Encrypted files are cached after first decode
- Larger files (>10MB) may take a few seconds to decrypt
- Compress audio before encrypting for faster loading

## Advanced: Running Locally

### Simple HTTP Server
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server
```

Then visit: `http://localhost:8000`

### Why You Need a Server
- File loading from `/music/` requires HTTP/HTTPS (not `file://`)
- GitHub Pages provides this automatically
- For local development, use the commands above

## Need Help?

1. **Check the main README.md** - Comprehensive documentation
2. **Check music/README.md** - Song management details
3. **Browser Console** - Press F12 to see error messages
4. **GitHub Issues** - Report bugs or ask questions

## Security Reminder

🔒 This encrypts your audio files, but:
- Anyone with the password can decrypt
- Use strong passwords
- Don't commit passwords to the repo
- Share passwords securely (not in public places)

## What's Next?

- Customize colors in `styles.css`
- Create playlists with genre filtering
- Share with friends and enjoy your secure music library!

---

**Happy listening! 🎧**
