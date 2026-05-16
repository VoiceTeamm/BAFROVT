# Chat Components

Esta carpeta contiene los componentes visuales relacionados con el sistema conversacional de VoiceFinance AI.

## Estructura

chat/
- ChatWindow.tsx
- MessageBubble.tsx
- ChatInput.tsx
- VoiceButton.tsx
- TypingIndicator.tsx

---

## Componentes

### ChatWindow.tsx
Ventana principal del chat.

Responsabilidades:
- mostrar historial de mensajes
- organizar mensajes del usuario y asistente
- contener el flujo principal de conversación

---

### MessageBubble.tsx
Representa un mensaje individual dentro del chat.

Tipos:
- mensaje del usuario
- mensaje del asistente

Propósito:
mostrar mensajes de forma visual y ordenada.

---

### ChatInput.tsx
Campo para escribir mensajes.

Responsabilidades:
- capturar texto del usuario
- enviar mensaje al backend
- limpiar campo después del envío

---

### VoiceButton.tsx
Botón para grabación de voz.

Responsabilidades:
- iniciar grabación
- detener grabación
- enviar audio para transcripción

---

### TypingIndicator.tsx
Indicador visual de espera.

Ejemplo:
"Asistente escribiendo..."

Propósito:
mejorar experiencia del usuario mientras el sistema responde.