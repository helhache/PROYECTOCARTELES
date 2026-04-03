import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminAsignaciones() {
  const [locales, setLocales] = useState([]);
  const [activaciones, setActivaciones] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [localFiltro, setLocalFiltro] = useState('');
  const [modal, setModal] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Selección múltiple
  const [localesSel, setLocalesSel] = useState([]);   // ids seleccionados
  const [actsSel, setActsSel] = useState([]);          // ids seleccionados
  const [busAct, setBusAct] = useState('');
  const [busLoc, setBusLoc] = useState('');
  const [todosLoc, setTodosLoc] = useState(false);
  const [todasAct, setTodasAct] = useState(false);

  const cargar = async () => {
    const [loc, act, asi] = await Promise.all([
      axios.get('/api/locales'),
      axios.get('/api/activaciones'),
      axios.get('/api/asignaciones'),
    ]);
    setLocales(loc.data);
    setActivaciones(act.data);
    setAsignaciones(asi.data);
  };

  useEffect(() => { cargar(); }, []);

  const abrirModal = () => {
    setLocalesSel([]); setActsSel([]); setBusAct(''); setBusLoc('');
    setTodosLoc(false); setTodasAct(false);
    setError(''); setMsg(''); setModal(true);
  };

  // Toggle "seleccionar todos" locales
  const toggleTodosLoc = () => {
    if (!todosLoc) {
      setLocalesSel(localesFilt.map(l => l.id));
      setTodosLoc(true);
    } else {
      setLocalesSel([]);
      setTodosLoc(false);
    }
  };

  // Toggle "seleccionar todas" activaciones
  const toggleTodasAct = () => {
    if (!todasAct) {
      setActsSel(actsFilt.map(a => a.id));
      setTodasAct(true);
    } else {
      setActsSel([]);
      setTodasAct(false);
    }
  };

  const toggleLocal = (id) => {
    setLocalesSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    setTodosLoc(false);
  };

  const toggleAct = (id) => {
    setActsSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    setTodasAct(false);
  };

  const asignar = async () => {
    setError(''); setMsg('');
    if (!localesSel.length) return setError('Seleccioná al menos un local');
    if (!actsSel.length) return setError('Seleccioná al menos una activación');
    setGuardando(true);
    try {
      const { data } = await axios.post('/api/asignaciones/bulk', {
        local_ids: localesSel,
        activacion_ids: actsSel,
      });
      setMsg(data.mensaje);
      cargar();
      setLocalesSel([]); setActsSel([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al asignar');
    } finally {
      setGuardando(false);
    }
  };

  const quitar = async (id) => {
    if (!confirm('¿Quitar esta asignación?')) return;
    await axios.delete(`/api/asignaciones/${id}`);
    cargar();
  };

  const localesFilt = locales.filter(l => l.nombre.toLowerCase().includes(busLoc.toLowerCase()));
  const actsFilt = activaciones.filter(a =>
    a.descripcion.toLowerCase().includes(busAct.toLowerCase()) ||
    (a.dinamica || '').toLowerCase().includes(busAct.toLowerCase())
  );
  const asiMostradas = asignaciones.filter(a => !localFiltro || a.local_id === parseInt(localFiltro));

  const formatPrecio = (p) => p != null ? `$${Number(p).toLocaleString('es-AR')}` : '—';
  const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-AR') : '—';

  const checkStyle = (sel) => ({
    background: sel ? '#6c63ff15' : '#0f0f13',
    border: `1px solid ${sel ? '#6c63ff' : '#2d2d3d'}`,
    borderRadius: 6, padding: '0.4rem 0.6rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem',
    color: sel ? '#a78bfa' : '#9090a0', marginBottom: '0.3rem',
    transition: 'all 0.15s',
  });

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h2 className="gestion-titulo">Asignaciones</h2>
        <button className="btn-nuevo" onClick={abrirModal}>+ Asignar activaciones</button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <select className="form-control" style={{ maxWidth: 250 }} value={localFiltro} onChange={e => setLocalFiltro(e.target.value)}>
          <option value="">Todos los locales</option>
          {locales.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2d2d3d' }}>
              {['Local', 'Activación', 'Dinámica', 'Desde', 'Hasta', 'P. Oferta', 'P. Personalizado', ''].map(h => (
                <th key={h} style={{ padding: '0.6rem 0.8rem', textAlign: 'left', color: '#9090a0', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {asiMostradas.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid #1a1a24' }}>
                <td style={{ padding: '0.6rem 0.8rem', color: '#6c63ff', fontWeight: 700 }}>{a.local_nombre}</td>
                <td style={{ padding: '0.6rem 0.8rem', color: '#fff', maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.descripcion}</td>
                <td style={{ padding: '0.6rem 0.8rem', color: '#a78bfa', fontWeight: 700, fontSize: '0.78rem' }}>{a.dinamica || '—'}</td>
                <td style={{ padding: '0.6rem 0.8rem', color: '#9090a0', whiteSpace: 'nowrap' }}>{formatFecha(a.desde)}</td>
                <td style={{ padding: '0.6rem 0.8rem', color: '#9090a0', whiteSpace: 'nowrap' }}>{formatFecha(a.hasta)}</td>
                <td style={{ padding: '0.6rem 0.8rem', color: '#38a169', fontWeight: 700 }}>{formatPrecio(a.precio_oferta)}</td>
                <td style={{ padding: '0.6rem 0.8rem', color: '#dd6b20' }}>{formatPrecio(a.precio_personalizado)}</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>
                  <button className="btn-eliminar" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} onClick={() => quitar(a.id)}>
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {asiMostradas.length === 0 && <p className="msg-vacio">No hay asignaciones para este filtro.</p>}
      </div>

      {/* Modal asignación masiva */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 780, width: '95vw' }}>
            <h3 className="modal-titulo">Asignar activaciones a locales</h3>

            {error && <div className="msg-error">{error}</div>}
            {msg && (
              <div style={{ background: '#38a16920', border: '1px solid #38a16940', color: '#68d391', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.9rem' }}>
                {msg}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

              {/* Locales */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Locales ({localesSel.length}/{locales.length})</label>
                  <button onClick={toggleTodosLoc} style={{ background: 'none', border: '1px solid #6c63ff', color: '#a78bfa', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>
                    {todosLoc ? 'Deseleccionar todos' : 'Seleccionar todos'}
                  </button>
                </div>
                <input className="form-control" style={{ marginBottom: '0.5rem' }} placeholder="Buscar local..." value={busLoc} onChange={e => setBusLoc(e.target.value)} />
                <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                  {localesFilt.map(l => {
                    const sel = localesSel.includes(l.id);
                    return (
                      <div key={l.id} style={checkStyle(sel)} onClick={() => toggleLocal(l.id)}>
                        <div style={{ width: 16, height: 16, border: `2px solid ${sel ? '#6c63ff' : '#4d4d5d'}`, borderRadius: 3, background: sel ? '#6c63ff' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {sel && <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 900 }}>✓</span>}
                        </div>
                        {l.nombre}
                      </div>
                    );
                  })}
                  {localesFilt.length === 0 && <p style={{ color: '#606070', fontSize: '0.82rem' }}>Sin resultados</p>}
                </div>
              </div>

              {/* Activaciones */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Activaciones ({actsSel.length}/{activaciones.length})</label>
                  <button onClick={toggleTodasAct} style={{ background: 'none', border: '1px solid #6c63ff', color: '#a78bfa', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>
                    {todasAct ? 'Deseleccionar todas' : 'Seleccionar todas'}
                  </button>
                </div>
                <input className="form-control" style={{ marginBottom: '0.5rem' }} placeholder="Buscar activación..." value={busAct} onChange={e => setBusAct(e.target.value)} />
                <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                  {actsFilt.map(a => {
                    const sel = actsSel.includes(a.id);
                    return (
                      <div key={a.id} style={checkStyle(sel)} onClick={() => toggleAct(a.id)}>
                        <div style={{ width: 16, height: 16, border: `2px solid ${sel ? '#6c63ff' : '#4d4d5d'}`, borderRadius: 3, background: sel ? '#6c63ff' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {sel && <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 900 }}>✓</span>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.descripcion}</div>
                          <div style={{ color: '#606070', fontSize: '0.72rem' }}>{a.dinamica} — ${a.precio_oferta}</div>
                        </div>
                      </div>
                    );
                  })}
                  {actsFilt.length === 0 && <p style={{ color: '#606070', fontSize: '0.82rem' }}>Sin resultados</p>}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#0f0f13', borderRadius: 8, fontSize: '0.85rem', color: '#9090a0' }}>
              Se crearán <strong style={{ color: '#fff' }}>{localesSel.length * actsSel.length}</strong> asignaciones
              ({localesSel.length} local{localesSel.length !== 1 ? 'es' : ''} × {actsSel.length} activaci{actsSel.length !== 1 ? 'ones' : 'ón'})
            </div>

            <div className="modal-actions">
              <button className="btn-guardar" onClick={asignar} disabled={guardando}>
                {guardando ? 'Asignando...' : 'Asignar'}
              </button>
              <button className="btn-cancelar" onClick={() => setModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
