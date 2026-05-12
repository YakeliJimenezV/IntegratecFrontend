// PROPÓSITO: Pantalla de registro de estudiante — HU-01
//
// FLUJO COMPLETO:
//   1. Usuario llena nombre, código, correo y contraseña
//   2. Hace clic en "Registrarse"
//   3. Validamos LOCALMENTE (sin backend): campos vacíos, dominio de correo,
//      longitud de contraseña — errores se muestran debajo de cada campo
//   4. Si pasa la validación local → llamamos al backend
//   5. El backend puede devolver error 400 (correo o código ya registrado)
//   6. Si registro exitoso (201) → redirigir al login con mensaje de éxito
// ─────────────────────────────────────────────────────────────────────────────

import logoImg from '../assets/logo2.png';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarEstudiante } from '../services/authService';
 
function RegisterPage() {
  // ── Estado del formulario ─────────────────────────────────────────────────
  const [form, setForm] = useState({
    nombre: '',
    codigoEstudiante: '',
    correo: '',
    password: '',
    confirmarPassword: '',
  });
 
  // Errores por campo — cada campo puede tener su propio mensaje de error
  // Esto es mejor que un solo mensaje general porque el usuario sabe
  // exactamente qué campo corregir
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(''); // error del backend
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false); // para mostrar mensaje de éxito
 
  const navigate = useNavigate();
 
  // ── Handler genérico para todos los inputs ────────────────────────────────
  // En lugar de crear un handler por campo, usamos uno solo que lee el "name" del input
  // e.target.name = el atributo name del input que cambió (ej: "correo")
  // e.target.value = el texto nuevo
  const handleChange = (e) => {
    const { name, value } = e.target;
 
    // Actualizar solo el campo que cambió, mantener el resto igual
    // El spread ...form copia todos los campos actuales
    setForm({ ...form, [name]: value });
 
    // Limpiar el error de ese campo cuando el usuario empieza a corregirlo
    // Mejora la UX: el error desaparece al escribir, no hay que reenviar el form
    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  };
 
  // ── Validación local ──────────────────────────────────────────────────────
  // Devuelve un objeto con los errores encontrados
  // Si está vacío {}, no hay errores → podemos llamar al backend
  const validar = () => {
    const nuevosErrores = {};
 
    if (!form.nombre.trim())
      nuevosErrores.nombre = 'El nombre es obligatorio';
 
    if (!form.codigoEstudiante.trim())
      nuevosErrores.codigoEstudiante = 'El código es obligatorio';
 
    if (!form.correo.trim()) {
      nuevosErrores.correo = 'El correo es obligatorio';
    } else if (!form.correo.endsWith('@tecsup.edu.pe')) {
      // Validación del dominio institucional ANTES de llamar al backend
      // Ahorramos una petición HTTP innecesaria
      nuevosErrores.correo = 'El correo debe ser @tecsup.edu.pe';
    }
 
    if (!form.password) {
      nuevosErrores.password = 'La contraseña es obligatoria';
    } else if (form.password.length < 8) {
      nuevosErrores.password = 'Mínimo 8 caracteres';
    }
 
    if (form.password !== form.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden';
    }
 
    return nuevosErrores;
  };
 
  // ── Handler del formulario ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGeneral('');
 
    // Validación local
    const erroresEncontrados = validar();
    if (Object.keys(erroresEncontrados).length > 0) {
      // Hay errores → mostrarlos en pantalla sin llamar al backend
      setErrores(erroresEncontrados);
      return;
    }
 
    setCargando(true);
 
    try {
      // Preparar los datos para enviar al backend
      // El backend espera: { nombre, codigoEstudiante, correo, password }
      // NO enviamos confirmarPassword — es solo para validación en el frontend
      await registrarEstudiante({
        nombre: form.nombre.trim(),
        codigoEstudiante: form.codigoEstudiante.trim(),
        correo: form.correo.trim(),
        password: form.password,
      });
 
      // Registro exitoso → mostrar mensaje y redirigir al login
      setExito(true);
      setTimeout(() => {
        navigate('/'); // redirigir al login después de 2 segundos
      }, 2000);
 
    } catch (err) {
      // Error 400 del backend (correo o código ya registrado)
      // err.response.data.error = mensaje del backend
      const mensajeBackend = err.response?.data?.error;
      setErrorGeneral(mensajeBackend || 'Error al registrar. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };
 
  // ── Renderizado ───────────────────────────────────────────────────────────
  return (
    <div className="auth-container">
      <div className="auth-card auth-card--wide">
 
        {/* Header */}
        <div className="auth-header">
          <img src={logoImg} alt="Logo" style={{ width: '80px', marginBottom: '12px' }} />
          <h1 className="auth-title">Crear cuenta</h1>
          <p className="auth-subtitle">Regístrate como estudiante Tecsup</p>
        </div>
 
        {/* Mensaje de éxito */}
        {exito && (
          <div className="success-banner">
            ¡Registro exitoso! Redirigiendo al login...
          </div>
        )}
 
        {/* Error del backend */}
        {errorGeneral && (
          <div className="error-banner">{errorGeneral}</div>
        )}
 
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="auth-form">
 
          {/* Nombre */}
          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              name="nombre"         // "name" debe coincidir con la clave en el estado form
              className={`form-input ${errores.nombre ? 'form-input--error' : ''}`}
              placeholder="Carlos López Mendoza"
              value={form.nombre}
              onChange={handleChange}
              disabled={cargando}
            />
            {/* Mostrar error debajo del campo si existe */}
            {errores.nombre && <span className="field-error">{errores.nombre}</span>}
          </div>
 
          {/* Código de estudiante */}
          <div className="form-group">
            <label className="form-label">Código de estudiante</label>
            <input
              type="text"
              name="codigoEstudiante"
              className={`form-input ${errores.codigoEstudiante ? 'form-input--error' : ''}`}
              placeholder="2024001"
              value={form.codigoEstudiante}
              onChange={handleChange}
              disabled={cargando}
            />
            {errores.codigoEstudiante && <span className="field-error">{errores.codigoEstudiante}</span>}
          </div>
 
          {/* Correo */}
          <div className="form-group">
            <label className="form-label">Correo institucional</label>
            <input
              type="email"
              name="correo"
              className={`form-input ${errores.correo ? 'form-input--error' : ''}`}
              placeholder="nombre@tecsup.edu.pe"
              value={form.correo}
              onChange={handleChange}
              disabled={cargando}
            />
            {errores.correo && <span className="field-error">{errores.correo}</span>}
          </div>
 
          {/* Contraseña */}
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className={`form-input ${errores.password ? 'form-input--error' : ''}`}
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={handleChange}
              disabled={cargando}
            />
            {errores.password && <span className="field-error">{errores.password}</span>}
          </div>
 
          {/* Confirmar contraseña */}
          <div className="form-group">
            <label className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              name="confirmarPassword"
              className={`form-input ${errores.confirmarPassword ? 'form-input--error' : ''}`}
              placeholder="Repite tu contraseña"
              value={form.confirmarPassword}
              onChange={handleChange}
              disabled={cargando}
            />
            {errores.confirmarPassword && <span className="field-error">{errores.confirmarPassword}</span>}
          </div>
 
          <button type="submit" className="btn-primary" disabled={cargando || exito}>
            {cargando ? 'Registrando...' : 'Crear cuenta'}
          </button>
 
        </form>
 
        <p className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/" className="auth-link">Inicia sesión</Link>
        </p>
 
      </div>
    </div>
  );
}
 
export default RegisterPage;