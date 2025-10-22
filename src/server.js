// ============================================
// Servidor - Punto de entrada de la aplicación
// ============================================
// Este archivo inicia el servidor HTTP y pone la aplicación
// a escuchar en un puerto específico

// Importar la aplicación Express configurada
const app = require('./app');

// ============================================
// Configuración del puerto
// ============================================
// El puerto se obtiene de:
// 1. Variable de entorno PORT (usado en producción/Docker/Kubernetes)
// 2. Puerto 3000 por defecto (usado en desarrollo local)
const PORT = process.env.PORT || 3000;

// ============================================
// Iniciar el servidor
// ============================================
/**
 * Inicia el servidor HTTP en el puerto configurado
 * 
 * El callback se ejecuta cuando el servidor está listo
 * para recibir peticiones
 */
app.listen(PORT, () => {
  // Mostrar mensajes informativos en la consola
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
  console.log(`📡 Health check disponible en: http://localhost:${PORT}/health`);
});