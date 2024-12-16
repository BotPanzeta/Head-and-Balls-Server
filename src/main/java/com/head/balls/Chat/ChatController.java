package com.head.balls.Chat;

import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.head.balls.Auth.AuthController;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

  private int lastID = 0;
  private List<ChatMessage> messages = new ArrayList<>();



    /*$$$$$  /$$$$$$$  /$$$$$$
   /$$__  $$| $$__  $$|_  $$_/
  | $$  \ $$| $$  \ $$  | $$  
  | $$$$$$$$| $$$$$$$/  | $$  
  | $$__  $$| $$____/   | $$  
  | $$  | $$| $$        | $$  
  | $$  | $$| $$       /$$$$$$
  |__/  |__/|__/      |_____*/

  @GetMapping()
  public ChatResponse getMessages(@RequestParam(defaultValue="0") int after, HttpSession session) {
    //Example to send the message "bomba":
    //http://localhost:8080/api/chat?after=0

    //Not logged in
    if (!AuthController.isLogged(session)) throw new RuntimeException("Not logged in");

    //Contents for chat response
    int lastID = after;
    List<String> usernames = new ArrayList<>();
    List<String> messages = new ArrayList<>();

    //Add messages sent after lastID
    synchronized(messages) {
      for (ChatMessage message: this.messages) {
        if (message.getID() <= after) continue;
        messages.add(message.getContent());
        usernames.add(message.getUsername());
        lastID = message.getID();
      }
    }
    
    //Return messages
    return new ChatResponse(lastID, usernames, messages);
  }

  @PostMapping
  public void sendMessage(@RequestParam String message, HttpSession session) {
    //Example to send the message "bomba":
    //http://localhost:8080/api/chat?message=bomba

    //Not logged in
    if (!AuthController.isLogged(session)) throw new RuntimeException("Not logged in");

    synchronized (messages) {
      //Increase last id for next message
      lastID++;

      //Save message
      messages.add(new ChatMessage(lastID, AuthController.getUsername(session), message));
      
      //Only keep the last 50 messages
      if (messages.size() > 50) messages.remove(0); 
    }
  }



    /*$$$$$  /$$                                                 
   /$$__  $$| $$                                                 
  | $$  \__/| $$  /$$$$$$   /$$$$$$$ /$$$$$$$  /$$$$$$   /$$$$$$$
  | $$      | $$ |____  $$ /$$_____//$$_____/ /$$__  $$ /$$_____/
  | $$      | $$  /$$$$$$$|  $$$$$$|  $$$$$$ | $$$$$$$$|  $$$$$$ 
  | $$    $$| $$ /$$__  $$ \____  $$\____  $$| $$_____/ \____  $$
  |  $$$$$$/| $$|  $$$$$$$ /$$$$$$$//$$$$$$$/|  $$$$$$$ /$$$$$$$/
   \______/ |__/ \_______/|_______/|_______/  \_______/|______*/ 

  public record ChatMessage(int ID, String username, String content) {
    public int getID() { return ID; }
    public String getUsername() { return username; }
    public String getContent() { return content; }
  }

  public record ChatResponse(int lastID, List<String> usernames, List<String> messages) {
    public int getLastID() { return lastID; }
    public List<String> getUsernames() { return usernames; }
    public List<String> getMessages() { return messages; }
  }
}
