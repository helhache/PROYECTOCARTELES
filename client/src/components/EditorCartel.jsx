import { useState } from 'react';
import FormularioCartel from './FormularioCartel.jsx';
import PreviewCartel from './PreviewCartel.jsx';
import BotonesExportar from './BotonesExportar.jsx';

// Estado inicial del formulario del cartel
const ESTADO_INICIAL = {
  tipo: 'promo',
  orientacion: 'vertical',
  local: null,
  productoId: '',
  nombreProducto: '',
  precio: '',
  imagenProducto: '',     // imagen desde DB
  imagenProductoCustom: '', // imagen subida manualmente en el editor
  textoAdicional: '',
  logoEmpresa: '',        // logo de empresa subido manualmente
  colorFondoCustom: '',   // color personalizado (sobreescribe el del template)
};

// Editor principal: panel izquierdo (formulario) + panel derecho (preview)
function EditorCartel() {
  const [datos, setDatos] = useState(ESTADO_INICIAL);

  // Actualizar campos del formulario (merge parcial del estado)
  const handleChange = (cambios) => {
    setDatos((prev) => ({ ...prev, ...cambios }));
  };

  return (
    <div className="editor-layout">
      {/* Panel izquierdo: formulario con todos los controles */}
      <aside className="panel-formulario">
        <h2 className="panel-titulo">🪧 Configurar Cartel</h2>
        <FormularioCartel datos={datos} onChange={handleChange} />
        <BotonesExportar orientacion={datos.orientacion} nombreProducto={datos.nombreProducto} />
      </aside>

      {/* Panel derecho: preview en tiempo real */}
      <section className="panel-preview">
        <div className="preview-header">
          <h2 className="panel-titulo" style={{ marginBottom: 0 }}>👁️ Vista previa</h2>
          <span style={{ fontSize: '0.8rem', color: '#606070' }}>
            {datos.orientacion === 'vertical' ? 'A4 Vertical' : 'A4 Horizontal'}
          </span>
        </div>
        <PreviewCartel datos={datos} />
      </section>
    </div>
  );
}

export default EditorCartel;
