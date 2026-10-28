# Integración del panel docente AMV Vocal Engine

## 1. Agregar la vista
Copia `AMVTeacherDashboardView.vue` a:

`src/views/aula/AMVTeacherDashboardView.vue`

La vista usa servicios y rutas que ya aparecen en el proyecto:
- `@/services/studentService` → `fetchAllStudents()`
- `@/composables/useAuth` → `isTeacher`
- ruta existente `aula-estudiante-voz` → `/aula/estudiante/:studentId/voz`
- ficha existente → `/aula/estudiante/:studentId`

## 2. Agregar ruta en el router
Dentro de `children` de `/aula`, agrega una entrada con rol de profesor:

```js
{
  path: 'amv',
  name: 'aula-amv-admin',
  meta: { allowedRoles: ['teacher'] },
  component: () => import('@/views/aula/AMVTeacherDashboardView.vue'),
},
```

Colócala cerca de la ruta `alumnos` o de `estudiante/:studentId/voz`. Revisa que el guard del router aplique `meta.allowedRoles` a las rutas hijas.

## 3. Agregar acceso en la navegación docente
En `AulaLayout.vue`, dentro del arreglo `teacherNav`, agrega:

```js
{ label: 'AMV Vocal Engine', to: '/aula/amv', icon: 'progress' },
```

Si el componente `AulaIcon` de tu proyecto no reconoce `progress`, usa un icono que ya exista, por ejemplo `grades` o `course`.

## 4. Qué incluye esta primera entrega
- Carga los alumnos reales desde Supabase con `fetchAllStudents()`.
- Búsqueda por nombre y clasificación vocal.
- Filtros de alumnos activos e inactivos.
- Tarjetas adaptables a escritorio y móvil.
- Acceso a la ficha y al seguimiento vocal por alumno.
- Modal «Nueva audición» que selecciona un alumno activo y abre su ruta de seguimiento con `?nuevaAudicion=1`.
- Estados de carga, error, vacío y reintento.

## 5. Importante: botón Nueva audición
Esta primera entrega dirige al seguimiento vocal del alumno con el parámetro `nuevaAudicion=1`. Para que se abra automáticamente el formulario de carga dentro de `VozView.vue`, ese componente debe leer `route.query.nuevaAudicion` e iniciar el flujo de nueva audición. No se ha supuesto que ese comportamiento ya exista.

## 6. Verificación
Después de integrar:
1. Ejecuta `npm run dev`.
2. Entra con una cuenta cuyo rol sea `teacher`.
3. Abre `/aula/amv`.
4. Confirma que aparecen los alumnos y que funcionan búsqueda, filtros y accesos.
5. Prueba `/aula/amv` con una cuenta de estudiante: debe quedar bloqueada por el guard del router y volver a `/aula` por la comprobación del componente.

La restricción de interfaz no reemplaza autorización en Supabase. Verifica que las políticas RLS permitan a profesores autorizados leer la tabla `students`.
