/**
 * seed_railway.js
 * Seed para Railway — usa DB_NAME del .env (no hardcodea sigma_db).
 * Ejecutar: node seed_railway.js
 * Con vars de Railway: DB_HOST=... DB_PORT=... DB_USER=... DB_PASSWORD=... DB_NAME=railway node seed_railway.js
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'railway';

async function seed() {
  const useSSL = process.env.DB_SSL === 'true' || (process.env.DB_HOST && process.env.DB_HOST !== 'localhost');
  const conn = await mysql.createConnection({
    host:               process.env.DB_HOST     || 'localhost',
    port:               parseInt(process.env.DB_PORT || '3306'),
    user:               process.env.DB_USER     || 'root',
    password:           process.env.DB_PASSWORD || '',
    database:           DB_NAME,
    multipleStatements: true,
    ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {}),
  });

  try {
    console.log(`🚀 Conectado a la base de datos: ${DB_NAME}\n`);

    // ── LIMPIAR TABLAS VIEJAS (orden inverso de dependencias) ────────────────
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    const tablasABorrar = [
      'log_descargas','cambio_items','cambios','pedido_items','pedidos',
      'objetivo_skus','objetivos','asignaciones','activaciones',
      'reclamos','repositores_locales','usuarios_locales',
      'repositores','usuarios','locales','empresas',
      'productos','motivos_cambio','tipos_cartel'
    ];
    for (const t of tablasABorrar) {
      await conn.query(`DROP TABLE IF EXISTS \`${t}\``);
    }
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Tablas anteriores eliminadas');

    // ── TABLAS NUEVAS ────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS empresas (
        id        INT AUTO_INCREMENT PRIMARY KEY,
        nombre    VARCHAR(100) NOT NULL UNIQUE,
        tipo      ENUM('regional','nacional') NOT NULL DEFAULT 'regional',
        activo    TINYINT DEFAULT 1,
        creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS locales (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        empresa_id   INT NOT NULL,
        nombre       VARCHAR(150) NOT NULL,
        direccion    VARCHAR(255),
        numero_local VARCHAR(20) UNIQUE,
        tipo         ENUM('regional','nacional') NOT NULL DEFAULT 'regional',
        activo       TINYINT DEFAULT 1,
        creado_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE RESTRICT
      );

      CREATE TABLE IF NOT EXISTS usuarios (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        username       VARCHAR(100) NOT NULL UNIQUE,
        password_hash  VARCHAR(255) NOT NULL,
        rol            ENUM('ADMIN','LOCAL','REPOSITOR') NOT NULL,
        nombre_display VARCHAR(150),
        activo         TINYINT DEFAULT 1,
        ultimo_login   DATETIME,
        creado_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS repositores (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id      INT NOT NULL UNIQUE,
        nombre          VARCHAR(100) NOT NULL,
        apellido        VARCHAR(100) NOT NULL,
        numero_vendedor VARCHAR(20) UNIQUE NOT NULL,
        activo          TINYINT DEFAULT 1,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS usuarios_locales (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        local_id   INT NOT NULL,
        UNIQUE KEY uq_usuario_local (usuario_id, local_id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)  ON DELETE CASCADE,
        FOREIGN KEY (local_id)   REFERENCES locales(id)   ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS repositores_locales (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        repositor_id INT NOT NULL,
        local_id     INT NOT NULL,
        UNIQUE KEY uq_repo_local (repositor_id, local_id),
        FOREIGN KEY (repositor_id) REFERENCES repositores(id) ON DELETE CASCADE,
        FOREIGN KEY (local_id)     REFERENCES locales(id)     ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS productos (
        id                 INT AUTO_INCREMENT PRIMARY KEY,
        ean                BIGINT UNIQUE NOT NULL,
        codigo_venta       VARCHAR(4),
        nombre             VARCHAR(200) NOT NULL,
        descripcion        TEXT,
        unidades_por_bulto INT,
        unidades_por_pale  INT,
        precio_sugerido    DECIMAL(10,2),
        unit_value         DECIMAL(10,4),
        sovi_requerido     DECIMAL(5,2),
        imagen             VARCHAR(255),
        activo             TINYINT DEFAULT 1,
        creado_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS activaciones (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        tipo            ENUM('Mensual','Semanal','Especial') NOT NULL DEFAULT 'Mensual',
        desde           DATE NOT NULL,
        hasta           DATE NOT NULL,
        ean             BIGINT NOT NULL,
        descripcion     VARCHAR(200) NOT NULL,
        dinamica        VARCHAR(100),
        dcto            DECIMAL(10,4),
        precio_sugerido DECIMAL(10,2),
        precio_oferta   DECIMAL(10,2),
        activo          TINYINT DEFAULT 1,
        creado_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ean) REFERENCES productos(ean) ON DELETE RESTRICT
      );

      CREATE TABLE IF NOT EXISTS asignaciones (
        id                   INT AUTO_INCREMENT PRIMARY KEY,
        local_id             INT NOT NULL,
        activacion_id        INT NOT NULL,
        precio_personalizado DECIMAL(10,2),
        activa               TINYINT DEFAULT 1,
        creado_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_asignacion (local_id, activacion_id),
        FOREIGN KEY (local_id)      REFERENCES locales(id)      ON DELETE CASCADE,
        FOREIGN KEY (activacion_id) REFERENCES activaciones(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS pedidos (
        id                     INT AUTO_INCREMENT PRIMARY KEY,
        local_id               INT NOT NULL,
        repositor_id           INT,
        tipo                   ENUM('programado','forzado') NOT NULL DEFAULT 'programado',
        fecha_pedido           DATE NOT NULL,
        fecha_entrega_estimada DATE,
        estado                 ENUM('borrador','confirmado','en_transito','entregado','cancelado') DEFAULT 'borrador',
        total_bultos           INT DEFAULT 0,
        total_units            DECIMAL(10,4) DEFAULT 0,
        total_volumen          DECIMAL(10,4) DEFAULT 0,
        notas                  TEXT,
        creado_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (local_id)     REFERENCES locales(id)     ON DELETE RESTRICT,
        FOREIGN KEY (repositor_id) REFERENCES repositores(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS pedido_items (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        pedido_id       INT NOT NULL,
        producto_id     INT NOT NULL,
        cantidad_bultos INT NOT NULL,
        precio_unitario DECIMAL(10,2),
        FOREIGN KEY (pedido_id)   REFERENCES pedidos(id)   ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
      );

      CREATE TABLE IF NOT EXISTS objetivos (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        periodo          ENUM('semanal','mensual','anual') NOT NULL,
        fecha_inicio     DATE NOT NULL,
        fecha_fin        DATE NOT NULL,
        volumen_objetivo DECIMAL(10,2) NOT NULL,
        unit_general     DECIMAL(10,4) NOT NULL DEFAULT 1.7,
        descripcion      VARCHAR(200),
        activo           TINYINT DEFAULT 1,
        creado_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS objetivo_skus (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        objetivo_id      INT NOT NULL,
        producto_id      INT NOT NULL,
        volumen_objetivo DECIMAL(10,2) NOT NULL,
        sovi_objetivo    DECIMAL(5,2),
        UNIQUE KEY uq_obj_sku (objetivo_id, producto_id),
        FOREIGN KEY (objetivo_id) REFERENCES objetivos(id)  ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos(id)  ON DELETE RESTRICT
      );

      CREATE TABLE IF NOT EXISTS motivos_cambio (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        descripcion VARCHAR(150) NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS cambios (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        repositor_id    INT NOT NULL,
        local_id        INT NOT NULL,
        numero_vendedor VARCHAR(20) NOT NULL,
        fecha           DATE NOT NULL,
        estado          ENUM('pendiente','aprobado','procesado','rechazado') DEFAULT 'pendiente',
        notas           TEXT,
        nota_admin      TEXT,
        creado_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (repositor_id) REFERENCES repositores(id) ON DELETE RESTRICT,
        FOREIGN KEY (local_id)     REFERENCES locales(id)     ON DELETE RESTRICT
      );

      CREATE TABLE IF NOT EXISTS cambio_items (
        id                   INT AUTO_INCREMENT PRIMARY KEY,
        cambio_id            INT NOT NULL,
        producto_id          INT NOT NULL,
        cantidad             INT NOT NULL,
        motivo_id            INT NOT NULL,
        fecha_vencimiento    DATE,
        etiquetas_requeridas INT DEFAULT 0,
        FOREIGN KEY (cambio_id)   REFERENCES cambios(id)        ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos(id)      ON DELETE RESTRICT,
        FOREIGN KEY (motivo_id)   REFERENCES motivos_cambio(id) ON DELETE RESTRICT
      );

      CREATE TABLE IF NOT EXISTS reclamos (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        remitente_id  INT NOT NULL,
        remitente_rol ENUM('LOCAL','REPOSITOR') NOT NULL,
        local_id      INT NOT NULL,
        tipo          VARCHAR(100),
        descripcion   TEXT NOT NULL,
        estado        ENUM('abierto','en_revision','resuelto','cerrado') DEFAULT 'abierto',
        resolucion    TEXT,
        fecha         DATE NOT NULL,
        creado_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (remitente_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
        FOREIGN KEY (local_id)     REFERENCES locales(id)  ON DELETE RESTRICT
      );

      CREATE TABLE IF NOT EXISTS tipos_cartel (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        nombre      VARCHAR(100) NOT NULL UNIQUE,
        descripcion TEXT,
        orientacion ENUM('vertical','horizontal') DEFAULT 'vertical'
      );

      CREATE TABLE IF NOT EXISTS log_descargas (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id    INT,
        activacion_id INT,
        local_id      INT,
        tipo_cartel   VARCHAR(100),
        formato       VARCHAR(20),
        descargado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id)    REFERENCES usuarios(id)     ON DELETE SET NULL,
        FOREIGN KEY (activacion_id) REFERENCES activaciones(id) ON DELETE SET NULL,
        FOREIGN KEY (local_id)      REFERENCES locales(id)      ON DELETE SET NULL
      );
    `);
    console.log('✅ Tablas verificadas / creadas');

    // ── TIPOS DE CARTEL ──────────────────────────────────────────────────────
    const tipos = [
      ['Promo',       'Cartel de promoción general',     'vertical'],
      ['Ahorro',      'Cartel de precio ahorro',         'vertical'],
      ['Lanzamiento', 'Cartel de nuevo producto',        'vertical'],
      ['SuperCombo',  'Cartel de combo especial',        'vertical'],
      ['Horizontal',  'Cartel horizontal con dos logos', 'horizontal'],
    ];
    for (const [nombre, desc, orientacion] of tipos) {
      await conn.query(
        `INSERT INTO tipos_cartel (nombre, descripcion, orientacion)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion)`,
        [nombre, desc, orientacion]
      );
    }
    console.log('✅ Tipos de cartel cargados');

    // ── MOTIVOS DE CAMBIO ────────────────────────────────────────────────────
    const motivos = ['Vencimiento', 'Rotura', 'Defecto de fábrica', 'Error de pedido', 'Otro'];
    for (const descripcion of motivos) {
      await conn.query(
        `INSERT INTO motivos_cambio (descripcion) VALUES (?)
         ON DUPLICATE KEY UPDATE descripcion = descripcion`,
        [descripcion]
      );
    }
    console.log('✅ Motivos de cambio cargados');

    // ── EMPRESAS ─────────────────────────────────────────────────────────────
    const empresas = [
      ['Tauil',        'regional'],
      ['Fiambrissima', 'regional'],
      ['Beraca',       'regional'],
    ];
    for (const [nombre, tipo] of empresas) {
      await conn.query(
        `INSERT INTO empresas (nombre, tipo) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE tipo = VALUES(tipo)`,
        [nombre, tipo]
      );
    }
    console.log('✅ Empresas cargadas: Tauil, Fiambrissima, Beraca');

    // ── LOCALES ──────────────────────────────────────────────────────────────
    const [[tauil]]        = await conn.query(`SELECT id FROM empresas WHERE nombre = 'Tauil'`);
    const [[fiambrissima]] = await conn.query(`SELECT id FROM empresas WHERE nombre = 'Fiambrissima'`);
    const [[beraca]]       = await conn.query(`SELECT id FROM empresas WHERE nombre = 'Beraca'`);

    const localesData = [
      [tauil.id,        'Tauil Casa Central',    null, '001', 'regional'],
      [fiambrissima.id, 'Fiambrissima Misiones', null, '002', 'regional'],
      [fiambrissima.id, 'Fiambrissima Illia',    null, '003', 'regional'],
      [beraca.id,       'Beraca Dos Avenidas',   null, '004', 'regional'],
      [beraca.id,       'Beraca San Isidro',     null, '005', 'regional'],
    ];
    for (const [empresa_id, nombre, direccion, numero_local, tipo] of localesData) {
      await conn.query(
        `INSERT INTO locales (empresa_id, nombre, direccion, numero_local, tipo)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE nombre = VALUES(nombre)`,
        [empresa_id, nombre, direccion, numero_local, tipo]
      );
    }
    console.log('✅ Locales cargados: 5 locales');

    // ── USUARIO ADMIN ────────────────────────────────────────────────────────
    const adminHash = await bcrypt.hash('repos2026', 10);
    await conn.query(
      `INSERT INTO usuarios (username, password_hash, rol, nombre_display)
       VALUES ('admin.sigma', ?, 'ADMIN', 'Administrador SIGMA')
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      [adminHash]
    );
    console.log('✅ Usuario admin creado: admin.sigma / repos2026');

    console.log('\n🎉 Base de datos lista para usar.');
    await conn.end();
    process.exit(0);

  } catch (err) {
    console.error('❌ Error:', err.message);
    await conn.end();
    process.exit(1);
  }
}

seed();
