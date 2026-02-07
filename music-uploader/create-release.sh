#!/bin/bash

# Script to create a new release of the Music Uploader desktop app
# Usage: ./create-release.sh <version>
# Example: ./create-release.sh 0.2.0

set -e

if [ -z "$1" ]; then
    echo "Usage: ./create-release.sh <version>"
    echo "Example: ./create-release.sh 0.2.0"
    exit 1
fi

VERSION=$1
TAG="v$VERSION"

echo "Creating release for version $VERSION"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "music-uploader/src-tauri/Cargo.toml" ]; then
    echo "Error: Must be run from the repository root"
    exit 1
fi

# Update version in Cargo.toml
echo "Updating version in Cargo.toml..."
sed -i "s/^version = \".*\"/version = \"$VERSION\"/" music-uploader/src-tauri/Cargo.toml

# Check if there are changes
if ! git diff --quiet music-uploader/src-tauri/Cargo.toml; then
    echo "Version updated to $VERSION"
    
    # Commit the version change
    git add music-uploader/src-tauri/Cargo.toml
    git commit -m "Release: Bump version to $VERSION"
    
    # Create and push tag
    git tag -a "$TAG" -m "Release version $VERSION"
    
    echo ""
    echo "✅ Version updated and tagged!"
    echo ""
    echo "To trigger the automated build and release:"
    echo "  git push origin main --tags"
    echo ""
    echo "This will:"
    echo "  1. Build the Windows installer"
    echo "  2. Create a GitHub release"
    echo "  3. Upload installers to the release"
else
    echo "Version is already $VERSION, no changes needed"
    
    # Check if tag exists
    if git rev-parse "$TAG" >/dev/null 2>&1; then
        echo "Tag $TAG already exists"
    else
        git tag -a "$TAG" -m "Release version $VERSION"
        echo "Tag $TAG created. Push with: git push origin --tags"
    fi
fi
