# Integratec - Frontend Web

Este es el repositorio del frontend para el proyecto **Integratec**, desarrollado con **React + Vite**.

## 🚀 Tecnologías Utilizadas

- **React 19**: Biblioteca para construir interfaces de usuario.
- **Vite**: Herramienta de construcción rápida para frontend.
- **React Router DOM 7**: Gestión de rutas y navegación.
- **Axios**: Cliente HTTP para peticiones a la API.
- **Context API**: Gestión del estado global de autenticación.

## 🛠️ Requisitos Previos

Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [npm](https://www.npmjs.com/) (viene con Node.js)

## 📦 Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repo>
   ```
2. Entra en la carpeta del proyecto:
   ```bash
   cd integratec-frontend
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

## ⚙️ Configuración del Entorno

Para que el frontend se comunique con el backend, debes configurar las variables de entorno:

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
   *(En Windows puedes usar `copy .env.example .env`)*

2. Verifica que el archivo `.env` tenga la URL correcta del backend:
   ```env
   VITE_API_URL=/api
   ```
   *Nota: El proyecto usa un proxy configurado en `vite.config.js` para evitar errores de CORS.*

## ▶️ Ejecución en Local

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:5173/](http://localhost:5173/).

## 📁 Estructura del Proyecto

- `src/assets/`: Imágenes y recursos estáticos.
- `src/components/`: Componentes reutilizables (ej. RutaProtegida).
- `src/context/`: Contextos globales (ej. AuthContext).
- `src/pages/`: Vistas principales de la aplicación.
- `src/services/`: Lógica de peticiones a la API (Axios).
- `src/utils/`: Funciones de ayuda y constantes globales.

## 🔒 Autenticación y Seguridad

El proyecto incluye un sistema de rutas protegidas:
- Las rutas `/inicio` y `/admin` requieren que el usuario esté logueado.
- El rol `ADMIN` es necesario para acceder a la ruta `/admin`.
- Los tokens JWT se gestionan automáticamente a través de interceptores en `src/services/api.js`.


Proyecto frontend Integratec desarrollado en React.
