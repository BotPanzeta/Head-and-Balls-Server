package com.head.balls.Auth;

import java.io.Serializable;

public class User implements Serializable {
  private String username;
  private String password;

  public User(String username, String password) {
    this.username = username;
    this.password = password;
  }

  //Validation
  public void checkValid() {
    //Invalid username
    if (username == null) 
      throw new InvalidCredentialsException("Username is not valid");

    //Invalid password
    if (password == null) 
      throw new InvalidCredentialsException("Password is not valid");

    //Invalid username size
    if (username.length() < 3 || username.length() > 15)
      throw new InvalidCredentialsException("Username must be between 3 and 15 characters");

    //Invalid password size
    if (password.length() < 3 || password.length() > 15)
      throw new InvalidCredentialsException("Password must be between 3 and 15 characters");
  }

  //Getters & setters
  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }
  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
}
