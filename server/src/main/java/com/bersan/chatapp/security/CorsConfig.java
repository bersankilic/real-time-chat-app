package com.bersan.chatapp.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

// CORS (Cross-Origin Resource Sharing) izinleri
@Configuration
public class CorsConfig {

    // localhost:3000'den gelen isteklere izin verilir
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(Arrays.asList("http://localhost:3000"));

        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        
        corsConfig.setAllowedHeaders(Arrays.asList("*"));

        corsConfig.setMaxAge(3600L); // yapılandırmayı 1 saat boyunca önbellekte tut
        corsConfig.setAllowCredentials(true); // isteklerde kimlik doğrulaması yapılmasına izin ver

        

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsFilter(source);
    }
}
