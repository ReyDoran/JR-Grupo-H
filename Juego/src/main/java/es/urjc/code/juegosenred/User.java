package es.urjc.code.juegosenred;

public class User {

	private long id;
	private String name;
	private String pass;
	private int score;

	public User() {
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getName() {
		return name;
	}

	public void setPass(String pass) {
		this.pass = pass;
	}
	
	public String getPass() {
		return pass;
	}

	public void setScore(int score) {
		this.score = score;
	}
	
	public int getScore() {
		return score;
	}
	@Override
	public String toString() {
		return "User [id:" + id + ", name:" + name + ", score:" + score + "]";
	}

	/**
	 * M�todo para comprobar si son iguales
	 */
	@Override
	public boolean equals(Object user) {
		if (name.equals(((User)user).getName())) {
			return true;
		}
		else {
			return false;
		}
	}
}
