package com.head.balls.Auth;

import org.springframework.context.annotation.Configuration;

import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;
import jakarta.servlet.annotation.WebListener;

@Configuration
@WebListener
public class CustomSessionListener implements HttpSessionListener {

  @Override
  public void sessionCreated(HttpSessionEvent se) {
    //Set session timeout in seconds
    se.getSession().setMaxInactiveInterval(15 * 60);
  }

  @Override
  public void sessionDestroyed(HttpSessionEvent se) {
    
  }
}