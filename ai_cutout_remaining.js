const { removeBackground } = require('@imgly/background-removal-node');
const fs = require('fs');
const path = require('path');

async function processImage(inputPath, outputPath) {
    console.log(`Processing with AI background removal: ${inputPath}...`);
    try {
        const fileUrl = 'file://' + path.resolve(inputPath).replace(/\\/g, '/');
        const blob = await removeBackground(fileUrl);
        const buffer = Buffer.from(await blob.arrayBuffer());
        fs.writeFileSync(outputPath, buffer);
        console.log(`Successfully generated AI cutout: ${outputPath}`);
    } catch (err) {
        console.error(`Error processing ${inputPath}:`, err);
    }
}

async function main() {
    await processImage('assets/images/jumping_boy_arms.jpg', 'assets/images/jumping_boy_arms.png');
    await processImage('assets/images/standing_girl.jpg', 'assets/images/standing_girl.png');
    await processImage('assets/images/pointing_boy.jpg', 'assets/images/pointing_boy.png');
}

main();
