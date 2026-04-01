const mongoose = require('mongoose');

const localSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del local es obligatorio'],
      trim: true,
    },
    logo: {
      type: String, // Ruta relativa al archivo subido, ej: /uploads/logos/elturco.png
      default: null,
    },
    direccion: {
      type: String,
      trim: true,
      default: '',
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Local', localSchema);
