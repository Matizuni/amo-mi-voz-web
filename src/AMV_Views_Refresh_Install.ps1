$ErrorActionPreference = 'Stop'

$projectRoot = (Get-Location).Path
$sourceViews = Join-Path $PSScriptRoot 'views'
$targetViews = Join-Path $projectRoot 'src\views'

if (-not (Test-Path (Join-Path $projectRoot 'package.json'))) {
    throw 'No encuentro package.json. Abre PowerShell en la raíz de amo-mi-voz-academy y vuelve a ejecutar el instalador.'
}
if (-not (Test-Path $targetViews)) {
    throw 'No encuentro src\views. No se modificó ningún archivo.'
}
if (-not (Test-Path $sourceViews)) {
    throw 'No encuentro la carpeta views del paquete. Extrae el ZIP completo y ejecuta este script desde la carpeta extraída ubicada en la raíz del proyecto.'
}

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupRoot = Join-Path (Split-Path $projectRoot -Parent) ((Split-Path $projectRoot -Leaf) + '-views-backup-' + $timestamp)
New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null

$files = Get-ChildItem -Path $sourceViews -Recurse -File | Where-Object {
    $_.Extension -in @('.vue', '.scss')
}
if (-not $files -or $files.Count -eq 0) {
    throw 'El paquete no contiene vistas válidas. No se modificó ningún archivo.'
}

$copied = 0
$backedUp = 0
foreach ($sourceFile in $files) {
    $relativePath = $sourceFile.FullName.Substring($sourceViews.Length).TrimStart([char[]]@('\', '/'))
    $destinationPath = Join-Path $targetViews $relativePath

    if (Test-Path $destinationPath) {
        $backupPath = Join-Path $backupRoot $relativePath
        New-Item -ItemType Directory -Path (Split-Path $backupPath -Parent) -Force | Out-Null
        Copy-Item -LiteralPath $destinationPath -Destination $backupPath -Force
        $backedUp++
    }

    New-Item -ItemType Directory -Path (Split-Path $destinationPath -Parent) -Force | Out-Null
    Copy-Item -LiteralPath $sourceFile.FullName -Destination $destinationPath -Force
    $copied++
}

# Integra el CSS una sola vez en el punto de entrada, evitando importarlo en cada vista.
$entryCandidates = @(
    'src\main.js',
    'src\main.ts',
    'src\main.mjs',
    'src\main.tsx',
    'src\main.jsx'
)
$entryPath = $null
foreach ($candidate in $entryCandidates) {
    $candidatePath = Join-Path $projectRoot $candidate
    if (Test-Path $candidatePath) { $entryPath = $candidatePath; break }
}

$styleImport = "import '@/views/amv-view-design-system.scss';"
$entryUpdated = $false
if ($entryPath) {
    $entryText = [System.IO.File]::ReadAllText($entryPath)
    if ($entryText -notmatch [regex]::Escape("@/views/amv-view-design-system.scss")) {
        Copy-Item -LiteralPath $entryPath -Destination (Join-Path $backupRoot (Split-Path $entryPath -Leaf)) -Force
        $entryText = $styleImport + [Environment]::NewLine + $entryText
        [System.IO.File]::WriteAllText($entryPath, $entryText, [System.Text.UTF8Encoding]::new($false))
        $entryUpdated = $true
    }
} else {
    Write-Warning 'No encontré src/main.js/ts. Las vistas se copiaron; añade manualmente: import ''@/views/amv-view-design-system.scss''; al punto de entrada de la aplicación.'
}

Write-Host ''
Write-Host 'AMO MI VOZ — actualización visual instalada.' -ForegroundColor Green
Write-Host ("Vistas y estilos copiados: {0}" -f $copied)
Write-Host ("Archivos existentes respaldados: {0}" -f $backedUp)
Write-Host ("Import del sistema visual añadido: {0}" -f $entryUpdated)
Write-Host ("Respaldo previo: {0}" -f $backupRoot)
Write-Host 'No se borraron archivos adicionales ni se ejecutaron comandos Git.' -ForegroundColor Cyan
Write-Host 'Siguiente paso: npm run build'
