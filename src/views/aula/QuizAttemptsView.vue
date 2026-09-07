<template>
  <main class="teacher-attempts">
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
</style>
