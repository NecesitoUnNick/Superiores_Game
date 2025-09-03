const levelLayout = [];
const levelWidthTiles = 400;
const levelHeightTiles = 60;

// Initialize with empty tiles
for (let y = 0; y < levelHeightTiles; y++) {
    levelLayout[y] = new Array(levelWidthTiles).fill(0);
}

// Create ground (bottom two rows)
for (let x = 0; x < levelWidthTiles; x++) {
    levelLayout[levelHeightTiles - 1][x] = 1; // Ground
    levelLayout[levelHeightTiles - 2][x] = 1; // Ground
}

// Add some platforms and blocks (example layout)
// Platform 1
for (let i = 0; i < 5; i++) {
    levelLayout[levelHeightTiles - 5][20 + i] = 2; // Blocks in air
}
// Platform 2
for (let i = 0; i < 7; i++) {
    levelLayout[levelHeightTiles - 8][50 + i] = 2; // Blocks in air
}
// Pipe
levelLayout[levelHeightTiles - 3][80] = 3; // Pipe body
levelLayout[levelHeightTiles - 3][81] = 3; // Pipe body
levelLayout[levelHeightTiles - 4][80] = 4; // Pipe top
levelLayout[levelHeightTiles - 4][81] = 4; // Pipe top

// More platforms
for (let i = 0; i < 10; i++) {
    levelLayout[levelHeightTiles - 6][100 + i] = 2;
}
for (let i = 0; i < 8; i++) {
    levelLayout[levelHeightTiles - 9][130 + i] = 2;
}
for (let i = 0; i < 6; i++) {
    levelLayout[levelHeightTiles - 12][160 + i] = 2;
}
// Added platforms
for (let i = 0; i < 8; i++) {
    levelLayout[levelHeightTiles - 15][190 + i] = 2;
}
for (let i = 0; i < 10; i++) {
    levelLayout[levelHeightTiles - 18][220 + i] = 2;
}

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
        { x: 300, y: 225, type: 'enemy_guard', name: 'guard' },
        { x: 525, y: 150, type: 'enemy_guard', name: 'guard' },
        { x: 825, y: 225, type: 'enemy_rat', name: 'rat' },
        { x: 900, y: 225, type: 'enemy_rat', name: 'rat' }
    ],
    NPCs: []
};

export default levelConfig;
