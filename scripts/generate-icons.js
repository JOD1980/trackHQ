const fs = require('fs');
const path = require('path');

// Athletics track icon with HQ text in center
const createIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="#2563eb"/>
  
  <!-- Outer track oval -->
  <ellipse cx="${size * 0.5}" cy="${size * 0.5}" rx="${size * 0.42}" ry="${size * 0.35}" 
           fill="none" stroke="#ffffff" stroke-width="${size * 0.06}"/>
  
  <!-- Inner track oval -->
  <ellipse cx="${size * 0.5}" cy="${size * 0.5}" rx="${size * 0.32}" ry="${size * 0.25}" 
           fill="none" stroke="#ffffff" stroke-width="${size * 0.04}"/>
  
  <!-- Track lanes (dashed lines) -->
  <ellipse cx="${size * 0.5}" cy="${size * 0.5}" rx="${size * 0.37}" ry="${size * 0.30}" 
           fill="none" stroke="#ffffff" stroke-width="${size * 0.015}" 
           stroke-dasharray="${size * 0.03},${size * 0.02}" opacity="0.7"/>
  
  <!-- Start/finish line -->
  <line x1="${size * 0.5}" y1="${size * 0.15}" x2="${size * 0.5}" y2="${size * 0.25}" 
        stroke="#ffffff" stroke-width="${size * 0.025}" stroke-linecap="round"/>
  
  <!-- HQ text in center -->
  <text x="${size * 0.5}" y="${size * 0.58}" text-anchor="middle" fill="#ffffff" 
        font-family="Arial, sans-serif" font-size="${size * 0.18}" font-weight="bold">HQ</text>
  
  <!-- Small athletics elements -->
  <circle cx="${size * 0.2}" cy="${size * 0.3}" r="${size * 0.025}" fill="#ffffff" opacity="0.8"/>
  <circle cx="${size * 0.8}" cy="${size * 0.7}" r="${size * 0.025}" fill="#ffffff" opacity="0.8"/>
</svg>`;

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons
sizes.forEach(size => {
  const svgContent = createIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  fs.writeFileSync(path.join(iconsDir, filename), svgContent);
  console.log(`Generated ${filename}`);
});

console.log('All icons generated successfully!');
console.log('Note: For production, convert SVGs to PNG using an image converter or online tool.');
