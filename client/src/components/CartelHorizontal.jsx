// Cartel horizontal: diseño de la propuesta del jefe
// Dos logos (Coca-Cola izq, local der), mensaje centro, precio, imagen producto a los costados

const LOGO_COCA = '/uploads/logos/coca_cola_logo.png';

export default function CartelHorizontal({ datos }) {
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
        width: 594,
        height: 420,
        background: esColor ? '#fff' : '#f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', 'Arial', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        filter: filtroGris,
      }}
    >
      {/* Cabecera: logo Coca-Cola (izq) + logo local (der) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px 8px',
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
        padding: '0 12px',
        gap: 8,
      }}>
        {/* Imagen producto izquierda */}
        <div style={{ width: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {imagen ? (
            <img
              src={imagen}
              alt="Producto"
              style={{ maxWidth: '100%', maxHeight: 180, objectFit: 'contain' }}
            />
          ) : (
            <div style={{ width: 100, height: 140, background: '#e8e8e8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#bbb' }}>
              📦
            </div>
          )}
        </div>

        {/* Texto central */}
        <div style={{ flex: 1, textAlign: 'center', padding: '0 8px' }}>
          {/* Dinámica */}
          {dinamica && (
            <div style={{
              fontSize: '0.85rem', fontWeight: 700, color: '#cc0000',
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4,
            }}>
              {dinamica}
            </div>
          )}

          {/* Descripción */}
          <div style={{
            fontSize: descripcion?.length > 50 ? '1.05rem' : '1.3rem',
            fontWeight: 900,
            color: '#1a1a1a',
            textTransform: 'uppercase',
            lineHeight: 1.15,
            marginBottom: 12,
          }}>
            {descripcion || 'NOMBRE DEL PRODUCTO'}
          </div>

          {/* Precio */}
          <div style={{
            fontSize: '2.2rem',
            fontWeight: 900,
            color: '#cc0000',
            lineHeight: 1,
          }}>
            {formatPrecio(precio)}
          </div>
        </div>

        {/* Imagen producto derecha */}
        <div style={{ width: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {imagen ? (
            <img
              src={imagen}
              alt="Producto"
              style={{ maxWidth: '100%', maxHeight: 180, objectFit: 'contain' }}
            />
          ) : (
            <div style={{ width: 100, height: 140, background: '#e8e8e8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#bbb' }}>
              📦
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
