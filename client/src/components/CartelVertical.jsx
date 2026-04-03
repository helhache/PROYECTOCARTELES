// Cartel vertical: mantiene el modelo actual pero adaptado a las activaciones
const LOGO_COCA = '/uploads/logos/coca_cola_logo.png';

export default function CartelVertical({ datos }) {
  if (!datos) return null;

  const { descripcion, dinamica, precio, imagen, logoLocal, nombreLocal, esColor } = datos;

  const formatPrecio = (p) => {
    if (!p && p !== 0) return '$.............';
    return `$${Number(p).toLocaleString('es-AR')}`;
  };

  const filtroGris = esColor ? 'none' : 'grayscale(100%)';

  return (
    <div
      id="preview-cartel"
      style={{
        width: 420,
        height: 594,
        background: esColor ? '#cc0000' : '#888',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', 'Arial', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        filter: filtroGris,
      }}
    >
      {/* Cabecera */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: 'rgba(0,0,0,0.2)',
      }}>
        <img
          src={LOGO_COCA}
          alt="Coca-Cola"
          style={{ height: 50, objectFit: 'contain' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        {logoLocal ? (
          <img
            src={logoLocal}
            alt={nombreLocal}
            style={{ height: 60, objectFit: 'contain' }}
          />
        ) : (
          <div style={{
            width: 80, height: 60, background: 'rgba(255,255,255,0.2)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', fontWeight: 700, color: '#fff', textAlign: 'center',
          }}>
            {nombreLocal || 'LOCAL'}
          </div>
        )}
      </div>

      {/* Imagen producto */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 20px' }}>
        {imagen ? (
          <img src={imagen} alt="Producto" style={{ maxHeight: 200, maxWidth: '80%', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }} />
        ) : (
          <div style={{ width: 140, height: 180, background: 'rgba(255,255,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>📦</div>
        )}
      </div>

      {/* Texto */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 24px', textAlign: 'center' }}>
        {dinamica && (
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {dinamica}
          </div>
        )}
        <div style={{
          fontSize: descripcion?.length > 50 ? '1.1rem' : '1.4rem',
          fontWeight: 900, color: '#fff', textTransform: 'uppercase', lineHeight: 1.2, marginBottom: 16,
        }}>
          {descripcion || 'NOMBRE DEL PRODUCTO'}
        </div>
        <div style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', lineHeight: 1, textShadow: '2px 2px 8px rgba(0,0,0,0.4)' }}>
          {formatPrecio(precio)}
        </div>
      </div>
    </div>
  );
}
