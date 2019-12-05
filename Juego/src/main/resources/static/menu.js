'use strict'

var nam = document.getElementById('name');
var pass = document.getElementById('pass');
var logIn = document.getElementById('butLogIn');
var signUp = document.getElementById('butSignUp');
var chat = document.getElementById('chat');
var send = document.getElementById('butChat');
nam.style.display = 'none';
pass.style.display = 'none';
logIn.style.display = 'none';
signUp.style.display = 'none';
chat.style.display = 'none';
send.style.display = 'none';

/*
Escena menú principal.
En esta escena se puede acceder a una partida y al bt_tutorial.
Si seleccionas bt_play una partida te lleva por diferentes submenús para configurar la partida.
Cuando ya se ha configurado todo, se llama a la escena cutscene
*/
class Menu extends Phaser.Scene {
  constructor() {
      super({key:"menu"});
  }

  preload() {
	  //MENU
    	//Background
      this.load.image('bg_black', 'assets/background/1280x720-black-solid-color-background.jpg');
      this.load.image('bg_frame', 'assets/background/bg_frame.png');
      this.load.image('bg_square', 'assets/background/bg_square.png');
      this.load.spritesheet('bg_estatica', 'assets/background/bg_estatica.png', { frameWidth: 1280, frameHeight: 720});
    	//Botones
    	this.load.image('bt_play', 'assets/buttons/bt_play.png');
      this.load.image('bt_online', 'assets/buttons/bt_online.png');
    	this.load.image('bt_tutorial', 'assets/buttons/bt_tutorial.png');
    	this.load.image('bt_return', 'assets/buttons/bt_return.png');
    	this.load.image('bt_ghostbusterM', 'assets/buttons/bt_ghostbusterM.png');
      this.load.image('bt_ghostbusterW', 'assets/buttons/bt_ghostbusterW.png');
    	this.load.image('bt_blueGhost', 'assets/buttons/bt_blueGhost.png');
      this.load.image('bt_redGhost', 'assets/buttons/bt_redGhost.png');
    	this.load.image('bt_ready', 'assets/buttons/bt_ready.png');
    	this.load.image('bt_exit', 'assets/buttons/bt_exit.png');
    	this.load.image('img_teamSelect', 'assets/images/img_teamSelect.png');
    	this.load.image('img_abilitiesSelect', 'assets/images/img_abilitiesSelect.png');
      this.load.image('img_player1', 'assets/images/img_player1.png');
      this.load.image('img_player2', 'assets/images/img_player2.png');
    	//Cartas de habilidades
    	this.load.image('cd_force', 'assets/cards/cd_force.png');
    	this.load.image('cd_reverse', 'assets/cards/cd_reverse.png');
    	this.load.image('cd_slow', 'assets/cards/cd_slow.png');
    	//Imagen tutorial
    	this.load.image('img_tutorial', 'assets/images/img_tutorial.png');
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
    	this.load.spritesheet('ch_ghostbusterM', 'assets/characters/ch_ghostbusterM.png',{ frameWidth: 3480/4, frameHeight: 5214/6 });
    	this.load.spritesheet('ch_ghostbusterW', 'assets/characters/ch_ghostbusterW.png',{ frameWidth: 3480/4, frameHeight: 5214/6 });
    	this.load.spritesheet('ch_blueGhost', 'assets/characters/ch_blueGhost.png',{ frameWidth: 950/4, frameHeight: 1422/6 });
    	this.load.spritesheet('ch_redGhost', 'assets/characters/ch_redGhost.png',{ frameWidth: 950/4, frameHeight: 1428/6 });
    	//2 Escenario
    	this.load.image('sp_tombstone', 'assets/props/sp_tombstone.png');
    	this.load.image('bg_cemetery', 'assets/background/bg_cemetery.png');
  }

  /*
  Crea todos los menús pero desabilita y pone alpha a 0 a todos menos al principal.
  Cada menú se encarga de deshabilitarse y habilitar el siguiente cuando sea el momento.
  */
  create() {
      //Pintamos el fondo
      this.backgroundBlack = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, 'bg_black');

      //Variables auxiliares del menú de habilidades
      this.abilities = [false, false, false]; //Guarda si una carta está seleccionada (indice coincide con posición en pantalla)
      /*
      Este array guarda las habilidades seleccionadas en orden de ronda.
      El índice de abilitiesIndex representa la ronda en la que se va a usar (ya que se copia directo a las posiciones 1, 2 y 3 de playerXConfig)
      El valor que contiene representa el índice por el que se le representa a esa habilidad en battle.js (0 slow, 1 force, 2 reverse)
      */
      this.abilitiesIndex = [0, 0, 0];
      this.abilitiesSelected = 0; //Almacena el número de abilidades seleccionadas (3 el máximo)
      this.abilitiesMenu = false; //Permite que se pueda pintar el botón de listo en 2 tonos de alpha (para cuando es posible clicarlo o no)
      this.iter = 0;  //Almacena en que iteración de la configuración de partida estamos para asignar la configuracion a player1Config o player2Config

      //MENU PRINCIPAL
      this.bt_play = this.add.image(gameWidth/2,gameHeight*3/12,'bt_play').setInteractive();
      this.bt_online = this.add.image(gameWidth/2,gameHeight/2,'bt_online').setInteractive();
      this.bt_tutorial = this.add.image(gameWidth/2,gameHeight*9/12,'bt_tutorial').setInteractive();

      //Boton de jugar
      this.bt_play.on('pointerdown', function (pointer){
        this.disableMainMenu();
        this.showCharSelectMenu();
      }, this);

      //Boton de online
      this.bt_online.on('pointerdown', function (pointer){
        this.scene.start('login');
      }, this);

      //Boton de tutorial
      this.bt_tutorial.on('pointerdown', function (pointer){
        this.disableMainMenu();
        this.showTutorial();
      }, this);

      this.bt_play.disableInteractive();
      this.bt_tutorial.disableInteractive();

      //TUTORIAL
      this.img_tutorial = this.add.image(gameWidth/2, gameHeight/2, 'img_tutorial');
      this.img_tutorial.setAlpha(0);

      //Son return to ___
      this.returnChar = this.add.image(gameWidth*10/50, gameHeight*7/50, 'bt_return').setAlpha(0);
      this.returnChar.setAngle(-20);
      this.returnAbi = this.add.image(gameWidth*10/50, gameHeight*7/50, 'bt_return').setAlpha(0);
      this.returnAbi.setAngle(-20);
      this.returnMenu = this.add.image(gameWidth*10/50, gameHeight*7/50, 'bt_return').setAlpha(0);
      this.returnMenu.setAngle(-20);

      //SELECCIÓN DE EQUIPO
      this.teamSelect = this.add.image(gameWidth*(2/4),gameHeight*(14/60),'img_teamSelect');
      this.teamSelect.setAlpha(0);
      this.player1Selecting = this.add.image(gameWidth*(2/4),gameHeight*(20/60),'img_player1');
      this.player1Selecting.setAlpha(0);
      this.player2Selecting = this.add.image(gameWidth*(2/4),gameHeight*(18/60),'img_player2');
      this.player2Selecting.setAlpha(0);

      this.ghostbusterM = this.add.image(gameWidth*(6/24),gameHeight*3/5,'bt_ghostbusterM').setInteractive();
      this.ghostbusterM.setScale(0.8);
      this.ghostbusterM.setAlpha(0);
      this.ghostbusterW = this.add.image(gameWidth*(10/24),gameHeight*3/5,'bt_ghostbusterW').setInteractive();
      this.ghostbusterW.setScale(0.8);
      this.ghostbusterW.setAlpha(0);
      this.blueGhost = this.add.image(gameWidth*(14/24),gameHeight*3/5,'bt_blueGhost').setInteractive();
      this.blueGhost.setAlpha(0);
      this.redGhost = this.add.image(gameWidth*(18/24),gameHeight*3/5,'bt_redGhost').setInteractive();
      this.redGhost.setAlpha(0);

      /*
      Al pulsarse cada uno de los dos botones, dependiendo de la iteración de la configuración de partida se actualiza:
      El primer parámetro de playerXConfig a 0 o 1 dependiendo de la elección.
      */
      this.ghostbusterM.on('pointerdown', function (pointer){
        if (this.iter == 0) player1Config[0] = 0;
        if (this.iter == 1) player2Config[0] = 0;
        this.disableCharSelectMenu();
        this.showAbilitiesSelectMenu();
      }, this);
      this.ghostbusterM.on('pointerover', function (pointer) { this.ghostbusterM.setScale(0.9); }, this);
      this.ghostbusterM.on('pointerout', function (pointer) { this.ghostbusterM.setScale(0.7); }, this);

      this.ghostbusterW.on('pointerdown', function (pointer){
        if (this.iter == 0) player1Config[0] = 1;
        if (this.iter == 1) player2Config[0] = 1;
        this.disableCharSelectMenu();
        this.showAbilitiesSelectMenu();
      }, this);
      this.ghostbusterW.on('pointerover', function (pointer) { this.ghostbusterW.setScale(0.9); }, this);
      this.ghostbusterW.on('pointerout', function (pointer) { this.ghostbusterW.setScale(0.7); }, this);

      this.blueGhost.on('pointerdown', function (pointer){
        if (this.iter == 0) player1Config[0] = 2;
        if (this.iter == 1) player2Config[0] = 2;
        this.disableCharSelectMenu();
        this.showAbilitiesSelectMenu();
      }, this);
      this.blueGhost.on('pointerover', function (pointer)  { this.blueGhost.setScale(1.1); }, this);
      this.blueGhost.on('pointerout', function (pointer) { this.blueGhost.setScale(0.9); }, this);

      this.redGhost.on('pointerdown', function (pointer){
        if (this.iter == 0) player1Config[0] = 3;
        if (this.iter == 1) player2Config[0] = 3;
        this.disableCharSelectMenu();
        this.showAbilitiesSelectMenu();
      }, this);
      this.redGhost.on('pointerover', function (pointer) { this.redGhost.setScale(1.1); }, this);
      this.redGhost.on('pointerout', function (pointer) { this.redGhost.setScale(0.9); }, this);

      //Son return to ___
      this.returnChar.on('pointerdown', function (pointer){
        this.disableAbilitiesSelectMenu();
        this.showCharSelectMenu();
      }, this);

      this.returnAbi.on('pointerdown', function (pointer){
        this.iter--;
        this.disableCharSelectMenu();
        this.showAbilitiesSelectMenu();
      }, this);

      this.returnMenu.on('pointerdown', function (pointer){
        this.disableTutorial();
        this.disableCharSelectMenu();
        this.showMainMenu();
      }, this);

      this.ghostbusterM.disableInteractive();
      this.ghostbusterW.disableInteractive();
      this.blueGhost.disableInteractive();
      this.redGhost.disableInteractive();
      this.returnChar.disableInteractive();
      this.returnAbi.disableInteractive();
      this.returnMenu.disableInteractive();

      //SELECCION DE HABILIDADES
      /*
      Este menú tiene una característica especial. Tiene un texto encima de cada carta con un número.
      El número representa la ronda en la que será usada.
      Este texto se habilita, deshabilita y actualiza según sea necesario.
      */
      this.offset = 10;

      this.abilitySelect = this.add.image(gameWidth*(2/4),gameHeight*(16/60),'img_abilitiesSelect');

      this.ability0 = this.add.image(gameWidth/4, gameHeight*(35/60), 'cd_slow').setScale(1).setOrigin(0.5);
      this.ability0.text = this.add.text(gameWidth/4-this.offset, gameHeight*(35/60), this.abilitiesSelected + 1, { font: '32px Courier', fill: '#ffffff' });
      this.ability1 = this.add.image(gameWidth*2/4, gameHeight*(35/60), 'cd_force').setScale(1).setOrigin(0.5);
      this.ability1.text = this.add.text(gameWidth*2/4-this.offset, gameHeight*(35/60), this.abilitiesSelected + 1, { font: '32px Courier', fill: '#ffffff' });
      this.ability2 = this.add.image(gameWidth*3/4, gameHeight*(35/60), 'cd_reverse').setScale(1).setOrigin(0.5);
      this.ability2.text = this.add.text(gameWidth*3/4-this.offset, gameHeight*(35/60), this.abilitiesSelected + 1, { font: '32px Courier', fill: '#ffffff' });

      this.ready = this.add.image(gameWidth/2, gameHeight*(6/7), 'bt_ready').setScale(0.045);
      this.ready.setAlpha(0);

      this.abilitySelect.setAlpha(0);
      this.ability0.setAlpha(0);
      this.ability0.text.setAlpha(0);
      this.ability1.setAlpha(0);
      this.ability1.text.setAlpha(0);
      this.ability2.setAlpha(0);
      this.ability2.text.setAlpha(0);

      //Para cada carta se ejecuta el siguiente código al pulsarla
      this.ability0.on('pointerdown', function (pointer){
        //Si está activa en abilities[x]
        if (this.abilities[0] == true) {
          /*
          Se desactivan todas las cartas seleccionadas.
          Se pone a 0 el contador de habilidades seleccionadas.
          Se oculta el texto de número de habilidad.
          */
          this.abilitiesSelected = 0;
          this.abilities[1] = false;
          this.abilities[2] = false;
          this.ability0.text.setAlpha(0);
          this.ability1.text.setAlpha(0);
          this.ability2.text.setAlpha(0);
        }
        //Si no está activa en abilities[x]
        else {
          /*
          Se guarda en abilitiesIndex, en la posición correspondiente a la ronda que se está eligiendo ahora el índice de habilidad
          por el que se le reconoce en la escena battle.
          Se aumenta el número de habilidades seleccionadas.
          Se actualiza el número de la carta y se muestra.
          */
          this.abilitiesIndex[this.abilitiesSelected] = 0;
          this.abilitiesSelected++;
          this.ability0.text.setText(this.abilitiesSelected);
          this.ability0.text.setAlpha(1);
        }
        //Cambiamos el estado de la selección de la carta
        this.abilities[0] = !this.abilities[0];
      }, this);

      this.ability1.on('pointerdown', function (pointer)  {
        if (this.abilities[1] == true) {
          this.abilitiesSelected = 0;
          this.abilities[0] = false;
          this.abilities[2] = false;
          this.ability0.text.setAlpha(0);
          this.ability1.text.setAlpha(0);
          this.ability2.text.setAlpha(0);
        }
        else {
          this.abilitiesIndex[this.abilitiesSelected] = 1;
          this.abilitiesSelected++;
          this.ability1.text.setText(this.abilitiesSelected);
          this.ability1.text.setAlpha(1);
        }
        this.abilities[1] = !this.abilities[1];
      }, this);

      this.ability2.on('pointerdown', function (pointer)  {
        if (this.abilities[2] == true) {
          this.abilitiesSelected = 0;
          this.abilities[0] = false;
          this.abilities[1] = false;
          this.ability0.text.setAlpha(0);
          this.ability1.text.setAlpha(0);
          this.ability2.text.setAlpha(0);
        }
        else {
          this.abilitiesIndex[this.abilitiesSelected] = 2;
          this.abilitiesSelected++;
          this.ability2.text.setText(this.abilitiesSelected);
          this.ability2.text.setAlpha(1);
        }
        this.abilities[2] = !this.abilities[2];
      }, this);

      //Botón de continuar a la siguiente selección o de empezar juego
      this.ready.on('pointerdown', function (pointer){
        //Sólo funciona si se han seleccionado 3 habilidades
        if (this.abilitiesSelected == 3){
          //Impide que este botón se pinte
          this.abilitiesMenu = false;
          //Actualizar las abilidades del jugador dependiendo de la iteración del menú
          if (this.iter == 0) {
            player1Config[1] = this.abilitiesIndex[0];
            player1Config[2] = this.abilitiesIndex[1];
            player1Config[3] = this.abilitiesIndex[2];
          }
          if (this.iter == 1) {
            player2Config[1] = this.abilitiesIndex[0];
            player2Config[2] = this.abilitiesIndex[1];
            player2Config[3] = this.abilitiesIndex[2];
          }
          //Imprime por pantalla la configuración de cada jugador DEBUG
          //console.log('P1 ' + player1Config);
          //console.log('P2 ' + player2Config);

          this.disableAbilitiesSelectMenu();

          //Si es la segunda iteración, comienza la partida. Si no vuelve al menú de selección de equipo (actualizando iter)
          if (this.iter == 1) {
            this.scene.start('cutscene');
          }
          else {
            this.iter++;
            this.showCharSelectMenu();
          }
        }
      }, this);

      //Llamamos a que se muestre el Main menú, ya que todos están deshabilitados.
      this.showMainMenu();

      //this.time.addEvent({ delay: 10000, callback: function() {this.scene.start('login');}, callbackScope: this});

      //Interfaz por encima de casi todo
      this.bg_estatica = this.add.sprite(gameWidth*11/20,gameHeight/2,'bg_estatica').setAlpha(0.05);
      this.anims.create({
          key: 'bg_estatica_anim',
          frames: this.anims.generateFrameNumbers('bg_estatica'),
          frameRate: 20,
          repeat: -1
      });
      this.bg_estatica.play('bg_estatica_anim');

      this.TVBorder = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, 'bg_frame');
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
    console.log("Salgo de menu");
    console.log(this.iter);
    this.bt_play.disableInteractive();
    this.bt_play.setAlpha(0);
    this.bt_online.disableInteractive();
    this.bt_online.setAlpha(0);
    this.bt_tutorial.disableInteractive();
    this.bt_tutorial.setAlpha(0);
  }

  showCharSelectMenu() {
    console.log("Estoy en equipos");
    console.log(this.iter);
    this.teamSelect.setAlpha(1);
    this.ghostbusterM.setAlpha(1);
    this.ghostbusterM.setInteractive();
    this.ghostbusterW.setAlpha(1);
    this.ghostbusterW.setInteractive();
    this.blueGhost.setAlpha(1);
    this.blueGhost.setInteractive();
    this.redGhost.setAlpha(1);
    this.redGhost.setInteractive();
    if (this.iter == 0){
      this.player1Selecting.setAlpha(1);
      this.returnMenu.setAlpha(1);
      this.returnMenu.setInteractive();
    } else {
      this.player2Selecting.setAlpha(1);
      this.returnAbi.setAlpha(1);
      this.returnAbi.setInteractive();
    }
  }

  disableCharSelectMenu() {
    console.log("Salgo de equipos");
    console.log(this.iter);
    this.teamSelect.setAlpha(0);
    this.ghostbusterM.setAlpha(0);
    this.ghostbusterM.disableInteractive();
    this.ghostbusterW.setAlpha(0);
    this.ghostbusterW.disableInteractive();
    this.blueGhost.setAlpha(0);
    this.blueGhost.disableInteractive();
    this.redGhost.setAlpha(0);
    this.redGhost.disableInteractive();
    this.returnMenu.setAlpha(0);
    this.returnMenu.disableInteractive();
    this.returnAbi.setAlpha(0);
    this.returnAbi.disableInteractive();
    this.player1Selecting.setAlpha(0);
    this.player2Selecting.setAlpha(0);
  }

  showAbilitiesSelectMenu() {
    console.log("Entro en habilidades");
    console.log(this.iter);
    //Reinicia las variables auxiliares
    this.abilitiesSelected = 0;
    this.abilities = [false, false, false];
    this.abilitiesMenu = true;
    //Habilita el menú
    this.abilitySelect.setAlpha(1);
    this.ability0.setAlpha(1);
    this.ability0.setInteractive();
    this.ability1.setAlpha(1);
    this.ability1.setInteractive();
    this.ability2.setAlpha(1);
    this.ability2.setInteractive();
    this.ready.setAlpha(0.4);
    this.ready.setInteractive();
    this.returnChar.setAlpha(1);
    this.returnChar.setInteractive();
  }

  disableAbilitiesSelectMenu() {
    console.log("Salgo de habilidades");
    console.log(this.iter);
    this.abilitiesMenu = false;
    this.abilitySelect.setAlpha(0);
    this.ability0.setAlpha(0);
    this.ability0.text.setAlpha(0);
    this.ability1.setAlpha(0);
    this.ability1.text.setAlpha(0);
    this.ability2.setAlpha(0);
    this.ability2.text.setAlpha(0);
    this.ability0.disableInteractive();
    this.ability1.disableInteractive();
    this.ability2.disableInteractive();
    this.ready.setAlpha(0);
    this.ready.disableInteractive();
    this.returnChar.setAlpha(0);
    this.returnChar.disableInteractive();
  }

  showTutorial() {
    this.img_tutorial.setAlpha(1);
    this.returnMenu.setAlpha(1);
    this.returnMenu.setInteractive();
  }

  disableTutorial(){
    this.img_tutorial.setAlpha(0);
    this.returnMenu.setAlpha(0);
    this.returnMenu.disableInteractive();
  }

  update(){
    //Cuando está seleccionada, una carta se tiñe de rojo
    if (this.abilities[0] == true) this.ability0.setTint(0xCD0000);
    else this.ability0.clearTint();
    if (this.abilities[1] == true) this.ability1.setTint(0xCD0000);
    else this.ability1.clearTint();
    if (this.abilities[2] == true) this.ability2.setTint(0xCD0000);
    else this.ability2.clearTint();
    //Pone el alpha a 1 cuando se han seleccionado 3 cartas y a 0.4 cuando no, siempre que sea el momento de pintarlo (abilitiesMenu == true)
    if (this.abilitiesMenu == true && this.abilitiesSelected == 3) this.ready.setAlpha(1);
    else if (this.abilitiesMenu == true && this.abilitiesSelected != 3) this.ready.setAlpha(0.4);
    else this.ready.setAlpha(0);
  }
}
