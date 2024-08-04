const fs = require('fs').promises;
const path = require('path');

// Function to generate the custom wheel script
async function generateWheel(containerId, slices, slicePrizes, wheelImagePath, pointerImagePath) {
    try {
      // Example usage
      const wheelImageBase64 = imageToBase64('./wheel.png');
      const pointerImageBase64 = imageToBase64('./pointer.png');
    
        // Read the template file
        const wheelTemplate = await fs.readFile(path.join(__dirname, 'wheelTemplate.js'), 'utf-8');
        
        // Replace placeholders with actual values
        const customWheelCode = wheelTemplate
            .replace(/wheelImagePath/g, `'${wheelImagePath}'`)
            .replace(/pointerImagePath/g, `'${pointerImagePath}'`)
            .replace(/containerId/g, `'${containerId}'`)
            .replace(/slices/g, JSON.stringify(slices))
            .replace(/slicePrizes/g, JSON.stringify(slicePrizes));

        // Create the final script with CDN imports
        const finalScript = `
            <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>
            <script>
                ${customWheelCode}
                window.addEventListener('DOMContentLoaded', (event) => {
                    createCustomWheel(${JSON.stringify(containerId)}, ${JSON.stringify(wheelImagePath)}, ${JSON.stringify(pointerImagePath)}, ${JSON.stringify(slices)}, ${JSON.stringify(slicePrizes)});
                });
            </script>
        `;

        // Write the script to a file in the 'output' directory
        const outputDir = path.join(__dirname, 'output');
        await fs.mkdir(outputDir, { recursive: true });
        await fs.writeFile(path.join(outputDir, `${containerId}-wheel.js`), finalScript);

        console.log(`Wheel generated successfully at ${path.join(outputDir, `${containerId}-wheel.js`)}`);
    } catch (error) {
        console.error('Error generating wheel:', error);
    }
}

// Example usage of the generateWheel function
// You can replace these values with dynamic input
const containerId = 'custom-wheel-container';
const slices = 8;
const slicePrizes = ["A KEY!!!", "50 STARS", "500 STARS", "BAD LUCK!!!", "200 STARS", "100 STARS", "150 STARS", "BAD LUCK!!!"];
const wheelImagePath = './wheel.png'; // Replace with actual path
const pointerImagePath = './pointer.png'; // Replace with actual path

// Run the function with example data
generateWheel(containerId, slices, slicePrizes, wheelImagePath, pointerImagePath);

function imageToBase64(imagePath) {
  const image = fs.readFileSync(imagePath);
  return `data:image/png;base64,${image.toString('base64')}`;
}