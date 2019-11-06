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
        this.load.image('interior', 'assets/background/bg_interior.png');
        this.load.image('frame', 'assets/background/bg_frame.png');
        this.load.image('goo', 'assets/props/sp_goo.png');
        this.load.image('jugar', 'assets/jugar.png');
        this.load.image('bt_cazafantasmas', 'assets/botones/cazafantasmas.png');
        this.load.image('bt_fantasmas', 'assets/botones/fantasma.png');
        this.load.image('bt_jugar', 'assets/botones/jugar.png');
        this.load.image('bt_listo', 'assets/botones/listo.png');
        this.load.image('bt_salir', 'assets/botones/salir.png');
        this.load.image('bt_seleccion_personaje', 'assets/botones/selecciona_bando.png');
        this.load.image('bt_seleccion_habilidades', 'assets/botones/selecciona_habilidades.png');
        this.load.image('bt_volver', 'assets/botones/volver.png');
        this.load.image('cd_asustar', 'assets/cartas/asustar.png');
    }

    create()
    {
        //creación de las imágenes
        this.ancho = this.game.canvas.width;
        this.alto = this.game.canvas.height;

        let background = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, 'interior').setOrigin(0.5);
        background.scaleX = 1.07;
        background.scaleY = 1.07;
        let frame = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, 'frame').setOrigin(0.5);
        frame.scaleX = 1.07;
        frame.scaleY = 1.07;
        frame.setDepth(1);

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
        //CAMBIAR POR SPRITE
        this.title = this.add.image(this.ancho*(2/4),this.alto*(20/60),'goo').setScale(0.071);
        this.title.text = this.add.text(this.ancho*(2/4)-20,this.alto*(20/60)-20, 'TE ACUERDAS DE', { font: '32px Courier', fill: '#ffffff' });
        //CAMBIAR POR SPRITE
        this.jugar = this.add.image(this.ancho*(1.1/4),this.alto*(40/60),'bt_jugar').setInteractive();
        this.jugar.scaleX = 0.071;
        this.jugar.scaleY = 0.071;
        //CAMBIAR POR SPRITE
        this.controles = this.add.image(this.ancho*(2.9/4),this.alto*(40/60),'goo').setInteractive();
        this.controles.text = this.add.text(this.ancho*(2.9/4)-20,this.alto*(40/60)-20, 'OPCIONES', { font: '32px Courier', fill: '#ffffff' });
        this.controles.scaleX = 0.071;
        this.controles.scaleY = 0.071;

        //------SELECCIÓN DE PERSONAJE
        //CAMBIAR POR SPRITE
        this.characterSelect = this.add.image(this.ancho*(2/4),this.alto*(20/60),'bt_seleccion_personaje').setScale(0.071);
        this.characterSelect.setAlpha(0);
        //CAMBIAR POR SPRITE
        this.character1 = this.add.image(this.ancho*(1.1/4),this.alto*(40/60),'bt_cazafantasmas').setScale(0.071);
        this.character1.setAlpha(0);
        //CAMBIAR POR SPRITE
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
        this.offset = [45, 60];
        this.abilitySelect = this.add.image(this.ancho*(2/4),this.alto*(20/60),'bt_seleccion_habilidades').setScale(0.071);
        this.ability0 = this.add.image(this.ancho*(1/7), this.alto*(35/60), 'cd_asustar').setScale(0.6).setOrigin(0.5);
        this.ability0.text = this.add.text(this.ancho*(1/7)-this.offset[0], this.alto*(35/60)-this.offset[1], this.abilitiesSelected + 1, { font: '32px Courier', fill: '#ffffff' });
        this.ability1 = this.add.image(this.ancho*(2/7), this.alto*(35/60), 'cd_asustar').setScale(0.6).setOrigin(0.5);
        this.ability1.text = this.add.text(this.ancho*(2/7)-this.offset[0], this.alto*(35/60)-this.offset[1], this.abilitiesSelected + 1, { font: '32px Courier', fill: '#ffffff' });
        this.ability2 = this.add.image(this.ancho*(3/7), this.alto*(35/60), 'cd_asustar').setScale(0.6).setOrigin(0.5);
        this.ability2.text = this.add.text(this.ancho*(3/7)-this.offset[0], this.alto*(35/60)-this.offset[1], this.abilitiesSelected + 1, { font: '32px Courier', fill: '#ffffff' });
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
        this.title.text.setAlpha(1);
        this.jugar.setAlpha(1);
        this.controles.setAlpha(1);
        this.controles.text.setAlpha(1);
        this.jugar.setInteractive();
        this.controles.setInteractive();
        //boton de jugar
        this.jugar.on('pointerup', function (pointer)
        {
            this.disableMainMenu();
            this.showCharSelectMenu(0);
        }, this);

        //boton de controles
        this.controles.on('pointerup', function (pointer)
        {

        }, this);
    }

    disableMainMenu() {
        //Desactivar otros botones
        this.title.setAlpha(0);
        this.title.text.setAlpha(0);
        this.jugar.disableInteractive();
        this.jugar.setAlpha(0);
        this.controles.disableInteractive();
        this.controles.setAlpha(0);
        this.controles.text.setAlpha(0);
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
