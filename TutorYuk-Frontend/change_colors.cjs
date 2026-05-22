const fs = require('fs');
const path = require('path');

const replacements = {
  '#1e40af': '#16a34a', // Primary Blue -> Green
  '#dbeafe': '#dcfce7', // Light Blue bg -> Light Green bg
  '#eff6ff': '#f0fdf4', // Very Light Blue -> Very Light Green
  '#93c5fd': '#22c55e', // Brand light blue -> Brand Green
  '#bfdbfe': '#bbf7d0', // Medium light blue -> Medium light green
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.vue') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const [oldColor, newColor] of Object.entries(replacements)) {
        if (content.includes(oldColor) || content.includes(oldColor.toUpperCase())) {
          content = content.replace(new RegExp(oldColor, 'gi'), newColor);
          changed = true;
        }
      }
      // Handle #1e3a8a separately to keep it in TheFooter.vue
      if (fullPath.includes('TheFooter.vue')) {
        // we keep #1e3a8a in TheFooter.vue, but replace other colors
      } else {
        if (content.includes('#1e3a8a')) {
          content = content.replace(new RegExp('#1e3a8a', 'gi'), '#15803d');
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log("Color replacement done.");
