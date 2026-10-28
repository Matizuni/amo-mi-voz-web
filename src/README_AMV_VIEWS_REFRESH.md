# AMO MI VOZ — renovación visual de Views

## Qué contiene

- Las 42 vistas activas que venían en el nivel principal de `views(2).zip`.
- Un único sistema visual compartido en `views/amv-view-design-system.scss`.
- Un instalador PowerShell que respalda los archivos que va a sobrescribir e importa la hoja de estilos una sola vez desde el punto de entrada.

Se excluyó la segunda copia antigua que venía dentro de `views/views/` y se excluyeron los archivos `*.pre-*` y `*.backup.*` del paquete activo. El instalador no elimina las copias de respaldo que ya existan en el proyecto.

## Dirección visual aplicada

- Cabeceras principales del Aula con banda carmín, títulos condensados en mayúsculas y texto de alto contraste.
- Acciones primarias coherentes, estados de foco visibles, controles de formulario consistentes y botones deshabilitados reconocibles.
- Superficies claras, bordes sutiles y sombras limitadas; se evita agregar dependencias de iconos, fuentes remotas, filtros pesados o animaciones nuevas.
- El calendario conserva sus filtros, navegación mensual y eventos; no se cambia su lógica de negocio.
- Se retiran únicamente adornos repetidos de bajo valor visual (partículas, orbes y barras de onda decorativas) en las vistas de panel, perfil vocal y clase. Se conservan los indicadores de estado y el contenido funcional.

## Instalación segura

1. Haz una copia del proyecto o confirma que Git está limpio antes de aplicar el paquete. El instalador también hace una copia de seguridad de cada archivo que sobrescribe, en una carpeta hermana de la raíz del proyecto.
2. Extrae el ZIP completo directamente en la raíz de `amo-mi-voz-academy`, de modo que `views/` y `AMV_Views_Refresh_Install.ps1` queden al lado de `src/` y `package.json`.
3. Abre PowerShell en la raíz del proyecto y ejecuta:

   ```powershell
   Set-ExecutionPolicy -Scope Process Bypass
   .\AMV_Views_Refresh_Install.ps1
   ```

4. Verifica la compilación:

   ```powershell
   npm run build
   ```

5. Si compila, revisa el diff y las pruebas antes de crear un commit. Este instalador no hace commits ni push.

## Límites de validación

El archivo original era un paquete de vistas, no el repositorio completo. Por eso no se pudo ejecutar un `vite build` de esta copia aquí: faltan `package.json`, `src/main.js`, layout, router, servicios y dependencias de la aplicación. El instalador conecta el sistema de estilos en el punto de entrada de tu proyecto. La compilación definitiva y las pruebas funcionales deben ejecutarse en el proyecto completo.

Esta entrega es una actualización visual estática, responsive y de bajo costo de renderizado; no se reescribió la lógica de las evaluaciones, los servicios, las rutas ni la base de datos.
