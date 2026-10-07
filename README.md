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
- 📚 Gestión de clases y contenidos
- 📝 Actividades y evaluaciones
- 📊 Seguimiento del progreso
- 📁 Gestión de materiales
- 🔐 Control de acceso y autenticación
- 🗄️ Persistencia de información
- 📱 Interfaz web adaptable

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
