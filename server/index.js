const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (logos y fotos de productos subidos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
const productosRoutes = require('./routes/productos');
const localesRoutes = require('./routes/locales');

app.use('/api/productos', productosRoutes);
app.use('/api/locales', localesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API Generador de Carteles funcionando correctamente' });
});

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB:', process.env.MONGO_URI);
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  });
