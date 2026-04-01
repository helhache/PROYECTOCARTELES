const mongoose = require('mongoose');
require('dotenv').config();

const Local = require('./models/Local');
const Producto = require('./models/Producto');

// Datos iniciales de los 4 locales del negocio
const localesIniciales = [
  { nombre: 'El Turco', direccion: 'Av. Principal 123', logo: null },
  { nombre: 'Tauil', direccion: 'Calle Comercial 456', logo: null },
  { nombre: 'Fiambrisima', direccion: 'Boulevard Norte 789', logo: null },
  { nombre: 'Beraca', direccion: 'Ruta 9 Km 12', logo: null },
];

// 6 productos de ejemplo con precios
const productosIniciales = [
  { nombre: 'Coca Cola 2.25L', precio: 1500, categoria: 'Bebidas' },
  { nombre: 'Jamón Cocido x 100g', precio: 850, categoria: 'Fiambres' },
  { nombre: 'Queso Cremoso x 100g', precio: 1200, categoria: 'Lácteos' },
  { nombre: 'Salchichas x 500g', precio: 2300, categoria: 'Carnes' },
  { nombre: 'Pan de Molde Bimbo', precio: 980, categoria: 'Panadería' },
  { nombre: 'Aceite Girasol 1.5L', precio: 1750, categoria: 'Almacén' },
];

async function seed() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colecciones existentes
    await Local.deleteMany({});
    await Producto.deleteMany({});
    console.log('🧹 Colecciones limpiadas');

    // Insertar locales
    const localesCreados = await Local.insertMany(localesIniciales);
    console.log(`✅ ${localesCreados.length} locales creados:`);
    localesCreados.forEach((l) => console.log(`   - ${l.nombre}`));

    // Insertar productos (asignados al primer local por defecto)
    const productosConLocal = productosIniciales.map((p) => ({
      ...p,
      local: localesCreados[0]._id,
    }));
    const productosCreados = await Producto.insertMany(productosConLocal);
    console.log(`✅ ${productosCreados.length} productos creados:`);
    productosCreados.forEach((p) => console.log(`   - ${p.nombre}: $${p.precio}`));

    console.log('\n🎉 Seed completado exitosamente!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed:', err.message);
    process.exit(1);
  }
}

seed();
