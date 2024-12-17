package com.head.balls.Auth;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  //private static Map<String, String> connected = new HashMap<String, String>();
  private static Map<String, User> users = new HashMap<String, User>();


  public AuthController() {
    //Load users
    loadUsers();
  }


  
   /*$   /$$   /$$     /$$ /$$
  | $$  | $$  | $$    |__/| $$
  | $$  | $$ /$$$$$$   /$$| $$
  | $$  | $$|_  $$_/  | $$| $$
  | $$  | $$  | $$    | $$| $$
  | $$  | $$  | $$ /$$| $$| $$
  |  $$$$$$/  |  $$$$/| $$| $$
   \______/    \___/  |__/|_*/

  public static String encode(String input) {
    try {
      //Create instance for hashing using SHA256
      MessageDigest hasher = MessageDigest.getInstance("SHA-256");
  
      //digest() method called to calculate message digest of an input and return array of byte
      byte[] hash = hasher.digest(input.getBytes(StandardCharsets.UTF_8));
  
      //Convert byte array of hash into digest
      BigInteger number = new BigInteger(1, hash);
  
      //Convert the digest into hex value
      StringBuilder hexString = new StringBuilder(number.toString(16));
  
      //Pad with leading zeros
      while (hexString.length() < 32) hexString.insert(0, '0');
  
      //Return encrypted string
      return hexString.toString();
    } catch (NoSuchAlgorithmException e) {
      //Error
      return input;
    }
  }

  public static boolean isLogged(HttpSession session) {
    return users.containsKey(session.getAttribute("username"));
  }

  public static String getUsername(HttpSession session) {
    //Return username, null if not logged in
    return (String) session.getAttribute("username");
  }



    /*$$$$$  /$$                           /$$      
   /$$__  $$| $$                          | $$      
  | $$  \__/| $$$$$$$   /$$$$$$   /$$$$$$$| $$   /$$
  | $$      | $$__  $$ /$$__  $$ /$$_____/| $$  /$$/
  | $$      | $$  \ $$| $$$$$$$$| $$      | $$$$$$/ 
  | $$    $$| $$  | $$| $$_____/| $$      | $$_  $$ 
  |  $$$$$$/| $$  | $$|  $$$$$$$|  $$$$$$$| $$ \  $$
   \______/ |__/  |__/ \_______/ \_______/|__/  \_*/
  
  @GetMapping("/check")
  public User check(HttpSession session) {
    //Not logged in
    if (!AuthController.isLogged(session)) throw new RuntimeException("Not logged in");

    //Get username
    String username = getUsername(session);

    //Check if user exists
    if (!users.containsKey(username)) throw new UserNotFoundException("User does not exists");

    //Get user
    return users.get(username);
  }



    /*$$$$$                                  /$$     /$$                    
   /$$__  $$                                | $$    |__/                    
  | $$  \__/  /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$   /$$  /$$$$$$  /$$$$$$$ 
  | $$       /$$__  $$ /$$__  $$ |____  $$|_  $$_/  | $$ /$$__  $$| $$__  $$
  | $$      | $$  \__/| $$$$$$$$  /$$$$$$$  | $$    | $$| $$  \ $$| $$  \ $$
  | $$    $$| $$      | $$_____/ /$$__  $$  | $$ /$$| $$| $$  | $$| $$  | $$
  |  $$$$$$/| $$      |  $$$$$$$|  $$$$$$$  |  $$$$/| $$|  $$$$$$/| $$  | $$
   \______/ |__/       \_______/ \_______/   \___/  |__/ \______/ |__/  |_*/

  @PostMapping("/register")
  public ResponseEntity<String> register(HttpSession session, @Valid @RequestBody User user) {
    //Check if user is valid
    user.checkValid();

    //Check if exists
    if (users.containsKey(user.getUsername()))
      throw new InvalidCredentialsException("User already exists");

    //Get encoded password
    String encodedPassword = encode(user.getPassword());
    if (encodedPassword == user.getPassword())
      throw new RuntimeException("Error while encoding password");
    
    //Save encoded password
    user.setPassword(encodedPassword);

    //Save user
    users.put(user.getUsername(), user);
    saveUsers();

    //Login (save session)
    saveSession(session, user);

    //All good
    return ResponseEntity.ok("User registered successfully");
  }

  @DeleteMapping("/delete")
  public ResponseEntity<String> delete(HttpSession session) {
    //Not logged in
    if (!AuthController.isLogged(session)) throw new RuntimeException("Not logged in");

    //Get username
    String username = getUsername(session);

    //Check if exists
    if (!users.containsKey(username))
      throw new InvalidCredentialsException("User does not exists");

    //Get user
    User user = users.get(username);

    //Delete user
    users.remove(user.getUsername());
    saveUsers();

    //Logout
    logout(session);

    //All good
    return ResponseEntity.ok("User deleted successfully");
  }



   /*$                           /$$
  | $$                          |__/
  | $$        /$$$$$$   /$$$$$$  /$$ /$$$$$$$ 
  | $$       /$$__  $$ /$$__  $$| $$| $$__  $$
  | $$      | $$  \ $$| $$  \ $$| $$| $$  \ $$
  | $$      | $$  | $$| $$  | $$| $$| $$  | $$
  | $$$$$$$$|  $$$$$$/|  $$$$$$$| $$| $$  | $$
  |________/ \______/  \____  $$|__/|__/  |__/
                       /$$  \ $$
                      |  $$$$$$/
                       \_____*/

  @PostMapping("/login")
  public ResponseEntity<String> login(HttpSession session, @Valid @RequestBody User user) {
    //Check if user is valid
    user.checkValid();

    //Check if exists
    if (!users.containsKey(user.getUsername()))
      throw new UserNotFoundException("User does not exist");

    //Get encoded password
    String encodedPassword = encode(user.getPassword());
    if (encodedPassword == user.getPassword())
      throw new RuntimeException("Error while encoding password");

    //Invalid user
    if (!encodedPassword.equals(users.get(user.getUsername()).getPassword())) 
      throw new InvalidCredentialsException("Invalid user credentials");

    //Save session
    saveSession(session, user);

    //All good
    return ResponseEntity.ok("Logged in successfully");
  }
  
  private void saveSession(HttpSession session, User user) {
    //Save username in session
    session.setAttribute("username", user.getUsername());

    //Save session in connected list
    //connected.put(session.getId(), user.getUsername());
  }
  
  @PostMapping("/logout")
  public ResponseEntity<String> logout(HttpSession session) {
    //Invalidate session
    session.setAttribute("username", null);
    session.invalidate();

    //Remove session from connected list
    //if (connected.containsKey(session.getId())) connected.remove(session.getId());

    //All good
    return ResponseEntity.ok("Logged out successfully");
  }



    /*$$$$$   /$$                                                     
   /$$__  $$ | $$                                                     
  | $$  \__//$$$$$$    /$$$$$$   /$$$$$$  /$$$$$$   /$$$$$$   /$$$$$$ 
  |  $$$$$$|_  $$_/   /$$__  $$ /$$__  $$|____  $$ /$$__  $$ /$$__  $$
   \____  $$ | $$    | $$  \ $$| $$  \__/ /$$$$$$$| $$  \ $$| $$$$$$$$
   /$$  \ $$ | $$ /$$| $$  | $$| $$      /$$__  $$| $$  | $$| $$_____/
  |  $$$$$$/ |  $$$$/|  $$$$$$/| $$     |  $$$$$$$|  $$$$$$$|  $$$$$$$
   \______/   \___/   \______/ |__/      \_______/ \____  $$ \_______/
                                                   /$$  \ $$
                                                  |  $$$$$$/
                                                   \_____*/

  @SuppressWarnings("unchecked")
  private void loadUsers() {
    //Log
    System.out.println("Loading users file...");

    //Try to load users
    try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("users.sav"))) {
      users = (HashMap<String, User>) ois.readObject();
    } catch (IOException | ClassNotFoundException e) {
      System.err.println("Error loading users file: " + e.getMessage());
    }
  }

  private void saveUsers() {
    //Log
    System.out.println("Saving users file...");

    //Try to save users
    try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("users.sav"))) {
      oos.writeObject(users);
    } catch (IOException e) {
      System.err.println("Error saving users file: " + e.getMessage());
    }
  }
}