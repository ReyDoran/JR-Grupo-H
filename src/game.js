'use strict'
var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 675,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x: 0 },
            debug: false
        }
    },
    //Orden de escenas
    scene: [Menu,Controles,Video,Juego]
};

var game = new Phaser.Game(config);

function preload ()
{

}

function create ()
{

}

function update ()
{
    
}
