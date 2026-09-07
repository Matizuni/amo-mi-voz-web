<template>

  <main class="musicals-page">
    <a class="amv-skip-link" href="#amv-main-content">
      Ir al contenido principal
    </a>

    <!-- =====================================================*
        HERO
*    ====================================================== -->

    <section id="amv-main-content" class="hero">

      <div class="hero__grid"></div>

      <div class="hero__glow hero__glow--one"></div>

      <div class="hero__glow hero__glow--two"></div>

      <div class="container hero__content">

        <div class="hero__eyebrow">

          <span></span>

          PRODUCCIONES ESCÉNICO-MUSICALES · AMO MI VOZ

        </div>

        <h1>

          Historias que

          <span>también se cantan.</span>

        </h1>

        <p class="hero__lead">

          Grandes canciones, interpretación, teatro,

          narración y diseño sonoro se encuentran en una

          experiencia escénica creada para nuestros estudiantes

          y para el público.

        </p>

        <div class="hero__actions">

          <a

            href="#producciones"

            class="button button--primary"

          >

            Descubrir producciones

            <span>↓</span>

          </a>

          <RouterLink

            to="/inscripcion"

            class="button button--secondary"

          >

            Quiero ser parte

          </RouterLink>

        </div>

        <div class="hero__facts">

          <article>

            <span>01</span>

            <div>

              <small>MÚSICA</small>

              <strong>Canciones emblemáticas</strong>

            </div>

          </article>

          <article>

            <span>02</span>

            <div>

              <small>RELATO</small>

              <strong>Narración en off</strong>

            </div>

          </article>

          <article>

            <span>03</span>

            <div>

              <small>ESCENA</small>

              <strong>Teatro e interpretación</strong>

            </div>

          </article>

          <article>

            <span>04</span>

            <div>

              <small>SONIDO</small>

              <strong>Ambientes y producción</strong>

            </div>

          </article>

        </div>

      </div>

      <div class="hero__scroll">

        <span></span>

        DESCUBRIR

      </div>

    </section>
    <nav class="public-jump-nav" aria-label="Explorar esta página">
      <span>EXPLORAR</span>
        <a href="#concepto-musicales">Concepto</a>
        <a href="#formato-musicales">Formato</a>
        <a href="#producciones">Producciones</a>
        <a href="#proceso-musicales">Proceso</a>
      <RouterLink to="/inscripcion">Inscribirme →</RouterLink>
    </nav>


    <!-- =====================================================*
        CONCEPTO
*    ====================================================== -->

    <section id="concepto-musicales" class="concept">

      <div class="container concept__grid">

        <div class="concept__heading">

          <span class="eyebrow">

            NUESTRO FORMATO

          </span>

          <h2>

            No solo interpretamos

            <em>canciones.</em>

          </h2>

        </div>

        <div class="concept__copy">

          <p class="concept__lead">

            Nuestras producciones reúnen algunos de los momentos

            musicales más reconocibles de cada obra y los conectan

            mediante una propuesta teatral propia.

          </p>

          <p>

            Una voz en off acompaña al público y construye el hilo

            narrativo entre las distintas escenas. Los estudiantes

            interpretan personajes, desarrollan situaciones teatrales

            y dan vida al repertorio desde la voz, el movimiento y

            la expresión.

          </p>

          <p>

            Todo se complementa con diseño sonoro: voces pregrabadas

            cuando la escena lo requiere, efectos, ambientes,

            transiciones y elementos musicales preparados para que

            la experiencia mantenga continuidad y una identidad

            escénica propia.

          </p>

          <div class="concept__quote">

            <span>“</span>

            <strong>

              Una canción puede contar una historia.

              Una puesta en escena puede hacerla vivir.

            </strong>

          </div>

        </div>

      </div>

    </section>

    <!-- =====================================================*
        FORMATO
*    ====================================================== -->

    <section id="formato-musicales" class="format">

      <div class="container">

        <header class="section-header">

          <div>

            <span class="eyebrow">

              UNA EXPERIENCIA COMPLETA

            </span>

            <h2>

              Música, relato

              <em>y escena.</em>

            </h2>

          </div>

          <p>

            Cada producción integra diferentes disciplinas para

            construir una experiencia fluida y comprensible

            incluso para quienes no conocen la obra original.

          </p>

        </header>

        <div class="format__grid">

          <article

            v-for="item in formatItems"

            :key="item.number"

            class="format-card"

          >

            <header>

              <span>{{ item.number }}</span>

              <div class="format-card__icon">

                {{ item.icon }}

              </div>

            </header>

            <h3>

              {{ item.title }}

            </h3>

            <p>

              {{ item.description }}

            </p>

            <small>

              {{ item.detail }}

            </small>

          </article>

        </div>

      </div>

    </section>

    <!-- =====================================================*
        PRODUCCIONES
*    ====================================================== -->

    <section

      id="producciones"

      class="productions"

    >

      <div class="container">

        <header class="productions__header">

          <span class="eyebrow">

            NUESTRO REPERTORIO ESCÉNICO

          </span>

          <h2>

            Tres universos.

            <em>Tres experiencias.</em>

          </h2>

          <p>

            Cada producción conserva una personalidad visual,

            musical y dramática diferente.

          </p>

        </header>

        <!-- =================================================*
            JESUCRISTO SUPERSTAR
*        ================================================== -->

        <article class="production production--jesus">

          <div class="production__poster">

            <div class="poster-frame">

              <img

                :src="jesusFlyer"

                alt="Flyer de Jesucristo Superstar de Amo Mi Voz"

              />

              <div class="poster-frame__shine"></div>

            </div>

            <span class="production__index">

              01

            </span>

          </div>

          <div class="production__content">

            <span class="production__category">

              ROCK · TEATRO · INTERPRETACIÓN

            </span>

            <h3>

              Jesucristo

              <em>Superstar</em>

            </h3>

            <p class="production__intro">

              Una propuesta intensa construida alrededor de algunos

              de los grandes momentos musicales de la obra.

            </p>

            <p>

              La interpretación vocal y teatral conduce una historia

              marcada por el conflicto, la tensión dramática y la

              fuerza del rock. La narración permite conectar los

              distintos números musicales y mantener una línea

              argumental continua.

            </p>

            <div class="production__features">

              <span>Rock</span>

              <span>Voces solistas</span>

              <span>Actuación</span>

              <span>Narración</span>

              <span>Diseño sonoro</span>

            </div>

            <div class="production__footer">

              <div>

                <small>FORMATO</small>

                <strong>Selección de grandes éxitos</strong>

              </div>

              <div>

                <small>EXPERIENCIA</small>

                <strong>Escénico-musical</strong>

              </div>

            </div>

          </div>

        </article>

        <!-- =================================================*
            COCO
*        ================================================== -->

        <article class="production production--reverse production--coco">

          <div class="production__poster">

            <div class="poster-frame">

              <img

                :src="cocoFlyer"

                alt="Flyer de la producción COCO de Amo Mi Voz"

              />

              <div class="poster-frame__shine"></div>

            </div>

            <span class="production__index">

              02

            </span>

          </div>

          <div class="production__content">

            <span class="production__category">

              FAMILIA · MÚSICA · MEMORIA

            </span>

            <h3>

              COCO

            </h3>

            <p class="production__intro">

              Música, personajes y emoción se unen para recorrer

              una historia sobre los sueños, la familia y la memoria.

            </p>

            <p>

              Las canciones más representativas se enlazan mediante

              escenas y narración, permitiendo que los estudiantes

              interpreten distintos personajes mientras desarrollan

              canto, actuación, coordinación y presencia escénica.

            </p>

            <div class="production__features">

              <span>Canto</span>

              <span>Personajes</span>

              <span>Teatro</span>

              <span>Ambientes</span>

              <span>Ensamble</span>

            </div>

            <div class="production__footer">

              <div>

                <small>FORMATO</small>

                <strong>Selección de grandes éxitos</strong>

              </div>

              <div>

                <small>PROPUESTA</small>

                <strong>Familiar y teatral</strong>

              </div>

            </div>

          </div>

        </article>

        <!-- =================================================*
            JACK
*        ================================================== -->

        <article class="production production--jack">

          <div class="production__poster">

            <div class="poster-frame">

              <img

                :src="jackFlyer"

                alt="Flyer de El Extraño Mundo de Jack de Amo Mi Voz"

              />

              <div class="poster-frame__shine"></div>

            </div>

            <span class="production__index">

              03

            </span>

          </div>

          <div class="production__content">

            <span class="production__category">

              FANTASÍA · HALLOWEEN · TEATRO MUSICAL

            </span>

            <h3>

              El Extraño Mundo

              <em>de Jack</em>

            </h3>

            <p class="production__intro">

              Una experiencia fantástica en la que música,

              teatralidad y atmósferas construyen un universo

              escénico lleno de personalidad.

            </p>

            <p>

              La narración guía al público entre canciones y escenas,

              mientras el diseño sonoro incorpora ambientes,

              transiciones y efectos capaces de reforzar el carácter

              oscuro, fantástico y lúdico de la puesta en escena.

            </p>

            <div class="production__features">

              <span>Fantasía</span>

              <span>Personajes</span>

              <span>Halloween</span>

              <span>FX sonoros</span>

              <span>Interpretación</span>

            </div>

            <div class="production__footer">

              <div>

                <small>FORMATO</small>

                <strong>Selección de grandes éxitos</strong>

              </div>

              <div>

                <small>UNIVERSO</small>

                <strong>Fantástico y escénico</strong>

              </div>

            </div>

          </div>

        </article>

      </div>

    </section>

    <!-- =====================================================*
        PRODUCCIÓN SONORA
*    ====================================================== -->

    <section class="sound">

      <div class="sound__wave"></div>

      <div class="container sound__grid">

        <div class="sound__heading">

          <span class="eyebrow">

            DETRÁS DEL ESCENARIO

          </span>

          <h2>

            El sonido también

            <em>cuenta la historia.</em>

          </h2>

          <p>

            Una parte fundamental ocurre antes de que el público

            escuche la primera canción.

          </p>

        </div>

        <div class="sound-console">

          <div class="sound-console__header">

            <span class="sound-console__light"></span>

            <div>

              <small>AMO MI VOZ</small>

              <strong>Producción de audio</strong>

            </div>

            <span class="sound-console__status">

              LIVE

            </span>

          </div>

          <div class="sound-console__channels">

            <article

              v-for="channel in soundChannels"

              :key="channel.number"

            >

              <div class="sound-console__meter">

                <span

                  v-for="n in 8"

                  :key="n"

                  :class="{

                    active: n <= channel.level

                  }"

                ></span>

              </div>

              <small>

                CH {{ channel.number }}

              </small>

              <strong>

                {{ channel.name }}

              </strong>

            </article>

          </div>

        </div>

      </div>

      <div class="container sound__features">

        <article>

          <span>01</span>

          <strong>Narración en off</strong>

          <p>

            Conecta escenas, entrega contexto y guía

            dramáticamente la historia.

          </p>

        </article>

        <article>

          <span>02</span>

          <strong>Ambientes</strong>

          <p>

            Espacios, atmósferas y paisajes sonoros

            que ayudan a construir cada universo.

          </p>

        </article>

        <article>

          <span>03</span>

          <strong>Efectos</strong>

          <p>

            Elementos sonoros que refuerzan acciones,

            transiciones y momentos dramáticos.

          </p>

        </article>

        <article>

          <span>04</span>

          <strong>Voces</strong>

          <p>

            Diálogos y elementos vocales preparados

            cuando la escena necesita apoyo narrativo.

          </p>

        </article>

        <article>

          <span>05</span>

          <strong>Música</strong>

          <p>

            Edición y preparación del material para

            mantener continuidad durante el espectáculo.

          </p>

        </article>

        <article>

          <span>06</span>

          <strong>Sonido en vivo</strong>

          <p>

            Microfonía, mezcla y operación técnica

            pensadas para cada presentación.

          </p>

        </article>

      </div>

    </section>

    <!-- =====================================================*
        PROCESO FORMATIVO
*    ====================================================== -->

    <section id="proceso-musicales" class="process">

      <div class="container">

        <header class="section-header">

          <div>

            <span class="eyebrow">

              DEL ENSAYO AL ESCENARIO

            </span>

            <h2>

              Una producción también

              <em>es una clase.</em>

            </h2>

          </div>

          <p>

            Cada montaje permite aplicar en contexto real

            las habilidades desarrolladas durante la formación.

          </p>

        </header>

        <div class="process__timeline">

          <article

            v-for="step in productionProcess"

            :key="step.number"

          >

            <span class="process__number">

              {{ step.number }}

            </span>

            <div class="process__line"></div>

            <small>

              {{ step.label }}

            </small>

            <h3>

              {{ step.title }}

            </h3>

            <p>

              {{ step.description }}

            </p>

          </article>

        </div>

      </div>

    </section>

    <!-- =====================================================*
        COMPETENCIAS
*    ====================================================== -->

    <section class="skills">

      <div class="container skills__grid">

        <div>

          <span class="eyebrow">

            FORMACIÓN ARTÍSTICA

          </span>

          <h2>

            Lo que ocurre en escena

            <em>también forma al estudiante.</em>

          </h2>

        </div>

        <div class="skills__list">

          <article

            v-for="skill in skills"

            :key="skill.number"

          >

            <span>

              {{ skill.number }}

            </span>

            <div>

              <strong>

                {{ skill.title }}

              </strong>

              <p>

                {{ skill.description }}

              </p>

            </div>

          </article>

        </div>

      </div>

    </section>

    <!-- =====================================================*
        MANIFIESTO FINAL
*    ====================================================== -->

    <section class="final-manifesto">

      <div class="final-manifesto__grid"></div>

      <div class="final-manifesto__glow"></div>

      <div class="container final-manifesto__content">

        <span class="eyebrow">

          AMO MI VOZ · EXPERIENCIAS ESCÉNICAS

        </span>

        <h2>

          Escuchar.

          <span>Interpretar.</span>

          Actuar.

          <em>Vivir la música.</em>

        </h2>

        <p>

          El escenario transforma el aprendizaje en experiencia

          y convierte cada canción en una oportunidad para comunicar.

        </p>

      </div>

    </section>

    <!-- =====================================================*
        CTA
*    ====================================================== -->

    <section class="cta">

      <div class="container cta__content">

        <span class="eyebrow">

          ¿QUIERES VIVIRLO DESDE EL ESCENARIO?

        </span>

        <h2>

          La próxima historia

          <em>también puede tener tu voz.</em>

        </h2>

        <p>

          Forma parte del proceso artístico de Amo Mi Voz

          y participa en nuestros proyectos, ensayos

          y experiencias escénicas.

        </p>

        <RouterLink

          to="/inscripcion"

          class="button button--primary button--large"

        >

          Solicitar inscripción

          <span>→</span>

        </RouterLink>

      </div>

    </section>

      <PublicQuickActions />
  </main>

</template>

<script setup>
import PublicQuickActions from '@/components/public/PublicQuickActions.vue'


import jesusFlyer from '@/assets/images/jesus-flayer.png'

import cocoFlyer from '@/assets/images/coco-flayer.png'

import jackFlyer from '@/assets/images/jack-flayer.png'

const formatItems = [

  {

    number: '01',

    icon: '♪',

    title: 'Grandes canciones',

    description:

      'Seleccionamos números representativos capaces de sostener los momentos centrales de cada producción.',

    detail:

      'Repertorio · Solistas · Ensambles'

  },

  {

    number: '02',

    icon: '●',

    title: 'Narración',

    description:

      'Una voz en off conecta los momentos musicales y permite construir continuidad dramática.',

    detail:

      'Relato · Contexto · Transiciones'

  },

  {

    number: '03',

    icon: '◆',

    title: 'Teatro',

    description:

      'Los estudiantes interpretan personajes y situaciones, integrando actuación y expresión corporal.',

    detail:

      'Personajes · Escenas · Interpretación'

  },

  {

    number: '04',

    icon: '≈',

    title: 'Diseño sonoro',

    description:

      'Ambientes, voces, efectos y transiciones ayudan a construir el universo de cada historia.',

    detail:

      'FX · Ambientes · Voces'

  },

  {

    number: '05',

    icon: '◎',

    title: 'Trabajo vocal',

    description:

      'Cada canción se prepara desde la técnica, la afinación, el fraseo y la intención interpretativa.',

    detail:

      'Técnica · Afinación · Expresión'

  },

  {

    number: '06',

    icon: '▰',

    title: 'Escenario',

    description:

      'El proceso culmina cuando música, actuación, audio y público se encuentran en una presentación.',

    detail:

      'Ensayo · Montaje · Presentación'

  }

]

const soundChannels = [

  {

    number: '01',

    name: 'NARRADOR',

    level: 7

  },

  {

    number: '02',

    name: 'VOCES',

    level: 6

  },

  {

    number: '03',

    name: 'MÚSICA',

    level: 8

  },

  {

    number: '04',

    name: 'AMBIENTE',

    level: 5

  },

  {

    number: '05',

    name: 'FX',

    level: 4

  }

]

const productionProcess = [

  {

    number: '01',

    label: 'REPERTORIO',

    title: 'Conocemos la música',

    description:

      'Estudiamos melodías, personajes y momentos principales.'

  },

  {

    number: '02',

    label: 'VOCAL',

    title: 'Preparamos las voces',

    description:

      'Trabajamos afinación, técnica, fraseo e interpretación.'

  },

  {

    number: '03',

    label: 'ESCENA',

    title: 'Construimos personajes',

    description:

      'Integramos actuación, movimiento y relaciones escénicas.'

  },

  {

    number: '04',

    label: 'ENSAMBLE',

    title: 'Unimos las partes',

    description:

      'Música, narración, personajes y sonido comienzan a funcionar juntos.'

  },

  {

    number: '05',

    label: 'MONTAJE',

    title: 'Ensayamos la experiencia',

    description:

      'Trabajamos continuidad, entradas, transiciones y dinámica escénica.'

  },

  {

    number: '06',

    label: 'ESCENARIO',

    title: 'Compartimos la historia',

    description:

      'Todo el trabajo encuentra sentido frente al público.'

  }

]

const skills = [

  {

    number: '01',

    title: 'Interpretación vocal',

    description:

      'Cantar pensando en el personaje, el texto y el momento dramático.'

  },

  {

    number: '02',

    title: 'Presencia escénica',

    description:

      'Aprender a ocupar el espacio, comunicar y mantener atención.'

  },

  {

    number: '03',

    title: 'Trabajo en equipo',

    description:

      'Comprender que cada estudiante forma parte de una producción colectiva.'

  },

  {

    number: '04',

    title: 'Escucha',

    description:

      'Coordinarse con compañeros, música, narración y señales escénicas.'

  },

  {

    number: '05',

    title: 'Responsabilidad artística',

    description:

      'Preparar repertorio, asistir a ensayos y sostener un rol dentro del montaje.'

  },

  {

    number: '06',

    title: 'Confianza',

    description:

      'Desarrollar seguridad mediante experiencias progresivas frente al público.'

  }

]

</script>

<style scoped lang="scss">

@use '@/assets/styles/abstracts/variables' as variables;

@use '@/assets/styles/abstracts/mixins' as mixins;

/* =========================================================*
   BASE
*========================================================= */

.musicals-page {

  --bg: #070707;

  --surface: #0d0d0d;

  --surface-light: #111111;

  --border: #292929;

  --muted: #797979;

  min-height: 100vh;

  overflow: hidden;

  color: #f5f5f5;

  background: var(--bg);

}

.container {

  width: min(1200px, 100%);

  margin: 0 auto;

}

.eyebrow {

  display: block;

  color: variables.$color-primary;

  font-size: 0.62rem;

  font-weight: 900;

  letter-spacing: 0.19em;

  text-transform: uppercase;

}

.button {

  display: inline-flex;

  gap: 10px;

  align-items: center;

  justify-content: center;

  min-height: 49px;

  padding: 13px 21px;

  border-radius: 9px;

  font-size: 0.71rem;

  font-weight: 900;

  text-decoration: none;

  transition:

    transform 0.2s ease,

    border-color 0.2s ease,

    box-shadow 0.2s ease,

    color 0.2s ease;

}

.button:hover {

  transform: translateY(-2px);

}

.button--primary {

  border: 1px solid variables.$color-primary;

  color: #080808;

  background: variables.$color-primary;

}

.button--primary:hover {

  box-shadow:

    0 18px 45px

    rgba(212, 175, 55, 0.16);

}

.button--secondary {

  border: 1px solid #393939;

  color: #aaa;

  background: transparent;

}

.button--secondary:hover {

  color: #fff;

  border-color: #5a5a5a;

}

.button--large {

  min-height: 57px;

  padding-right: 27px;

  padding-left: 27px;

}

/* =========================================================*
   HERO
*========================================================= */

.hero {

  position: relative;

  display: flex;

  min-height: 100vh;

  align-items: center;

  overflow: hidden;

  padding: 170px 24px 120px;

  background:

    linear-gradient(

      180deg,

      rgba(255, 255, 255, 0.015),

      transparent 45%

    ),

    #080808;

}

.hero__grid {

  position: absolute;

  inset: 0;

  pointer-events: none;

  background:

    linear-gradient(

      90deg,

      rgba(255, 255, 255, 0.013) 1px,

      transparent 1px

    ),

    linear-gradient(

      rgba(255, 255, 255, 0.013) 1px,

      transparent 1px

    );

  background-size: 75px 75px;

  mask-image:

    radial-gradient(

      circle at center,

      black,

      transparent 80%

    );

}

.hero__glow {

  position: absolute;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(160px);

}

.hero__glow--one {

  top: -180px;

  right: -120px;

  width: 650px;

  height: 650px;

  background:

    rgba(212, 175, 55, 0.08);

}

.hero__glow--two {

  bottom: -300px;

  left: -200px;

  width: 550px;

  height: 550px;

  background:

    rgba(212, 175, 55, 0.035);

}

.hero__content {

  position: relative;

  z-index: 2;

}

.hero__eyebrow {

  display: flex;

  gap: 10px;

  align-items: center;

  color: variables.$color-primary;

  font-size: 0.63rem;

  font-weight: 900;

  letter-spacing: 0.2em;

}

.hero__eyebrow > span {

  width: 8px;

  height: 8px;

  border-radius: 50%;

  background: variables.$color-primary;

  box-shadow:

    0 0 18px

    rgba(212, 175, 55, 0.7);

}

.hero h1 {

  max-width: 1050px;

  margin: 25px 0 0;

  font-size:

    clamp(4.2rem, 9vw, 9rem);

  line-height: 0.84;

  letter-spacing: -0.075em;

}

.hero h1 span {

  display: block;

  color: variables.$color-primary;

}

.hero__lead {

  max-width: 710px;

  margin: 34px 0 0;

  color: #949494;

  font-size: 1rem;

  line-height: 1.85;

}

.hero__actions {

  display: flex;

  gap: 11px;

  flex-wrap: wrap;

  margin-top: 36px;

}

.hero__facts {

  display: grid;

  gap: 1px;

  overflow: hidden;

  max-width: 900px;

  margin-top: 60px;

  border: 1px solid #292929;

  border-radius: 13px;

  background: #292929;

  @include mixins.respond-to(md) {

    grid-template-columns:

      repeat(4, 1fr);

  }

}

.hero__facts article {

  display: flex;

  gap: 13px;

  padding: 17px;

  background: #0b0b0b;

}

.hero__facts article > span {

  color: variables.$color-primary;

  font-size: 0.51rem;

  font-weight: 900;

}

.hero__facts small,

.hero__facts strong {

  display: block;

}

.hero__facts small {

  color: #575757;

  font-size: 0.46rem;

  font-weight: 900;

  letter-spacing: 0.12em;

}

.hero__facts strong {

  margin-top: 4px;

  font-size: 0.63rem;

}

.hero__scroll {

  position: absolute;

  right: 30px;

  bottom: 35px;

  display: flex;

  gap: 9px;

  align-items: center;

  color: #464646;

  font-size: 0.46rem;

  font-weight: 900;

  letter-spacing: 0.18em;

  transform: rotate(90deg);

  transform-origin: right center;

}

.hero__scroll span {

  width: 30px;

  height: 1px;

  background: variables.$color-primary;

}

/* =========================================================*
   CONCEPT
*========================================================= */

.concept {

  padding: 130px 24px;

}

.concept__grid {

  display: grid;

  gap: 75px;

  @include mixins.respond-to(lg) {

    grid-template-columns:

      0.85fr 1.15fr;

  }

}

.concept__heading h2,

.section-header h2,

.productions__header h2,

.sound__heading h2,

.skills h2 {

  margin: 18px 0 0;

  font-size:

    clamp(3rem, 5.4vw, 5.4rem);

  line-height: 0.94;

  letter-spacing: -0.06em;

}

.concept__heading h2 em,

.section-header h2 em,

.productions__header h2 em,

.sound__heading h2 em,

.skills h2 em {

  display: block;

  color: variables.$color-primary;

  font-style: normal;

}

.concept__copy {

  max-width: 700px;

}

.concept__copy > p {

  color: #797979;

  font-size: 0.87rem;

  line-height: 1.85;

}

.concept__lead {

  margin-top: 0;

  color: #c8c8c8 !important;

  font-size: 1.04rem !important;

}

.concept__quote {

  display: flex;

  gap: 17px;

  margin-top: 31px;

  padding: 21px;

  border-left:

    2px solid

    variables.$color-primary;

  background:

    rgba(212, 175, 55, 0.025);

}

.concept__quote > span {

  color: variables.$color-primary;

  font-size: 2rem;

  line-height: 0.75;

}

.concept__quote strong {

  max-width: 540px;

  color: #aaa;

  font-size: 0.79rem;

  font-style: italic;

  line-height: 1.65;

}

/* =========================================================*
   HEADER
*========================================================= */

.section-header {

  display: grid;

  gap: 35px;

  margin-bottom: 55px;

  @include mixins.respond-to(md) {

    grid-template-columns:

      1fr 0.42fr;

    align-items: end;

  }

}

.section-header > p {

  margin: 0;

  color: #777;

  font-size: 0.78rem;

  line-height: 1.75;

}

/* =========================================================*
   FORMAT
*========================================================= */

.format {

  padding: 125px 24px;

  background: #0a0a0a;

}

.format__grid {

  display: grid;

  gap: 12px;

  @include mixins.respond-to(md) {

    grid-template-columns:

      repeat(2, 1fr);

  }

  @include mixins.respond-to(lg) {

    grid-template-columns:

      repeat(3, 1fr);

  }

}

.format-card {

  position: relative;

  overflow: hidden;

  padding: 27px;

  border: 1px solid #292929;

  border-radius: 17px;

  background: #101010;

  transition:

    transform 0.25s ease,

    border-color 0.25s ease;

}

.format-card::after {

  position: absolute;

  right: -50px;

  bottom: -50px;

  width: 120px;

  height: 120px;

  border-radius: 50%;

  content: '';

  background:

    rgba(212, 175, 55, 0.035);

  filter: blur(25px);

}

.format-card:hover {

  transform: translateY(-4px);

  border-color:

    rgba(212, 175, 55, 0.28);

}

.format-card header {

  display: flex;

  align-items: center;

  justify-content: space-between;

}

.format-card header > span {

  color: variables.$color-primary;

  font-size: 0.53rem;

  font-weight: 900;

}

.format-card__icon {

  display: grid;

  width: 39px;

  height: 39px;

  place-items: center;

  border:

    1px solid

    rgba(212, 175, 55, 0.24);

  border-radius: 50%;

  color: variables.$color-primary;

  font-size: 0.65rem;

  font-weight: 900;

}

.format-card h3 {

  margin: 25px 0 11px;

  font-size: 1.1rem;

}

.format-card p {

  min-height: 70px;

  margin: 0;

  color: #777;

  font-size: 0.7rem;

  line-height: 1.65;

}

.format-card > small {

  display: block;

  margin-top: 21px;

  padding-top: 17px;

  border-top: 1px solid #272727;

  color: #555;

  font-size: 0.5rem;

  font-weight: 800;

  letter-spacing: 0.08em;

}

/* =========================================================*
   PRODUCTIONS
*========================================================= */

.productions {

  padding: 135px 24px;

}

.productions__header {

  max-width: 870px;

  margin-bottom: 90px;

}

.productions__header > p {

  max-width: 620px;

  margin-top: 23px;

  color: #777;

  font-size: 0.8rem;

  line-height: 1.7;

}

.production {

  display: grid;

  gap: 75px;

  align-items: center;

  padding: 90px 0;

  border-top: 1px solid #242424;

  @include mixins.respond-to(lg) {

    grid-template-columns:

      0.8fr 1.2fr;

  }

}

.production:last-child {

  border-bottom: 1px solid #242424;

}

.production--reverse {

  @include mixins.respond-to(lg) {

    grid-template-columns:

      1.2fr 0.8fr;

  }

}

.production--reverse .production__poster {

  @include mixins.respond-to(lg) {

    order: 2;

  }

}

.production--reverse .production__content {

  @include mixins.respond-to(lg) {

    order: 1;

  }

}

.production__poster {

  position: relative;

  max-width: 470px;

  margin: 0 auto;

}

.poster-frame {

  position: relative;

  overflow: hidden;

  border:

    1px solid

    rgba(255, 255, 255, 0.14);

  border-radius: 8px;

  background: #111;

  box-shadow:

    0 45px 100px

    rgba(0, 0, 0, 0.55);

  transform:

    perspective(1200px)

    rotateY(3deg);

  transition:

    transform 0.5s ease,

    box-shadow 0.5s ease;

}

.production--reverse .poster-frame {

  transform:

    perspective(1200px)

    rotateY(-3deg);

}

.poster-frame:hover,

.production--reverse .poster-frame:hover {

  transform:

    perspective(1200px)

    rotateY(0deg)

    translateY(-5px);

  box-shadow:

    0 55px 120px

    rgba(0, 0, 0, 0.65);

}

.poster-frame img {

  display: block;

  width: 100%;

  height: auto;

}

.poster-frame__shine {

  position: absolute;

  inset: 0;

  pointer-events: none;

  background:

    linear-gradient(

      120deg,

      rgba(255, 255, 255, 0.06),

      transparent 30%

    );

}

.production__index {

  position: absolute;

  z-index: -1;

  right: -35px;

  bottom: -43px;

  color:

    rgba(212, 175, 55, 0.07);

  font-size: 8rem;

  font-weight: 950;

  line-height: 1;

}

.production__category {

  display: block;

  color: variables.$color-primary;

  font-size: 0.54rem;

  font-weight: 900;

  letter-spacing: 0.17em;

}

.production__content h3 {

  margin: 15px 0 0;

  font-size:

    clamp(3.2rem, 6vw, 6rem);

  line-height: 0.9;

  letter-spacing: -0.065em;

}

.production__content h3 em {

  display: block;

  color: variables.$color-primary;

  font-style: normal;

}

.production__intro {

  max-width: 650px;

  margin: 27px 0 0 !important;

  color: #c0c0c0 !important;

  font-size: 0.93rem !important;

}

.production__content > p {

  max-width: 670px;

  color: #777;

  font-size: 0.78rem;

  line-height: 1.8;

}

.production__features {

  display: flex;

  gap: 7px;

  flex-wrap: wrap;

  margin-top: 25px;

}

.production__features span {

  padding: 8px 11px;

  border: 1px solid #323232;

  border-radius: 999px;

  color: #868686;

  font-size: 0.56rem;

  font-weight: 800;

}

.production__footer {

  display: grid;

  gap: 1px;

  overflow: hidden;

  max-width: 630px;

  margin-top: 30px;

  border: 1px solid #292929;

  border-radius: 11px;

  background: #292929;

  @include mixins.respond-to(sm) {

    grid-template-columns: 1fr 1fr;

  }

}

.production__footer > div {

  padding: 15px;

  background: #0d0d0d;

}

.production__footer small,

.production__footer strong {

  display: block;

}

.production__footer small {

  margin-bottom: 5px;

  color: #575757;

  font-size: 0.44rem;

  font-weight: 900;

  letter-spacing: 0.11em;

}

.production__footer strong {

  font-size: 0.65rem;

}

/* =========================================================*
   SOUND
*========================================================= */

.sound {

  position: relative;

  overflow: hidden;

  padding: 135px 24px;

  background: #090909;

}

.sound__wave {

  position: absolute;

  top: 50px;

  right: -100px;

  width: 650px;

  height: 350px;

  opacity: 0.09;

  background:

    repeating-linear-gradient(

      90deg,

      variables.$color-primary 0,

      variables.$color-primary 2px,

      transparent 2px,

      transparent 11px

    );

  mask-image:

    radial-gradient(

      ellipse,

      black 15%,

      transparent 70%

    );

}

.sound__grid {

  position: relative;

  display: grid;

  gap: 70px;

  @include mixins.respond-to(lg) {

    grid-template-columns:

      0.85fr 1.15fr;

    align-items: center;

  }

}

.sound__heading > p {

  max-width: 490px;

  margin-top: 24px;

  color: #777;

  font-size: 0.8rem;

  line-height: 1.75;

}

/* =========================================================*
   FAKE AUDIO CONSOLE
*========================================================= */

.sound-console {

  overflow: hidden;

  border:

    1px solid

    rgba(212, 175, 55, 0.17);

  border-radius: 20px;

  background:

    linear-gradient(

      145deg,

      rgba(212, 175, 55, 0.025),

      transparent

    ),

    #0c0c0c;

  box-shadow:

    0 35px 90px

    rgba(0, 0, 0, 0.4);

}

.sound-console__header {

  display: flex;

  gap: 12px;

  align-items: center;

  padding: 18px 20px;

  border-bottom: 1px solid #272727;

}

.sound-console__light {

  width: 8px;

  height: 8px;

  border-radius: 50%;

  background: variables.$color-primary;

  box-shadow:

    0 0 12px

    rgba(212, 175, 55, 0.7);

}

.sound-console__header div {

  flex: 1;

}

.sound-console__header small,

.sound-console__header strong {

  display: block;

}

.sound-console__header small {

  color: #555;

  font-size: 0.43rem;

  font-weight: 900;

  letter-spacing: 0.12em;

}

.sound-console__header strong {

  margin-top: 2px;

  font-size: 0.68rem;

}

.sound-console__status {

  padding: 6px 8px;

  border-radius: 5px;

  color: #090909;

  background: variables.$color-primary;

  font-size: 0.42rem;

  font-weight: 950;

}

.sound-console__channels {

  display: grid;

  grid-template-columns:

    repeat(5, 1fr);

}

.sound-console__channels article {

  display: flex;

  min-width: 0;

  flex-direction: column;

  align-items: center;

  padding: 22px 8px;

  border-right: 1px solid #252525;

}

.sound-console__channels article:last-child {

  border-right: 0;

}

.sound-console__meter {

  display: flex;

  height: 120px;

  flex-direction: column-reverse;

  gap: 4px;

  justify-content: flex-start;

  margin-bottom: 13px;

}

.sound-console__meter span {

  width: 8px;

  height: 8px;

  border-radius: 2px;

  background: #222;

}

.sound-console__meter span.active {

  background: variables.$color-primary;

  box-shadow:

    0 0 8px

    rgba(212, 175, 55, 0.28);

}

.sound-console__channels small {

  color: #515151;

  font-size: 0.42rem;

  font-weight: 900;

}

.sound-console__channels strong {

  margin-top: 5px;

  color: #aaa;

  font-size: 0.45rem;

  text-align: center;

}

.sound__features {

  position: relative;

  display: grid;

  gap: 1px;

  overflow: hidden;

  margin-top: 65px;

  border: 1px solid #292929;

  border-radius: 15px;

  background: #292929;

  @include mixins.respond-to(md) {

    grid-template-columns:

      repeat(2, 1fr);

  }

  @include mixins.respond-to(lg) {

    grid-template-columns:

      repeat(3, 1fr);

  }

}

.sound__features article {

  padding: 22px;

  background: #0d0d0d;

}

.sound__features article > span {

  color: variables.$color-primary;

  font-size: 0.47rem;

  font-weight: 900;

}

.sound__features strong {

  display: block;

  margin-top: 12px;

  font-size: 0.8rem;

}

.sound__features p {

  margin: 7px 0 0;

  color: #6d6d6d;

  font-size: 0.63rem;

  line-height: 1.6;

}

/* =========================================================*
   PROCESS
*========================================================= */

.process {

  padding: 130px 24px;

  background: #0b0b0b;

}

.process__timeline {

  display: grid;

  gap: 13px;

  @include mixins.respond-to(md) {

    grid-template-columns:

      repeat(2, 1fr);

  }

  @include mixins.respond-to(lg) {

    grid-template-columns:

      repeat(6, 1fr);

  }

}

.process__timeline article {

  position: relative;

  padding: 21px;

  border: 1px solid #292929;

  border-radius: 15px;

  background: #101010;

}

.process__number {

  display: grid;

  width: 38px;

  height: 38px;

  margin-bottom: 21px;

  place-items: center;

  border-radius: 50%;

  color: #080808;

  background: variables.$color-primary;

  font-size: 0.53rem;

  font-weight: 900;

}

.process__timeline small {

  color: variables.$color-primary;

  font-size: 0.44rem;

  font-weight: 900;

  letter-spacing: 0.12em;

}

.process__timeline h3 {

  margin: 8px 0;

  font-size: 0.84rem;

}

.process__timeline p {

  margin: 0;

  color: #6c6c6c;

  font-size: 0.61rem;

  line-height: 1.6;

}

/* =========================================================*
   SKILLS
*========================================================= */

.skills {

  padding: 130px 24px;

}

.skills__grid {

  display: grid;

  gap: 75px;

  @include mixins.respond-to(lg) {

    grid-template-columns:

      0.8fr 1.2fr;

  }

}

.skills__list {

  display: grid;

  gap: 10px;

}

.skills__list article {

  display: flex;

  gap: 18px;

  padding: 20px;

  border: 1px solid #292929;

  border-radius: 13px;

  background: #0d0d0d;

}

.skills__list article > span {

  color: variables.$color-primary;

  font-size: 0.49rem;

  font-weight: 900;

}

.skills__list strong {

  display: block;

  font-size: 0.76rem;

}

.skills__list p {

  margin: 5px 0 0;

  color: #6d6d6d;

  font-size: 0.63rem;

  line-height: 1.55;

}

/* =========================================================*
   FINAL MANIFESTO
*========================================================= */

.final-manifesto {

  position: relative;

  overflow: hidden;

  padding: 150px 24px;

  border-top: 1px solid #222;

  border-bottom: 1px solid #222;

}

.final-manifesto__grid {

  position: absolute;

  inset: 0;

  background:

    linear-gradient(

      90deg,

      rgba(255, 255, 255, 0.012) 1px,

      transparent 1px

    ),

    linear-gradient(

      rgba(255, 255, 255, 0.012) 1px,

      transparent 1px

    );

  background-size: 70px 70px;

}

.final-manifesto__glow {

  position: absolute;

  top: 50%;

  left: 50%;

  width: 850px;

  height: 550px;

  border-radius: 50%;

  background:

    rgba(212, 175, 55, 0.07);

  transform:

    translate(-50%, -50%);

  filter: blur(170px);

}

.final-manifesto__content {

  position: relative;

  z-index: 2;

}

.final-manifesto h2 {

  max-width: 1000px;

  margin: 22px 0 0;

  font-size:

    clamp(4rem, 8vw, 8rem);

  line-height: 0.85;

  letter-spacing: -0.075em;

}

.final-manifesto h2 span {

  color: variables.$color-primary;

}

.final-manifesto h2 em {

  display: block;

  color: variables.$color-primary;

  font-style: normal;

}

.final-manifesto p {

  max-width: 620px;

  margin-top: 30px;

  color: #858585;

  font-size: 0.82rem;

  line-height: 1.75;

}

/* =========================================================*
   CTA
*========================================================= */

.cta {

  padding: 140px 24px;

  background: #090909;

}

.cta__content {

  display: grid;

  justify-items: center;

  text-align: center;

}

.cta h2 {

  max-width: 950px;

  margin: 19px 0 0;

  font-size:

    clamp(3.3rem, 7vw, 6.8rem);

  line-height: 0.89;

  letter-spacing: -0.07em;

}

.cta h2 em {

  display: block;

  color: variables.$color-primary;

  font-style: normal;

}

.cta p {

  max-width: 600px;

  margin: 26px 0 31px;

  color: #818181;

  font-size: 0.82rem;

  line-height: 1.75;

}

/* =========================================================*
   RESPONSIVE
*========================================================= */

@media (max-width: 900px) {

  .hero {

    min-height: auto;

    padding:

      145px 20px

      100px;

  }

  .concept,

  .format,

  .productions,

  .sound,

  .process,

  .skills,

  .final-manifesto,

  .cta {

    padding:

      95px 20px;

  }

  .production {

    gap: 55px;

    padding: 70px 0;

  }

  .productions__header {

    margin-bottom: 50px;

  }

}

@media (max-width: 700px) {

  .hero {

    padding:

      130px 17px

      80px;

  }

  .hero h1 {

    font-size:

      clamp(3.6rem, 15vw, 5.8rem);

  }

  .hero__actions {

    flex-direction: column;

  }

  .hero__actions .button {

    width: 100%;

  }

  .hero__scroll {

    display: none;

  }

  .production__poster {

    max-width: 390px;

  }

  .production__content h3 {

    font-size:

      clamp(3rem, 13vw, 4.6rem);

  }

  .production__index {

    right: -5px;

  }

  .sound-console__channels {

    grid-template-columns:

      repeat(5, minmax(55px, 1fr));

    overflow-x: auto;

  }

}

@media (max-width: 500px) {

  .hero__facts {

    grid-template-columns: 1fr;

  }

  .format-card {

    padding: 22px;

  }

  .production {

    padding: 55px 0;

  }

  .production__features span {

    font-size: 0.52rem;

  }

  .final-manifesto h2 {

    font-size:

      clamp(3.2rem, 15vw, 5rem);

  }

}



/* =========================================================
   AMV PUBLIC MAX · 2026
   Diseño institucional light-first + marketing + accesibilidad
========================================================= */

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page) {
  --amv-bg: #f4f6f9;
  --amv-surface: #ffffff;
  --amv-soft: #f8fafc;
  --amv-ink: #152033;
  --amv-copy: #344359;
  --amv-muted: #6f7c8f;
  --amv-line: #dbe3ec;
  --amv-line-strong: #c8d4e1;
  --amv-wine: #9f1945;
  --amv-wine-dark: #771333;
  --amv-wine-soft: #fff1f5;
  --amv-gold: #d5a720;
  --amv-gold-dark: #916b00;
  --amv-gold-soft: #fff8e8;
  --amv-green: #2d8f66;
  --amv-shadow: 0 12px 30px rgba(31,48,73,.055);

  min-height: 100vh !important;
  overflow: clip !important;
  color: var(--amv-ink) !important;
  background: var(--amv-bg) !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  :is(a,button,input,select,textarea) {
  -webkit-tap-highlight-color: transparent;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  :focus-visible {
  outline: 3px solid rgba(159,25,69,.28) !important;
  outline-offset: 3px !important;
}

/* HERO: cinematic, pero no toda la web negra */
:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > :is(.hero,.academy-hero) {
  color: #fff !important;
  background:
    radial-gradient(circle at 82% 20%, rgba(159,25,69,.18), transparent 28%),
    linear-gradient(135deg,#101a2d,#18263e) !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > :is(.hero,.academy-hero) :is(h1,h2,h3,strong) {
  color: #fff;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > :is(.hero,.academy-hero) :is(em,h1 span) {
  color: #f0c748;
}

/* Navegación contextual — 3 clics / orientación */
.public-jump-nav {
  position: sticky;
  z-index: 70;
  top: 76px;
  display: flex;
  min-height: 58px;
  gap: 4px;
  align-items: center;
  width: min(1180px,calc(100% - 32px));
  margin: -1px auto 0;
  padding: 7px 9px;
  overflow-x: auto;
  border: 1px solid var(--amv-line);
  border-radius: 0 0 15px 15px;
  background: rgba(255,255,255,.96);
  box-shadow: 0 12px 26px rgba(31,48,73,.07);
  backdrop-filter: blur(12px);
  scrollbar-width: none;
}

.public-jump-nav::-webkit-scrollbar { display: none; }

.public-jump-nav > span {
  flex: 0 0 auto;
  padding: 0 9px;
  color: var(--amv-gold-dark);
  font-size: .52rem;
  font-weight: 900;
  letter-spacing: .12em;
}

.public-jump-nav a {
  display: inline-flex;
  min-height: 42px;
  flex: 0 0 auto;
  align-items: center;
  padding: 0 12px;
  border-radius: 9px;
  color: #56657a;
  font-size: .68rem;
  font-weight: 850;
  text-decoration: none;
}

.public-jump-nav a:hover {
  color: var(--amv-wine);
  background: var(--amv-wine-soft);
}

.public-jump-nav a:last-child {
  margin-left: auto;
  color: #fff;
  background: var(--amv-wine);
}

/* Todas las secciones editoriales pasan a superficies claras */
:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:not(.hero):not(.academy-hero):not(.academy-cta):not(.cta):not(.final-cta) {
  color: var(--amv-ink) !important;
  background: var(--amv-surface) !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:nth-of-type(odd):not(.hero):not(.academy-hero):not(.academy-cta):not(.cta):not(.final-cta) {
  background:
    linear-gradient(180deg,#f8fafc,#f3f6f9) !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:not(.hero):not(.academy-hero)
  :is(h2,h3,h4,strong) {
  color: var(--amv-ink);
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:not(.hero):not(.academy-hero)
  :is(p,li) {
  color: var(--amv-muted);
}

/* Cards heredadas: mismo lenguaje */
:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:not(.hero):not(.academy-hero)
  [class*="card"]:not([class*="cta"]) {
  border-color: var(--amv-line) !important;
  background: #fff !important;
  color: var(--amv-ink) !important;
  box-shadow: var(--amv-shadow) !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:not(.hero):not(.academy-hero)
  [class*="card"]:not([class*="cta"]) :is(h2,h3,h4,strong) {
  color: var(--amv-ink) !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:not(.hero):not(.academy-hero)
  [class*="card"]:not([class*="cta"]) :is(p,small) {
  color: var(--amv-muted) !important;
}

/* Eyebrows y acentos */
:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:not(.hero):not(.academy-hero)
  [class*="eyebrow"] {
  color: var(--amv-gold-dark) !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:not(.hero):not(.academy-hero)
  :is(h1,h2,h3) em {
  color: var(--amv-wine) !important;
}

/* CTAs finales */
:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > :is(.academy-cta,.cta,.final-cta) {
  color: #fff !important;
  background:
    radial-gradient(circle at 85% 10%, rgba(159,25,69,.2), transparent 30%),
    linear-gradient(135deg,#101a2d,#1b2941) !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > :is(.academy-cta,.cta,.final-cta) :is(h2,h3,strong) {
  color: #fff !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > :is(.academy-cta,.cta,.final-cta) p {
  color: rgba(255,255,255,.68) !important;
}

/* Forms */
.inscription-page :is(input,select,textarea),
.contact-page :is(input,select,textarea) {
  min-height: 48px !important;
  border: 1px solid var(--amv-line-strong) !important;
  border-radius: 11px !important;
  color: var(--amv-ink) !important;
  background: #fff !important;
}

.inscription-page textarea,
.contact-page textarea {
  min-height: 130px !important;
}

.inscription-page :is(input,select,textarea):focus,
.contact-page :is(input,select,textarea):focus {
  border-color: var(--amv-wine) !important;
  box-shadow: 0 0 0 4px rgba(159,25,69,.08) !important;
}

/* Buttons */
:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  :is(.button,.academy-button,[class*="button--primary"]) {
  min-height: 46px;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  :is(.button--primary,.academy-button--primary,.cta__button) {
  border-color: var(--amv-wine) !important;
  color: #fff !important;
  background: var(--amv-wine) !important;
}

/* Mejora lectura en desktop */
:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  .container {
  width: min(1180px,100%) !important;
}

/* Scroll target */
:where(
  #formacion-academia,#metodo-academia,#experiencia-academia,#comunidad-academia,
  #canales-contacto,#ubicacion-contacto,#cierre-contacto,
  #historia-galeria,#explorar-galeria,#proceso-galeria,#cierre-galeria,
  #solicitud-inscripcion,#concepto-musicales,#formato-musicales,#producciones,
  #proceso-musicales,#programa,#pilares-formacion,#recorrido-formacion,#faq-formacion
) {
  scroll-margin-top: 150px;
}

@media (max-width: 760px) {
  .public-jump-nav {
    top: 66px;
    width: calc(100% - 20px);
    min-height: 54px;
    padding-inline: 6px;
  }

  .public-jump-nav > span {
    display: none;
  }

  .public-jump-nav a {
    min-height: 44px;
    font-size: .7rem;
  }

  .public-jump-nav a:last-child {
    margin-left: 0;
  }

  :where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
    :is(.button,.academy-button,a[class*="button"]) {
    min-height: 48px !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  :where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page) *,
  :where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page) *::before,
  :where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page) *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}


/* Musicals */
.concept,.format,.productions,.process,.skills {
  color: var(--amv-ink) !important;
}
.format-card,
.production,
.process article,
.skills article {
  border-color: var(--amv-line) !important;
  background: #fff !important;
  box-shadow: var(--amv-shadow) !important;
}
.production__content h3,
.format-card h3 { color: var(--amv-ink) !important; }
.production__content p,
.format-card p { color: var(--amv-muted) !important; }
.production__features span {
  border-color: var(--amv-line) !important;
  color: var(--amv-copy) !important;
  background: var(--amv-soft) !important;
}


.amv-skip-link {
  position: fixed;
  z-index: 9999;
  top: 8px;
  left: 8px;
  padding: 10px 14px;
  border-radius: 9px;
  color: #fff !important;
  background: #9f1945;
  font-size: .75rem;
  font-weight: 900;
  text-decoration: none;
  transform: translateY(-150%);
}
.amv-skip-link:focus { transform: translateY(0); }

</style>