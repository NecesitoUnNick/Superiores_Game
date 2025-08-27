export default class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, textureKey) {
        super(scene, x, y, textureKey);

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Properties
        this.speed = 300;
        this.body.setAllowGravity(false);
    }

    fire(x, y, direction) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        if (direction === 'left') {
            this.setVelocityX(-this.speed);
        } else {
            this.setVelocityX(this.speed);
        }
    }

    update(time, delta) {
        // Deactivate if it goes off-screen
        if (this.x < 0 || this.x > this.scene.physics.world.bounds.width) {
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
    }
}
