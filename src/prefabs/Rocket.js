class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = 2;
        this.sfxRocket = scene.sound.add('sfx_rocket');
    }

    update() {

        //Cant load a find texture 'mine' from here
        //if(Phaser.Input.Keyboard.JustDown(keyG) && this.isFiring) {
            //console.log(mine);
           // mine = new Mine(this, this.x, this.y, 'mine', 0).setOrigin(0, 0);
        //}

        //Mouse Input
        var pointer = game.input.activePointer;

        if(!this.isFiring) {
            if(pointer.worldX < this.x && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if(pointer.worldX > this.x && this.x <= game.config.width -
                      borderUISize - this.width){
                this.x += this.moveSpeed;
            }
        }

        if(pointer.leftButtonDown() && !this.isFiring){
            this.isFiring = true;
            this.sfxRocket.play();
        }

        //keyboard input
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= borderUISize + this.width){
                this.x -= this.moveSpeed;
            } else if(keyRIGHT.isDown && this.x <= game.config.width -
            borderUISize - this.width){
                this.x += this.moveSpeed;
            }
        }

        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();
        }

        // Firing mechanics
        if(this.isFiring &&  this.y >= borderUISize *3 + borderPadding) {
            this.y -= this.moveSpeed;
        }

        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}