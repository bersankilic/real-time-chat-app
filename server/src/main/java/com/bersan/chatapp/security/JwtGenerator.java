package com.bersan.chatapp.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;


// JWT oluşturma ve doğrulama işlemlerinden sorumlu sınıf
@Component
public class JwtGenerator {

    // kullanıcı kimliğini doğruladıktan sonra JWT oluşturur
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + SecurityConstants.JWT_EXPIRATION);

        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expireDate)
                .signWith(SecurityConstants.JWT_SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
        return token;
    }

    // JWT'yi içeren cookie oluşturur
    public Cookie generateCookie(Authentication authentication) {
        String token = generateToken(authentication);

        Cookie cookie = new Cookie("jwt_token", token);
        cookie.setMaxAge((int) SecurityConstants.JWT_EXPIRATION / 1000);
        cookie.setDomain("localhost");
        cookie.setPath("/");

        return cookie;
    }

    // JWT'den kullanıcı adını çıkarır
    public String getUsernameFromJwt(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SecurityConstants.JWT_SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // JWT'nin geçerliliğini kontrol eder
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(SecurityConstants.JWT_SECRET_KEY)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            throw new AuthenticationCredentialsNotFoundException("JWT zamanaşımı");
        }
    }

    // JWT'yi çerezlerden alır
    private String getJWTFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    // JWT'den kullanıcı adını çıkarır
    public String getUserNameFromJWTCookies(HttpServletRequest request) {
        return getUsernameFromJwt(getJWTFromCookies(request));
    }

}
