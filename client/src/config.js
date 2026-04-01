// URL base del backend (en producción viene de la variable de entorno VITE_API_URL)
// En desarrollo queda vacío y Vite usa el proxy local
const API_URL = import.meta.env.VITE_API_URL || '';

// Convierte rutas relativas de imágenes del servidor (/uploads/...) a URLs absolutas
export const getImgUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path;
  return `${API_URL}${path}`;
};

export default API_URL;
