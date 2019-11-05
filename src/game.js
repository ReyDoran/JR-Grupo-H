'use strict'
var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'matter',
        matter: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    //Orden de escenas
    scene: [Menu,Juego,Controles,Cinematica]
};

var game = new Phaser.Game(config);

//Array para almacenar la puntuación de los jugadores
var points = [0, 0];
var count = 0;

function preload ()
{

}

function create ()
{

}

function update ()
{

}
