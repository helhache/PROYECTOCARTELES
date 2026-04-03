import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LINKS = [
  { to: '/admin', label: 'Inicio', exact: true },
  { to: '/admin/editor', label: 'Editor' },
  { to: '/admin/activaciones', label: 'Activaciones' },
  { to: '/admin/locales', label: 'Locales' },
  { to: '/admin/usuarios', label: 'Usuarios' },
  { to: '/admin/asignaciones', label: 'Asignaciones' },
  { to: '/admin/log', label: 'Descargas' },
];

export default function AdminLayout({ children }) {
  const { usuario, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <span style={{ fontSize: '1.4rem' }}>🪧</span>
          <span>Generador de Carteles</span>
          <span style={{ background: '#e53e3e', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, marginLeft: 6 }}>
            ADMIN
          </span>
        </div>
        <div className="navbar-links">
          {LINKS.map(l => {
            const activo = l.exact ? location.pathname === l.to : location.pathname.startsWith(l.to);
            return (
              <Link key={l.to} to={l.to} className={`nav-link ${activo ? 'active' : ''}`}>
                {l.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            style={{ marginLeft: '1rem', background: 'none', border: '1px solid #2d2d3d', color: '#a0a0b0', borderRadius: 6, padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Salir ({usuario?.username})
          </button>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
}
