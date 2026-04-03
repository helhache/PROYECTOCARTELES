const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { verificarToken, soloAdmin } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/productos');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `producto_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (/jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase()))
      cb(null, true);
    else cb(new Error('Solo se permiten imágenes'));
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

// GET /api/productos — público
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM activaciones WHERE activo = 1 ORDER BY descripcion'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos', detalle: err.message });
  }
});

// GET /api/productos/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM activaciones WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener producto', detalle: err.message });
  }
});

// POST /api/productos/imagen — subir imagen para una activación (solo ADMIN)
router.post('/imagen/:id', verificarToken, soloAdmin, upload.single('imagen'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió imagen' });
  try {
    const imgPath = `/uploads/productos/${req.file.filename}`;
    await db.query('UPDATE activaciones SET imagen = ? WHERE id = ?', [imgPath, req.params.id]);
    res.json({ imagen: imgPath });
  } catch (err) {
    res.status(500).json({ error: 'Error al subir imagen', detalle: err.message });
  }
});

module.exports = router;
