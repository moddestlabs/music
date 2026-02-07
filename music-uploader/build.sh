#!/bin/bash

# Quick start script for music-uploader

echo "🎵 Music Uploader - Quick Start"
echo "================================"
echo ""

# Check if running on Windows (WSL/Git Bash)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || -n "$WSLENV" ]]; then
    echo "✓ Detected Windows environment"
    echo ""
    echo "Building for Windows..."
    cd "$(dirname "$0")"
    cargo tauri build
    echo ""
    echo "✅ Build complete! Installer is in:"
    echo "   src-tauri/target/release/bundle/"
    
else
    # Linux environment
    echo "📋 Linux environment detected"
    echo ""
    echo "To build for Windows, you have two options:"
    echo ""
    echo "1. Copy this folder to a Windows machine and run:"
    echo "   cargo tauri build"
    echo ""
    echo "2. Install Linux dependencies and test locally:"
    echo "   sudo apt-get update"
    echo "   sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.1-dev \\"
    echo "                           libayatana-appindicator3-dev librsvg2-dev libssl-dev"
    echo "   cargo tauri dev"
    echo ""
    echo "See BUILD_WINDOWS.md for detailed instructions"
fi
