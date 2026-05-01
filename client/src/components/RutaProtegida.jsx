import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RutaProtegida({ children, rolRequerido }) {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/login" replace />;
  if (rolRequerido && usuario.rol !== rolRequerido) {
    if (usuario.rol === 'ADMIN') return <Navigate to="/admin" replace />;
    if (usuario.rol === 'REPOSITOR') return <Navigate to="/repositor" replace />;
    return <Navigate to="/local" replace />;
  }

  return children;
}
