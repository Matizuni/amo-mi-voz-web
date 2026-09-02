# 🎵 Amo Mi Voz — Academia de Talentos

![Vue.js](https://img.shields.io/badge/Vue.js-3-42b883?logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Production-000000?logo=vercel&logoColor=white)

Plataforma web y aula virtual desarrollada para **Academia de Talentos Amo Mi Voz**, proyecto de formación musical ubicado en La Calera, Región de Valparaíso, Chile.

El sistema integra un sitio institucional público con una plataforma académica privada para gestionar alumnos, clases, materiales, tareas, entregas, asistencia, evaluaciones y seguimiento vocal.

### 🌐 Aplicación en producción

**[Visitar Amo Mi Voz](https://amo-mi-voz-web.vercel.app/)**

---

## 📖 Sobre el proyecto

Amo Mi Voz nació como el sitio web de una academia de formación musical y evolucionó hacia una plataforma digital completa para apoyar tanto la gestión académica como el proceso formativo de sus estudiantes.

El proyecto combina dos áreas principales:

### Sitio público

Presenta la identidad de la academia, su metodología de enseñanza, programa formativo, experiencias escénico-musicales, galería, información de contacto y sistema de preinscripción.

### Aula Virtual

Entorno privado diseñado específicamente para complementar la enseñanza musical y centralizar la gestión de alumnos, clases y actividades.

El objetivo es disponer de una plataforma propia adaptada a las necesidades reales de la academia, en lugar de depender exclusivamente de herramientas educativas genéricas.

---

## ✨ Funcionalidades principales

### 🌐 Plataforma pública

- Página institucional de la academia
- Presentación del programa formativo
- Metodología de enseñanza
- Experiencias escénico-musicales
- Galería multimedia
- Información de contacto
- Formulario de preinscripción
- Navegación responsive
- Diseño adaptado a escritorio, tablet y dispositivos móviles

### 🎓 Aula Virtual

- Inicio de sesión para profesores y estudiantes
- Sistema de roles
- Dashboard académico
- Gestión de alumnos
- Creación y edición de clases
- Programa formativo
- Publicación de materiales
- Gestión de repertorio
- Creación de tareas
- Entrega de trabajos por estudiantes
- Revisión y retroalimentación
- Calificaciones
- Control de asistencia
- Seguimiento individual
- Perfil vocal del estudiante
- Gestión de preinscripciones y matrículas

---

## 🧑‍🏫 Flujo académico

La plataforma permite gestionar un proceso completo:

```text
Preinscripción
      ↓
Revisión del profesor
      ↓
Matrícula
      ↓
Creación de cuenta
      ↓
Alumno
      ↓
Clases y materiales
      ↓
Tareas y entregas
      ↓
Evaluación
      ↓
Asistencia y seguimiento vocal
```

---

## 🛠️ Stack tecnológico

### Frontend

- **Vue 3**
- **Vite**
- **Vue Router**
- **JavaScript**
- **SCSS**
- Composition API

### Backend y datos

- **Supabase**
- **PostgreSQL**
- Supabase Auth
- Supabase Storage
- Supabase Edge Functions
- Row Level Security (RLS)

### Infraestructura

- **Git**
- **GitHub**
- **Vercel**
- Supabase Cloud

---

## 🔐 Autenticación y seguridad

La plataforma implementa autenticación y autorización basada en roles.

Actualmente existen dos perfiles principales:

```text
Profesor
├── Gestión de alumnos
├── Gestión de clases
├── Publicación de materiales
├── Creación de tareas
├── Revisión de entregas
├── Evaluaciones
├── Asistencia
├── Perfiles vocales
└── Gestión de inscripciones

Estudiante
├── Acceso a clases
├── Materiales
├── Tareas publicadas
├── Entregas propias
├── Asistencia propia
└── Información académica personal
```

La seguridad de datos utiliza **Row Level Security (RLS)** en PostgreSQL/Supabase para restringir el acceso según el usuario autenticado y su rol.

Las entregas privadas utilizan Supabase Storage con políticas de acceso específicas.

Las operaciones administrativas sensibles, como la creación automatizada de cuentas de estudiantes, se ejecutan mediante **Supabase Edge Functions**.

> Las claves privadas, credenciales administrativas y variables de entorno no se almacenan en el repositorio.

---

## 🗄️ Arquitectura general

```text
                    ┌─────────────────────────┐
                    │       Usuario Web       │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      Vue 3 + Vite       │
                    │                         │
                    │  Sitio público / Aula   │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │        Supabase         │
                    ├─────────────────────────┤
                    │ Auth                    │
                    │ PostgreSQL              │
                    │ Storage                 │
                    │ Edge Functions          │
                    │ Row Level Security      │
                    └─────────────────────────┘

Frontend → Vercel
Backend  → Supabase Cloud
Código   → GitHub
```

---

## 📁 Estructura del proyecto

```text
src/
├── assets/
│   ├── images/
│   └── styles/
│
├── components/
│   ├── home/
│   └── layout/
│
├── composables/
│   └── useAuth.js
│
├── data/
│
├── directives/
│
├── layouts/
│   ├── PublicLayout.vue
│   └── AulaLayout.vue
│
├── lib/
│   └── supabase.js
│
├── router/
│
├── services/
│   ├── assignmentService.js
│   ├── attendanceService.js
│   ├── authService.js
│   ├── inscriptionService.js
│   ├── lessonService.js
│   ├── materialService.js
│   ├── studentAccountService.js
│   ├── studentService.js
│   ├── submissionService.js
│   └── vocalProfileService.js
│
└── views/
    └── aula/

supabase/
└── functions/
    ├── create-student-account/
    └── enroll-inscription/
```

---

## ⚙️ Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/Matizuni/amo-mi-voz-web.git
cd amo-mi-voz-web
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo:

```text
.env.local
```

con:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

> Nunca agregar claves `service_role` al frontend.

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

### 5. Compilar para producción

```bash
npm run build
```

### 6. Probar la compilación

```bash
npm run preview
```

---

## 🚀 Despliegue

El frontend se encuentra desplegado mediante **Vercel**.

Cada actualización enviada a la rama principal puede integrarse al flujo de despliegue del proyecto.

```bash
git add .
git commit -m "descripción del cambio"
git push origin main
```

---

## 🎯 Objetivo del proyecto

Este proyecto busca unir **música, educación y tecnología** mediante una plataforma desarrollada específicamente para las necesidades de una academia musical.

Además del desarrollo web, el proyecto explora cómo herramientas digitales pueden apoyar procesos como:

- seguimiento del aprendizaje;
- práctica musical;
- organización de repertorio;
- comunicación académica;
- evaluación;
- asistencia;
- desarrollo vocal;
- experiencias escénicas.

---

## 📌 Estado del proyecto

**🟢 En producción y desarrollo activo**

La plataforma pública y el Aula Virtual se encuentran operativas.

El proyecto continuará evolucionando a medida que sea utilizado con alumnos reales de la academia.

---

## 👨‍💻 Autor

**Matías Zúñiga**

Director de Academia de Talentos Amo Mi Voz  
Desarrollo web · Tecnología · Música · Producción de audio

GitHub: **[@Matizuni](https://github.com/Matizuni)**

---

## 📍 Academia de Talentos Amo Mi Voz

**La Calera, Región de Valparaíso — Chile**

🌐 **[amo-mi-voz-web.vercel.app](https://amo-mi-voz-web.vercel.app/)**
