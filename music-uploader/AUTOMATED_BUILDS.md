# Automated Desktop App Builds

This repository automatically builds the Music Uploader desktop app for Windows using GitHub Actions.

## How It Works

The GitHub Actions workflow automatically:
1. ✅ Builds the Tauri app for Windows when changes are pushed to `music-uploader/`
2. ✅ Creates installers (MSI and EXE formats)
3. ✅ Uploads them as downloadable artifacts
4. ✅ Creates GitHub releases for version tags

## Getting the Latest Build

### Option 1: From GitHub Releases (Recommended)

1. Go to the [Releases page](https://github.com/moddestlabs/music/releases)
2. Download the latest Windows installer:
   - **`.msi`** - Windows Installer Package (recommended for most users)
   - **`.exe`** - NSIS Installer (alternative)
3. Run the installer and follow the prompts
4. Launch "Music Uploader" from your Start Menu

### Option 2: From GitHub Actions (Development Builds)

1. Go to the [Actions tab](https://github.com/moddestlabs/music/actions)
2. Click on the latest "Build Tauri Desktop App" workflow run
3. Scroll to "Artifacts" at the bottom
4. Download the Windows installer
5. Extract and run the installer

## Creating a Release

### Automatic Release (Recommended)

1. Update version in `music-uploader/src-tauri/Cargo.toml`:
   ```toml
   [package]
   version = "0.2.0"  # Increment version
   ```

2. Commit and create a version tag:
   ```bash
   git add music-uploader/src-tauri/Cargo.toml
   git commit -m "Bump version to 0.2.0"
   git tag v0.2.0
   git push origin main --tags
   ```

3. GitHub Actions will automatically:
   - Build the Windows app
   - Create a new release
   - Attach the installers

### Manual Release

You can also trigger a build manually:

1. Go to the [Actions tab](https://github.com/moddestlabs/music/actions)
2. Select "Build Tauri Desktop App"
3. Click "Run workflow"
4. Choose whether to create a release
5. Click "Run workflow"

## Build Status

Check the build status badge in the repository README or visit the [Actions tab](https://github.com/moddestlabs/music/actions) to see recent builds.

## System Requirements

### Windows
- Windows 10 or later (64-bit)
- WebView2 (automatically installed by the installer if needed)

## Troubleshooting

### Windows SmartScreen Warning

If Windows SmartScreen shows a warning:
1. Click "More info"
2. Click "Run anyway"

This is normal for unsigned applications. To remove this warning, you would need to code-sign the app (requires a code signing certificate).

### Installation Failed

- Make sure you're running as Administrator
- Check that you have enough disk space
- Try the alternative installer format (MSI vs EXE)

### Build Failed in GitHub Actions

1. Check the Actions tab for error details
2. Ensure all dependencies are correctly specified
3. Check that Cargo.toml versions are valid

## For Developers

### Testing Builds Locally

Before pushing, test the build locally:

```bash
cd music-uploader
npm install
npm run build
```

The installer will be in: `src-tauri/target/release/bundle/`

### Modifying the Workflow

The workflow file is at: `.github/workflows/build-tauri-app.yml`

Key configuration:
- **Triggers**: Push to `main` (music-uploader folder) or version tags
- **Platform**: Currently builds for Windows only
- **Artifacts**: Both MSI and NSIS installers

### Adding macOS/Linux Builds

To add other platforms, update the workflow matrix:

```yaml
matrix:
  platform: [windows-latest, macos-latest, ubuntu-latest]
```

Note: Each platform requires specific dependencies (see workflow file).

## Security Notes

- The app stores GitHub tokens in your OS keychain (Windows Credential Manager)
- All encryption happens locally
- No data is sent to third-party servers
- Open source - you can audit the code

## Support

For issues with:
- **The app itself**: Open an issue in this repository
- **Build failures**: Check the Actions tab and error logs
- **Installation**: See troubleshooting section above
