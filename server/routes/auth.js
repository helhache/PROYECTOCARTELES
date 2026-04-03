const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const SECRET = process.env.JWT_SECRET || 'carteles_secret_2026';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });

  try {
    const [rows] = await db.query(
      `SELECT u.*, l.nombre AS local_nombre, l.logo AS local_logo
       FROM usuarios u
       LEFT JOIN locales l ON u.local_id = l.id
       WHERE u.username = ? AND u.activo = 1`,
      [username]
    );

    if (rows.length === 0)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const usuario = rows[0];
    const valido = await bcrypt.compare(password, usuario.password_hash);
    if (!valido)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const payload = {
      id: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
      local_id: usuario.local_id,
      local_nombre: usuario.local_nombre,
      local_logo: usuario.local_logo,
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: '12h' });
    res.json({ token, usuario: payload });
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message });
  }
});

module.exports = router;
