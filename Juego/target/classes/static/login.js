'use strict'

var URLdomain = window.location.host;

var posted = false;
var registeredUsers = [];
var tempUser = {
		name: "",
		pass: ""
}
var user = {
		name: "",
		pass: "",
		id: -1
}

var text = "";

var errorlogin = false;
var errorregister = false;
var errorconnected = false;

var dat;
var us2;

var us;

var backMenu = false;

//variable para simular cambio de escena
var loggedIn = false;

var unableToReachServer = 0;	// Cuenta el nº de veces consecutivas que no consigue contactar con el servidor

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
		this.onlineUsersTimer;
		this.chatAndUsersTimer;
		this.backToMenuTimer;

		this.square1 = this.make.image({
	        x: gameWidth*(5/20),
	        y: gameHeight*(19/40),
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
		this.chatmes = this.add.text(gameWidth*(15/100), gameHeight*(17/80),"",{ font: '16px Courier', fill: '#ffffff' });
		this.conected = this.add.text(gameWidth*(38/50), gameHeight*(15/80),"",{ font: '18px Courier', fill: '#ffffff' });
		this.log = this.add.text(gameWidth*(25/100), gameHeight*(30/80),"",{ font: '32px Courier', fill: '#ff0000' });
		this.reg = this.add.text(gameWidth*(25/100), gameHeight*(30/80),"",{ font: '32px Courier', fill: '#ff0000' });
		this.fall = this.add.text(gameWidth*(25/100), gameHeight*(30/80),"",{ font: '32px Courier', fill: '#ff0000' });
		//Botones chat
		this.bt_up = this.add.image(gameWidth*(60/100),gameHeight*(1/4),'bt_chat').setInteractive().setFlipY(true);
		this.bt_up.scaleX = 0.5;
		this.bt_up.scaleY = 0.5;
		this.bt_up.setAlpha(0);
		this.bt_down = this.add.image(gameWidth*(60/100),gameHeight*(3/4),'bt_chat').setInteractive();
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
			this.changeSceneToMenu();			
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

	// Pide y actualiza el chat y los usuarios conectados
	actualizeChatAndUsers()
	{	
		//console.log("actualizo chat y users");
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

	update()
	{
	  	if(loggedIn == true){	// Cambiar a poder ser por un callback o evento
	  		loggedIn = false;
	  		this.changeToLobby();
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
	  	if(errorconnected)
	  	{
	  		this.log.setText("");
	  		this.reg.setText("Error usuario ya conectado");
	  	}
	  	if(backMenu)
	  	{
	  		backMenu = false;
	  		this.backToMenu();
	  	}
	}

	backToMenu()
	{
		this.log.setText("");
		this.reg.setText("");
		this.fall.setText("El servidor se ha caído");
		this.backToMenuTimer = this.time.addEvent({ delay: 5000, callback: this.changeSceneToMenu, loop: false, callbackScope: this});
	}

	changeSceneToMenu(){
		errorlogin = false;
		errorregister = false;
		errorconnected = false;
		disableLogin();
		disableOnlineMenu();
		this.fall.setText("");
		this.chatmes.setText("");
		this.conected.setText("");
		this.bt_up.setAlpha(0);
		this.bt_down.setAlpha(0);
		this.bt_up_users.setAlpha(0);
		this.bt_down_users.setAlpha(0);
		this.deactivateLobbyMethods();
		this.scene.start('menu');
	}

	// Activa los métodos que deben ser llamados en el lobby a través de timers
	// Avisar de estar online (onlineConfirmationGet)
	// Pedir lista de jugadores conectados (onlineUsersGet)
	activateLobbyMethods()
	{
	  	this.onlineConfirmationTimer = this.time.addEvent({ delay: 1000, callback: onlineConfirmationGet, loop: true});
	  	this.chatAndUsersTimer = this.time.addEvent({ delay: 1000, callback: this.actualizeChatAndUsers, loop: true, callbackScope: this});
	  	//this.onlineUsersTimer = this.time.addEvent({ delay: 1000, callback: onlineUsersGet, loop: true});
	}

	// Desactiva los métodos que no deben ser llamados cuando se salga del lobby
	// Quita los temporizadores (no se si es necesario pero por si acaso)
	deactivateLobbyMethods()
	{
		this.time.removeAllEvents();
	}

	// Realiza los cambios necesarios para cambiar al lobby
	changeToLobby()
	{
		this.reg.setText("");
		this.log.setText("");
	  	errorlogin = false;
		errorregister = false;
		errorconnected = false;
	  	disableLogin();
	  	showOnlineMenu();
	  	this.activateLobbyMethods();	  	
	  	this.bt_up.setAlpha(1);
	  	this.bt_down.setAlpha(1);
	  	this.bt_up_users.setAlpha(1);
	  	this.bt_down_users.setAlpha(1);
	}
}

// --- ACCIONES DE LOS BOTONES ---
$(document).ready(function()
{
	let input1 = $('#name');
	let input2 = $('#pass');
	let input3 = $('#chat');

	// Log In button
	// Almacena los valores de nombre y contraseña y llama a login()
	$("#butLogIn").click(function()
	{
		tempUser.name = input1.val();
		tempUser.pass = input2.val();
		login();
	})

	// Sign Up button
	// Almacena los valores de nombre y contraseña y llama a register()
	$("#butSignUp").click(function()
	{
		//console.log("Pulsado register");
		tempUser.name = input1.val();
		tempUser.pass = input2.val();
		register();
	})

	// Boton enviar chat
	// Envía el texto introducido + su nombre de usuario
	$("#butChat").click(function(){
		text = user.name + ": " + input3.val();
		sendText();
		chat.value = "";
	})
})


// --- PETICIONES AL SERVIDOR ---
// Pide el texto del chat
function getchat()
{
	$.get('http://'+URLdomain+'/chat', function(data){
		dat = data;
	});
}

// Pide los usuarios existentes
function getusers()
{
	$.get('http://'+URLdomain+'/users', function(users){
		us = users[0];
		us2 = users[1];
	});
}

// Envía el mensaje del chat
function sendText()
{
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

// Avisa al servidor que está conectado y pide la lista de los usuarios conectados.
// Si no recibe respuesta después de 5 veces, se desconecta.
function onlineConfirmationGet() {
    $.get('http://'+URLdomain+'/users/'+user.id, function(){
        unableToReachServer = 0;
    }).fail(function () {
		unableToReachServer++;
		if (unableToReachServer > 5)
		{
			backMenu = true;				
		}
    });
}

function onlineUsersGet() {
    $.get('http://'+URLdomain+'/users', function(users){
        //console.log("Lista de conectados:");
        //console.log(users);
    }).fail(function (data) {
        if (data.status == 0)
        {	
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
	}).fail(function (data) {
		//console.log("No existe esa combinación de nombre-contraseña");
		errorlogin = true;
		errorregister = false;
		if (data.status == 0)
		{
			errorregister = false;
			errorlogin = false;
			errorconnected = false;
			backMenu = true;
		} else if (data.status == 404){
			errorlogin = true;
			errorconnected = false;
			errorregister = false;			
			console.log("error 404");
		} else if (data.status == 401){
			errorlogin = false;
			errorconnected = true;
			errorregister = false;
			console.log("error 401");
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
		unableToReachServer = 0;
		user.name = tempUser.name;
		user.pass = tempUser.pass;
		user.id = id;
		loggedIn = true;
		butSignUp.style.display = 'none';
		butLogIn.style.display = 'none';
		nam.style.display = 'none';
		pass.style.display = 'none';
	}).fail(function (data) {
		//console.log("Nombre de usuario ya en uso");
		errorlogin = false;
		errorregister = true;
		if (data.status == 0)
		{
			errorregister = false;
			errorlogin = false;
			errorconnected = false;
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


// --- FUNCIONES DEL HUD ---
// Activa los elementos de HTML para la pantalla de login
function showLogin()
{
	nam.style.display = "inline-block";
	pass.style.display = "inline-block";
	logIn.style.display = "inline-block";
	signUp.style.display = "inline-block";
}

// Oculta los elementos de HTML para la pantalla de login
function disableLogin()
{
	nam.style.display = "none";
	pass.style.display = "none";
	logIn.style.display = "none";
	signUp.style.display = "none";
}

// Activa los elementos de HTML para el lobby online
function showOnlineMenu()
{
	chat.style.display = "inline-block";
	send.style.display = "inline-block";
}

function disableOnlineMenu()
{
	chat.style.display = "none";
	send.style.display = "none";	
}