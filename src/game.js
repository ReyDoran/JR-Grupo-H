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
    scene: [Menu,Tutorial,Video,Juego]
};

var game = new Phaser.Game(config);

//Array para almacenar la puntuación de los jugadores
var points = [0, 0];
var count = 0;
//Guarda 1) el sprite y 2)3)4) las habilidades
var player1Config = [0, 0, 0, 0];
var player2Config = [0, 0, 0, 0];
var round = 0;

function preload ()
{

}

function create ()
{

}

function update ()
{

}
