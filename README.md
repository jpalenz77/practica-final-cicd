# API REST con CI/CD Completo

API REST desarrollada con Node.js y Express que implementa un pipeline completo de CI/CD.

## 🚀 Características

- API REST con CRUD de usuarios
- Tests unitarios con Jest
- Cobertura de código
- Linting con ESLint
- Análisis estático de código con SonarCloud
- Análisis de vulnerabilidades con Snyk
- CI/CD con GitHub Actions
- Despliegue automático en Kubernetes con ArgoCD
- Dockerización con multi-stage builds

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- Docker (opcional)

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone <tu-repo>
cd my-api-cicd

# Instalar dependencias
npm install
```

## 🏃 Ejecución

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

La API estará disponible en `http://localhost:3000`

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Ver cobertura
npm test -- --coverage
```

## 🔍 Linting

```bash
# Verificar código
npm run lint

# Corregir automáticamente
npm run lint:fix
```

## 🐳 Docker

```bash
# Construir imagen
docker build -t my-api-cicd:latest .

# Ejecutar contenedor
docker run -p 3000:3000 my-api-cicd:latest
```

## 📚 API Endpoints

### Health Check
```
GET /health
```

### Usuarios

```
GET    /api/users      - Obtener todos los usuarios
GET    /api/users/:id  - Obtener usuario por ID
POST   /api/users      - Crear nuevo usuario
PUT    /api/users/:id  - Actualizar usuario
DELETE /api/users/:id  - Eliminar usuario
```

## 🔄 CI/CD Pipeline

El pipeline incluye:
- ✅ Build de la aplicación
- ✅ Ejecución de tests
- ✅ Análisis de cobertura
- ✅ Linting
- ✅ Análisis estático (SonarCloud)
- ✅ Análisis de vulnerabilidades (Snyk)
- ✅ Construcción de imagen Docker
- ✅ Push a Docker Hub
- ✅ Despliegue automático en Kubernetes

## 📝 Licencia

ISC