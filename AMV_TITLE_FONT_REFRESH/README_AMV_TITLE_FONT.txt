AMO MI VOZ — tipografía global de títulos

PROPÓSITO
Aplica a todos los encabezados h1–h6 la misma familia condensada usada en el banner CALENDARIO:
"Arial Narrow", "Roboto Condensed", "Aptos Narrow", Impact, sans-serif.

No descarga fuentes, no agrega paquetes, no cambia tamaños, colores, textos, lógica de navegación ni botones. Solo actualiza la hoja de estilos compartida y garantiza que esta esté importada una sola vez.

INSTALACIÓN
1. Extrae la carpeta AMV_TITLE_FONT_REFRESH directamente en la raíz del proyecto amo-mi-voz-academy (donde está package.json).
2. Abre PowerShell en la raíz del proyecto.
3. Ejecuta:
   Set-ExecutionPolicy -Scope Process Bypass
   .\AMV_TITLE_FONT_REFRESH\Install_AMV_TITLE_FONT.ps1
4. Valida:
   npm run build
5. Ejecuta npm run dev y recorre las vistas principales.

SEGURIDAD
El instalador crea una copia de seguridad de amv-view-design-system.scss antes de reemplazarlo. Si necesita añadir el import en src/main.js, también hace una copia de ese archivo. No ejecuta git, no crea commits y no hace push.
