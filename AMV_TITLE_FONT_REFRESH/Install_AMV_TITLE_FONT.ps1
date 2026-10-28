$ErrorActionPreference = 'Stop'

# This patch folder must be extracted directly inside the project root.
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$SourceStyles = Join-Path $PSScriptRoot 'src\views\amv-view-design-system.scss'
$TargetStyles = Join-Path $ProjectRoot 'src\views\amv-view-design-system.scss'
$MainFile = Join-Path $ProjectRoot 'src\main.js'

if (-not (Test-Path $SourceStyles)) {
    throw "No se encontró la hoja de estilos del parche: $SourceStyles"
}
if (-not (Test-Path (Join-Path $ProjectRoot 'package.json'))) {
    throw "No se detectó package.json en $ProjectRoot. Extrae AMV_TITLE_FONT_REFRESH en la raíz de amo-mi-voz-academy."
}
if (-not (Test-Path $TargetStyles)) {
    throw "No existe la hoja de estilos activa: $TargetStyles. No se modificó nada."
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = Join-Path (Split-Path -Parent $TargetStyles) "amv-view-design-system.pre-title-font-$stamp.scss"
Copy-Item -LiteralPath $TargetStyles -Destination $backup
Copy-Item -LiteralPath $SourceStyles -Destination $TargetStyles -Force
Write-Host "Copia de seguridad creada: $backup" -ForegroundColor Green
Write-Host 'Actualizada la tipografía de títulos con la familia condensada de CALENDARIO.' -ForegroundColor Green

# Ensure the shared stylesheet is imported once. Do not add duplicate imports.
if (Test-Path $MainFile) {
    $mainContent = [System.IO.File]::ReadAllText($MainFile)
    if ($mainContent -notmatch 'amv-view-design-system\.scss') {
        $mainBackup = Join-Path (Split-Path -Parent $MainFile) "main.pre-title-font-$stamp.js"
        Copy-Item -LiteralPath $MainFile -Destination $mainBackup
        $importLine = "import '@/views/amv-view-design-system.scss';"
        [System.IO.File]::WriteAllText(
            $MainFile,
            $importLine + [Environment]::NewLine + $mainContent,
            [System.Text.UTF8Encoding]::new($false)
        )
        Write-Host "Se añadió el import global. Copia de main.js: $mainBackup" -ForegroundColor Green
    } else {
        Write-Host 'El sistema visual ya está importado; no se duplicó el import.' -ForegroundColor Green
    }
} else {
    Write-Warning 'No se encontró src/main.js; verifica el punto de entrada si los estilos no se aplican.'
}

Write-Host 'Instalación terminada. Ejecuta npm run build para validar.' -ForegroundColor Cyan
