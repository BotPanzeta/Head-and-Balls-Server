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

  private ArrayList<HttpSession> sessions = new ArrayList<>();
  private Map<String, User> users = new HashMap<String, User>();


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
    Object logged = session.getAttribute("logged");
    return logged == null ? false : (boolean) session.getAttribute("logged");
  }

  public static String getUsername(HttpSession session) {
    //Return username, null if not logged in
    return (String) session.getAttribute("username");
  }



   /*$$$$$$                      /$$             /$$
  | $$__  $$                    |__/            | $$
  | $$  \ $$  /$$$$$$   /$$$$$$  /$$  /$$$$$$$ /$$$$$$    /$$$$$$   /$$$$$$ 
  | $$$$$$$/ /$$__  $$ /$$__  $$| $$ /$$_____/|_  $$_/   /$$__  $$ /$$__  $$
  | $$__  $$| $$$$$$$$| $$  \ $$| $$|  $$$$$$   | $$    | $$$$$$$$| $$  \__/
  | $$  \ $$| $$_____/| $$  | $$| $$ \____  $$  | $$ /$$| $$_____/| $$
  | $$  | $$|  $$$$$$$|  $$$$$$$| $$ /$$$$$$$/  |  $$$$/|  $$$$$$$| $$
  |__/  |__/ \_______/ \____  $$|__/|_______/    \___/   \_______/|__/
                       /$$  \ $$
                      |  $$$$$$/
                       \_____*/

  @PostMapping("/register")
  public ResponseEntity<String> register(@Valid @RequestBody User user) {
    //Register user
    try {
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

    } catch (UserNotFoundException | InvalidCredentialsException e) {
      //Handle exception with @ControllerAdvice
      throw e;
    }

    //All good
    return ResponseEntity.ok("User registered successfully");
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
  public ResponseEntity<String> login(@Valid @RequestBody User user, HttpSession session) {
    try {
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
      session.setAttribute("username", user.getUsername());
      session.setAttribute("logged", true);

    } catch (UserNotFoundException | InvalidCredentialsException e) {
      //Handle exception with @ControllerAdvice
      throw e;
    }

    //All good
    return ResponseEntity.ok("Logged in successfully");
  }
  
  
  
   /*$                                                 /$$    
  | $$                                                | $$    
  | $$        /$$$$$$   /$$$$$$   /$$$$$$  /$$   /$$ /$$$$$$  
  | $$       /$$__  $$ /$$__  $$ /$$__  $$| $$  | $$|_  $$_/  
  | $$      | $$  \ $$| $$  \ $$| $$  \ $$| $$  | $$  | $$    
  | $$      | $$  | $$| $$  | $$| $$  | $$| $$  | $$  | $$ /$$
  | $$$$$$$$|  $$$$$$/|  $$$$$$$|  $$$$$$/|  $$$$$$/  |  $$$$/
  |________/ \______/  \____  $$ \______/  \______/    \___/  
                       /$$  \ $$
                      |  $$$$$$/
                       \_____*/
  
  @PostMapping("/logout")
  public ResponseEntity<String> logout(HttpSession session) {
    session.setAttribute("username", null);
    session.setAttribute("logged", false);
    session.invalidate();
    return ResponseEntity.ok("Logged out successfully");
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
  public boolean check(HttpSession session) {
    return AuthController.isLogged(session);
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