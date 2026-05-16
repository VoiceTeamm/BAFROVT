# Store

Esta carpeta contiene el estado global del frontend.

Se utiliza para compartir información entre componentes sin pasar props innecesarias.

## Estructura

store/
- authStore.ts
- chatStore.ts

---

## Stores

### authStore.ts
Almacena información de autenticación.

Responsabilidades:
- token del usuario
- datos del usuario
- estado autenticado

Propósito:
mantener sesión activa en toda la aplicación.

---

### chatStore.ts
Almacena estado del chat.

Responsabilidades:
- historial de mensajes
- estado de carga
- mensajes temporales

Propósito:
centralizar el estado conversacional.