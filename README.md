<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-7.8-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
</p>

# VoiceFinance AI - Backend

> API REST + WebSocket para gestion financiera inteligente con procesamiento de voz, chat en tiempo real y recomendaciones con IA.

---

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalacion Rapida](#instalacion-rapida)
- [Variables de Entorno](#variables-de-entorno)
- [Base de Datos](#base-de-datos)
- [Iniciar el Servidor](#iniciar-el-servidor)
- [Endpoints de la API](#endpoints-de-la-api)
  - [Health Check](#health-check)
  - [Autenticacion](#autenticacion)
  - [Transacciones](#transacciones)
  - [Categorias](#categorias)
  - [Alertas](#alertas)
  - [Recomendaciones](#recomendaciones)
  - [Analytics](#analytics)
- [Autenticacion JWT](#autenticacion-jwt)
- [Modelos de Datos](#modelos-de-datos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Base de Datos Avanzada](#base-de-datos-avanzada)
- [WebSocket - Chat en Tiempo Real](#websocket---chat-en-tiempo-real)
- [Scripts de Mantenimiento](#scripts-de-mantenimiento)
- [Errores Comunes](#errores-comunes)
- [Equipo](#equipo)

---

## Requisitos Previos

| Herramienta | Version | Descarga |
|-------------|---------|----------|
| **Node.js** | v18 o superior | [nodejs.org](https://nodejs.org/) |
| **Docker Desktop** | Ultima version | [docker.com](https://www.docker.com/products/docker-desktop/) |
| **Git** | Ultima version | [git-scm.com](https://git-scm.com/) |

---

## Instalacion Rapida

```bash
# 1. Clonar el repositorio
git clone https://github.com/VoiceTeamm/BAFROVT.git
cd BAFROVT
git checkout backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores (ver seccion Variables de Entorno)

# 4. Iniciar base de datos con Docker
docker run --name vf-postgres -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=voicefinance -p 5432:5432 -d postgres:16

# 5. Generar cliente Prisma y sincronizar schema
npx prisma generate
npx prisma db push

# 6. (Opcional) Cargar datos de prueba
npx ts-node prisma/seed.ts

# 7. Iniciar el servidor
npm run dev
```

Si todo esta bien, veras:
```
Socket.io inicializado
VoiceFinance API corriendo en http://localhost:3000
Socket.io activo
```

---

## Variables de Entorno

Crear archivo `.env` en la raiz del proyecto (copiar de `.env.example`):

| Variable | Descripcion | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Conexion a PostgreSQL | `postgresql://postgres:secret@localhost:5432/voicefinance` |
| `JWT_SECRET` | Clave para tokens (min 32 chars) | `voicefinance_secret_key_2024_secure` |
| `OPENAI_API_KEY` | Clave de OpenAI para IA | `sk-tu-api-key` |
| `REDIS_URL` | Conexion a Redis | `redis://localhost:6379` |
| `N8N_WEBHOOK_URL` | URL webhook de n8n | `http://localhost:5678/webhook/recommendation` |
| `PORT` | Puerto del servidor (opcional) | `3000` |

> **Importante:** El `JWT_SECRET` debe tener minimo 32 caracteres o el servidor no arrancara.

> **Nunca** subas el archivo `.env` a GitHub.

---

## Base de Datos

### Iniciar el contenedor PostgreSQL

```bash
# Primera vez (crear contenedor)
docker run --name vf-postgres -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=voicefinance -p 5432:5432 -d postgres:16

# Si ya existe el contenedor
docker start vf-postgres

# Verificar que esta corriendo
docker ps
```

### Sincronizar schema

```bash
npx prisma generate    # Genera el cliente TypeScript
npx prisma db push     # Crea/actualiza tablas en PostgreSQL
```

### Datos de prueba

```bash
npx ts-node prisma/seed.ts
```

Esto crea un usuario de prueba con categorias, transacciones, alertas y recomendaciones precargadas.

---

## Iniciar el Servidor

```bash
npm run dev
```

- **Backend:** `http://localhost:3000`
- **Frontend:** `http://localhost:5173` (rama frontend)
- **CORS:** configurado para aceptar requests desde `http://localhost:5173`

### Verificar que funciona

```
GET http://localhost:3000/health
```

Respuesta:
```json
{
  "status": "ok",
  "timestamp": "2026-05-19T22:07:54.983Z"
}
```

---

## Endpoints de la API

**URL Base:** `http://localhost:3000`

### Health Check

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| `GET` | `/health` | No | Verificar estado del servidor |

---

### Autenticacion

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | No | Registrar nuevo usuario |
| `POST` | `/api/auth/login` | No | Iniciar sesion |
| `GET` | `/api/auth/me` | Si | Obtener perfil del usuario autenticado |
| `POST` | `/api/auth/refresh` | Si | Renovar token JWT |
| `POST` | `/api/auth/logout` | Si | Cerrar sesion |

#### `POST /api/auth/register`

**Request:**
```json
{
  "name": "Victor Cartagena",
  "email": "victor@test.com",
  "password": "123456",
  "businessType": "general"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "12e002df-c9c5-437a-88b0-c334e3550507",
    "name": "Victor Cartagena",
    "email": "victor@test.com",
    "businessType": "general"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### `POST /api/auth/login`

**Request:**
```json
{
  "email": "victor@test.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "12e002df-...",
    "name": "Victor Cartagena",
    "email": "victor@test.com",
    "businessType": "general"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### `GET /api/auth/me`

> Requiere token JWT en el header `Authorization: Bearer <token>`

Devuelve los datos del usuario autenticado. El frontend debe usar este endpoint al iniciar la app para verificar si la sesion sigue activa.

**Response (200):**
```json
{
  "id": "12e002df-...",
  "name": "Victor Cartagena",
  "email": "victor@test.com",
  "businessType": "general",
  "targetMarginPct": 40,
  "createdAt": "2026-05-19T22:07:54.983Z"
}
```

**Ejemplo de uso en frontend:**
```javascript
// Al iniciar la app, verificar sesion
const token = localStorage.getItem('token');
if (token) {
  const res = await fetch('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (res.ok) {
    const user = await res.json();
    // Sesion activa, cargar dashboard
  } else {
    // Token expirado, redirigir a login
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
```

#### `POST /api/auth/refresh`

> Requiere token JWT en el header `Authorization: Bearer <token>`

Renueva el token JWT antes de que expire. El frontend debe llamar este endpoint periodicamente para mantener la sesion activa.

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Ejemplo de uso en frontend:**
```javascript
// Renovar token cada 23 horas (el token expira en 24h)
setInterval(async () => {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (res.ok) {
    const { token } = await res.json();
    localStorage.setItem('token', token);
  }
}, 23 * 60 * 60 * 1000);
```

#### `POST /api/auth/logout`

> Requiere token JWT en el header `Authorization: Bearer <token>`

Cierra la sesion del usuario. El frontend debe eliminar el token almacenado.

**Response (200):**
```json
{
  "message": "Sesion cerrada correctamente"
}
```

**Ejemplo de uso en frontend:**
```javascript
await fetch('/api/auth/logout', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
localStorage.removeItem('token');
window.location.href = '/login';
```

---

### Transacciones

Todos requieren **token JWT** en el header `Authorization: Bearer <token>`.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `POST` | `/api/transactions` | Crear transaccion |
| `GET` | `/api/transactions` | Listar transacciones (paginado) |
| `GET` | `/api/transactions/summary` | Resumen financiero por rango de fechas |
| `GET` | `/api/transactions/:id` | Obtener una transaccion |
| `PUT` | `/api/transactions/:id` | Actualizar transaccion |
| `DELETE` | `/api/transactions/:id` | Eliminar transaccion |

#### `POST /api/transactions`

**Request:**
```json
{
  "type": "EXPENSE",
  "amount": 1500,
  "categoryId": "uuid-de-la-categoria",
  "description": "Compra de insumos"
}
```

> Tambien acepta `category` (nombre de categoria) en lugar de `categoryId`. Si la categoria no existe, se crea automaticamente.

**Response (201):**
```json
{
  "id": "443cd89d-bc31-432a-...",
  "userId": "12e002df-...",
  "categoryId": "1deff772-...",
  "type": "EXPENSE",
  "amount": 1500,
  "note": "Compra de insumos",
  "date": "2026-05-19T22:50:42.647Z",
  "source": "MANUAL",
  "category": {
    "id": "1deff772-...",
    "name": "Publicidad",
    "type": "EXPENSE"
  }
}
```

> **Nota:** El campo `description` del request se mapea a `note` en la base de datos.

#### `GET /api/transactions?page=1&limit=10`

**Query params:**

| Param | Tipo | Default | Descripcion |
|-------|------|---------|-------------|
| `page` | number | 1 | Numero de pagina |
| `limit` | number | 10 | Items por pagina |

**Response:**
```json
{
  "transactions": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### `GET /api/transactions/summary?startDate=2026-01-01&endDate=2026-12-31`

**Query params:**

| Param | Tipo | Descripcion |
|-------|------|-------------|
| `startDate` | ISO Date | Fecha inicio del rango |
| `endDate` | ISO Date | Fecha fin del rango |

**Response:**
```json
{
  "totalIncome": 50000,
  "totalExpenses": 30000,
  "balance": 20000,
  "byCategory": {
    "Ventas": 50000,
    "Publicidad": 15000,
    "Insumos": 15000
  },
  "transactionCount": 25
}
```

---

### Categorias

Todos requieren **token JWT**.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `/api/categories` | Listar categorias del usuario |
| `GET` | `/api/categories/:id` | Obtener una categoria |
| `POST` | `/api/categories` | Crear categoria |
| `PUT` | `/api/categories/:id` | Actualizar categoria |
| `DELETE` | `/api/categories/:id` | Eliminar categoria |

#### `POST /api/categories`

**Request:**
```json
{
  "name": "Marketing",
  "type": "EXPENSE"
}
```

> `type` solo acepta: `"INCOME"` o `"EXPENSE"`

**Response (201):**
```json
{
  "id": "1deff772-...",
  "userId": "12e002df-...",
  "name": "Marketing",
  "type": "EXPENSE",
  "color": "#3B82F6",
  "icon": "tag"
}
```

> **Nota:** No se puede eliminar una categoria que tenga transacciones asociadas.

---

### Alertas

Todos requieren **token JWT**.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `/api/alerts` | Listar alertas del usuario |
| `GET` | `/api/alerts?unread=true` | Solo alertas no leidas |
| `PATCH` | `/api/alerts/:id/read` | Marcar alerta como leida |

#### `GET /api/alerts`

**Response:**
```json
[
  {
    "id": "dd5d820a-...",
    "userId": "604239e2-...",
    "message": "Tus gastos en insumos subieron un 20%",
    "type": "COST_INCREASE",
    "isRead": false,
    "createdAt": "2026-05-17T01:07:05.805Z"
  }
]
```

**Tipos de alerta:**

| Tipo | Descripcion |
|------|-------------|
| `COST_INCREASE` | Gastos aumentaron mas del 20% vs mes anterior |
| `LOW_MARGIN` | Margen actual por debajo del objetivo del usuario |
| `CASH_FLOW` | Balance negativo (gastos superan ingresos) |

---

### Recomendaciones

Todos requieren **token JWT**.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `/api/recommendations` | Listar recomendaciones |
| `GET` | `/api/recommendations?status=ACTIVE` | Filtrar por estado |
| `PATCH` | `/api/recommendations/:id` | Actualizar estado |

#### `GET /api/recommendations`

**Response:**
```json
[
  {
    "id": "99881480-...",
    "userId": "604239e2-...",
    "categoryId": "7d4c2084-...",
    "title": "Reducir costo de insumos",
    "description": "Buscar proveedores alternativos",
    "suggestedPrice": 680,
    "currentPrice": 800,
    "variationPct": -15,
    "status": "ACTIVE",
    "createdAt": "2026-05-17T01:07:05.794Z",
    "category": {
      "id": "7d4c2084-...",
      "name": "Insumos",
      "type": "EXPENSE"
    }
  }
]
```

#### `PATCH /api/recommendations/:id`

**Request:**
```json
{
  "status": "APPLIED"
}
```

> `status` solo acepta: `"DISMISSED"` o `"APPLIED"`

---

### Analytics

Endpoints para graficos y dashboard del frontend. Todos requieren **token JWT**.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `/api/analytics/summary` | Resumen financiero del mes actual |
| `GET` | `/api/analytics/trends` | Tendencias de los ultimos 6 meses |

#### `GET /api/analytics/summary`

Devuelve el resumen financiero del mes en curso automaticamente (no requiere parametros de fecha).

**Response (200):**
```json
{
  "period": {
    "from": "2026-05-01T00:00:00.000Z",
    "to": "2026-05-31T23:59:59.000Z"
  },
  "totalIncome": 50000,
  "totalExpenses": 30000,
  "balance": 20000,
  "transactionCount": 25,
  "byCategory": {
    "Ventas": { "total": 50000, "type": "INCOME" },
    "Publicidad": { "total": 15000, "type": "EXPENSE" },
    "Insumos": { "total": 15000, "type": "EXPENSE" }
  }
}
```

**Ejemplo de uso en frontend (Dashboard):**
```javascript
const res = await fetch('/api/analytics/summary', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await res.json();

// Mostrar en tarjetas del dashboard
document.getElementById('income').textContent = `$${data.totalIncome}`;
document.getElementById('expenses').textContent = `$${data.totalExpenses}`;
document.getElementById('balance').textContent = `$${data.balance}`;
```

#### `GET /api/analytics/trends`

Devuelve las tendencias de ingresos y gastos de los ultimos 6 meses. Ideal para graficos de lineas o barras.

**Response (200):**
```json
{
  "trends": [
    {
      "month": "2025-12",
      "income": 45000,
      "expenses": 28000,
      "balance": 17000
    },
    {
      "month": "2026-01",
      "income": 48000,
      "expenses": 31000,
      "balance": 17000
    },
    {
      "month": "2026-02",
      "income": 52000,
      "expenses": 29000,
      "balance": 23000
    }
  ]
}
```

**Ejemplo de uso en frontend (Grafico con Chart.js):**
```javascript
const res = await fetch('/api/analytics/trends', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { trends } = await res.json();

new Chart(ctx, {
  type: 'line',
  data: {
    labels: trends.map(t => t.month),
    datasets: [
      { label: 'Ingresos', data: trends.map(t => t.income), borderColor: '#10B981' },
      { label: 'Gastos', data: trends.map(t => t.expenses), borderColor: '#EF4444' },
    ]
  }
});
```

---

## Autenticacion JWT

Todos los endpoints (excepto `/health`, `/api/auth/register` y `/api/auth/login`) requieren un token JWT.

### Como obtener el token

1. Hacer `POST /api/auth/login` o `POST /api/auth/register`
2. El response incluye un campo `token`

### Como usar el token

Agregar en **cada request** el header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Ejemplo con fetch (Frontend)

```javascript
const response = await fetch('http://localhost:3000/api/transactions', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Ejemplo con axios (Frontend)

```javascript
// Configurar interceptor global
axios.defaults.baseURL = 'http://localhost:3000';
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Usar normalmente
const { data } = await axios.get('/api/transactions');
const { data: categories } = await axios.post('/api/categories', { name: 'Ventas', type: 'INCOME' });
```

### Flujo completo de autenticacion (Frontend)

```javascript
// 1. Login
const loginRes = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'victor@test.com', password: '123456' })
});
const { token, user } = await loginRes.json();
localStorage.setItem('token', token);

// 2. Al iniciar la app, verificar sesion con /me
const meRes = await fetch('/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
if (meRes.ok) {
  const user = await meRes.json();
  // Usuario autenticado, cargar dashboard
} else {
  // Token invalido, redirigir a login
  localStorage.removeItem('token');
  window.location.href = '/login';
}

// 3. Renovar token periodicamente
setInterval(async () => {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (res.ok) {
    const { token } = await res.json();
    localStorage.setItem('token', token);
  }
}, 23 * 60 * 60 * 1000); // Cada 23 horas

// 4. Logout
await fetch('/api/auth/logout', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
localStorage.removeItem('token');
```

> **El token expira en 24 horas.** Usa `/api/auth/refresh` para renovarlo sin que el usuario tenga que hacer login de nuevo.

> **Respuesta cuando el token es invalido o expiro:**
> ```json
> { "error": true, "message": "Token invalido o expirado." }
> ```
> **Status code:** `401`

---

## Modelos de Datos

### User (usuarios)
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `id` | String (UUID) | Identificador unico |
| `name` | String | Nombre completo |
| `email` | String | Email (unico) |
| `passwordHash` | String | Hash bcrypt de la contrasena |
| `businessType` | String | Tipo de negocio |
| `targetMarginPct` | Float | Margen objetivo (default: 40%) |
| `createdAt` | DateTime | Fecha de creacion |
| `updatedAt` | DateTime | Ultima actualizacion |

### Transaction (transacciones)
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `id` | String (UUID) | Identificador unico |
| `userId` | String | ID del usuario propietario |
| `categoryId` | String | ID de la categoria |
| `type` | Enum | `INCOME` o `EXPENSE` |
| `amount` | Float | Monto de la transaccion |
| `note` | String? | Nota opcional |
| `date` | DateTime | Fecha de la transaccion |
| `source` | Enum | `MANUAL`, `CHAT` o `VOICE` |
| `rawText` | String? | Texto original (voz/chat) |

### Category (categorias)
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `id` | String (UUID) | Identificador unico |
| `userId` | String | ID del usuario propietario |
| `name` | String | Nombre de la categoria |
| `type` | Enum | `INCOME` o `EXPENSE` |
| `color` | String | Color hex (default: #3B82F6) |
| `icon` | String | Icono (default: tag) |

### Alert (alertas)
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `id` | String (UUID) | Identificador unico |
| `userId` | String | ID del usuario |
| `message` | String | Mensaje de la alerta |
| `type` | Enum | `COST_INCREASE`, `LOW_MARGIN`, `CASH_FLOW` |
| `isRead` | Boolean | Si fue leida (default: false) |
| `createdAt` | DateTime | Fecha de creacion |

### Recommendation (recomendaciones)
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `id` | String (UUID) | Identificador unico |
| `userId` | String | ID del usuario |
| `categoryId` | String | Categoria relacionada |
| `title` | String | Titulo de la recomendacion |
| `description` | String | Descripcion detallada |
| `suggestedPrice` | Float | Precio sugerido |
| `currentPrice` | Float | Precio actual |
| `variationPct` | Float | Porcentaje de variacion |
| `status` | Enum | `ACTIVE`, `DISMISSED`, `APPLIED` |

### MonthlySummary (resumenes mensuales)
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `id` | Int | Identificador autoincremental |
| `userId` | String | ID del usuario |
| `categoryId` | String | Categoria |
| `year` | Int | Ano |
| `month` | Int | Mes (1-12) |
| `totalAmount` | Float | Monto total |
| `transactionCount` | Int | Cantidad de transacciones |
| `avgAmount` | Float | Promedio por transaccion |

---

## Estructura del Proyecto

```
BAFROVT/
├── prisma/
│   ├── schema.prisma          # Modelo de datos (tablas y relaciones)
│   ├── seed.ts                # Datos de prueba
│   └── migrations/            # Migraciones de BD
├── sql/
│   ├── security_setup.sql     # Roles y Row Level Security
│   ├── materialized_views.sql # Vistas para reportes financieros
│   └── functions.sql          # Funciones de logica de negocio
├── scripts/
│   ├── backup.sh              # Backup de la base de datos
│   ├── restore.sh             # Restauracion desde backup
│   └── maintenance.sh         # VACUUM ANALYZE + refresh vistas
├── src/
│   ├── index.ts               # Punto de entrada del servidor
│   ├── modules/
│   │   ├── auth/              # Login, registro, perfil, refresh, logout
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.schemas.ts
│   │   ├── transactions/      # CRUD de transacciones + resumen
│   │   │   ├── transaction.routes.ts
│   │   │   ├── transaction.controller.ts
│   │   │   ├── transaction.service.ts
│   │   │   └── transaction.schemas.ts
│   │   ├── categories/        # CRUD de categorias
│   │   │   ├── category.routes.ts
│   │   │   ├── category.controller.ts
│   │   │   ├── category.service.ts
│   │   │   └── category.schemas.ts
│   │   ├── alerts/            # Sistema de alertas
│   │   │   ├── alert.routes.ts
│   │   │   ├── alert.service.ts
│   │   │   └── alert.schemas.ts
│   │   ├── recommendations/   # Recomendaciones con IA
│   │   │   ├── recommendations.routes.ts
│   │   │   ├── recommendations.controller.ts
│   │   │   ├── recommendations.service.ts
│   │   │   └── recommendations.schemas.ts
│   │   ├── analytics/         # Dashboard: resumen y tendencias
│   │   │   ├── analytics.routes.ts
│   │   │   ├── analytics.controller.ts
│   │   │   └── analytics.service.ts
│   │   ├── chat/              # Chat en tiempo real
│   │   ├── voice/             # Procesamiento de voz
│   │   └── webhooks/          # Integracion n8n
│   └── shared/
│       ├── config/
│       │   ├── prisma.ts      # Conexion a PostgreSQL
│       │   ├── env.ts         # Validacion de variables (Zod)
│       │   └── socket.ts      # Configuracion Socket.io
│       ├── middleware/
│       │   ├── authGuard.ts   # Middleware de autenticacion JWT
│       │   ├── errorHandler.ts
│       │   └── validateBody.ts
│       └── types/             # Tipos TypeScript compartidos
├── .env.example               # Plantilla de variables de entorno
├── docker-compose.yml         # Configuracion Docker
├── package.json
├── prisma.config.ts           # Configuracion de Prisma
└── tsconfig.json
```

---

## Base de Datos Avanzada

### Seguridad (Row Level Security)

La base de datos implementa **RLS** para que cada usuario solo pueda ver sus propios datos:

- **Roles:** `app_user` (lectura/escritura) y `app_readonly` (solo lectura)
- **Tablas protegidas:** transactions, categories, monthly_summaries, alerts, recommendations
- **Politica:** cada query filtra automaticamente por `userId`

### Vistas Materializadas

Vistas pre-calculadas para reportes rapidos (se refrescan automaticamente con un trigger):

| Vista | Descripcion |
|-------|-------------|
| `resumen_financiero_mensual` | Ingresos, gastos y margen por mes |
| `gastos_por_categoria` | Desglose de gastos con porcentajes |
| `tendencia_semanal` | Patrones semanales de ingresos/gastos |

### Funciones SQL

| Funcion | Descripcion |
|---------|-------------|
| `calcular_margen_mensual(userId, year, month)` | Calcula ingresos, gastos y margen % |
| `generar_resumen_mensual(userId, year, month)` | Inserta/actualiza en monthly_summaries |
| `detectar_alertas(userId)` | Genera alertas automaticas |
| `obtener_balance_actual(userId)` | Balance en tiempo real |

### Indexes de Rendimiento

```
idx_tx_user_type_date     -> Transaction(userId, type, date)
idx_tx_amount_desc        -> Transaction(amount)
idx_monthly_year_month    -> MonthlySummary(year, month)
idx_alerts_unread         -> Alert(isRead)
```

---

## WebSocket - Chat en Tiempo Real

El servidor usa **Socket.io** para el chat. Conexion desde el frontend:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: { token: 'tu-jwt-token' }
});

// Escuchar mensajes
socket.on('message', (data) => {
  console.log('Nuevo mensaje:', data);
});

// Enviar mensaje
socket.emit('message', { content: 'Hola' });
```

---

## Scripts de Mantenimiento

```bash
# Backup de la base de datos
bash scripts/backup.sh

# Restaurar desde backup
bash scripts/restore.sh backups/backup_20260519.sql.gz

# Mantenimiento (VACUUM + refresh vistas + monitoreo)
bash scripts/maintenance.sh
```

---

## Errores Comunes

| Error | Solucion |
|-------|----------|
| `P1001: Can't reach database` | Docker Desktop abierto? Ejecuta: `docker start vf-postgres` |
| `ZodError: JWT_SECRET too_small` | Tu JWT_SECRET tiene menos de 32 caracteres |
| `ZodError: expected string, undefined` | Faltan variables en tu `.env` |
| `datasource.url is required` | Verifica que `prisma.config.ts` tenga `import 'dotenv/config'` |
| `EADDRINUSE: port 3000` | Algo ya usa el puerto 3000. Cierra ese proceso |
| `Cannot find module '@prisma/client'` | Ejecuta: `npx prisma generate` |
| `Foreign key constraint violated` | El `categoryId` no existe. Crea la categoria primero |
| `Token invalido o expirado` | Haz login de nuevo o usa `/api/auth/refresh` para renovar |

---

## Equipo

| Persona | Rol | Responsabilidad |
|---------|-----|-----------------|
| **Victor** | Persona E | Base de Datos, Integracion, QA |
| **Julio** | Persona C | Backend (Auth, Transactions, Categories, Alerts, Recommendations) |
| **Paola** | - | Estabilizacion y configuracion Prisma |
| **Gabi** | - | Merge e integracion de ramas |

---

<p align="center">
  <b>VoiceFinance AI</b> - Backend v1.1<br>
  <i>Universidad - Proyecto Grupal 2026</i>
</p>
