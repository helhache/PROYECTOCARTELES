import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RutaProtegida from './components/RutaProtegida';

import Login from './pages/Login';

import AdminLayout from './pages/admin/AdminLayout';
import AdminInicio from './pages/admin/AdminInicio';
import AdminLocales from './pages/admin/AdminLocales';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminActivaciones from './pages/admin/AdminActivaciones';
import AdminAsignaciones from './pages/admin/AdminAsignaciones';
import AdminLog from './pages/admin/AdminLog';
import AdminEditor from './pages/admin/AdminEditor';

import LocalLayout from './pages/local/LocalLayout';
import LocalPanel from './pages/local/LocalPanel';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rutas ADMIN */}
        <Route path="/admin" element={<RutaProtegida rolRequerido="ADMIN"><AdminLayout><AdminInicio /></AdminLayout></RutaProtegida>} />
        <Route path="/admin/editor" element={<RutaProtegida rolRequerido="ADMIN"><AdminLayout><AdminEditor /></AdminLayout></RutaProtegida>} />
        <Route path="/admin/locales" element={<RutaProtegida rolRequerido="ADMIN"><AdminLayout><AdminLocales /></AdminLayout></RutaProtegida>} />
        <Route path="/admin/usuarios" element={<RutaProtegida rolRequerido="ADMIN"><AdminLayout><AdminUsuarios /></AdminLayout></RutaProtegida>} />
        <Route path="/admin/activaciones" element={<RutaProtegida rolRequerido="ADMIN"><AdminLayout><AdminActivaciones /></AdminLayout></RutaProtegida>} />
        <Route path="/admin/asignaciones" element={<RutaProtegida rolRequerido="ADMIN"><AdminLayout><AdminAsignaciones /></AdminLayout></RutaProtegida>} />
        <Route path="/admin/log" element={<RutaProtegida rolRequerido="ADMIN"><AdminLayout><AdminLog /></AdminLayout></RutaProtegida>} />

        {/* Rutas LOCAL */}
        <Route path="/local" element={<RutaProtegida rolRequerido="LOCAL"><LocalLayout><LocalPanel /></LocalLayout></RutaProtegida>} />

        {/* Raíz → login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
