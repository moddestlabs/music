# Favicon Setup

JMusic includes comprehensive favicon support for all modern platforms.

## Included Files

### SVG Icons (Modern browsers, scalable)
- `favicon.svg` - Main favicon (128x128 base)
- `apple-touch-icon.svg` - iOS home screen icon (180x180)
- `icon-192.svg` - Android/Chrome icon (192x192)
- `icon-512.svg` - High-res icon for splash screens (512x512)

### Manifest
- `site.webmanifest` - PWA manifest for installable web app support

## Browser Support

✅ **Modern Browsers** (Chrome, Firefox, Safari, Edge)
- SVG favicons work perfectly
- No additional files needed

✅ **iOS/iPadOS**
- `apple-touch-icon.svg` provides home screen icon

✅ **Android/Chrome**
- Icons defined in `site.webmanifest`
- Works as installable PWA

## Optional: Generate PNG/ICO for Legacy Support

If you need to support older browsers (IE11, old Android), you can convert the SVG files to PNG/ICO:

### Option 1: Online Converters
1. Open `favicon.svg` in your browser
2. Take a screenshot or use an online SVG→PNG converter
3. Create sizes: 16x16, 32x32, 48x48, 64x64
4. Use a favicon generator to create `favicon.ico`

### Option 2: Command Line (ImageMagick)
```bash
# Install ImageMagick first
brew install imagemagick  # macOS
# or apt-get install imagemagick  # Linux

# Convert to PNG
convert favicon.svg -resize 16x16 favicon-16.png
convert favicon.svg -resize 32x32 favicon-32.png
convert favicon.svg -resize 48x48 favicon-48.png

# Create ICO file
convert favicon-16.png favicon-32.png favicon-48.png favicon.ico
```

### Option 3: Node.js Script
```bash
npm install sharp
```

```javascript
const sharp = require('sharp');
const fs = require('fs');

const svg = fs.readFileSync('favicon.svg');

// Generate PNG versions
[16, 32, 48, 180, 192, 512].forEach(size => {
  sharp(svg)
    .resize(size, size)
    .png()
    .toFile(`favicon-${size}.png`);
});
```

## Testing Your Favicon

1. **Local Testing**: Open `index.html` in a browser
2. **GitHub Pages**: Deploy and check the browser tab
3. **Mobile**: Add to home screen on iOS/Android
4. **PWA**: Use Chrome DevTools → Application → Manifest

## Customizing

To change the favicon colors:

1. Edit any of the SVG files
2. Modify the gradient stops:
   ```svg
   <stop offset="0%" style="stop-color:#6366f1"/>   <!-- Change this -->
   <stop offset="100%" style="stop-color:#a855f7"/> <!-- And this -->
   ```

## Current Design

- **Colors**: Indigo (#6366f1) to Purple (#a855f7) gradient
- **Icon**: Play triangle (representing music)
- **Background**: Circle (main favicon) or rounded square (iOS)
- **Style**: Modern, minimal, matches JMusic branding

## Platform-Specific Notes

### iOS
- Automatically adds rounded corners to `apple-touch-icon.svg`
- Suggested size: 180x180 (provided)
- Can be saved to home screen

### Android/Chrome
- PWA installable via `site.webmanifest`
- Uses adaptive icons (circle with play button)
- Theme color: `#6366f1` (indigo)

### Windows
- May want to add `browserconfig.xml` for pinned tiles
- Optional: Create a 144x144 PNG for legacy Windows tiles

### macOS Safari
- Supports SVG favicons natively
- Shows in tab bar and Touch Bar

## Files Already Configured

Both `index.html` and `admin.html` include:
```html
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="apple-touch-icon" href="apple-touch-icon.svg">
<link rel="manifest" href="site.webmanifest">
<meta name="theme-color" content="#6366f1">
```

No additional setup needed! 🎉
