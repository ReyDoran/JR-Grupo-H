'use strict'

class Intro extends Phaser.Scene {
	constructor() {
		super({key:"intro"});
	}

	preload() {
		//INTRO
		this.load.image('img_title','assets/images/img_title.png')
		
		//MENU
		//Background
		this.load.image('bg_black', 'assets/background/1280x720-black-solid-color-background.jpg');
		this.load.image('bg_frame', 'assets/background/bg_frame.png');
		this.load.image('bg_square', 'assets/background/bg_square.png');
		this.load.spritesheet('bg_estatica', 'assets/background/bg_estatica.png', { frameWidth: 1280, frameHeight: 720});
		
		//Botones
		this.load.image('bt_play', 'assets/buttons/bt_play.png');
		this.load.image('bt_online', 'assets/buttons/bt_online.png');
		this.load.image('online', 'assets/buttons/bt_online.png');
		this.load.image('bt_tutorial', 'assets/buttons/bt_tutorial.png');
		this.load.image('bt_return', 'assets/buttons/bt_return.png');
		this.load.image('bt_advance', 'assets/buttons/bt_advance.png');
		this.load.image('bt_ghostbusterM', 'assets/buttons/bt_ghostbusterM.png');
		this.load.image('bt_ghostbusterW', 'assets/buttons/bt_ghostbusterW.png');
		this.load.image('bt_blueGhost', 'assets/buttons/bt_blueGhost.png');
		this.load.image('bt_redGhost', 'assets/buttons/bt_redGhost.png');
		this.load.image('bt_ready', 'assets/buttons/bt_ready.png');
		this.load.image('bt_chat','assets/buttons/bt_chat.png');
		this.load.image('img_teamSelect', 'assets/images/img_teamSelect.png');
		this.load.image('img_abilitiesSelect', 'assets/images/img_abilitiesSelect.png');
		this.load.image('img_player1', 'assets/images/img_player1.png');
		this.load.image('img_player2', 'assets/images/img_player2.png');
		
		//Cartas de habilidades
		this.load.image('cd_force', 'assets/cards/cd_force.png');
		this.load.image('cd_reverse', 'assets/cards/cd_reverse.png');
		this.load.image('cd_slow', 'assets/cards/cd_slow.png');
		
		//Imagenes
		this.load.image('img_tutorial1', 'assets/images/img_tutorial1.png');
		this.load.image('img_tutorial2', 'assets/images/img_tutorial2.png');
		
		/*
		//CUTSCENE
		//Actors
		this.load.spritesheet('ch_blueGhostL', 'assets/characters/ch_blueGhostLateral.png', { frameWidth: 4000/5, frameHeight: 4000/5});
		this.load.spritesheet('ch_redGhostL', 'assets/characters/ch_redGhostLateral.png', { frameWidth: 4000/5, frameHeight: 4000/5});
		this.load.spritesheet('ch_ghostbusterL', 'assets/characters/ch_ghostbusterLateral.png',{ frameWidth: 3460/4, frameHeight: 5910/8});
		
		//Background
		this.load.image('interior', 'assets/background/bg_interior.png');
		this.load.image('frame', 'assets/background/bg_frame.png');
		
		//BATTLE
		//Cartas
		this.load.image('cd_force_ig', 'assets/cards/cd_force_ig.png');
		this.load.image('cd_reverse_ig', 'assets/cards/cd_reverse_ig.png');
		this.load.image('cd_slow_ig', 'assets/cards/cd_slow_ig.png');
		this.load.image('img_cross','assets/images/img_cross.png');
		
		//Personajes
		this.load.image('ch_ghostbusterMFace', 'assets/characters/ch_ghostbusterMFace.png');
		this.load.image('ch_ghostbusterWFace', 'assets/characters/ch_ghostbusterWFace.png');
		this.load.image('ch_blueGhostFace', 'assets/characters/ch_blueGhostFace.png');
		this.load.image('ch_redGhostFace', 'assets/characters/ch_redGhostFace.png');
		this.load.spritesheet('ch_ghostbusterM', 'assets/characters/ch_ghostbusterM.png',{ frameWidth: 3480/4, frameHeight: 5214/6 });
		this.load.spritesheet('ch_ghostbusterW', 'assets/characters/ch_ghostbusterW.png',{ frameWidth: 3480/4, frameHeight: 5214/6 });
		this.load.spritesheet('ch_blueGhost', 'assets/characters/ch_blueGhost.png',{ frameWidth: 950/4, frameHeight: 1422/6 });
		this.load.spritesheet('ch_redGhost', 'assets/characters/ch_redGhost.png',{ frameWidth: 950/4, frameHeight: 1428/6 });
		
		//Escenario
		this.load.image('sp_tombstone', 'assets/props/sp_tombstone.png');
		this.load.image('bg_cemetery', 'assets/background/bg_cemetery.png');
		*/
	}

	create() {
		this.title = this.add.image(gameWidth/2, gameHeight/2, 'img_title').setInteractive();
		this.title.on('pointerdown', function(pointer){ this.scene.start('menu'); }, this);
		
		this.bg_estatica = this.add.sprite(gameWidth*11/20,gameHeight/2,'bg_estatica').setAlpha(0.05);
		this.anims.create({
			key: 'bg_estatica_anim',
			frames: this.anims.generateFrameNumbers('bg_estatica'),
			frameRate: 20,
			repeat: -1
		});
		this.bg_estatica.play('bg_estatica_anim');
		
		this.TVBorder = this.add.image(gameWidth/2, gameHeight/2, 'bg_frame');
	}
	update(){}
}
