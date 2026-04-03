const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');
const { verificarToken, soloAdmin } = require('../middleware/auth');

// Todas las rutas requieren ADMIN
router.use(verificarToken, soloAdmin);

// GET /api/usuarios
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.username, u.rol, u.activo, u.created_at,
              l.nombre AS local_nombre
       FROM usuarios u
       LEFT JOIN locales l ON u.local_id = l.id
       ORDER BY u.rol, u.username`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios', detalle: err.message });
  }
});

// POST /api/usuarios
router.post('/', async (req, res) => {
  const { username, password, rol, local_id } = req.body;
  if (!username || !password || !rol)
    return res.status(400).json({ error: 'username, password y rol son requeridos' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO usuarios (username, password_hash, rol, local_id) VALUES (?, ?, ?, ?)',
      [username, hash, rol, local_id || null]
    );
    res.status(201).json({ id: result.insertId, username, rol, local_id: local_id || null });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'El nombre de usuario ya existe' });
    res.status(500).json({ error: 'Error al crear usuario', detalle: err.message });
  }
});

// PUT /api/usuarios/:id
router.put('/:id', async (req, res) => {
  const { username, password, rol, local_id, activo } = req.body;
  try {
    const campos = [];
    const valores = [];

    if (username !== undefined) { campos.push('username = ?'); valores.push(username); }
    if (password) { campos.push('password_hash = ?'); valores.push(await bcrypt.hash(password, 10)); }
    if (rol !== undefined) { campos.push('rol = ?'); valores.push(rol); }
    if (local_id !== undefined) { campos.push('local_id = ?'); valores.push(local_id || null); }
    if (activo !== undefined) { campos.push('activo = ?'); valores.push(activo ? 1 : 0); }

    if (campos.length === 0)
      return res.status(400).json({ error: 'Nada para actualizar' });

    valores.push(req.params.id);
    await db.query(`UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`, valores);
    res.json({ mensaje: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario', detalle: err.message });
  }
});

// DELETE /api/usuarios/:id (desactivar)
router.delete('/:id', async (req, res) => {
  try {
    await db.query('UPDATE usuarios SET activo = 0 WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Usuario desactivado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario', detalle: err.message });
  }
});

module.exports = router;
