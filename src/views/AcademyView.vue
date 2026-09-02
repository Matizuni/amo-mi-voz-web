<template>
  <main class="academy-page">
    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="hero">
      <div class="hero__grid"></div>
      <div class="hero__glow hero__glow--top"></div>
      <div class="hero__glow hero__glow--bottom"></div>

      <div class="container hero__layout">
        <div class="hero__content">
          <div class="eyebrow">
            <span></span>
            NUESTRA ACADEMIA
          </div>

          <h1>
            Formación artística
            <em>
              con propósito y experiencia real.
            </em>
          </h1>

          <p class="hero__lead">
            Amo Mi Voz es un espacio de formación vocal,
            musical y escénica donde cada estudiante
            desarrolla herramientas para comprender,
            interpretar y compartir música.
          </p>

          <div class="hero__actions">
            <RouterLink
              to="/inscripcion"
              class="button button--primary"
            >
              Quiero ser parte
              <span>→</span>
            </RouterLink>

            <RouterLink
              to="/formacion"
              class="button button--secondary"
            >
              Conocer la formación
            </RouterLink>
          </div>

          <div class="hero__facts">
            <article>
              <small>FORMACIÓN</small>
              <strong>
                Vocal · Musical · Escénica
              </strong>
            </article>

            <article>
              <small>METODOLOGÍA</small>
              <strong>
                Aprender haciendo
              </strong>
            </article>

            <article>
              <small>EXPERIENCIA</small>
              <strong>
                Aula + escenario
              </strong>
            </article>
          </div>
        </div>

        <!-- ALUMNO 10 -->
        <div class="hero__visual">
          <figure class="hero-photo">
            <img
              :src="student10"
              alt="Estudiante de la Academia de Talentos Amo Mi Voz"
            />

            <div class="hero-photo__overlay"></div>

            <figcaption>
              <small>
                AMO MI VOZ · LA CALERA
              </small>

              <strong>
                Descubrir.
                <span>Desarrollar.</span>
                Compartir.
              </strong>
            </figcaption>
          </figure>

          <div class="hero-badge hero-badge--top">
            <span>♪</span>

            <div>
              <small>FORMACIÓN</small>
              <strong>Integral</strong>
            </div>
          </div>

          <div class="hero-badge hero-badge--bottom">
            <span>01</span>

            <div>
              <small>OBJETIVO</small>
              <strong>
                Encontrar tu propia voz
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
         IDENTIDAD
    ====================================================== -->
    <section class="identity">
      <div class="container identity__grid">
        <div>
          <span class="eyebrow eyebrow--simple">
            QUIÉNES SOMOS
          </span>

          <h2 class="display-title">
            Un lugar para aprender música
            <em>viviéndola.</em>
          </h2>
        </div>

        <div class="identity__copy">
          <p class="identity__lead">
            En Amo Mi Voz entendemos que aprender música
            no consiste solamente en asistir a una clase.
          </p>

          <p>
            El aprendizaje ocurre cuando una persona
            comprende un concepto, lo escucha, lo experimenta,
            lo practica, se equivoca, vuelve a intentarlo
            y finalmente logra utilizarlo dentro de una
            experiencia musical real.
          </p>

          <p>
            Por eso nuestra propuesta combina técnica vocal,
            teoría musical, entrenamiento auditivo,
            interpretación, repertorio, trabajo colectivo
            y experiencias frente al público.
          </p>

          <div class="identity__statement">
            <span></span>

            <strong>
              Formación artística con herramientas
              que puedan acompañar al estudiante
              más allá de la sala de clases.
            </strong>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
         HISTORIA VISUAL
         ALUMNO 11
    ====================================================== -->
    <section class="story">
      <div class="container story__grid">
        <div class="story__visual">
          <figure>
            <img
              :src="student11"
              alt="Proceso formativo de un estudiante de Amo Mi Voz"
            />

            <div class="story__overlay"></div>

            <figcaption>
              <small>
                NUESTRA HISTORIA
              </small>

              <strong>
                Crear un espacio donde
                <em>la música se experimente.</em>
              </strong>
            </figcaption>
          </figure>

          <div class="story__floating">
            <span>
              AMV
            </span>

            <p>
              Técnica, música,
              interpretación y escenario.
            </p>
          </div>
        </div>

        <div class="story__content">
          <span class="eyebrow eyebrow--simple">
            POR QUÉ NACE AMO MI VOZ
          </span>

          <h2 class="display-title">
            Aprender también significa
            <em>atreverse.</em>
          </h2>

          <p>
            Muchos estudiantes pueden aprender una canción,
            pero todavía sentir inseguridad al momento
            de interpretarla frente a otras personas.
          </p>

          <p>
            Amo Mi Voz nace desde la idea de acompañar
            ese recorrido completo: desde los primeros
            ejercicios hasta el momento en que el estudiante
            puede transformar lo aprendido en una experiencia
            artística.
          </p>

          <div class="story__milestones">
            <article>
              <span>01</span>

              <div>
                <strong>
                  Aprender
                </strong>

                <p>
                  Comprender herramientas vocales
                  y musicales.
                </p>
              </div>
            </article>

            <article>
              <span>02</span>

              <div>
                <strong>
                  Practicar
                </strong>

                <p>
                  Llevar las herramientas
                  a ejercicios y repertorio.
                </p>
              </div>
            </article>

            <article>
              <span>03</span>

              <div>
                <strong>
                  Interpretar
                </strong>

                <p>
                  Dar intención, emoción
                  y significado a la música.
                </p>
              </div>
            </article>

            <article>
              <span>04</span>

              <div>
                <strong>
                  Compartir
                </strong>

                <p>
                  Presentarse y vivir una
                  experiencia artística real.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
         PRINCIPIOS
    ====================================================== -->
    <section class="principles">
      <div class="container">
        <header class="section-header">
          <div>
            <span class="eyebrow eyebrow--simple">
              NUESTRA FORMA DE ENSEÑAR
            </span>

            <h2 class="display-title">
              Una metodología basada
              <em>en la experiencia.</em>
            </h2>
          </div>

          <p>
            El estudiante necesita comprender
            qué está haciendo, pero también
            experimentar cómo se siente y cómo suena.
          </p>
        </header>

        <div class="principles__grid">
          <article
            v-for="principle in principles"
            :key="principle.number"
            class="principle-card"
          >
            <div class="principle-card__top">
              <span>
                {{ principle.number }}
              </span>

              <strong>
                {{ principle.symbol }}
              </strong>
            </div>

            <h3>
              {{ principle.title }}
            </h3>

            <p>
              {{ principle.description }}
            </p>

            <small>
              {{ principle.detail }}
            </small>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         EXPERIENCIA
    ====================================================== -->
    <section class="experience">
      <div class="container experience__grid">
        <div class="experience__heading">
          <span class="eyebrow eyebrow--simple">
            LA EXPERIENCIA AMO MI VOZ
          </span>

          <h2 class="display-title">
            Del aula
            <em>al escenario.</em>
          </h2>

          <p>
            El escenario no aparece al final como un premio.
            Es parte del proceso formativo.
          </p>
        </div>

        <div class="experience__steps">
          <article
            v-for="step in experienceSteps"
            :key="step.number"
          >
            <span class="experience__number">
              {{ step.number }}
            </span>

            <div>
              <small>
                {{ step.label }}
              </small>

              <h3>
                {{ step.title }}
              </h3>

              <p>
                {{ step.description }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         VALORES
    ====================================================== -->
    <section class="values">
      <div class="container">
        <header class="section-header section-header--center">
          <div>
            <span class="eyebrow eyebrow--simple">
              NUESTROS VALORES
            </span>

            <h2 class="display-title">
              La música también
              <em>forma personas.</em>
            </h2>
          </div>

          <p>
            La formación artística puede desarrollar
            capacidades que trascienden la música.
          </p>
        </header>

        <div class="values__grid">
          <article
            v-for="value in values"
            :key="value.number"
            class="value-card"
          >
            <span class="value-card__number">
              {{ value.number }}
            </span>

            <h3>
              {{ value.title }}
            </h3>

            <p>
              {{ value.description }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         COMUNIDAD
         ALUMNO 12
    ====================================================== -->
    <section class="community">
      <div class="container community__grid">
        <div class="community__content">
          <span class="eyebrow eyebrow--simple">
            COMUNIDAD
          </span>

          <h2 class="display-title">
            Crecer también
            <em>es escuchar a otros.</em>
          </h2>

          <p>
            Cantar junto a otras personas transforma
            la manera en que entendemos la música.
          </p>

          <p>
            El trabajo grupal desarrolla escucha,
            responsabilidad, empatía, independencia,
            colaboración y conciencia del lugar que
            cada voz ocupa dentro de un conjunto.
          </p>

          <div class="community__tags">
            <span>Escucha</span>
            <span>Respeto</span>
            <span>Colaboración</span>
            <span>Responsabilidad</span>
            <span>Confianza</span>
          </div>
        </div>

        <figure class="community__photo">
          <img
            :src="student12"
            alt="Estudiante de la comunidad artística Amo Mi Voz"
          />

          <div class="community__photo-overlay"></div>

          <figcaption>
            <small>
              CRECER JUNTOS
            </small>

            <strong>
              Cada voz tiene
              <em>un lugar.</em>
            </strong>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- =====================================================
         FORMACIÓN
    ====================================================== -->
    <section class="formation">
      <div class="formation__grid-background"></div>

      <div class="container formation__content">
        <span class="eyebrow eyebrow--simple">
          FORMACIÓN INTEGRAL
        </span>

        <h2>
          Técnica.
          <span>Música.</span>
          Interpretación.
          <em>Experiencia.</em>
        </h2>

        <p>
          Cuatro dimensiones que se conectan
          constantemente durante el proceso.
        </p>

        <div class="formation__areas">
          <article>
            <span>01</span>

            <strong>
              Técnica vocal
            </strong>

            <small>
              Respiración · Resonancia · Afinación
            </small>
          </article>

          <article>
            <span>02</span>

            <strong>
              Formación musical
            </strong>

            <small>
              Ritmo · Oído · Lectura · Teoría
            </small>
          </article>

          <article>
            <span>03</span>

            <strong>
              Interpretación
            </strong>

            <small>
              Texto · Emoción · Presencia
            </small>
          </article>

          <article>
            <span>04</span>

            <strong>
              Escenario
            </strong>

            <small>
              Ensayos · Conciertos · Musicales
            </small>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         DIRECCIÓN
    ====================================================== -->
    <section class="director">
      <div class="container director__grid">
        <div class="director__identity">
          <div class="director__monogram">
            <span>
              MZ
            </span>

            <div class="director__monogram-ring"></div>
          </div>

          <div class="director__identity-copy">
            <small>
              DIRECCIÓN MUSICAL
            </small>

            <strong>
              Matías Zúñiga
            </strong>

            <span>
              Academia de Talentos Amo Mi Voz
            </span>
          </div>
        </div>

        <div class="director__content">
          <span class="eyebrow eyebrow--simple">
            DIRECCIÓN ARTÍSTICA Y MUSICAL
          </span>

          <h2 class="display-title">
            Una mirada que conecta
            <em>música, educación y escenario.</em>
          </h2>

          <p>
            La dirección de la academia integra planificación
            formativa, preparación vocal, trabajo de repertorio,
            ensayos, producción escénica y desarrollo técnico
            de las presentaciones.
          </p>

          <p>
            Esto permite que el aprendizaje no quede separado
            de la experiencia artística, sino que cada proyecto
            se convierta en una oportunidad concreta para
            aplicar lo trabajado durante las clases.
          </p>

          <blockquote>
            <span>“</span>

            <p>
              Cada voz tiene una historia.
              Nuestro trabajo es ayudarla
              a ser escuchada.
            </p>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- =====================================================
         DIFERENCIAS
    ====================================================== -->
    <section class="difference">
      <div class="container">
        <header class="section-header">
          <div>
            <span class="eyebrow eyebrow--simple">
              NUESTRA PROPUESTA
            </span>

            <h2 class="display-title">
              ¿Qué hace diferente
              <em>nuestro proceso?</em>
            </h2>
          </div>
        </header>

        <div class="difference__grid">
          <article
            v-for="item in differences"
            :key="item.number"
          >
            <span>
              {{ item.number }}
            </span>

            <div>
              <h3>
                {{ item.title }}
              </h3>

              <p>
                {{ item.description }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         CIERRE
    ====================================================== -->
    <section class="manifesto">
      <div class="manifesto__grid"></div>
      <div class="manifesto__glow"></div>

      <div class="container manifesto__content">
        <span class="eyebrow eyebrow--simple">
          ACADEMIA DE TALENTOS AMO MI VOZ
        </span>

        <h2>
          No buscamos
          voces iguales.
          <em>
            Buscamos voces conscientes,
            preparadas y auténticas.
          </em>
        </h2>

        <p>
          Porque encontrar una voz propia
          también significa aprender a confiar
          en lo que tenemos para comunicar.
        </p>
      </div>
    </section>

    <!-- =====================================================
         CTA FINAL
    ====================================================== -->
    <section class="cta">
      <div class="cta__glow"></div>

      <div class="container cta__content">
        <span class="eyebrow eyebrow--simple">
          TU PROCESO PUEDE COMENZAR AQUÍ
        </span>

        <h2>
          Tu voz merece
          <em>ser descubierta.</em>
        </h2>

        <p>
          Cuéntanos sobre ti y conoce
          cómo podemos acompañar tu proceso artístico.
        </p>

        <div class="cta__actions">
          <RouterLink
            to="/inscripcion"
            class="button button--primary button--large"
          >
            Solicitar inscripción
            <span>→</span>
          </RouterLink>

          <RouterLink
            to="/formacion"
            class="button button--secondary button--large"
          >
            Ver programa formativo
          </RouterLink>
        </div>

        <small>
          Academia de Talentos Amo Mi Voz · La Calera
        </small>
      </div>
    </section>
  </main>
</template>

<script setup>
import student10 from '@/assets/images/alumno-2.png'
import student11 from '@/assets/images/alumno-11.png'
import student12 from '@/assets/images/alumno-12.png'

const principles = [
  {
    number: '01',
    symbol: '◌',
    title: 'Comprender',
    description:
      'Explicamos los contenidos para que el estudiante entienda qué está haciendo y por qué.',
    detail:
      'CONOCIMIENTO · CONCIENCIA'
  },
  {
    number: '02',
    symbol: '♪',
    title: 'Experimentar',
    description:
      'Cada concepto pasa rápidamente del lenguaje teórico a la voz, al cuerpo y a la escucha.',
    detail:
      'CUERPO · VOZ · OÍDO'
  },
  {
    number: '03',
    symbol: '↗',
    title: 'Aplicar',
    description:
      'Las herramientas se utilizan dentro del repertorio y situaciones musicales reales.',
    detail:
      'REPERTORIO · PRÁCTICA'
  },
  {
    number: '04',
    symbol: '◆',
    title: 'Interpretar',
    description:
      'Trabajamos intención, texto, emoción y presencia para transformar sonido en comunicación.',
    detail:
      'EMOCIÓN · IDENTIDAD'
  },
  {
    number: '05',
    symbol: '◎',
    title: 'Compartir',
    description:
      'El aprendizaje se fortalece mediante ensambles, presentaciones y experiencias colectivas.',
    detail:
      'COMUNIDAD · ESCENA'
  },
  {
    number: '06',
    symbol: '▰',
    title: 'Reflexionar',
    description:
      'Revisamos el proceso para reconocer avances, dificultades y nuevos objetivos.',
    detail:
      'PROGRESO · AUTONOMÍA'
  }
]

const experienceSteps = [
  {
    number: '01',
    label: 'AULA',
    title: 'Construimos herramientas',
    description:
      'Técnica vocal, teoría, ritmo, entrenamiento auditivo y comprensión musical.'
  },
  {
    number: '02',
    label: 'REPERTORIO',
    title: 'Aplicamos lo aprendido',
    description:
      'El estudiante comienza a utilizar las herramientas dentro de canciones.'
  },
  {
    number: '03',
    label: 'ENSAMBLE',
    title: 'Aprendemos a escuchar',
    description:
      'Trabajamos voces, coordinación, afinación colectiva y responsabilidad musical.'
  },
  {
    number: '04',
    label: 'ENSAYO',
    title: 'Preparamos la experiencia',
    description:
      'Integramos música, interpretación, movimiento y aspectos técnicos.'
  },
  {
    number: '05',
    label: 'ESCENARIO',
    title: 'Compartimos el proceso',
    description:
      'El aprendizaje se convierte en una experiencia artística frente a público.'
  }
]

const values = [
  {
    number: '01',
    title: 'Confianza',
    description:
      'Acompañamos al estudiante para desarrollar seguridad en su voz y en su capacidad de expresarse.'
  },
  {
    number: '02',
    title: 'Disciplina',
    description:
      'El crecimiento artístico requiere práctica, constancia y compromiso con el proceso.'
  },
  {
    number: '03',
    title: 'Identidad',
    description:
      'No buscamos uniformar voces. Queremos que cada estudiante descubra qué quiere comunicar.'
  },
  {
    number: '04',
    title: 'Comunidad',
    description:
      'La música también se aprende escuchando, colaborando y construyendo junto a otros.'
  },
  {
    number: '05',
    title: 'Respeto',
    description:
      'Cada proceso, voz y ritmo de aprendizaje merece un espacio seguro para desarrollarse.'
  },
  {
    number: '06',
    title: 'Curiosidad',
    description:
      'Promovemos preguntas, exploración y comprensión en lugar de una práctica puramente mecánica.'
  }
]

const differences = [
  {
    number: '01',
    title: 'Formación conectada',
    description:
      'La técnica vocal, la teoría musical y la interpretación no funcionan como áreas aisladas.'
  },
  {
    number: '02',
    title: 'Experiencia escénica',
    description:
      'El estudiante puede aplicar progresivamente lo aprendido mediante ensayos y presentaciones.'
  },
  {
    number: '03',
    title: 'Seguimiento del proceso',
    description:
      'Observamos avances, necesidades y objetivos para orientar mejor el trabajo.'
  },
  {
    number: '04',
    title: 'Tecnología educativa',
    description:
      'El Aula Virtual complementa la formación presencial con materiales, tareas y seguimiento.'
  },
  {
    number: '05',
    title: 'Producciones propias',
    description:
      'Conciertos y experiencias escénico-musicales permiten integrar múltiples habilidades.'
  },
  {
    number: '06',
    title: 'Identidad artística',
    description:
      'Buscamos entregar herramientas para que cada estudiante desarrolle una expresión propia.'
  }
]
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

/* =========================================================
   BASE
========================================================= */

.academy-page {
  --surface: #0d0d0d;
  --surface-soft: #111;
  --border: #292929;
  --muted: #797979;

  min-height: 100vh;
  overflow: hidden;
  color: #f5f5f5;
  background: #080808;
}

.container {
  width: min(1200px, 100%);
  margin: 0 auto;
}

.eyebrow {
  display: flex;
  gap: 9px;
  align-items: center;
  color: variables.$color-primary;
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.19em;
  text-transform: uppercase;
}

.eyebrow > span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: variables.$color-primary;
  box-shadow:
    0 0 15px rgba(212, 175, 55, 0.6);
}

.eyebrow--simple {
  display: block;
}

.display-title {
  margin: 17px 0 0;
  font-size:
    clamp(
      2.9rem,
      5.4vw,
      5.4rem
    );
  line-height: 0.94;
  letter-spacing: -0.06em;
}

.display-title em {
  display: block;
  color: variables.$color-primary;
  font-style: normal;
}

.button {
  display: inline-flex;
  gap: 10px;
  min-height: 49px;
  align-items: center;
  justify-content: center;
  padding:
    13px
    21px;
  border-radius: 10px;
  font-size: 0.71rem;
  font-weight: 900;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
}

.button--primary {
  border:
    1px solid
    variables.$color-primary;
  color: #080808;
  background: variables.$color-primary;
}

.button--primary:hover {
  box-shadow:
    0 18px 45px
    rgba(212, 175, 55, 0.16);
}

.button--secondary {
  border: 1px solid #363636;
  color: #bbb;
  background: transparent;
}

.button--secondary:hover {
  color: #fff;
  border-color: #575757;
}

.button--large {
  min-height: 57px;
  padding-right: 27px;
  padding-left: 27px;
}

/* =========================================================
   HERO
========================================================= */

.hero {
  position: relative;
  padding:
    165px
    24px
    120px;
  overflow: hidden;
  background: #090909;
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
  background-size: 72px 72px;
  mask-image:
    linear-gradient(
      to bottom,
      black,
      transparent 95%
    );
}

.hero__glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(150px);
}

.hero__glow--top {
  top: -170px;
  right: -150px;
  width: 650px;
  height: 650px;
  background:
    rgba(212, 175, 55, 0.08);
}

.hero__glow--bottom {
  bottom: -300px;
  left: -220px;
  width: 550px;
  height: 550px;
  background:
    rgba(212, 175, 55, 0.035);
}

.hero__layout {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 75px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      minmax(0, 1.08fr)
      minmax(400px, 0.92fr);
    align-items: center;
  }
}

.hero h1 {
  max-width: 850px;
  margin: 22px 0 0;
  font-size:
    clamp(
      3.7rem,
      7vw,
      7rem
    );
  line-height: 0.88;
  letter-spacing: -0.07em;
}

.hero h1 em {
  display: block;
  color: variables.$color-primary;
  font-style: normal;
}

.hero__lead {
  max-width: 690px;
  margin: 31px 0 0;
  color: #959595;
  font-size: 0.98rem;
  line-height: 1.85;
}

.hero__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 34px;
}

.hero__facts {
  display: grid;
  gap: 1px;
  overflow: hidden;
  margin-top: 43px;
  border: 1px solid #292929;
  border-radius: 12px;
  background: #292929;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(3, 1fr);
  }
}

.hero__facts article {
  padding: 15px;
  background: #0c0c0c;
}

.hero__facts small,
.hero__facts strong {
  display: block;
}

.hero__facts small {
  margin-bottom: 5px;
  color: #575757;
  font-size: 0.45rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.hero__facts strong {
  color: #ccc;
  font-size: 0.65rem;
}

/* =========================================================
   HERO PHOTO
========================================================= */

.hero__visual {
  position: relative;
  min-height: 620px;
}

.hero-photo {
  position: absolute;
  overflow: hidden;
  inset:
    0
    25px
    25px
    0;
  margin: 0;
  border: 1px solid #303030;
  border-radius: 26px;
  background: #111;
  box-shadow:
    0 50px 110px
    rgba(0, 0, 0, 0.52);
}

.hero-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 0.8s ease;
}

.hero-photo:hover img {
  transform: scale(1.025);
}

.hero-photo__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(0, 0, 0, 0.94),
      rgba(0, 0, 0, 0.03) 63%
    );
}

.hero-photo figcaption {
  position: absolute;
  z-index: 2;
  right: 29px;
  bottom: 30px;
  left: 29px;
}

.hero-photo figcaption small {
  color: variables.$color-primary;
  font-size: 0.5rem;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.hero-photo figcaption strong {
  display: block;
  margin-top: 9px;
  font-size:
    clamp(
      2rem,
      4vw,
      3.5rem
    );
  line-height: 0.98;
}

.hero-photo figcaption strong span {
  display: block;
  color: variables.$color-primary;
}

.hero-badge {
  position: absolute;
  z-index: 4;
  display: flex;
  gap: 11px;
  align-items: center;
  padding:
    12px
    15px;
  border:
    1px solid
    rgba(212, 175, 55, 0.23);
  border-radius: 12px;
  background:
    rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(14px);
}

.hero-badge > span {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  color: #080808;
  background: variables.$color-primary;
  font-size: 0.55rem;
  font-weight: 900;
}

.hero-badge small,
.hero-badge strong {
  display: block;
}

.hero-badge small {
  color: #626262;
  font-size: 0.43rem;
  font-weight: 900;
  letter-spacing: 0.11em;
}

.hero-badge strong {
  margin-top: 2px;
  font-size: 0.64rem;
}

.hero-badge--top {
  top: 35px;
  left: -30px;
}

.hero-badge--bottom {
  right: 0;
  bottom: 0;
}

/* =========================================================
   IDENTITY
========================================================= */

.identity {
  padding:
    130px
    24px;
}

.identity__grid {
  display: grid;
  gap: 70px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      0.9fr
      1.1fr;
  }
}

.identity__copy {
  max-width: 690px;
}

.identity__copy p {
  color: #7b7b7b;
  font-size: 0.86rem;
  line-height: 1.85;
}

.identity__lead {
  margin-top: 0;
  color: #cacaca !important;
  font-size: 1.04rem !important;
}

.identity__statement {
  display: flex;
  gap: 15px;
  align-items: flex-start;
  margin-top: 30px;
}

.identity__statement > span {
  width: 45px;
  height: 1px;
  flex: 0 0 auto;
  margin-top: 8px;
  background: variables.$color-primary;
}

.identity__statement strong {
  max-width: 550px;
  color: variables.$color-primary;
  font-size: 0.71rem;
  line-height: 1.6;
}

/* =========================================================
   STORY
========================================================= */

.story {
  padding:
    130px
    24px;
  background: #0b0b0b;
}

.story__grid {
  display: grid;
  gap: 75px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      0.95fr
      1.05fr;
    align-items: center;
  }
}

.story__visual {
  position: relative;
}

.story__visual figure {
  position: relative;
  overflow: hidden;
  min-height: 700px;
  margin: 0;
  border: 1px solid #292929;
  border-radius: 24px;
}

.story__visual img {
  width: 100%;
  height: 100%;
  min-height: 700px;
  object-fit: cover;
}

.story__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(0, 0, 0, 0.94),
      rgba(0, 0, 0, 0.05) 63%
    );
}

.story__visual figcaption {
  position: absolute;
  z-index: 2;
  right: 30px;
  bottom: 31px;
  left: 30px;
}

.story__visual figcaption small {
  color: variables.$color-primary;
  font-size: 0.49rem;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.story__visual figcaption strong {
  display: block;
  margin-top: 10px;
  font-size:
    clamp(
      2rem,
      4vw,
      3.6rem
    );
  line-height: 0.98;
}

.story__visual figcaption em {
  display: block;
  color: variables.$color-primary;
  font-style: normal;
}

.story__floating {
  position: absolute;
  top: 30px;
  right: -20px;
  width: 155px;
  padding: 17px;
  border:
    1px solid
    rgba(212, 175, 55, 0.25);
  border-radius: 14px;
  background:
    rgba(9, 9, 9, 0.9);
  backdrop-filter: blur(15px);
}

.story__floating > span {
  display: block;
  color: variables.$color-primary;
  font-size: 1.2rem;
  font-weight: 950;
}

.story__floating p {
  margin: 7px 0 0;
  color: #707070;
  font-size: 0.57rem;
  line-height: 1.5;
}

.story__content > p {
  max-width: 580px;
  color: #7b7b7b;
  font-size: 0.8rem;
  line-height: 1.8;
}

.story__milestones {
  display: grid;
  gap: 9px;
  margin-top: 29px;
}

.story__milestones article {
  display: flex;
  gap: 15px;
  padding: 17px;
  border: 1px solid #292929;
  border-radius: 12px;
  background: #0d0d0d;
}

.story__milestones article > span {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  place-items: center;
  border:
    1px solid
    rgba(212, 175, 55, 0.24);
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 0.49rem;
  font-weight: 900;
}

.story__milestones strong {
  display: block;
  font-size: 0.75rem;
}

.story__milestones p {
  margin: 4px 0 0;
  color: #696969;
  font-size: 0.62rem;
  line-height: 1.5;
}

/* =========================================================
   HEADERS
========================================================= */

.section-header {
  display: grid;
  gap: 30px;
  margin-bottom: 52px;

  @include mixins.respond-to(md) {
    grid-template-columns:
      1fr
      0.42fr;
    align-items: end;
  }
}

.section-header > p {
  margin: 0;
  color: #777;
  font-size: 0.78rem;
  line-height: 1.75;
}

.section-header--center {
  grid-template-columns: 1fr;
  justify-items: center;
  text-align: center;
}

.section-header--center > p {
  max-width: 550px;
}

/* =========================================================
   PRINCIPLES
========================================================= */

.principles {
  padding:
    130px
    24px;
}

.principles__grid {
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

.principle-card {
  padding: 27px;
  border: 1px solid #292929;
  border-radius: 17px;
  background: #0d0d0d;
  transition:
    transform 0.24s ease,
    border-color 0.24s ease;
}

.principle-card:hover {
  transform: translateY(-4px);
  border-color:
    rgba(212, 175, 55, 0.29);
}

.principle-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.principle-card__top > span {
  color: variables.$color-primary;
  font-size: 0.52rem;
  font-weight: 900;
}

.principle-card__top > strong {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border:
    1px solid
    rgba(212, 175, 55, 0.23);
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 0.6rem;
}

.principle-card h3 {
  margin: 24px 0 11px;
  font-size: 1.08rem;
}

.principle-card p {
  min-height: 68px;
  margin: 0;
  color: #777;
  font-size: 0.69rem;
  line-height: 1.65;
}

.principle-card > small {
  display: block;
  margin-top: 21px;
  padding-top: 17px;
  border-top: 1px solid #262626;
  color: #505050;
  font-size: 0.47rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

/* =========================================================
   EXPERIENCE
========================================================= */

.experience {
  padding:
    130px
    24px;
  background: #0b0b0b;
}

.experience__grid {
  display: grid;
  gap: 70px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      0.78fr
      1.22fr;
  }
}

.experience__heading {
  @include mixins.respond-to(lg) {
    position: sticky;
    top: 120px;
    align-self: start;
  }
}

.experience__heading > p {
  max-width: 460px;
  margin-top: 24px;
  color: #777;
  font-size: 0.78rem;
  line-height: 1.75;
}

.experience__steps {
  display: grid;
  gap: 10px;
}

.experience__steps article {
  display: flex;
  gap: 18px;
  padding: 21px;
  border: 1px solid #292929;
  border-radius: 14px;
  background: #101010;
}

.experience__number {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  place-items: center;
  border:
    1px solid
    rgba(212, 175, 55, 0.25);
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 0.52rem;
  font-weight: 900;
}

.experience__steps small {
  color: variables.$color-primary;
  font-size: 0.45rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.experience__steps h3 {
  margin: 5px 0;
  font-size: 0.86rem;
}

.experience__steps p {
  margin: 0;
  color: #6d6d6d;
  font-size: 0.63rem;
  line-height: 1.55;
}

/* =========================================================
   VALUES
========================================================= */

.values {
  padding:
    130px
    24px;
}

.values__grid {
  display: grid;
  gap: 11px;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(2, 1fr);
  }

  @include mixins.respond-to(lg) {
    grid-template-columns:
      repeat(3, 1fr);
  }
}

.value-card {
  padding: 26px;
  border: 1px solid #292929;
  border-radius: 16px;
  background: #0d0d0d;
}

.value-card__number {
  color: variables.$color-primary;
  font-size: 0.5rem;
  font-weight: 900;
}

.value-card h3 {
  margin: 21px 0 9px;
  font-size: 0.95rem;
}

.value-card p {
  margin: 0;
  color: #707070;
  font-size: 0.66rem;
  line-height: 1.6;
}

/* =========================================================
   COMMUNITY
========================================================= */

.community {
  padding:
    135px
    24px;
  background: #0b0b0b;
}

.community__grid {
  display: grid;
  gap: 75px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      0.9fr
      1.1fr;
    align-items: center;
  }
}

.community__content > p {
  max-width: 570px;
  color: #7b7b7b;
  font-size: 0.8rem;
  line-height: 1.8;
}

.community__tags {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-top: 25px;
}

.community__tags span {
  padding:
    8px
    11px;
  border: 1px solid #303030;
  border-radius: 999px;
  color: #858585;
  font-size: 0.56rem;
  font-weight: 800;
}

.community__photo {
  position: relative;
  overflow: hidden;
  min-height: 650px;
  margin: 0;
  border: 1px solid #292929;
  border-radius: 24px;
}

.community__photo img {
  width: 100%;
  height: 100%;
  min-height: 650px;
  object-fit: cover;
  transition:
    transform 0.8s ease;
}

.community__photo:hover img {
  transform: scale(1.025);
}

.community__photo-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(0, 0, 0, 0.94),
      rgba(0, 0, 0, 0.04) 65%
    );
}

.community__photo figcaption {
  position: absolute;
  z-index: 2;
  right: 30px;
  bottom: 31px;
  left: 30px;
}

.community__photo figcaption small {
  color: variables.$color-primary;
  font-size: 0.49rem;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.community__photo figcaption strong {
  display: block;
  margin-top: 9px;
  font-size:
    clamp(
      2rem,
      4vw,
      3.5rem
    );
  line-height: 0.98;
}

.community__photo figcaption em {
  display: block;
  color: variables.$color-primary;
  font-style: normal;
}

/* =========================================================
   FORMATION
========================================================= */

.formation {
  position: relative;
  overflow: hidden;
  padding:
    145px
    24px;
}

.formation__grid-background {
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
  background-size:
    70px
    70px;
}

.formation__content {
  position: relative;
  z-index: 2;
}

.formation h2 {
  max-width: 1000px;
  margin: 21px 0 0;
  font-size:
    clamp(
      4rem,
      8vw,
      8rem
    );
  line-height: 0.85;
  letter-spacing: -0.075em;
}

.formation h2 span {
  color: variables.$color-primary;
}

.formation h2 em {
  display: block;
  color: variables.$color-primary;
  font-style: normal;
}

.formation__content > p {
  max-width: 570px;
  margin-top: 29px;
  color: #818181;
  font-size: 0.8rem;
  line-height: 1.7;
}

.formation__areas {
  display: grid;
  gap: 1px;
  overflow: hidden;
  margin-top: 50px;
  border: 1px solid #292929;
  border-radius: 15px;
  background: #292929;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(2, 1fr);
  }

  @include mixins.respond-to(lg) {
    grid-template-columns:
      repeat(4, 1fr);
  }
}

.formation__areas article {
  padding: 20px;
  background: #0d0d0d;
}

.formation__areas article > span {
  color: variables.$color-primary;
  font-size: 0.48rem;
  font-weight: 900;
}

.formation__areas strong,
.formation__areas small {
  display: block;
}

.formation__areas strong {
  margin-top: 13px;
  font-size: 0.78rem;
}

.formation__areas small {
  margin-top: 5px;
  color: #595959;
  font-size: 0.53rem;
  line-height: 1.45;
}

/* =========================================================
   DIRECTOR
========================================================= */

.director {
  padding:
    135px
    24px;
  background: #0b0b0b;
}

.director__grid {
  display: grid;
  gap: 75px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      0.65fr
      1.35fr;
    align-items: center;
  }
}

.director__identity {
  display: grid;
  justify-items: center;
  padding: 45px 30px;
  border: 1px solid #292929;
  border-radius: 22px;
  text-align: center;
  background:
    radial-gradient(
      circle at center,
      rgba(212, 175, 55, 0.065),
      transparent 55%
    ),
    #0d0d0d;
}

.director__monogram {
  position: relative;
  display: grid;
  width: 165px;
  height: 165px;
  place-items: center;
  border:
    1px solid
    rgba(212, 175, 55, 0.3);
  border-radius: 50%;
}

.director__monogram > span {
  color: variables.$color-primary;
  font-size: 3rem;
  font-weight: 950;
}

.director__monogram-ring {
  position: absolute;
  inset: 12px;
  border:
    1px solid
    rgba(212, 175, 55, 0.08);
  border-radius: 50%;
}

.director__identity-copy {
  margin-top: 27px;
}

.director__identity-copy small,
.director__identity-copy strong,
.director__identity-copy span {
  display: block;
}

.director__identity-copy small {
  color: variables.$color-primary;
  font-size: 0.46rem;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.director__identity-copy strong {
  margin-top: 8px;
  font-size: 1.25rem;
}

.director__identity-copy span {
  margin-top: 5px;
  color: #676767;
  font-size: 0.61rem;
}

.director__content > p {
  max-width: 680px;
  color: #797979;
  font-size: 0.78rem;
  line-height: 1.8;
}

.director blockquote {
  display: flex;
  gap: 14px;
  margin:
    29px
    0
    0;
  padding: 20px;
  border: 0;
  border-left:
    2px solid
    variables.$color-primary;
  background:
    rgba(212, 175, 55, 0.025);
}

.director blockquote > span {
  color: variables.$color-primary;
  font-size: 2rem;
  line-height: 0.8;
}

.director blockquote p {
  margin: 0;
  color: #aaa;
  font-size: 0.8rem;
  font-style: italic;
  line-height: 1.65;
}

/* =========================================================
   DIFFERENCE
========================================================= */

.difference {
  padding:
    135px
    24px;
}

.difference__grid {
  display: grid;
  gap: 11px;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(2, 1fr);
  }
}

.difference__grid article {
  display: flex;
  gap: 18px;
  padding: 22px;
  border: 1px solid #292929;
  border-radius: 14px;
  background: #0d0d0d;
}

.difference__grid article > span {
  color: variables.$color-primary;
  font-size: 0.5rem;
  font-weight: 900;
}

.difference__grid h3 {
  margin: 0;
  font-size: 0.84rem;
}

.difference__grid p {
  margin: 6px 0 0;
  color: #6d6d6d;
  font-size: 0.64rem;
  line-height: 1.6;
}

/* =========================================================
   MANIFESTO
========================================================= */

.manifesto {
  position: relative;
  overflow: hidden;
  padding:
    150px
    24px;
  border-top: 1px solid #222;
  border-bottom: 1px solid #222;
}

.manifesto__grid {
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
  background-size:
    70px
    70px;
}

.manifesto__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 850px;
  height: 550px;
  border-radius: 50%;
  background:
    rgba(212, 175, 55, 0.065);
  transform:
    translate(-50%, -50%);
  filter: blur(170px);
}

.manifesto__content {
  position: relative;
  z-index: 2;
}

.manifesto h2 {
  max-width: 1050px;
  margin: 21px 0 0;
  font-size:
    clamp(
      3.6rem,
      7.5vw,
      7.5rem
    );
  line-height: 0.87;
  letter-spacing: -0.075em;
}

.manifesto h2 em {
  display: block;
  color: variables.$color-primary;
  font-style: normal;
}

.manifesto p {
  max-width: 590px;
  margin-top: 28px;
  color: #7d7d7d;
  font-size: 0.8rem;
  line-height: 1.75;
}

/* =========================================================
   CTA
========================================================= */

.cta {
  position: relative;
  overflow: hidden;
  padding:
    145px
    24px;
  background: #090909;
}

.cta__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 500px;
  border-radius: 50%;
  background:
    rgba(212, 175, 55, 0.07);
  transform:
    translate(-50%, -50%);
  filter: blur(160px);
}

.cta__content {
  position: relative;
  z-index: 2;
  display: grid;
  justify-items: center;
  text-align: center;
}

.cta h2 {
  max-width: 950px;
  margin: 19px 0 0;
  font-size:
    clamp(
      3.3rem,
      7vw,
      6.8rem
    );
  line-height: 0.89;
  letter-spacing: -0.07em;
}

.cta h2 em {
  display: block;
  color: variables.$color-primary;
  font-style: normal;
}

.cta p {
  max-width: 560px;
  margin:
    25px
    0
    30px;
  color: #818181;
  font-size: 0.82rem;
  line-height: 1.7;
}

.cta__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.cta__content > small {
  margin-top: 21px;
  color: #4d4d4d;
  font-size: 0.48rem;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1000px) {
  .hero__visual {
    min-height: 610px;
  }

  .story__visual figure,
  .story__visual img {
    min-height: 600px;
  }
}

@media (max-width: 900px) {
  .hero {
    padding:
      145px
      20px
      95px;
  }

  .identity,
  .story,
  .principles,
  .experience,
  .values,
  .community,
  .formation,
  .director,
  .difference,
  .manifesto,
  .cta {
    padding:
      95px
      20px;
  }
}

@media (max-width: 700px) {
  .hero {
    padding:
      130px
      17px
      78px;
  }

  .hero h1 {
    font-size:
      clamp(
        3.1rem,
        14vw,
        5.1rem
      );
  }

  .hero__actions {
    flex-direction: column;
  }

  .hero__actions .button {
    width: 100%;
  }

  .hero__visual {
    min-height: 500px;
  }

  .hero-photo {
    inset: 0;
  }

  .hero-badge--top {
    top: 15px;
    left: 14px;
  }

  .hero-badge--bottom {
    right: 14px;
    bottom: 14px;
  }

  .story__floating {
    top: 15px;
    right: 14px;
  }

  .story__visual figure,
  .story__visual img,
  .community__photo,
  .community__photo img {
    min-height: 500px;
  }

  .formation h2 {
    font-size:
      clamp(
        3.2rem,
        15vw,
        5.4rem
      );
  }
}

@media (max-width: 520px) {
  .hero__facts {
    grid-template-columns: 1fr;
  }

  .hero__visual {
    min-height: 430px;
  }

  .hero-badge {
    padding:
      9px
      10px;
  }

  .hero-badge > span {
    width: 29px;
    height: 29px;
  }

  .story__visual figure,
  .story__visual img,
  .community__photo,
  .community__photo img {
    min-height: 440px;
  }

  .principle-card {
    padding: 22px;
  }

  .director__identity {
    padding:
      35px
      20px;
  }

  .director__monogram {
    width: 135px;
    height: 135px;
  }

  .cta__actions {
    width: 100%;
    flex-direction: column;
  }

  .cta__actions .button {
    width: 100%;
  }
}
</style>
