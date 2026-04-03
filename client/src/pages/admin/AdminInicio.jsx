import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AdminInicio() {
  const [stats, setStats] = useState({ locales: 0, activaciones: 0, usuarios: 0, descargas: 0 });
  const [recientes, setRecientes] = useState([]);
  const [ultimasDescargas, setUltimasDescargas] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get('/api/locales'),
      axios.get('/api/activaciones'),
      axios.get('/api/usuarios'),
      axios.get('/api/asignaciones/log'),
    ]).then(([loc, act, usr, log]) => {
      setStats({
        locales: loc.data.length,
        activaciones: act.data.length,
        usuarios: usr.data.length,
        descargas: log.data.length,
      });
      // Últimas 8 activaciones (más recientes por fecha hasta)
      setRecientes([...act.data].sort((a, b) => new Date(b.hasta) - new Date(a.hasta)).slice(0, 8));
      // Últimas 6 descargas
      setUltimasDescargas(log.data.slice(0, 6));
    }).catch(() => {});
  }, []);

  const tarjetas = [
    { label: 'Locales', valor: stats.locales, link: '/admin/locales', color: '#6c63ff' },
    { label: 'Activaciones', valor: stats.activaciones, link: '/admin/activaciones', color: '#38a169' },
    { label: 'Usuarios', valor: stats.usuarios, link: '/admin/usuarios', color: '#e53e3e' },
    { label: 'Descargas', valor: stats.descargas, link: '/admin/log', color: '#dd6b20' },
  ];

  const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-AR') : '—';
  const formatPrecio = (p) => p != null ? `$${Number(p).toLocaleString('es-AR')}` : '—';
  const formatHora = (f) => f ? new Date(f).toLocaleString('es-AR') : '—';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        Panel de Administración
      </h2>

      {/* Tarjetas de estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {tarjetas.map(t => (
          <Link key={t.label} to={t.link} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#1a1a24', border: `1px solid ${t.color}40`, borderRadius: 12,
              padding: '1.5rem', textAlign: 'center', transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = t.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = `${t.color}40`}
            >
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: t.color }}>{t.valor}</div>
              <div style={{ color: '#9090a0', fontSize: '0.9rem', marginTop: '0.3rem' }}>{t.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Tabla: activaciones vigentes */}
        <div style={{ background: '#1a1a24', border: '1px solid #2d2d3d', borderRadius: 12, padding: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Activaciones recientes</h3>
            <Link to="/admin/activaciones" style={{ color: '#6c63ff', fontSize: '0.8rem', textDecoration: 'none' }}>Ver todas →</Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2d2d3d' }}>
                {['Descripción', 'Dinámica', 'Hasta', 'Precio'].map(h => (
                  <th key={h} style={{ padding: '0.5rem 0.6rem', textAlign: 'left', color: '#9090a0', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recientes.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid #12121a' }}>
                  <td style={{ padding: '0.5rem 0.6rem', color: '#fff', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.descripcion}</td>
                  <td style={{ padding: '0.5rem 0.6rem' }}>
                    <span style={{ background: '#6c63ff20', color: '#a78bfa', padding: '1px 6px', borderRadius: 3, fontWeight: 700, fontSize: '0.72rem' }}>{a.dinamica || '—'}</span>
                  </td>
                  <td style={{ padding: '0.5rem 0.6rem', color: '#9090a0', whiteSpace: 'nowrap' }}>{formatFecha(a.hasta)}</td>
                  <td style={{ padding: '0.5rem 0.6rem', color: '#38a169', fontWeight: 700 }}>{formatPrecio(a.precio_oferta)}</td>
                </tr>
              ))}
              {recientes.length === 0 && (
                <tr><td colSpan={4} style={{ padding: '1rem', color: '#606070', textAlign: 'center' }}>
                  Sin activaciones. <Link to="/admin/activaciones" style={{ color: '#6c63ff' }}>Importar Excel</Link>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tabla: últimas descargas */}
        <div style={{ background: '#1a1a24', border: '1px solid #2d2d3d', borderRadius: 12, padding: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Últimas descargas</h3>
            <Link to="/admin/log" style={{ color: '#6c63ff', fontSize: '0.8rem', textDecoration: 'none' }}>Ver todas →</Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2d2d3d' }}>
                {['Local', 'Activación', 'Tipo', 'Fecha'].map(h => (
                  <th key={h} style={{ padding: '0.5rem 0.6rem', textAlign: 'left', color: '#9090a0', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ultimasDescargas.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid #12121a' }}>
                  <td style={{ padding: '0.5rem 0.6rem', color: '#6c63ff', fontWeight: 700 }}>{d.local_nombre}</td>
                  <td style={{ padding: '0.5rem 0.6rem', color: '#9090a0', maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.activacion || '—'}</td>
                  <td style={{ padding: '0.5rem 0.6rem' }}>
                    <span style={{ background: d.tipo_exportacion === 'PDF' ? '#e53e3e20' : '#38a16920', color: d.tipo_exportacion === 'PDF' ? '#fc8181' : '#68d391', padding: '1px 6px', borderRadius: 3, fontWeight: 700, fontSize: '0.72rem' }}>
                      {d.tipo_exportacion}
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem 0.6rem', color: '#9090a0', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>{formatHora(d.created_at)}</td>
                </tr>
              ))}
              {ultimasDescargas.length === 0 && (
                <tr><td colSpan={4} style={{ padding: '1rem', color: '#606070', textAlign: 'center' }}>Sin descargas aún.</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
