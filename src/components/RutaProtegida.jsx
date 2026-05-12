// ARCHIVO: src/components/RutaProtegida.jsx
// PROPÓSITO: Proteger rutas que requieren autenticación.
//
// ¿Cómo funciona?
//   Envuelve un componente de ruta. Si el usuario NO está logueado,
//   lo redirige al login automáticamente en lugar de mostrar la pantalla.
//
// Uso en App.jsx:
//   <Route path="/inicio" element={
//     <RutaProtegida>
//       <StudentHomePage />
//     </RutaProtegida>
//   } />
//
//   Si el usuario va a /inicio sin estar logueado → lo manda a /
//   Si el usuario está logueado → muestra StudentHomePage normalmente
// ─────────────────────────────────────────────────────────────────────────────
 
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
 
// soloAdmin: si es true, además de estar logueado debe tener rol ADMIN
function RutaProtegida({ children, soloAdmin = false }) {
  const { estaAutenticado, esAdmin } = useAuth();
 
  // Si no está logueado → redirigir al login (ruta raíz)
  // replace={true} hace que no quede el /inicio en el historial del navegador
  if (!estaAutenticado) {
    return <Navigate to="/" replace />;
  }
 
  // Si la ruta es solo para admin y el usuario no es admin → redirigir a inicio
  if (soloAdmin && !esAdmin) {
    return <Navigate to="/inicio" replace />;
  }
 
  // Si pasó las validaciones → mostrar el componente normalmente
  return children;
}
 
export default RutaProtegida;