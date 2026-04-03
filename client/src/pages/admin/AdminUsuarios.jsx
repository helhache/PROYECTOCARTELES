import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [locales, setLocales] = useState([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ username: '', password: '', rol: 'LOCAL', local_id: '' });
  const [error, setError] = useState('');

  const cargar = async () => {
    const [u, l] = await Promise.all([axios.get('/api/usuarios'), axios.get('/api/locales')]);
    setUsuarios(u.data);
    setLocales(l.data);
  };

  useEffect(() => { cargar(); }, []);

  const abrirNuevo = () => {
    setEditando(null);
    setForm({ username: '', password: '', rol: 'LOCAL', local_id: '' });
    setError('');
    setModal(true);
  };

  const abrirEditar = (u) => {
    setEditando(u);
    setForm({ username: u.username, password: '', rol: u.rol, local_id: u.local_id || '' });
    setError('');
    setModal(true);
  };

  const guardar = async () => {
    setError('');
    if (!form.username.trim()) return setError('El usuario es requerido');
    if (!editando && !form.password) return setError('La contraseña es requerida para usuarios nuevos');

    const body = {
      username: form.username,
      rol: form.rol,
      local_id: form.rol === 'LOCAL' ? form.local_id : null,
    };
    if (form.password) body.password = form.password;

    try {
      if (editando) {
        await axios.put(`/api/usuarios/${editando.id}`, body);
      } else {
        await axios.post('/api/usuarios', body);
      }
      setModal(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  };

  const desactivar = async (id) => {
    if (!confirm('¿Desactivar este usuario?')) return;
    await axios.delete(`/api/usuarios/${id}`);
    cargar();
  };

  const badgeRol = (rol) => ({
    background: rol === 'ADMIN' ? '#e53e3e20' : '#6c63ff20',
    color: rol === 'ADMIN' ? '#fc8181' : '#a78bfa',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: '0.75rem',
    fontWeight: 700,
  });

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h2 className="gestion-titulo">Usuarios</h2>
        <button className="btn-nuevo" onClick={abrirNuevo}>+ Nuevo usuario</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #2d2d3d' }}>
            {['Usuario', 'Rol', 'Local', 'Estado', 'Acciones'].map(h => (
              <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#9090a0', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #1a1a24' }}>
              <td style={{ padding: '0.75rem 1rem', color: '#fff', fontWeight: 600 }}>{u.username}</td>
              <td style={{ padding: '0.75rem 1rem' }}><span style={badgeRol(u.rol)}>{u.rol}</span></td>
              <td style={{ padding: '0.75rem 1rem', color: '#9090a0' }}>{u.local_nombre || '—'}</td>
              <td style={{ padding: '0.75rem 1rem' }}>
                <span style={{ color: u.activo ? '#38a169' : '#e53e3e', fontSize: '0.85rem' }}>
                  {u.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem' }}>
                <button className="btn-editar" style={{ padding: '0.3rem 0.8rem' }} onClick={() => abrirEditar(u)}>Editar</button>
                <button className="btn-eliminar" style={{ padding: '0.3rem 0.8rem' }} onClick={() => desactivar(u.id)}>Desactivar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-titulo">{editando ? 'Editar usuario' : 'Nuevo usuario'}</h3>
            {error && <div className="msg-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Nombre de usuario</label>
              <input className="form-control" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña {editando && '(dejar vacío para no cambiar)'}</label>
              <input className="form-control" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Rol</label>
              <select className="form-control" value={form.rol} onChange={e => setForm(p => ({ ...p, rol: e.target.value }))}>
                <option value="LOCAL">LOCAL</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            {form.rol === 'LOCAL' && (
              <div className="form-group">
                <label className="form-label">Local asignado</label>
                <select className="form-control" value={form.local_id} onChange={e => setForm(p => ({ ...p, local_id: e.target.value }))}>
                  <option value="">-- Seleccionar local --</option>
                  {locales.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                </select>
              </div>
            )}
            <div className="modal-actions">
              <button className="btn-guardar" onClick={guardar}>Guardar</button>
              <button className="btn-cancelar" onClick={() => setModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
