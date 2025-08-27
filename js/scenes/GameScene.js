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
        let tileGraphics = this.make.graphics({ width: 16, height: 16 });
        tileGraphics.fillStyle(0x808080, 1);
        tileGraphics.fillRect(0, 0, 16, 16);
        tileGraphics.generateTexture('tile_stone', 16, 16);
        tileGraphics.destroy();

        // Enemies
        let guardGraphics = this.make.graphics({ width: 16, height: 16 });
        guardGraphics.fillStyle(0xffa500, 1);
        guardGraphics.fillRect(0, 0, 16, 16);
        guardGraphics.generateTexture('enemy_guard', 16, 16);
        guardGraphics.destroy();

        let ratGraphics = this.make.graphics({ width: 16, height: 16 });
        ratGraphics.fillStyle(0x8b4513, 1);
        ratGraphics.fillRect(0, 0, 16, 16);
        ratGraphics.generateTexture('enemy_rat', 16, 16);
        ratGraphics.destroy();

        // Projectile
        let projectileGraphics = this.make.graphics({ width: 8, height: 8 });
        projectileGraphics.fillStyle(0xffffff, 1);
        projectileGraphics.fillCircle(4, 4, 4);
        projectileGraphics.generateTexture('projectile', 8, 8);
        projectileGraphics.destroy();
    }

    create() {
        // Level layout
        const levelLayout = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];

        this.platforms = this.physics.add.staticGroup();
        levelLayout.forEach((row, y) => {
            row.forEach((tile, x) => {
                if (tile === 1) {
                    this.platforms.create(x * 16, y * 16, 'tile_stone').setOrigin(0,0).refreshBody();
                }
            });
        });

        this.player = new Player(this, 50, 100, this.character, this.characterTexture);
        this.physics.add.collider(this.player, this.platforms);

        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        this.physics.add.collider(this.enemies, this.platforms);
        this.enemies.add(new Enemy(this, 200, 150, 'enemy_guard', 'guard'));
        this.enemies.add(new Enemy(this, 350, 100, 'enemy_guard', 'guard'));
        this.enemies.add(new Enemy(this, 550, 150, 'enemy_rat', 'rat'));
        this.enemies.add(new Enemy(this, 600, 150, 'enemy_rat', 'rat'));
        this.physics.add.collider(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);

        // Projectiles
        this.projectiles = this.physics.add.group({ classType: Projectile, runChildUpdate: true });
        this.physics.add.collider(this.projectiles, this.platforms, this.handleProjectilePlatformCollision, null, this);
        this.physics.add.collider(this.projectiles, this.enemies, this.handleProjectileEnemyCollision, null, this);


        const levelWidth = levelLayout[0].length * 16;
        const levelHeight = levelLayout.length * 16;
        this.physics.world.setBounds(0, 0, levelWidth, levelHeight);
        this.cameras.main.setBounds(0, 0, levelWidth, levelHeight);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        this.livesText = this.add.text(10, 10, `Lives: ${this.lives}`, { fontSize: '12px', fill: '#fff' }).setScrollFactor(0);
        this.scoreText = this.add.text(10, 25, `Score: ${this.score}`, { fontSize: '12px', fill: '#fff' }).setScrollFactor(0);

        this.time.addEvent({
            delay: 1000,
            callback: () => { this.score += 10; },
            callbackScope: this,
            loop: true
        });

        const winZone = this.add.zone(levelWidth - 32, 160).setSize(32, 32);
        this.physics.world.enable(winZone);
        winZone.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, winZone, () => {
            this.add.text(this.cameras.main.scrollX + 160, 120, 'YOU WIN!', { fontSize: '32px', fill: '#0f0' }).setOrigin(0.5);
            this.physics.pause();
        }, null, this);

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });
    }

    update(time, delta) {
        if (this.player.active) {
            this.player.update(time, delta);
            this.scoreText.setText(`Score: ${this.score}`);
        }
    }

    fireProjectile(x, y, direction) {
        const projectile = new Projectile(this, x, y, 'projectile');
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

        const gameOverText = this.add.text(this.cameras.main.scrollX + 160, 120, 'GAME OVER', {
            fontSize: '32px',
            fill: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 4
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
