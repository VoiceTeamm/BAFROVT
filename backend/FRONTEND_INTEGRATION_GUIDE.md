# Frontend Integration Guide — VoiceFinance API

> Generated from backend source analysis on 2026-05-20 (branch: `backend`).  
> Do not modify the backend. Build the frontend against this contract.

---

## 1. Environment Setup

### Required `.env` Variables

The server **crashes on startup** if any of these are missing (validated with Zod on boot):

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | **YES** | PostgreSQL connection string |
| `JWT_SECRET` | **YES** | Must be at least 32 characters |
| `OPENAI_API_KEY` | **YES** | Used by chat and voice transcription |
| `REDIS_URL` | **YES** | Redis connection string |
| `N8N_WEBHOOK_URL` | **YES** | URL n8n uses to send recommendations |
| `PORT` | no | Default: `3000` |
| `FRONTEND_URL` | no | CORS origin. Default: `http://localhost:5173` |
| `N8N_WEBHOOK_SECRET` | no | Header secret for webhook security |

> **Docker password mismatch**: `docker-compose.yml` sets `POSTGRES_PASSWORD: secret`, but `.env.example` uses `postgres`. Use `secret` as the password when running with Docker Compose.

### Correct `.env` for Docker Compose

```env
DATABASE_URL=postgresql://postgres:secret@localhost:5432/voicefinance?schema=public
JWT_SECRET=una_clave_muy_larga_y_segura_min_32_characters_aqui
OPENAI_API_KEY=sk-...
REDIS_URL=redis://localhost:6379
N8N_WEBHOOK_URL=http://localhost:5678/webhook/recommendation
N8N_WEBHOOK_SECRET=tu_secreto_webhook
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Start the Database

```bash
docker-compose up -d          # start postgres + redis
npx prisma db push            # sync schema (first time or after schema changes)
npx ts-node prisma/seed.ts    # optional: load test data
npm run dev                   # start backend
```

---

## 2. Base URL & Headers

```
Base URL:  http://localhost:3000
```

Every **protected route** requires:
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 3. Authentication Flow

### How it works

1. User registers or logs in → server returns `{ user, token }`.
2. Frontend stores `token` in `localStorage` (or a secure cookie).
3. Every subsequent request includes `Authorization: Bearer <token>`.
4. Token lifetime: **24 hours** (`expiresIn: '24h'`).
5. JWT payload: `{ userId: string }` — this is what the server reads on protected routes.

### Token Storage Recommendation

```ts
// After login/register
localStorage.setItem('token', response.token);
localStorage.setItem('user', JSON.stringify(response.user));

// On every API request
const token = localStorage.getItem('token');
headers: { Authorization: `Bearer ${token}` }

// On logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

---

## 4. Socket.io (Real-Time Recommendations)

The server uses Socket.io for real-time recommendation push events.

Connection pattern:

```ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: { token: localStorage.getItem('token') },
});

socket.on('new_recommendation', ({ recommendation }) => {
  // Show toast / update recommendations list
});
```

Users are automatically joined to room `user:<userId>` on connection.

---

## 5. Endpoint Reference

### 5.1 Health Check (public)

```
GET /health
```

**Response 200**
```json
{ "status": "ok", "timestamp": "2026-05-20T16:00:00.000Z" }
```

---

### 5.2 Auth — `/api/auth`

> **No auth required** for any auth routes.

#### POST /api/auth/register

Creates a new user account and returns a JWT.

**Request body**
```json
{
  "name": "Carlos Mamani",
  "email": "carlos@example.com",
  "password": "mysecretpassword",
  "businessType": "restaurant"
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | string | YES | min 2 chars |
| `email` | string | YES | valid email |
| `password` | string | YES | min 6 chars |
| `businessType` | string | no | default: `"general"` |

**Response 201**
```json
{
  "user": {
    "id": "uuid",
    "name": "Carlos Mamani",
    "email": "carlos@example.com",
    "businessType": "restaurant"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error 400** — email already registered
```json
{ "error": true, "message": "El email ya está registrado" }
```

**Error 400** — validation failure
```json
{
  "error": true,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Email inválido" },
    { "field": "password", "message": "La contraseña debe tener al menos 6 caracteres" }
  ]
}
```

---

#### POST /api/auth/login

**Request body**
```json
{
  "email": "carlos@example.com",
  "password": "mysecretpassword"
}
```

**Response 200**
```json
{
  "user": {
    "id": "uuid",
    "name": "Carlos Mamani",
    "email": "carlos@example.com",
    "businessType": "restaurant"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error 401** — wrong credentials
```json
{ "error": true, "message": "Credenciales inválidas" }
```

---

### 5.3 Transactions — `/api/transactions`

> **All routes require `Authorization: Bearer <token>`**

#### POST /api/transactions — Create transaction

**Request body**
```json
{
  "type": "INCOME",
  "amount": 1500.00,
  "category": "Ventas",
  "description": "Venta del lunes",
  "date": "2026-05-20T10:00:00.000Z"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | `"INCOME"` \| `"EXPENSE"` | YES | |
| `amount` | number | YES | must be positive |
| `categoryId` | string (UUID) | no | use existing category ID |
| `category` | string | no | category name — auto-created if not exists |
| `description` | string | no | stored as `note` |
| `date` | ISO 8601 string | no | default: now |

> If both `categoryId` and `category` are omitted, defaults to a category named `"Other"`.

**Response 201** — returns full transaction with category
```json
{
  "id": "uuid",
  "userId": "uuid",
  "categoryId": "uuid",
  "type": "INCOME",
  "amount": 1500,
  "note": "Venta del lunes",
  "date": "2026-05-20T10:00:00.000Z",
  "source": "MANUAL",
  "rawText": null,
  "createdAt": "2026-05-20T10:00:00.000Z",
  "category": {
    "id": "uuid",
    "name": "Ventas",
    "type": "INCOME",
    "color": "#3B82F6",
    "icon": "tag",
    "userId": "uuid"
  }
}
```

---

#### GET /api/transactions — List transactions (paginated)

**Query params**
```
?page=1&limit=10
```

**Response 200**
```json
{
  "transactions": [ /* array of transaction objects (same shape as above) */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 47,
    "totalPages": 5
  }
}
```

---

#### GET /api/transactions/summary — Financial summary for a date range

**Query params** (both required)
```
?startDate=2026-05-01&endDate=2026-05-31
```

**Response 200**
```json
{
  "totalIncome": 5500,
  "totalExpenses": 1600,
  "balance": 3900,
  "byCategory": {
    "Ventas": 5500,
    "Insumos": 1250,
    "Servicios": 350
  },
  "transactionCount": 7
}
```

**Error 400** — missing query params
```json
{ "error": true, "message": "Se requieren los parámetros startDate y endDate" }
```

---

#### GET /api/transactions/:id — Get one transaction

**Response 200** — same shape as create response  
**Error 404**
```json
{ "error": true, "message": "Transacción no encontrada" }
```

---

#### PUT /api/transactions/:id — Update transaction

All fields are optional (partial update).

**Request body**
```json
{
  "amount": 1800,
  "description": "Venta actualizada"
}
```

**Response 200** — updated transaction with category

---

#### DELETE /api/transactions/:id — Delete transaction

**Response 200**
```json
{ "message": "Transacción eliminada correctamente" }
```

---

### 5.4 Categories — `/api/categories`

> **All routes require `Authorization: Bearer <token>`**

Categories are per-user and scoped to a type (`INCOME` or `EXPENSE`). The `color` and `icon` fields have defaults (`#3B82F6` and `tag`).

#### GET /api/categories — List all categories

**Response 200**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "Ventas",
    "type": "INCOME",
    "color": "#22C55E",
    "icon": "dollar-sign"
  },
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "Insumos",
    "type": "EXPENSE",
    "color": "#EF4444",
    "icon": "shopping-cart"
  }
]
```

---

#### POST /api/categories — Create category

**Request body**
```json
{
  "name": "Alquiler",
  "type": "EXPENSE"
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | string | YES | 2–50 chars |
| `type` | `"INCOME"` \| `"EXPENSE"` | YES | |

**Response 201** — category object  
**Error 400** — duplicate name + type for same user
```json
{ "error": "Ya existe una categoria con ese nombre para este tipo" }
```

---

#### GET /api/categories/:id — Get one category

**Response 200** — category object  
**Error 404**
```json
{ "error": "Categoría no encontrada" }
```

---

#### PUT /api/categories/:id — Update category

All fields optional.

**Request body**
```json
{ "name": "Servicios básicos" }
```

**Response 200** — updated category

---

#### DELETE /api/categories/:id — Delete category

> Cannot delete a category that has associated transactions.

**Response 200**
```json
{ "message": "Categoría eliminada correctamente" }
```

**Error 400**
```json
{ "error": "No se puede eliminar: tiene transacciones asociadas" }
```

---

### 5.5 Alerts — `/api/alerts`

> **Requires `Authorization: Bearer <token>`**

#### GET /api/alerts — List alerts

**Query params** (optional)
```
?unread=true    # only return unread alerts
```

**Response 200**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "message": "Tus gastos en insumos subieron un 20%",
    "type": "COST_INCREASE",
    "isRead": false,
    "createdAt": "2026-05-20T10:00:00.000Z"
  }
]
```

Alert types: `COST_INCREASE` | `LOW_MARGIN` | `CASH_FLOW`

---

#### PATCH /api/alerts/:id/read — Mark alert as read

No body required.

**Response 200**
```json
{
  "message": "Alerta marcada como leída",
  "alert": { /* alert object with isRead: true */ }
}
```

**Error 404**
```json
{ "error": true, "message": "Alerta no encontrada" }
```

---

### 5.6 Recommendations — `/api/recommendations`

> **Requires `Authorization: Bearer <token>`**

Recommendations are created externally by n8n and pushed via webhook. The frontend reads and updates them.

#### GET /api/recommendations — List recommendations

**Query params** (optional)
```
?status=ACTIVE       # ACTIVE | DISMISSED | APPLIED
```

**Response 200**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "categoryId": "uuid",
    "title": "Reducir costo de insumos",
    "description": "Buscar proveedores alternativos",
    "suggestedPrice": 680,
    "currentPrice": 800,
    "variationPct": -15,
    "status": "ACTIVE",
    "createdAt": "2026-05-20T10:00:00.000Z",
    "category": {
      "id": "uuid",
      "name": "Insumos",
      "type": "EXPENSE"
    }
  }
]
```

---

#### PATCH /api/recommendations/:id — Update recommendation status

**Request body**
```json
{ "status": "APPLIED" }
```

Status values: `"DISMISSED"` | `"APPLIED"` (cannot be reset to `ACTIVE`)

**Response 200**
```json
{
  "message": "Recomendacion actualizada",
  "recommendation": { /* full recommendation object */ }
}
```

---

### 5.7 AI Chat — `/api/chat`

> **Requires auth**. Sends a message to GPT-4o with context from the user's transaction history. All chat history is persisted in `agent_messages` table.

#### POST /api/chat

**Request body**
```json
{
  "message": "¿Cuánto gané esta semana?",
  "history": [
    { "role": "user", "content": "Registra una venta de 500 Bs" },
    { "role": "assistant", "content": "Anotado, ¿de qué categoría?" }
  ]
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `message` | string | YES | current user message |
| `history` | array | no | client-side history (optional, server uses DB history) |

> The server always fetches the last 20 messages from the DB for context. The `history` field in the request is accepted but the DB history takes precedence.

**Response 200**
```json
{ "reply": "Esta semana tus ingresos totales son 3,200 Bs distribuidos en..." }
```

**Error 400**
```json
{ "error": "El campo \"message\" es requerido." }
```

---

### 5.8 Voice Transcription — `/api/voice`

> **Requires auth**. Uses OpenAI Whisper for STT and GPT-4o to extract a structured transaction entity from speech.

#### POST /api/voice/transcribe

Send audio as `multipart/form-data` with field name `audio`.

```
Content-Type: multipart/form-data
Authorization: Bearer <token>

Field: audio (file)
```

**Accepted formats**: `audio/webm`, `audio/mp4`, `audio/mpeg`, `audio/wav`, `audio/ogg`, `audio/mp3`  
**Max file size**: 25 MB

**Response 200**
```json
{
  "transcription": "Registra una venta de mil quinientos bolivianos en comida",
  "entity": {
    "tipo": "venta",
    "producto": "comida",
    "cantidad": null,
    "monto": 1500,
    "nota": null
  }
}
```

The `entity.tipo` will be `"venta"` or `"gasto"` (maps to `INCOME`/`EXPENSE`). After receiving this, the frontend should confirm with the user and then call `POST /api/transactions` to save.

---

### 5.9 Webhooks — `/api/webhooks` (internal / n8n)

> **Not called by the frontend.** Called by n8n automation.

#### POST /api/webhooks/recommendation

Requires header `x-webhook-secret: <N8N_WEBHOOK_SECRET>`.

**Request body**
```json
{
  "userId": "uuid",
  "categoryId": "uuid",
  "title": "Aumentar precio de menú",
  "description": "Los costos de insumos subieron 15%, considere ajustar precios",
  "suggestedPrice": 25,
  "currentPrice": 20,
  "variationPct": 25
}
```

After saving, emits `new_recommendation` via Socket.io to `user:<userId>` room.

---

## 6. Error Response Shapes

There are three error shapes you will encounter:

### Auth / general errors
```json
{ "error": true, "message": "Description of the error" }
```

### Validation errors (400 from `validateBody`)
```json
{
  "error": true,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Email inválido" },
    { "field": "password", "message": "La contraseña debe tener al menos 6 caracteres" }
  ]
}
```

### Category validation errors (inline Zod)
```json
{
  "error": "Datos inválidos",
  "details": [ { "code": "...", "message": "...", "path": ["field"] } ]
}
```

### HTTP status codes summary

| Status | When |
|---|---|
| 200 | Success (GET, PATCH, DELETE, PUT) |
| 201 | Created (POST) |
| 400 | Validation error or bad request |
| 401 | Missing or invalid JWT |
| 404 | Resource not found |
| 500 | Server/DB error |

---

## 7. Database Models (reference)

```
User
  id, name, email, businessType, targetMarginPct (default 40), createdAt, updatedAt

Category
  id, userId, name, type (INCOME|EXPENSE), color (#3B82F6), icon ("tag")

Transaction
  id, userId, categoryId, type, amount, note, date, source (CHAT|VOICE|MANUAL), rawText, createdAt

MonthlySummary
  id, userId, categoryId, year, month, totalAmount, transactionCount, avgAmount

Recommendation
  id, userId, categoryId, title, description, suggestedPrice, currentPrice, variationPct,
  status (ACTIVE|DISMISSED|APPLIED), createdAt

Alert
  id, userId, message, type (COST_INCREASE|LOW_MARGIN|CASH_FLOW), isRead, createdAt

AgentMessage
  id, userId, role (USER|ASSISTANT), content, metadata, createdAt
```

---

## 8. Recommended Frontend Pages & Components

Based on the backend modules:

### Pages

| Page | Route | Description |
|---|---|---|
| Login | `/login` | `POST /api/auth/login` |
| Register | `/register` | `POST /api/auth/register` |
| Dashboard | `/` | Summary card + recent transactions + alert badge |
| Transactions | `/transactions` | Paginated list + create form |
| Categories | `/categories` | List + create/edit/delete |
| AI Chat | `/chat` | Chat UI with message history |
| Voice Input | `/voice` (or modal) | Record audio → confirm entity → save |
| Recommendations | `/recommendations` | Filterable list (ACTIVE/APPLIED/DISMISSED) |
| Alerts | `/alerts` | List with mark-as-read action |

### Key Components

- `AuthGuard` — wraps private routes, redirects to `/login` if no token or 401
- `ApiClient` — axios/fetch wrapper that injects `Authorization` header automatically
- `TransactionForm` — shared form for create/edit, includes category selector
- `VoiceRecorder` — records MediaRecorder audio blob, sends to `/api/voice/transcribe`
- `ChatWindow` — maintains local `history` array, scrolls to bottom
- `AlertBadge` — shows unread alert count in header, polls `GET /api/alerts?unread=true`
- `SummaryCard` — calls `GET /api/transactions/summary` with current month dates
- `RecommendationCard` — shows title/description/price diff + APPLY/DISMISS buttons

### API Client Template

```ts
const API_BASE = 'http://localhost:3000';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers ?? {}) },
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(data.message ?? 'Request failed');
  }
  return data;
}
```

---

## 9. Verified Backend Behavior

All three security bugs found during review have been patched (commit `2710687`):

- `/api/alerts` and `/api/recommendations` now enforce `authGuard` — unauthenticated requests return `401` before touching the DB.
- Socket.io JWT middleware now correctly reads `decoded.userId` matching the token payload.
- `.env.example` uses `postgres:secret` (matching `docker-compose.yml`) and is encoded as UTF-8.

---

## 10. curl Examples

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","email":"ana@test.com","password":"password123","businessType":"tienda"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@test.com","password":"password123"}'

# (store token from response)
TOKEN="eyJhbGci..."

# Create transaction
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"INCOME","amount":500,"category":"Ventas","description":"Venta tarde"}'

# List transactions
curl http://localhost:3000/api/transactions?page=1&limit=10 \
  -H "Authorization: Bearer $TOKEN"

# Summary for current month
curl "http://localhost:3000/api/transactions/summary?startDate=2026-05-01&endDate=2026-05-31" \
  -H "Authorization: Bearer $TOKEN"

# List categories
curl http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN"

# Create category
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alquiler","type":"EXPENSE"}'

# List alerts (unread only)
curl "http://localhost:3000/api/alerts?unread=true" \
  -H "Authorization: Bearer $TOKEN"

# Mark alert as read
curl -X PATCH http://localhost:3000/api/alerts/<alert-id>/read \
  -H "Authorization: Bearer $TOKEN"

# List active recommendations
curl "http://localhost:3000/api/recommendations?status=ACTIVE" \
  -H "Authorization: Bearer $TOKEN"

# Apply a recommendation
curl -X PATCH http://localhost:3000/api/recommendations/<rec-id> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"APPLIED"}'

# Chat
curl -X POST http://localhost:3000/api/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"¿Cuánto gasté esta semana?"}'
```
