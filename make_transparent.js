const sharp = require('sharp');
const fs = require('fs');

async function removeWhiteAndShadowBg(inputFile, outputFile, protectBox) {
    const image = sharp(inputFile);
    const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    const visited = new Uint8Array(width * height);
    const queue = [];

    function isBackground(r, g, b, x, y) {
        // Protected body area (never background)
        if (protectBox && x >= protectBox.minX && x <= protectBox.maxX && y >= protectBox.minY && y <= protectBox.maxY) {
            return false;
        }

        const brightness = (r + g + b) / 3;
        // White or near white background
        if (brightness >= 228) return true;
        // Gray floor shadow: neutral tone with brightness > 165
        const maxDiff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
        if (brightness >= 165 && maxDiff <= 20) {
            return true;
        }
        return false;
    }

    // Seed flood fill from borders
    for (let x = 0; x < width; x++) {
        const idxTop = (0 * width + x) * channels;
        if (isBackground(data[idxTop], data[idxTop + 1], data[idxTop + 2], x, 0)) {
            visited[0 * width + x] = 1;
            queue.push(x, 0);
        }
        const idxBot = ((height - 1) * width + x) * channels;
        if (isBackground(data[idxBot], data[idxBot + 1], data[idxBot + 2], x, height - 1)) {
            visited[(height - 1) * width + x] = 1;
            queue.push(x, height - 1);
        }
    }

    for (let y = 0; y < height; y++) {
        const idxLeft = (y * width + 0) * channels;
        if (isBackground(data[idxLeft], data[idxLeft + 1], data[idxLeft + 2], 0, y)) {
            visited[y * width + 0] = 1;
            queue.push(0, y);
        }
        const idxRight = (y * width + (width - 1)) * channels;
        if (isBackground(data[idxRight], data[idxRight + 1], data[idxRight + 2], width - 1, y)) {
            visited[y * width + (width - 1)] = 1;
            queue.push(width - 1, y);
        }
    }

    let head = 0;
    while (head < queue.length) {
        const cx = queue[head++];
        const cy = queue[head++];

        const neighbors = [
            [cx + 1, cy],
            [cx - 1, cy],
            [cx, cy + 1],
            [cx, cy - 1]
        ];

        for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nPos = ny * width + nx;
                if (!visited[nPos]) {
                    const idx = nPos * channels;
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];
                    if (isBackground(r, g, b, nx, ny)) {
                        visited[nPos] = 1;
                        queue.push(nx, ny);
                    }
                }
            }
        }
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const pos = y * width + x;
            const idx = pos * channels;
            if (visited[pos] === 1) {
                data[idx + 3] = 0;
            } else {
                let isAdj = false;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            if (visited[ny * width + nx] === 1) {
                                isAdj = true;
                                break;
                            }
                        }
                    }
                    if (isAdj) break;
                }

                if (isAdj) {
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];
                    const brightness = (r + g + b) / 3;
                    if (brightness > 210) {
                        data[idx + 3] = Math.round(Math.max(0, (255 - brightness) / 45) * 255);
                    }
                }
            }
        }
    }

    await sharp(data, { raw: { width, height, channels } })
        .png()
        .toFile(outputFile);
    console.log(`Protected & saved: ${outputFile}`);
}

async function main() {
    const list = [
        ['assets/images/hero_jumping_girl.jpg', 'assets/images/hero_jumping_girl.png', { minX: 330, maxX: 690, minY: 320, maxY: 640 }],
        ['assets/images/jumping_boy_arms.jpg', 'assets/images/jumping_boy_arms.png', { minX: 380, maxX: 630, minY: 200, maxY: 520 }],
        ['assets/images/standing_girl.jpg', 'assets/images/standing_girl.png', { minX: 350, maxX: 650, minY: 220, maxY: 700 }],
        ['assets/images/pointing_boy.jpg', 'assets/images/pointing_boy.png', { minX: 340, maxX: 660, minY: 220, maxY: 620 }],
        ['assets/images/boy_telescope.jpg', 'assets/images/boy_telescope.png', { minX: 180, maxX: 680, minY: 320, maxY: 820 }]
    ];

    for (const [inPath, outPath, box] of list) {
        if (fs.existsSync(inPath)) {
            await removeWhiteAndShadowBg(inPath, outPath, box);
        }
    }
}

main().catch(console.error);
