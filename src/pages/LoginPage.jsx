// PROPÓSITO: Pantalla de inicio de sesión — HU-02
//
// FLUJO COMPLETO:
//   1. Usuario escribe correo y contraseña
//   2. Hace clic en "Ingresar"
//   3. Validamos que los campos no estén vacíos (sin llamar al backend)
//   4. Llamamos a authService.loginUsuario()
//   5. El backend verifica las credenciales y devuelve { token, nombre, rol }
//   6. Guardamos el token con AuthContext.login()
//   7. Redirigimos según el rol: ESTUDIANTE → /inicio, ADMIN → /admin
//   8. Si hay error (401) → mostramos mensaje de error
// ─────────────────────────────────────────────────────────────────────────────
import logoImg from '../assets/logo2.png';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUsuario } from '../services/authService';
import { useAuth } from '../context/AuthContext';
 
function LoginPage() {
  // ── Estado del formulario ─────────────────────────────────────────────────
  // useState guarda lo que el usuario escribe. Cada vez que cambia un campo,
  // React re-renderiza el componente con el valor actualizado.
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
 
  // Estado para manejar errores y carga
  const [error, setError] = useState('');        // mensaje de error a mostrar
  const [cargando, setCargando] = useState(false); // deshabilitar botón mientras espera
 
  // Hooks de navegación y contexto
  const navigate = useNavigate(); // para redirigir entre páginas
  const { login } = useAuth();    // función del contexto para guardar la sesión
 
  // ── Validación local (sin backend) ───────────────────────────────────────
  const validar = () => {
    if (!correo.trim()) return 'El correo es obligatorio';
    if (!password.trim()) return 'La contraseña es obligatoria';
    return null; // null = sin errores
  };
 
  // ── Handler del formulario ────────────────────────────────────────────────
  // Se ejecuta cuando el usuario hace clic en "Ingresar" o presiona Enter
  const handleSubmit = async (e) => {
    e.preventDefault(); // evitar que la página se recargue (comportamiento por defecto de <form>)
    setError('');        // limpiar error anterior
 
    // Validación local primero — si hay error, mostrarlo y no llamar al backend
    const mensajeError = validar();
    if (mensajeError) {
      setError(mensajeError);
      return;
    }
 
    setCargando(true); // activar estado de carga → botón muestra "Ingresando..."
 
    try {
      // Llamar al backend — authService.loginUsuario hace POST /api/auth/login
      // Si las credenciales son correctas, devuelve { token, nombre, rol }
      const respuesta = await loginUsuario(correo, password);
 
      // Guardar token y datos en localStorage + Context
      // Esto hace que estaAutenticado() devuelva true en toda la app
      login(respuesta);
 
      // Redirigir según el rol que vino en la respuesta del backend
      if (respuesta.rol === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/inicio');
      }
 
    } catch (err) {
      // El backend devolvió 401 (credenciales incorrectas)
      // err.response.data.error contiene el mensaje del backend: "Correo o contraseña incorrectos"
      const mensajeBackend = err.response?.data?.error;
      setError(mensajeBackend || 'Error al conectar con el servidor');
    } finally {
      // finally siempre se ejecuta, haya error o no
      // Quitamos el estado de carga para rehabilitar el botón
      setCargando(false);
    }
  };
 
  // ── Renderizado ───────────────────────────────────────────────────────────
  return (
    <div className="auth-container">
      <div className="auth-card">
 
        {/* Header */}
        <div className="auth-header">
          <img src={logoImg} alt="Logo" style={{ width: '120px', marginBottom: '16px' }} />
          <h1 className="auth-title">INTEGRATEC</h1>
          <p className="auth-subtitle">Sistema de Proyectos — Tecsup</p>
        </div>
 
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="auth-form">
 
          {/* Mostrar error si existe */}
          {error && (
            <div className="error-banner">
              {/* ⚠ */} {error}
            </div>
          )}
 
          {/* Campo correo */}
          <div className="form-group">
            <label className="form-label">Correo institucional</label>
            <input
              type="email"
              className="form-input"
              placeholder="nombre@tecsup.edu.pe"
              value={correo}
              // onChange se ejecuta en cada tecla que escribe el usuario
              // e.target.value es el texto actual del input
              onChange={(e) => setCorreo(e.target.value)}
              disabled={cargando} // no editable mientras espera respuesta
            />
          </div>
 
          {/* Campo contraseña */}
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={cargando}
            />
          </div>
 
          {/* Botón submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={cargando} // evitar doble envío
          >
            {/* Mostrar texto diferente mientras carga */}
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
 
        </form>
 
        {/* Link hacia registro */}
        <p className="auth-footer">
          ¿No tienes cuenta?{' '}
          {/* Link de react-router-dom — navega sin recargar la página */}
          <Link to="/registro" className="auth-link">Regístrate aquí</Link>
        </p>
 
      </div>
    </div>
  );
}
 
export default LoginPage;
