# Hooks

Esta carpeta contiene hooks personalizados para encapsular lógica reutilizable del frontend.

## Estructura

hooks/
- useAuth.ts
- useChat.ts
- useSocket.ts
- useVoice.ts

---

## Hooks

### useAuth.ts
Gestiona autenticación del usuario.

Responsabilidades:
- iniciar sesión
- cerrar sesión
- validar autenticación
- interactuar con authStore

---

### useChat.ts
Gestiona lógica del chat.

Responsabilidades:
- enviar mensajes
- recibir respuestas
- manejar historial
- controlar estado de carga

---

### useSocket.ts
Gestiona conexión en tiempo real.

Responsabilidades:
- conectar con backend
- escuchar eventos
- actualizar interfaz en tiempo real

---

### useVoice.ts
Gestiona captura y procesamiento de audio.

Responsabilidades:
- iniciar grabación
- detener grabación
- enviar audio al backend
- recibir transcripción