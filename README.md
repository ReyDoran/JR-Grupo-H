# ----------------------------- Fase 1 -----------------------------
![Documento de diseño de juego](https://github.com/ReyDoran/JR-Grupo-H/blob/master/Documento%20de%20dise%C3%B1o%20GDD.docx)
## ¿Te acuerdas de...?
Es un juego de agudeza visual y memoria al estilo mario party en 2 dimensiones, vista cenital y con temática de cazafantasmas.  

El juego consta de tres partes:
 - Elección de personajes y habilidades.
 - Visionado del video.
 - Competición y elección de respuesta.

El juego está pensado para jugar en grupo y para toda la familia, ya que pese a la mecánica simple y la apariencia infantil, tiene una cierta dificultad para los mayores.

### Temática

Se basa en cazafantasmas, con estilo visual cartoon. El escenario será el patio de una casa encantada, con tumbas y cipreses. 
  
![](https://cdn.wallpapersafari.com/9/44/to1XbJ.jpg)
![](https://art.ngfiles.com/images/654000/654628_frybrix_dark-graveyard.jpg?f1540491044)
  
### Mecánicas 

Las posibilidades comienzan en la selección de personaje, ya que hay 4 personajes diferentes y 3 habilidades. Tras ver el video del inicio, se econtrarán los jugadores en el escenario con movimiento libre. Han de posicionarse en la plataforma de la respuesta que crean correcta. A su vez, los jugadores podrán empujarse y usar las habilidades para alejar o imposibilitar que entren a la zona de la respuesta. Cada pregunta acertada concede puntos y cuando acaben ganará el que más tenga.

![](https://i.ytimg.com/vi/E1wNFj1l7kk/maxresdefault.jpg)  

### Flujo 

Al iniciar el juego podramos elegir entre jugar online y local. Tras esto, cogeremos personaje y orden de habilidades. Al acabar la selección, pasaremos a ver el video e intentar recordar todo lo posible. Una vez acabado, podremos movernos a la casilla que creamos correcta y combatir con el otro jugador por la plaza. En el lobby online podremos utilizar el chat para hablar con otros jugadores conectados.
  
![](ENLACE DE LA IMAGEN 1)  

Las escenas son las siguientes:

![](https://i.imgur.com/Mz7RBgp.png)

Pantalla de t�tulo.

![](https://i.imgur.com/a9vqgm9.png)

Menu principal en el que se puede escoger entre jugar local, jugar online o leer el manual.

![](https://i.imgur.com/byDtPdc.png)

En el manual se puede ver el funcionamiento y las mecanicas del juego. 

![](https://i.imgur.com/QBTqkMe.png)

Si escogemos jugar deberemos primero elegir personaje.

![](https://i.imgur.com/0Tv4DHE.png)

Tambien deberemos elegir las habilidades que tendra este.

![](https://i.imgur.com/bb3vPbb.png)

Despues de lo anterior aparecera el video en el cual deberemos memorizar bien los personajes que pasan porque nos harán una pregunta.

![](https://i.imgur.com/zoeGQvD.png)

Por ultimo tendremos que mover a nuestro personaje a la respuesta que se no habrá formulado intentando a su vez que el otro jugador no lo consiga.

### REST

Diagrama de clases:

![](ENLACE DE LA IMAGEN 2)

M�todos REST:
- GET (/users): devuelve la lista de los usuarios conectados y de los usuarios desconectados.
- GET (/users/{id}): actualiza la hora de �ltima conexi�n del usuario identificado con el valor id.
- POST (/users): registra a un nuevo usuario con las credenciales recibidas siempre que el nombre no est� ya en uso. En este caso devuelve error.
- LOGIN (/users): inicia sesi�n con un usuario si las credenciales son las correctas y si no est� ya conectado, en otro caso devuelve error.
- GET (/chat): devuelve los mensajes del chat.
- POST (/chat): a�ade un nuevo mensaje al chat.


### Instrucciones ejecuci�n

Para iniciar el servidor ejecutar el archivo tad.jar mediante el comando de cmd "java -jar tad.jar" siendo tad.jar la ubicaci�n del archivo. Para ejecutarlo como cliente introducir en el navegador "localhost:8080/"


### Equipo

Jesús de Pando Galán - jesusdessbb@gmail.com - j.depando.2016@alumnos.urjc.es - Pandouman   
Tomás Pérez Martínez - tomas22tomas@gmail.com - t.perez.2016@alumnos.urjc.es - Tovilu  
Manuel Pérez Ramil - manetoscopio@gmail.com - m.perezra.2016@alumnos.urjc.es - ReyDoran  
Alberto García García - phonos26@gmail.com - a.garciagar.2016@alumnos.urjc.es - Alpuerro  
