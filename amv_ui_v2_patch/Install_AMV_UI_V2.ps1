param(
    [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path
$sourceRoot = Join-Path $PSScriptRoot 'patch_files\src'

if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot 'package.json'))) {
    throw "No encuentro package.json en '$ProjectRoot'. Extrae la carpeta amv_ui_v2_patch directamente dentro de la raíz del proyecto y vuelve a ejecutar el instalador."
}
if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot 'src\views'))) {
    throw "No encuentro src\views dentro de '$ProjectRoot'. No se modificó ningún archivo."
}
if (-not (Test-Path -LiteralPath $sourceRoot)) {
    throw "No encuentro los archivos del parche en '$sourceRoot'. Extrae el ZIP completo."
}

$relativeFiles = @(
    'views\aula\CalendarView.vue',
    'views\aula\ResourcesView.vue',
    'views\aula\AccountView.vue',
    'views\amv-view-design-system.scss'
)

foreach ($relative in $relativeFiles) {
    $source = Join-Path $sourceRoot $relative
    if (-not (Test-Path -LiteralPath $source)) {
        throw "Falta el archivo del paquete '$source'. No se han copiado los componentes."
    }
}

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$projectName = Split-Path -Leaf $ProjectRoot
$backupRoot = Join-Path (Split-Path -Parent $ProjectRoot) ($projectName + '-ui-v2-backup-' + $timestamp)
New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null

$copied = 0
$backedUp = 0
foreach ($relative in $relativeFiles) {
    $source = Join-Path $sourceRoot $relative
    $destination = Join-Path $ProjectRoot (Join-Path 'src' $relative)

    if (Test-Path -LiteralPath $destination) {
        $backupPath = Join-Path $backupRoot (Join-Path 'src' $relative)
        New-Item -ItemType Directory -Path (Split-Path -Parent $backupPath) -Force | Out-Null
        Copy-Item -LiteralPath $destination -Destination $backupPath -Force
        $backedUp++
    }

    New-Item -ItemType Directory -Path (Split-Path -Parent $destination) -Force | Out-Null
    Copy-Item -LiteralPath $source -Destination $destination -Force
    $copied++
}

# Importa el sistema de diseño una sola vez, solo si todavía falta.
$entryCandidates = @('src\main.js', 'src\main.ts', 'src\main.mjs', 'src\main.tsx', 'src\main.jsx')
$entryPath = $null
foreach ($candidate in $entryCandidates) {
    $candidatePath = Join-Path $ProjectRoot $candidate
    if (Test-Path -LiteralPath $candidatePath) { $entryPath = $candidatePath; break }
}

$importStatement = "import '@/views/amv-view-design-system.scss';"
$entryUpdated = $false
if ($entryPath) {
    $entryText = [System.IO.File]::ReadAllText($entryPath)
    if ($entryText -notmatch [regex]::Escape("@/views/amv-view-design-system.scss")) {
        $entryBackup = Join-Path $backupRoot (Split-Path -Leaf $entryPath)
        Copy-Item -LiteralPath $entryPath -Destination $entryBackup -Force
        $entryText = $importStatement + [Environment]::NewLine + $entryText
        [System.IO.File]::WriteAllText($entryPath, $entryText, [System.Text.UTF8Encoding]::new($false))
        $entryUpdated = $true
    }
} else {
    Write-Warning 'No se encontró src/main.js/ts. Las vistas se copiaron, pero debes importar @/views/amv-view-design-system.scss desde el punto de entrada.'
}

Write-Host ''
Write-Host 'AMO MI VOZ · UI REFRESH V2 instalado.' -ForegroundColor Green
Write-Host ("Archivos instalados: {0}" -f $copied)
Write-Host ("Archivos respaldados: {0}" -f $backedUp)
Write-Host ("Import del sistema visual añadido: {0}" -f $entryUpdated)
Write-Host ("Respaldo: {0}" -f $backupRoot)
Write-Host 'No se tocaron las vistas de evaluación ni se ejecutaron comandos Git.' -ForegroundColor Cyan
Write-Host 'Siguiente paso: npm run build; luego revisar visualmente Calendario, Recursos, Cuenta y Alumnos.'
