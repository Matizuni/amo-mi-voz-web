# Entrega AMV — pauta docente y flujo de grabaciones

## Cambios incluidos
- La vista de perfil vocal ahora pide audio del alumno **y** una referencia musical (audio o MIDI), requisito que ya exigía el servicio de subida y el Worker AMV.
- Pauta docente con ocho dimensiones, escala 1–5 y observaciones; se mantiene separada de las métricas automáticas.
- Persistencia de la pauta por grabación mediante `vocal_teacher_evaluations`.
- Migración SQL con RLS para que solo profesores autenticados lean y modifiquen sus propias pautas.
- Se mantiene el motor AMV existente; no se sustituyeron los algoritmos de análisis.

## Antes de usar
1. Haz una copia de seguridad del proyecto actual.
2. Aplica `supabase/migrations/20261026000100_vocal_teacher_evaluations.sql` en el proyecto Supabase. Comprueba que `vocal_recordings.id` sea `bigint` y `profiles.id` sea `uuid` como espera el esquema de este proyecto.
3. Despliega la Edge Function `analyze-vocal-recording` si aún no está desplegada.
4. Configura y ejecuta el Worker Python AMV en un equipo/servidor que pueda acceder a Supabase. El Worker no se ejecuta dentro del navegador; si está apagado, los análisis quedarán pendientes.
5. En el Aula Virtual, abre la ficha de un alumno, sube el audio de su interpretación y la referencia correspondiente. Luego inicia el análisis y completa la pauta docente.

## Importante sobre las puntuaciones
El análisis comparativo necesita referencia musical. Para afinación/ritmo, una referencia vocal aislada o MIDI bien preparado suele ser mejor que una mezcla comercial completa. El análisis automático no debe usarse como diagnóstico médico ni como sustituto de la evaluación del profesor. Las notas 1–5 de la pauta son juicio docente.

## Verificación de esta entrega
Se revisó el código del formulario y el servicio de subida para resolver la falta de selector de referencia. No se pudo completar `npm run build` en el entorno de preparación: la instalación de dependencias excedió el tiempo disponible y el entorno Node disponible (22.16) está por debajo del mínimo declarado por el proyecto (22.18). Por ello, no se declara el build validado. Antes de usar con alumnos, ejecutar con Node compatible: `npm ci` y `npm run build`.
