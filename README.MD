# ChatApp

## Proje Açıklaması
Bu proje kullanıcıların gerçek zamanlı olarak mesajlaşmalarını sağlayan bir web uygulamasıdır. Spring Boot ve React kullanılarak geliştirildi. Backend kısmı Java ve Spring Boot ile, frontend kısmı ise TypeScript ve React ile yazıldı. Gerçek zamanlılık, WebSocket protokolüyle sağlandı.

## Özellikler
- Gerçek zamanlı mesajlaşma
- Kullanıcı kimlik doğrulama, yetkilendirme
- JWT ile güvenli oturum yönetimi
- Responsive tasarım
- Özelleştirilebilir kullanıcı profili
- Kullanıcıların gerçek zamanlı olarak çevrimiçi durumunu görebilme
- Arkadaşlık isteği gönderme ve kabul etme
- Anlık bildirimler(arkadaşlık isteği, yeni mesaj vb.)



## Kullanılan Teknolojiler
- Java
- Spring Boot
- Hibernate
- JUnit
- WebSocket
- PostgreSQL 
- TypeScript 
- React
- Mantine UI
- Express.js
- Vite
- Axios
- Docker



## Docker ile Uygulamayı Ayağa Kaldırmak İçin:

1. Projeyi klonlayın:
    ```sh
    git clone https://github.com/bersankilic/chatapp.git
    cd chatapp
    ```

2. PostgreSQL veritabanını yapılandırın ve `application.properties` dosyasını düzenleyin:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/chatapp
    spring.datasource.username=username
    spring.datasource.password=password
    ```
   
4. docker-compose.yml dosyasındaki environment kısmını düzenleyin:
    ```yml
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/chatapp
      - SPRING_DATASOURCE_USERNAME=username
      - SPRING_DATASOURCE_PASSWORD=password
    ```

3. Docker containerını başlatın:
    ```sh
    docker-compose up --build
    ```

## Kullanım
- Uygulama sunucusu `http://localhost:8080` adresinde çalışacaktır.
- Uygulama istemcisi `http://localhost:3000` adresinde çalışacaktır.



## Proje Yapısı
- `server/`: Spring Boot ile yazılmış backend kodları.
- `client/`: React ve TypeScript ile yazılmış frontend kodları.


