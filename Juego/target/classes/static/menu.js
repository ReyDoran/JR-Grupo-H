'use strict'

/*
Escena menú principal.
En esta escena se puede acceder a una partida y al bt_tutorial.
Si seleccionas bt_play una partida te lleva por diferentes submenús para configurar la partida.
Cuando ya se ha configurado todo, se llama a la escena cutscene
*/

var conectado = false;;

class Menu extends Phaser.Scene {
  constructor() {
      super({key:"menu"});
  }

  preload() {

  }

  create() {
      //Pintamos el fondo
      this.backgroundBlack = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, 'bg_black');

      //MENU PRINCIPAL
      this.bt_play = this.add.image(gameWidth/2,gameHeight*3/12,'bt_play').setInteractive();
      this.bt_online = this.add.image(gameWidth/2,gameHeight/2,'bt_online').setInteractive();
      this.bt_tutorial = this.add.image(gameWidth/2,gameHeight*9/12,'bt_tutorial').setInteractive();

      //Boton de jugar
      this.bt_play.on('pointerdown', function (pointer){
        this.disableMainMenu();
        this.scene.start('seleccionpjh');
      }, this);

      //Boton de online
      this.bt_online.on('pointerdown', function (pointer){
        this.scene.start('login');
      }, this);

      //Boton de tutorial
      this.bt_tutorial.on('pointerdown', function (pointer){
        this.disableMainMenu();
        this.showTutorial1();
      }, this);

      this.bt_play.disableInteractive();
      this.bt_tutorial.disableInteractive();

      //TUTORIAL
      this.img_tutorial1 = this.add.image(gameWidth/2, gameHeight/2, 'img_tutorial1');
      this.img_tutorial1.setAlpha(0);
      this.img_tutorial2 = this.add.image(gameWidth/2, gameHeight/2, 'img_tutorial2');
      this.img_tutorial2.setAlpha(0);

      //Son return to ___
      this.returnMenu = this.add.image(gameWidth*7/50, gameHeight*9/50, 'bt_return').setAlpha(0).setScale(0.7);
      this.returnTuto = this.add.image(gameWidth*7/50, gameHeight*9/50, 'bt_return').setAlpha(0).setScale(0.7);

      this.nextTuto = this.add.image(gameWidth*43/50, gameHeight*9/50, 'bt_advance').setAlpha(0).setScale(0.7);
      this.nextMenu = this.add.image(gameWidth*43/50, gameHeight*9/50, 'bt_advance').setAlpha(0).setScale(0.7);

      //Son return to ___
      this.returnTuto.on('pointerdown', function (pointer){
        this.disableTutorial2();
        this.showTutorial1();
      }, this);

      this.nextTuto.on('pointerdown', function (pointer){
        this.disableTutorial1();
        this.showTutorial2();
      }, this);

      this.nextMenu.on('pointerdown', function (pointer){
        this.disableTutorial2();
        this.showMainMenu();
      }, this);

      this.returnMenu.disableInteractive();

      //Llamamos a que se muestre el Main menú, ya que todos están deshabilitados.
      this.showMainMenu();

      this.returnMenu.on('pointerdown', function (pointer){
        this.disableTutorial1();
        this.showMainMenu();
      }, this);
      //Interfaz por encima de casi todo
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

  showMainMenu() {
    //console.log("Estoy en el menu");
    //console.log(this.iter);
    this.bt_play.setAlpha(1);
    this.bt_online.setAlpha(1);
    this.bt_tutorial.setAlpha(1);
    this.bt_play.setInteractive();
    this.bt_online.setInteractive();
    this.bt_tutorial.setInteractive();
  }

  disableMainMenu() {
    this.bt_play.disableInteractive();
    this.bt_play.setAlpha(0);
    this.bt_online.disableInteractive();
    this.bt_online.setAlpha(0);
    this.bt_tutorial.disableInteractive();
    this.bt_tutorial.setAlpha(0);
  }

  showTutorial1() {
    this.img_tutorial1.setAlpha(1);
    this.returnMenu.setAlpha(1);
    this.returnMenu.setInteractive();
    this.nextTuto.setAlpha(1);
    this.nextTuto.setInteractive();
  }

  disableTutorial1(){
    this.img_tutorial1.setAlpha(0);
    this.returnMenu.setAlpha(0);
    this.returnMenu.disableInteractive();
    this.nextTuto.setAlpha(0);
    this.nextTuto.disableInteractive();
  }

  showTutorial2() {
    this.img_tutorial2.setAlpha(1);
    this.returnTuto.setAlpha(1);
    this.returnTuto.setInteractive();
    this.nextMenu.setAlpha(1);
    this.nextMenu.setInteractive();
  }

  disableTutorial2(){
    this.img_tutorial2.setAlpha(0);
    this.returnTuto.setAlpha(0);
    this.returnTuto.disableInteractive();
    this.nextMenu.setAlpha(0);
    this.nextMenu.disableInteractive();
  }

  update(){

  }
}
