// ============================================
// Rutas de Usuarios - CRUD Completo
// ============================================
// Este archivo define todas las operaciones para gestionar usuarios:
// Crear, Leer, Actualizar y Eliminar (CRUD)

const express = require('express');
const router = express.Router();

// ============================================
// Base de datos simulada en memoria
// ============================================
// En una aplicación real, esto se conectaría a una base de datos
// como PostgreSQL, MongoDB, etc.
// 
// IMPORTANTE: Los datos se pierden cuando se reinicia el servidor
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// ============================================
// ENDPOINT 1: Obtener todos los usuarios
// ============================================
/**
 * GET /api/users
 * 
 * Devuelve un array con todos los usuarios
 * 
 * Respuesta exitosa (200):
 * [
 *   { id: 1, name: "John Doe", email: "john@example.com" },
 *   { id: 2, name: "Jane Smith", email: "jane@example.com" }
 * ]
 */
router.get('/', (req, res) => {
  res.json(users);
});

// ============================================
// ENDPOINT 2: Obtener un usuario por ID
// ============================================
/**
 * GET /api/users/:id
 * 
 * Busca y devuelve un usuario específico por su ID
 * 
 * Parámetros:
 * - id: ID del usuario a buscar
 * 
 * Respuesta exitosa (200):
 * { id: 1, name: "John Doe", email: "john@example.com" }
 * 
 * Respuesta de error (404):
 * { error: "User not found" }
 */
router.get('/:id', (req, res) => {
  // Convertir el id de string a número y buscar el usuario
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  // Si no se encuentra el usuario, devolver error 404
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Si se encuentra, devolver el usuario
  res.json(user);
});

// ============================================
// ENDPOINT 3: Crear un nuevo usuario
// ============================================
/**
 * POST /api/users
 * 
 * Crea un nuevo usuario con los datos proporcionados
 * 
 * Body requerido (JSON):
 * {
 *   "name": "Nombre del usuario",
 *   "email": "email@ejemplo.com"
 * }
 * 
 * Respuesta exitosa (201):
 * { id: 3, name: "Nombre del usuario", email: "email@ejemplo.com" }
 * 
 * Respuesta de error (400):
 * { error: "Name and email are required" }
 */
router.post('/', (req, res) => {
  // Extraer name y email del body de la petición
  const { name, email } = req.body;
  
  // Validar que ambos campos estén presentes
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Crear el nuevo usuario con un ID único
  // El ID es el máximo ID actual + 1, o 1 si no hay usuarios
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email
  };

  // Añadir el usuario al array
  users.push(newUser);
  
  // Devolver el usuario creado con código 201 (Created)
  res.status(201).json(newUser);
});

// ============================================
// ENDPOINT 4: Actualizar un usuario existente
// ============================================
/**
 * PUT /api/users/:id
 * 
 * Actualiza los datos de un usuario existente
 * 
 * Parámetros:
 * - id: ID del usuario a actualizar
 * 
 * Body (JSON) - Ambos campos son opcionales:
 * {
 *   "name": "Nuevo nombre",
 *   "email": "nuevo@email.com"
 * }
 * 
 * Respuesta exitosa (200):
 * { id: 1, name: "Nuevo nombre", email: "nuevo@email.com" }
 * 
 * Respuesta de error (404):
 * { error: "User not found" }
 */
router.put('/:id', (req, res) => {
  // Buscar el usuario por ID
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  // Si no existe, devolver error 404
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Actualizar solo los campos que vienen en el body
  const { name, email } = req.body;
  if (name) user.name = name;      // Actualizar nombre si viene
  if (email) user.email = email;   // Actualizar email si viene

  // Devolver el usuario actualizado
  res.json(user);
});

// ============================================
// ENDPOINT 5: Eliminar un usuario
// ============================================
/**
 * DELETE /api/users/:id
 * 
 * Elimina un usuario del sistema
 * 
 * Parámetros:
 * - id: ID del usuario a eliminar
 * 
 * Respuesta exitosa (204):
 * (Sin contenido - el usuario fue eliminado)
 * 
 * Respuesta de error (404):
 * { error: "User not found" }
 */
router.delete('/:id', (req, res) => {
  // Buscar el índice del usuario en el array
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  
  // Si no se encuentra, devolver error 404
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Eliminar el usuario del array
  // splice(index, 1) elimina 1 elemento en la posición 'index'
  users.splice(index, 1);
  
  // Devolver código 204 (No Content) - operación exitosa sin contenido
  res.status(204).send();
});

// ============================================
// Exportar el router
// ============================================
// Exportamos el router para que pueda ser usado en app.js
module.exports = router;