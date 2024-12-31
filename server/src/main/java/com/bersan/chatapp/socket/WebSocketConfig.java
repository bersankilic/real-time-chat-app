package com.bersan.chatapp.socket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocketConfig sınıfı WebSocket mesajlaşma altyapısını yapılandırır.
 * WebSocket üzerinden mesajlaşma sağlayan STOMP protokolü için yapılandırmalar yapılır.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    /*
    
    
    Mesaj brokera gelen mesajların yönlendirilmesi için gerekli ayarları yapar.
    /topic /user ve /queue ön ekleriyle gelen mesajlar ilgili abonelere yönlendirilir.
    
    */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/user", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }
    
    
    
    /*
       WebSocket için STOMP protokolü ile bağlanacak endpointleri kaydeder.
       WebSocket üzerinden bağlanılacak uç nokta /ws olarak belirlendi.
    */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS();
    }

}
