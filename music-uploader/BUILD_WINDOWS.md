# Building for Windows

## Option 1: Build Directly on Windows (Recommended)

The easiest way is to build directly on a Windows machine:

### Prerequisites on Windows:

1. **Install Rust**: Download from https://rustup.rs/
   - Run the installer and follow the prompts
   - It will automatically install Visual Studio Build Tools if needed

2. **Install WebView2**: Usually pre-installed on Windows 10/11
   - If not, download from: https://developer.microsoft.com/microsoft-edge/webview2/

### Build Steps on Windows:

```powershell
# Clone or copy the music-uploader folder to your Windows machine
cd music-uploader

# Build the app
cargo tauri build
```

The Windows installer will be created in:
`src-tauri/target/release/bundle/msi/` or `src-tauri/target/release/bundle/nsis/`

## Option 2: Install Linux Libraries (For Development/Testing)

If you want to test in this Linux environment first:

```bash
# Install GTK and WebKit dependencies
sudo apt-get update
sudo apt-get install -y \
    libgtk-3-dev \
    libwebkit2gtk-4.1-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    libssl-dev

# Then build
cd music-uploader
cargo tauri dev
```

## Option 3: Use GitHub Actions

Set up automated Windows builds with GitHub Actions. Create `.github/workflows/build.yml`:

```yaml
name: Build Windows App

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Build Tauri App
        working-directory: music-uploader
        run: cargo tauri build
      - name: Upload Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: windows-installer
          path: music-uploader/src-tauri/target/release/bundle/**/*
```

## Current Status

✅ Project structure created
✅ Rust backend with GitHub API integration
✅ Modern dark UI matching your music player
✅ Encryption system ready
✅ Credential management configured

📦 Ready to build on Windows!

## Next Steps

1. Copy the `music-uploader` folder to a Windows machine
2. Install Rust on Windows
3. Run `cargo tauri build`
4. Install and use the app!

## Features Ready to Use

- GitHub authentication with secure keychain storage
- AES-256-GCM encryption
- Direct upload to your music repository
- Artist/Title parsing from filenames
- Password management
- Modern UI with dark theme
