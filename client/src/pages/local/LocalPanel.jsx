import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import CartelHorizontal from '../../components/CartelHorizontal.jsx';
import CartelVertical from '../../components/CartelVertical.jsx';
import CartelCombo from '../../components/CartelCombo.jsx';
import BotonesExportarLocal from '../../components/BotonesExportarLocal.jsx';
import { getImgUrl } from '../../config';

const TIPOS_LIBRES = [
  { id: 'super_precios',       label: 'Super Precios',      dinamica: 'SUPER PRECIOS',      color: '#2563eb' },
  { id: 'promo_del_dia',       label: 'Promo del Día',      dinamica: 'PROMO DEL DÍA',      color: '#d97706' },
  { id: 'consumo_inmediato',   label: 'Consumo Inmediato',  dinamica: 'CONSUMO INMEDIATO',  color: '#059669' },
  { id: 'combo',               label: 'Combo',              dinamica: 'COMBO',              color: '#7c3aed' },
  { id: 'personalizado',       label: 'Personalizado',      dinamica: '',                   color: '#6c63ff' },
];

export default function LocalPanel() {
  const { usuario } = useAuth();

  // --- Modo ---
  const [modo, setModo] = useState('activaciones'); // 'activaciones' | 'libre'

  // --- Activaciones ---
  const [activaciones, setActivaciones] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [precioCustom, setPrecioCustom] = useState('');
  const [imagenCustom, setImagenCustom] = useState('');

  // --- Cartel libre ---
  const [tipoLibre, setTipoLibre] = useState(null);
  const [descripLibre, setDescripLibre] = useState('');
  const [dinamicaLibre, setDinamicaLibre] = useState('');
  const [precioLibre, setPrecioLibre] = useState('');
  const [imagenLibre, setImagenLibre] = useState('');
  // Combo: segundo producto
  const [descripLibre2, setDescripLibre2] = useState('');
  const [imagenLibre2, setImagenLibre2] = useState('');

  // --- Compartidos ---
  const [orientacion, setOrientacion] = useState('horizontal');
  const [esColor, setEsColor] = useState(true);

  useEffect(() => {
    axios.get('/api/activaciones').then(r => setActivaciones(r.data)).catch(() => {});
  }, []);

  const seleccionar = (act) => {
    setSeleccionada(act);
    setPrecioCustom(act.precio_personalizado || act.precio_oferta || '');
    setImagenCustom('');
  };

  const handleImagenAct = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagenCustom(ev.target.result);
    reader.readAsDataURL(f);
  };

  const handleImagenLibre = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagenLibre(ev.target.result);
    reader.readAsDataURL(f);
  };

  const seleccionarTipoLibre = (tipo) => {
    setTipoLibre(tipo);
    setDinamicaLibre(tipo.dinamica);
    setDescripLibre('');
    setPrecioLibre('');
    setImagenLibre('');
    setDescripLibre2('');
    setImagenLibre2('');
  };

  const handleImagenLibre2 = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagenLibre2(ev.target.result);
    reader.readAsDataURL(f);
  };

  const formatPrecio = (p) => p != null ? `$${Number(p).toLocaleString('es-AR')}` : '—';
  const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-AR') : '—';

  const datosCartel = (() => {
    const base = {
      logoLocal: getImgUrl(usuario.local_logo),
      nombreLocal: usuario.local_nombre,
      esColor,
    };
    if (modo === 'activaciones' && seleccionada) {
      return {
        ...base,
        descripcion: seleccionada.descripcion,
        dinamica: seleccionada.dinamica,
        precio: precioCustom || seleccionada.precio_oferta,
        imagen: imagenCustom || getImgUrl(seleccionada.imagen),
      };
    }
    if (modo === 'libre' && tipoLibre) {
      if (tipoLibre.id === 'combo' && (descripLibre || descripLibre2)) {
        return {
          ...base,
          descripcion: descripLibre,
          descripcion2: descripLibre2,
          dinamica: dinamicaLibre,
          precio: precioLibre || null,
          imagen: imagenLibre || null,
          imagen2: imagenLibre2 || null,
        };
      }
      if (tipoLibre.id !== 'combo' && descripLibre) {
        return {
          ...base,
          descripcion: descripLibre,
          dinamica: dinamicaLibre,
          precio: precioLibre || null,
          imagen: imagenLibre || null,
        };
      }
    }
    return null;
  })();

  const tabStyle = (activo) => ({
    padding: '0.55rem 1.4rem',
    border: 'none',
    borderBottom: activo ? '2px solid #6c63ff' : '2px solid transparent',
    background: 'none',
    color: activo ? '#a78bfa' : '#606070',
    fontWeight: activo ? 700 : 500,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
  });

  const hayPreview = datosCartel !== null;

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #2d2d3d', marginBottom: '1.2rem' }}>
        <button style={tabStyle(modo === 'activaciones')} onClick={() => setModo('activaciones')}>
          Mis Activaciones
        </button>
        <button style={tabStyle(modo === 'libre')} onClick={() => setModo('libre')}>
          Cartel Libre
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem' }}>

        {/* ── Panel izquierdo ── */}
        <div style={{ background: '#1a1a24', border: '1px solid #2d2d3d', borderRadius: 12, padding: '1.2rem', height: 'fit-content', maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>

          {/* ---- MODO ACTIVACIONES ---- */}
          {modo === 'activaciones' && (
            <>
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
                    borderRadius: 8, padding: '0.8rem', marginBottom: '0.6rem',
                    cursor: 'pointer', transition: 'all 0.2s',
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
            </>
          )}

          {/* ---- MODO LIBRE ---- */}
          {modo === 'libre' && (
            <>
              <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.8rem', fontSize: '0.95rem' }}>
                Tipo de cartel
              </h3>

              {/* Selector de tipo */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.2rem' }}>
                {TIPOS_LIBRES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => seleccionarTipoLibre(t)}
                    style={{
                      background: tipoLibre?.id === t.id ? `${t.color}25` : '#0f0f13',
                      border: `2px solid ${tipoLibre?.id === t.id ? t.color : '#2d2d3d'}`,
                      borderRadius: 8, padding: '0.65rem 0.9rem',
                      color: tipoLibre?.id === t.id ? '#fff' : '#9090a0',
                      fontWeight: tipoLibre?.id === t.id ? 700 : 500,
                      fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Campos del cartel libre */}
              {tipoLibre && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>

                  {/* Dinámica (editable, pre-cargada con el tipo) */}
                  <div>
                    <div className="form-label">Etiqueta / Dinámica</div>
                    <input
                      className="form-control"
                      type="text"
                      value={dinamicaLibre}
                      onChange={e => setDinamicaLibre(e.target.value)}
                      placeholder="Ej: SUPER PRECIOS"
                    />
                  </div>

                  {/* Descripción del producto */}
                  <div>
                    <div className="form-label">Producto / Descripción *</div>
                    <input
                      className="form-control"
                      type="text"
                      value={descripLibre}
                      onChange={e => setDescripLibre(e.target.value)}
                      placeholder="Ej: Coca-Cola 2,25L"
                    />
                  </div>

                  {/* Precio */}
                  <div>
                    <div className="form-label">Precio ($)</div>
                    <input
                      className="form-control"
                      type="number"
                      value={precioLibre}
                      onChange={e => setPrecioLibre(e.target.value)}
                      min="0"
                      placeholder="Ej: 1500"
                    />
                  </div>

                  {/* Foto producto 1 (o único) */}
                  <div>
                    <div className="form-label">{tipoLibre.id === 'combo' ? 'Foto producto 1' : 'Foto del producto'}</div>
                    <label style={{ cursor: 'pointer', background: '#0f0f13', border: '1px solid #2d2d3d', borderRadius: 6, padding: '0.4rem 0.8rem', color: '#9090a0', fontSize: '0.82rem', display: 'inline-block' }}>
                      {imagenLibre ? 'Cambiar foto' : 'Subir foto'}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImagenLibre} />
                    </label>
                  </div>

                  {/* Campos exclusivos del combo */}
                  {tipoLibre.id === 'combo' && (
                    <>
                      <div style={{ borderTop: '1px solid #2d2d3d', paddingTop: '0.8rem', marginTop: '0.2rem' }}>
                        <div className="form-label" style={{ color: '#a78bfa', marginBottom: '0.5rem' }}>Producto 2</div>
                        <div className="form-label">Nombre del producto 2</div>
                        <input
                          className="form-control"
                          type="text"
                          value={descripLibre2}
                          onChange={e => setDescripLibre2(e.target.value)}
                          placeholder="Ej: Fernet Branca"
                        />
                      </div>
                      <div>
                        <div className="form-label">Foto producto 2</div>
                        <label style={{ cursor: 'pointer', background: '#0f0f13', border: '1px solid #2d2d3d', borderRadius: 6, padding: '0.4rem 0.8rem', color: '#9090a0', fontSize: '0.82rem', display: 'inline-block' }}>
                          {imagenLibre2 ? 'Cambiar foto' : 'Subir foto'}
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImagenLibre2} />
                        </label>
                      </div>
                    </>
                  )}

                  {tipoLibre.id !== 'combo' && !descripLibre && (
                    <p style={{ color: '#606070', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                      Completá la descripción para ver el cartel.
                    </p>
                  )}
                  {tipoLibre.id === 'combo' && !descripLibre && !descripLibre2 && (
                    <p style={{ color: '#606070', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                      Completá al menos un producto para ver el cartel.
                    </p>
                  )}
                </div>
              )}

              {!tipoLibre && (
                <p style={{ color: '#606070', fontSize: '0.88rem' }}>
                  Seleccioná un tipo para empezar.
                </p>
              )}
            </>
          )}
        </div>

        {/* ── Panel derecho: cartel ── */}
        <div style={{ background: '#1a1a24', border: '1px solid #2d2d3d', borderRadius: 12, padding: '1.5rem' }}>
          {!hayPreview ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, color: '#606070', fontSize: '1rem' }}>
              {modo === 'activaciones'
                ? 'Seleccioná una activación para generar el cartel'
                : 'Seleccioná el tipo y completá la descripción'}
            </div>
          ) : (
            <>
              {/* Controles compartidos */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.2rem', alignItems: 'flex-end' }}>

                {/* Orientación (oculto en combo) */}
                {!(modo === 'libre' && tipoLibre?.id === 'combo') && (
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
                )}

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

                {/* Precio override solo en modo activaciones */}
                {modo === 'activaciones' && (
                  <>
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
                    <div>
                      <div className="form-label">Foto del producto</div>
                      <label style={{ cursor: 'pointer', background: '#0f0f13', border: '1px solid #2d2d3d', borderRadius: 6, padding: '0.4rem 0.8rem', color: '#9090a0', fontSize: '0.82rem', display: 'inline-block' }}>
                        {imagenCustom ? 'Cambiar foto' : 'Subir foto'}
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImagenAct} />
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Preview */}
              <div style={{ display: 'flex', justifyContent: 'center', background: '#2a2a38', borderRadius: 10, padding: '1.5rem', minHeight: 450 }}>
                {modo === 'libre' && tipoLibre?.id === 'combo'
                  ? <CartelCombo datos={datosCartel} />
                  : orientacion === 'horizontal'
                    ? <CartelHorizontal datos={datosCartel} />
                    : <CartelVertical datos={datosCartel} />
                }
              </div>

              {/* Exportar */}
              <BotonesExportarLocal
                orientacion={orientacion}
                esColor={esColor}
                activacionId={modo === 'activaciones' ? seleccionada?.id : null}
                descripcion={datosCartel.descripcion}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
