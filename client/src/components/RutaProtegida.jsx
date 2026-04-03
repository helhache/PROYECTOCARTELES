import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RutaProtegida({ children, rolRequerido }) {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/login" replace />;
  if (rolRequerido && usuario.rol !== rolRequerido) {
    return <Navigate to={usuario.rol === 'ADMIN' ? '/admin' : '/local'} replace />;
  }

  return children;
}
