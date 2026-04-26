const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('.env.local not found');
  process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');
const lines = content.split('\n');

let newContent = '';
let inJson = false;
let jsonBuffer = '';
let currentKey = '';

for (const line of lines) {
  if (line.includes('={') && !inJson) {
    inJson = true;
    const parts = line.split('=');
    currentKey = parts[0];
    jsonBuffer = '{';
  } else if (inJson) {
    jsonBuffer += line.trim();
    if (line.trim() === '}') {
      // End of JSON
      newContent += `${currentKey}='${jsonBuffer}'\n`;
      inJson = false;
      jsonBuffer = '';
    }
  } else if (line.trim()) {
    newContent += line + '\n';
  }
}

fs.writeFileSync(envPath, newContent);
console.log('.env.local has been reformatted to single-line JSON strings.');
