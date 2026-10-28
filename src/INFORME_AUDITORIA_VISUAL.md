# Informe de renovación visual — AMO MI VOZ

## Resultado del análisis del ZIP

- La entrega de origen contenía 92 entradas y duplicaba el árbol de vistas en `views/` y `views/views/`. También incluía varias copias de respaldo. Para evitar mezclar versiones, el paquete nuevo se construyó desde el árbol de nivel principal y conserva las 42 vistas activas de esa ubicación.
- El paquete está preparado para aplicar estilo desde una sola hoja global en lugar de copiar cientos de reglas por cada vista. Esto facilita mantener el diseño y evita descargar una fuente web, bibliotecas de iconos o dependencias visuales adicionales.
- Se aplicó la guía visual carmín/blanco a las cabeceras principales del Aula Virtual, se unificaron los estados de foco y los botones primarios/secundarios, se ajustaron calendario, formularios, tarjetas y comportamiento móvil.
- Se retiraron bloques puramente decorativos con partículas/orbes y una onda repetida de 18 elementos en Dashboard, perfil vocal y vista de clase. No se eliminó ninguna función de evaluación o navegación.
- El import del servicio vocal en `MyEvaluationView.vue` usa el casing exacto de la ruta versionada `@/services/vocalIntelligenceService`, que es importante para compilar en Linux.

## Verificaciones realizadas aquí

- Inventario: 42 archivos Vue activos y un archivo SCSS compartido.
- Auditoría de referencias internas `@/views/...` contra las vistas incluidas: no se detectaron rutas internas faltantes.
- Análisis sintáctico del SCSS con `tinycss2`: sin errores de parseo.
- Se revisaron los bloques retirados como decorativos y las reemplazos exactos.

## Lo que no se puede certificar a partir de este ZIP

El ZIP no incluye el repositorio completo, el router, el layout, los servicios, `package.json`, `main.js` ni las dependencias. Por lo tanto, no se ejecutó aquí el build completo de Vite ni una suite de pruebas funcionales reales. El instalador agrega la importación global una sola vez, pero la compilación final y las pruebas con datos reales deben hacerse en la carpeta completa del proyecto.

## Flujo recomendado después de instalar

1. `npm run build`
2. `npm run test:unit -- --run` (si el proyecto tiene pruebas Vitest configuradas)
3. Probar con profesor y estudiante: calendario, filtros y eventos; crear/editar evaluación; abrir intentos; responder y enviar preguntas de distintos tipos; volver a cargar el resultado.
4. Revisar `git diff` y crear un commit selectivo. No usar `git add .` porque había cambios vocales y respaldos sin seguimiento en el repositorio.
