import { Routes, Route, Link, useLocation } from 'react-router-dom';
import EditorCartel from './components/EditorCartel.jsx';
import GestionProductos from './pages/GestionProductos.jsx';
import GestionLocales from './pages/GestionLocales.jsx';

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      {/* Barra de navegación */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-icon">🪧</span>
          <span className="brand-text">Generador de Carteles</span>
        </div>
        <div className="navbar-links">
          <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>
            Editor
          </Link>
          <Link to="/productos" className={location.pathname === '/productos' ? 'nav-link active' : 'nav-link'}>
            Productos
          </Link>
          <Link to="/locales" className={location.pathname === '/locales' ? 'nav-link active' : 'nav-link'}>
            Locales
          </Link>
        </div>
      </nav>

      {/* Contenido principal según la ruta */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<EditorCartel />} />
          <Route path="/productos" element={<GestionProductos />} />
          <Route path="/locales" element={<GestionLocales />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
