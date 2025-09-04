const levelLayout = [];
const levelWidthTiles = 400;
const levelHeightTiles = 20; // Reduced height for a more classic feel

// Initialize with empty tiles
for (let y = 0; y < levelHeightTiles; y++) {
    levelLayout[y] = new Array(levelWidthTiles).fill(0);
}

// Create ground (bottom two rows)
for (let x = 0; x < levelWidthTiles; x++) {
    levelLayout[levelHeightTiles - 1][x] = 1; // Ground
    levelLayout[levelHeightTiles - 2][x] = 1; // Ground
}

// Add some platforms and blocks (Mario-style)
// Floating blocks
levelLayout[levelHeightTiles - 5][20] = 2;
levelLayout[levelHeightTiles - 5][21] = 2;
levelLayout[levelHeightTiles - 5][22] = 2;

// Higher platform
for (let i = 0; i < 5; i++) {
    levelLayout[levelHeightTiles - 8][35 + i] = 2;
}

// Another set of blocks
levelLayout[levelHeightTiles - 5][50] = 2;
levelLayout[levelHeightTiles - 9][55] = 2;
levelLayout[levelHeightTiles - 9][56] = 2;

// A small pyramid
levelLayout[levelHeightTiles - 4][70] = 2;
levelLayout[levelHeightTiles - 4][71] = 2;
levelLayout[levelHeightTiles - 4][72] = 2;
levelLayout[levelHeightTiles - 5][71] = 2;

// Longer platform
for (let i = 0; i < 10; i++) {
    levelLayout[levelHeightTiles - 6][85 + i] = 2;
}

// A few single blocks
levelLayout[levelHeightTiles - 5][100] = 2;
levelLayout[levelHeightTiles - 5][105] = 2;
levelLayout[levelHeightTiles - 5][110] = 2;


const levelConfig = {
    layout: levelLayout,
    width: levelWidthTiles,
    height: levelHeightTiles,
    tilemap: {
        1: 'tile_ground',
        2: 'tile_block',
        3: 'tile_pipe_body',
        4: 'tile_pipe_top'
    },
    enemies: [
        { x: 22 * 32, y: (levelHeightTiles - 7) * 32, type: 'enemy_guard', name: 'guard' },
        { x: 40 * 32, y: (levelHeightTiles - 10) * 32, type: 'enemy_guard', name: 'guard' },
        { x: 90 * 32, y: (levelHeightTiles - 8) * 32, type: 'enemy_rat', name: 'rat' },
        { x: 92 * 32, y: (levelHeightTiles - 8) * 32, type: 'enemy_rat', name: 'rat' }
    ],
    NPCs: []
};

export default levelConfig;
