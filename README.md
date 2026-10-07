# 🎓 AMO MI VOZ — Aula Virtual

Plataforma web y aula virtual para apoyar la gestión, enseñanza y
seguimiento de estudiantes de la Academia de Talentos AMO MI VOZ.

El proyecto integra desarrollo frontend, gestión de datos y servicios
backend para centralizar procesos educativos en una plataforma digital.

## 🎯 Objetivo

Crear una plataforma que permita digitalizar procesos de la academia,
facilitando la gestión de estudiantes, clases, actividades, materiales,
evaluaciones y seguimiento del aprendizaje.

## ✨ Características

- 👨‍🎓 Gestión de estudiantes
- 📚 Gestión y organización de clases
- 📝 Actividades y evaluaciones
- 📊 Seguimiento del progreso de los estudiantes
- 📁 Gestión de materiales educativos
- 🔐 Autenticación y control de acceso
- 🗄️ Persistencia de información mediante PostgreSQL
- 🔄 Integración con Supabase
- 📱 Interfaz web adaptable a distintos dispositivos

## 🧱 Arquitectura

La aplicación utiliza una arquitectura orientada a frontend + servicios
backend gestionados mediante Supabase.

```text
┌─────────────────────────────┐
│          Usuario            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Vue 3 Frontend        │
│                             │
│  Componentes · Vistas · UI  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│          Supabase            │
│                             │
│ Auth · API · PostgreSQL     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Base de datos         │
│         PostgreSQL          │
└─────────────────────────────┘

## 🛠️ Tecnologías

### Frontend

- Vue 3
- JavaScript
- HTML5
- CSS3
- Vite

### Backend y datos

- Supabase
- PostgreSQL

### Herramientas

- Git
- GitHub
- Visual Studio Code

## 🔐 Seguridad

El proyecto considera fundamentos de seguridad aplicados al desarrollo
de aplicaciones web.

- Autenticación de usuarios.
- Control de acceso según las funcionalidades de la plataforma.
- Uso de variables de entorno para configuración sensible.
- Separación de credenciales y código fuente.
- Protección de información almacenada en la plataforma.

> Las credenciales, claves privadas y demás información sensible no
> deben almacenarse directamente en el repositorio.
