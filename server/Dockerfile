FROM maven:3.8.5-openjdk-17

WORKDIR /app
COPY . .
RUN mvn clean install

EXPOSE 8080

CMD mvn spring-boot:run

