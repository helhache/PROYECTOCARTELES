const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    imagen: {
      type: String, // Ruta relativa al archivo subido, ej: /uploads/productos/coca.jpg
      default: null,
    },
    categoria: {
      type: String,
      trim: true,
      default: 'General',
    },
    local: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Local',
      default: null,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Producto', productoSchema);
