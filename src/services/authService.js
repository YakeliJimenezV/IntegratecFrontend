import api from './api';

// Registro — hace POST /api/auth/registro
// Recibe: { nombre, codigoEstudiante, correo, password }
// Devuelve: { mensaje, id, nombre, correo, rol }
export const registrarEstudiante = async (datos) => {
  const response = await api.post('/auth/registro', datos);
  return response.data;
};

// Login — hace POST /api/auth/login
// Recibe: { correo, password }
// Devuelve: { token, nombre, rol }
export const loginUsuario = async (correo, password) => {
  const response = await api.post('/auth/login', { correo, password });
  return response.data;
};