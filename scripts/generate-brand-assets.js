const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function run() {
  const src = path.join(process.cwd(), 'public', 'mentor-profile.png');
  if (!fs.existsSync(src)) {
    console.error('Source mentor-profile.png does not exist at:', src);
    process.exit(1);
  }

  console.log('Generating assets from:', src);

  // 1. Overwrite public/sami-logo.jpg and public/images/sami-logo.jpg with 800x800 high-quality JPEG
  const sqJpg = await sharp(src).resize(800, 800).jpeg({ quality: 95 }).toBuffer();
  fs.writeFileSync(path.join(process.cwd(), 'public', 'sami-logo.jpg'), sqJpg);
  console.log('Wrote public/sami-logo.jpg');

  const imagesDir = path.join(process.cwd(), 'public', 'images');
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
  fs.writeFileSync(path.join(imagesDir, 'sami-logo.jpg'), sqJpg);
  console.log('Wrote public/images/sami-logo.jpg');

  // 2. Favicons
  const png16 = await sharp(src).resize(16, 16).png().toBuffer();
  fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon-16x16.png'), png16);

  const png32 = await sharp(src).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon-32x32.png'), png32);

  const png48 = await sharp(src).resize(48, 48).png().toBuffer();
  fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon-48x48.png'), png48);

  const png180 = await sharp(src).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(process.cwd(), 'public', 'apple-icon.png'), png180);
  fs.writeFileSync(path.join(process.cwd(), 'app', 'apple-icon.png'), png180);

  const png512 = await sharp(src).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(process.cwd(), 'public', 'icon.png'), png512);
  fs.writeFileSync(path.join(process.cwd(), 'app', 'icon.png'), png512);

  // Generate valid PNG-in-ICO favicon.ico (32x32)
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // ICO type (1 = icon)
  icoHeader.writeUInt16LE(1, 4); // 1 image

  const icoEntry = Buffer.alloc(16);
  icoEntry.writeUInt8(32, 0); // width
  icoEntry.writeUInt8(32, 1); // height
  icoEntry.writeUInt8(0, 2); // color count
  icoEntry.writeUInt8(0, 3); // reserved
  icoEntry.writeUInt16LE(1, 4); // color planes
  icoEntry.writeUInt16LE(32, 6); // bpp
  icoEntry.writeUInt32LE(png32.length, 8); // size
  icoEntry.writeUInt32LE(22, 12); // offset (6 + 16 = 22)

  const icoBuffer = Buffer.concat([icoHeader, icoEntry, png32]);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(process.cwd(), 'app', 'favicon.ico'), icoBuffer);
  console.log('Wrote all favicons (16, 32, 48, 180, 512, .ico)');

  // 3. OpenGraph 1200x630 Banner
  const avatarSize = 480;
  const avatarCircle = await sharp(src)
    .resize(avatarSize, avatarSize)
    .png()
    .toBuffer();

  const svgText = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="75%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00A0DF" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#00A0DF" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <rect width="1200" height="630" fill="#070B14"/>
      <rect width="1200" height="630" fill="url(#glow)"/>
      <rect x="0" y="0" width="1200" height="6" fill="#00A0DF"/>

      <!-- Pill Badge -->
      <g transform="translate(80, 110)">
        <rect width="280" height="36" rx="18" fill="#00A0DF" fill-opacity="0.15" stroke="#00A0DF" stroke-opacity="0.4" stroke-width="1.5"/>
        <text x="140" y="23" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#00A0DF" text-anchor="middle" letter-spacing="1.5">OFFICIAL MENTORSHIP</text>
      </g>

      <!-- Main Title -->
      <text x="80" y="220" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="900" fill="#FFFFFF" letter-spacing="-1.5">
        Ecom <tspan fill="#00A0DF">With Sami</tspan>
      </text>

      <!-- Subtitle -->
      <text x="80" y="280" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="bold" fill="#94A3B8">
        Mentor: Sardar Samiullah
      </text>

      <!-- Feature Bullets -->
      <text x="80" y="345" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="#CBD5E1">
        • Complete E-Commerce Roadmap (Dropshipping to Brand)
      </text>
      <text x="80" y="385" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="#CBD5E1">
        • Pakistan, UAE &amp; Saudi Arabia High-Converting Blueprints
      </text>
      <text x="80" y="425" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="#CBD5E1">
        • 1,200+ Students Mentored &amp; Verified Results
      </text>

      <!-- Bottom Trust Badge -->
      <g transform="translate(80, 480)">
        <rect width="440" height="46" rx="12" fill="#0F172A" stroke="#1E293B" stroke-width="1.5"/>
        <text x="220" y="29" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold" fill="#38BDF8" text-anchor="middle" letter-spacing="0.5">&#9733; 1-ON-1 LIFETIME WHATSAPP MENTORSHIP</text>
      </g>
    </svg>
  `;

  const ogComposite = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 7, g: 11, b: 20, alpha: 1 }
    }
  })
  .composite([
    { input: Buffer.from(svgText), top: 0, left: 0 },
    { input: avatarCircle, top: 75, left: 640 }
  ])
  .jpeg({ quality: 95 })
  .toBuffer();

  fs.writeFileSync(path.join(process.cwd(), 'public', 'og-image.jpg'), ogComposite);
  console.log('Wrote public/og-image.jpg');

  const ogPng = await sharp(ogComposite).png().toBuffer();
  fs.writeFileSync(path.join(process.cwd(), 'public', 'og-image.png'), ogPng);
  fs.writeFileSync(path.join(process.cwd(), 'app', 'opengraph-image.png'), ogPng);
  console.log('Wrote public/og-image.png and app/opengraph-image.png');

  console.log('ALL BRAND ASSETS SUCCESSFULLY GENERATED!');
}

run().catch(err => {
  console.error('Asset generation error:', err);
  process.exit(1);
});
