import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RepositorLayout({ children }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <img src="/coca_cola_logo.png" alt="Coca-Cola" style={{ height: 32, objectFit: 'contain' }}
            onError={e => { e.target.style.display = 'none'; }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>
              {usuario?.local_nombre || 'Mi Local'}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
              Repositor
            </span>
          </div>
        </div>
        <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ color: '#606070', fontSize: '0.82rem' }}>{usuario?.username}</span>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: '1px solid #2d2d3d', color: '#a0a0b0', borderRadius: 6, padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Salir
          </button>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
}
