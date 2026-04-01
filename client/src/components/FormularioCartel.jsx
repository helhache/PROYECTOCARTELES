import { useEffect, useState } from 'react';
import axios from 'axios';
import SelectorTipo from './SelectorTipo.jsx';
import SelectorLocal from './SelectorLocal.jsx';

// Convierte un archivo de imagen a base64 para mostrarlo sin servidor
const fileToBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });

// Formulario con todos los campos editables del cartel
function FormularioCartel({ datos, onChange }) {
  const [productos, setProductos] = useState([]);

  // Cargar productos desde la API
  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await axios.get('/api/productos');
        setProductos(data);
      } catch (err) {
        console.error('Error al cargar productos:', err.message);
      }
    };
    cargar();
  }, []);

  // Cuando se selecciona un producto del dropdown, pre-llenar nombre y precio
  const handleProductoSeleccionado = (e) => {
    const id = e.target.value;
    if (!id) {
      onChange({ productoId: '', nombreProducto: '', precio: '', imagenProducto: '' });
      return;
    }
    const prod = productos.find((p) => p._id === id);
    if (prod) {
      onChange({
        productoId: prod._id,
        nombreProducto: prod.nombre,
        precio: prod.precio,
        imagenProducto: prod.imagen || '',
      });
    }
  };

  // Manejar subida de logo de empresa
  const handleLogoEmpresa = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const base64 = await fileToBase64(archivo);
    onChange({ logoEmpresa: base64 });
  };

  // Manejar subida de imagen de producto manual
  const handleImagenProducto = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const base64 = await fileToBase64(archivo);
    onChange({ imagenProductoCustom: base64 });
  };

  return (
    <>
      {/* ── LOGO DE EMPRESA ── */}
      <div className="form-group">
        <label className="form-label">Logo de la Empresa</label>
        <label className="upload-area" style={{ cursor: 'pointer', display: 'block' }}>
          {datos.logoEmpresa ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <img src={datos.logoEmpresa} alt="Logo empresa" style={{ height: 50, objectFit: 'contain' }} />
              <span style={{ fontSize: '0.8rem', color: '#9090a0' }}>Clic para cambiar</span>
            </div>
          ) : (
            <div style={{ color: '#606070', fontSize: '0.88rem' }}>
              🏢 Subir logo de empresa<br />
              <span style={{ fontSize: '0.75rem' }}>PNG, JPG, SVG (fondo transparente recomendado)</span>
            </div>
          )}
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoEmpresa} />
        </label>
        {datos.logoEmpresa && (
          <button
            style={{ marginTop: '0.4rem', background: 'none', border: 'none', color: '#fc8181', fontSize: '0.8rem', cursor: 'pointer' }}
            onClick={() => onChange({ logoEmpresa: '' })}
          >
            ✕ Quitar logo
          </button>
        )}
      </div>

      {/* Separador */}
      <hr style={{ border: 'none', borderTop: '1px solid #2d2d3d', margin: '0.5rem 0 1rem' }} />

      {/* Tipo de cartel */}
      <SelectorTipo tipoActivo={datos.tipo} onChange={(t) => onChange({ tipo: t })} />

      {/* Orientación */}
      <div className="form-group">
        <label className="form-label">Orientación</label>
        <div className="orientacion-toggle">
          <button
            className={`orient-btn ${datos.orientacion === 'vertical' ? 'activo' : ''}`}
            onClick={() => onChange({ orientacion: 'vertical' })}
          >
            📄 Vertical
          </button>
          <button
            className={`orient-btn ${datos.orientacion === 'horizontal' ? 'activo' : ''}`}
            onClick={() => onChange({ orientacion: 'horizontal' })}
          >
            📋 Horizontal
          </button>
        </div>
      </div>

      {/* ── COLOR DE FONDO PERSONALIZADO ── */}
      <div className="form-group">
        <label className="form-label">Color de Fondo</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <input
            type="color"
            value={datos.colorFondoCustom || '#CC0000'}
            onChange={(e) => onChange({ colorFondoCustom: e.target.value })}
            style={{ width: 48, height: 36, border: '1px solid #2d2d3d', borderRadius: 6, cursor: 'pointer', background: 'none', padding: 2 }}
          />
          <span style={{ fontSize: '0.85rem', color: '#9090a0' }}>
            {datos.colorFondoCustom ? datos.colorFondoCustom.toUpperCase() : 'Color del template'}
          </span>
          {datos.colorFondoCustom && (
            <button
              style={{ background: 'none', border: 'none', color: '#fc8181', fontSize: '0.8rem', cursor: 'pointer' }}
              onClick={() => onChange({ colorFondoCustom: '' })}
            >
              ✕ Usar template
            </button>
          )}
        </div>
      </div>

      {/* Selector de local */}
      <SelectorLocal
        localSeleccionado={datos.local}
        onChange={(local) => onChange({ local })}
      />

      {/* Selector de producto (carga desde DB) */}
      <div className="form-group">
        <label className="form-label">Cargar Producto (desde base de datos)</label>
        <select className="form-control" value={datos.productoId || ''} onChange={handleProductoSeleccionado}>
          <option value="">-- Seleccionar producto --</option>
          {productos.map((p) => (
            <option key={p._id} value={p._id}>
              {p.nombre} - ${p.precio}
            </option>
          ))}
        </select>
      </div>

      {/* ── FOTO DEL PRODUCTO (subida manual) ── */}
      <div className="form-group">
        <label className="form-label">Foto del Producto (para el cartel)</label>
        <label className="upload-area" style={{ cursor: 'pointer', display: 'block' }}>
          {(datos.imagenProductoCustom || datos.imagenProducto) ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <img
                src={datos.imagenProductoCustom || datos.imagenProducto}
                alt="Foto producto"
                style={{ height: 60, objectFit: 'contain', borderRadius: 4 }}
              />
              <span style={{ fontSize: '0.8rem', color: '#9090a0' }}>Clic para cambiar</span>
            </div>
          ) : (
            <div style={{ color: '#606070', fontSize: '0.88rem' }}>
              🖼️ Subir foto del producto<br />
              <span style={{ fontSize: '0.75rem' }}>PNG, JPG — se muestra en el cartel</span>
            </div>
          )}
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImagenProducto} />
        </label>
        {datos.imagenProductoCustom && (
          <button
            style={{ marginTop: '0.4rem', background: 'none', border: 'none', color: '#fc8181', fontSize: '0.8rem', cursor: 'pointer' }}
            onClick={() => onChange({ imagenProductoCustom: '' })}
          >
            ✕ Quitar foto
          </button>
        )}
      </div>

      {/* Nombre del producto (editable manualmente) */}
      <div className="form-group">
        <label className="form-label">Nombre del Producto</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ej: Coca Cola 2.25L"
          value={datos.nombreProducto}
          onChange={(e) => onChange({ nombreProducto: e.target.value })}
        />
      </div>

      {/* Precio */}
      <div className="form-group">
        <label className="form-label">Precio ($)</label>
        <input
          type="number"
          className="form-control"
          placeholder="Ej: 1500"
          value={datos.precio}
          onChange={(e) => onChange({ precio: e.target.value })}
          min="0"
          step="0.01"
        />
      </div>

      {/* Texto adicional opcional */}
      <div className="form-group">
        <label className="form-label">Texto adicional (opcional)</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ej: x unidad, por kg, etc."
          value={datos.textoAdicional}
          onChange={(e) => onChange({ textoAdicional: e.target.value })}
        />
      </div>
    </>
  );
}

export default FormularioCartel;
