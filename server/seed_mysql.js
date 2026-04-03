const bcrypt = require('bcrypt');
const db = require('./db');
require('dotenv').config();

async function seed() {
  try {
    // Crear admin
    const hash = await bcrypt.hash('repos2026', 10);
    await db.query(
      `INSERT INTO usuarios (username, password_hash, rol, local_id)
       VALUES ('admin.coca.repo', ?, 'ADMIN', NULL)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      [hash]
    );
    console.log('✅ Usuario admin creado: admin.coca.repo / repos2026');

    // Tipos de cartel
    const tipos = [
      ['Promo', 'Cartel de promoción general', 'vertical'],
      ['Ahorro', 'Cartel de zona de ahorro', 'vertical'],
      ['Lanzamiento', 'Cartel de lanzamiento de producto', 'vertical'],
      ['SuperCombo', 'Cartel de super combo', 'vertical'],
      ['Horizontal', 'Cartel horizontal con dos imágenes de producto', 'horizontal'],
    ];

    for (const [nombre, desc, orientacion] of tipos) {
      await db.query(
        `INSERT INTO tipos_cartel (nombre, descripcion, orientacion)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion)`,
        [nombre, desc, orientacion]
      );
    }
    console.log('✅ Tipos de cartel creados');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed:', err.message);
    process.exit(1);
  }
}

seed();
