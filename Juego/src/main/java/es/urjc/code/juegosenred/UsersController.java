package es.urjc.code.juegosenred;

import java.util.ArrayList;

import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;

@RestController
@RequestMapping("/users")
public class UsersController {

	Map<Long, User> users = new ConcurrentHashMap<>(); 
	AtomicLong nextId;
	String fileName = "users.txt";
	
	//En el constructor se leen los usuarios del archivo "users.txt".
	public UsersController() {
		nextId = new AtomicLong(0);	//Inicializa nextId en caso de que no se lea nada
		try {
            FileReader fileReader = new FileReader(fileName);
            BufferedReader bufferedReader = new BufferedReader(fileReader);
            int count = 0;	//Lleva la cuenta de si lee nombre, contraseña o id
            String line;	//Guarda el contenido de la línea
            String name = "";
            String pass = "";
            long id = 0;
            line = bufferedReader.readLine();
            while(line != null) {	//Lee mientras haya líneas. Con count sabemos si lee nombre, contrasñea o id.
                if (count == 0) {
                	name = line;
                }
                else if (count == 1) {
                	pass = line;
                }
                else if (count == 2) {	//En caso de que se haya leído un usuario lo añade al mapa
                	id = Long.parseLong(line);
                	count = -1;	//Reinicia el contador para leer de nuevo el nombre
                	User readUser = new User();	//Creamos un nuevo usuario
                	readUser.setName(name);
                	readUser.setPass(pass);
                	readUser.setId(id);
                    users.put(id, readUser);	//Añadimos el nuevo usuario
                }
                count++;	//Actualizamos count
                line = bufferedReader.readLine();	//Leemos nueva línea
            }   
            bufferedReader.close();	//Cerramos archivo
            nextId = new AtomicLong(id);	//Instanciamos de nuevo para el nuevo id base.
        }
        catch(FileNotFoundException ex) {
            System.out.println("File not found");                
        }
        catch(IOException ex) {
            System.out.println("Error reading");
        }
	}
	
	/**
	 * Get para debug. Devuelve la lista de usuarios.
	 */
	@GetMapping("/debug")
	public Collection<User> debugGET() {
		return users.values();
	}
	
	/**
	 * Devuelve una lista de los nombres de usuarios conectados
	 * Para comprobar si un usuario está conectado, se comprueba cuántos
	 * segundos han pasado desde su última petición GET.
	 * @return
	 */
	@GetMapping
	public ResponseEntity<ArrayList<String>> usersOnline() {
		int disconnectTime = 3000;	//Milisegundos que debe de haber de inactividad para desconectar
		//Variables para iterar
		Collection<User> usersCollection = users.values();
		Iterator<User> iter = usersCollection.iterator();
		User user;
		//Fin variables para iterar
		ArrayList<String> usersOnline = new ArrayList<>();	//Lista a devolver
		Date actualTime = new Date();	//Momento actual
		//Itera por todos los usuarios
		for(int i = 0; i < usersCollection.size(); i++) {
			user = iter.next();
			if (user.getLastOnline() != null) {
				//Si han pasado menos de 3000 milisegundos de diferencia añadir
				if (actualTime.getTime() - user.getLastOnline().getTime() < 3000) {
					usersOnline.add(user.getName());
				}
			}
		}
		return new ResponseEntity<ArrayList<String>>(usersOnline, HttpStatus.OK);
	}

	/**
	 * Actualiza la fecha de última conexión del usuario al que se le hace el get
	 * @param id	Id que identifica al usuario en el mapa
	 * @return
	 */
	@GetMapping("/{id}")
	public ResponseEntity<String> getUser(@PathVariable long id) {
		User user = users.get(id);	//Obtiene el usuario del mapa
		if (user != null) {	//Comprueba que existe
			user.setLastOnline(new Date());	//Actualiza la fecha al momento actual
			//Devuelve código OK y el nombre del usuario (para debug)
			return new ResponseEntity<>(user.getName(), HttpStatus.OK);
		} else {
			//Si no existe devuelve error
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	/**
	 * Añade un nuevo usuario al mapa siempre y cuando no exista uno ya con ese nombre.
	 * Devuelve CREATED si se ha creado, error si no.
	 * @param user
	 * @return
	 */
	@PostMapping
	public ResponseEntity<Long> newUser(@RequestBody User user) {
		boolean exists = false;	//Comprueba si el nombre ya está registrado
		//Variables para iterar
		Collection<User> usersCollection = users.values();
		Iterator<User> iter = usersCollection.iterator();
		User userAux;
		User newUser = new User();
		//Fin variables para iterar
		//Itera por todos los usuarios hasta que termine o encuentre un nombre igual
		int i = 0;
		while (i < usersCollection.size() && exists == false) {
			userAux = iter.next();
			if (userAux.getName().contentEquals(user.getName())) {	//Si ya existe ese nombre actualiza exists
				exists = true;
			}
			i++;
		}
		
		if (exists == false) {	//Si el nombre no está en uso
			//Registarmos el usuario y le devolvemos su id
			long id = nextId.incrementAndGet();
			newUser.setId(id);
			newUser.setName(user.getName());
			newUser.setPass(user.getPass());
			users.put(id, newUser);
			
			//También actualizamos el txt
	        try {
	            FileWriter fileWriter = new FileWriter(fileName, true);	//True para append
	            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
	            //Escribimos en 3 líneas el nombre, contraseña e id.
	            bufferedWriter.write(newUser.getName());
	            bufferedWriter.newLine();
	            bufferedWriter.write(newUser.getPass());
	            bufferedWriter.newLine();
	            bufferedWriter.write(String.valueOf(newUser.getId()));
	            bufferedWriter.newLine();
	            bufferedWriter.close();	//Cerramos el archivo
	        }
	        catch(IOException ex) {
	            System.out.println("Error writing");
	        }
			return new ResponseEntity<>(id, HttpStatus.CREATED);
		}
		else {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

	/**
	 * Comprueba si el par usuario contraseña existen en el servidor.
	 * Devuelve OK y el id del usuario si es correcto.
	 * Devuelve NOT_FOUND si no es correcto.
	 * @param id
	 * @param userActualized
	 * @return
	 */
	@PutMapping
	public ResponseEntity<Long> login(@RequestBody User user) {
		boolean match = false;	//Comprueba si el login es correcto
		long id = -1;	//Guarda el id del usuario al que se le ha hecho login
		//Variables para iterar
		Collection<User> usersCollection = users.values();
		Iterator<User> iter = usersCollection.iterator();
		User userAux;
		//Fin variables para iterar
		//Itera por todos los usuarios hasta que termine o encuentre un nombre y contraseñas igual
		int i = 0;
		while (i < usersCollection.size() && match == false) {
			userAux = iter.next();
			//Si hace coincide nombre y contraseña actualiza la variable match
			if (userAux.getName().contentEquals(user.getName()) && userAux.getPass().contentEquals(user.getPass())) {
				match = true;
				id = userAux.getId();
			}
			i++;
		}
		
		//Si ha hecho match
		if (match == true) {
			return new ResponseEntity<Long>(id, HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	/*
	//No lo contemplamos
	@DeleteMapping("/{id}")
	public ResponseEntity<User> deleteUser(@PathVariable long id) {

		User savedUser = users.get(id);

		if (savedUser != null) {
			users.remove(savedUser.getId());
			return new ResponseEntity<>(savedUser, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	*/
}
