import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import Projectile from '../entities/Projectile.js';
import levelConfig from '../levels/level1.js';
import inputState from '../utils/inputState.js';

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
        this.TILE_SIZE = 32;
    }

    init(data) {
        this.character = data.character;
        this.characterTexture = data.characterTexture;
        // Persist lives and score across scene restarts
        this.lives = data.lives === undefined ? 3 : data.lives;
        this.score = data.score === undefined ? 0 : data.score;
        this.levelConfig = levelConfig;
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
        const levelLayout = this.levelConfig.layout;
        const levelWidthTiles = this.levelConfig.width;
        const levelHeightTiles = this.levelConfig.height;

        this.platforms = this.physics.add.staticGroup();
        levelLayout.forEach((row, y) => {
            row.forEach((tile, x) => {
                const tileType = this.levelConfig.tilemap[tile];
                if (tileType) {
                    this.platforms.create(x * this.TILE_SIZE, y * this.TILE_SIZE, tileType).setOrigin(0,0).refreshBody();
                }
            });
        });

        const playerStartX = 3 * this.TILE_SIZE;
        const playerStartY = (this.levelConfig.height - 3) * this.TILE_SIZE;

        this.player = new Player(this, playerStartX, playerStartY, this.character, this.characterTexture);
        this.physics.add.collider(this.player, this.platforms);
        console.log('Player created:', this.player); // Debug log

        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        this.physics.add.collider(this.enemies, this.platforms);
        this.levelConfig.enemies.forEach(enemyConfig => {
            this.enemies.add(new Enemy(this, enemyConfig.x, enemyConfig.y, enemyConfig.type, enemyConfig.name));
        });
        this.physics.add.collider(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);

        // Projectiles
        this.projectiles = this.physics.add.group({ classType: Projectile, runChildUpdate: true });
        this.physics.add.collider(this.projectiles, this.platforms, this.handleProjectilePlatformCollision, null, this);
        this.physics.add.collider(this.projectiles, this.enemies, this.handleProjectileEnemyCollision, null, this);


        const levelWidth = this.levelConfig.width * this.TILE_SIZE;
        const levelHeight = this.levelConfig.height * this.TILE_SIZE;
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

        this.initializeControls();
    }

    initializeControls() {
        // Touch controls
        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnJump = document.getElementById('btn-jump');
        const btnPower = document.getElementById('btn-power');
        const btnUp = document.getElementById('btn-up');
        const btnDown = document.getElementById('btn-down');

        const preventDefaults = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const setInput = (key, value) => {
            inputState[key] = value;
        };

        // Left
        btnLeft.addEventListener('touchstart', (e) => { preventDefaults(e); setInput('left', true); });
        btnLeft.addEventListener('touchend', (e) => { preventDefaults(e); setInput('left', false); });
        btnLeft.addEventListener('mousedown', (e) => { preventDefaults(e); setInput('left', true); });
        btnLeft.addEventListener('mouseup', (e) => { preventDefaults(e); setInput('left', false); });

        // Right
        btnRight.addEventListener('touchstart', (e) => { preventDefaults(e); setInput('right', true); });
        btnRight.addEventListener('touchend', (e) => { preventDefaults(e); setInput('right', false); });
        btnRight.addEventListener('mousedown', (e) => { preventDefaults(e); setInput('right', true); });
        btnRight.addEventListener('mouseup', (e) => { preventDefaults(e); setInput('right', false); });

        // Jump
        btnJump.addEventListener('touchstart', (e) => { preventDefaults(e); setInput('jump', true); });
        btnJump.addEventListener('touchend', (e) => { preventDefaults(e); setInput('jump', false); });
        btnJump.addEventListener('mousedown', (e) => { preventDefaults(e); setInput('jump', true); });
        btnJump.addEventListener('mouseup', (e) => { preventDefaults(e); setInput('jump', false); });

        // Power
        btnPower.addEventListener('touchstart', (e) => { preventDefaults(e); setInput('power', true); });
        btnPower.addEventListener('touchend', (e) => { preventDefaults(e); setInput('power', false); });
        btnPower.addEventListener('mousedown', (e) => { preventDefaults(e); setInput('power', true); });
        btnPower.addEventListener('mouseup', (e) => { preventDefaults(e); setInput('power', false); });

        // Up (for consistency, maps to jump as well)
        btnUp.addEventListener('touchstart', (e) => { preventDefaults(e); setInput('jump', true); });
        btnUp.addEventListener('touchend', (e) => { preventDefaults(e); setInput('jump', false); });
        btnUp.addEventListener('mousedown', (e) => { preventDefaults(e); setInput('jump', true); });
        btnUp.addEventListener('mouseup', (e) => { preventDefaults(e); setInput('jump', false); });

        // Down
        btnDown.addEventListener('touchstart', (e) => { preventDefaults(e); setInput('down', true); });
        btnDown.addEventListener('touchend', (e) => { preventDefaults(e); setInput('down', false); });
        btnDown.addEventListener('mousedown', (e) => { preventDefaults(e); setInput('down', true); });
        btnDown.addEventListener('mouseup', (e) => { preventDefaults(e); setInput('down', false); });


        // Keyboard controls
        this.input.keyboard.on('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                    setInput('left', true);
                    break;
                case 'ArrowRight':
                case 'd':
                    setInput('right', true);
                    break;
                case 'ArrowUp':
                case 'w':
                case ' ': // Space for jump
                    setInput('jump', true);
                    break;
                case 'p': // P for power
                    setInput('power', true);
                    break;
            }
        });

        this.input.keyboard.on('keyup', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                    setInput('left', false);
                    break;
                case 'ArrowRight':
                case 'd':
                    setInput('right', false);
                    break;
                case 'ArrowUp':
                case 'w':
                case ' ': // Space for jump
                    setInput('jump', false);
                    break;
                case 'p': // P for power
                    setInput('power', false);
                    break;
            }
        });
    }

    update(time, delta) {
        if (this.player.active) {
            this.player.update(time, delta);
            this.scoreText.setText(`Puntaje: ${this.score}`); // Corrected translation

            // Fall detection
            if (this.player.y > this.levelConfig.height * this.TILE_SIZE) {
                this.handlePlayerFall();
            }
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

    handlePlayerFall() {
        this.lives--;
        this.livesText.setText(`Vidas: ${this.lives}`);

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