//Menu principal
'use strict'
class Menu extends Phaser.Scene {
    constructor(){
        super({key:"Menu"});
    }
     
    preload()
    {
        this.load.image('title','Imagenes/titulo.png');
        this.load.image('jugar','Imagenes/start.png');
        this.load.image('controles','Imagenes/Play.png');
    }

    create()
    {
        //creación de las imágenes
        var ancho = this.game.canvas.width;
        var alto = this.game.canvas.height;
        var title = this.add.image(ancho*(1/2),alto*(12/60),'title');
        var jugar = this.add.image(ancho*(1/2),alto*(32/60),'jugar').setInteractive();
        var controles = this.add.image(ancho*(1/2),alto*(45/60),'controles').setInteractive();

        //boton de jugar
        jugar.on('pointerdown', function (pointer) 
        {
            this.scene.start("Juego");
        }, this);

        //boton de controles
        controles.on('pointerdown', function (pointer) 
        {
            this.scene.start("Controles");
        }, this);
    }

    update()
    {

    }
}
