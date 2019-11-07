//Menu principal
'use strict'
class Menu extends Phaser.Scene {
    constructor(){
        super({key:"Menu"});
    }

    preload()
    {
        //PLACEHOLDERS
        this.load.image('char1','assets/personajes/play.png');
        this.load.image('char2','assets/personajes/play2.png');
        this.load.image('ability','assets/botones/jugar.png');
        //assets
        this.load.image('cementerio', 'assets/background/bg_cemetery.png');
        this.load.image('frame', 'assets/background/bg_frame.png');
        this.load.image('titulo', 'assets/botones/titulo.png');
        this.load.image('jugar', 'assets/jugar.png');
        this.load.image('tutorial', 'assets/botones/tutorial.png');
        this.load.image('tutorial1', 'assets/background/tutorial1.png');
        this.load.image('tutorial2', 'assets/background/tutorial2.png');
        this.load.image('tutorial3', 'assets/background/tutorial3.png');
        this.load.image('siguienteTuto', 'assets/botones/siguienteTuto.png');
        this.load.image('volverMenu', 'assets/botones/volver.png')
        this.load.image('bt_cazafantasmas', 'assets/botones/cazafantasmas.png');
        this.load.image('bt_fantasmas', 'assets/botones/fantasma.png');
        this.load.image('bt_jugar', 'assets/botones/jugar.png');
        this.load.image('bt_listo', 'assets/botones/listo.png');
        this.load.image('bt_salir', 'assets/botones/salir.png');
        this.load.image('bt_seleccion_personaje', 'assets/botones/selecciona_bando.png');
        this.load.image('bt_seleccion_habilidades', 'assets/botones/selecciona_habilidades.png');
        this.load.image('bt_volver', 'assets/botones/volver.png');
        this.load.image('cd_empujar', 'assets/cartas/empuja.png');
        this.load.image('cd_invertir', 'assets/cartas/invierte.png');
        this.load.image('cd_ralentizar', 'assets/cartas/ralentiza.png');
    }

    create()
    {
        //creación de las imágenes
        this.ancho = this.game.canvas.width;
        this.alto = this.game.canvas.height;

        //Variable auxiliar
        this.turn = player1Config;
        this.play = false;
        this.abilities = [false, false, false];
        this.abilitiesIndex = [0, 0, 0];
        this.abilitiesSelected = 0;
        this.abilitiesMenu = false;
        this.iter = 0;
        this.ayuda = 0;//DEBug

        //-----MENU PRINCIPAL
        this.background = this.add.image(this.game.canvas.width/2+7, this.game.canvas.height/2, 'cementerio');
        this.background.scaleX = 0.26;
        this.background.scaleY = 0.26;

        this.title = this.add.image(this.ancho/2,this.alto*15/20,'titulo').setScale(0.3);

        this.jugar = this.add.image(this.ancho/5,this.alto/3,'bt_jugar').setInteractive();
        this.jugar.scaleX = 0.071;
        this.jugar.scaleY = 0.071;

        this.tutorial = this.add.image(this.ancho*4/5,this.alto/3,'tutorial').setInteractive();
        this.tutorial.scaleX = 0.071;
        this.tutorial.scaleY = 0.071;

        //------TUTORIAL
        this.tutorial1 = this.add.image(this.ancho/2, this.alto/2, 'tutorial1').setScale(1.22);
        this.tutorial1.setAlpha(0);
        this.tutorial2 = this.add.image(this.ancho/2, this.alto/2, 'tutorial2');
        this.tutorial2.setAlpha(0);
        this.tutorial3 = this.add.image(this.ancho/2, this.alto/2, 'tutorial3');
        this.tutorial3.setAlpha(0);
        this.siguienteTuto = this.add.image(0, 0, 'siguienteTuto').setOrigin(0);
        this.siguienteTuto.setAlpha(0);
        this.volverMenu = this.add.image(0, 0, 'volverMenu').setOrigin(0.2);
        this.volverMenu.setAlpha(0);

        //------SELECCIÓN DE PERSONAJE
        this.characterSelect = this.add.image(this.ancho*(2/4),this.alto*(20/60),'bt_seleccion_personaje').setScale(0.071);
        this.characterSelect.setAlpha(0);

        this.character1 = this.add.image(this.ancho*(1.1/4),this.alto*(40/60),'bt_cazafantasmas').setScale(0.071);
        this.character1.setAlpha(0);

        this.character2 = this.add.image(this.ancho*(2.9/4),this.alto*(40/60),'bt_fantasmas').setScale(0.071);
        this.character2.setAlpha(0);
        this.character1.setInteractive();
        this.character2.setInteractive();
        this.character1.on('pointerdown', function (pointer)
        {
          if (this.iter == 0) player1Config[0] = 0;
          if (this.iter == 0) player2Config[0] = 0;
          this.disableCharSelectMenu();
          this.showAbilitiesSelectMenu();
        }, this);
        this.character2.on('pointerdown', function (pointer)
        {
          if (this.iter == 0) player1Config[0] = 1;
          if (this.iter == 1) player2Config[0] = 1;
          this.disableCharSelectMenu();
          this.showAbilitiesSelectMenu();
        }, this);
        this.character1.disableInteractive();
        this.character2.disableInteractive();

        //---------SELECCION DE ABILIDADES
        this.offset = 10;
        this.abilitySelect = this.add.image(this.ancho*(2/4),this.alto*(16/60),'bt_seleccion_habilidades').setScale(0.071);
        this.ability0 = this.add.image(this.ancho/4, this.alto*(35/60), 'cd_ralentizar').setScale(1).setOrigin(0.5);
        this.ability0.text = this.add.text(this.ancho/4-this.offset, this.alto*(35/60), this.abilitiesSelected + 1, { font: '32px Courier', fill: '#ffffff' });
        this.ability1 = this.add.image(this.ancho*2/4, this.alto*(35/60), 'cd_empujar').setScale(1).setOrigin(0.5);
        this.ability1.text = this.add.text(this.ancho*2/4-this.offset, this.alto*(35/60), this.abilitiesSelected + 1, { font: '32px Courier', fill: '#ffffff' });
        this.ability2 = this.add.image(this.ancho*3/4, this.alto*(35/60), 'cd_invertir').setScale(1).setOrigin(0.5);
        this.ability2.text = this.add.text(this.ancho*3/4-this.offset, this.alto*(35/60), this.abilitiesSelected + 1, { font: '32px Courier', fill: '#ffffff' });
        this.ready = this.add.image(this.ancho*(7/8), this.alto*(6/7), 'bt_listo').setScale(0.045);
        this.ready.setAlpha(0);
        this.abilitySelect.setAlpha(0);
        this.ability0.setAlpha(0);
        this.ability0.text.setAlpha(0);
        this.ability1.setAlpha(0);
        this.ability1.text.setAlpha(0);
        this.ability2.setAlpha(0);
        this.ability2.text.setAlpha(0);

        this.ability0.on('pointerdown', function (pointer)
        {
          if (this.abilities[0] == true) {
            this.abilitiesSelected = 0;
            this.abilities[1] = false;
            this.abilities[2] = false;
            this.ability0.text.setAlpha(0);
            this.ability1.text.setAlpha(0);
            this.ability2.text.setAlpha(0);
          }
          else {
            this.abilitiesIndex[this.abilitiesSelected] = 0;
            this.abilitiesSelected++;
            this.ability0.text.setText(this.abilitiesSelected);
            this.ability0.text.setAlpha(1);
          }
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
        this.ready.on('pointerdown', function (pointer)
        {
          if (this.abilitiesSelected == 3)
          {
            this.abilitiesMenu = false;
            //Actualizar las abilidades del jugador
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
            //Empezar partida si es la segunda iteracion
            console.log('P1 ' + player1Config);
            console.log('P2 ' + player2Config);

            this.disableAbilitiesSelectMenu();
            if (this.iter == 1) {
              this.scene.start("Video");
            }
            this.iter++;
            this.showCharSelectMenu();
          }
        }, this);
        this.showMainMenu();
    }


    //Devuelve el n true de un array
    getTrueIndex(ar, n) {
      for (let i = 0; i < ar.length; i++)
      {
        if (ar[i] = true) n--;
        if (n == 0) return i;
      }
      return -1;
    }

    showMainMenu() {
      this.title.setAlpha(1);
      this.jugar.setAlpha(1);
      this.tutorial.setAlpha(1);
      this.jugar.setInteractive();
      this.tutorial.setInteractive();
      //boton de jugar
      this.jugar.on('pointerdown', function (pointer)
      {
        this.disableMainMenu();
        this.showCharSelectMenu(0);
      }, this);

      //boton de tutorial
      this.tutorial.on('pointerdown', function (pointer)
      {
        this.disableMainMenu();
        this.showTutorial();
      }, this);
    }

    disableMainMenu() {
      //Desactivar otros botones
      this.title.setAlpha(0);
      this.jugar.disableInteractive();
      this.jugar.setAlpha(0);
      this.tutorial.disableInteractive();
      this.tutorial.setAlpha(0);
    }

    showCharSelectMenu(iter) {
      //Crear el menu de seleccion de personaje
      this.characterSelect.setAlpha(1);
      this.characterSelect.setAlpha(1);
      this.character1.setAlpha(1);
      this.character2.setAlpha(1);
      this.character1.setInteractive();
      this.character2.setInteractive();
    }

    disableCharSelectMenu() {
      //Desactivar otros botones
      this.characterSelect.setAlpha(0);
      this.character1.disableInteractive();
      this.character1.setAlpha(0);
      this.character2.disableInteractive();
      this.character2.setAlpha(0);
    }

    showAbilitiesSelectMenu() {
      this.abilitiesSelected = 0;
      this.abilities = [false, false, false];
      this.abilitiesMenu = true;
      //Activar el siguiente menú
      this.abilitySelect.setAlpha(1);
      this.ability0.setAlpha(1);
      this.ability1.setAlpha(1);
      this.ability2.setAlpha(1);
      //this.ability0text.setAlpha(1);
      //this.ability1text.setAlpha(1);
      //this.ability2text.setAlpha(1);
      this.ready.setAlpha(0.4);
      this.ability0.setInteractive();
      this.ability1.setInteractive();
      this.ability2.setInteractive();
      this.ready.setInteractive();

      this.ayuda++;
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

    showTutorial(){
      this.contador = 1;
      this.tutorial1.setAlpha(1);
      this.siguienteTuto.setAlpha(1);
      this.siguienteTuto.setInteractive();
      this.siguienteTuto.on('pointerdown', function (pointer)
      {
        if (this.contador==1){
          this.tutorial1.setAlpha(0);
          this.tutorial2.setAlpha(1);
          this.contador++;
        } else if (this.contador==2){
          this.tutorial2.setAlpha(0);
          this.siguienteTuto.setAlpha(0);
          this.siguienteTuto.disableInteractive();
          this.tutorial3.setAlpha(1);
          this.volverMenu.setAlpha(1);
          this.volverMenu.setInteractive();
        }
      });
      this.siguienteTuto.on('pointerdown', function (pointer)
      {

      });
    }

    disableTutorial(){
      this.tutorial1.setAlpha(0);
      this.tutorial2.setAlpha(0);
      this.tutorial3.setAlpha(0);
      this.siguienteTuto.setAlpha(0);
      this.siguienteTuto.disableInteractive();
      this.volverMenu.setAlpha(0);
      this.volverMenu.disableInteractive();
    }

    update()
    {
      if (this.abilities[0] == true) this.ability0.setTint(0xCD0000);
      else this.ability0.clearTint();
      if (this.abilities[1] == true) this.ability1.setTint(0xCD0000);
      else this.ability1.clearTint();
      if (this.abilities[2] == true) this.ability2.setTint(0xCD0000);
      else this.ability2.clearTint();

      if (this.abilitiesMenu == true && this.abilitiesSelected == 3) this.ready.setAlpha(1);
      else if (this.abilitiesMenu == true && this.abilitiesSelected != 3) this.ready.setAlpha(0.4);
      else this.ready.setAlpha(0);
    }
}
