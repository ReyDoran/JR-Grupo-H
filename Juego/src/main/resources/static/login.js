'use strict'

var URLdomain = window.location.host;

var posted = false;
var registeredUsers = [];
var registerUserBoolean = false;
var tempUser = {
		name: "",
		pass: ""
}
var user = {
		name: "",
		pass: "",
		id: -1
}
var loadchat = false;

var text = "";

var errorlogin = false;
var errorregister = false;

var dat;
var us2;

var us;

var backMenu = false;

//variable para simular cambio de escena
var loggedIn = false;

class Login extends Phaser.Scene
{
	constructor()
	{
		super({key:"login"});
	}
	preload() {}

	create()
	{
		this.onlineConfirmationTimer;

		this.square1 = this.make.image({
	        x: gameWidth*(5/20),
	        y: gameHeight*(17/40),
	        key: 'bg_square',
	        add: false
	    });
		this.square1.scaleX = 2;
		this.square1.scaleY = 0.8;

		this.square2 = this.make.image({
	        x: gameWidth*(15/20),
	        y: gameHeight*(17/40),
	        key: 'bg_square',
	        add: false
	    });
		this.square2.scaleY = 0.8;

		nam.style.display = "inline-block";
		pass.style.display = "inline-block";
		signUp.style.display = "inline-block";
		logIn.style.display = "inline-block";
		this.chatmes = this.add.text(gameWidth*(15/100), gameHeight*(15/80),"",{ font: '16px Courier', fill: '#ffffff' });
		this.conected = this.add.text(gameWidth*(38/50), gameHeight*(15/80),"",{ font: '18px Courier', fill: '#ffffff' });
		this.log = this.add.text(gameWidth*(25/100), gameHeight*(30/80),"",{ font: '32px Courier', fill: '#ff0000' });
		this.reg = this.add.text(gameWidth*(25/100), gameHeight*(30/80),"",{ font: '32px Courier', fill: '#ff0000' });
		this.fall = this.add.text(gameWidth*(25/100), gameHeight*(30/80),"",{ font: '32px Courier', fill: '#ff0000' });
		//Botones chat
		this.bt_up = this.add.image(gameWidth*(55/100),gameHeight*(1/4),'bt_chat').setInteractive().setFlipY(true);
		this.bt_up.scaleX = 0.5;
		this.bt_up.scaleY = 0.5;
		this.bt_up.setAlpha(0);
		this.bt_down = this.add.image(gameWidth*(55/100),gameHeight*(3/4),'bt_chat').setInteractive();
		this.bt_down.scaleX = 0.5;
		this.bt_down.scaleY = 0.5;
		this.bt_down.setAlpha(0);

		//Subir
		this.bt_up.on('pointerdown', function (pointer)
		{
			this.chatmes.y+=10;
		}, this);

		//Bajar
		this.bt_down.on('pointerdown', function (pointer)
		{
			this.chatmes.y-=10;
		}, this);

		//Botones usuarios conectados
		this.bt_up_users = this.add.image(gameWidth*(7/10),gameHeight*(1/4),'bt_chat').setInteractive().setFlipY(true);
			this.bt_up_users.scaleX = 0.5;
		this.bt_up_users.scaleY = 0.5;
		this.bt_up_users.setAlpha(0);
			this.bt_down_users = this.add.image(gameWidth*(7/10),gameHeight*(3/4),'bt_chat').setInteractive();
			this.bt_down_users.scaleX = 0.5;
		this.bt_down_users.scaleY = 0.5;
		this.bt_down_users.setAlpha(0);


		//Subir
		this.bt_up_users.on('pointerdown', function (pointer)
		{
			this.conected.y+=10;
		}, this);

		//Bajar
		this.bt_down_users.on('pointerdown', function (pointer)
		{
			this.conected.y-=10;
		}, this);

		this.back = this.add.image(gameWidth*7/50, gameHeight*9/50, 'bt_return').setAlpha(1).setScale(0.7).setInteractive();

		this.back.on('pointerdown', function (pointer){
			nam.style.display = 'none';
			pass.style.display = 'none';
			logIn.style.display = 'none';
			signUp.style.display = 'none';
			chat.style.display = 'none';
			send.style.display = 'none';
			loadchat = false;
			this.chatmes.setText("");
			this.conected.setText("");
			this.bt_up.setAlpha(0);
			this.bt_down.setAlpha(0);
			this.bt_up_users.setAlpha(0);
			this.bt_down_users.setAlpha(0);
			errorlogin = false;
			errorregister = false;
			backMenu = false;

			this.scene.start('menu');
		}, this);

		this.chatmes.mask = new Phaser.Display.Masks.BitmapMask(this, this.square1);
		this.conected.mask = new Phaser.Display.Masks.BitmapMask(this, this.square2);

		//Interfaz por encima de casi todo
		this.interf = this.add.sprite(gameWidth*11/20,gameHeight/2,'bg_estatica').setAlpha(0.05);
		this.anims.create({
			key: 'bg_estatica_anim',
			frames: this.anims.generateFrameNumbers('bg_estatica'),
			frameRate: 20,
			repeat: -1
		});
		this.interf.play('bg_estatica_anim');

		this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, 'bg_frame');
	}

	update()
	{
		if (registerUserBoolean == true)
	  	{
		  	registerUserBoolean = false;
		  	registerUser();
		  	disableLogin();
		  	showOnlineMenu();
	  	}
	  	if (loggedIn == true)
	  	{
	  		errorlogin = false;
	  		errorregister = false;
		  	loggedIn = false;
		  	this.onlineConfirmationTimer = this.time.addEvent({ delay: 1000, callback: onlineConfirmationGet, loop: true});
		  	disableLogin();
		  	showOnlineMenu();
		  	loadchat = true;
		  	this.bt_up.setAlpha(1);
		  	this.bt_down.setAlpha(1);
		  	this.bt_up_users.setAlpha(1);
		  	this.bt_down_users.setAlpha(1);
	  	}
	  	if(loadchat)
	  	{
	  		let connectedText = "";
	  		let disconnectedText = "";
	  		this.log.setText("");
		  	this.reg.setText("");
		  	getchat();
		  	getusers();
		  	this.chatmes.setText(dat);
		  	if (us != null) {
			  	for (let i = 0; i < us.length; i++) {
			  		connectedText += us[i] + "\n";
			  	}
		  	}
		  	if (us2 != null) {
			  	for (let i = 0; i < us2.length; i++) {
			  		disconnectedText += us2[i] + "\n";
			  	}
		  	}
		  	this.conected.setText("CONECTADOS:\n"+connectedText+"\nDESCONECTADOS:\n"+disconnectedText);
	  	}
	  	else
	  	{
	  		this.chatmes.setText("");
	    	this.conected.setText("");
	    	this.bt_up.setAlpha(0);
	    	this.bt_down.setAlpha(0);
	    	this.bt_up_users.setAlpha(0);
	    	this.bt_down_users.setAlpha(0);
	  	}
	  	if(errorlogin)
	  	{
	  		this.log.setText("Error, usuario o contraseña incorrecta");
		  	this.reg.setText("");
	  	}
	  	if(errorregister)
	  	{
	  		this.log.setText("");
		  	this.reg.setText("Error nombre de usuario ya en uso");
	  	}
	  	if(backMenu)
	  	{
	  		this.fall.setText("El servidor se ha caido");
	  		for(var i=0; i<50000; i++)
	  		{

	  		}
	  		this.fall.setText("");
	  		backMenu = false;
	  		this.scene.start('menu');
	  	}
	}
}

$(document).ready(function()
{
	let input1 = $('#name');
	let input2 = $('#pass');
	let input3 = $('#chat');

	//Log In button
	$("#butLogIn").click(function()
	{
		tempUser.name = input1.val();
		tempUser.pass = input2.val();
		login();
	})

	//Sign Up button
	$("#butSignUp").click(function()
	{
		//console.log("Pulsado register");
		tempUser.name = input1.val();
		tempUser.pass = input2.val();
		register();
	})

	//Boton enviar chat
	$("#butChat").click(function(){
		text = user.name + ": " + input3.val();
		sendText();
	})
})


function getchat()
{
	$.get('http://'+URLdomain+'/chat', function(data){
		dat = data;
	});
}

function getusers()
{
	$.get('http://'+URLdomain+'/users', function(users){
		us = users[0];
		us2 = users[1];
	});
}


function sendText()
{
	//console.log(text);
	$.ajax({
		 method: "POST",
		 url:'http://'+URLdomain+'/chat',
		 data: JSON.stringify(text),
		 processData: false,
		 headers: {
		 "Content-type":"application/json"
	 	 }
	})
}

function disableLogin()
{
	nam.style.display = "none";
	pass.style.display = "none";
	logIn.style.display = "none";
	signUp.style.display = "none";
}

function showOnlineMenu()
{
	chat.style.display = "inline-block";
	send.style.display = "inline-block";
}

function onlineConfirmationGet() {
    $.get('http://'+URLdomain+'/users/'+user.id, function(){
        //console.log("Estoy online");
    });
    $.get('http://'+URLdomain+'/users', function(users){
        //console.log("Lista de conectados:");
        //console.log(users);
    }).fail(function (data) {
        if (data.status == 0)
        {
			nam.style.display = 'none';
			pass.style.display = 'none';
			logIn.style.display = 'none';
			signUp.style.display = 'none';
			chat.style.display = 'none';
			send.style.display = 'none';
			loadchat = false;
			errorlogin = false;
			errorregister = false;
			backMenu = true;
        }
    })
}

function login()
{
	$.ajax({
		 method: "PUT",
		 url:'http://'+URLdomain+'/users',
		 data: JSON.stringify(tempUser),
		 processData: false,
		 headers: { "Content-type":"application/json" }
	}).done(function (id) {
			//console.log("Inicio de sesión correcto");
		user.name = tempUser.name;
		user.pass = tempUser.pass;
		user.id = id;
		loggedIn = true;
		butSignUp.style.display = 'none';
		butLogIn.style.display = 'none';
		nam.style.display = 'none';
		pass.style.display = 'none';
	}).fail(function () {
		//console.log("No existe esa combinación de nombre-contraseña");
		errorlogin = true;
		errorregister = false;
		if (data.status == 0)
		{
			nam.style.display = 'none';
			pass.style.display = 'none';
			logIn.style.display = 'none';
			signUp.style.display = 'none';
			chat.style.display = 'none';
			send.style.display = 'none';
			loadchat = false;
			errorlogin = false;
			errorregister = false;

			backMenu = true;
		}
	});
}

/*
 * Setea a true registerUser si el nombre de usuario no está en uso
 */
function register()
{
	$.ajax({
		 method: "POST",
		 url:'http://'+URLdomain+'/users',
		 data: JSON.stringify(tempUser),
		 processData: false,
		 headers: {
		 "Content-type":"application/json"
	 	 }
	}).done(function (id) {
		//console.log("Usuario creado");
		user.name = tempUser.name;
		user.pass = tempUser.pass;
		user.id = id;
	}).fail(function () {
		//console.log("Nombre de usuario ya en uso");
		errorlogin = false;
		errorregister = true;
		if (data.status == 0)
		{
			nam.style.display = 'none';
			pass.style.display = 'none';
			logIn.style.display = 'none';
			signUp.style.display = 'none';
			chat.style.display = 'none';
			send.style.display = 'none';
			loadchat = false;
			errorlogin = false;
			errorregister = false;

			backMenu = true;
		}
	});
}

function registerUser()
{
	$.ajax({
		method: "POST",
		url:'http://'+URLdomain+'/users',
		data: JSON.stringify(tempUser),
		processData: false,
		headers: {
		"Content-type":"application/json"
		},
		success: console.log("Registrado")
 	});
}
