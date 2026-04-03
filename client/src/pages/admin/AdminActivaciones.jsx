import { useEffect, useState } from 'react';
import axios from 'axios';

// Filtros por columna — value vacío = sin filtro
const FILTROS_INIT = { descripcion: '', dinamica: '', tipo: '', desde: '', hasta: '' };

export default function AdminActivaciones() {
  const [activaciones, setActivaciones] = useState([]);
  const [importando, setImportando] = useState(false);
  const [msgImport, setMsgImport] = useState('');
  const [filtros, setFiltros] = useState(FILTROS_INIT);

  const cargar = async () => {
    const { data } = await axios.get('/api/activaciones');
    setActivaciones(data);
  };

  useEffect(() => { cargar(); }, []);

  const importarExcel = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setImportando(true);
    setMsgImport('');
    const fd = new FormData();
    fd.append('excel', archivo);
    try {
      const { data } = await axios.post('/api/activaciones/importar-excel', fd);
      setMsgImport(`Importadas: ${data.insertadas} | Omitidas: ${data.omitidas}`);
      cargar();
    } catch (err) {
      setMsgImport('Error: ' + (err.response?.data?.error || 'fallo al importar'));
    } finally {
      setImportando(false);
      e.target.value = '';
    }
  };

  const desactivar = async (id) => {
    if (!confirm('¿Desactivar esta activación?')) return;
    await axios.delete(`/api/activaciones/${id}`);
    cargar();
  };

  const setFiltro = (col, val) => setFiltros(p => ({ ...p, [col]: val }));

  // Valores únicos para dropdowns de columnas
  const unico = (col) => [...new Set(activaciones.map(a => a[col]).filter(Boolean))].sort();

  const filtradas = activaciones.filter(a => {
    if (filtros.descripcion && !a.descripcion.toLowerCase().includes(filtros.descripcion.toLowerCase())) return false;
    if (filtros.dinamica && a.dinamica !== filtros.dinamica) return false;
    if (filtros.tipo && a.tipo !== filtros.tipo) return false;
    if (filtros.desde && a.desde && a.desde < filtros.desde) return false;
    if (filtros.hasta && a.hasta && a.hasta > filtros.hasta) return false;
    return true;
  });

  const hayFiltros = Object.values(filtros).some(v => v !== '');
  const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-AR') : '—';
  const formatPrecio = (p) => p != null ? `$${Number(p).toLocaleString('es-AR')}` : '—';

  const thStyle = { padding: '0.5rem 0.8rem', textAlign: 'left', color: '#9090a0', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' };
  const inputFiltro = { background: '#0f0f13', border: '1px solid #2d2d3d', borderRadius: 4, color: '#e0e0e0', padding: '0.25rem 0.4rem', fontSize: '0.75rem', width: '100%', outline: 'none' };

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h2 className="gestion-titulo">Activaciones ({filtradas.length}/{activaciones.length})</h2>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {hayFiltros && (
            <button onClick={() => setFiltros(FILTROS_INIT)} style={{ background: '#2d2d3d', border: 'none', color: '#a0a0b0', borderRadius: 6, padding: '0.5rem 0.8rem', cursor: 'pointer', fontSize: '0.82rem' }}>
              ✕ Limpiar filtros
            </button>
          )}
          <label style={{
            background: '#38a169', color: '#fff', border: 'none', borderRadius: 8,
            padding: '0.6rem 1.2rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
            opacity: importando ? 0.7 : 1,
          }}>
            {importando ? 'Importando...' : '↑ Importar Excel'}
            <input type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={importarExcel} disabled={importando} />
          </label>
        </div>
      </div>

      {msgImport && (
        <div style={{
          background: msgImport.startsWith('Error') ? '#e53e3e20' : '#38a16920',
          border: `1px solid ${msgImport.startsWith('Error') ? '#e53e3e40' : '#38a16940'}`,
          color: msgImport.startsWith('Error') ? '#fc8181' : '#68d391',
          padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.9rem',
        }}>
          {msgImport}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            {/* Fila de encabezados */}
            <tr style={{ borderBottom: '1px solid #2d2d3d' }}>
              <th style={thStyle}>Descripción</th>
              <th style={thStyle}>Dinámica</th>
              <th style={thStyle}>Tipo</th>
              <th style={thStyle}>Desde</th>
              <th style={thStyle}>Hasta</th>
              <th style={thStyle}>P. Sugerido</th>
              <th style={thStyle}>P. Oferta</th>
              <th style={thStyle}>Dcto</th>
              <th style={thStyle}></th>
            </tr>
            {/* Fila de filtros */}
            <tr style={{ borderBottom: '1px solid #2d2d3d', background: '#0f0f1a' }}>
              <td style={{ padding: '0.3rem 0.8rem' }}>
                <input style={inputFiltro} placeholder="Filtrar..." value={filtros.descripcion} onChange={e => setFiltro('descripcion', e.target.value)} />
              </td>
              <td style={{ padding: '0.3rem 0.8rem' }}>
                <select style={inputFiltro} value={filtros.dinamica} onChange={e => setFiltro('dinamica', e.target.value)}>
                  <option value="">Todas</option>
                  {unico('dinamica').map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </td>
              <td style={{ padding: '0.3rem 0.8rem' }}>
                <select style={inputFiltro} value={filtros.tipo} onChange={e => setFiltro('tipo', e.target.value)}>
                  <option value="">Todos</option>
                  {unico('tipo').map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </td>
              <td style={{ padding: '0.3rem 0.8rem' }}>
                <input style={inputFiltro} type="date" value={filtros.desde} onChange={e => setFiltro('desde', e.target.value)} />
              </td>
              <td style={{ padding: '0.3rem 0.8rem' }}>
                <input style={inputFiltro} type="date" value={filtros.hasta} onChange={e => setFiltro('hasta', e.target.value)} />
              </td>
              <td colSpan={4} style={{ padding: '0.3rem 0.8rem', color: '#606070', fontSize: '0.75rem' }}>
                {filtradas.length} resultado{filtradas.length !== 1 ? 's' : ''}
              </td>
            </tr>
          </thead>
          <tbody>
            {filtradas.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid #1a1a24' }}>
                <td style={{ padding: '0.6rem 0.8rem', color: '#fff', maxWidth: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.descripcion}</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>
                  <span style={{ background: '#6c63ff20', color: '#a78bfa', padding: '2px 8px', borderRadius: 4, fontWeight: 700, fontSize: '0.78rem' }}>
                    {a.dinamica || '—'}
                  </span>
                </td>
                <td style={{ padding: '0.6rem 0.8rem', color: '#9090a0' }}>{a.tipo}</td>
                <td style={{ padding: '0.6rem 0.8rem', color: '#9090a0', whiteSpace: 'nowrap' }}>{formatFecha(a.desde)}</td>
                <td style={{ padding: '0.6rem 0.8rem', color: '#9090a0', whiteSpace: 'nowrap' }}>{formatFecha(a.hasta)}</td>
                <td style={{ padding: '0.6rem 0.8rem', color: '#9090a0' }}>{formatPrecio(a.precio_sugerido)}</td>
                <td style={{ padding: '0.6rem 0.8rem', color: '#38a169', fontWeight: 700 }}>{formatPrecio(a.precio_oferta)}</td>
                <td style={{ padding: '0.6rem 0.8rem', color: '#9090a0' }}>
                  {a.dcto != null ? `${Math.round(Math.abs(a.dcto) * 100)}%` : '—'}
                </td>
                <td style={{ padding: '0.6rem 0.8rem' }}>
                  <button className="btn-eliminar" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} onClick={() => desactivar(a.id)}>
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtradas.length === 0 && (
          <p className="msg-vacio">
            {activaciones.length === 0 ? 'No hay activaciones. Importá el Excel del jefe.' : 'Ninguna activación coincide con los filtros.'}
          </p>
        )}
      </div>
    </div>
  );
}
