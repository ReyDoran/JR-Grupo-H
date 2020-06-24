'use strict'

var URLdomain = window.location.host; //URL

class Login extends Phaser.Scene
{
	//Usuario
	user = {
		name: "name",
		pass: "",
		id: -1
	}

	//Botones 
	userNameElement = document.getElementById('name');
	userPassElement = document.getElementById('pass');
	logInElement = document.getElementById('logInButton');
	signUpElement = document.getElementById('signUpButton');
	sendElement = document.getElementById('chatButton');
	chatElement = document.getElementById('chat');

	//
	loggedIn = false;
	onlineConfirmationTimer;
	onlineUsersTimer;
	
	constructor()
	{
		super({key:"login"});
	}

	hola(){
		console.log("Hola");
	}
	
	preload() {
		//Métodos y variables que requieren parent
		this.logInElement.parent = this;
		this.signUpElement.parent = this;
	}

	create()
	{
		this.userNameElement.style.display = 'inline-block';
		this.userPassElement.style.display = 'inline-block';
		this.logInElement.style.display = 'inline-block';
		this.signUpElement.style.display = 'inline-block';
		this.chatElement.style.display = 'none';
		this.sendElement.style.display = 'none';
		
		//console.log("Name: "+this.user.name+" Pass: "+this.user.pass);

		this.logInElement.addEventListener("pointerdown", function(){
			//console.log("Name: "+this.parent.user.name+" Pass: "+this.parent.user.pass);
			this.parent.user = this.parent.loginFunc(this.parent.user, this.parent); 
		});

		this.signUpElement.addEventListener("pointerdown", function(){ 
			this.parent.user = this.parent.register(this.parent.user, this.parent); 
		});

		//Averiguar qué son los square
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
			disableLogin();
			disableOnlineMenu();
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
			this.deactivateLobbyMethods();
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

	//POR TERMINAR
	update()
	{
		/*if (registerUserBoolean == true)
	  	{
		  	registerUserBoolean = false;
		  	registerUser();
		  	disableLogin();
		  	showOnlineMenu();
	  	}	  	
	  	if(loggedIn == true){	// Cambiar a poder ser por un callback o evento
	  		loggedIn = false;
	  		this.changeToLobby();
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
	  	}*/
	}

	//DA ERROR POR LA INFORMACIÓN QUE SE LE PASA, ESTOY EN ELLO
	loginFunc(user, loginRef)
	{
		console.log("Name: "+user.name+" Pass: "+user.pass);
		$.ajax({
			method: "PUT",
			url:'http://' + URLdomain + '/users',
			data: JSON.stringify(user),
			processData: false,
			headers: { "Content-type":"application/json" }
		}).done(function (id) {
			console.log("Inicio de sesión correcto");
			user.id = id;
			loginRef.disableLogin();
			loginRef.showChatMenu();
			return user;
		}).fail(function(data) {
			console.log("No existe esa combinación de nombre-contraseña");
			//errorlogin = true;
			//errorregister = false;
			if (data.status == 0)
			{
				console.log("data.status == 0");
				/*userNameElement.style.display = 'none';
				userPassElement.style.display = 'none';
				logInElement.style.display = 'none';
				signUpElement.style.display = 'none';
				chatElement.style.display = 'none';
				sendElement.style.display = 'none';
				loadchat = false;
				errorlogin = false;
				errorregister = false;
				backMenu = true;*/
			}
		});
	}

	//LO MISMO QUE EL LOGIN
	register(user, loginRef)
	{
		$.ajax({
				method: "POST",
				url:'http://'+URLdomain+'/users',
				data: JSON.stringify(user),
				processData: false,
				headers: {
				"Content-type":"application/json"
			}
		}).done(function (id) {
			console.log("Usuario creado");
			user.id = id;
			return user;
		}).fail(function (data) {
			console.log("Nombre de usuario ya en uso");
			if (data.status == 0)
			{
				console.log("data.status == 0");
				/*userNameElement.style.display = 'none';
				userPassElement.style.display = 'none';
				logInElement.style.display = 'none';
				signUpElement.style.display = 'none';
				chatElement.style.display = 'none';
				sendElement.style.display = 'none';
				loadchat = false;
				errorlogin = false;
				errorregister = false;
				backMenu = true;*/
			}
		});
	}

	//HASTA AQUI MAS O MENOS LIMPIO TODO 
	//LO DE ABAJO ESTÁ POR VER SU UTILIDAD, SI ESTÁ BIEN PROGRAMADO Y ETC.



	// Activa los métodos que deben ser llamados en el lobby a través de timers
	// Avisar de estar online (onlineConfirmationGet)
	// Pedir lista de jugadores conectados (onlineUsersGet)
	activateLobbyMethods()
	{
	  	this.onlineConfirmationTimer = this.time.addEvent({ delay: 1000, callback: onlineConfirmationGet, loop: true});
	  	this.onlineUsersTimer = this.time.addEvent({ delay: 1000, callback: onlineUsersGet, loop: true});
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
	  	errorlogin = false;
		errorregister = false;
	  	disableLogin();
	  	showOnlineMenu();
	  	this.activateLobbyMethods();
	  	loadchat = true;
	  	this.bt_up.setAlpha(1);
	  	this.bt_down.setAlpha(1);
	  	this.bt_up_users.setAlpha(1);
	  	this.bt_down_users.setAlpha(1);
	}

	// --- ACCIONES DE LOS BOTONES ---
	/*$(document).ready(function()
	{
		let input1 = $('#name');
		let input2 = $('#pass');
		let input3 = $('#chat');

		// Log In button
		// Almacena los valores de nombre y contraseña y llama a login()
		$("#butLogIn").click(function()
		{
			console.log("Pulsado login");
			User.name = input1.val();
			User.pass = input2.val();
			//login();
		})

		// Sign Up button
		// Almacena los valores de nombre y contraseña y llama a register()
		$("#butSignUp").click(function()
		{
			console.log("Pulsado register");
			User.name = input1.val();
			User.pass = input2.val();
			register();
		})

		// Boton enviar chat
		// Envía el texto introducido + su nombre de usuario
		$("#butChat").click(function(){
			text = user.name + ": " + input3.val();
			sendText();
		})
	});*/


	// --- PETICIONES AL SERVIDOR ---
	// Pide el texto del chat
	getchat()
	{
		$.get('http://'+URLdomain+'/chat', function(data){
			dat = data;
		});
	}

	// Pide los usuarios existentes
	getusers()
	{
		$.get('http://'+URLdomain+'/users', function(users){
			us = users[0];
			us2 = users[1];
		});
	}

	// Envía el mensaje del chat
	sendText()
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
	onlineConfirmationGet() {
		$.get('http://'+URLdomain+'/users/'+user.id, function(){
			console.log("Estoy online");
		});
	}

	onlineUsersGet() {
		$.get('http://'+URLdomain+'/users', function(users){
			console.log("Lista de conectados:");
			console.log(users);
		}).fail(function (data) {
			if (data.status == 0)
			{
				disableLogin();
				disableOnlineMenu();
				loadchat = false;
				errorlogin = false;
				errorregister = false;
				backMenu = true;
			}
		})
	};

	

	/*
	* Setea a true registerUser si el nombre de usuario no está en uso
	*/
	

	registerUser()
	{
		$.ajax({
			method: "POST",
			url:'http://'+URLdomain+'/users',
			data: JSON.stringify(User),
			processData: false,
			headers: {
			"Content-type":"application/json"
			},
			success: console.log("Registrado")
		});
	}

	// --- FUNCIONES DEL HUD ---
	// Activa los elementos de HTML para la pantalla de login
	showLogin()
	{
		this.userNameElement.style.display = "inline-block";
		this.userPassElement.style.display = "inline-block";
		this.logInElement.style.display = "inline-block";
		this.signUpElement.style.display = "inline-block";
	}

	// Oculta los elementos de HTML para la pantalla de login
	disableLogin()
	{
		this.userNameElement.style.display = "none";
		this.userPassElement.style.display = "none";
		this.logInElement.style.display = "none";
		this.signUpElement.style.display = "none";
	}

	// Activa los elementos de HTML para el lobby online
	showChatMenu()
	{
		this.chatElement.style.display = "inline-block";
		this.sendElement.style.display = "inline-block";
	}
	
	// Desactiva los elementos de HTML para el lobby online
	disableChatMenu()
	{
		this.chatElement.style.display = "none";
		this.sendElement.style.display = "none";	
	}
}

