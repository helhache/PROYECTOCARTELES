// Selector de tipo de cartel: Promo, Ahorro, Lanzamiento, Super Combo
const TIPOS = [
  { id: 'promo', label: '¡PROMO!', emoji: '🔥' },
  { id: 'ahorro', label: 'AHORRO', emoji: '💰' },
  { id: 'lanzamiento', label: 'LANZAMIENTO', emoji: '🚀' },
  { id: 'supercombo', label: 'SUPER COMBO', emoji: '⚡' },
];

function SelectorTipo({ tipoActivo, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">Tipo de Cartel</label>
      <div className="tipo-grid">
        {TIPOS.map((tipo) => (
          <button
            key={tipo.id}
            className={`tipo-btn ${tipoActivo === tipo.id ? 'activo' : ''}`}
            onClick={() => onChange(tipo.id)}
          >
            <span>{tipo.emoji}</span>
            <span>{tipo.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SelectorTipo;
