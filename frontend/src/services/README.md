# Services

Esta carpeta contiene servicios encargados de la comunicación entre frontend y backend.

## Estructura

services/
- authService.ts
- chatService.ts
- voiceService.ts
- socketService.ts

---

## Servicios

### authService.ts
Gestiona autenticación.

Responsabilidades:
- login
- register
- logout
- manejo de tokens

Comunicación:
API de autenticación del backend.

---

### chatService.ts
Gestiona comunicación del chat.

Responsabilidades:
- enviar mensajes
- recibir respuestas del asistente

Comunicación:
endpoint del chat.

---

### voiceService.ts
Gestiona transcripción de voz.

Responsabilidades:
- enviar audio grabado
- recibir texto transcrito

Comunicación:
servicio de voz del backend.

---

### socketService.ts
Gestiona conexión WebSocket.

Responsabilidades:
- conectar socket
- escuchar eventos
- emitir eventos si es necesario