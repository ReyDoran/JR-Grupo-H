package es.urjc.code.juegosenred;

import java.util.Collection;
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

@RestController
@RequestMapping("/users")
public class UsersController {

	Map<Long, User> users = new ConcurrentHashMap<>(); 
	AtomicLong nextId = new AtomicLong(0);
	
	@GetMapping
	public Collection<User> users() {
		return users.values();
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	/*
	 * Solo permitimos creacion de usuarios con nick diferente
	 */
	public ResponseEntity<User> newUser(@RequestBody User user) {
				
		long id = nextId.incrementAndGet();
		user.setId(id);
		users.put(id, user);
		return new ResponseEntity<>(user, HttpStatus.OK);
	}

	@PutMapping("/{id}")
	public ResponseEntity<User> actulizeUser(@PathVariable long id, @RequestBody User userActualized) {

		User savedUser = users.get(userActualized.getId());

		if (savedUser != null) {

			users.put(id, userActualized);

			return new ResponseEntity<>(userActualized, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<User> getUser(@PathVariable long id) {

		User savedUser = users.get(id);

		if (savedUser != null) {
			return new ResponseEntity<>(savedUser, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

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

}
