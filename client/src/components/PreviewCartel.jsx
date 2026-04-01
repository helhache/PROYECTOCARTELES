// Importar templates JSON
import templatePromo from '../templates/promo.json';
import templateAhorro from '../templates/ahorro.json';
import templateLanzamiento from '../templates/lanzamiento.json';
import templateSupercombo from '../templates/supercombo.json';

const TEMPLATES = {
  promo: templatePromo,
  ahorro: templateAhorro,
  lanzamiento: templateLanzamiento,
  supercombo: templateSupercombo,
};

// Dimensiones del cartel en píxeles (proporción A4)
const DIMENSIONES = {
  vertical:   { width: 420, height: 594 },
  horizontal: { width: 594, height: 420 },
};

// Preview en tiempo real del cartel
function PreviewCartel({ datos }) {
  const template = TEMPLATES[datos.tipo] || TEMPLATES.promo;
  const dim = DIMENSIONES[datos.orientacion] || DIMENSIONES.vertical;

  // Formatear precio con separador de miles
  const formatearPrecio = (precio) => {
    if (!precio && precio !== 0) return '$0';
    return `$${Number(precio).toLocaleString('es-AR')}`;
  };

  return (
    <div className="preview-wrapper">
      <div
        id="preview-cartel"
        style={{
          width: dim.width,
          height: dim.height,
          // Si hay color personalizado lo usa, sino el del template
          background: datos.colorFondoCustom || template.colorFondo,
          color: template.colorTexto,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Cabecera: logos de empresa y local + etiqueta */}
        <div className="cartel-header">
          {/* Logo empresa: muestra la imagen subida o un placeholder */}
          {datos.logoEmpresa ? (
            <img
              src={datos.logoEmpresa}
              alt="Logo empresa"
              className="cartel-logo-empresa"
            />
          ) : (
            <div
              className="logo-placeholder"
              style={{ width: 70, height: 70, fontSize: '0.65rem', padding: '4px' }}
            >
              LOGO<br/>EMPRESA
            </div>
          )}

          {/* Etiqueta del tipo de cartel */}
          <span
            className="cartel-etiqueta"
            style={{
              color: template.colorEtiqueta,
              fontSize: datos.orientacion === 'horizontal' ? '1.4rem' : '1.6rem',
            }}
          >
            {template.etiqueta}
          </span>

          {/* Logo del local */}
          {datos.local?.logo ? (
            <img
              src={datos.local.logo}
              alt={datos.local.nombre}
              className="cartel-logo-local"
            />
          ) : (
            <div
              className="logo-placeholder"
              style={{ width: 80, height: 80, fontSize: '0.7rem', padding: '4px' }}
            >
              {datos.local?.nombre || 'LOCAL'}
            </div>
          )}
        </div>

        {/* Cuerpo del cartel */}
        <div className="cartel-body">
          {/* Imagen del producto: primero la subida manualmente, luego la de la DB */}
          {(datos.imagenProductoCustom || datos.imagenProducto) && (
            <img
              src={datos.imagenProductoCustom || datos.imagenProducto}
              alt={datos.nombreProducto}
              className="cartel-img-producto"
            />
          )}

          {/* Nombre del producto */}
          <p
            className="cartel-nombre"
            style={{
              fontSize: template.fontSizeNombre,
              color: template.colorTexto,
            }}
          >
            {datos.nombreProducto || 'NOMBRE DEL PRODUCTO'}
          </p>

          {/* Precio (elemento más grande) */}
          <p
            className="cartel-precio"
            style={{
              fontSize: template.fontSizePrecio,
              color: template.colorPrecio,
            }}
          >
            {formatearPrecio(datos.precio)}
          </p>

          {/* Texto adicional */}
          {datos.textoAdicional && (
            <p
              className="cartel-precio-label"
              style={{ color: template.colorTexto }}
            >
              {datos.textoAdicional}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreviewCartel;
