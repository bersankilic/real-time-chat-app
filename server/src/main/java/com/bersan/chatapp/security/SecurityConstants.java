package com.bersan.chatapp.security;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;

// JWT token için gerekli olan sabitlerin tanımlandığı sınıf
public class SecurityConstants {
    public static final Key JWT_SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    public static final long JWT_EXPIRATION = 3 * 60 * 60 * 1000; // 3 saat

}
