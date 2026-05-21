# VoiceFinance AI — Frontend

Frontend oficial de **VoiceFinance AI**, una plataforma fintech inteligente diseñada para la gestión financiera de pequeños negocios mediante inteligencia artificial, procesamiento de voz, analítica financiera y comunicación en tiempo real.

Este proyecto está construido con una arquitectura moderna basada en **React + TypeScript + Vite**, enfocada en escalabilidad, mantenibilidad y experiencia de usuario profesional.

---

# Descripción del Proyecto

VoiceFinance AI permite a los usuarios:

- Autenticarse de forma segura con JWT
- Gestionar ingresos y gastos
- Registrar transacciones manualmente
- Registrar transacciones mediante voz
- Interactuar con un asistente financiero basado en IA
- Visualizar métricas financieras
- Recibir alertas automáticas
- Obtener recomendaciones inteligentes
- Gestionar categorías financieras
- Mantener comunicación en tiempo real mediante WebSocket

---

# Stack Tecnológico

## Frontend

| Tecnología | Versión | Propósito |
|----------|---------|----------|
| React | 19 | Framework UI |
| Vite | 8 | Build tool |
| TypeScript | 5+ | Tipado estático |
| Tailwind CSS | 4 | Sistema de estilos |
| React Router DOM | 7 | Routing |
| Zustand | 5 | Estado global |
| Axios | 1+ | Cliente HTTP |
| Socket.io Client | 4+ | Comunicación tiempo real |
| React Query (@tanstack/react-query) | 5 | Server state |
| Recharts | 3 | Visualización dashboard |
| Lucide React | latest | Iconografía |
| clsx | latest | Clases condicionales |
| tailwind-merge | latest | Merge Tailwind |

---

# Instalación

## Clonar repositorio

```bash
git clone https://github.com/VoiceTeamm/BAFROVT.git
cd BAFROVT/frontend
```

## Instalar dependencias

```bash
npm install
```

## Ejecutar proyecto

```bash
npm run dev
```

Frontend:

```bash
http://localhost:5173
```

## Build producción

```bash
npm run build
```

## Ejecutar linter

```bash
npm run lint
```

---

# Variables de Entorno

Crear archivo:

```bash
frontend/.env.local
```

Contenido:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

### Variables

| Variable | Descripción |
|---------|-------------|
| VITE_API_URL | URL base del backend REST API |
| VITE_SOCKET_URL | URL del servidor Socket.io |

---

# Arquitectura Frontend

## Estructura principal

```text
src/
├── components/
├── hooks/
├── services/
├── store/
├── routes/
├── pages/
├── layouts/
├── types/
└── lib/
```

---

# Arquitectura Detallada

## components/

Contiene componentes visuales reutilizables y módulos funcionales.

```text
components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Loader.tsx
│   ├── Table.tsx
│   └── Badge.tsx
│
├── auth/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── ProtectedRoute.tsx
│
├── chat/
│   ├── ChatWindow.tsx
│   ├── ChatInput.tsx
│   ├── MessageBubble.tsx
│   ├── TypingIndicator.tsx
│   └── VoiceButton.tsx
│
├── dashboard/
│
├── transactions/
│
├── recommendations/
│
└── config/
```

---

## hooks/

Hooks personalizados.

```text
hooks/
├── useAuth.ts
├── useChat.ts
├── useVoice.ts
├── useSocket.ts
├── useTransactions.ts
└── useAnalytics.ts
```

---

## services/

Servicios de integración backend.

```text
services/
├── api.ts
├── authService.ts
├── chatService.ts
├── voiceService.ts
├── socketService.ts
├── analytics.service.ts
├── transaction.service.ts
└── recommendation.service.ts
```

---

## store/

Estado global con Zustand.

```text
store/
├── authStore.ts
└── chatStore.ts
```

---

## layouts/

Layouts generales.

```text
layouts/
├── MainLayout.tsx
└── Navbar.tsx
```

---

## pages/

Páginas del sistema.

```text
pages/
├── LoginPage.tsx
├── RegisterPage.tsx
├── DashboardPage.tsx
├── ChatPage.tsx
├── TransactionsPage.tsx
├── RecommendationsPage.tsx
└── ConfigPage.tsx
```

---

## routes/

Definición de rutas protegidas y públicas.

---

## types/

Interfaces TypeScript compartidas.

---

## lib/

Utilidades auxiliares.

---

# Sistema de Diseño

Paleta oficial VoiceFinance AI:

| Token | Hex |
|------|-----|
| Primario | #2563EB |
| Primario Hover | #1D4ED8 |
| Secundario | #38BDF8 |
| Fondo Claro | #F8FAFC |
| Fondo Oscuro | #0F172A |
| Card Claro | #FFFFFF |
| Card Oscuro | #1E293B |
| Texto Claro | #0F172A |
| Texto Oscuro | #F1F5F9 |
| Éxito | #22C55E |
| Error | #EF4444 |
| Warning | #F59E0B |

Configurado en:

```bash
src/index.css
```

---

# Rutas del Frontend

| Ruta | Página | Protegida |
|------|--------|-----------|
| /login | LoginPage | No |
| /register | RegisterPage | No |
| /dashboard | DashboardPage | Sí |
| /chat | ChatPage | Sí |
| /transactions | TransactionsPage | Sí |
| /recommendations | RecommendationsPage | Sí |
| /config | ConfigPage | Sí |

---

# Integración Backend

Base URL:

```bash
http://localhost:3000/api
```

---

## Autenticación

| Método | Endpoint |
|--------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| GET | /api/auth/me |
| POST | /api/auth/refresh |
| POST | /api/auth/logout |

---

## Chat IA

| Método | Endpoint |
|--------|----------|
| POST | /api/chat |

---

## Voz

| Método | Endpoint |
|--------|----------|
| POST | /api/voice/transcribe |

---

## Transacciones

| Método | Endpoint |
|--------|----------|
| POST | /api/transactions |
| GET | /api/transactions |
| GET | /api/transactions/:id |
| PUT | /api/transactions/:id |
| DELETE | /api/transactions/:id |
| GET | /api/transactions/summary |

---

## Categorías

| Método | Endpoint |
|--------|----------|
| GET | /api/categories |
| GET | /api/categories/:id |
| POST | /api/categories |
| PUT | /api/categories/:id |
| DELETE | /api/categories/:id |

---

## Alertas

| Método | Endpoint |
|--------|----------|
| GET | /api/alerts |
| PATCH | /api/alerts/:id/read |

---

## Recomendaciones

| Método | Endpoint |
|--------|----------|
| GET | /api/recommendations |
| PATCH | /api/recommendations/:id |

---

## Analítica

| Método | Endpoint |
|--------|----------|
| GET | /api/analytics/summary |
| GET | /api/analytics/trends |

---

# Socket.io

Conexión:

```ts
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  auth: {
    token: jwtToken
  }
});
```

Eventos soportados:

```text
new_recommendation
chat:typing
chat:response
chat:error
n8n:transaction
n8n:alert
n8n:recommendation
```

---

# Flujo de Autenticación

1. Usuario inicia sesión
2. Backend devuelve JWT
3. Token se guarda en Zustand + localStorage
4. Axios interceptor agrega Authorization header
5. ProtectedRoute valida sesión
6. `/api/auth/me` verifica usuario autenticado
7. `/api/auth/refresh` renueva token
8. logout destruye sesión

---

# Distribución del Proyecto

## Persona A — Frontend Inteligente

Responsable de:

### Autenticación
- Login
- Registro
- Persistencia JWT
- Refresh token
- Logout
- Protected routes

### Chat IA
- Interfaz chat
- Envío de mensajes
- Respuestas IA
- Typing indicator

### Voz
- MediaRecorder
- Upload audio
- Transcripción

### Socket
- Comunicación realtime
- Eventos chat
- Eventos recomendaciones

### UI
- Rediseño premium fintech
- Login
- Register

Estado:

```text
Completado
Listo para integración backend
```

---

## Persona B — Módulo Financiero

Responsable de:

### Dashboard
- KPI cards
- métricas
- gráficos

### Transactions
- tabla
- filtros
- formularios

### Recommendations
- cards
- acciones UI

### Config
- configuración usuario

Estado:

```text
UI completada
Pendiente conexión backend
```

---

# Estado del Proyecto

| Módulo | Estado |
|-------|--------|
| Arquitectura frontend | Completa |
| Sistema diseño | Completo |
| Auth frontend | Completo |
| Chat frontend | Completo |
| Voice frontend | Completo |
| Socket frontend | Completo |
| Dashboard UI | Completo |
| Transactions UI | Completo |
| Recommendations UI | Completo |
| Config UI | Completo |
| Integración backend Persona A | Lista |
| Integración backend Persona B | Pendiente |
| Proyecto end-to-end | En integración |

---

# Workflow Git

Branches:

```text
main
develop
frontend
backend
```

Flujo recomendado:

```bash
git checkout develop
git pull
git checkout -b feat/nueva-feature
```

Commit:

```bash
git add .
git commit -m "feat: descripcion"
```

Push:

```bash
git push origin nombre-rama
```

Pull Request hacia:

```text
develop
```

---

# Equipo

| Rol | Responsabilidad |
|-----|----------------|
| Persona A | Auth, Chat, Voice, Socket |
| Persona B | Dashboard, Transactions, Recommendations, Config |
| Backend Team | API REST, Prisma, PostgreSQL, WebSocket, IA |

---

# Notas

- Backend debe estar activo
- JWT requerido para rutas protegidas
- Socket requiere autenticación
- Persona B pendiente integración real
- Proyecto preparado para integración completa