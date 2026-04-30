const LOGO_COCA = '/coca_cola_logo.png';

export default function CartelVertical({ datos }) {
  if (!datos) return null;

  const { descripcion, dinamica, precio, imagen, logoLocal, nombreLocal, esColor } = datos;

  const formatPrecio = (p) => {
    if (!p && p !== 0) return '$.............';
    return `$${Number(p).toLocaleString('es-AR')}`;
  };

  // En color: rojo. En B&N: negro puro. Sin filtro grayscale.
  const acento = esColor ? '#cc0000' : '#111111';
  const textoOscuro = '#1a1a1a';

  return (
    <div
      id="preview-cartel"
      style={{
        width: 420,
        height: 594,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', 'Arial', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}
    >
      {/* Cabecera con logos */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 20px',
        background: '#ffffff',
        borderBottom: `3px solid ${acento}`,
      }}>
        <img
          src={LOGO_COCA}
          alt="Coca-Cola"
          style={{ height: 52, objectFit: 'contain' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        {logoLocal ? (
          <img
            src={logoLocal}
            alt={nombreLocal}
            style={{ height: 62, objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div style={{
            width: 80, height: 60, background: '#e0e0e0', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', fontWeight: 700, color: '#666', textAlign: 'center',
          }}>
            {nombreLocal || 'LOCAL'}
          </div>
        )}
      </div>

      {/* Imagen producto — contenedor fijo para uniformidad */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 20px', flex: '0 0 220px' }}>
        <div style={{ width: 200, height: 188, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {imagen ? (
            <img
              src={imagen}
              alt="Producto"
              style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.25))' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#f0f0f0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#ccc' }}>
              📦
            </div>
          )}
        </div>
      </div>

      {/* Separador */}
      <div style={{ height: 3, background: acento, margin: '0 20px' }} />

      {/* Texto */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 24px 20px',
        textAlign: 'center',
        gap: 10,
      }}>
        {dinamica && (
          <div style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            color: acento,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            {dinamica}
          </div>
        )}
        <div style={{
          fontSize: descripcion?.length > 50 ? '1.45rem' : '1.85rem',
          fontWeight: 900,
          color: textoOscuro,
          textTransform: 'uppercase',
          lineHeight: 1.2,
        }}>
          {descripcion || 'NOMBRE DEL PRODUCTO'}
        </div>
        <div style={{
          fontSize: '3.4rem',
          fontWeight: 900,
          color: acento,
          lineHeight: 1,
        }}>
          {formatPrecio(precio)}
        </div>
      </div>
    </div>
  );
}
