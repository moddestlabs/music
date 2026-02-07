# Changelog

All notable changes to the Music Uploader desktop app will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-01-XX

### Added
- Initial release of Music Uploader desktop app
- Native file picker for selecting MP3 files
- Client-side AES-256-GCM encryption with PBKDF2 key derivation
- Direct GitHub integration for uploading encrypted files
- Secure credential storage in OS keychain (Windows Credential Manager, macOS Keychain, Linux Secret Service)
- Automatic catalog.json updates when files are uploaded
- Artist/title parsing from "Artist_Title.mp3" filename format
- Dark theme UI matching web player aesthetic
- Real-time upload progress tracking
- Automated Windows builds via GitHub Actions
- MSI and NSIS installer support

### Security
- Passwords never stored anywhere (used only during encryption)
- GitHub Personal Access Token stored securely in OS keychain
- All encryption happens locally before upload
- 100,000 PBKDF2 iterations for key derivation

### Known Issues
- Windows SmartScreen may show warning (app not yet code-signed)
- macOS and Linux builds not yet available (planned for future releases)

---

## Release Notes Format

### Types of changes
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for security improvements or vulnerability fixes

### Version numbering
- **Major** (x.0.0): Breaking changes or major feature additions
- **Minor** (0.x.0): New features, backward compatible
- **Patch** (0.0.x): Bug fixes, backward compatible
