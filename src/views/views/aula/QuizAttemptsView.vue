<template>
  <main class="teacher-attempts amv-view-shell">
    <RouterLink
      :to="`/aula/clase/${lessonId}`"
      class="teacher-attempts__back"
    >
      ← Volver a la clase
    </RouterLink>

    <section
      v-if="isLoading"
      class="teacher-attempts__state"
    >
      <span class="teacher-attempts__spinner"></span>
      <p>Cargando intentos...</p>
    </section>

    <section
      v-else-if="loadError"
      class="teacher-attempts__state teacher-attempts__state--error"
    >
      <strong>No pudimos cargar los intentos</strong>
      <p>{{ loadError }}</p>

      <button
        type="button"
        @click="loadAttempts"
      >
        Reintentar
      </button>
    </section>

    <template v-else>
      <header class="teacher-attempts__hero">
        <div>
          <span class="teacher-attempts__eyebrow">
            EVALUACIONES · PROFESOR
          </span>

          <h1>
            Centro de corrección
          </h1>

          <p>
            Revisa los intentos entregados, identifica respuestas
            pendientes y completa la retroalimentación de cada estudiante.
          </p>
        </div>

        <aside class="teacher-attempts__hero-card">
          <span>ENTREGAS</span>
          <strong>{{ attempts.length }}</strong>
          <small>intentos registrados</small>
        </aside>
      </header>

      <section class="teacher-attempts__summary">
        <article>
          <span>Por revisar</span>
          <strong>{{ pendingCount }}</strong>
          <small>requieren corrección</small>
        </article>

        <article>
          <span>Corregidas</span>
          <strong>{{ gradedCount }}</strong>
          <small>finalizadas</small>
        </article>

        <article>
          <span>Con revisión manual</span>
          <strong>{{ manualCount }}</strong>
          <small>contienen preguntas abiertas</small>
        </article>

        <article>
          <span>Estudiantes</span>
          <strong>{{ studentCount }}</strong>
          <small>con al menos un intento</small>
        </article>
      </section>

      <section class="teacher-attempts__workspace">
        <header>
          <div>
            <span class="teacher-attempts__eyebrow">
              INTENTOS
            </span>

            <h2>
              {{ quizTitle }}
            </h2>
          </div>

          <div class="teacher-attempts__tools">
            <label>
              <span>Buscar estudiante</span>

              <input
                v-model="searchQuery"
                type="search"
                placeholder="Nombre o clasificación vocal..."
              >
            </label>

            <div class="teacher-attempts__filters">
              <button
                v-for="filter in filters"
                :key="filter.value"
                type="button"
                :class="{
                  'is-active':
                    activeFilter ===
                    filter.value
                }"
                @click="
                  activeFilter =
                    filter.value
                "
              >
                {{ filter.label }}
              </button>
            </div>
          </div>
        </header>

        <div
          v-if="!filteredAttempts.length"
          class="teacher-attempts__empty"
        >
          <span>✓</span>

          <div>
            <strong>
              No hay intentos en esta vista
            </strong>

            <p>
              Cuando un estudiante entregue esta evaluación aparecerá aquí.
            </p>
          </div>
        </div>

        <div
          v-else
          class="teacher-attempts__list"
        >
          <article
            v-for="attempt in filteredAttempts"
            :key="attempt.id"
            class="attempt-card"
          >
            <div class="attempt-card__identity">
              <div class="attempt-card__avatar">
                {{ getInitials(attempt.studentName) }}
              </div>

              <div>
                <span>
                  {{ attempt.studentVoice }}
                </span>

                <h3>
                  {{ attempt.studentName }}
                </h3>

                <small>
                  Intento {{ attempt.attemptNumber }}
                  ·
                  {{ formatDate(attempt.submittedAt) }}
                </small>
              </div>
            </div>

            <div class="attempt-card__metrics">
              <div>
                <span>Puntaje</span>
                <strong>
                  {{ scoreLabel(attempt) }}
                </strong>
              </div>

              <div>
                <span>Resultado</span>
                <strong>
                  {{ percentageLabel(attempt) }}
                </strong>
              </div>

              <div>
                <span>Manual</span>
                <strong>
                  {{
                    attempt.manualTotal
                      ? `${attempt.pendingManual} pendientes`
                      : 'No requiere'
                  }}
                </strong>
              </div>
            </div>

            <div class="attempt-card__action">
              <span
                class="attempt-card__status"
                :class="{
                  'attempt-card__status--graded':
                    attempt.status ===
                    'graded',
                  'attempt-card__status--pending':
                    attempt.status !==
                    'graded'
                }"
              >
                {{
                  attempt.status ===
                  'graded'
                    ? 'Corregida'
                    : attempt.pendingManual > 0
                      ? 'Revisión pendiente'
                      : 'Lista para finalizar'
                }}
              </span>

              <RouterLink
                :to="
                  `/aula/clase/${lessonId}/evaluacion/${quizId}/intentos/${attempt.id}/revisar`
                "
              >
                {{
                  attempt.status ===
                  'graded'
                    ? 'Abrir revisión'
                    : 'Revisar'
                }}
                →
              </RouterLink>
            </div>
          </article>
        </div>
      </section>
    </template>
  </main>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
} from 'vue'

import {
  RouterLink,
  useRoute,
} from 'vue-router'

import {
  fetchTeacherQuizAttempts,
} from '@/services/teacherEvaluationService'

const route =
  useRoute()

const attempts =
  ref([])

const isLoading =
  ref(true)

const loadError =
  ref('')

const searchQuery =
  ref('')

const activeFilter =
  ref('all')

const filters = [
  {
    value:
      'all',
    label:
      'Todos',
  },
  {
    value:
      'pending',
    label:
      'Por revisar',
  },
  {
    value:
      'graded',
    label:
      'Corregidos',
  },
]

const lessonId =
  computed(() =>
    Number(
      route.params.id,
    ),
  )

const quizId =
  computed(() =>
    Number(
      route.params.quizId,
    ),
  )

const quizTitle =
  computed(() =>
    attempts.value[0]
      ?.quizTitle ||
    'Evaluación',
  )

const pendingCount =
  computed(() =>
    attempts.value.filter(
      attempt =>
        attempt.status !==
        'graded',
    ).length,
  )

const gradedCount =
  computed(() =>
    attempts.value.filter(
      attempt =>
        attempt.status ===
        'graded',
    ).length,
  )

const manualCount =
  computed(() =>
    attempts.value.filter(
      attempt =>
        attempt.manualTotal > 0,
    ).length,
  )

const studentCount =
  computed(() =>
    new Set(
      attempts.value.map(
        attempt =>
          attempt.studentId,
      ),
    ).size,
  )

const filteredAttempts =
  computed(() => {
    const query =
      searchQuery.value
        .trim()
        .toLowerCase()

    return attempts.value.filter(
      attempt => {
        const filterMatches =
          activeFilter.value ===
            'all' ||
          (
            activeFilter.value ===
              'pending' &&
            attempt.status !==
              'graded'
          ) ||
          (
            activeFilter.value ===
              'graded' &&
            attempt.status ===
              'graded'
          )

        if (!filterMatches) {
          return false
        }

        if (!query) {
          return true
        }

        return [
          attempt.studentName,
          attempt.studentVoice,
        ]
          .join(' ')
          .toLowerCase()
          .includes(query)
      },
    )
  })

const loadAttempts =
  async () => {
    isLoading.value =
      true

    loadError.value =
      ''

    try {
      attempts.value =
        await fetchTeacherQuizAttempts(
          quizId.value,
        )
    } catch (error) {
      console.error(
        'Error cargando intentos:',
        error,
      )

      attempts.value =
        []

      loadError.value =
        error?.message ||
        'No fue posible cargar los intentos.'
    } finally {
      isLoading.value =
        false
    }
  }

const getInitials =
  name =>
    String(
      name || '',
    )
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(
        part =>
          part[0],
      )
      .join('')
      .toUpperCase() ||
    'ES'

const formatDate =
  value => {
    if (!value) {
      return 'Sin fecha'
    }

    const date =
      new Date(value)

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return 'Sin fecha'
    }

    return new Intl
      .DateTimeFormat(
        'es-CL',
        {
          day:
            'numeric',
          month:
            'short',
          year:
            'numeric',
          hour:
            '2-digit',
          minute:
            '2-digit',
        },
      )
      .format(date)
  }

const formatScore =
  value => {
    const number =
      Number(value)

    if (
      !Number.isFinite(
        number,
      )
    ) {
      return '—'
    }

    return Number.isInteger(
      number,
    )
      ? String(number)
      : number.toFixed(1)
  }

const scoreLabel =
  attempt => {
    if (
      attempt.score === null ||
      attempt.score ===
        undefined
    ) {
      return 'Pendiente'
    }

    return `${formatScore(attempt.score)} / ${formatScore(attempt.maxScore)}`
  }

const percentageLabel =
  attempt => {
    const value =
      Number(
        attempt.percentage,
      )

    return Number.isFinite(
      value,
    )
      ? `${Math.round(value)}%`
      : 'Pendiente'
  }

onMounted(
  loadAttempts,
)
</script>

<style scoped lang="scss">
.teacher-attempts {
  --ink: #152033;
  --ink-soft: #344359;
  --muted: #718095;
  --line: #dbe3ec;
  --line-strong: #cbd6e2;
  --surface: #ffffff;
  --surface-soft: #f7f9fc;
  --wine: #9f1945;
  --wine-dark: #7f1237;
  --gold: #d9a91d;
  --gold-dark: #987000;
  --gold-soft: #fff8e7;
  --green: #2d8a63;
  --green-soft: #edf8f3;
  --red: #be4856;
  --red-soft: #fff3f5;

  width:
    min(
      1240px,
      calc(
        100% -
        40px
      )
    );
  margin-inline:
    auto;
  padding:
    34px
    0
    72px;
  color:
    var(--ink);
}

.teacher-attempts__back {
  display:
    inline-flex;
  margin-bottom:
    22px;
  color:
    var(--wine);
  font-size:
    .82rem;
  font-weight:
    850;
  text-decoration:
    none;
}

.teacher-attempts__hero {
  display:
    grid;
  grid-template-columns:
    minmax(
      0,
      1fr
    )
    180px;
  gap:
    28px;
  align-items:
    center;
  padding:
    34px;
  border:
    1px solid
    var(--line);
  border-radius:
    22px;
  background:
    radial-gradient(
      circle at
      100% 0,
      #fff8e7 0,
      transparent 34%
    ),
    #fff;
  box-shadow:
    0 18px
    48px
    rgba(
      35,
      50,
      72,
      .08
    );
}

.teacher-attempts__eyebrow {
  color:
    var(--gold-dark);
  font-size:
    .7rem;
  font-weight:
    950;
  letter-spacing:
    .14em;
}

.teacher-attempts__hero h1 {
  margin:
    8px
    0
    10px;
  color:
    var(--ink);
  font-size:
    clamp(
      2.3rem,
      5vw,
      4.4rem
    );
  line-height:
    .95;
  letter-spacing:
    -.045em;
}

.teacher-attempts__hero p {
  max-width:
    760px;
  margin:
    0;
  color:
    var(--muted);
  line-height:
    1.7;
}

.teacher-attempts__hero-card {
  display:
    grid;
  min-height:
    150px;
  place-content:
    center;
  border:
    1px solid
    #ead79c;
  border-radius:
    20px;
  background:
    var(--gold-soft);
  text-align:
    center;
}

.teacher-attempts__hero-card span {
  color:
    var(--gold-dark);
  font-size:
    .62rem;
  font-weight:
    950;
  letter-spacing:
    .12em;
}

.teacher-attempts__hero-card strong {
  margin:
    4px 0;
  color:
    var(--ink);
  font-size:
    2.2rem;
}

.teacher-attempts__hero-card small {
  color:
    var(--muted);
}

.teacher-attempts__summary {
  display:
    grid;
  grid-template-columns:
    repeat(
      4,
      minmax(
        0,
        1fr
      )
    );
  gap:
    12px;
  margin-top:
    16px;
}

.teacher-attempts__summary article {
  min-height:
    128px;
  padding:
    20px;
  border:
    1px solid
    var(--line);
  border-radius:
    16px;
  background:
    #fff;
}

.teacher-attempts__summary span,
.attempt-card__metrics span {
  display:
    block;
  color:
    var(--muted);
  font-size:
    .7rem;
}

.teacher-attempts__summary strong {
  display:
    block;
  margin:
    10px 0
    4px;
  color:
    var(--gold-dark);
  font-size:
    1.65rem;
}

.teacher-attempts__summary small {
  color:
    var(--muted);
  font-size:
    .72rem;
}

.teacher-attempts__workspace {
  margin-top:
    18px;
  overflow:
    hidden;
  border:
    1px solid
    var(--line);
  border-radius:
    20px;
  background:
    #fff;
  box-shadow:
    0 14px
    36px
    rgba(
      35,
      50,
      72,
      .06
    );
}

.teacher-attempts__workspace >
header {
  display:
    grid;
  gap:
    18px;
  grid-template-columns:
    minmax(
      0,
      1fr
    )
    minmax(
      340px,
      520px
    );
  align-items:
    end;
  padding:
    26px;
  border-bottom:
    1px solid
    var(--line);
  background:
    #fff;
}

.teacher-attempts__workspace h2 {
  margin:
    5px
    0
    0;
  color:
    var(--ink);
  font-size:
    1.6rem;
}

.teacher-attempts__tools {
  display:
    grid;
  gap:
    10px;
}

.teacher-attempts__tools label span {
  display:
    block;
  margin-bottom:
    5px;
  color:
    var(--muted);
  font-size:
    .67rem;
  font-weight:
    800;
}

.teacher-attempts__tools input {
  width:
    100%;
  min-height:
    44px;
  padding:
    0
    14px;
  border:
    1px solid
    var(--line-strong);
  border-radius:
    11px;
  outline:
    none;
  background:
    var(--surface-soft);
  color:
    var(--ink);
  font:
    inherit;
}

.teacher-attempts__tools input:focus {
  border-color:
    var(--gold);
  box-shadow:
    0 0 0
    3px
    rgba(
      217,
      169,
      29,
      .12
    );
}

.teacher-attempts__filters {
  display:
    flex;
  gap:
    8px;
  flex-wrap:
    wrap;
}

.teacher-attempts__filters button {
  min-height:
    34px;
  padding:
    0 12px;
  border:
    1px solid
    var(--line);
  border-radius:
    999px;
  background:
    #fff;
  color:
    var(--ink-soft);
  font:
    inherit;
  font-size:
    .7rem;
  font-weight:
    850;
  cursor:
    pointer;
}

.teacher-attempts__filters button.is-active {
  border-color:
    #ead79c;
  background:
    var(--gold-soft);
  color:
    var(--gold-dark);
}

.teacher-attempts__list {
  display:
    grid;
}

.attempt-card {
  display:
    grid;
  grid-template-columns:
    minmax(
      270px,
      1.3fr
    )
    minmax(
      360px,
      1fr
    )
    minmax(
      170px,
      auto
    );
  gap:
    22px;
  align-items:
    center;
  padding:
    22px
    26px;
  border-bottom:
    1px solid
    var(--line);
  transition:
    .18s ease;
}

.attempt-card:last-child {
  border-bottom:
    0;
}

.attempt-card:hover {
  background:
    #fbfcfe;
}

.attempt-card__identity {
  display:
    flex;
  gap:
    14px;
  align-items:
    center;
  min-width:
    0;
}

.attempt-card__avatar {
  display:
    grid;
  width:
    50px;
  height:
    50px;
  flex:
    0 0 50px;
  place-items:
    center;
  border:
    1px solid
    #e6c769;
  border-radius:
    50%;
  background:
    var(--gold-soft);
  color:
    var(--gold-dark);
  font-size:
    .78rem;
  font-weight:
    950;
}

.attempt-card__identity span {
  color:
    var(--gold-dark);
  font-size:
    .62rem;
  font-weight:
    950;
  letter-spacing:
    .1em;
  text-transform:
    uppercase;
}

.attempt-card__identity h3 {
  margin:
    3px 0;
  overflow:
    hidden;
  color:
    var(--ink);
  text-overflow:
    ellipsis;
  white-space:
    nowrap;
  font-size:
    1rem;
}

.attempt-card__identity small {
  color:
    var(--muted);
  font-size:
    .7rem;
}

.attempt-card__metrics {
  display:
    grid;
  grid-template-columns:
    repeat(
      3,
      minmax(
        0,
        1fr
      )
    );
  gap:
    8px;
}

.attempt-card__metrics div {
  min-height:
    70px;
  padding:
    12px;
  border:
    1px solid
    var(--line);
  border-radius:
    11px;
  background:
    var(--surface-soft);
}

.attempt-card__metrics strong {
  display:
    block;
  margin-top:
    7px;
  color:
    var(--ink);
  font-size:
    .78rem;
}

.attempt-card__action {
  display:
    grid;
  gap:
    10px;
  justify-items:
    end;
}

.attempt-card__status {
  display:
    inline-flex;
  padding:
    6px
    9px;
  border-radius:
    999px;
  font-size:
    .62rem;
  font-weight:
    900;
}

.attempt-card__status--graded {
  border:
    1px solid
    #bfe0cd;
  background:
    var(--green-soft);
  color:
    var(--green);
}

.attempt-card__status--pending {
  border:
    1px solid
    #ead79c;
  background:
    var(--gold-soft);
  color:
    var(--gold-dark);
}

.attempt-card__action a {
  display:
    inline-flex;
  min-height:
    40px;
  align-items:
    center;
  justify-content:
    center;
  padding:
    0 14px;
  border-radius:
    10px;
  background:
    var(--wine);
  color:
    #fff;
  font-size:
    .72rem;
  font-weight:
    900;
  text-decoration:
    none;
}

.attempt-card__action a:hover {
  background:
    var(--wine-dark);
}

.teacher-attempts__empty,
.teacher-attempts__state {
  display:
    grid;
  min-height:
    220px;
  place-content:
    center;
  padding:
    34px;
  text-align:
    center;
}

.teacher-attempts__empty {
  grid-template-columns:
    auto
    minmax(
      0,
      460px
    );
  gap:
    16px;
  align-items:
    center;
  text-align:
    left;
}

.teacher-attempts__empty >
span {
  display:
    grid;
  width:
    48px;
  height:
    48px;
  place-items:
    center;
  border:
    1px solid
    #cfe7db;
  border-radius:
    50%;
  background:
    var(--green-soft);
  color:
    var(--green);
}

.teacher-attempts__empty strong {
  color:
    var(--ink);
}

.teacher-attempts__empty p,
.teacher-attempts__state p {
  color:
    var(--muted);
}

.teacher-attempts__state button {
  justify-self:
    center;
  min-height:
    40px;
  padding:
    0 14px;
  border:
    0;
  border-radius:
    9px;
  background:
    var(--wine);
  color:
    #fff;
  font:
    inherit;
  font-size:
    .72rem;
  font-weight:
    900;
  cursor:
    pointer;
}

.teacher-attempts__state--error {
  color:
    var(--red);
}

.teacher-attempts__spinner {
  width:
    34px;
  height:
    34px;
  justify-self:
    center;
  border:
    3px solid
    #e3e9ef;
  border-top-color:
    var(--wine);
  border-radius:
    50%;
  animation:
    spin
    .8s
    linear
    infinite;
}

@keyframes spin {
  to {
    transform:
      rotate(
        360deg
      );
  }
}

@media (
  max-width:
    1000px
) {
  .teacher-attempts__summary {
    grid-template-columns:
      repeat(
        2,
        minmax(
          0,
          1fr
        )
      );
  }

  .teacher-attempts__workspace >
  header {
    grid-template-columns:
      1fr;
  }

  .attempt-card {
    grid-template-columns:
      1fr;
  }

  .attempt-card__action {
    justify-items:
      start;
  }
}

@media (
  max-width:
    680px
) {
  .teacher-attempts {
    width:
      min(
        100% -
        24px,
        1240px
      );
    padding-top:
      24px;
  }

  .teacher-attempts__hero {
    grid-template-columns:
      1fr;
    padding:
      22px;
  }

  .teacher-attempts__hero-card {
    min-height:
      110px;
  }

  .teacher-attempts__summary {
    grid-template-columns:
      1fr
      1fr;
  }

  .teacher-attempts__summary article {
    min-height:
      105px;
    padding:
      15px;
  }

  .teacher-attempts__workspace >
  header,
  .attempt-card {
    padding:
      18px;
  }

  .attempt-card__metrics {
    grid-template-columns:
      1fr;
  }
}

@media (
  max-width:
    430px
) {
  .teacher-attempts__summary {
    grid-template-columns:
      1fr;
  }
}


/* =========================================================
   AMV LMS UI SYSTEM · ACADEMIC EXPERIENCE v1.0
   Sistema visual común para el SaaS
========================================================= */
.teacher-attempts {
  --amv-canvas: #f5f7fb;
  --amv-card: #ffffff;
  --amv-ink: #172033;
  --amv-body: #344359;
  --amv-muted: #667085;
  --amv-line: #dbe3ec;
  --amv-wine: #9f1945;
  --amv-wine-dark: #7f1237;
  --amv-gold: #d9a91d;
  --amv-gold-soft: #fff8e7;
  --amv-green: #2d8a63;
  --amv-red: #be4856;
  --amv-shadow-sm: 0 8px 24px rgba(23, 32, 51, .055);
  --amv-shadow-md: 0 18px 46px rgba(23, 32, 51, .085);
  --amv-radius-sm: 12px;
  --amv-radius-md: 18px;
  --amv-radius-lg: 24px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

.teacher-attempts :where(a, button, input, textarea, select, [role="button"]) {
  transition: color .2s ease, background-color .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease, opacity .2s ease;
}

.teacher-attempts :where(a, button, input, textarea, select, [role="button"]):focus-visible {
  outline: 3px solid rgba(159, 25, 69, .22) !important;
  outline-offset: 3px;
}

.teacher-attempts :where(button, [role="button"], .button, .btn):not(:disabled):active {
  transform: translateY(1px) scale(.99);
}

.teacher-attempts :where(input, textarea, select) {
  font-size: max(16px, 1em);
}

.teacher-attempts :where(table tbody tr) {
  transition: background-color .18s ease;
}

.teacher-attempts :where(table tbody tr):hover {
  background-color: rgba(159, 25, 69, .025);
}

.teacher-attempts :where(.card, [class*="-card"], [class*="__card"]) {
  transition: transform .24s cubic-bezier(.2,.75,.25,1), box-shadow .24s ease, border-color .24s ease;
}

.teacher-attempts :where(.card, [class*="-card"], [class*="__card"]):hover {
  border-color: rgba(159, 25, 69, .16);
}

@media (prefers-reduced-motion: reduce) {
  .teacher-attempts *, .teacher-attempts *::before, .teacher-attempts *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}


/* =========================================================
   AMV LMS · FLUID MOTION & PREMIUM INTERACTION v2.0
   Capa visual segura: no modifica lógica, datos ni estructura.
========================================================= */
.teacher-attempts {
  animation: amvViewEnter .46s cubic-bezier(.2,.75,.25,1) both;
}

.teacher-attempts :where(
  article,
  [class$="__card"],
  [class*="-card"],
  [class*="_card"]
) {
  transition:
    transform .24s cubic-bezier(.2,.75,.25,1),
    box-shadow .24s ease,
    border-color .24s ease,
    background-color .24s ease;
}

@media (hover: hover) and (pointer: fine) {
  .teacher-attempts :where(
    article,
    [class$="__card"],
    [class*="-card"],
    [class*="_card"]
  ):hover {
    transform: translateY(-2px);
  }

  .teacher-attempts :where(
    button,
    .button,
    .btn,
    a[class*="button"],
    a[class*="cta"]
  ):not(:disabled):hover {
    transform: translateY(-2px);
    filter: saturate(1.04);
  }

  .teacher-attempts :where(img) {
    transition: transform .55s cubic-bezier(.2,.75,.25,1), filter .35s ease;
  }

  .teacher-attempts :where(
    [class*="cover"],
    [class*="hero"],
    [class*="visual"],
    [class*="gallery"]
  ):hover img {
    transform: scale(1.018);
  }
}

.teacher-attempts :where(
  button,
  .button,
  .btn,
  a[class*="button"],
  a[class*="cta"]
) {
  will-change: transform;
}

.teacher-attempts :where(input, textarea, select):focus {
  transform: translateY(-1px);
}

.teacher-attempts :where(
  [class*="progress"] > *,
  [class*="bar"] > *,
  progress
) {
  transition: width .55s cubic-bezier(.2,.75,.25,1), transform .35s ease;
}

.teacher-attempts ::selection {
  color: #ffffff;
  background: #9f1945;
}

@keyframes amvViewEnter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .teacher-attempts,
  .teacher-attempts *,
  .teacher-attempts *::before,
  .teacher-attempts *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}

</style>


<style lang="scss">
/* AMV UI POLISH 2026 — visual consistency, accessibility and mobile resilience. */
.amv-view-shell {
  --amv-ui-wine: #9f1945;
  --amv-ui-wine-deep: #7f1237;
  --amv-ui-gold: #d9a91d;
  --amv-ui-purple: #7657d9;
  --amv-ui-cyan: #20b8ae;
  --amv-ui-ink: #172033;
  --amv-ui-muted: #6f7c8f;
  --amv-ui-line: rgba(122, 137, 158, 0.20);
  --amv-ui-focus: rgba(159, 25, 69, 0.38);
  --amv-ui-radius-sm: 12px;
  --amv-ui-radius-md: 18px;
  --amv-ui-radius-lg: 26px;
  --amv-ui-shadow: 0 18px 55px rgba(17, 25, 39, 0.09);
  --amv-ui-shadow-hover: 0 22px 65px rgba(17, 25, 39, 0.14);
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  isolation: isolate;
  overflow-x: clip;
  -webkit-tap-highlight-color: transparent;
}

.amv-view-shell::before {
  content: '';
  position: absolute;
  inset: -150px -120px auto auto;
  width: 420px;
  height: 420px;
  pointer-events: none;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 35%, rgba(159, 25, 69, 0.10), transparent 52%),
    radial-gradient(circle at 68% 62%, rgba(217, 169, 29, 0.08), transparent 58%);
  filter: blur(6px);
  opacity: 0.82;
  z-index: -1;
}

.amv-view-shell :where(*, *::before, *::after) {
  box-sizing: border-box;
}

.amv-view-shell :where(img, video, svg, canvas) {
  max-width: 100%;
}

.amv-view-shell :where(h1, h2, h3, h4, h5, h6) {
  text-wrap: balance;
}

.amv-view-shell :where(p, li, td, th, label, small) {
  overflow-wrap: anywhere;
}

.amv-view-shell :where(a, button, input, select, textarea, [role='button']) {
  touch-action: manipulation;
}

.amv-view-shell :where(button, input, select, textarea) {
  font: inherit;
}

.amv-view-shell :where(button) {
  min-height: 42px;
}

.amv-view-shell :where(input, select, textarea) {
  max-width: 100%;
}

.amv-view-shell :where(a, button, input, select, textarea, [role='button']):focus-visible {
  outline: 3px solid var(--amv-ui-focus);
  outline-offset: 3px;
}

.amv-view-shell :where(button, [role='button']):disabled,
.amv-view-shell :where(input, select, textarea):disabled {
  cursor: not-allowed;
}

.amv-view-shell :where(.button, .btn, .lux-button, .amv-primary-btn, .amv-secondary-action,
  .primary-action, .secondary-action, .danger-action, .text-link, .action-link,
  .lightbox__close, .lightbox__nav, .today-button, .quick-action) {
  -webkit-user-select: none;
  user-select: none;
}

/* Premium surface language without changing each view's semantic palette. */
.amv-view-shell :where(.card, .panel, .surface, .summary-card, .metric-card,
  .focus-card, .next-class-card, .insight-card, .agenda-card, .quiz-card,
  .resource-card, .student-card, .lesson-card, .task-card, .format-card,
  .production, .sound-console, .state-card, .empty-card, .workspace,
  .profile-card, .profile-panel, .vocal-card, .weighted-student, .weighted-category) {
  border-radius: var(--amv-ui-radius-md);
}

.amv-view-shell :where(.resource-card, .student-card, .lesson-card, .metric-card,
  .focus-card, .next-class-card, .summary-card, .insight-card, .quiz-card,
  .task-card, .format-card, .production, .state-card, .empty-card) {
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .amv-view-shell :where(.resource-card, .student-card, .lesson-card, .metric-card,
    .focus-card, .next-class-card, .summary-card, .insight-card, .quiz-card,
    .task-card, .format-card, .production):not(.is-disabled):hover {
    transform: translateY(-2px);
  }
}

/* Toolbars wrap rather than squeezing controls into unreadable rows. */
.amv-view-shell :where(.toolbar, .students-toolbar, .calendar-toolbar, .resources-controls,
  .resources-controls__row, .gradebook-legacy-toolbar, .hero-actions, .actions,
  .action-row, .question-actions, .filters, .public-jump-nav, .classes-header__actions,
  .result-action-row, .form-actions, .footer-actions) {
  min-width: 0;
}

.amv-view-shell :where(.table-shell, .quiz-table-wrap, .table-wrap, .grade-table-wrap,
  .data-table-wrap, .scroll-region, .horizontal-scroll) {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.amv-view-shell :where(.table-shell table, .quiz-table-wrap table, .table-wrap table,
  .grade-table-wrap table, .data-table-wrap table) {
  max-width: none;
}

/* Prevent long controls and badges from forcing page-level horizontal overflow. */
.amv-view-shell :where(.badge, .pill, .chip, .status-pill, .source-badge, .event-chip,
  .lesson-detail, .student-card__voice, .student-card__status, .course-kicker,
  .hero-stat, .count, .filename, .meta, .eyebrow) {
  max-width: 100%;
}

/* Dialogs/lightboxes stay usable on short laptop and phone viewports. */
.amv-view-shell :where(.modal, .dialog, .drawer, .lightbox, .lightbox__content,
  .modal__content, .dialog__content, [role='dialog']) {
  max-width: min(100%, 100vw);
}

.amv-view-shell :where(.modal__content, .dialog__content, .lightbox__content,
  [role='dialog']) {
  max-height: calc(100dvh - 28px);
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* Public pages: a cleaner editorial frame around content-heavy sections. */
.amv-view-shell :where(.hero, .hero-panel, .calendar-hero, .resources-hero, .amv-hero,
  .students__header, .gradebook__hero, .classes-header, .contact-hero, .training-hero,
  .academy-hero, .inscription-hero) {
  isolation: isolate;
}

.amv-view-shell :where(.hero__grid, .hero-panel__grid, .resources-hero__grid) {
  min-width: 0;
}

/* Mobile-first resilience. Existing view-specific breakpoints still win where more
   specific rules exist, while these defaults catch edge cases and tiny screens. */
@media (max-width: 760px) {
  .amv-view-shell {
    overflow-x: clip;
  }

  .amv-view-shell :where(.hero, .hero-panel, .amv-hero, .calendar-hero,
    .resources-hero, .classes-header, .students__header, .gradebook__hero) {
    border-radius: 22px;
  }

  .amv-view-shell :where(.hero__grid, .hero-panel__grid, .resources-hero__grid,
    .calendar-layout, .quiz-layout, .program-layout, .student-profile__grid,
    .dashboard-grid, .content-grid, .page-grid, .split-layout) {
    grid-template-columns: minmax(0, 1fr) !important;
  }

  .amv-view-shell :where(.hero-actions, .actions, .action-row, .form-actions,
    .footer-actions, .question-actions, .students__header-actions, .hero-stat,
    .calendar-toolbar, .resources-controls__row) {
    flex-wrap: wrap;
  }

  .amv-view-shell :where(.hero-actions > *, .form-actions > *, .footer-actions > *,
    .question-actions > *, .result-action > *, .result-next-step__actions > *) {
    min-width: min(100%, 190px);
  }

  .amv-view-shell :where(.display-title, .page-title, .hero-title, .section-title,
    .hero-panel__title, .amv-hero h1, .calendar-hero h1, .students__header h1,
    .gradebook__hero h1) {
    font-size: clamp(1.8rem, 7vw, 3rem);
    line-height: 1.05;
  }

  .amv-view-shell :where(.metric-grid, .focus-grid, .student-grid, .resource-grid,
    .lessons-list, .quiz-stack, .summary-grid, .insight-row, .calendar-insight-row,
    .format__grid, .sound__grid, .skills__grid, .productions__grid) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .amv-view-shell :where(.students-toolbar, .resources-controls, .calendar-toolbar,
    .gradebook-legacy-toolbar, .classes-header, .section-heading, .profile-actions) {
    gap: 10px;
  }

  .amv-view-shell :where(input, select, textarea, .select, .search-input) {
    min-height: 44px;
  }
}

@media (max-width: 520px) {
  .amv-view-shell :where(.metric-grid, .focus-grid, .student-grid, .resource-grid,
    .lessons-list, .quiz-stack, .summary-grid, .insight-row, .calendar-insight-row,
    .format__grid, .sound__grid, .skills__grid, .productions__grid) {
    grid-template-columns: minmax(0, 1fr);
  }

  .amv-view-shell :where(.hero, .hero-panel, .amv-hero, .calendar-hero,
    .resources-hero, .classes-header, .students__header, .gradebook__hero) {
    border-radius: 18px;
  }

  .amv-view-shell :where(.card, .panel, .surface, .summary-card, .metric-card,
    .focus-card, .next-class-card, .insight-card, .agenda-card, .quiz-card,
    .resource-card, .student-card, .lesson-card, .task-card, .format-card,
    .production, .state-card, .empty-card) {
    border-radius: 16px;
  }

  .amv-view-shell :where(.hero-actions > *, .form-actions > *, .footer-actions > *,
    .question-actions > *, .result-action > *, .result-next-step__actions > *) {
    width: 100%;
    min-width: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .amv-view-shell,
  .amv-view-shell :where(*, *::before, *::after) {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
