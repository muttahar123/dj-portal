const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace all instances of tertiary-sage with tertiary-blue
    if (content.includes('tertiary-sage')) {
        content = content.replace(/tertiary-sage/g, 'tertiary-blue');
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    }
}

walkDir(directoryPath);
console.log("Replaced sage with blue");
