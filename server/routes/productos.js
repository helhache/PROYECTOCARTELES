const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Producto = require('../models/Producto');

// Configuración de Multer para subir imágenes de productos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/productos');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nombre = `producto_${Date.now()}${ext}`;
    cb(null, nombre);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const tipos = /jpeg|jpg|png|gif|webp/;
    const valido = tipos.test(path.extname(file.originalname).toLowerCase());
    if (valido) cb(null, true);
    else cb(new Error('Solo se permiten imágenes'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo
});

// GET /api/productos - Obtener todos los productos activos
router.get('/', async (req, res) => {
  try {
    const { local, categoria } = req.query;
    const filtro = { activo: true };
    if (local) filtro.local = local;
    if (categoria) filtro.categoria = categoria;

    const productos = await Producto.find(filtro).populate('local', 'nombre logo').sort({ nombre: 1 });
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos', detalle: err.message });
  }
});

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate('local', 'nombre logo');
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el producto', detalle: err.message });
  }
});

// POST /api/productos - Crear nuevo producto
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, precio, categoria, local } = req.body;
    const imagenPath = req.file ? `/uploads/productos/${req.file.filename}` : null;

    const producto = new Producto({
      nombre,
      precio: parseFloat(precio),
      categoria,
      local: local || null,
      imagen: imagenPath,
    });

    await producto.save();
    const populado = await Producto.findById(producto._id).populate('local', 'nombre logo');
    res.status(201).json(populado);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear producto', detalle: err.message });
  }
});

// PUT /api/productos/:id - Actualizar producto
router.put('/:id', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, precio, categoria, local } = req.body;
    const updates = {
      nombre,
      precio: parseFloat(precio),
      categoria,
      local: local || null,
    };

    if (req.file) {
      updates.imagen = `/uploads/productos/${req.file.filename}`;
    }

    const producto = await Producto.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('local', 'nombre logo');
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar producto', detalle: err.message });
  }
});

// DELETE /api/productos/:id - Desactivar producto (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto', detalle: err.message });
  }
});

module.exports = router;
