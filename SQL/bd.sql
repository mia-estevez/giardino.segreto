CREATE DATABASE floreria;

USE floreria;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    precio DECIMAL(10,2),
    stock INT
);

INSERT INTO productos (nombre, precio, stock)
VALUES
('Ramo de rosas', 15000, 12),
('Tulipanes', 12000, 8),
('Orquídeas', 20000, 5);