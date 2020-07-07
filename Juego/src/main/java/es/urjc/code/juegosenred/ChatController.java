package es.urjc.code.juegosenred;

import java.util.ArrayList;

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
@RequestMapping("/chat")
public class ChatController {

	ArrayList<String> chatLog;

	public ChatController() {
		chatLog = new ArrayList<>();
	}
	/**
	 * Get del chat. Devuelve todo el log
	 */
	@GetMapping
	public ArrayList<String> getLog() {
		ArrayList<String> ret = new ArrayList<>();
		for (int i = 0; i < chatLog.size(); i++) {
			ret.add(chatLog.get(i));
		}
		return ret;
	}

	@PostMapping
	public ResponseEntity<String> addText(@RequestBody String msg) {
		chatLog.add(msg);
		return new ResponseEntity<>(msg, HttpStatus.CREATED);
	}

}
