# VoiceFinance AI - Backend

## Requisitos

- Node.js v18+
- Docker Desktop (con el contenedor `vf-postgres` corriendo)
- Git

## Instalacion

```bash
git clone https://github.com/VoiceTeamm/BAFROVT.git
cd BAFROVT
git checkout backend
npm install
```

## Configuracion

Crear archivo `.env` en la raiz del proyecto:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/voicefinance
JWT_SECRET=voicefinance_secret_key_2024
NODE_ENV=development
PORT=3000
```

## Base de datos

1. Abrir Docker Desktop y verificar que el contenedor `vf-postgres` este corriendo (puerto 5432)
2. Generar el cliente de Prisma y sincronizar schema:

```bash
npx prisma generate
npx prisma db push
```

3. Cargar datos de prueba:

```bash
npx ts-node prisma/seed.ts
```

Usuario de prueba: `carlos@test.com`

## Iniciar el servidor

```bash
npm run dev
```

El servidor arranca en `http://localhost:3000`

## Verificar que funciona

Abrir en el navegador: `http://localhost:3000/health`

Respuesta esperada:
```json
{"status":"ok","message":"VoiceFinance API running"}
```

## Endpoints disponibles

### Autenticacion (sin token)

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | /api/auth/register | Registrar usuario |
| POST | /api/auth/login | Iniciar sesion |

### Transacciones (requieren token JWT)

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | /api/transactions | Crear transaccion |
| GET | /api/transactions | Listar transacciones |
| GET | /api/transactions/summary | Resumen financiero |
| GET | /api/transactions/:id | Obtener transaccion |
| PUT | /api/transactions/:id | Actualizar transaccion |
| DELETE | /api/transactions/:id | Eliminar transaccion |

### Como usar el token

1. Hacer login o register para obtener el token
2. En cada request agregar el header:

```
Authorization: Bearer <tu_token_aqui>
```

## Estructura del proyecto

```
src/
  modules/
    auth/           -> Login y registro
    transactions/   -> CRUD de transacciones
    chat/           -> Chat con WebSocket
    voice/          -> Procesamiento de voz
    recommendations/ -> Recomendaciones IA
    webhooks/       -> Webhooks n8n
  shared/
    config/         -> Prisma, env, socket
    middleware/      -> authGuard, errorHandler, validateBody
    types/          -> Tipos TypeScript
prisma/
  schema.prisma     -> Modelo de datos
  seed.ts           -> Datos de prueba
sql/
  security_setup.sql -> Roles y RLS de PostgreSQL
```

## Notas importantes

- El frontend corre en `http://localhost:5173` (rama frontend)
- El backend corre en `http://localhost:3000` (rama backend)
- CORS esta configurado para aceptar requests desde `http://localhost:5173`
- Socket.io esta activo para el chat en tiempo real
