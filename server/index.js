const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/locales', require('./routes/locales'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/activaciones', require('./routes/activaciones'));
app.use('/api/asignaciones', require('./routes/asignaciones'));
app.use('/api/usuarios', require('./routes/usuarios'));

app.get('/', (req, res) => {
    res.json({ mensaje: 'API Generador de Carteles v2.0 funcionando' });
});

// Endpoint temporal para crear tablas y usuario admin
app.get('/api/setup', async (req, res) => {
    try {
          await db.query(`CREATE TABLE IF NOT EXISTS locales (
                id INT AUTO_INCREMENT PRIMARY KEY,
                      nombre VARCHAR(255) NOT NULL UNIQUE,
                            logo VARCHAR(500),
                                  activo TINYINT(1) DEFAULT 1,
                                        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                                            )`);
          await db.query(`CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                      username VARCHAR(255) NOT NULL UNIQUE,
                            password_hash VARCHAR(255) NOT NULL,
                                  rol ENUM('ADMIN','LOCAL') NOT NULL DEFAULT 'LOCAL',
                                        local_id INT DEFAULT NULL,
                                              activo TINYINT(1) DEFAULT 1,
                                                    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                          FOREIGN KEY (local_id) REFERENCES locales(id) ON DELETE SET NULL
                                                              )`);
          await db.query(`CREATE TABLE IF NOT EXISTS tipos_cartel (
                id INT AUTO_INCREMENT PRIMARY KEY,
                      nombre VARCHAR(255) NOT NULL UNIQUE,
                            descripcion TEXT,
                                  orientacion VARCHAR(50) DEFAULT 'vertical'
                                      )`);
          await db.query(`CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                      nombre VARCHAR(255) NOT NULL,
                            precio DECIMAL(10,2),
                                  precio_anterior DECIMAL(10,2),
                                        imagen VARCHAR(500),
                                              local_id INT,
                                                    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                          FOREIGN KEY (local_id) REFERENCES locales(id) ON DELETE CASCADE
                                                              )`);
          await db.query(`CREATE TABLE IF NOT EXISTS activaciones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                      nombre VARCHAR(255) NOT NULL,
                            local_id INT,
                                  tipo_cartel_id INT,
                                        activa TINYINT(1) DEFAULT 1,
                                              creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                    FOREIGN KEY (local_id) REFERENCES locales(id) ON DELETE CASCADE,
                                                          FOREIGN KEY (tipo_cartel_id) REFERENCES tipos_cartel(id) ON DELETE SET NULL
                                                              )`);
          await db.query(`CREATE TABLE IF NOT EXISTS asignaciones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                      activacion_id INT,
                            producto_id INT,
                                  orden INT DEFAULT 0,
                                        FOREIGN KEY (activacion_id) REFERENCES activaciones(id) ON DELETE CASCADE,
                                              FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
                                                  )`);
          const hash = await bcrypt.hash('repos2026', 10);
          await db.query(`INSERT INTO usuarios (username, password_hash, rol, local_id)
                VALUES ('admin.coca.repo', ?, 'ADMIN', NULL)
                      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`, [hash]);
          const tipos = [
                  ['Promo', 'Cartel de promocion general', 'vertical'],
                  ['Ahorro', 'Cartel de zona de ahorro', 'vertical'],
                  ['Lanzamiento', 'Cartel de lanzamiento de producto', 'vertical'],
                  ['SuperCombo', 'Cartel de super combo', 'vertical'],
                  ['Horizontal', 'Cartel horizontal con dos imagenes de producto', 'horizontal'],
                ];
          for (const [nombre, desc, orientacion] of tipos) {
                  await db.query(`INSERT INTO tipos_cartel (nombre, descripcion, orientacion)
                          VALUES (?, ?, ?)
                                  ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion)`, [nombre, desc, orientacion]);
          }
          res.json({ ok: true, mensaje: 'Setup completado: tablas creadas y admin listo' });
    } catch (err) {
          res.status(500).json({ ok: false, error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
