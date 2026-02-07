# Music Uploader - Tauri Desktop App

![Build Status](https://github.com/moddestlabs/music/actions/workflows/build-tauri-app.yml/badge.svg)

A secure desktop application for encrypting and uploading music files directly to your GitHub repository.

## 🚀 Quick Start

### Download Pre-built App (Easiest)

**Windows users can download the latest installer directly:**

1. Go to [Releases](https://github.com/moddestlabs/music/releases)
2. Download the latest `.msi` installer
3. Run the installer
4. Launch "Music Uploader" from Start Menu

**Or get the latest development build:**
- Visit [GitHub Actions](https://github.com/moddestlabs/music/actions)
- Download from the latest successful build

See [AUTOMATED_BUILDS.md](AUTOMATED_BUILDS.md) for full details.

## Features

- 🔒 **AES-256-GCM Encryption** - Military-grade encryption for your audio files
- 🚀 **Direct GitHub Upload** - Upload encrypted files and metadata automatically
- 🔐 **Secure Credentials** - GitHub tokens stored in your OS keychain (never in files)
- 🎨 **Modern UI** - Dark theme matching your music player
- 🎵 **Artist/Title Parsing** - Automatically extracts from filename (Artist_Title.mp3)
- 💾 **Cross-Platform** - Works on Windows, macOS, and Linux

## Setup

### Prerequisites

1. **Rust** (already installed in this environment)
2. **Node.js** (optional, for package management)

### Windows Build Requirements

For building on Windows, you'll also need:
- Microsoft Visual Studio C++ Build Tools
- WebView2 (usually pre-installed on Windows 10/11)

## Building the App

### Development Mode

```bash
cd music-uploader
source $HOME/.cargo/env
cargo tauri dev
```

### Production Build (Windows)

```bash
cd music-uploader
cargo tauri build --target x86_64-pc-windows-msvc
```

The installer will be created in `src-tauri/target/release/bundle/`

### Cross-Compile for Windows from Linux

```bash
# Install Windows target
rustup target add x86_64-pc-windows-gnu

# Build for Windows
cd music-uploader
cargo tauri build --target x86_64-pc-windows-gnu
```

## Usage

### First Time Setup

1. Launch the app
2. In the GitHub Settings section, enter:
   - **GitHub Owner**: Your GitHub username or organization
   - **Repository Name**: The music repository name
   - **Personal Access Token**: Create one at https://github.com/settings/tokens
     - Required permissions: `repo` (full control of private repositories)
3. Click "Save Settings" - your token is stored securely in your OS keychain

### Uploading Music

1. Click "Select Audio File" or drag & drop an MP3 file
2. Filename format must be: `Artist_Title.mp3` (e.g., `Matt Strauss_My Rock of Salvation.mp3`)
3. Enter genres (comma-separated, optional)
4. Enter a playback password (users will need this to listen)
5. Click "🚀 Encrypt & Upload to GitHub"
6. Done! Files are automatically uploaded to your repo's `/music/` folder

### Artist Images

Upload artist photos manually to the `/music/` folder using URL-safe filenames that match the artist portion of the song filename:
- Format: `artist-name.jpg` (lowercase, dashes instead of spaces)
- Example: `matt-strauss.jpg` for artist "Matt Strauss"
- Example: `ashton-daniels.jpg` for artist "Ashton Daniels"

This matches the naming scheme of the generated encrypted files.

## Project Structure

```
music-uploader/
├── src/                  # Frontend (HTML/CSS/JS)
│   └── index.html       # Main app interface
├── src-tauri/           # Rust backend
│   ├── src/
│   │   └── main.rs     # Tauri backend with GitHub API
│   ├── Cargo.toml      # Rust dependencies
│   ├── tauri.conf.json # Tauri configuration
│   └── build.rs        # Build script
└── README.md
```

## Security

- Passwords are never transmitted or stored
- GitHub tokens are stored in OS-native secure storage (Keyring)
- Encryption uses industry-standard AES-256-GCM with PBKDF2 key derivation
- All uploads use HTTPS

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Make sure Rust is up to date:
   ```bash
   rustup update
   ```

2. Clean and rebuild:
   ```bash
   cd music-uploader
   cargo clean
   cargo tauri build
   ```

### GitHub Upload Fails

- Verify your Personal Access Token has `repo` permissions
- Check that the repository name and owner are correct
- Ensure you have write access to the repository

## License

MIT License - Feel free to modify and distribute
