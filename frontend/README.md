# VoiceFinance AI — Frontend

Frontend oficial de **VoiceFinance AI**, una plataforma fintech inteligente diseñada para la gestión financiera de pequeños negocios mediante inteligencia artificial, analítica financiera, procesamiento de voz y comunicación en tiempo real.

Construido con tecnologías modernas enfocadas en escalabilidad, mantenibilidad y experiencia de usuario profesional.

---

# Descripción del Proyecto

VoiceFinance AI permite a los usuarios:

- Gestionar ingresos y gastos
- Registrar transacciones manualmente
- Registrar transacciones mediante voz
- Interactuar con un asistente financiero basado en IA
- Visualizar métricas financieras en tiempo real
- Recibir alertas automáticas
- Obtener recomendaciones inteligentes
- Gestionar categorías financieras
- Mantener autenticación segura con JWT
- Utilizar funcionalidades en tiempo real mediante WebSocket

---

# Stack Tecnológico

## Frontend

| Tecnología | Versión | Uso |
|----------|---------|-----|
| React | 19 | Framework principal |
| Vite | 8 | Build tool |
| TypeScript | 5+ | Tipado estático |
| Tailwind CSS | 4 | Sistema de estilos |
| React Router DOM | 7 | Navegación |
| Zustand | 5 | Estado global |
| Axios | 1+ | Cliente HTTP |
| Socket.io Client | 4+ | Comunicación en tiempo real |
| React Query (@tanstack/react-query) | 5 | Manejo de estado servidor |
| Recharts | 3 | Gráficos dashboard |
| Lucide React | latest | Iconografía |
| clsx | latest | Clases condicionales |
| tailwind-merge | latest | Merge de utilidades Tailwind |

---

# Instalación

## 1. Clonar repositorio

```bash
git clone https://github.com/VoiceTeamm/BAFROVT.git
cd BAFROVT/frontend
```

---

## 2. Instalar dependencias

```bash
npm install
```

---

## 3. Configurar variables de entorno

Crear:

```bash
frontend/.env.local
```

Contenido:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

---

## 4. Ejecutar proyecto

```bash
npm run dev
```

Frontend:

```bash
http://localhost:5173
```

---

## 5. Build producción

```bash
npm run build
```

---

## 6. Linter

```bash
npm run lint
```

---

# Arquitectura del Frontend

Estructura principal:

```text
src/
├── components/
│   ├── ui/
│   ├── auth/
│   ├── chat/
│   ├── dashboard/
│   ├── transactions/
│   ├── recommendations/
│   └── config/
│
├── hooks/
│
├── services/
│
├── store/
│
├── routes/
│
├── pages/
│
├── layouts/
│
├── types/
│
└── lib/
```

---

# Estructura Detallada

## components/

Contiene componentes reutilizables y módulos visuales.

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
```

Sistema de diseño compartido.

---

### auth/

```text
auth/
├── LoginForm.tsx
├── RegisterForm.tsx
└── ProtectedRoute.tsx
```

Módulo autenticación.

---

### chat/

```text
chat/
├── ChatWindow.tsx
├── ChatInput.tsx
├── MessageBubble.tsx
├── TypingIndicator.tsx
└── VoiceButton.tsx
```

Módulo asistente IA + voz.

---

### dashboard/

Widgets dashboard financiero.

---

### transactions/

Tabla, filtros y formularios transaccionales.

---

### recommendations/

Tarjetas y acciones de recomendaciones.

---

### config/

Panel de configuración.

---

# hooks/

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

# services/

Comunicación backend.

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

# store/

Estado global con Zustand.

```text
store/
├── authStore.ts
└── chatStore.ts
```

---

# layouts/

Layouts generales.

```text
layouts/
├── MainLayout.tsx
└── Navbar.tsx
```

---

# pages/

Páginas principales.

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

# Rutas Frontend

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

Base API:

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

## Chat

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

## Analytics

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

Eventos:

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
3. JWT se almacena en Zustand + localStorage
4. Axios interceptor agrega Authorization header
5. ProtectedRoute valida autenticación
6. `/api/auth/me` valida sesión activa
7. `/api/auth/refresh` renueva token
8. logout elimina sesión

---

# Distribución del Trabajo

## Persona A — Frontend Inteligente

Responsable de:

### Autenticación
- Login
- Registro
- JWT
- Refresh token
- Logout
- Protected routes
- Persistencia sesión

### Chat IA
- interfaz chat
- envío mensajes
- respuestas IA
- typing indicator

### Voz
- MediaRecorder
- upload audio
- transcripción

### Socket
- realtime
- recomendaciones
- eventos chat

### UI Auth
- rediseño premium fintech
- login
- register

---

## Persona B — UI Financiera

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
- acciones

### Config
- configuración usuario

Estado:

```text
UI completada
Integración backend pendiente
```

---

# Estado Actual del Proyecto

| Módulo | Estado |
|-------|--------|
| Arquitectura frontend | Completa |
| UI sistema diseño | Completa |
| Auth frontend | Completa |
| Chat frontend | Completa |
| Voice frontend | Completa |
| Socket frontend | Completa |
| Dashboard UI | Completa |
| Transactions UI | Completa |
| Recommendations UI | Completa |
| Config UI | Completa |
| Integración backend Persona A | Lista para conexión |
| Integración backend Persona B | Pendiente |
| Proyecto end-to-end | En integración |

---

# Flujo Git

Branches:

```text
main
develop
frontend
backend
```

Workflow:

```bash
git checkout develop
git pull
git checkout -b feat/nueva-feature
```

Commit:

```bash
git add .
git commit -m "feat: descripcion del cambio"
```

Push:

```bash
git push origin nombre-rama
```

Pull Request:

```text
develop
```

---

# Equipo

| Rol | Responsabilidad |
|-----|----------------|
| Persona A | Auth, Chat, Voice, Socket |
| Persona B | Dashboard, Transactions, Config, Recommendations |
| Backend Team | API REST, Prisma, PostgreSQL, WebSocket, IA |

---

# Notas

- Backend debe estar activo para integración completa
- JWT requerido para rutas protegidas
- Socket requiere autenticación
- Persona B pendiente de conexión real con backend
- Proyecto preparado para integración final