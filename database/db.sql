CREATE DATABASE database_ec;

USE database_ec;

/* ----- Usuario ----- */
CREATE TABLE user(
    user_id INT(11) NOT NULL,
    email VARCHAR(20) NOT NULL,
    pass VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL
);
ALTER TABLE user
    ADD PRIMARY KEY (user_id);

ALTER TABLE user
    MODIFY user_id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

/* ----- Categoria ------ */
CREATE TABLE categoria(
    categoria_id INT(11) NOT NULL,
    descripcion VARCHAR(20) NOT NULL
);
ALTER TABLE categoria
    ADD PRIMARY KEY (categoria_id);

/* ----- SubCategoria ------ */
CREATE TABLE subCategoria(
    subCategoria_id INT(11) NOT NULL,
    descripcion VARCHAR(20) NOT NULL,
    categoria_id INT(11) NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categoria(categoria_id)
);
ALTER TABLE subCategoria
    ADD PRIMARY KEY (subCategoria_id);

/* ----- Proyecto ------ */
CREATE TABLE proyecto(
    proyecto_id INT(11) NOT NULL,
    nombre VARCHAR(20) NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    img_url VARCHAR(100) NOT NULL,
    fecha_ini TIMESTAMP NOT NULL DEFAULT current_timestamp,
    fecha_fin TIMESTAMP NOT NULL DEFAULT current_timestamp,
    user_id INT(11) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    subCategoria_id INT(11) NOT NULL,
    FOREIGN KEY (subCategoria_id) REFERENCES subCategoria(subCategoria_id)
);
ALTER TABLE proyecto
    ADD PRIMARY KEY (proyecto_id);

ALTER TABLE proyecto
    MODIFY proyecto_id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

ALTER TABLE proyecto
    ALTER COLUMN descripcion VARCHAR(200) NOT NULL;

/* ----- Meta ------ */
CREATE TABLE meta(
    meta_id INT(11) NOT NULL,
    descripcion VARCHAR(20) NOT NULL,
    img_url VARCHAR(100) NOT NULL,
    proyecto_id INT(11) NOT NULL,
    FOREIGN KEY (proyecto_id) REFERENCES proyecto(proyecto_id)
);
ALTER TABLE meta
    ADD PRIMARY KEY (meta_id);

ALTER TABLE meta
    MODIFY meta_id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

/* ----- Monto ------ */
CREATE TABLE monto(
    monto_id INT(11) NOT NULL,
    descripcion VARCHAR(20) NOT NULL,
    img_url VARCHAR(100) NOT NULL,
    proyecto_id INT(11) NOT NULL,
    FOREIGN KEY (proyecto_id) REFERENCES proyecto(proyecto_id)
);
ALTER TABLE monto
    ADD PRIMARY KEY (monto_id);

ALTER TABLE monto
    MODIFY monto_id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

/* ----- Financiacion ------ */
CREATE TABLE financiacion(
    financiacion_id INT(11) NOT NULL,
    fecha_financiacion TIMESTAMP NOT NULL,
    monto_id INT(11) NOT NULL,
    FOREIGN KEY (monto_id) REFERENCES monto(monto_id),
    user_id INT(11) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);
ALTER TABLE financiacion
    ADD PRIMARY KEY (financiacion_id);

ALTER TABLE financiacion
    MODIFY financiacion_id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

/* ----- Reclamo ------ */
CREATE TABLE reclamo(
    reclamo_id INT(11) NOT NULL,
    descripcion VARCHAR(20) NOT NULL,    
    fecha_reclamo TIMESTAMP NOT NULL,
    financiacion_id INT(11) NOT NULL,
    FOREIGN KEY (financiacion_id) REFERENCES financiacion(financiacion_id)
);
ALTER TABLE reclamo
    ADD PRIMARY KEY (reclamo_id);

ALTER TABLE reclamo
    MODIFY reclamo_id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

/* ----- Valoracion ------ */
CREATE TABLE valoracion(
    valoracion_id INT(11) NOT NULL,
    valor INT(11) NOT NULL,
    user_id INT(11) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    proyecto_id INT(11) NOT NULL,
    FOREIGN KEY (proyecto_id) REFERENCES proyecto(proyecto_id)
);
ALTER TABLE valoracion
    ADD PRIMARY KEY (valoracion_id);

ALTER TABLE valoracion
    MODIFY valoracion_id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

/* ----- Comentario ------ */
CREATE TABLE comentario(
    comentario_id INT(11) NOT NULL,
    contenido VARCHAR(50) NOT NULL,
    user_id INT(11) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    proyecto_id INT(11) NOT NULL,
    FOREIGN KEY (proyecto_id) REFERENCES proyecto(proyecto_id)
);
ALTER TABLE comentario
    ADD PRIMARY KEY (comentario_id);

ALTER TABLE comentario
    MODIFY comentario_id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

/* ----- Llenar categorias y subcategorias -----*/
INSERT INTO categoria (categoria_id,descripcion) VALUES (1,'Producto');
INSERT INTO categoria (categoria_id,descripcion) VALUES (2,'Servicio');
INSERT INTO categoria (categoria_id,descripcion) VALUES (3,'Benefisencia');

INSERT INTO subCategoria (subCategoria_id,descripcion,categoria_id) VALUES (1,'Arte',1);

INSERT INTO subCategoria (subCategoria_id,descripcion,categoria_id) VALUES (11,'Software',2);

INSERT INTO subCategoria (subCategoria_id,descripcion,categoria_id) VALUES (21,'Kermese',3);

-- Wea Atb Ignorar --

SELECT * FROM field_noticias fn WHERE id_autor = NULL;
SELECT COUNT(*) as cant, entity_id FROM `field_body` GROUP BY entity_id ORDER BY cant ASC;