const LOGO_COCA = '/coca_cola_logo.png';

export default function CartelCombo({ datos }) {
  if (!datos) return null;

  const {
    descripcion,  // nombre producto 1
    descripcion2, // nombre producto 2
    imagen,       // foto producto 1
    imagen2,      // foto producto 2
    dinamica,     // etiqueta (ej: COMBO, SUPER COMBO)
    precio,
    logoLocal,
    nombreLocal,
    esColor,
  } = datos;

  const formatPrecio = (p) => {
    if (!p && p !== 0) return '$.............';
    return `$${Number(p).toLocaleString('es-AR')}`;
  };

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
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}
    >
      {/* Cabecera: logos */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px 10px',
        borderBottom: `3px solid ${acento}`,
        flexShrink: 0,
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
            style={{ height: 58, objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div style={{
            width: 80, height: 54, background: '#e0e0e0', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', fontWeight: 700, color: '#666', textAlign: 'center', padding: 4,
          }}>
            {nombreLocal || 'LOCAL'}
          </div>
        )}
      </div>

      {/* Cuerpo: producto1 + separador + producto2 */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'stretch',
        padding: '10px 16px',
        gap: 0,
      }}>

        {/* Producto 1 */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '0 8px',
        }}>
          <div style={{ width: 150, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {imagen ? (
              <img
                src={imagen}
                alt="Producto 1"
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.2))' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#f0f0f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#ccc' }}>
                📦
              </div>
            )}
          </div>
          <div style={{
            fontSize: descripcion?.length > 20 ? '1rem' : '1.2rem',
            fontWeight: 800,
            color: '#1a1a1a',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 1.2,
          }}>
            {descripcion || 'PRODUCTO 1'}
          </div>
        </div>

        {/* Separador con "+" */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: 48,
          gap: 6,
        }}>
          <div style={{ width: 2, flex: 1, background: '#e0e0e0' }} />
          <div style={{
            width: 36, height: 36,
            borderRadius: '50%',
            background: acento,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            fontWeight: 900,
            color: '#fff',
            flexShrink: 0,
          }}>
            +
          </div>
          <div style={{ width: 2, flex: 1, background: '#e0e0e0' }} />
        </div>

        {/* Producto 2 */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '0 8px',
        }}>
          <div style={{ width: 150, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {imagen2 ? (
              <img
                src={imagen2}
                alt="Producto 2"
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.2))' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#f0f0f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#ccc' }}>
                📦
              </div>
            )}
          </div>
          <div style={{
            fontSize: descripcion2?.length > 20 ? '1rem' : '1.2rem',
            fontWeight: 800,
            color: '#1a1a1a',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 1.2,
          }}>
            {descripcion2 || 'PRODUCTO 2'}
          </div>
        </div>
      </div>

      {/* Pie: etiqueta + precio */}
      <div style={{
        borderTop: `3px solid ${acento}`,
        background: acento,
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: '1.4rem',
          fontWeight: 900,
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          {dinamica || 'COMBO'}
        </div>
        <div style={{
          fontSize: '2.6rem',
          fontWeight: 900,
          color: '#fff',
          lineHeight: 1,
        }}>
          {formatPrecio(precio)}
        </div>
      </div>
    </div>
  );
}
