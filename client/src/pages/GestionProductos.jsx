import { useEffect, useState } from 'react';
import axios from 'axios';

// Página para administrar productos: ver, crear, editar con imagen
function GestionProductos() {
  const [productos, setProductos] = useState([]);
  const [locales, setLocales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);

  // Campos del formulario del modal
  const [form, setForm] = useState({ nombre: '', precio: '', categoria: 'General', local: '' });
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Cargar productos y locales al montar
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resProductos, resLocales] = await Promise.all([
        axios.get('/api/productos'),
        axios.get('/api/locales'),
      ]);
      setProductos(resProductos.data);
      setLocales(resLocales.data);
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setCargando(false);
    }
  };

  // Abrir modal para nuevo producto
  const abrirNuevo = () => {
    setEditando(null);
    setForm({ nombre: '', precio: '', categoria: 'General', local: '' });
    setArchivoImagen(null);
    setPreviewImagen('');
    setModalAbierto(true);
  };

  // Abrir modal para editar producto existente
  const abrirEditar = (producto) => {
    setEditando(producto);
    setForm({
      nombre: producto.nombre,
      precio: producto.precio,
      categoria: producto.categoria || 'General',
      local: producto.local?._id || '',
    });
    setArchivoImagen(null);
    setPreviewImagen(producto.imagen || '');
    setModalAbierto(true);
  };

  // Manejar selección de imagen del producto
  const handleArchivoImagen = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setArchivoImagen(archivo);
    setPreviewImagen(URL.createObjectURL(archivo));
  };

  // Guardar (crear o actualizar)
  const handleGuardar = async () => {
    if (!form.nombre.trim() || !form.precio) {
      alert('Nombre y precio son obligatorios');
      return;
    }
    setGuardando(true);
    try {
      const formData = new FormData();
      formData.append('nombre', form.nombre.trim());
      formData.append('precio', form.precio);
      formData.append('categoria', form.categoria);
      if (form.local) formData.append('local', form.local);
      if (archivoImagen) formData.append('imagen', archivoImagen);

      if (editando) {
        await axios.put(`/api/productos/${editando._id}`, formData);
      } else {
        await axios.post('/api/productos', formData);
      }

      setModalAbierto(false);
      await cargarDatos();
    } catch (err) {
      alert('Error al guardar: ' + (err.response?.data?.detalle || err.message));
    } finally {
      setGuardando(false);
    }
  };

  // Eliminar producto (soft delete)
  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await axios.delete(`/api/productos/${id}`);
      await cargarDatos();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  if (cargando) return <div className="spinner" />;

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1 className="gestion-titulo">📦 Productos</h1>
        <button className="btn-nuevo" onClick={abrirNuevo}>+ Nuevo Producto</button>
      </div>

      {error && <div className="msg-error">{error}</div>}

      {productos.length === 0 ? (
        <p className="msg-vacio">No hay productos registrados. ¡Creá el primero!</p>
      ) : (
        <div className="items-grid">
          {productos.map((prod) => (
            <div key={prod._id} className="item-card">
              {prod.imagen ? (
                <img src={prod.imagen} alt={prod.nombre} className="item-card-img" />
              ) : (
                <div className="item-card-img-placeholder">📦</div>
              )}
              <div className="item-card-body">
                <p className="item-card-nombre">{prod.nombre}</p>
                <p className="item-card-detalle">{prod.categoria}</p>
                {prod.local && (
                  <p className="item-card-detalle">🏪 {prod.local.nombre}</p>
                )}
                <p className="item-card-precio">${Number(prod.precio).toLocaleString('es-AR')}</p>
              </div>
              <div className="item-card-actions">
                <button className="btn-editar" onClick={() => abrirEditar(prod)}>Editar</button>
                <button className="btn-eliminar" onClick={() => handleEliminar(prod._id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear / editar producto */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-titulo">{editando ? 'Editar Producto' : 'Nuevo Producto'}</h2>

            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: Coca Cola 2.25L"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Precio ($) *</label>
              <input
                type="number"
                className="form-control"
                placeholder="Ej: 1500"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select
                className="form-control"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              >
                <option>General</option>
                <option>Bebidas</option>
                <option>Fiambres</option>
                <option>Lácteos</option>
                <option>Carnes</option>
                <option>Panadería</option>
                <option>Almacén</option>
                <option>Limpieza</option>
                <option>Verduras</option>
                <option>Otros</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Local (opcional)</label>
              <select
                className="form-control"
                value={form.local}
                onChange={(e) => setForm({ ...form, local: e.target.value })}
              >
                <option value="">-- Sin local asignado --</option>
                {locales.map((l) => (
                  <option key={l._id} value={l._id}>{l.nombre}</option>
                ))}
              </select>
            </div>

            {/* Subida de imagen del producto */}
            <div className="form-group">
              <label className="form-label">Imagen del Producto</label>
              <label className="upload-area" style={{ cursor: 'pointer', display: 'block' }}>
                {previewImagen ? (
                  <img src={previewImagen} alt="Preview producto" className="upload-preview-img" />
                ) : (
                  <div style={{ color: '#606070', fontSize: '0.9rem' }}>
                    🖼️ Hacer clic para subir imagen<br />
                    <span style={{ fontSize: '0.75rem' }}>JPG, PNG (máx. 10MB)</span>
                  </div>
                )}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleArchivoImagen} />
              </label>
            </div>

            <div className="modal-actions">
              <button className="btn-cancelar" onClick={() => setModalAbierto(false)}>Cancelar</button>
              <button className="btn-guardar" onClick={handleGuardar} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionProductos;
