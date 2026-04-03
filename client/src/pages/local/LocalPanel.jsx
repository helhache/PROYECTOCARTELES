import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import CartelHorizontal from '../../components/CartelHorizontal.jsx';
import CartelVertical from '../../components/CartelVertical.jsx';
import BotonesExportarLocal from '../../components/BotonesExportarLocal.jsx';
import { getImgUrl } from '../../config';

export default function LocalPanel() {
  const { usuario } = useAuth();
  const [activaciones, setActivaciones] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [orientacion, setOrientacion] = useState('horizontal');
  const [esColor, setEsColor] = useState(true);
  const [precioCustom, setPrecioCustom] = useState('');
  const [imagenCustom, setImagenCustom] = useState('');

  useEffect(() => {
    axios.get('/api/activaciones').then(r => setActivaciones(r.data)).catch(() => {});
  }, []);

  const seleccionar = (act) => {
    setSeleccionada(act);
    setPrecioCustom(act.precio_personalizado || act.precio_oferta || '');
    setImagenCustom('');
  };

  const handleImagen = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagenCustom(ev.target.result);
    reader.readAsDataURL(f);
  };

  const formatPrecio = (p) => p != null ? `$${Number(p).toLocaleString('es-AR')}` : '—';
  const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-AR') : '—';

  const datosCartel = seleccionada ? {
    descripcion: seleccionada.descripcion,
    dinamica: seleccionada.dinamica,
    precio: precioCustom || seleccionada.precio_oferta,
    imagen: imagenCustom || getImgUrl(seleccionada.imagen),
    logoLocal: getImgUrl(usuario.local_logo),
    nombreLocal: usuario.local_nombre,
    esColor,
  } : null;

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem' }}>

        {/* Panel izquierdo: lista de activaciones */}
        <div style={{ background: '#1a1a24', border: '1px solid #2d2d3d', borderRadius: 12, padding: '1.2rem', height: 'fit-content', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
          <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>
            Mis activaciones ({activaciones.length})
          </h3>

          {activaciones.length === 0 && (
            <p style={{ color: '#606070', fontSize: '0.9rem' }}>No tenés activaciones asignadas.</p>
          )}

          {activaciones.map(a => (
            <div
              key={a.id}
              onClick={() => seleccionar(a)}
              style={{
                background: seleccionada?.id === a.id ? '#6c63ff15' : '#0f0f13',
                border: `1px solid ${seleccionada?.id === a.id ? '#6c63ff' : '#2d2d3d'}`,
                borderRadius: 8,
                padding: '0.8rem',
                marginBottom: '0.6rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem', lineHeight: 1.3 }}>{a.descripcion}</div>
                <span style={{ background: '#6c63ff20', color: '#a78bfa', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: '0.72rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {a.dinamica}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                <span style={{ color: '#38a169', fontWeight: 700, fontSize: '0.9rem' }}>
                  {formatPrecio(a.precio_personalizado || a.precio_oferta)}
                </span>
                <span style={{ color: '#9090a0', fontSize: '0.75rem' }}>
                  hasta {formatFecha(a.hasta)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Panel derecho: cartel */}
        <div style={{ background: '#1a1a24', border: '1px solid #2d2d3d', borderRadius: 12, padding: '1.5rem' }}>
          {!seleccionada ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, color: '#606070', fontSize: '1rem' }}>
              Seleccioná una activación para generar el cartel
            </div>
          ) : (
            <>
              {/* Controles */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.2rem', alignItems: 'flex-end' }}>

                {/* Orientación */}
                <div>
                  <div className="form-label">Orientación</div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {['horizontal', 'vertical'].map(o => (
                      <button
                        key={o}
                        onClick={() => setOrientacion(o)}
                        style={{
                          padding: '0.4rem 0.8rem', border: `2px solid ${orientacion === o ? '#6c63ff' : '#2d2d3d'}`,
                          borderRadius: 6, background: orientacion === o ? '#6c63ff20' : '#0f0f13',
                          color: orientacion === o ? '#6c63ff' : '#9090a0', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                        }}
                      >
                        {o === 'horizontal' ? 'Horizontal' : 'Vertical'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <div className="form-label">Impresión</div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {[true, false].map(c => (
                      <button
                        key={String(c)}
                        onClick={() => setEsColor(c)}
                        style={{
                          padding: '0.4rem 0.8rem', border: `2px solid ${esColor === c ? '#6c63ff' : '#2d2d3d'}`,
                          borderRadius: 6, background: esColor === c ? '#6c63ff20' : '#0f0f13',
                          color: esColor === c ? '#6c63ff' : '#9090a0', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                        }}
                      >
                        {c ? 'Color' : 'B&N'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Precio */}
                <div>
                  <div className="form-label">Precio ($)</div>
                  <input
                    className="form-control"
                    type="number"
                    style={{ width: 130 }}
                    value={precioCustom}
                    onChange={e => setPrecioCustom(e.target.value)}
                    min="0"
                  />
                </div>

                {/* Imagen del producto */}
                <div>
                  <div className="form-label">Foto del producto</div>
                  <label style={{ cursor: 'pointer', background: '#0f0f13', border: '1px solid #2d2d3d', borderRadius: 6, padding: '0.4rem 0.8rem', color: '#9090a0', fontSize: '0.82rem', display: 'inline-block' }}>
                    {imagenCustom ? 'Cambiar foto' : 'Subir foto'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImagen} />
                  </label>
                </div>
              </div>

              {/* Preview del cartel */}
              <div style={{ display: 'flex', justifyContent: 'center', background: '#2a2a38', borderRadius: 10, padding: '1.5rem', minHeight: 450 }}>
                {orientacion === 'horizontal' ? (
                  <CartelHorizontal datos={datosCartel} />
                ) : (
                  <CartelVertical datos={datosCartel} />
                )}
              </div>

              {/* Botones exportar */}
              <BotonesExportarLocal
                orientacion={orientacion}
                esColor={esColor}
                activacionId={seleccionada.id}
                descripcion={seleccionada.descripcion}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
