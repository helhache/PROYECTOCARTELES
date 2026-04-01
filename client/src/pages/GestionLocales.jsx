import { useEffect, useState } from 'react';
import axios from 'axios';
import { getImgUrl } from '../config.js';

// Página para administrar locales: ver, crear y editar
function GestionLocales() {
  const [locales, setLocales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null); // null = nuevo, objeto = editar

  // Campos del formulario del modal
  const [form, setForm] = useState({ nombre: '', direccion: '' });
  const [archivoLogo, setArchivoLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Cargar locales al montar
  useEffect(() => {
    cargarLocales();
  }, []);

  const cargarLocales = async () => {
    try {
      const { data } = await axios.get('/api/locales');
      setLocales(data);
    } catch (err) {
      setError('Error al cargar locales');
    } finally {
      setCargando(false);
    }
  };

  // Abrir modal para nuevo local
  const abrirNuevo = () => {
    setEditando(null);
    setForm({ nombre: '', direccion: '' });
    setArchivoLogo(null);
    setPreviewLogo('');
    setModalAbierto(true);
  };

  // Abrir modal para editar local existente
  const abrirEditar = (local) => {
    setEditando(local);
    setForm({ nombre: local.nombre, direccion: local.direccion || '' });
    setArchivoLogo(null);
    setPreviewLogo(getImgUrl(local.logo));
    setModalAbierto(true);
  };

  // Manejar selección de archivo de logo
  const handleArchivoLogo = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setArchivoLogo(archivo);
    setPreviewLogo(URL.createObjectURL(archivo));
  };

  // Guardar (crear o actualizar)
  const handleGuardar = async () => {
    if (!form.nombre.trim()) {
      alert('El nombre del local es obligatorio');
      return;
    }
    setGuardando(true);
    try {
      const formData = new FormData();
      formData.append('nombre', form.nombre.trim());
      formData.append('direccion', form.direccion.trim());
      if (archivoLogo) formData.append('logo', archivoLogo);

      if (editando) {
        await axios.put(`/api/locales/${editando._id}`, formData);
      } else {
        await axios.post('/api/locales', formData);
      }

      setModalAbierto(false);
      await cargarLocales();
    } catch (err) {
      alert('Error al guardar: ' + (err.response?.data?.detalle || err.message));
    } finally {
      setGuardando(false);
    }
  };

  // Eliminar local (soft delete)
  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este local?')) return;
    try {
      await axios.delete(`/api/locales/${id}`);
      await cargarLocales();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  if (cargando) return <div className="spinner" />;

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1 className="gestion-titulo">🏪 Locales</h1>
        <button className="btn-nuevo" onClick={abrirNuevo}>+ Nuevo Local</button>
      </div>

      {error && <div className="msg-error">{error}</div>}

      {locales.length === 0 ? (
        <p className="msg-vacio">No hay locales registrados. ¡Creá el primero!</p>
      ) : (
        <div className="items-grid">
          {locales.map((local) => (
            <div key={local._id} className="item-card">
              {local.logo ? (
                <img src={getImgUrl(local.logo)} alt={local.nombre} className="item-card-img" />
              ) : (
                <div className="item-card-img-placeholder">🏪</div>
              )}
              <div className="item-card-body">
                <p className="item-card-nombre">{local.nombre}</p>
                {local.direccion && (
                  <p className="item-card-detalle">📍 {local.direccion}</p>
                )}
              </div>
              <div className="item-card-actions">
                <button className="btn-editar" onClick={() => abrirEditar(local)}>Editar</button>
                <button className="btn-eliminar" onClick={() => handleEliminar(local._id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear / editar local */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-titulo">{editando ? 'Editar Local' : 'Nuevo Local'}</h2>

            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: El Turco"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dirección (opcional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: Av. Principal 123"
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              />
            </div>

            {/* Subida de logo */}
            <div className="form-group">
              <label className="form-label">Logo del Local</label>
              <label className="upload-area" style={{ cursor: 'pointer', display: 'block' }}>
                {previewLogo ? (
                  <img src={previewLogo} alt="Preview logo" className="upload-preview-img" />
                ) : (
                  <div style={{ color: '#606070', fontSize: '0.9rem' }}>
                    🖼️ Hacer clic para subir logo<br />
                    <span style={{ fontSize: '0.75rem' }}>JPG, PNG, SVG (máx. 5MB)</span>
                  </div>
                )}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleArchivoLogo} />
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

export default GestionLocales;
