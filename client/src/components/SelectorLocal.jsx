import { useEffect, useState } from 'react';
import axios from 'axios';
import { getImgUrl } from '../config.js';

// Selector de local con logo - carga desde la API
function SelectorLocal({ localSeleccionado, onChange }) {
  const [locales, setLocales] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar locales al montar el componente
  useEffect(() => {
    const cargarLocales = async () => {
      try {
        const { data } = await axios.get('/api/locales');
        setLocales(data);
        // Si hay locales y no hay ninguno seleccionado, seleccionar el primero
        if (data.length > 0 && !localSeleccionado) {
          onChange(data[0]);
        }
      } catch (err) {
        console.error('Error al cargar locales:', err.message);
      } finally {
        setCargando(false);
      }
    };
    cargarLocales();
  }, []);

  if (cargando) return <div className="form-group"><label className="form-label">Local</label><p style={{ color: '#606070', fontSize: '0.85rem' }}>Cargando locales...</p></div>;

  return (
    <div className="form-group">
      <label className="form-label">Local</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {locales.map((local) => (
          <button
            key={local._id}
            onClick={() => onChange(local)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              padding: '0.6rem 0.9rem',
              background: localSeleccionado?._id === local._id ? '#6c63ff20' : '#0f0f13',
              border: `2px solid ${localSeleccionado?._id === local._id ? '#6c63ff' : '#2d2d3d'}`,
              borderRadius: '8px',
              color: localSeleccionado?._id === local._id ? '#6c63ff' : '#e0e0e0',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.88rem',
              transition: 'all 0.2s',
            }}
          >
            {/* Logo del local si existe */}
            {local.logo ? (
              <img
                src={getImgUrl(local.logo)}
                alt={local.nombre}
                style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 4 }}
              />
            ) : (
              <div style={{
                width: 32, height: 32, borderRadius: 4,
                background: '#2d2d3d', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1rem',
              }}>
                🏪
              </div>
            )}
            {local.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SelectorLocal;
