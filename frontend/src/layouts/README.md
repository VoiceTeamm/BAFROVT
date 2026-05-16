# Layouts

Esta carpeta contiene la estructura visual principal de la aplicación.

Los layouts permiten reutilizar la misma organización visual en múltiples páginas sin duplicar código.

## Estructura

layouts/
- MainLayout.tsx
- Navbar.tsx
- Sidebar.tsx

---

## Archivos

### MainLayout.tsx
Layout principal del sistema.

Responsabilidades:
- organizar la estructura general de páginas autenticadas
- integrar navbar, sidebar y contenido principal
- mantener diseño consistente en toda la aplicación

Ejemplo de estructura:

Navbar
Sidebar
Contenido principal

Propósito:
centralizar la estructura visual del sistema.

---

### Navbar.tsx
Barra superior de navegación.

Responsabilidades:
- mostrar nombre del sistema
- mostrar información del usuario
- contener acciones globales
- permitir cierre de sesión

Propósito:
facilitar acceso rápido a funciones generales.

---

### Sidebar.tsx
Menú lateral de navegación.

Responsabilidades:
- mostrar opciones de navegación
- permitir acceso a módulos principales
- organizar rutas privadas del sistema

Ejemplos:
- Chat
- Dashboard
- Transactions
- Recommendations
- Configuración

Propósito:
mejorar navegación entre secciones.

---

## Beneficios

- reutilización de estructura visual
- diseño uniforme
- menor duplicación de código
- mantenimiento más sencillo
- escalabilidad del proyecto