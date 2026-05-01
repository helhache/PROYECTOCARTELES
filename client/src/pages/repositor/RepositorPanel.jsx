import { useState } from 'react';

// ── Datos estáticos para la presentación ──────────────────────────────────────

const ACTIVACIONES_DEMO = [
  { id: 1, descripcion: 'Coca-Cola 500ml PET', dinamica: 'SUPER PRECIOS', precio_sugerido: 850, precio_oferta: 750, desde: '2026-05-01', hasta: '2026-05-31', ejecutada: false },
  { id: 2, descripcion: 'Sprite 1.5L', dinamica: 'PROMO DEL MES', precio_sugerido: 1200, precio_oferta: 1050, desde: '2026-05-01', hasta: '2026-05-31', ejecutada: true },
  { id: 3, descripcion: 'Fanta Naranja 2.25L', dinamica: '2x1', precio_sugerido: 1800, precio_oferta: null, desde: '2026-05-01', hasta: '2026-05-15', ejecutada: false },
  { id: 4, descripcion: 'Powerade Uva 500ml', dinamica: 'DESCUENTO', precio_sugerido: 950, precio_oferta: 850, desde: '2026-05-01', hasta: '2026-05-31', ejecutada: true },
  { id: 5, descripcion: 'Dasani 600ml', dinamica: 'ACTIVACIÓN MAYO', precio_sugerido: 600, precio_oferta: 550, desde: '2026-05-01', hasta: '2026-05-31', ejecutada: false },
  { id: 6, descripcion: 'Coca-Cola 3L PET', dinamica: 'ZONA DE AHORRO', precio_sugerido: 2400, precio_oferta: 2100, desde: '2026-05-01', hasta: '2026-05-31', ejecutada: false },
];

const PEDIDOS_DEMO = [
  {
    id: 1,
    fecha_carga: '2026-04-28',
    fecha_ingreso: '2026-04-30',
    estado: 'Recibido',
    items: [
      { producto: 'Coca-Cola 3L PET', cantidad: 24, unidad: 'Unidades' },
      { producto: 'Sprite 1.5L', cantidad: 12, unidad: 'Unidades' },
      { producto: 'Fanta Naranja 2.25L', cantidad: 6, unidad: 'Unidades' },
      { producto: 'Powerade Uva 500ml', cantidad: 1, unidad: 'Fardo' },
    ],
  },
  {
    id: 2,
    fecha_carga: '2026-04-21',
    fecha_ingreso: '2026-04-23',
    estado: 'Recibido',
    items: [
      { producto: 'Coca-Cola 500ml PET', cantidad: 48, unidad: 'Unidades' },
      { producto: 'Aquarius Naranja 1L', cantidad: 24, unidad: 'Unidades' },
      { producto: 'Dasani 600ml', cantidad: 2, unidad: 'Fardos' },
    ],
  },
];

const RECLAMOS_DEMO = [
  { id: 1, mensaje: 'Falta el cartel de Sprite en la góndola principal', fecha: '2026-04-29', foto: false },
];

// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'activaciones', label: 'Activaciones' },
  { id: 'pedidos',      label: 'Pedidos' },
  { id: 'reclamos',     label: 'Reclamos' },
  { id: 'volumen',      label: 'Volumen' },
  { id: 'cambios',      label: 'Cambios' },
];

const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-AR') : '—';
const formatPrecio = (p) => p != null ? `$${Number(p).toLocaleString('es-AR')}` : '—';

export default function RepositorPanel() {
  const [tab, setTab] = useState('activaciones');
  const [activaciones, setActivaciones] = useState(ACTIVACIONES_DEMO);
  const [reclamos, setReclamos] = useState(RECLAMOS_DEMO);
  const [msgReclamo, setMsgReclamo] = useState('');
  const [fotoReclamo, setFotoReclamo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [msgExito, setMsgExito] = useState('');

  const tabStyle = (activo) => ({
    padding: '0.6rem 1.4rem',
    border: 'none',
    borderBottom: activo ? '2px solid #6c63ff' : '2px solid transparent',
    background: 'none',
    color: activo ? '#a78bfa' : '#606070',
    fontWeight: activo ? 700 : 500,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  });

  const toggleEjecutada = (id) => {
    setActivaciones(prev =>
      prev.map(a => a.id === id ? { ...a, ejecutada: !a.ejecutada } : a)
    );
  };

  const enviarReclamo = () => {
    if (!msgReclamo.trim()) return;
    setEnviando(true);
    setTimeout(() => {
      setReclamos(prev => [{
        id: Date.now(),
        mensaje: msgReclamo,
        fecha: new Date().toISOString().split('T')[0],
        foto: !!fotoReclamo,
      }, ...prev]);
      setMsgReclamo('');
      setFotoReclamo(null);
      setMsgExito('Reclamo enviado al administrador.');
      setEnviando(false);
      setTimeout(() => setMsgExito(''), 3000);
    }, 800);
  };

  const ejecutadas = activaciones.filter(a => a.ejecutada).length;
  const pendientes = activaciones.filter(a => !a.ejecutada).length;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #2d2d3d', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.id} style={tabStyle(tab === t.id)} onClick={() => setTab(t.id)}>
            {t.label}
            {t.id === 'activaciones' && pendientes > 0 && (
              <span style={{ marginLeft: 6, background: '#e53e3e', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: '0.7rem', fontWeight: 700 }}>
                {pendientes}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB ACTIVACIONES ── */}
      {tab === 'activaciones' && (
        <div>
          {/* Mensaje del admin */}
          <div style={{ background: '#6c63ff15', border: '1px solid #6c63ff40', borderRadius: 10, padding: '0.9rem 1.2rem', marginBottom: '1.2rem', display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.1rem' }}>📢</span>
            <div>
              <div style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.2rem' }}>Mensaje del Administrador</div>
              <div style={{ color: '#d0d0e0', fontSize: '0.88rem' }}>Recordá ejecutar todas las promos de Mayo antes del 5. Cualquier problema usá el módulo de Reclamos.</div>
            </div>
          </div>

          {/* Resumen */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginBottom: '1.2rem' }}>
            {[
              { label: 'Total', valor: activaciones.length, color: '#6c63ff' },
              { label: 'Ejecutadas', valor: ejecutadas, color: '#38a169' },
              { label: 'Pendientes', valor: pendientes, color: '#e53e3e' },
            ].map(s => (
              <div key={s.label} style={{ background: '#1a1a24', border: `1px solid ${s.color}30`, borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color }}>{s.valor}</div>
                <div style={{ color: '#9090a0', fontSize: '0.82rem', marginTop: '0.2rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabla */}
          <div style={{ background: '#1a1a24', border: '1px solid #2d2d3d', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2d2d3d' }}>
                    {['Descripción', 'Dinámica', 'P. Sugerido', 'P. Oferta', 'Vigencia', '¿Ejecutada?'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#9090a0', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activaciones.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #1a1a24', background: a.ejecutada ? '#38a16908' : 'transparent' }}>
                      <td style={{ padding: '0.75rem 1rem', color: '#fff', fontWeight: 600 }}>{a.descripcion}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ background: '#6c63ff20', color: '#a78bfa', padding: '2px 8px', borderRadius: 4, fontWeight: 700, fontSize: '0.75rem' }}>
                          {a.dinamica}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#fbbf24', fontWeight: 700 }}>{formatPrecio(a.precio_sugerido)}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#38a169', fontWeight: 700 }}>{formatPrecio(a.precio_oferta)}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#9090a0', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                        {formatFecha(a.desde)} — {formatFecha(a.hasta)}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <button
                          onClick={() => toggleEjecutada(a.id)}
                          style={{
                            padding: '0.35rem 1rem',
                            border: 'none',
                            borderRadius: 20,
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: a.ejecutada ? '#38a169' : '#2d2d3d',
                            color: a.ejecutada ? '#fff' : '#9090a0',
                          }}
                        >
                          {a.ejecutada ? '✓ Sí' : 'No'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB PEDIDOS ── */}
      {tab === 'pedidos' && (
        <div>
          <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>
            Últimos pedidos recibidos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {PEDIDOS_DEMO.map((p, idx) => (
              <div key={p.id} style={{ background: '#1a1a24', border: '1px solid #2d2d3d', borderRadius: 12, overflow: 'hidden' }}>
                {/* Header del pedido */}
                <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #2d2d3d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: '#9090a0', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Pedido #{idx + 1}</div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Carga: {formatFecha(p.fecha_carga)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#9090a0', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Ingreso</div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{formatFecha(p.fecha_ingreso)}</div>
                    </div>
                  </div>
                  <span style={{ background: '#38a16920', color: '#68d391', padding: '0.3rem 0.8rem', borderRadius: 20, fontWeight: 700, fontSize: '0.78rem' }}>
                    {p.estado}
                  </span>
                </div>
                {/* Items */}
                <div style={{ padding: '0.8rem 1.2rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left', color: '#9090a0', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>Producto</th>
                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: '#9090a0', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>Cantidad</th>
                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left', color: '#9090a0', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>Unidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.items.map((item, i) => (
                        <tr key={i} style={{ borderTop: '1px solid #2d2d3d' }}>
                          <td style={{ padding: '0.5rem 0.6rem', color: '#fff' }}>{item.producto}</td>
                          <td style={{ padding: '0.5rem 0.6rem', color: '#6c63ff', fontWeight: 700, textAlign: 'right' }}>{item.cantidad}</td>
                          <td style={{ padding: '0.5rem 0.6rem', color: '#9090a0' }}>{item.unidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB RECLAMOS ── */}
      {tab === 'reclamos' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Formulario */}
          <div style={{ background: '#1a1a24', border: '1px solid #2d2d3d', borderRadius: 12, padding: '1.5rem' }}>
            <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>Nuevo reclamo</h3>
            <p style={{ color: '#9090a0', fontSize: '0.83rem', marginBottom: '1.2rem' }}>
              Enviá un mensaje al administrador con o sin foto del problema.
            </p>

            {msgExito && (
              <div style={{ background: '#38a16920', border: '1px solid #38a16940', color: '#68d391', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.88rem' }}>
                {msgExito}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Mensaje</label>
              <textarea
                className="form-control"
                rows={4}
                maxLength={300}
                placeholder="Ej: Falta el cartel de Sprite en la góndola..."
                value={msgReclamo}
                onChange={e => setMsgReclamo(e.target.value)}
                style={{ resize: 'vertical' }}
              />
              <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#606070', marginTop: '0.2rem' }}>{msgReclamo.length}/300</div>
            </div>

            <div className="form-group">
              <label className="form-label">Foto (opcional)</label>
              <label style={{ cursor: 'pointer', background: '#0f0f13', border: '1px solid #2d2d3d', borderRadius: 6, padding: '0.5rem 1rem', color: fotoReclamo ? '#68d391' : '#9090a0', fontSize: '0.85rem', display: 'inline-block' }}>
                {fotoReclamo ? `📷 ${fotoReclamo.name}` : '📷 Adjuntar foto'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setFotoReclamo(e.target.files[0] || null)} />
              </label>
            </div>

            <button
              onClick={enviarReclamo}
              disabled={enviando || !msgReclamo.trim()}
              style={{
                width: '100%',
                background: (!msgReclamo.trim() || enviando) ? '#2d2d3d' : '#6c63ff',
                color: (!msgReclamo.trim() || enviando) ? '#606070' : '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '0.75rem',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: (!msgReclamo.trim() || enviando) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: '0.5rem',
              }}
            >
              {enviando ? 'Enviando...' : 'Enviar reclamo'}
            </button>
          </div>

          {/* Historial */}
          <div style={{ background: '#1a1a24', border: '1px solid #2d2d3d', borderRadius: 12, padding: '1.5rem' }}>
            <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Historial</h3>
            {reclamos.length === 0 ? (
              <p style={{ color: '#606070', fontSize: '0.88rem' }}>Sin reclamos enviados.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {reclamos.map(r => (
                  <div key={r.id} style={{ background: '#0f0f13', border: '1px solid #2d2d3d', borderRadius: 8, padding: '0.8rem 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ color: '#9090a0', fontSize: '0.75rem' }}>{formatFecha(r.fecha)}</span>
                      {r.foto && <span style={{ color: '#a78bfa', fontSize: '0.75rem' }}>📷 Con foto</span>}
                    </div>
                    <p style={{ color: '#d0d0e0', fontSize: '0.85rem', margin: 0 }}>{r.mensaje}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB VOLUMEN ── */}
      {tab === 'volumen' && (
        <Proximamente
          titulo="Volumen del Local"
          descripcion="Acá vas a poder ver el volumen semanal y mensual, el objetivo pactado, y los productos que no se vienen pidiendo. Los datos van a ser cargados por el administrador."
        />
      )}

      {/* ── TAB CAMBIOS ── */}
      {tab === 'cambios' && (
        <Proximamente
          titulo="Cambios de Mercadería"
          descripcion="Este módulo va a permitir registrar cambios de mercadería defectuosa: código del producto, local, fecha, motivo del cambio, código del vendedor y repositor responsable."
        />
      )}

    </div>
  );
}

function Proximamente({ titulo, descripcion }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 340, textAlign: 'center' }}>
      <div style={{ background: '#1a1a24', border: '1px solid #2d2d3d', borderRadius: 16, padding: '3rem 2.5rem', maxWidth: 500 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚧</div>
        <div style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 2, marginBottom: '0.5rem' }}>
          Próximamente
        </div>
        <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.8rem' }}>{titulo}</h3>
        <p style={{ color: '#9090a0', fontSize: '0.88rem', lineHeight: 1.6 }}>{descripcion}</p>
      </div>
    </div>
  );
}
