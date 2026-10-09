const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateFavicons() {
  const srcPath = path.join(process.cwd(), 'public', 'mentor-profile.png');
  if (!fs.existsSync(srcPath)) {
    console.error('Source image not found at:', srcPath);
    process.exit(1);
  }

  console.log('Generating face-focused, high-visibility circular favicons from:', srcPath);

  // Crop parameters: 800x800 square centered on face, hair, and collar
  // Left: 177 (centers Sami's face horizontally)
  // Top: 40 (leaves ample breathing room above hair, zero haircut)
  // Width: 800, Height: 800 (keeps head, ears, chin, neck, and upper suit intact)
  const cropRegion = { left: 177, top: 40, width: 800, height: 800 };

  // Helper to create a circular framed avatar buffer for a given target size
  async function createCircularAvatar(size) {
    const r = size / 2;
    // For tiny sizes (16, 32), use a slightly more pronounced border so it pops against browser tabs
    const strokeWidth = size <= 32 ? Math.max(1.5, Math.round(size * 0.045)) : Math.max(2, Math.round(size * 0.03));
    const effectiveRadius = r - Math.ceil(strokeWidth / 2);

    // SVG Mask for perfect smooth anti-aliased circle
    const maskSvg = Buffer.from(`
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${r}" cy="${r}" r="${effectiveRadius}" fill="#FFFFFF" />
      </svg>
    `);

    // SVG Tech-Cyan glowing border ring
    const borderSvg = Buffer.from(`
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${r}" cy="${r}" r="${effectiveRadius}" fill="none" stroke="#00A0DF" stroke-width="${strokeWidth}" />
      </svg>
    `);

    // 1. Extract face region, ensure alpha, resize to size x size with slight sharpening for small icons
    let pipeline = sharp(srcPath)
      .extract(cropRegion)
      .ensureAlpha()
      .resize(size, size, { fit: 'cover', position: 'top' });

    if (size <= 48) {
      // Apply subtle sharpening for ultra-crisp display in browser tabs
      pipeline = pipeline.sharpen({ sigma: 0.8, m1: 1.2, m2: 0.8 });
    }

    const resizedImage = await pipeline.toBuffer();

    // 2. Composite with circle mask
    const masked = await sharp(resizedImage)
      .composite([{ input: maskSvg, blend: 'dest-in' }])
      .png()
      .toBuffer();

    // 3. Composite with signature cyan border
    const finalImage = await sharp(masked)
      .composite([{ input: borderSvg, blend: 'over' }])
      .png({ compressionLevel: 9 })
      .toBuffer();

    return finalImage;
  }

  const sizes = [16, 32, 48, 64, 128, 180, 192, 256, 512];
  const pngBuffers = {};

  for (const sz of sizes) {
    console.log(`Rendering face-focused ${sz}x${sz} avatar...`);
    pngBuffers[sz] = await createCircularAvatar(sz);
  }

  // Save standard icon files
  // 512x512
  fs.writeFileSync(path.join(process.cwd(), 'public', 'icon-512.png'), pngBuffers[512]);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'icon.png'), pngBuffers[512]);
  fs.writeFileSync(path.join(process.cwd(), 'app', 'icon.png'), pngBuffers[512]);

  // 192x192
  fs.writeFileSync(path.join(process.cwd(), 'public', 'icon-192.png'), pngBuffers[192]);

  // 180x180 (Apple Touch Icon)
  fs.writeFileSync(path.join(process.cwd(), 'public', 'apple-touch-icon.png'), pngBuffers[180]);
  fs.writeFileSync(path.join(process.cwd(), 'app', 'apple-icon.png'), pngBuffers[180]);

  // 32x32
  fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon-32x32.png'), pngBuffers[32]);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.png'), pngBuffers[32]);

  // 16x16
  fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon-16x16.png'), pngBuffers[16]);

  // Build binary multi-resolution .ico containing 16, 32, 48, 64, 128, 256
  const icoSizes = [16, 32, 48, 64, 128, 256];
  const count = icoSizes.length;
  const header = Buffer.alloc(6 + count * 16);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type = 1 (ICO)
  header.writeUInt16LE(count, 4); // Image count

  let offset = 6 + count * 16;
  const imageBuffers = [];

  for (let i = 0; i < count; i++) {
    const sz = icoSizes[i];
    const imgBuf = pngBuffers[sz];
    imageBuffers.push(imgBuf);

    const entryOffset = 6 + i * 16;
    header.writeUInt8(sz >= 256 ? 0 : sz, entryOffset); // Width
    header.writeUInt8(sz >= 256 ? 0 : sz, entryOffset + 1); // Height
    header.writeUInt8(0, entryOffset + 2); // Colors in palette
    header.writeUInt8(0, entryOffset + 3); // Reserved
    header.writeUInt16LE(1, entryOffset + 4); // Color planes
    header.writeUInt16LE(32, entryOffset + 6); // Bits per pixel
    header.writeUInt32LE(imgBuf.length, entryOffset + 8); // Size of image
    header.writeUInt32LE(offset, entryOffset + 12); // Offset
    offset += imgBuf.length;
  }

  const finalIcoBuffer = Buffer.concat([header, ...imageBuffers]);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.ico'), finalIcoBuffer);
  fs.writeFileSync(path.join(process.cwd(), 'app', 'favicon.ico'), finalIcoBuffer);

  console.log('✅ ALL FACE-FOCUSED FAVICONS AND APP ICONS SUCCESSFULLY RE-GENERATED!');
}

generateFavicons().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
