-- chat_app adında bir veritabanı olup olmadığını kontrol eder yoksa oluşturur
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_database 
        WHERE datname = 'chat_app'
    ) THEN
        CREATE DATABASE chat_app;
    END IF;
END $$;

-- veritabanına bağlanır
\c chat_app;

-- roles tablosunu oluşturur bu tablo kullanıcı rolleri için id ve name sütunlarını içerir
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- roles tablosuna ADMIN ve USER rollerini ekler
INSERT INTO roles (name) VALUES ('ADMIN'), ('USER');
