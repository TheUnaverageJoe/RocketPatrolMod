class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    
    preload() {
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('nasa', './assets/NasaRocket.png');
        this.load.image('particle', './assets/explosionParticle.png');
        //this.load.image('mine', './assets/Mine.png');   Useless because I cant use it in Rocket.js

        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0, 0);

        //instantiate new ship type
        this.nasa01 = new Nasa(this, game.config.width, borderUISize * 3 + borderPadding, 'nasa', 0, 50).setOrigin(0, 0);

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        this.p1Score = 0;

        var scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);

        //Initiallize timer
        this.p1Time = game.settings.gameTimer/1000;
        this.timer = this.add.text(game.config.width - borderUISize*4 - borderPadding, borderUISize + borderPadding * 2, this.p1Time, scoreConfig);
        this.timeDec = true; 

        this.gameOver = false;

        scoreConfig.fixedWidth = 0;

        //instantiate and hide of end game text
        this.overText = this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        this.restartText = this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
        this.overText.alpha = 0;
        this.restartText.alpha = 0; 
        
        //cant do particle creation here because the variable is local
        //making it global breaks one of the inherited functions

    }

    update() {
        //timer updating and display
        if(this.timeDec && !this.gameOver) {
            this.timeDec = false;
            this.time.delayedCall(1000, () => {
                this.p1Time -= 1;
                this.timer.text = this.p1Time;
                if(this.p1Time <= 0) {
                    this.overText.alpha = 1;
                    this.restartText.alpha = 1;
                    this.gameOver = true;
                }
                this.timeDec = true;
            }, null, this);
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;
        if(!this.gameOver) {
           this.p1Rocket.update();
           this.ship01.update();
           this.ship02.update();
           this.ship03.update();
           this.nasa01.update();
        }

        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if(this.checkCollision(this.p1Rocket, this.nasa01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.nasa01);
        }

    }

    checkCollision(rocket, ship) {
        if(rocket.x < ship.x + ship.width &&
           rocket.x + rocket.width > ship.x &&
           rocket.y < ship.y + ship.height &&
           rocket.height + rocket.y > ship.y) {
               return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {

        //https://www.html5gamedevs.com/topic/36961-how-to-destroy-particle-emitter/
        //citation for particle effect help
        ship.alpha = 0;
        var particleConfig = {
            x: ship.x,
            y: ship.y,
            speed: 100,
            alpha: 0.5,
            lifespan: 500,
            scale: {start: 1, end: 0},
            quantity: 2,
            blendMode: 'ADD',
            active:  true
        }
        var particles = this.add.particles('particle');
        var emitter = particles.createEmitter(particleConfig);
        this.time.delayedCall(300, () => {
            particles.destroy();
        });
        
        /* Old death animation
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        */

        ship.reset();
        ship.alpha = 1;

        this.p1Time += 2;
        this.timer.text = this.p1Time;
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
}