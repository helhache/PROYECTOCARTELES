const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Local = require('../models/Local');

// Configuración de Multer para subir logos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/logos');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nombre = `logo_${Date.now()}${ext}`;
    cb(null, nombre);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const tipos = /jpeg|jpg|png|gif|webp|svg/;
    const valido = tipos.test(path.extname(file.originalname).toLowerCase());
    if (valido) cb(null, true);
    else cb(new Error('Solo se permiten imágenes'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
});

// GET /api/locales - Obtener todos los locales activos
router.get('/', async (req, res) => {
  try {
    const locales = await Local.find({ activo: true }).sort({ nombre: 1 });
    res.json(locales);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener locales', detalle: err.message });
  }
});

// GET /api/locales/:id - Obtener un local por ID
router.get('/:id', async (req, res) => {
  try {
    const local = await Local.findById(req.params.id);
    if (!local) return res.status(404).json({ error: 'Local no encontrado' });
    res.json(local);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el local', detalle: err.message });
  }
});

// POST /api/locales - Crear nuevo local (con logo opcional)
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const { nombre, direccion } = req.body;
    const logoPath = req.file ? `/uploads/logos/${req.file.filename}` : null;

    const local = new Local({ nombre, direccion, logo: logoPath });
    await local.save();
    res.status(201).json(local);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear local', detalle: err.message });
  }
});

// PUT /api/locales/:id - Actualizar local
router.put('/:id', upload.single('logo'), async (req, res) => {
  try {
    const { nombre, direccion } = req.body;
    const updates = { nombre, direccion };

    if (req.file) {
      updates.logo = `/uploads/logos/${req.file.filename}`;
    }

    const local = await Local.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!local) return res.status(404).json({ error: 'Local no encontrado' });
    res.json(local);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar local', detalle: err.message });
  }
});

// DELETE /api/locales/:id - Desactivar local (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const local = await Local.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
    if (!local) return res.status(404).json({ error: 'Local no encontrado' });
    res.json({ mensaje: 'Local desactivado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar local', detalle: err.message });
  }
});

module.exports = router;
