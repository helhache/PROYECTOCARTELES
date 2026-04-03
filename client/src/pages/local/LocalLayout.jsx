import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getImgUrl } from '../../config';

export default function LocalLayout({ children }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">
          {usuario?.local_logo && (
            <img src={getImgUrl(usuario.local_logo)} alt={usuario.local_nombre} style={{ height: 36, objectFit: 'contain' }} />
          )}
          <span>{usuario?.local_nombre || 'Mi local'}</span>
        </div>
        <div className="navbar-links">
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
