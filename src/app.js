// ============================================
// Aplicación Express - API REST
// ============================================
// Este archivo configura la aplicación Express con todos los middlewares,
// rutas y manejadores de errores necesarios

// Importar dependencias
const express = require('express');
const cors = require('cors');           // Permite peticiones desde otros dominios
const helmet = require('helmet');       // Añade headers de seguridad HTTP
const usersRouter = require('./routes/users');  // Rutas de usuarios

// Crear instancia de Express
const app = express();

// ============================================
// Middlewares
// ============================================
// Los middlewares procesan las peticiones antes de llegar a las rutas

// Helmet: Protege la app añadiendo varios headers HTTP de seguridad
// - X-Content-Type-Options: Previene MIME type sniffing
// - X-Frame-Options: Previene clickjacking
// - Strict-Transport-Security: Fuerza HTTPS
// - etc.
app.use(helmet());

// CORS: Permite que el frontend en otro dominio pueda hacer peticiones
// Por defecto permite todos los orígenes
app.use(cors());

// Express JSON: Parsea automáticamente el body de las peticiones JSON
// Convierte el JSON en un objeto JavaScript accesible en req.body
app.use(express.json());

// ============================================
// Rutas principales
// ============================================

/**
 * Ruta raíz - Información de la API
 * GET /
 * 
 * Devuelve información básica sobre la API:
 * - Mensaje de bienvenida
 * - Versión actual
 * - Estado del servidor
 */
app.get('/', (req, res) => {
  res.json({
    message: 'API CI/CD - Node.js + Express',
    version: '1.0.0',
    status: 'running'
  });
});

/**
 * Health Check - Verificación de salud
 * GET /health
 * 
 * Endpoint utilizado por Kubernetes y Docker para verificar
 * que la aplicación está funcionando correctamente
 * 
 * Responde con:
 * - status: Estado de salud (siempre 'healthy')
 * - timestamp: Momento exacto de la verificación
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// Rutas de la API
// ============================================

/**
 * Rutas de usuarios
 * Todas las rutas que empiecen con /api/users
 * serán manejadas por el router de usuarios
 * 
 * Endpoints disponibles:
 * - GET    /api/users      - Listar todos los usuarios
 * - GET    /api/users/:id  - Obtener un usuario específico
 * - POST   /api/users      - Crear un nuevo usuario
 * - PUT    /api/users/:id  - Actualizar un usuario
 * - DELETE /api/users/:id  - Eliminar un usuario
 */
app.use('/api/users', usersRouter);

// ============================================
// Manejador de errores global
// ============================================
/**
 * Este middleware captura cualquier error que ocurra en la aplicación
 * Debe ser el ÚLTIMO middleware registrado
 * 
 * Los 4 parámetros (err, req, res, next) son necesarios
 * para que Express lo reconozca como manejador de errores
 * 
 * @param {Error} err - El error que ocurrió
 * @param {Request} req - La petición HTTP
 * @param {Response} res - La respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 */
app.use((err, req, res, next) => {
  // Registrar el error en la consola para debugging
  console.error(err.stack);
  
  // Responder con código 500 (Internal Server Error)
  res.status(500).json({
    error: 'Something went wrong!',  // Mensaje genérico para el usuario
    message: err.message             // Mensaje específico del error
  });
});

// ============================================
// Exportar la aplicación
// ============================================
// Exportamos la app para poder:
// 1. Iniciarla en server.js
// 2. Usarla en los tests sin iniciar el servidor
module.exports = app;