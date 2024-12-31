package com.bersan.chatapp.controller;

import com.bersan.chatapp.dto.LoginDto;
import com.bersan.chatapp.dto.RegisterDto;
import com.bersan.chatapp.services.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// kullanıcı doğrulama ve kayıt işlemleriyle ilgili api endpointleri içerir.
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    // @Autowired kullanma!!!
    private UserService userService;
    
    //AuthController sınıfının bağımlılığını kurucu metot aracılığıyla enjekte et.
    public AuthController(UserService userService) {
        this.userService = userService;
    }
    
    // Kullanıcı girişini gerçekleştirir. Giriş bilgilerini alır ve UserService'e ileterek yanıt döner.
    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto, HttpServletResponse response) {
        return userService.login(loginDto, response);

    }

    // Yeni bir kullanıcı kaydını gerçekleştirir. Kayıt bilgilerini alır ve UserService'e ileterek yanıt döner.
    @PostMapping("register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto) {
        return userService.register(registerDto);

    }

}
