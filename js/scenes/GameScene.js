import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import Projectile from '../entities/Projectile.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.player = null;
        this.character = '';
        this.characterTexture = '';
        this.platforms = null;
        this.enemies = null;
        this.projectiles = null;
        this.lives = 3;
        this.score = 0;
        this.livesText = null;
        this.scoreText = null;
        this.maxScrollX = 0;
    }

    init(data) {
        this.character = data.character;
        this.characterTexture = data.characterTexture;
        // Persist lives and score across scene restarts
        this.lives = data.lives === undefined ? 3 : data.lives;
        this.score = data.score === undefined ? 0 : data.score;
    }

    preload() {
        // Tiles
        this.load.image('tile_ground', 'assets/images/tiles/ground/ground.png');
        this.load.image('tile_block', 'assets/images/tiles/block/block.png');
        this.load.image('tile_pipe_top', 'assets/images/tiles/pipe/tile_pipe_top.png');
        this.load.image('tile_pipe_body', 'assets/images/tiles/pipe/tile_pipe_body.png');

        // Enemies
        this.load.spritesheet('enemy_guard', 'assets/images/enemies/guard/enemy_guard.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('enemy_rat', 'assets/images/enemies/rat/enemy_rat.png', { frameWidth: 64, frameHeight: 64 });

        // Projectiles
        this.load.image('book', 'assets/images/projectiles/book/book.png');
        this.load.image('money', 'assets/images/projectiles/money/money.png');
        this.load.image('brain', 'assets/images/projectiles/brain/brain.png');
        this.load.image('bitcoin', 'assets/images/projectiles/bitcoin/bitcoin.png');
        this.load.image('powerpoint', 'assets/images/projectiles/powerpoint/powerpoint.png');
        this.load.image('photoshop', 'assets/images/projectiles/photoshop/photoshop.png');
        this.load.image('backhoe', 'assets/images/projectiles/backhoe/backhoe.png');
        this.load.image('soccer_ball', 'assets/images/projectiles/soccer_ball/soccer_ball.png');
        this.load.image('maple_leaf', 'assets/images/projectiles/maple_leaf/maple_leaf.png'); // New projectile

        // Projectile (default, if needed, but now using character-specific)
        let projectileGraphics = this.make.graphics({ width: 8, height: 8 });
        projectileGraphics.fillStyle(0xffffff, 1);
        projectileGraphics.fillCircle(4, 4, 4);
        projectileGraphics.generateTexture('projectile', 8, 8); // Keep for backward compatibility or default
        projectileGraphics.destroy();
    }

    create() {
        // Level layout (10 screens wide = 6400 pixels / 16 pixels/tile = 400 tiles)
        const levelWidthTiles = 400;
        const levelHeightTiles = 50; // 800 pixels / 16 pixels/tile = 50 tiles
        const levelLayout = [];

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


        this.platforms = this.physics.add.staticGroup();
        levelLayout.forEach((row, y) => {
            row.forEach((tile, x) => {
                if (tile === 1) {
                                        this.platforms.create(x * 24, y * 24, 'tile_ground').setOrigin(0,0).setScale(1.5).refreshBody();
                } else if (tile === 2) {
                    this.platforms.create(x * 24, y * 24, 'tile_block').setOrigin(0,0).setScale(1.5).refreshBody();
                } else if (tile === 3) {
                    this.platforms.create(x * 24, y * 24, 'tile_pipe_body').setOrigin(0,0).setScale(1.5).refreshBody();
                } else if (tile === 4) {
                    this.platforms.create(x * 24, y * 24, 'tile_pipe_top').setOrigin(0,0).setScale(1.5).refreshBody();
                }
            });
        });

        this.player = new Player(this, 75, 150, this.character, this.characterTexture);
        this.physics.add.collider(this.player, this.platforms);
        console.log('Player created:', this.player); // Debug log

        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        this.physics.add.collider(this.enemies, this.platforms);
        this.enemies.add(new Enemy(this, 300, 225, 'enemy_guard', 'guard'));
        this.enemies.add(new Enemy(this, 525, 150, 'enemy_guard', 'guard'));
        this.enemies.add(new Enemy(this, 825, 225, 'enemy_rat', 'rat'));
        this.enemies.add(new Enemy(this, 900, 225, 'enemy_rat', 'rat'));
        this.physics.add.collider(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);

        // Projectiles
        this.projectiles = this.physics.add.group({ classType: Projectile, runChildUpdate: true });
        this.physics.add.collider(this.projectiles, this.platforms, this.handleProjectilePlatformCollision, null, this);
        this.physics.add.collider(this.projectiles, this.enemies, this.handleProjectileEnemyCollision, null, this);


        const levelWidth = levelWidthTiles * 64; // Use the new calculated width
        const levelHeight = levelHeightTiles * 64; // Use the new calculated height
        this.physics.world.setBounds(0, 0, levelWidth, levelHeight);
        this.cameras.main.setBounds(0, 0, levelWidth, levelHeight);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        this.livesText = this.add.text(20, 20, `Vidas: ${this.lives}`, { fontSize: '24px', fill: '#fff', fontFamily: 'Arial' }).setScrollFactor(0);
        this.scoreText = this.add.text(20, 40, `Puntaje: ${this.score}`, { fontSize: '24px', fill: '#fff', fontFamily: 'Arial' }).setScrollFactor(0);

        this.time.addEvent({
            delay: 1000,
            callback: () => { this.score += 10; },
            callbackScope: this,
            loop: true
        });

        const winZone = this.add.zone(levelWidth - 64, levelHeight - 100).setSize(64, 64); // Adjusted winZone position and size
        this.physics.world.enable(winZone);
        winZone.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, winZone, () => {
            this.add.text(this.cameras.main.scrollX + 320, 240, '¡GANASTE!', { fontSize: '64px', fill: '#0f0', fontFamily: 'Arial' }).setOrigin(0.5);
            this.physics.pause();
        }, null, this);

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });
    }

    update(time, delta) {
        console.log('GameScene update loop running.'); // Debug log
        if (this.player.active) {
            console.log('Player update called.'); // Debug log
            this.player.update(time, delta);
            this.scoreText.setText(`Puntaje: ${this.score}`); // Corrected translation
        }

        // Lock camera scrolling to the left
        if (this.cameras.main.scrollX < this.maxScrollX) {
            this.cameras.main.scrollX = this.maxScrollX;
        } else {
            this.maxScrollX = this.cameras.main.scrollX;
        }

        // Prevent player from going off-screen left
        if (this.player.x < this.cameras.main.scrollX) {
            this.player.x = this.cameras.main.scrollX;
        }
    }

    fireProjectile(x, y, direction) {
        const projectileType = this.player.stats.power; // Get projectile type from player stats
        const projectile = new Projectile(this, x, y, projectileType); // Use the specific projectile type
        this.projectiles.add(projectile);
        projectile.fire(x, y, direction);
    }

    handleProjectilePlatformCollision(projectile, platform) {
        projectile.destroy();
    }

    handleProjectileEnemyCollision(projectile, enemy) {
        projectile.destroy();
        enemy.destroy();
        this.score += 100; // Add points for hitting an enemy
    }

    handlePlayerEnemyCollision(player, enemy) {
        this.lives--;
        this.livesText.setText(`Lives: ${this.lives}`);

        if (this.lives > 0) {
            this.scene.restart({
                character: this.character,
                characterTexture: this.characterTexture,
                lives: this.lives,
                score: this.score
            });
        } else {
            this.gameOver();
        }
    }

    gameOver() {
        this.physics.pause();
        this.player.setTint(0xff0000);

        const gameOverText = this.add.text(this.cameras.main.scrollX + 400, 300, 'FIN DEL JUEGO', {
            fontSize: '64px',
            fill: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 8, // Increased stroke thickness for better visibility
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.scene.start('MenuScene');
            },
            callbackScope: this
        });
    }
}