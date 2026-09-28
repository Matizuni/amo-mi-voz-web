# AMV Vocal Intelligence · contrato v1

La Edge Function `analyze-vocal-recording` recibe `{ recordingId }`, autoriza al usuario y obtiene el audio desde el bucket privado. El frontend nunca contiene una API key del proveedor de IA.

La respuesta persistida en `vocal_ai_analyses.dimensions` usa ocho dimensiones:

- `breath`
- `onset`
- `phonation`
- `register`
- `resonance`
- `intonation`
- `diction`
- `interpretation`

Cada dimensión debe tener como mínimo:

```json
{
  "score": 3.4,
  "confidence": 0.74,
  "observation": "Descripción pedagógica breve.",
  "evidence": [
    { "start": 32.5, "end": 38.1, "note": "Ejemplo audible" }
  ],
  "next_step": "Objetivo práctico para la próxima clase"
}
```

Reglas:

1. `score` es seguimiento pedagógico 1–5, no diagnóstico clínico.
2. `confidence` expresa incertidumbre del análisis.
3. No inferir postura, soporte diafragmático, tensión laríngea, lesión o patología desde audio solamente.
4. Si el acompañamiento impide separar voz/F0, declararlo en `limitations`.
5. No comparar estudiantes entre sí. Comparar al estudiante consigo mismo a lo largo del tiempo.
6. Guardar el modelo/versión usada para que la evolución sea auditable.
