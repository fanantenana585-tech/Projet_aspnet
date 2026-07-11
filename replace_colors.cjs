const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (dirPath.endsWith('.vue')) {
        callback(path.join(dir, f));
      }
    }
  });
}

const targetDir = path.resolve('..', 'ASPE_NET', 'src');

walkDir(targetDir, function(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace light gray/slate text classes with dark gray/black equivalents
  // Exclude buttons or specific elements if needed, but the prompt says globally.
  // "supprimant toute couleur de texte hérité de classes Tailwind trop claires comme text-gray-400, text-gray-300..."
  
  const regex = /text-(gray|slate)-(300|400|500)/g;
  const newContent = content.replace(regex, (match, p1, p2) => {
    if (p2 === '500') return 'text-gray-700'; // Keep 500 slightly lighter but visible
    return 'text-[#0C2340]'; // Force very dark blue/black for 300 and 400
  });
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});

console.log('Replacement complete.');
