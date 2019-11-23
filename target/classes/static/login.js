'use strict'

class Login extends Phaser.Scene {
  constructor() {
    super({key:"login"});
  }
  preload(){
    //MENU
      //Background
      this.load.image('bg_cemetery', 'assets/background/bg_cemetery.png');
      this.load.image('bg_frame', 'assets/background/bg_bg_frame.png');
      //Imagenes
      this.load.image('img_title', 'assets/images/img_title.png');
      //Botones
      this.load.image('bt_play', 'assets/buttons/bt_play.png');
      this.load.image('bt_tutorial', 'assets/buttons/bt_tutorial.png');
      this.load.image('bt_returnmenu', 'assets/buttons/bt_returnmenu.png');
      this.load.image('bt_return', 'assets/buttons/bt_return.png');
      this.load.image('bt_ghostbusters', 'assets/buttons/bt_ghostbusters.png');
      this.load.image('bt_ghosts', 'assets/buttons/bt_ghosts.png');
      this.load.image('bt_ready', 'assets/buttons/bt_ready.png');
      this.load.image('bt_exit', 'assets/buttons/bt_exit.png');
      this.load.image('img_teamSelect', 'assets/images/img_teamSelect.png');
      this.load.image('img_abilitiesSelect', 'assets/images/img_abilitiesSelect.png');
      //Cartas de habilidades
      this.load.image('cd_force', 'assets/cards/cd_force.png');
      this.load.image('cd_reverse', 'assets/cards/cd_reverse.png');
      this.load.image('cd_slow', 'assets/cards/cd_slow.png');
      //Imagen tutorial
      this.load.image('img_tutorial', 'assets/images/img_tutorial1.png');
    //CUTSCENE
      //Actors
      this.load.spritesheet('ch_blueGhostL', 'assets/characters/ch_blueGhostLateral.png', { frameWidth: 4000/5, frameHeight: 4000/5});
      this.load.spritesheet('ch_redGhostL', 'assets/characters/ch_redGhostLateral.png', { frameWidth: 4000/5, frameHeight: 4000/5});
      this.load.spritesheet('ch_ghostbusterL', 'assets/characters/ch_ghostbusterLateral.png',{ frameWidth: 3460/4, frameHeight: 5910/8});
      //Background
      this.load.image('interior', 'assets/background/bg_interior.png');
      this.load.image('frame', 'assets/background/bg_frame.png');
    //BATTLE
      //Personajes
      this.load.spritesheet('ch_ghostbuster1', 'assets/characters/ch_ghostbuster.png',{ frameWidth: 3480/4, frameHeight: 5214/6 });
      this.load.spritesheet('ch_ghostbuster2', 'assets/characters/ch_ghostbuster.png',{ frameWidth: 3480/4, frameHeight: 5214/6 });    
      this.load.spritesheet('ch_blueGhost', 'assets/characters/ch_blueGhost.png',{ frameWidth: 1024/4, frameHeight: 1422/6 }); //rojo 1428
      this.load.spritesheet('ch_redGhost', 'assets/characters/ch_redGhost.png',{ frameWidth: 1024/4, frameHeight: 1428/6 });
      //2 Escenario
      this.load.image('sp_tombstone', 'assets/props/sp_tombstone.png');
      this.load.image('bg_cemetery', 'assets/background/bg_cemetery.png');
      //Debug
      this.load.image('db_char1', 'assets/characters/db_char1.png');
      this.load.image('db_char2', 'assets/characters/db_char2.png');
  }

  create(){
	  
  }

  update(){
    this.scene.start('menu');
  }
}
