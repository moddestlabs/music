# MUSIC FOLDER README

This folder contains encrypted music files and their metadata. Each song consists of two files:

1. `song-name.encrypted` - The encrypted audio file
2. `song-name.json` - Metadata including title, genres, duration, and encryption parameters

## How to Add New Songs

### Step 1: Encrypt Your Music

1. Open `admin.html` in your browser
2. Upload your MP3 file
3. Add genres (optional, comma-separated)
4. Enter a password
5. Click "Encrypt & Generate Files"
6. Download both the `.encrypted` and `.json` files

### Step 2: Add Files to This Folder

1. Upload both files to this `/music/` folder via GitHub web interface or git

### Step 3: Update the Catalog

Edit `catalog.json` and add the filename (without extension) to the `songs` array:

```json
{
  "songs": [
    "my-first-song",
    "another-great-track",
    "awesome-music"
  ]
}
```

**Important:** The catalog entry should match the filename without `.encrypted` or `.json`

## Example Structure

After adding a song called "Summer Vibes.mp3", you should have:

```
music/
├── catalog.json
├── summer-vibes.encrypted
└── summer-vibes.json
```

And `catalog.json` should contain:

```json
{
  "songs": [
    "summer-vibes"
  ]
}
```

## Metadata File Example

Each `.json` file contains:

```json
{
  "title": "Summer Vibes",
  "genres": ["Electronic", "Chill"],
  "duration": "3:45",
  "filename": "summer-vibes",
  "salt": "base64encodedstring",
  "iv": "base64encodedstring",
  "encryptedAt": "2026-02-06T12:34:56.789Z"
}
```

## Security Notes

- Each song is encrypted with AES-256-GCM
- Password is required for playback (not stored anywhere)
- Salt and IV are unique per file
- Encrypted files cannot be played without the correct password

## Troubleshooting

**Songs not appearing?**
- Check that filenames in `catalog.json` match the actual files (without extensions)
- Ensure both `.encrypted` and `.json` files exist
- Check browser console for errors

**Decryption fails?**
- Verify you're using the correct password
- Ensure `.encrypted` file wasn't corrupted during upload
- Check that metadata in `.json` file is valid

## File Naming

- Keep filenames lowercase
- Use hyphens instead of spaces
- Avoid special characters
- Example: `my-awesome-song` instead of `My Awesome Song!`

The admin tool automatically handles this formatting for you.
