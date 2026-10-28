$ErrorActionPreference = 'Stop'

$root = (Get-Location).Path
$layoutPath = Join-Path $root 'src\layouts\AulaLayout.vue'
$packagePath = Join-Path $root 'package.json'

if (-not (Test-Path $packagePath)) {
    throw 'No encuentro package.json. Ejecuta este instalador desde la raíz de amo-mi-voz-academy.'
}
if (-not (Test-Path $layoutPath)) {
    throw 'No encuentro src\layouts\AulaLayout.vue. No se modificó ningún archivo.'
}

$text = [System.IO.File]::ReadAllText($layoutPath)
if ($text.Contains('class="mobile-bottom-nav"')) {
    throw 'La navegación inferior ya parece instalada. No se hicieron cambios para evitar duplicarla.'
}

$nl = if ($text.Contains("`r`n")) { "`r`n" } else { "`n" }

# 1) Add watch to Vue imports without changing the rest of the import block.
$importPattern = "import\s*\{\s*computed\s*,\s*onMounted\s*,\s*ref\s*\}\s*from\s*'vue'"
if ([regex]::Matches($text, $importPattern).Count -ne 1) {
    throw "No encontré el import Vue esperado en AulaLayout.vue. No se modificó ningún archivo."
}
$importRegex = [regex]::new($importPattern)
$text = $importRegex.Replace($text, "import { computed, onMounted, ref, watch } from 'vue'", 1)

# 2) Add state for the More sheet.
$mobileState = 'const mobileOpen = ref(false)'
if ([regex]::Matches($text, [regex]::Escape($mobileState)).Count -ne 1) {
    throw 'No encontré el estado mobileOpen esperado. No se modificó ningún archivo.'
}
$text = $text.Replace($mobileState, $mobileState + $nl + 'const mobileMoreOpen = ref(false)')

# 3) Add the small-screen destinations and the overflow menu list.
$navMarker = 'const sectionNames = {'
if ([regex]::Matches($text, [regex]::Escape($navMarker)).Count -ne 1) {
    throw 'No encontré la sección sectionNames esperada. No se modificó ningún archivo.'
}
$navCode = @'
const mobilePrimaryNav = computed(() => {
  if (isTeacher.value) {
    return [
      { ...teacherNav[0], mobileLabel: 'Inicio' },
      { ...teacherNav[1], mobileLabel: 'Curso' },
      { ...teacherNav[2], mobileLabel: 'Calendario' },
      { ...teacherNav[5], mobileLabel: 'Alumnos' },
    ]
  }

  const items = studentNav.value
  return [
    { ...items[0], mobileLabel: 'Inicio' },
    { ...items[1], mobileLabel: 'Curso' },
    { ...items[2], mobileLabel: 'Calendario' },
    { ...items.find(item => item.to === '/aula/mis-tareas'), mobileLabel: 'Tareas' },
  ].filter(item => item.to)
})

const mobileMoreNav = computed(() => {
  const primaryRoutes = new Set(mobilePrimaryNav.value.map(item => item.to))
  const allItems = isTeacher.value ? teacherNav : studentNav.value

  return [
    ...allItems.filter(item => !primaryRoutes.has(item.to)),
    { label: 'Mi cuenta', to: '/aula/cuenta', icon: 'account' },
  ]
})

'@
$navCode = $navCode.Trim() -replace "`r`n|`n|`r", $nl
$text = $text.Replace($navMarker, $navCode + $nl + $navMarker)

# 4) Add active-state helpers and close the More sheet after route changes.
$currentSectionMarker = 'const currentSection = computed('
if ([regex]::Matches($text, [regex]::Escape($currentSectionMarker)).Count -ne 1) {
    throw 'No encontré currentSection en AulaLayout.vue. No se modificó ningún archivo.'
}
$activeCode = @'
const isMobilePrimaryActive = item => {
  const currentPath = route.path.replace(/\/$/, '') || '/aula'

  if (item.to === '/aula') return currentPath === '/aula'
  if (item.to === '/aula/curso') {
    const isStudentTask = !isTeacher.value && /\/tarea\//.test(currentPath)
    return currentPath.startsWith('/aula/curso') ||
      (currentPath.startsWith('/aula/clase/') && !isStudentTask)
  }
  if (item.to === '/aula/calendario') return currentPath.startsWith('/aula/calendario')
  if (item.to === '/aula/mis-tareas') {
    return currentPath.startsWith('/aula/mis-tareas') || /\/tarea\//.test(currentPath)
  }
  if (item.to === '/aula/alumnos') {
    return currentPath.startsWith('/aula/alumnos') || currentPath.startsWith('/aula/estudiante/')
  }

  return isNavActive(item)
}

const mobileMoreIsActive = computed(
  () => !mobilePrimaryNav.value.some(isMobilePrimaryActive),
)

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
    mobileMoreOpen.value = false
  },
)

'@
$activeCode = $activeCode.Trim() -replace "`r`n|`n|`r", $nl
$text = $text.Replace($currentSectionMarker, $activeCode + $nl + $currentSectionMarker)

# 5) Add mobile bottom navigation and a compact More sheet after the authenticated workspace.
$templatePattern = '(?s)(<footer class="aula-footer">.*?</footer>\s*</div>)(\s*</template>)'
if ([regex]::Matches($text, $templatePattern).Count -ne 1) {
    throw 'No encontré el cierre del footer autenticado esperado. No se modificó ningún archivo.'
}
$templateCode = @'
      <!-- Navegación inferior permanente para pantallas compactas -->
      <nav class="mobile-bottom-nav" aria-label="Navegación principal del aula" @keydown.esc.prevent="mobileMoreOpen = false">
        <RouterLink
          v-for="item in mobilePrimaryNav"
          :key="item.to"
          :to="item.to"
          class="mobile-bottom-nav__item"
          :class="{ 'is-active': isMobilePrimaryActive(item) }"
          :aria-current="isMobilePrimaryActive(item) ? 'page' : undefined"
          @click="mobileMoreOpen = false"
        >
          <span class="mobile-bottom-nav__icon"><AulaIcon :name="item.icon" /></span>
          <span class="mobile-bottom-nav__label">{{ item.mobileLabel }}</span>
        </RouterLink>

        <button
          type="button"
          class="mobile-bottom-nav__item mobile-bottom-nav__more"
          :class="{ 'is-active': mobileMoreIsActive }"
          :aria-expanded="mobileMoreOpen"
          aria-controls="amv-mobile-more-sheet"
          aria-label="Más secciones del aula"
          @click="mobileMoreOpen = !mobileMoreOpen"
        >
          <span class="mobile-bottom-nav__icon mobile-bottom-nav__icon--more" aria-hidden="true">
            <i></i><i></i><i></i>
          </span>
          <span class="mobile-bottom-nav__label">Más</span>
        </button>
      </nav>

      <div
        v-if="mobileMoreOpen"
        class="mobile-more-backdrop"
        aria-hidden="true"
        @click="mobileMoreOpen = false"
      ></div>

      <section
        v-if="mobileMoreOpen"
        id="amv-mobile-more-sheet"
        class="mobile-more-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Más secciones del aula"
        tabindex="-1"
        @click.stop
        @keydown.esc.prevent="mobileMoreOpen = false"
      >
        <div class="mobile-more-sheet__handle" aria-hidden="true"></div>
        <header class="mobile-more-sheet__header">
          <div class="mobile-more-sheet__identity">
            <div class="avatar mobile-more-sheet__avatar">{{ initials }}</div>
            <div>
              <p>ACADEMIA AMO MI VOZ</p>
              <h2>Explorar aula</h2>
              <span>{{ currentUser?.name }} · {{ roleLabel }}</span>
            </div>
          </div>
          <button
            type="button"
            class="mobile-more-sheet__close"
            aria-label="Cerrar menú"
            @click="mobileMoreOpen = false"
          >×</button>
        </header>

        <nav class="mobile-more-grid" aria-label="Todas las secciones">
          <RouterLink
            v-for="item in mobileMoreNav"
            :key="item.to"
            :to="item.to"
            class="mobile-more-grid__item"
            :class="{ 'is-active': isNavActive(item) }"
            @click="mobileMoreOpen = false"
          >
            <span class="mobile-more-grid__icon"><AulaIcon :name="item.icon" /></span>
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>

        <footer class="mobile-more-sheet__footer">
          <RouterLink to="/" class="mobile-more-sheet__site" @click="mobileMoreOpen = false">
            <AulaIcon name="external" />
            <span>Ver sitio web</span>
          </RouterLink>
          <button
            type="button"
            class="mobile-more-sheet__logout"
            :disabled="isLoggingOut"
            @click="mobileMoreOpen = false; handleLogout()"
          >
            <AulaIcon name="logout" />
            <span>{{ isLoggingOut ? 'Saliendo…' : 'Cerrar sesión' }}</span>
          </button>
        </footer>
      </section>
'@
$templateCode = $templateCode.Trim() -replace "`r`n|`n|`r", $nl
$templateMatch = [regex]::Match($text, $templatePattern)
$text = $text.Substring(0, $templateMatch.Index) + $templateMatch.Groups[1].Value + $nl + $templateCode + $nl + $templateMatch.Groups[2].Value + $text.Substring($templateMatch.Index + $templateMatch.Length)

# 6) Responsive CSS: no drawer on mobile; persistent bottom navigation and safe-area spacing.
$styleClose = '</style>'
if ([regex]::Matches($text, [regex]::Escape($styleClose)).Count -ne 1) {
    throw 'No encontré el cierre de estilos esperado. No se modificó ningún archivo.'
}
$mobileCss = @'

/* =========================================================
   AMV · NAVEGACIÓN INFERIOR MÓVIL
   Diseño compacto, sin dependencias ni desenfoques costosos.
========================================================= */
.mobile-bottom-nav,
.mobile-more-backdrop,
.mobile-more-sheet {
  display: none;
}

.mobile-more-dots { display: flex; gap: 3px; align-items: center; justify-content: center; }
.mobile-more-dots i {
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}

.mobile-bottom-nav__item:focus-visible,
.mobile-more-sheet button:focus-visible,
.mobile-more-grid__item:focus-visible,
.mobile-more-sheet__site:focus-visible {
  outline: 3px solid #e2b84f;
  outline-offset: 2px;
}

@media (max-width: 980px) {
  .aula-sidebar,
  .mobile-backdrop,
  .mobile-menu {
    display: none !important;
  }

  .aula-workspace {
    margin-left: 0;
    min-height: 100dvh;
  }

  .mobile-bottom-nav {
    position: fixed;
    inset: auto 0 0;
    z-index: 80;
    display: flex;
    align-items: stretch;
    justify-content: space-around;
    gap: 2px;
    min-height: 68px;
    padding: 6px 7px calc(6px + env(safe-area-inset-bottom, 0px));
    border-top: 1px solid #e4e7ed;
    background: #fff;
    box-shadow: 0 -6px 20px rgba(22, 32, 51, 0.08);
  }

  .mobile-bottom-nav__item {
    flex: 1 1 0;
    min-width: 0;
    min-height: 56px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: 4px 2px;
    border: 0;
    border-radius: 12px;
    background: transparent;
    color: #778397;
    text-decoration: none;
    font: inherit;
    cursor: pointer;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .mobile-bottom-nav__icon {
    width: 34px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    color: inherit;
  }

  .mobile-bottom-nav__icon :deep(svg) {
    width: 22px;
    height: 22px;
  }

  .mobile-bottom-nav__label {
    display: block;
    max-width: 100%;
    overflow: hidden;
    color: inherit;
    font-size: 0.62rem;
    font-weight: 700;
    line-height: 1.1;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-bottom-nav__item.is-active {
    color: #a90f43;
  }

  .mobile-bottom-nav__item.is-active .mobile-bottom-nav__icon {
    background: #fbe8ef;
  }

  .mobile-bottom-nav__more .mobile-bottom-nav__icon--more {
    display: flex;
    gap: 3px;
  }

  .mobile-more-backdrop {
    position: fixed;
    inset: 0;
    z-index: 90;
    display: block;
    background: rgba(12, 20, 36, 0.34);
  }

  .mobile-more-sheet {
    position: fixed;
    z-index: 100;
    inset: auto 10px calc(84px + env(safe-area-inset-bottom, 0px));
    display: block;
    width: auto;
    max-width: 560px;
    max-height: min(72dvh, 560px);
    margin-inline: auto;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 10px 16px 14px;
    border: 1px solid #e5e8ee;
    border-radius: 22px;
    background: #fff;
    color: #172033;
    box-shadow: 0 18px 48px rgba(14, 25, 44, 0.2);
  }

  .mobile-more-sheet__handle {
    width: 36px;
    height: 4px;
    margin: 0 auto 14px;
    border-radius: 999px;
    background: #d9dee7;
  }

  .mobile-more-sheet__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .mobile-more-sheet__identity {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .mobile-more-sheet__avatar {
    flex: 0 0 42px;
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border-radius: 13px;
    background: #a90f43;
    color: #fff;
    font-size: 0.78rem;
    font-weight: 800;
  }

  .mobile-more-sheet__identity p {
    margin: 0 0 3px;
    color: #a90f43;
    font-size: 0.58rem;
    font-weight: 850;
    letter-spacing: 0.11em;
  }

  .mobile-more-sheet__identity h2 {
    margin: 0;
    color: #172033;
    font-size: 1.15rem;
    font-weight: 850;
  }

  .mobile-more-sheet__identity span {
    display: block;
    margin-top: 3px;
    color: #748095;
    font-size: 0.72rem;
  }

  .mobile-more-sheet__close {
    flex: 0 0 36px;
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border: 1px solid #e1e5ec;
    border-radius: 11px;
    background: #fff;
    color: #596579;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
  }

  .mobile-more-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 9px;
  }

  .mobile-more-grid__item {
    min-width: 0;
    min-height: 82px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 5px;
    border: 1px solid #e8ebf1;
    border-radius: 14px;
    background: #fbfcfe;
    color: #35435a;
    text-align: center;
    text-decoration: none;
    font-size: 0.7rem;
    font-weight: 750;
    line-height: 1.2;
    overflow-wrap: anywhere;
  }

  .mobile-more-grid__icon {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: #f8e5ec;
    color: #a90f43;
  }

  .mobile-more-grid__icon :deep(svg) {
    width: 19px;
    height: 19px;
  }

  .mobile-more-grid__item.is-active {
    border-color: #d98ba8;
    background: #fff5f8;
    color: #a90f43;
  }

  .mobile-more-sheet__footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 9px;
    margin-top: 15px;
    padding-top: 13px;
    border-top: 1px solid #edf0f4;
  }

  .mobile-more-sheet__site,
  .mobile-more-sheet__logout {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 8px;
    border: 1px solid #e3e7ee;
    border-radius: 11px;
    background: #fff;
    color: #4d5b70;
    text-align: center;
    text-decoration: none;
    font: inherit;
    font-size: 0.72rem;
    font-weight: 750;
    cursor: pointer;
  }

  .mobile-more-sheet__logout {
    border-color: #f0c9d6;
    background: #fff5f8;
    color: #a90f43;
  }

  .mobile-more-sheet__logout:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  .aula-content {
    padding-bottom: 28px !important;
  }

  .aula-footer {
    margin-bottom: calc(84px + env(safe-area-inset-bottom, 0px));
  }
}

@media (max-width: 370px) {
  .mobile-bottom-nav {
    padding-right: 4px;
    padding-left: 4px;
    gap: 0;
  }

  .mobile-bottom-nav__label {
    font-size: 0.58rem;
  }

  .mobile-more-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
'@
$mobileCss = $mobileCss.Trim() -replace "`r`n|`n|`r", $nl
$text = $text.Replace($styleClose, $mobileCss + $nl + $styleClose)

# Final guards before writing anything.
foreach ($required in @('mobile-bottom-nav', 'mobile-more-sheet', 'mobilePrimaryNav', 'mobileMoreNav', 'watch(')) {
    if (-not $text.Contains($required)) {
        throw "La comprobación final no encontró '$required'. No se modificó ningún archivo."
    }
}

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupPath = Join-Path (Split-Path $layoutPath -Parent) "AulaLayout.pre-mobile-bottom-nav-$timestamp.vue"
Copy-Item -LiteralPath $layoutPath -Destination $backupPath
[System.IO.File]::WriteAllText($layoutPath, $text, [System.Text.UTF8Encoding]::new($false))

Write-Host ''
Write-Host 'Navegación inferior móvil instalada.' -ForegroundColor Green
Write-Host "Respaldo: $backupPath" -ForegroundColor Cyan
Write-Host 'Escritorio conserva el menú lateral. En pantallas de hasta 980 px aparece la barra inferior fija.' -ForegroundColor Cyan
Write-Host 'Siguiente paso: ejecutar npm run build y probar navegación como estudiante y profesor.' -ForegroundColor Yellow
