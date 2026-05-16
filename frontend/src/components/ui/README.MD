# UI Components

Esta carpeta contiene componentes reutilizables de interfaz (UI) para el proyecto VoiceFinance AI.

La idea es evitar repetir código y mantener un diseño consistente en toda la aplicación.

## Componentes

### Input
Componente reutilizable para campos de entrada de datos.

Se utilizará en:
- Login (correo y contraseña)
- Registro de usuarios
- Chat (campo para escribir mensajes)
- Formularios futuros

Propósito:
Centralizar el diseño y comportamiento de los campos input.

---

### Button
Componente reutilizable para botones.

Se utilizará en:
- Iniciar sesión
- Registrarse
- Enviar mensajes
- Activar grabación de voz
- Acciones generales del sistema

Propósito:
Mantener botones consistentes en estilo y funcionalidad.

---

### Loader
Componente visual de carga.

Se utilizará cuando el sistema esté procesando acciones como:
- Inicio de sesión
- Registro
- Respuesta del chat
- Transcripción de voz
- Consultas al backend

Propósito:
Mostrar feedback visual al usuario mientras espera.

---

### Card
Componente contenedor visual reutilizable.

Se utilizará en:
- Formularios de login
- Formularios de registro
- Tarjetas de información
- Contenedores del chat
- Paneles visuales

Propósito:
Agrupar contenido dentro de una estructura visual ordenada.

---

## Estructura

src/components/ui/
- Input
- Button
- Loader
- Card

---

## Beneficios
- Reutilización de componentes
- Menos código duplicado
- Diseño consistente
- Mejor mantenimiento
- Escalabilidad del proyecto