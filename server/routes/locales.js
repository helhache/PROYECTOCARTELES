const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { verificarToken, soloAdmin } = require('../middleware/auth');

// Configuración de Multer para logos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/logos');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `logo_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (/jpeg|jpg|png|gif|webp|svg/.test(path.extname(file.originalname).toLowerCase()))
      cb(null, true);
    else cb(new Error('Solo se permiten imágenes'));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// GET /api/locales — público (el login necesita saber los locales para el formulario de usuario)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM locales WHERE activo = 1 ORDER BY nombre');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener locales', detalle: err.message });
  }
});

// GET /api/locales/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM locales WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Local no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener local', detalle: err.message });
  }
});

// POST /api/locales — solo ADMIN
router.post('/', verificarToken, soloAdmin, upload.single('logo'), async (req, res) => {
  try {
    const { nombre } = req.body;
    const logo = req.file ? `/uploads/logos/${req.file.filename}` : null;
    const [result] = await db.query(
      'INSERT INTO locales (nombre, logo) VALUES (?, ?)',
      [nombre, logo]
    );
    const [rows] = await db.query('SELECT * FROM locales WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear local', detalle: err.message });
  }
});

// PUT /api/locales/:id — solo ADMIN
router.put('/:id', verificarToken, soloAdmin, upload.single('logo'), async (req, res) => {
  try {
    const { nombre } = req.body;
    const campos = ['nombre = ?'];
    const valores = [nombre];

    if (req.file) {
      campos.push('logo = ?');
      valores.push(`/uploads/logos/${req.file.filename}`);
    }

    valores.push(req.params.id);
    await db.query(`UPDATE locales SET ${campos.join(', ')} WHERE id = ?`, valores);
    const [rows] = await db.query('SELECT * FROM locales WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar local', detalle: err.message });
  }
});

// DELETE /api/locales/:id — solo ADMIN (soft delete)
router.delete('/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    await db.query('UPDATE locales SET activo = 0 WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Local desactivado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar local', detalle: err.message });
  }
});

module.exports = router;
