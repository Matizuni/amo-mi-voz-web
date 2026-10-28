# AMO MI VOZ — Navegación inferior móvil

Este parche transforma el menú móvil lateral en una barra de navegación inferior fija, inspirada en patrones de aplicaciones móviles. En escritorio conserva el menú lateral actual.

## Diseño

- Barra inferior fija con cuatro accesos principales y «Más».
- Estudiante: Inicio, Curso, Calendario y Tareas.
- Profesor: Inicio, Curso, Calendario y Alumnos.
- «Más» abre una hoja inferior con el resto de destinos del rol, Mi cuenta, Ver sitio web y Cerrar sesión.
- El contenido deja espacio para la barra y respeta `safe-area-inset-bottom` en móviles con zona segura.
- Sin dependencias nuevas, animaciones pesadas ni desenfoque de fondo.

## Instalación segura

1. Extrae la carpeta `AMV_MOBILE_BOTTOM_NAV_FIX` en la raíz del proyecto, junto a `package.json`.
2. Abre PowerShell en la raíz de `amo-mi-voz-academy`.
3. Ejecuta:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\AMV_MOBILE_BOTTOM_NAV_FIX\Install_AMV_MOBILE_BOTTOM_NAV.ps1
```

El instalador primero comprueba sus anclas y que la navegación no esté instalada. Solo después crea una copia de seguridad de `src/layouts/AulaLayout.vue` y aplica los cambios localmente. No crea commits ni hace push.

## Validación

```powershell
npm run build
npm run dev
```

Prueba como estudiante y profesor: Inicio, Curso, Calendario, el botón «Más», cada ruta secundaria y Cerrar sesión. Comprueba en una anchura de 390 px y una de 360 px que el contenido final no quede oculto bajo la barra. Escritorio (más de 980 px) debe seguir usando el menú lateral.

Si deseas revertir el cambio, restaura el archivo `AulaLayout.pre-mobile-bottom-nav-<fecha>.vue` que el instalador crea dentro de `src/layouts`.

## Fundamento de diseño

La barra expone cuatro destinos primarios y guarda el resto en «Más», evitando meter demasiados elementos en una misma fila. Este enfoque coincide con la guía de Material Design para navegación inferior (3–5 destinos) y con las recomendaciones de Apple para usar una pestaña «More» cuando hay más destinos de los que caben. La barra también contempla la zona segura inferior de los teléfonos.
