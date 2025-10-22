// ============================================
// Tests Unitarios de la API
// ============================================
// Este archivo contiene todos los tests para verificar que la API
// funciona correctamente. Usa Jest como framework de testing
// y Supertest para hacer peticiones HTTP de prueba.

const request = require('supertest');  // Permite hacer peticiones HTTP de prueba
const app = require('../src/app');     // Importar la aplicación a testear

// ============================================
// Suite principal de tests: Endpoints de la API
// ============================================
describe('API Endpoints', () => {
  
  // ============================================
  // Tests de la ruta raíz (/)
  // ============================================
  describe('GET /', () => {
    /**
     * Test: Verificar que la ruta raíz devuelve información de la API
     * 
     * Este test verifica que:
     * 1. La ruta responde con código 200 (OK)
     * 2. La respuesta contiene un campo 'message'
     * 3. La respuesta contiene un campo 'version'
     */
    it('debería devolver la información de la API', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('version');
    });
  });

  // ============================================
  // Tests del Health Check (/health)
  // ============================================
  describe('GET /health', () => {
    /**
     * Test: Verificar que el health check funciona correctamente
     * 
     * Este test es crítico para Kubernetes/Docker, verifica que:
     * 1. El endpoint responde con código 200 (OK)
     * 2. El status es 'healthy'
     * 3. Incluye un timestamp de la verificación
     */
    it('debería devolver el estado de salud del servidor', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  // ============================================
  // Suite de tests: API de Usuarios
  // ============================================
  describe('Users API', () => {
    
    // ========================================
    // Tests de GET /api/users - Listar usuarios
    // ========================================
    describe('GET /api/users', () => {
      /**
       * Test: Obtener todos los usuarios
       * 
       * Verifica que:
       * 1. Responde con código 200 (OK)
       * 2. La respuesta es un array
       * 3. El array contiene al menos un usuario
       */
      it('debería devolver todos los usuarios', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
      });
    });

    // ========================================
    // Tests de GET /api/users/:id - Obtener usuario por ID
    // ========================================
    describe('GET /api/users/:id', () => {
      /**
       * Test: Obtener un usuario específico por ID
       * 
       * Verifica que:
       * 1. Responde con código 200 (OK)
       * 2. El usuario tiene el ID correcto (1)
       * 3. El usuario tiene propiedades 'name' y 'email'
       */
      it('debería devolver un usuario por su ID', async () => {
        const res = await request(app).get('/api/users/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('email');
      });

      /**
       * Test: Intentar obtener un usuario que no existe
       * 
       * Verifica que:
       * 1. Responde con código 404 (Not Found)
       * 2. La respuesta contiene un mensaje de error
       */
      it('debería devolver 404 para un usuario inexistente', async () => {
        const res = await request(app).get('/api/users/999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
      });
    });

    // ========================================
    // Tests de POST /api/users - Crear usuario
    // ========================================
    describe('POST /api/users', () => {
      /**
       * Test: Crear un nuevo usuario con datos válidos
       * 
       * Verifica que:
       * 1. Responde con código 201 (Created)
       * 2. El usuario creado tiene un ID asignado
       * 3. El nombre y email coinciden con los enviados
       */
      it('debería crear un nuevo usuario', async () => {
        const newUser = {
          name: 'Test User',
          email: 'test@example.com'
        };

        const res = await request(app)
          .post('/api/users')
          .send(newUser);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(newUser.name);
        expect(res.body.email).toBe(newUser.email);
      });

      /**
       * Test: Intentar crear un usuario sin datos completos
       * 
       * Verifica que:
       * 1. Responde con código 400 (Bad Request)
       * 2. La respuesta contiene un mensaje de error
       */
      it('debería devolver 400 si falta el nombre o email', async () => {
        const res = await request(app)
          .post('/api/users')
          .send({ name: 'Test' });  // Falta el email

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
      });
    });

    // ========================================
    // Tests de PUT /api/users/:id - Actualizar usuario
    // ========================================
    describe('PUT /api/users/:id', () => {
      /**
       * Test: Actualizar un usuario existente
       * 
       * Verifica que:
       * 1. Responde con código 200 (OK)
       * 2. El nombre del usuario se actualizó correctamente
       */
      it('debería actualizar un usuario existente', async () => {
        const updates = {
          name: 'Nombre Actualizado'
        };

        const res = await request(app)
          .put('/api/users/1')
          .send(updates);

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe(updates.name);
      });

      /**
       * Test: Intentar actualizar un usuario que no existe
       * 
       * Verifica que:
       * 1. Responde con código 404 (Not Found)
       */
      it('debería devolver 404 para un usuario inexistente', async () => {
        const res = await request(app)
          .put('/api/users/999')
          .send({ name: 'Test' });

        expect(res.statusCode).toBe(404);
      });
    });

    // ========================================
    // Tests de DELETE /api/users/:id - Eliminar usuario
    // ========================================
    describe('DELETE /api/users/:id', () => {
      /**
       * Test: Eliminar un usuario existente
       * 
       * Verifica que:
       * 1. Responde con código 204 (No Content)
       *    - Indica que se eliminó correctamente
       */
      it('debería eliminar un usuario', async () => {
        const res = await request(app).delete('/api/users/2');
        expect(res.statusCode).toBe(204);
      });

      /**
       * Test: Intentar eliminar un usuario que no existe
       * 
       * Verifica que:
       * 1. Responde con código 404 (Not Found)
       */
      it('debería devolver 404 para un usuario inexistente', async () => {
        const res = await request(app).delete('/api/users/999');
        expect(res.statusCode).toBe(404);
      });
    });
  });
});