# ============================================
# Dockerfile Multi-Stage para API Node.js
# ============================================
# Este Dockerfile usa construcción multi-etapa para crear
# una imagen Docker optimizada y segura

# ============================================
# ETAPA 1: Builder (Construcción)
# ============================================
# Esta etapa instala todas las dependencias necesarias
# Solo se usa para construir, no está en la imagen final
FROM node:18-alpine AS builder

# Establecer directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias primero (aprovecha la caché de Docker)
# Si package.json no cambia, Docker reutiliza esta capa
COPY package*.json ./

# Instalar SOLO las dependencias de producción
# npm ci: Instalación limpia basada en package-lock.json (más rápida y confiable)
# --only=production: No instala devDependencies (jest, eslint, etc.)
RUN npm ci --only=production

# ============================================
# ETAPA 2: Producción (Imagen final)
# ============================================
# Esta es la imagen final que se ejecutará
# Es más pequeña porque no incluye las herramientas de build
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# ============================================
# Crear usuario no-root por seguridad
# ============================================
# Ejecutar aplicaciones como root es un riesgo de seguridad
# Creamos un usuario sin privilegios para ejecutar la app
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# ============================================
# Copiar dependencias desde la etapa builder
# ============================================
# Solo copiamos node_modules ya compilados, no el código fuente
COPY --from=builder /app/node_modules ./node_modules

# ============================================
# Copiar código de la aplicación
# ============================================
# Copiamos el código y cambiamos el propietario al usuario nodejs
COPY --chown=nodejs:nodejs src ./src
COPY --chown=nodejs:nodejs package*.json ./

# ============================================
# Cambiar al usuario no-root
# ============================================
# A partir de aquí, todos los comandos se ejecutan como 'nodejs' (no root)
USER nodejs

# ============================================
# Exponer el puerto de la aplicación
# ============================================
# Documenta qué puerto usa la aplicación
# NOTA: Esto es solo documentación, no abre el puerto automáticamente
EXPOSE 3000

# ============================================
# Health Check
# ============================================
# Kubernetes y Docker usan esto para verificar si el contenedor está sano
# Si falla 3 veces consecutivas, el contenedor se marca como "unhealthy"
#
# Configuración:
# - interval: Cada cuánto tiempo se verifica (30 segundos)
# - timeout: Tiempo máximo de espera por respuesta (3 segundos)
# - start-period: Tiempo de gracia al iniciar (5 segundos)
# - retries: Intentos antes de marcar como unhealthy (3)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# ============================================
# Comando de inicio
# ============================================
# Comando que se ejecuta cuando se inicia el contenedor
CMD ["node", "src/server.js"]