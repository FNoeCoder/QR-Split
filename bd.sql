-- Creación de la tabla Restaurante
CREATE TABLE IF NOT EXISTS Restaurante (
  Nombre VARCHAR(100) NOT NULL PRIMARY KEY
);

-- Verifica si el índice ya existe antes de intentar crearlo
CREATE INDEX IF NOT EXISTS idx_nombre_restaurante ON Restaurante (Nombre);


-- Creación de la segunda tabla que hace referencia a Restaurante
CREATE TABLE IF NOT EXISTS Menu (
  Nombre VARCHAR(100) NOT NULL PRIMARY KEY,
  Precio INTEGER NOT NULL,
  Restaurante_Nombre VARCHAR(100) NOT NULL,
  FOREIGN KEY (Restaurante_Nombre) REFERENCES Restaurante (Nombre)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

-- Creación de un índice para la columna Restaurante_Nombre en la tabla Menu (opcional)
CREATE INDEX IF NOT EXISTS fk_Restaurante_Nombre ON Menu (Restaurante_Nombre);

-- Insertar datos en la tabla Restaurante
INSERT INTO Restaurante (Nombre) VALUES ('McDonalds');
INSERT INTO Restaurante (Nombre) VALUES ('Burger King');
INSERT INTO Restaurante (Nombre) VALUES ('KFC');
INSERT INTO Restaurante (Nombre) VALUES ('Pizza Hut');
INSERT INTO Restaurante (Nombre) VALUES ('Taco Bell');

-- Insertar datos en la tabla Menu
INSERT INTO Menu (Nombre, Precio, Restaurante_Nombre) VALUES ('Big Mac', 599, 'McDonalds');
INSERT INTO Menu (Nombre, Precio, Restaurante_Nombre) VALUES ('Whopper', 699, 'Burger King');
INSERT INTO Menu (Nombre, Precio, Restaurante_Nombre) VALUES ('Original Recipe Chicken', 799, 'KFC');
INSERT INTO Menu (Nombre, Precio, Restaurante_Nombre) VALUES ('Pepperoni Pizza', 899, 'Pizza Hut');
INSERT INTO Menu (Nombre, Precio, Restaurante_Nombre) VALUES ('Crunchwrap Supreme', 499, 'Taco Bell');
INSERT INTO Menu (Nombre, Precio, Restaurante_Nombre) VALUES ('Quarter Pounder', 699, 'McDonalds');
INSERT INTO Menu (Nombre, Precio, Restaurante_Nombre) VALUES ('Double Whopper', 899, 'Burger King');
INSERT INTO Menu (Nombre, Precio, Restaurante_Nombre) VALUES ('Extra Crispy Chicken', 999, 'KFC');


-- Consulta para obtener todos los menús y sus precios junto con el nombre del restaurante:
SELECT m.Nombre AS Nombre_Plato, m.Precio, r.Nombre AS Nombre_Restaurante
FROM Menu m INNER JOIN Restaurante r ON m.Restaurante_Nombre = r.Nombre;

-- Consulta para obtener los restaurantes junto con la cantidad de platos que ofrecen:
SELECT r.Nombre AS Nombre_Restaurante, COUNT(m.Nombre) AS Cantidad_Platos
FROM Restaurante r
LEFT JOIN Menu m ON r.Nombre = m.Restaurante_Nombre
GROUP BY r.Nombre;

-- Consulta para obtener el restaurante con el menú más caro:
SELECT r.Nombre AS Nombre_Restaurante, MAX(m.Precio) AS Precio_Maximo
FROM Restaurante r
INNER JOIN Menu m ON r.Nombre = m.Restaurante_Nombre
GROUP BY r.Nombre;

