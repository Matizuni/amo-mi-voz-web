<template>
  <section class="course-hub">
    <header class="course-cover">
      <div class="course-cover__main">
        <span class="course-kicker">CURSO ACTIVO · SEPTIEMBRE — DICIEMBRE 2026</span>
        <h1>Canto, música e interpretación</h1>
        <p>Tu espacio central de aprendizaje. Revisa contenidos, próximas fechas, recursos, tareas y novedades sin salir del curso.</p>
        <div class="course-meta">
          <span>Academia Amo Mi Voz</span>
          <span>{{ isTeacher ? 'Vista docente' : 'Mi recorrido académico' }}</span>
          <span>{{ lessons.length }} clases publicadas</span>
        </div>
      </div>
      <aside class="course-cover__status">
        <div class="course-emblem">AMV</div>
        <div>
          <small>{{ isTeacher ? 'GESTIÓN DEL CURSO' : 'MI CURSO' }}</small>
          <strong>{{ isTeacher ? 'Contenido listo para enseñar' : `${progress}% completado` }}</strong>
          <div class="mini-progress"><span :style="{ width: `${progress}%` }"></span></div>
        </div>
      </aside>
    </header>

    <nav class="course-tabs" aria-label="Secciones del curso">
      <button v-for="tab in tabs" :key="tab.id" type="button" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
        <AulaIcon :name="tab.icon"/><span>{{ tab.label }}</span><em v-if="tab.count !== null">{{ tab.count }}</em>
      </button>
    </nav>

    <section v-if="loading" class="course-state"><span class="course-loader"></span><strong>Sincronizando tu curso…</strong></section>
    <section v-else-if="errorMessage" class="course-state course-state--error"><strong>No pudimos cargar todo el curso.</strong><p>{{ errorMessage }}</p><button @click="loadCourse">Reintentar</button></section>

    <template v-else>
      <div v-if="activeTab === 'overview'" class="overview-grid">
        <main class="overview-main">
          <section class="panel panel--next">
            <header class="panel-heading"><div><span>CONTINÚA AQUÍ</span><h2>{{ isTeacher ? 'Próxima clase del programa' : 'Tu siguiente paso' }}</h2></div><RouterLink to="/aula/programa-formativo">Ver contenido →</RouterLink></header>
            <article v-if="nextLesson" class="next-class" :class="{ 'next-class--with-cover': nextLessonCoverUrl }" :style="nextLessonCoverStyle">
              <div class="date-block"><strong>{{ nextLessonDay }}</strong><span>{{ nextLessonMonth }}</span></div>
              <div class="next-class__copy"><small>CLASE {{ lessonNumber(nextLesson) }}</small><h3>{{ nextLesson.title }}</h3><p>{{ nextLesson.description || 'Revisa el contenido, actividades y materiales preparados para esta sesión.' }}</p><div><span>{{ nextLesson.time || 'Horario por confirmar' }}</span><span>{{ nextLesson.modality || 'Presencial' }}</span></div></div>
              <RouterLink :to="`/aula/clase/${nextLesson.id}`" class="primary-action">Abrir clase <AulaIcon name="arrow"/></RouterLink>
            </article>
            <div v-else class="empty-inline">Todavía no hay una próxima clase disponible.</div>
          </section>

          <section class="panel">
            <header class="panel-heading"><div><span>ACTIVIDAD RECIENTE</span><h2>Lo que está pasando en tu curso</h2></div></header>
            <div class="activity-list">
              <article v-for="item in recentActivity" :key="item.key" class="activity-item">
                <div class="activity-icon"><AulaIcon :name="item.icon"/></div>
                <div><strong>{{ item.title }}</strong><p>{{ item.description }}</p><span>{{ item.meta }}</span></div>
                <RouterLink :to="item.to">Ver →</RouterLink>
              </article>
              <div v-if="!recentActivity.length" class="empty-inline">La actividad aparecerá aquí cuando agregues contenido.</div>
            </div>
          </section>
        </main>

        <aside class="overview-side">
          <section class="panel compact-panel">
            <header class="panel-heading"><div><span>ESTADO</span><h2>Curso en números</h2></div></header>
            <div class="metrics-grid"><article><strong>{{ lessons.length }}</strong><span>Clases</span></article><article><strong>{{ assignments.length }}</strong><span>Tareas</span></article><article><strong>{{ materials.length }}</strong><span>Recursos</span></article><article><strong>{{ upcomingEvents.length }}</strong><span>Próximos hitos</span></article></div>
          </section>

          <section class="panel compact-panel">
            <header class="panel-heading"><div><span>PRÓXIMAMENTE</span><h2>Calendario académico</h2></div><button class="text-button" @click="activeTab = 'calendar'">Ver todo</button></header>
            <div class="agenda-mini"><article v-for="event in upcomingEvents.slice(0,4)" :key="event.key"><div><strong>{{ event.day }}</strong><span>{{ event.month }}</span></div><p><b>{{ event.title }}</b><small>{{ event.typeLabel }}</small></p></article><div v-if="!upcomingEvents.length" class="empty-inline">Sin fechas próximas.</div></div>
          </section>

          <section class="panel compact-panel announcement-card">
            <header class="panel-heading"><div><span>NOVEDADES</span><h2>Anuncios del curso</h2></div><button class="text-button" @click="activeTab = 'announcements'">Abrir</button></header>
            <article><span class="announcement-dot"></span><div><strong>Bienvenido al espacio central del curso</strong><p>Desde aquí tendrás una vista unificada de todo tu recorrido académico.</p></div></article>
          </section>
        </aside>
      </div>

      <section v-else-if="activeTab === 'content'" class="content-browser">
        <header class="section-intro"><div><span>CONTENIDO DEL CURSO</span><h2>Aprende en una ruta clara y progresiva</h2><p>Todo el programa sigue viviendo en tu estructura actual, ahora conectado a una experiencia de curso central.</p></div><RouterLink to="/aula/programa-formativo" class="secondary-action">Abrir gestor completo →</RouterLink></header>
        <div class="module-list"><article v-for="(lesson, index) in lessons" :key="lesson.id" class="module-row"><div class="module-index">{{ String(index + 1).padStart(2,'0') }}</div><div class="module-copy"><small>{{ lesson.date || 'Fecha por definir' }}</small><strong>{{ lesson.title }}</strong><p>{{ lesson.description || 'Contenido académico de la clase.' }}</p></div><div class="module-tags"><span v-if="materialsForLesson(lesson.id)">{{ materialsForLesson(lesson.id) }} recursos</span><span v-if="assignmentsForLesson(lesson.id)">{{ assignmentsForLesson(lesson.id) }} actividades</span></div><RouterLink :to="`/aula/clase/${lesson.id}`">Entrar <AulaIcon name="arrow"/></RouterLink></article><div v-if="!lessons.length" class="empty-course">No hay clases publicadas todavía.</div></div>
      </section>

      <section v-else-if="activeTab === 'calendar'" class="calendar-view">
        <header class="section-intro"><div><span>CALENDARIO ACADÉMICO</span><h2>Fechas importantes del curso</h2><p>Clases y vencimientos reunidos automáticamente desde los datos que ya tienes en Supabase.</p></div></header>
        <div class="timeline"><article v-for="event in allEvents" :key="event.key" class="timeline-event"><div class="timeline-date"><strong>{{ event.day }}</strong><span>{{ event.month }}</span></div><div class="timeline-marker"><span :class="`is-${event.type}`"></span></div><div class="timeline-copy"><small>{{ event.typeLabel }}</small><h3>{{ event.title }}</h3><p>{{ event.description }}</p></div><RouterLink :to="event.to">Abrir →</RouterLink></article><div v-if="!allEvents.length" class="empty-course">Aún no hay eventos con fecha.</div></div>
      </section>

      <section v-else class="announcements-view">
        <header class="section-intro"><div><span>COMUNICACIONES</span><h2>Anuncios del curso</h2><p>Este centro queda preparado como experiencia de anuncios. La V4 no crea tablas nuevas en Supabase, por lo que no arriesga tu backend actual.</p></div><button v-if="isTeacher" class="secondary-action" type="button" disabled>+ Nuevo anuncio · próximo módulo</button></header>
        <div class="announcement-feed"><article><div class="announcement-avatar">AMV</div><div><div class="announcement-head"><strong>Bienvenido al nuevo centro del curso</strong><span>Destacado</span></div><p>Contenido, calendario, actividad y comunicaciones ahora conviven en un mismo contexto académico. Esta estructura queda lista para conectar una tabla de anuncios multiacademia en la siguiente fase de backend.</p><small>Academia Amo Mi Voz · Plataforma académica</small></div></article><article><div class="announcement-avatar announcement-avatar--soft">♪</div><div><div class="announcement-head"><strong>Tu programa se mantiene sincronizado</strong></div><p>Las clases, tareas y recursos que ya publicaste alimentan automáticamente este espacio. No duplicamos tus datos ni cambiamos tu modelo actual.</p><small>Sistema del curso</small></div></article></div>
      </section>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AulaIcon from '@/components/aula/AulaIcon.vue'
import { useAuth } from '@/composables/useAuth'
import { fetchLessons } from '@/services/lessonService'
import { fetchAssignments } from '@/services/assignmentService'
import { fetchMaterials } from '@/services/materialService'
import { getLessonAppearance } from '@/services/lessonAppearanceService'

const { isTeacher } = useAuth()
const activeTab = ref('overview')
const loading = ref(true)
const errorMessage = ref('')
const lessons = ref([])
const assignments = ref([])
const materials = ref([])

const tabs = computed(() => [
  { id:'overview', label:'Resumen', icon:'course', count:null },
  { id:'content', label:'Contenido', icon:'program', count:lessons.value.length },
  { id:'calendar', label:'Calendario', icon:'calendar', count:upcomingEvents.value.length },
  { id:'announcements', label:'Anuncios', icon:'announcement', count:2 }
])

const parseDate = value => {
  if (!value) return null
  const raw = String(value).trim().toLowerCase()
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T12:00:00` : raw
  let d = new Date(iso)
  if (!Number.isNaN(d.getTime())) return d

  const months = { enero:0, febrero:1, marzo:2, abril:3, mayo:4, junio:5, julio:6, agosto:7, septiembre:8, setiembre:8, octubre:9, noviembre:10, diciembre:11 }
  const match = raw.match(/(\d{1,2})\s*(?:de)?\s*([a-záéíóúñ]+)\s*(?:de)?\s*(\d{4})/)
  if (!match) return null
  const monthName = match[2].normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const month = months[monthName]
  if (month === undefined) return null
  d = new Date(Number(match[3]), month, Number(match[1]), 12, 0, 0)
  return Number.isNaN(d.getTime()) ? null : d
}
const dateParts = value => {
  const d = parseDate(value)
  if (!d) return { day:'--', month:'S/F' }
  return { day:String(d.getDate()).padStart(2,'0'), month:d.toLocaleDateString('es-CL',{month:'short'}).replace('.','').toUpperCase() }
}
const lessonNumber = lesson => String(Math.max(1, lessons.value.findIndex(item => item.id === lesson.id)+1)).padStart(2,'0')
const nextLesson = computed(() => {
  const floor = new Date(); floor.setHours(0,0,0,0)
  const candidates = lessons.value
    .filter(l => ['available','published','active'].includes(String(l.status || 'available').toLowerCase()))
    .map(l => ({ lesson:l, date:parseDate(l.date) }))
  const future = candidates.filter(item => item.date && item.date >= floor).sort((a,b)=>a.date-b.date)
  if (future.length) return future[0].lesson
  const undated = candidates.find(item => !item.date)
  if (undated) return undated.lesson
  const dated = candidates.filter(item => item.date).sort((a,b)=>b.date-a.date)
  return dated[0]?.lesson || lessons.value[0] || null
})
const nextLessonDay = computed(() => dateParts(nextLesson.value?.date).day)
const nextLessonMonth = computed(() => dateParts(nextLesson.value?.date).month)
const progress = computed(() => {
  if (!lessons.value.length) return 0
  const done = lessons.value.filter(l => ['completed','done','realized','realizada'].includes(String(l.status).toLowerCase())).length
  return Math.round((done / lessons.value.length) * 100)
})
const materialsForLesson = id => materials.value.filter(item => Number(item.lessonId) === Number(id)).length
const assignmentsForLesson = id => assignments.value.filter(item => Number(item.lessonId) === Number(id)).length

const allEvents = computed(() => {
  const list = []
  lessons.value.forEach(lesson => {
    const date = parseDate(lesson.date); if (!date) return
    const parts = dateParts(lesson.date)
    list.push({ key:`lesson-${lesson.id}`, date, ...parts, type:'lesson', typeLabel:'CLASE', title:lesson.title, description:lesson.time ? `${lesson.time} · ${lesson.modality || 'Sesión académica'}` : (lesson.modality || 'Sesión académica'), to:`/aula/clase/${lesson.id}` })
  })
  assignments.value.forEach(task => {
    const date = parseDate(task.dueDate); if (!date) return
    const parts = dateParts(task.dueDate)
    list.push({ key:`task-${task.id}`, date, ...parts, type:'task', typeLabel:'ENTREGA', title:task.title, description:`Vencimiento · ${task.points ?? 100} puntos`, to:`/aula/clase/${task.lessonId}/tarea/${task.id}` })
  })
  return list.sort((a,b)=>a.date-b.date)
})
const upcomingEvents = computed(() => {
  const floor = new Date(); floor.setHours(0,0,0,0)
  const future = allEvents.value.filter(item => item.date >= floor)
  return future.length ? future : allEvents.value.slice(-5)
})
const recentActivity = computed(() => {
  const list = []
  lessons.value.slice(-2).reverse().forEach(lesson => list.push({ key:`l-${lesson.id}`, icon:'program', title:lesson.title, description:'Clase disponible dentro del programa formativo.', meta:lesson.date || 'Contenido del curso', to:`/aula/clase/${lesson.id}` }))
  assignments.value.slice(-2).reverse().forEach(task => list.push({ key:`a-${task.id}`, icon:'tasks', title:task.title, description:'Actividad académica publicada.', meta:task.dueDate ? `Entrega: ${task.dueDate}` : 'Sin fecha límite', to:`/aula/clase/${task.lessonId}/tarea/${task.id}` }))
  return list.slice(0,4)
})

const loadCourse = async () => {
  loading.value = true; errorMessage.value = ''
  try {
    const results = await Promise.allSettled([fetchLessons(), fetchAssignments(), fetchMaterials()])
    lessons.value = results[0].status === 'fulfilled' ? results[0].value : []
    assignments.value = results[1].status === 'fulfilled' ? results[1].value : []
    materials.value = results[2].status === 'fulfilled' ? results[2].value : []
    if (results.every(r => r.status === 'rejected')) throw results[0].reason
    if (results.some(r => r.status === 'rejected')) errorMessage.value = ''
  } catch (error) { console.error(error); errorMessage.value = error?.message || 'Error inesperado.' }
  finally { loading.value = false }
}
onMounted(loadCourse)
</script>

<style scoped lang="scss">
.course-hub{--wine:#8f1d42;--gold:#d7aa27;--ink:#192434;--muted:#6f7d90;--line:#dfe5eb;display:grid;gap:18px}.course-cover{position:relative;overflow:hidden;display:grid;grid-template-columns:minmax(0,1.4fr) minmax(260px,.6fr);gap:32px;padding:38px 40px;border:1px solid #e2e6eb;border-radius:22px;background:radial-gradient(circle at 88% 10%,rgba(215,170,39,.15),transparent 27%),linear-gradient(135deg,#fff,#f8f6ef);box-shadow:0 14px 35px rgba(23,32,51,.055)}.course-cover:before{content:"";position:absolute;left:0;top:0;width:150px;height:4px;background:linear-gradient(90deg,var(--wine),var(--gold))}.course-kicker,.panel-heading span,.section-intro>div>span{color:#997513;font-size:.65rem;font-weight:850;letter-spacing:.15em}.course-cover h1{max-width:820px;margin:10px 0 11px;color:var(--ink);font-size:clamp(2.35rem,4vw,4.2rem);line-height:.98;letter-spacing:-.055em}.course-cover p{max-width:760px;margin:0;color:var(--muted);font-size:.96rem;line-height:1.65}.course-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}.course-meta span{padding:7px 10px;border:1px solid #e0e5ea;border-radius:999px;background:rgba(255,255,255,.78);color:#536174;font-size:.67rem}.course-cover__status{align-self:center;display:flex;gap:14px;padding:18px;border:1px solid #eadba6;border-radius:15px;background:rgba(255,252,240,.8)}.course-emblem{width:49px;height:49px;display:grid;place-items:center;border-radius:13px;background:#fff;color:#94700d;border:1px solid #e1c556;font-size:.75rem;font-weight:900}.course-cover__status>div:last-child{min-width:0;flex:1}.course-cover__status small{display:block;color:#9a7715;font-size:.58rem;font-weight:850;letter-spacing:.12em}.course-cover__status strong{display:block;margin:5px 0 9px;color:#263247;font-size:.82rem}.mini-progress{height:5px;overflow:hidden;border-radius:99px;background:#ece8dc}.mini-progress span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--wine),var(--gold))}.course-tabs{display:flex;gap:5px;overflow:auto;padding:6px;border:1px solid var(--line);border-radius:14px;background:#fff;box-shadow:0 5px 18px rgba(23,32,51,.035)}.course-tabs button{min-width:max-content;display:flex;align-items:center;gap:8px;padding:10px 14px;border:0;border-radius:9px;background:transparent;color:#647287;font-size:.76rem;font-weight:700;cursor:pointer}.course-tabs button:hover{background:#f6f8fa;color:#2c394b}.course-tabs button.active{background:#f7f1e2;color:#765a0a}.course-tabs em{min-width:20px;height:20px;display:grid;place-items:center;border-radius:99px;background:#eef1f4;color:#657286;font-size:.58rem;font-style:normal}.course-tabs .active em{background:#e6d49a;color:#6d5207}.overview-grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(300px,.65fr);gap:18px}.overview-main,.overview-side{display:grid;align-content:start;gap:18px}.panel,.content-browser,.calendar-view,.announcements-view{border:1px solid var(--line);border-radius:18px;background:#fff;box-shadow:0 8px 24px rgba(23,32,51,.035)}.panel{padding:22px}.panel-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:16px}.panel-heading h2{margin:4px 0 0;color:var(--ink);font-size:1.16rem;letter-spacing:-.02em}.panel-heading>a,.text-button{border:0;background:transparent;color:var(--wine);font-size:.69rem;font-weight:750;text-decoration:none;cursor:pointer}.next-class{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:18px;padding:20px;border:1px solid #e4e8ed;border-radius:14px;background:#f8fafb}.date-block{width:62px;height:67px;display:grid;place-items:center;align-content:center;border-radius:12px;background:#172332;color:#fff}.date-block strong{font-size:1.35rem}.date-block span{color:#d7aa27;font-size:.58rem;font-weight:800}.next-class__copy small{color:#9a7715;font-size:.6rem;font-weight:850}.next-class__copy h3{margin:5px 0;color:#1b2738;font-size:1.07rem}.next-class__copy p{margin:0 0 9px;color:#6d7b8e;font-size:.78rem;line-height:1.55}.next-class__copy>div{display:flex;gap:8px;flex-wrap:wrap}.next-class__copy>div span{padding:5px 8px;border-radius:7px;background:#fff;border:1px solid #e3e8ed;color:#718095;font-size:.61rem}.primary-action,.secondary-action{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:10px;text-decoration:none;font-size:.72rem;font-weight:800}.primary-action{padding:11px 14px;background:var(--wine);color:#fff}.secondary-action{padding:10px 13px;border:1px solid #dce2e8;background:#fff;color:#435167}.secondary-action:disabled{opacity:.55}.activity-list{display:grid}.activity-item{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:13px;padding:14px 3px;border-top:1px solid #edf0f3}.activity-item:first-child{border-top:0}.activity-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:10px;background:#f5f1e6;color:#98740e}.activity-item strong{color:#283549;font-size:.78rem}.activity-item p{margin:3px 0;color:#748195;font-size:.69rem}.activity-item span{color:#9aa4b3;font-size:.6rem}.activity-item>a{color:var(--wine);font-size:.66rem;font-weight:750;text-decoration:none}.compact-panel{padding:19px}.metrics-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.metrics-grid article{padding:13px;border:1px solid #e5e9ee;border-radius:11px;background:#fafbfc}.metrics-grid strong{display:block;color:#273449;font-size:1.35rem}.metrics-grid span{color:#788599;font-size:.62rem}.agenda-mini{display:grid;gap:5px}.agenda-mini article{display:grid;grid-template-columns:42px 1fr;gap:10px;align-items:center;padding:8px;border-radius:10px}.agenda-mini article:hover{background:#fafbfc}.agenda-mini article>div{height:42px;display:grid;place-items:center;align-content:center;border-radius:9px;background:#f4f6f8;color:#334155}.agenda-mini article>div strong{font-size:.83rem}.agenda-mini article>div span{color:#9c7712;font-size:.49rem;font-weight:850}.agenda-mini p{margin:0}.agenda-mini b{display:block;color:#344156;font-size:.7rem}.agenda-mini small{color:#8a96a7;font-size:.57rem}.announcement-card>article{display:flex;gap:9px;padding:12px;border-radius:11px;background:#fff9e9}.announcement-dot{width:8px;height:8px;margin-top:4px;border-radius:99px;background:var(--gold)}.announcement-card strong{display:block;color:#3f4b5d;font-size:.72rem}.announcement-card p{margin:5px 0 0;color:#7c8797;font-size:.65rem;line-height:1.5}.section-intro{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;padding:25px 26px;border-bottom:1px solid #e8ecf0}.section-intro h2{margin:5px 0;color:#1b2738;font-size:1.45rem}.section-intro p{max-width:730px;margin:0;color:#768397;font-size:.76rem;line-height:1.55}.module-list{padding:0 16px 16px}.module-row{display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;align-items:center;gap:15px;padding:16px 10px;border-bottom:1px solid #edf0f3}.module-index{width:38px;height:38px;display:grid;place-items:center;border-radius:9px;background:#f0f3f6;color:#536174;font-size:.7rem;font-weight:800}.module-copy small{color:#9d7914;font-size:.56rem;font-weight:800}.module-copy strong{display:block;margin:3px 0;color:#29364a;font-size:.8rem}.module-copy p{margin:0;color:#7b8798;font-size:.66rem}.module-tags{display:flex;gap:6px}.module-tags span{padding:5px 7px;border:1px solid #e1e6eb;border-radius:7px;color:#7c8898;font-size:.57rem}.module-row>a{display:flex;align-items:center;gap:5px;color:var(--wine);font-size:.67rem;font-weight:800;text-decoration:none}.timeline{padding:5px 24px 24px}.timeline-event{display:grid;grid-template-columns:56px 28px minmax(0,1fr) auto;align-items:center;gap:10px;min-height:92px}.timeline-date{display:grid;place-items:center;align-content:center}.timeline-date strong{font-size:1.1rem;color:#2e3b4f}.timeline-date span{color:#997513;font-size:.56rem;font-weight:850}.timeline-marker{height:100%;display:grid;place-items:center;position:relative}.timeline-marker:before{content:"";position:absolute;top:0;bottom:0;width:1px;background:#e4e8ed}.timeline-marker span{z-index:1;width:10px;height:10px;border:3px solid #fff;border-radius:99px;background:#7a8798;box-shadow:0 0 0 1px #dce2e8}.timeline-marker span.is-task{background:var(--wine)}.timeline-marker span.is-lesson{background:var(--gold)}.timeline-copy small{color:#9a7715;font-size:.56rem;font-weight:850}.timeline-copy h3{margin:3px 0;color:#2a374a;font-size:.82rem}.timeline-copy p{margin:0;color:#7a8798;font-size:.65rem}.timeline-event>a{color:var(--wine);font-size:.65rem;font-weight:800;text-decoration:none}.announcement-feed{display:grid;padding:8px 24px 24px}.announcement-feed>article{display:grid;grid-template-columns:auto 1fr;gap:14px;padding:20px 0;border-bottom:1px solid #edf0f3}.announcement-avatar{width:43px;height:43px;display:grid;place-items:center;border-radius:12px;background:#8f1d42;color:#fff;font-size:.68rem;font-weight:900}.announcement-avatar--soft{background:#f4edd6;color:#8c6b12}.announcement-head{display:flex;align-items:center;gap:8px}.announcement-head strong{color:#2c394b;font-size:.82rem}.announcement-head span{padding:4px 7px;border-radius:99px;background:#fff4d1;color:#80600b;font-size:.52rem;font-weight:800}.announcement-feed p{margin:7px 0;color:#6f7d90;font-size:.73rem;line-height:1.6}.announcement-feed small{color:#9aa4b1;font-size:.59rem}.empty-inline,.empty-course{padding:18px;color:#8a96a7;font-size:.72rem}.empty-course{text-align:center}.course-state{min-height:180px;display:grid;place-items:center;align-content:center;gap:10px;border:1px solid var(--line);border-radius:18px;background:#fff;color:#59677a}.course-loader{width:28px;height:28px;border:3px solid #e1e6eb;border-top-color:var(--wine);border-radius:99px;animation:spin .8s linear infinite}.course-state--error button{padding:8px 12px;border:1px solid #dce2e8;border-radius:8px;background:#fff;color:#8f1d42}.course-state--error p{margin:0;color:#8792a2;font-size:.7rem}@keyframes spin{to{transform:rotate(360deg)}}
.next-class--with-cover{position:relative;overflow:hidden;isolation:isolate}.next-class--with-cover:before{content:'';position:absolute;inset:0;z-index:-2;background-image:var(--next-cover);background-size:cover;background-position:center;opacity:.15}.next-class--with-cover:after{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(248,250,251,.98),rgba(248,250,251,.9) 65%,rgba(248,250,251,.74))}
@media(max-width:1050px){.course-cover,.overview-grid{grid-template-columns:1fr}.course-cover__status{max-width:500px}.next-class{grid-template-columns:auto 1fr}.next-class .primary-action{grid-column:1/-1}.overview-side{grid-template-columns:repeat(2,1fr)}.announcement-card{grid-column:1/-1}.module-row{grid-template-columns:auto 1fr}.module-tags,.module-row>a{grid-column:2}.timeline-event{grid-template-columns:50px 20px 1fr}.timeline-event>a{grid-column:3}}
@media(max-width:650px){.course-cover{padding:27px 21px;border-radius:17px}.course-cover h1{font-size:2.45rem}.course-cover__status{display:none}.course-tabs button{padding:9px 11px}.overview-side{grid-template-columns:1fr}.next-class{grid-template-columns:1fr}.date-block{width:52px;height:55px}.next-class .primary-action{grid-column:auto}.panel{padding:17px}.section-intro{padding:20px;flex-direction:column}.module-row{grid-template-columns:auto 1fr;padding:14px 4px}.module-tags{display:none}.timeline{padding:5px 14px 18px}.timeline-event{grid-template-columns:44px 14px 1fr}.timeline-copy p{display:none}}
</style>
