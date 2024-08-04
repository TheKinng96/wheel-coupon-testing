const fs = require('fs');

function imageToBase64(imagePath) {
  const image = fs.readFileSync(imagePath);
  return `data:image/png;base64,${image.toString('base64')}`;
}

console.log(imageToBase64('./pin.png'));