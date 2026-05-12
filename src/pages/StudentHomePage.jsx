// ARCHIVO: src/pages/StudentHomePage.jsx
// PROPÓSITO: Pantalla de inicio para estudiantes post-login
//
// Esta pantalla está protegida por RutaProtegida en App.jsx.
// Si el usuario llega aquí, SIEMPRE está autenticado.
// Usamos useAuth() para obtener los datos del usuario del Context.
// ─────────────────────────────────────────────────────────────────────────────
 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo2.png';

function StudentHomePage() {
  // Obtenemos los datos del usuario desde el Context (sin llamar al backend)
  // usuario = { nombre: "Carlos", rol: "ESTUDIANTE" }
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
 
  const handleLogout = () => {
    // logout() limpia el token de localStorage y el estado del Context
    // RutaProtegida detectará que estaAutenticado = false → redirigirá al login
    logout();
    navigate('/');
  };
 
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="home-brand">
          <img src={logoImg} alt="Logo" style={{ width: '40px', borderRadius: '4px' }} />
          <span className="home-brand-name">INTEGRATEC</span>
        </div>
        <div className="home-user">
          {/* usuario?.nombre usa optional chaining — si usuario es null no lanza error */}
          <span className="home-username">Hola, {usuario?.nombre}</span>
          <span className="home-role-badge">{usuario?.rol}</span>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar sesión
          </button>
        </div>
      </header>
 
      <main className="home-main">
        <div className="welcome-card">
          <h2 className="welcome-title">Bienvenido al sistema</h2>
          <p className="welcome-text">
            Has iniciado sesión correctamente como <strong>{usuario?.nombre}</strong>.
            El módulo de proyectos estará disponible en el Sprint 2.
          </p>
          <div className="sprint-badge">Sprint 1 completado ✓</div>
        </div>
      </main>
    </div>
  );
}
 
export default StudentHomePage;