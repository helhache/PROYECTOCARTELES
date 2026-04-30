// Cartel horizontal: logo Coca-Cola izq, logo local der, contenido al centro
const LOGO_COCA = '/coca_cola_logo.png';

export default function CartelHorizontal({ datos }) {
  if (!datos) return null;

  const { descripcion, dinamica, precio, imagen, logoLocal, nombreLocal, esColor } = datos;

  const formatPrecio = (p) => {
    if (!p && p !== 0) return '$.............';
    return `$${Number(p).toLocaleString('es-AR')}`;
  };

  // En color: rojo. En B&N: negro puro. Sin filtro grayscale.
  const acento = esColor ? '#cc0000' : '#111111';

  return (
    <div
      id="preview-cartel"
      style={{
        width: 594,
        height: 420,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', 'Arial', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}
    >
      {/* Cabecera: logo Coca-Cola (izq) + logo local (der) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 20px 10px',
        borderBottom: `3px solid ${acento}`,
      }}>
        <img
          src={LOGO_COCA}
          alt="Coca-Cola"
          style={{ height: 56, objectFit: 'contain' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        {logoLocal ? (
          <img
            src={logoLocal}
            alt={nombreLocal}
            style={{ height: 64, objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div style={{
            width: 90, height: 64, background: '#e0e0e0', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', fontWeight: 700, color: '#666', textAlign: 'center', padding: 4,
          }}>
            {nombreLocal || 'LOCAL'}
          </div>
        )}
      </div>

      {/* Cuerpo: imagen izq + texto centro + imagen der */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        gap: 12,
      }}>
        {/* Imagen producto izquierda */}
        <div style={{ width: 140, height: 190, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {imagen ? (
            <img
              src={imagen}
              alt="Producto"
              style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.2))' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#ccc' }}>
              📦
            </div>
          )}
        </div>

        {/* Texto central */}
        <div style={{ flex: 1, textAlign: 'center', padding: '0 8px' }}>
          {dinamica && (
            <div style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: acento,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8,
            }}>
              {dinamica}
            </div>
          )}
          <div style={{
            fontSize: descripcion?.length > 50 ? '1.35rem' : '1.75rem',
            fontWeight: 900,
            color: '#1a1a1a',
            textTransform: 'uppercase',
            lineHeight: 1.15,
            marginBottom: 14,
          }}>
            {descripcion || 'NOMBRE DEL PRODUCTO'}
          </div>
          <div style={{
            fontSize: '2.8rem',
            fontWeight: 900,
            color: acento,
            lineHeight: 1,
          }}>
            {formatPrecio(precio)}
          </div>
        </div>

        {/* Imagen producto derecha */}
        <div style={{ width: 140, height: 190, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {imagen ? (
            <img
              src={imagen}
              alt="Producto"
              style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.2))' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#ccc' }}>
              📦
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
