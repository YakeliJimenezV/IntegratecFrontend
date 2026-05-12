import { AUTH_KEYS } from './constants';

// Guardar el token después del login
export const guardarToken = (token) => {
  localStorage.setItem(AUTH_KEYS.TOKEN, token);
};

// Obtener el token guardado
export const obtenerToken = () => {
  return localStorage.getItem(AUTH_KEYS.TOKEN);
};

// Eliminar token al hacer logout
export const eliminarToken = () => {
  localStorage.removeItem(AUTH_KEYS.TOKEN);
  localStorage.removeItem(AUTH_KEYS.USER);
};

// Verificar si hay sesión activa y el token no expiró
export const estaLogueado = () => {
  const token = obtenerToken();
  if (!token) return false;

  try {
    // El token JWT tiene 3 partes: HEADER.PAYLOAD.SIGNATURE
    // Tomamos el PAYLOAD (parte del medio) y lo decodificamos de Base64
    const payload = JSON.parse(atob(token.split('.')[1]));
    // payload.exp = fecha de expiración en segundos
    // Date.now() / 1000 = fecha actual en segundos
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

// Leer el rol del usuario directamente del token sin llamar al backend
export const obtenerRolDelToken = () => {
  const token = obtenerToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.rol; // "ESTUDIANTE" o "ADMIN"
  } catch {
    return null;
  }
};

// Guardar nombre y rol después del login para mostrarlos en pantalla
export const guardarDatosUsuario = (nombre, rol) => {
  localStorage.setItem(AUTH_KEYS.USER, JSON.stringify({ nombre, rol }));
};

// Recuperar los datos guardados del usuario
export const obtenerDatosUsuario = () => {
  const datos = localStorage.getItem(AUTH_KEYS.USER);
  return datos ? JSON.parse(datos) : null;
};