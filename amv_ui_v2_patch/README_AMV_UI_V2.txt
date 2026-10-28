AMO MI VOZ — UI REFRESH V2

Este parche se basa en tus capturas y toma la cabecera de ALUMNOS como referencia visual.

CAMBIOS
- Unifica las cabeceras en rojo carmín, letras blancas, descripción legible y CTA con borde blanco.
- Calendario: agrega cabecera de marca y mueve la acción existente «Nuevo evento» arriba. El botón conserva la función openCreateEvent; no se etiqueta falsamente como «Nueva tarea».
- Recursos: quita el círculo/orbe, el fondo cuadriculado, los brillos y el blur. Conserva los contadores en etiquetas claras y el enlace funcional Publicar recurso.
- Cuenta: quita la fotografía del banner superior y usa el mismo banner rojo con letras blancas. La sección «Tu foto de perfil» del formulario continúa disponible para administrar la foto cuando se necesite.
- Reduce sombras y efectos que no aportan a la lectura.
- Conserva la lógica de los filtros del calendario, las funciones de recursos y las acciones de perfil. No modifica QuizView ni CreateQuizView.
- No añade dependencias.

INSTALACIÓN SEGURA
1. Extrae la carpeta amv_ui_v2_patch de este ZIP directamente dentro de la raíz de amo-mi-voz-academy (al lado de src y package.json).
2. Desde PowerShell situado en la raíz del proyecto, ejecuta:

   Set-ExecutionPolicy -Scope Process Bypass
   .\amv_ui_v2_patch\Install_AMV_UI_V2.ps1

3. El instalador crea una carpeta de respaldo fuera del proyecto, reemplaza solo CalendarView.vue, ResourcesView.vue, AccountView.vue y amv-view-design-system.scss, y agrega el import global a src/main.js/ts solo si falta. No ejecuta Git.
4. Comprueba:

   npm run build
   npm run dev

5. Revisa Calendario, Recursos, Cuenta y Alumnos a tamaño escritorio y móvil. No hagas commit ni push hasta que confirmes que todo se ve y funciona bien.

LÍMITES DE VALIDACIÓN
Este paquete no incluye el repositorio completo, servicios ni dependencias; por eso no se puede garantizar el build integral fuera de tu proyecto. La compilación final debe ejecutarse en tu carpeta local. El parche se limita a ajustes de vista/estilos y conserva las funciones existentes de las páginas modificadas.
