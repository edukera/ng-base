const fs = require('fs');
const path = require('path');

// Read the package.json file to get the project name
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const projectName = packageJson.name;

// Define paths
const sourceFile = path.join(__dirname, 'index.html');
const destinationDir = path.join(__dirname, `../dist/${projectName}`);
const destinationFile = path.join(destinationDir, 'index.html');

// Check if the destination directory exists, if not, create it
if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir, { recursive: true });
}

// Copy the file
fs.copyFile(sourceFile, destinationFile, (err) => {
  if (err) {
    console.error('Error copying the file:', err);
  } else {
    console.log('File copied successfully!');
  }
});
