import { createContext, useContext, useState, useEffect } from 'react';
import { ROLES } from '../utils/constants';
import {
  guardarToken,
  eliminarToken,
  estaLogueado,
  obtenerDatosUsuario,
  guardarDatosUsuario,
} from '../utils/tokenHelper';

// Crear el "canal" por donde fluirán los datos de autenticación
const AuthContext = createContext(null);

// AuthProvider envuelve toda la app en App.jsx
// Todo componente dentro de él puede usar useAuth()
export function AuthProvider({ children }) {
  // null = no logueado | { nombre, rol } = logueado
  const [usuario, setUsuario] = useState(null);

  // Al cargar la app por primera vez, verificar si hay sesión activa
  // Así el usuario no tiene que hacer login cada vez que abre el navegador
  useEffect(() => {
    if (estaLogueado()) {
      const datos = obtenerDatosUsuario();
      if (datos) setUsuario(datos);
    }
  }, []);

  // Se llama desde LoginPage después de que el backend confirma las credenciales
  // Recibe { token, nombre, rol } que devuelve el backend
  const login = ({ token, nombre, rol }) => {
    guardarToken(token);
    guardarDatosUsuario(nombre, rol);
    setUsuario({ nombre, rol });
  };

  // Limpia el token y el estado — React detecta el cambio y
  // RutaProtegida redirige al login automáticamente
  const logout = () => {
    eliminarToken();
    setUsuario(null);
  };

  const valor = {
    usuario,
    estaAutenticado: !!usuario,      // convierte a true/false
    esAdmin: usuario?.rol === ROLES.ADMIN,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto fácilmente en cualquier componente
// Uso: const { usuario, login, logout } = useAuth()
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}