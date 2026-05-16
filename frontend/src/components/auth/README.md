# Auth Components

Esta carpeta contiene los componentes relacionados con autenticación y control de acceso del sistema.

## Estructura

auth/
- LoginForm.tsx
- RegisterForm.tsx
- ProtectedRoute.tsx

---

## Componentes

### LoginForm.tsx
Formulario de inicio de sesión.

Responsabilidades:
- capturar correo electrónico
- capturar contraseña
- validar datos
- enviar solicitud de autenticación

Propósito:
permitir acceso seguro al sistema.

---

### RegisterForm.tsx
Formulario de registro de usuario.

Responsabilidades:
- capturar datos personales
- registrar nueva cuenta
- validar información ingresada

Propósito:
permitir creación de nuevas cuentas.

---

### ProtectedRoute.tsx
Protección de rutas privadas.

Responsabilidades:
- verificar autenticación
- restringir acceso a usuarios no autorizados
- redireccionar al login cuando sea necesario

Propósito:
proteger páginas privadas del sistema.