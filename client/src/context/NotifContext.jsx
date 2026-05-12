import { createContext, useContext, useState, useCallback, useRef } from 'react';

const NotifCtx = createContext(null);

export function NotifProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const resolveRef = useRef(null);

  const toast = useCallback((msg, tipo = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, tipo }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const confirmar = useCallback((msg, tipo = 'normal') => {
    return new Promise(resolve => {
      resolveRef.current = resolve;
      setConfirmState({ msg, tipo });
    });
  }, []);

  const responder = (val) => {
    setConfirmState(null);
    if (resolveRef.current) resolveRef.current(val);
  };

  const colorToast = {
    success: { bg: '#14532d', border: '#166534', color: '#86efac' },
    error:   { bg: '#7f1d1d', border: '#991b1b', color: '#fca5a5' },
    info:    { bg: '#1e1b4b', border: '#3730a3', color: '#a5b4fc' },
  };

  return (
    <NotifCtx.Provider value={{ toast, confirmar }}>
      {children}

      {/* Toasts */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
        {toasts.map(t => {
          const c = colorToast[t.tipo] || colorToast.info;
          return (
            <div key={t.id} style={{
              background: c.bg, border: `1px solid ${c.border}`, color: c.color,
              padding: '0.75rem 1.1rem', borderRadius: 8, fontSize: '0.88rem', fontWeight: 500,
              boxShadow: '0 4px 16px #00000077', maxWidth: 340, lineHeight: 1.5,
              animation: 'fadeIn 0.2s ease',
            }}>
              {t.msg}
            </div>
          );
        })}
      </div>

      {/* Confirm modal */}
      {confirmState && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000bb', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998, padding: '1rem' }}>
          <div style={{ background: '#1a1a24', border: '1px solid #2d2d3d', borderRadius: 12, padding: '1.5rem', maxWidth: 400, width: '100%', boxShadow: '0 8px 32px #00000088' }}>
            <p style={{ color: '#e0e0e0', fontSize: '0.95rem', margin: '0 0 1.4rem', lineHeight: 1.6 }}>
              {confirmState.msg}
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => responder(false)}
                style={{ padding: '0.5rem 1.2rem', background: 'transparent', border: '1px solid #2d2d3d', color: '#9090a0', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => responder(true)}
                style={{
                  padding: '0.5rem 1.2rem', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: '#fff',
                  background: confirmState.tipo === 'danger' ? '#dc2626' : '#6c63ff',
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </NotifCtx.Provider>
  );
}

export const useNotif = () => useContext(NotifCtx);
