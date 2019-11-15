'use strict'

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

    preload() {}

    /*
    Crea todos los menús pero desabilita y pone alpha a 0 a todos menos al principal.
    Cada menú se encarga de deshabilitarse y habilitar el siguiente cuando sea el momento.
    */
    create() {
        //Pintamos el fondo
        this.background = this.add.image(this.game.canvas.width/2+7, this.game.canvas.height/2, 'bg_cemetery');
        this.background.scaleX = 0.26;
        this.background.scaleY = 0.26;

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
        this.title = this.add.image(gameWidth/2,gameHeight*15/20,'img_title').setScale(0.3);

        this.bt_play = this.add.image(gameWidth/5,gameHeight/3,'bt_play').setInteractive();
        this.bt_play.scaleX = 0.071;
        this.bt_play.scaleY = 0.071;

        this.bt_tutorial = this.add.image(gameWidth*4/5,gameHeight/3,'bt_tutorial').setInteractive();
        this.bt_tutorial.scaleX = 0.071;
        this.bt_tutorial.scaleY = 0.071;

        //Boton de jugar
        this.bt_play.on('pointerdown', function (pointer)
        {
          this.disableMainMenu();
          this.showCharSelectMenu(0);
        }, this);

        //Boton de tutorial
        this.bt_tutorial.on('pointerdown', function (pointer)
        {
          this.disableMainMenu();
          this.showTutorial();
        }, this);

        this.bt_play.disableInteractive();
        this.bt_tutorial.disableInteractive();

        //TUTORIAL
        this.img_tutorial = this.add.image(gameWidth/2, gameHeight/2, 'img_tutorial');
        this.img_tutorial.scaleX = 1.22;
        this.img_tutorial.scaleY = 1.26;
        this.img_tutorial.setAlpha(0);

        this.volverMenu = this.add.image(gameWidth/2, gameHeight-125, 'bt_return').setScale(0.1);
        this.volverMenu.setAlpha(0);


        //SELECCIÓN DE EQUIPO
        this.teamSelect = this.add.image(gameWidth*(2/4),gameHeight*(20/60),'img_teamSelect').setScale(0.071);
        this.teamSelect.setAlpha(0);

        this.ghostbusters = this.add.image(gameWidth*(1.1/4),gameHeight*(40/60),'bt_ghostbusters').setScale(0.071);
        this.ghostbusters.setAlpha(0);
        this.ghosts = this.add.image(gameWidth*(2.9/4),gameHeight*(40/60),'bt_ghosts').setScale(0.071);
        this.ghosts.setAlpha(0);
        this.ghostbusters.setInteractive();
        this.ghosts.setInteractive();

        /*
        Al pulsarse cada uno de los dos botones, dependiendo de la iteración de la configuración de partida se actualiza:
        El primer parámetro de playerXConfig a 0 o 1 dependiendo de la elección.
        */
        this.ghostbusters.on('pointerdown', function (pointer)
        {
          if (this.iter == 0) player1Config[0] = 0;
          if (this.iter == 0) player2Config[0] = 0;
          this.disableCharSelectMenu();
          this.showAbilitiesSelectMenu();
        }, this);
        this.ghosts.on('pointerdown', function (pointer)
        {
          if (this.iter == 0) player1Config[0] = 1;
          if (this.iter == 1) player2Config[0] = 1;
          this.disableCharSelectMenu();
          this.showAbilitiesSelectMenu();
        }, this);
        this.ghostbusters.disableInteractive();
        this.ghosts.disableInteractive();


        //SELECCION DE HABILIDADES
        /*
        Este menú tiene una característica especial. Tiene un texto encima de cada carta con un número.
        El número representa la ronda en la que será usada.
        Este texto se habilita, deshabilita y actualiza según sea necesario.
        */
        this.offset = 10;

        this.abilitySelect = this.add.image(gameWidth*(2/4),gameHeight*(16/60),'img_abilitiesSelect').setScale(0.071);

        this.ability0 = this.add.image(gameWidth/4, gameHeight*(35/60), 'cd_slow').setScale(1).setOrigin(0.5);
        this.ability0.text = this.add.text(gameWidth/4-this.offset, gameHeight*(35/60), this.abilitiesSelected + 1, { font: '32px Courier', fill: '#ffffff' });
        this.ability1 = this.add.image(gameWidth*2/4, gameHeight*(35/60), 'cd_force').setScale(1).setOrigin(0.5);
        this.ability1.text = this.add.text(gameWidth*2/4-this.offset, gameHeight*(35/60), this.abilitiesSelected + 1, { font: '32px Courier', fill: '#ffffff' });
        this.ability2 = this.add.image(gameWidth*3/4, gameHeight*(35/60), 'cd_reverse').setScale(1).setOrigin(0.5);
        this.ability2.text = this.add.text(gameWidth*3/4-this.offset, gameHeight*(35/60), this.abilitiesSelected + 1, { font: '32px Courier', fill: '#ffffff' });

        this.ready = this.add.image(gameWidth*(7/8), gameHeight*(6/7), 'bt_ready').setScale(0.045);
        this.ready.setAlpha(0);

        this.abilitySelect.setAlpha(0);
        this.ability0.setAlpha(0);
        this.ability0.text.setAlpha(0);
        this.ability1.setAlpha(0);
        this.ability1.text.setAlpha(0);
        this.ability2.setAlpha(0);
        this.ability2.text.setAlpha(0);

        //Para cada carta se ejecuta el siguiente código al pulsarla
        this.ability0.on('pointerdown', function (pointer)
        {
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

        this.ability1.on('pointerdown', function (pointer)
        {
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

        this.ability2.on('pointerdown', function (pointer)
        {
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
        this.ready.on('pointerdown', function (pointer)
        {
          //Sólo funciona si se han seleccionado 3 habilidades
          if (this.abilitiesSelected == 3)
          {
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
              this.showCharSelectMenu();
              this.iter++;
            }
          }
        }, this);

        //Llamamos a que se muestre el Main menú, ya que todos están deshabilitados.
        this.showMainMenu();
    }

    showMainMenu() {
      this.title.setAlpha(1);
      this.bt_play.setAlpha(1);
      this.bt_tutorial.setAlpha(1);
      this.bt_play.setInteractive();
      this.bt_tutorial.setInteractive();
    }

    disableMainMenu() {
      this.title.setAlpha(0);
      this.bt_play.disableInteractive();
      this.bt_play.setAlpha(0);
      this.bt_tutorial.disableInteractive();
      this.bt_tutorial.setAlpha(0);
    }

    showCharSelectMenu() {
      this.teamSelect.setAlpha(1);
      this.teamSelect.setAlpha(1);
      this.ghostbusters.setAlpha(1);
      this.ghosts.setAlpha(1);
      this.ghostbusters.setInteractive();
      this.ghosts.setInteractive();
    }

    disableCharSelectMenu() {
      this.teamSelect.setAlpha(0);
      this.ghostbusters.disableInteractive();
      this.ghostbusters.setAlpha(0);
      this.ghosts.disableInteractive();
      this.ghosts.setAlpha(0);
    }

    showAbilitiesSelectMenu() {
      //Reinicia las variables auxiliares
      this.abilitiesSelected = 0;
      this.abilities = [false, false, false];
      this.abilitiesMenu = true;
      //Habilita el menú
      this.abilitySelect.setAlpha(1);
      this.ability0.setAlpha(1);
      this.ability1.setAlpha(1);
      this.ability2.setAlpha(1);
      this.ready.setAlpha(0.4);
      this.ability0.setInteractive();
      this.ability1.setInteractive();
      this.ability2.setInteractive();
      this.ready.setInteractive();
    }

    disableAbilitiesSelectMenu() {
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
      this.ready.disableInteractive();
    }

    showTutorial() {
      this.img_tutorial.setAlpha(1);
      this.volverMenu.setAlpha(1);
      this.volverMenu.setInteractive();
      this.volverMenu.on('pointerdown', function (pointer)
      {
        this.disableTutorial();
        this.showMainMenu();
      }, this);
    }

    disableTutorial(){
      this.img_tutorial.setAlpha(0);
      this.volverMenu.setAlpha(0);
      this.volverMenu.disableInteractive();
    }

    update()
    {
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
