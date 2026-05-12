import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RutaProtegida from './components/RutaProtegida';
import { ROUTES } from './utils/constants';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentHomePage from './pages/StudentHomePage';

function AdminHomePage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Panel de Administración</h1>
      <p>Módulo disponible en Sprint 2</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

          {/* Rutas protegidas */}
          <Route path={ROUTES.HOME} element={
            <RutaProtegida>
              <StudentHomePage />
            </RutaProtegida>
          } />
          <Route path={ROUTES.ADMIN} element={
            <RutaProtegida soloAdmin>
              <AdminHomePage />
            </RutaProtegida>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;