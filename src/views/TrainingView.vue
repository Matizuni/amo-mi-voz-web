<template>
  <main class="training-page">
    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="hero">
      <div class="hero__grid"></div>
      <div class="hero__glow"></div>

      <div class="container hero__layout">
        <div class="hero__copy">
          <div class="eyebrow">
            <span></span>
            PROGRAMA FORMATIVO · AMO MI VOZ
          </div>

          <h1>
            Formación musical
            <em>con propósito.</em>
          </h1>

          <p class="hero__lead">
            Un proceso integral para desarrollar la voz,
            comprender la música, fortalecer la interpretación
            y adquirir experiencia artística real.
          </p>

          <div class="hero__actions">
            <RouterLink
              to="/inscripcion"
              class="button button--primary"
            >
              Quiero inscribirme
              <span>→</span>
            </RouterLink>

            <a
              href="#programa"
              class="button button--ghost"
            >
              Conocer el programa
            </a>
          </div>

          <div class="hero__facts">
            <div>
              <small>MODALIDAD</small>
              <strong>Presencial</strong>
            </div>

            <div>
              <small>DÍA</small>
              <strong>Sábados</strong>
            </div>

            <div>
              <small>HORARIO</small>
              <strong>16:00–18:00</strong>
            </div>

            <div>
              <small>SEDE</small>
              <strong>La Calera</strong>
            </div>
          </div>
        </div>

        <!-- ALUMNO 3 -->
        <div class="hero__visual">
          <figure class="hero-photo">
            <img
              :src="student3"
              alt="Estudiante de la Academia de Talentos Amo Mi Voz"
            />

            <div class="photo-shade"></div>

            <figcaption>
              <span>FORMACIÓN ARTÍSTICA</span>

              <strong>
                Aprender haciendo.
              </strong>
            </figcaption>
          </figure>

          <div class="floating-card floating-card--top">
            <span>01</span>

            <div>
              <small>PROCESO</small>
              <strong>Progresivo</strong>
            </div>
          </div>

          <div class="floating-card floating-card--bottom">
            <span>♪</span>

            <div>
              <small>EXPERIENCIA</small>
              <strong>Aula + escenario</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
         MANIFIESTO
    ====================================================== -->
    <section
      id="programa"
      class="manifesto"
    >
      <div class="container manifesto__grid">
        <div>
          <span class="eyebrow eyebrow--simple">
            NUESTRA PROPUESTA
          </span>

          <h2 class="display-title">
            Mucho más que
            <em>aprender canciones.</em>
          </h2>
        </div>

        <div class="manifesto__text">
          <p class="manifesto__lead">
            Formarse musicalmente significa aprender
            a escuchar, comprender, experimentar,
            interpretar y comunicar.
          </p>

          <p>
            La técnica vocal, la teoría musical,
            el entrenamiento auditivo, el repertorio
            y la interpretación se integran dentro
            de un mismo proceso.
          </p>

          <p>
            Nuestro objetivo es que el estudiante
            no dependa siempre de alguien que le diga
            qué hacer, sino que progresivamente pueda
            comprender y tomar decisiones musicales.
          </p>

          <div class="manifesto__signature">
            <span></span>

            <strong>
              Comprender la música para expresarla
              con libertad.
            </strong>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
         HISTORIA VISUAL
    ====================================================== -->
    <section class="story">
      <div class="container">
        <header class="section-header">
          <div>
            <span class="eyebrow eyebrow--simple">
              EL PROCESO
            </span>

            <h2 class="display-title">
              Primero descubrimos.
              <em>Después construimos.</em>
            </h2>
          </div>

          <p>
            Cada estudiante llega con una historia,
            una voz y objetivos diferentes.
          </p>
        </header>

        <div class="story__grid">
          <!-- ALUMNO 4 -->
          <figure class="story-card story-card--portrait">
            <img
              :src="student4"
              alt="Estudiante durante su proceso vocal"
            />

            <div class="story-card__overlay"></div>

            <figcaption>
              <small>01 · DESCUBRIR</small>

              <strong>
                Conocer
                <em>tu propia voz.</em>
              </strong>

              <p>
                Reconocer fortalezas, necesidades,
                hábitos y posibilidades.
              </p>
            </figcaption>
          </figure>

          <!-- ALUMNO 5 -->
          <figure class="story-card story-card--landscape">
            <img
              :src="student5"
              alt="Actividad formativa en Amo Mi Voz"
            />

            <div class="story-card__overlay"></div>

            <figcaption>
              <small>02 · DESARROLLAR</small>

              <strong>
                Construir herramientas.
              </strong>

              <p>
                Técnica, oído, ritmo,
                musicalidad e interpretación.
              </p>
            </figcaption>
          </figure>

          <article class="story-card story-card--message">
            <span>03</span>

            <small>INTEGRAR</small>

            <h3>
              Lo aprendido
              comienza a convertirse
              <em>en música.</em>
            </h3>

            <p>
              El objetivo no es acumular ejercicios.
              Es poder utilizarlos dentro del repertorio.
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         PILARES
    ====================================================== -->
    <section class="pillars">
      <div class="container">
        <header class="section-header">
          <div>
            <span class="eyebrow eyebrow--simple">
              PILARES FORMATIVOS
            </span>

            <h2 class="display-title">
              Una formación
              <em>integral.</em>
            </h2>
          </div>

          <p>
            Diferentes áreas de aprendizaje
            trabajando para un mismo desarrollo artístico.
          </p>
        </header>

        <div class="pillars__grid">
          <article
            v-for="pillar in pillars"
            :key="pillar.number"
            class="pillar"
          >
            <header>
              <span>
                {{ pillar.number }}
              </span>

              <strong>
                {{ pillar.symbol }}
              </strong>
            </header>

            <h3>
              {{ pillar.title }}
            </h3>

            <p>
              {{ pillar.description }}
            </p>

            <ul>
              <li
                v-for="item in pillar.items"
                :key="item"
              >
                <span>+</span>
                {{ item }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         METODOLOGÍA
         ALUMNO 6
    ====================================================== -->
    <section class="method">
      <div class="container method__grid">
        <div class="method__visual">
          <figure>
            <img
              :src="student6"
              alt="Estudiante participando del proceso de aprendizaje"
            />

            <div class="photo-shade photo-shade--strong"></div>

            <figcaption>
              <small>
                METODOLOGÍA AMO MI VOZ
              </small>

              <strong>
                Comprender.
                <em>Experimentar.</em>
                Aplicar.
              </strong>
            </figcaption>
          </figure>

          <div class="method__badge">
            <strong>05</strong>
            <span>ETAPAS</span>
          </div>
        </div>

        <div class="method__content">
          <span class="eyebrow eyebrow--simple">
            CÓMO APRENDEMOS
          </span>

          <h2 class="display-title">
            Comprender para
            <em>poder hacer.</em>
          </h2>

          <p class="method__lead">
            Cada concepto se presenta de forma comprensible
            y rápidamente comienza a relacionarse
            con experiencias musicales concretas.
          </p>

          <div class="method__steps">
            <article
              v-for="step in methodSteps"
              :key="step.number"
            >
              <span class="method__number">
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

          <blockquote>
            <span>“</span>

            <p>
              La teoría adquiere sentido cuando
              puedes escucharla, sentirla y utilizarla.
            </p>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- =====================================================
         ÁREAS DE APRENDIZAJE
    ====================================================== -->
    <section class="learning">
      <div class="container">
        <header class="section-header section-header--center">
          <div>
            <span class="eyebrow eyebrow--simple">
              ¿QUÉ APRENDEMOS?
            </span>

            <h2 class="display-title">
              Herramientas que
              <em>se conectan entre sí.</em>
            </h2>
          </div>

          <p>
            Técnica, oído, teoría, interpretación
            y escenario forman parte de una misma experiencia.
          </p>
        </header>

        <div class="learning__grid">
          <article
            v-for="area in learningAreas"
            :key="area.title"
            class="learning-card"
          >
            <span class="learning-card__icon">
              {{ area.icon }}
            </span>

            <div>
              <h3>
                {{ area.title }}
              </h3>

              <p>
                {{ area.description }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         RECORRIDO
    ====================================================== -->
    <section class="journey">
      <div class="container">
        <header class="section-header">
          <div>
            <span class="eyebrow eyebrow--simple">
              RECORRIDO DEL ESTUDIANTE
            </span>

            <h2 class="display-title">
              Un proceso
              <em>progresivo.</em>
            </h2>
          </div>

          <p>
            El punto de partida cambia,
            pero la formación mantiene una dirección clara.
          </p>
        </header>

        <div class="journey__grid">
          <article
            v-for="stage in stages"
            :key="stage.number"
          >
            <span class="journey__number">
              {{ stage.number }}
            </span>

            <small>
              {{ stage.label }}
            </small>

            <h3>
              {{ stage.title }}
            </h3>

            <p>
              {{ stage.description }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         CLASE
    ====================================================== -->
    <section class="classroom">
      <div class="container classroom__grid">
        <div class="classroom__intro">
          <span class="eyebrow eyebrow--simple">
            UNA CLASE AMO MI VOZ
          </span>

          <h2 class="display-title">
            Cada sesión tiene
            <em>un propósito.</em>
          </h2>

          <p>
            La práctica se organiza para conectar
            preparación vocal, conceptos musicales,
            entrenamiento y repertorio.
          </p>

          <div class="classroom__facts">
            <div>
              <small>DÍA</small>
              <strong>Sábados</strong>
            </div>

            <div>
              <small>HORARIO</small>
              <strong>16:00–18:00</strong>
            </div>

            <div>
              <small>MODALIDAD</small>
              <strong>Presencial</strong>
            </div>

            <div>
              <small>SEDE</small>
              <strong>Pueblito Artesanal</strong>
            </div>
          </div>
        </div>

        <div class="classroom__timeline">
          <article
            v-for="block in classBlocks"
            :key="block.number"
          >
            <span>
              {{ block.number }}
            </span>

            <div>
              <small>
                {{ block.label }}
              </small>

              <h3>
                {{ block.title }}
              </h3>

              <p>
                {{ block.description }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         ESCENARIO
         ALUMNO 7
    ====================================================== -->
    <section class="stage">
      <div class="stage__glow"></div>

      <div class="container stage__grid">
        <div class="stage__copy">
          <span class="eyebrow eyebrow--simple">
            FORMACIÓN ESCÉNICA
          </span>

          <h2 class="display-title">
            El escenario también
            <em>es parte de la clase.</em>
          </h2>

          <p>
            Aprender música también implica
            aprender a comunicarla.
          </p>

          <p>
            Por eso trabajamos repertorio,
            interpretación, uso de micrófono,
            escucha colectiva, ensayos
            y experiencias reales frente a público.
          </p>

          <div class="tags">
            <span>Interpretación</span>
            <span>Micrófono</span>
            <span>Ensambles</span>
            <span>Conciertos</span>
            <span>Musicales</span>
          </div>

          <div class="stage__statement">
            <span>→</span>

            <p>
              La meta no es solamente cantar correctamente.
              Es poder sostener una interpretación
              y compartirla con otras personas.
            </p>
          </div>
        </div>

        <div class="stage__visual">
          <figure>
            <img
              :src="student7"
              alt="Estudiante durante una experiencia escénica"
            />

            <div class="photo-shade photo-shade--strong"></div>

            <figcaption>
              <small>
                DEL AULA AL ESCENARIO
              </small>

              <strong>
                Prepararse.
                <em>Ensayar.</em>
                Presentarse.
              </strong>
            </figcaption>
          </figure>

          <span class="stage__badge">
            ♪ EXPERIENCIA REAL
          </span>
        </div>
      </div>
    </section>

    <!-- =====================================================
         OBJETIVOS
    ====================================================== -->
    <section class="results">
      <div class="container">
        <header class="section-header section-header--center">
          <div>
            <span class="eyebrow eyebrow--simple">
              OBJETIVOS FORMATIVOS
            </span>

            <h2 class="display-title">
              ¿Qué buscamos
              <em>desarrollar?</em>
            </h2>
          </div>

          <p>
            El crecimiento artístico
            es técnico, musical y personal.
          </p>
        </header>

        <div class="results__grid">
          <article
            v-for="result in results"
            :key="result.title"
          >
            <span>
              {{ result.icon }}
            </span>

            <h3>
              {{ result.title }}
            </h3>

            <p>
              {{ result.description }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         COMUNIDAD
         ALUMNO 8
    ====================================================== -->
    <section class="community">
      <div class="container community__grid">
        <figure class="community__photo">
          <img
            :src="student8"
            alt="Estudiante formando parte de la comunidad Amo Mi Voz"
          />

          <div class="photo-shade"></div>

          <figcaption>
            <span>
              COMUNIDAD ARTÍSTICA
            </span>
          </figcaption>
        </figure>

        <div class="community__content">
          <span class="eyebrow eyebrow--simple">
            APRENDER CON OTROS
          </span>

          <h2 class="display-title">
            Crecer también
            <em>es compartir.</em>
          </h2>

          <p>
            La música es una experiencia individual,
            pero también profundamente colectiva.
          </p>

          <p>
            Cantar junto a otros desarrolla escucha,
            responsabilidad, autonomía, respeto
            y conciencia del rol que cada persona
            cumple dentro de un conjunto.
          </p>

          <div class="community__values">
            <span>Escucha</span>
            <span>Respeto</span>
            <span>Colaboración</span>
            <span>Confianza</span>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
         PARA QUIÉN
    ====================================================== -->
    <section class="audience">
      <div class="container audience__grid">
        <div>
          <span class="eyebrow eyebrow--simple">
            ¿PARA QUIÉN ES?
          </span>

          <h2 class="display-title">
            No necesitas llegar
            <em>sabiendo.</em>
          </h2>

          <p class="audience__intro">
            Trabajamos desde el punto real
            en el que se encuentra cada estudiante.
          </p>
        </div>

        <div class="audience__list">
          <article
            v-for="person in audiences"
            :key="person.number"
          >
            <span>
              {{ person.number }}
            </span>

            <div>
              <strong>
                {{ person.title }}
              </strong>

              <p>
                {{ person.description }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         GRAN CIERRE VISUAL
         ALUMNO 9
    ====================================================== -->
    <section class="closing-photo">
      <img
        :src="student9"
        alt="Experiencia artística de la Academia Amo Mi Voz"
      />

      <div class="closing-photo__overlay"></div>

      <div class="container closing-photo__content">
        <span class="eyebrow">
          <span></span>
          AMO MI VOZ
        </span>

        <h2>
          Aprender música
          <em>viviendo música.</em>
        </h2>

        <p>
          Técnica, conocimiento, interpretación,
          comunidad y escenario formando parte
          de un mismo camino.
        </p>
      </div>
    </section>

    <!-- =====================================================
         FAQ
    ====================================================== -->
    <section class="faq">
      <div class="container faq__grid">
        <div>
          <span class="eyebrow eyebrow--simple">
            PREGUNTAS FRECUENTES
          </span>

          <h2 class="display-title">
            Antes de
            <em>comenzar.</em>
          </h2>
        </div>

        <div class="faq__list">
          <article
            v-for="(item, index) in faqs"
            :key="item.question"
          >
            <button
              type="button"
              :aria-expanded="openFaq === index"
              @click="toggleFaq(index)"
            >
              <span>
                {{ item.question }}
              </span>

              <strong>
                {{ openFaq === index ? '−' : '+' }}
              </strong>
            </button>

            <Transition name="faq">
              <div
                v-if="openFaq === index"
                class="faq__answer"
              >
                <p>
                  {{ item.answer }}
                </p>
              </div>
            </Transition>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         CTA FINAL
    ====================================================== -->
    <section class="cta">
      <div class="cta__grid"></div>
      <div class="cta__glow"></div>

      <div class="container cta__content">
        <span class="eyebrow eyebrow--simple">
          TU PROCESO PUEDE COMENZAR AQUÍ
        </span>

        <h2>
          Descubre lo que
          <em>puede hacer tu voz.</em>
        </h2>

        <p>
          Cuéntanos sobre ti y da el primer paso
          hacia tu proceso artístico y musical.
        </p>

        <RouterLink
          to="/inscripcion"
          class="button button--primary button--large"
        >
          Solicitar inscripción
          <span>→</span>
        </RouterLink>

        <small>
          Academia de Talentos Amo Mi Voz · La Calera
        </small>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'

import student3 from '@/assets/images/alumno-3.png'
import student4 from '@/assets/images/alumno-4.png'
import student5 from '@/assets/images/alumno-5.png'
import student6 from '@/assets/images/alumno-6.png'
import student7 from '@/assets/images/alumno-7.png'
import student8 from '@/assets/images/alumno-8.png'
import student9 from '@/assets/images/alumno-9.png'

const openFaq = ref(0)

const pillars = [
  {
    number: '01',
    symbol: '◌',
    title: 'Técnica vocal',
    description:
      'Desarrollar la voz desde una práctica consciente, progresiva y saludable.',
    items: [
      'Respiración y apoyo',
      'Coordinación vocal',
      'Resonancia',
      'Afinación',
      'Extensión y comodidad vocal'
    ]
  },
  {
    number: '02',
    symbol: '♪',
    title: 'Teoría musical',
    description:
      'Comprender los elementos que organizan la música para utilizarlos al cantar.',
    items: [
      'Pulso y ritmo',
      'Figuras musicales',
      'Intervalos',
      'Escalas',
      'Lectura musical'
    ]
  },
  {
    number: '03',
    symbol: '≈',
    title: 'Entrenamiento auditivo',
    description:
      'Desarrollar la capacidad de escuchar, reconocer y reproducir elementos musicales.',
    items: [
      'Afinación auditiva',
      'Intervalos',
      'Melodía',
      'Ritmo',
      'Escucha coral'
    ]
  },
  {
    number: '04',
    symbol: '◆',
    title: 'Interpretación',
    description:
      'Transformar una ejecución correcta en una experiencia artística capaz de comunicar.',
    items: [
      'Texto y emoción',
      'Fraseo',
      'Dinámicas',
      'Presencia',
      'Identidad artística'
    ]
  },
  {
    number: '05',
    symbol: '◎',
    title: 'Trabajo coral',
    description:
      'Aprender a escuchar al conjunto, sostener una parte y construir sonido colectivo.',
    items: [
      'Afinación grupal',
      'Empaste',
      'Voces SATB',
      'Balance',
      'Ensamble'
    ]
  },
  {
    number: '06',
    symbol: '▰',
    title: 'Escenario',
    description:
      'Llevar lo aprendido a situaciones reales de ensayo, concierto y presentación.',
    items: [
      'Uso de micrófono',
      'Ensayos generales',
      'Repertorio',
      'Conciertos',
      'Musicales'
    ]
  }
]

const methodSteps = [
  {
    number: '01',
    label: 'COMPRENDER',
    title: 'Descubrimos el concepto',
    description:
      'Entendemos qué estamos trabajando y por qué es importante.'
  },
  {
    number: '02',
    label: 'ESCUCHAR',
    title: 'Lo reconocemos en la música',
    description:
      'Relacionamos los contenidos con referencias auditivas reales.'
  },
  {
    number: '03',
    label: 'EXPERIMENTAR',
    title: 'Lo llevamos al cuerpo y a la voz',
    description:
      'Los ejercicios convierten el conocimiento en experiencia.'
  },
  {
    number: '04',
    label: 'APLICAR',
    title: 'Lo usamos en repertorio',
    description:
      'Las herramientas comienzan a aparecer dentro de canciones.'
  },
  {
    number: '05',
    label: 'PRESENTAR',
    title: 'Lo llevamos al escenario',
    description:
      'Integramos aprendizaje, interpretación y experiencia escénica.'
  }
]

const learningAreas = [
  {
    icon: '♪',
    title: 'Afinación',
    description:
      'Escuchar y controlar con mayor precisión las alturas musicales.'
  },
  {
    icon: '◒',
    title: 'Respiración',
    description:
      'Coordinar aire, apoyo y emisión con mayor estabilidad.'
  },
  {
    icon: '≈',
    title: 'Resonancia',
    description:
      'Explorar la proyección, riqueza y color del sonido.'
  },
  {
    icon: '♩',
    title: 'Ritmo',
    description:
      'Comprender pulso, subdivisión y figuras musicales.'
  },
  {
    icon: '↗',
    title: 'Intervalos',
    description:
      'Reconocer relaciones entre notas y desarrollar oído.'
  },
  {
    icon: 'S',
    title: 'Lectura musical',
    description:
      'Interpretar progresivamente elementos de una partitura.'
  },
  {
    icon: '◉',
    title: 'Interpretación',
    description:
      'Trabajar intención, fraseo, emoción y comunicación.'
  },
  {
    icon: '▰',
    title: 'Micrófono',
    description:
      'Aprender distancia, control dinámico y técnica escénica.'
  },
  {
    icon: 'SATB',
    title: 'Coro',
    description:
      'Desarrollar escucha colectiva, independencia y ensamble.'
  }
]

const stages = [
  {
    number: '01',
    label: 'DESCUBRIR',
    title: 'Conocer tu voz',
    description:
      'Identificamos fortalezas, hábitos y necesidades.'
  },
  {
    number: '02',
    label: 'CONSTRUIR',
    title: 'Crear herramientas',
    description:
      'Desarrollamos técnica, oído y comprensión musical.'
  },
  {
    number: '03',
    label: 'APLICAR',
    title: 'Trabajar repertorio',
    description:
      'Utilizamos las herramientas dentro de canciones.'
  },
  {
    number: '04',
    label: 'INTEGRAR',
    title: 'Cantar con otros',
    description:
      'Aprendemos a sostener nuestro rol dentro del conjunto.'
  },
  {
    number: '05',
    label: 'COMUNICAR',
    title: 'Subir al escenario',
    description:
      'Transformamos el aprendizaje en experiencia artística.'
  }
]

const classBlocks = [
  {
    number: '01',
    label: 'ACTIVACIÓN',
    title: 'Preparación corporal y vocal',
    description:
      'Respiración, coordinación, activación y calentamiento.'
  },
  {
    number: '02',
    label: 'APRENDIZAJE',
    title: 'Concepto técnico o musical',
    description:
      'Estudiamos un contenido específico de forma comprensible.'
  },
  {
    number: '03',
    label: 'ENTRENAMIENTO',
    title: 'Ejercicios y práctica',
    description:
      'Convertimos el concepto en una habilidad concreta.'
  },
  {
    number: '04',
    label: 'REPERTORIO',
    title: 'Aplicación musical',
    description:
      'Llevamos las herramientas directamente a canciones.'
  },
  {
    number: '05',
    label: 'ENSAMBLE',
    title: 'Trabajo colectivo',
    description:
      'Escuchamos, coordinamos y preparamos repertorio grupal.'
  }
]

const results = [
  {
    icon: '01',
    title: 'Conciencia vocal',
    description:
      'Comprender mejor cómo funciona y responde la propia voz.'
  },
  {
    icon: '02',
    title: 'Afinación',
    description:
      'Desarrollar oído, precisión y control melódico.'
  },
  {
    icon: '03',
    title: 'Comprensión musical',
    description:
      'Entender ritmo, melodía, intervalos y lectura.'
  },
  {
    icon: '04',
    title: 'Autonomía',
    description:
      'Aprender herramientas para estudiar por cuenta propia.'
  },
  {
    icon: '05',
    title: 'Confianza escénica',
    description:
      'Interpretar y comunicar con mayor seguridad.'
  },
  {
    icon: '06',
    title: 'Trabajo colectivo',
    description:
      'Desarrollar escucha, responsabilidad y colaboración.'
  }
]

const audiences = [
  {
    number: '01',
    title: 'Personas que están comenzando',
    description:
      'Puedes iniciar sin conocimientos musicales previos.'
  },
  {
    number: '02',
    title: 'Cantantes que quieren avanzar',
    description:
      'Para quienes buscan ordenar y profundizar su formación.'
  },
  {
    number: '03',
    title: 'Personas que quieren ganar seguridad',
    description:
      'Desarrollamos interpretación y confianza escénica progresiva.'
  },
  {
    number: '04',
    title: 'Personas que aman la música',
    description:
      'Transformamos interés y curiosidad en herramientas concretas.'
  }
]

const faqs = [
  {
    question:
      '¿Necesito saber cantar para entrar?',
    answer:
      'No. Trabajamos desde el nivel real de cada estudiante y puedes comenzar sin experiencia previa.'
  },
  {
    question:
      '¿Necesito saber leer partituras?',
    answer:
      'No. La lectura y teoría musical se incorporan progresivamente dentro de las clases.'
  },
  {
    question:
      '¿Las clases son solamente de canto?',
    answer:
      'No. Integramos técnica vocal, teoría musical, entrenamiento auditivo, interpretación, repertorio, trabajo coral y experiencia escénica.'
  },
  {
    question:
      '¿Se realizan presentaciones?',
    answer:
      'Sí. El escenario forma parte del proceso mediante ensayos, conciertos y proyectos artísticos.'
  },
  {
    question:
      '¿Qué pasa después de inscribirme?',
    answer:
      'Recibimos tu solicitud, la revisamos y posteriormente nos ponemos en contacto contigo. Una vez completada la matrícula podrás acceder también al Aula Virtual.'
  }
]

function toggleFaq(index) {
  openFaq.value =
    openFaq.value === index
      ? null
      : index
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

/* =========================================================
   GLOBAL
========================================================= */

.training-page {
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
  font-size: 0.63rem;
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
    0 0 15px rgba(212, 175, 55, 0.55);
}

.eyebrow--simple {
  display: block;
}

.display-title {
  margin: 17px 0 0;
  font-size:
    clamp(2.8rem, 5vw, 5.1rem);
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
    box-shadow 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
}

.button--primary {
  border: 1px solid variables.$color-primary;
  color: #090909;
  background: variables.$color-primary;
}

.button--primary:hover {
  box-shadow:
    0 16px 45px rgba(212, 175, 55, 0.16);
}

.button--ghost {
  border: 1px solid #353535;
  color: #b6b6b6;
  background: transparent;
}

.button--ghost:hover {
  border-color: #555;
}

.button--large {
  min-height: 57px;
  padding: 14px 27px;
}

.photo-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(0, 0, 0, 0.9),
      transparent 60%
    );
}

.photo-shade--strong {
  background:
    linear-gradient(
      to top,
      rgba(0, 0, 0, 0.94),
      rgba(0, 0, 0, 0.05) 65%
    );
}

/* =========================================================
   HERO
========================================================= */

.hero {
  position: relative;
  padding: 165px 24px 120px;
  background: #090909;
}

.hero__grid {
  position: absolute;
  inset: 0;
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
  top: 40px;
  right: -250px;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background:
    rgba(212, 175, 55, 0.07);
  filter: blur(160px);
}

.hero__layout {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 75px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      minmax(0, 1.1fr)
      minmax(400px, 0.9fr);

    align-items: center;
  }
}

.hero h1 {
  margin: 21px 0 0;
  font-size:
    clamp(3.7rem, 7vw, 7.1rem);
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
  grid-template-columns:
    repeat(4, 1fr);
  gap: 1px;
  overflow: hidden;
  margin-top: 43px;
  border: 1px solid var(--border);
  border-radius: 11px;
  background: var(--border);
}

.hero__facts > div {
  padding: 14px;
  background: #0c0c0c;
}

.hero__facts small,
.hero__facts strong {
  display: block;
}

.hero__facts small {
  margin-bottom: 5px;
  color: #585858;
  font-size: 0.47rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.hero__facts strong {
  font-size: 0.66rem;
}

/* =========================================================
   HERO VISUAL
========================================================= */

.hero__visual {
  position: relative;
  min-height: 600px;
}

.hero-photo {
  position: absolute;
  overflow: hidden;
  inset: 0 22px 22px 0;
  margin: 0;
  border: 1px solid #303030;
  border-radius: 25px;
  background: #111;
  box-shadow:
    0 50px 110px rgba(0, 0, 0, 0.5);
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

.hero-photo figcaption {
  position: absolute;
  z-index: 2;
  right: 29px;
  bottom: 29px;
  left: 29px;
}

.hero-photo figcaption span {
  display: block;
  color: variables.$color-primary;
  font-size: 0.51rem;
  font-weight: 900;
  letter-spacing: 0.16em;
}

.hero-photo figcaption strong {
  display: block;
  margin-top: 7px;
  font-size: 1.25rem;
}

.floating-card {
  position: absolute;
  z-index: 5;
  display: flex;
  gap: 11px;
  align-items: center;
  padding: 12px 15px;
  border:
    1px solid
    rgba(212, 175, 55, 0.23);
  border-radius: 11px;
  background:
    rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(14px);
}

.floating-card > span {
  display: grid;
  width: 33px;
  height: 33px;
  place-items: center;
  border-radius: 50%;
  color: #090909;
  background: variables.$color-primary;
  font-size: 0.55rem;
  font-weight: 900;
}

.floating-card small,
.floating-card strong {
  display: block;
}

.floating-card small {
  color: #636363;
  font-size: 0.44rem;
  font-weight: 900;
}

.floating-card strong {
  margin-top: 2px;
  font-size: 0.64rem;
}

.floating-card--top {
  top: 35px;
  left: -30px;
}

.floating-card--bottom {
  right: 0;
  bottom: 0;
}

/* =========================================================
   MANIFESTO
========================================================= */

.manifesto {
  padding: 125px 24px;
}

.manifesto__grid {
  display: grid;
  gap: 70px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      0.9fr 1.1fr;
  }
}

.manifesto__text {
  max-width: 680px;
}

.manifesto__text p {
  color: #7c7c7c;
  font-size: 0.86rem;
  line-height: 1.85;
}

.manifesto__lead {
  margin-top: 0;
  color: #cacaca !important;
  font-size: 1.04rem !important;
}

.manifesto__signature {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-top: 29px;
}

.manifesto__signature > span {
  width: 48px;
  height: 1px;
  background: variables.$color-primary;
}

.manifesto__signature strong {
  color: variables.$color-primary;
  font-size: 0.7rem;
}

/* =========================================================
   SECTION HEADER
========================================================= */

.section-header {
  display: grid;
  gap: 30px;
  margin-bottom: 50px;

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

.section-header--center {
  grid-template-columns: 1fr;
  justify-items: center;
  text-align: center;
}

.section-header--center > p {
  max-width: 560px;
}

/* =========================================================
   STORY
========================================================= */

.story {
  padding: 25px 24px 125px;
}

.story__grid {
  display: grid;
  gap: 13px;

  @include mixins.respond-to(md) {
    grid-template-columns:
      1fr 1fr;

    grid-template-rows:
      320px 320px;
  }
}

.story-card {
  position: relative;
  overflow: hidden;
  min-height: 350px;
  margin: 0;
  border: 1px solid var(--border);
  border-radius: 18px;
}

.story-card--portrait {
  @include mixins.respond-to(md) {
    grid-row: 1 / 3;
  }
}

.story-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 0.75s ease;
}

.story-card:hover img {
  transform: scale(1.025);
}

.story-card__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(0, 0, 0, 0.92),
      rgba(0, 0, 0, 0.05) 60%
    );
}

.story-card figcaption {
  position: absolute;
  z-index: 2;
  right: 25px;
  bottom: 26px;
  left: 25px;
}

.story-card figcaption small {
  color: variables.$color-primary;
  font-size: 0.5rem;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.story-card figcaption strong {
  display: block;
  margin-top: 8px;
  font-size:
    clamp(1.4rem, 3vw, 2.5rem);
  line-height: 1;
}

.story-card figcaption strong em {
  display: block;
  color: variables.$color-primary;
  font-style: normal;
}

.story-card figcaption p {
  max-width: 430px;
  margin: 10px 0 0;
  color: #aaa;
  font-size: 0.68rem;
  line-height: 1.55;
}

.story-card--message {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 28px;
  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(212, 175, 55, 0.09),
      transparent 40%
    ),
    #101010;
}

.story-card--message > span {
  display: grid;
  width: 42px;
  height: 42px;
  margin-bottom: auto;
  place-items: center;
  border-radius: 50%;
  color: #090909;
  background: variables.$color-primary;
  font-size: 0.58rem;
  font-weight: 900;
}

.story-card--message small {
  color: variables.$color-primary;
  font-size: 0.49rem;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.story-card--message h3 {
  max-width: 500px;
  margin: 9px 0 12px;
  font-size: clamp(1.5rem, 3vw, 2.4rem);
  line-height: 1;
}

.story-card--message h3 em {
  color: variables.$color-primary;
  font-style: normal;
}

.story-card--message p {
  max-width: 490px;
  margin: 0;
  color: #777;
  font-size: 0.68rem;
  line-height: 1.6;
}

/* =========================================================
   PILLARS
========================================================= */

.pillars,
.learning,
.classroom,
.results,
.faq {
  padding: 125px 24px;
  background: #0b0b0b;
}

.pillars__grid {
  display: grid;
  gap: 13px;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(2, 1fr);
  }

  @include mixins.respond-to(lg) {
    grid-template-columns:
      repeat(3, 1fr);
  }
}

.pillar {
  padding: 27px;
  border: 1px solid var(--border);
  border-radius: 17px;
  background: #101010;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease;
}

.pillar:hover {
  transform: translateY(-4px);
  border-color:
    rgba(212, 175, 55, 0.3);
}

.pillar header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pillar header > span {
  color: variables.$color-primary;
  font-size: 0.54rem;
  font-weight: 900;
}

.pillar header > strong {
  display: grid;
  width: 37px;
  height: 37px;
  place-items: center;
  border:
    1px solid
    rgba(212, 175, 55, 0.22);
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 0.62rem;
}

.pillar h3 {
  margin: 24px 0 11px;
  font-size: 1.12rem;
}

.pillar > p {
  min-height: 67px;
  margin: 0;
  color: #777;
  font-size: 0.71rem;
  line-height: 1.65;
}

.pillar ul {
  display: grid;
  gap: 8px;
  margin: 21px 0 0;
  padding: 18px 0 0;
  border-top: 1px solid #262626;
  list-style: none;
}

.pillar li {
  color: #898989;
  font-size: 0.64rem;
}

.pillar li span {
  margin-right: 6px;
  color: variables.$color-primary;
}

/* =========================================================
   METHOD
========================================================= */

.method {
  padding: 130px 24px;
}

.method__grid {
  display: grid;
  gap: 75px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      0.9fr 1.1fr;

    align-items: start;
  }
}

.method__visual {
  position: relative;

  @include mixins.respond-to(lg) {
    position: sticky;
    top: 120px;
  }
}

.method__visual figure {
  position: relative;
  overflow: hidden;
  min-height: 720px;
  margin: 0;
  border: 1px solid var(--border);
  border-radius: 23px;
}

.method__visual img {
  width: 100%;
  height: 100%;
  min-height: 720px;
  object-fit: cover;
}

.method__visual figcaption {
  position: absolute;
  z-index: 2;
  right: 30px;
  bottom: 31px;
  left: 30px;
}

.method__visual figcaption small {
  color: variables.$color-primary;
  font-size: 0.49rem;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.method__visual figcaption strong {
  display: block;
  margin-top: 10px;
  font-size: clamp(2rem, 4vw, 3.6rem);
  line-height: 0.97;
}

.method__visual figcaption strong em {
  display: block;
  color: variables.$color-primary;
  font-style: normal;
}

.method__badge {
  position: absolute;
  top: 28px;
  right: -22px;
  display: grid;
  width: 92px;
  height: 92px;
  place-content: center;
  border-radius: 50%;
  color: #090909;
  text-align: center;
  background: variables.$color-primary;
}

.method__badge strong {
  display: block;
  font-size: 1.5rem;
}

.method__badge span {
  display: block;
  font-size: 0.4rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.method__lead {
  max-width: 580px;
  margin: 24px 0 30px;
  color: #868686;
  font-size: 0.82rem;
  line-height: 1.8;
}

.method__steps {
  display: grid;
  gap: 10px;
}

.method__steps article {
  display: flex;
  gap: 18px;
  padding: 21px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.method__steps article:hover {
  transform: translateX(4px);
  border-color:
    rgba(212, 175, 55, 0.24);
}

.method__number {
  display: grid;
  width: 39px;
  height: 39px;
  flex: 0 0 auto;
  place-items: center;
  border:
    1px solid
    rgba(212, 175, 55, 0.25);
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 0.53rem;
  font-weight: 900;
}

.method__steps small {
  color: variables.$color-primary;
  font-size: 0.46rem;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.method__steps h3 {
  margin: 6px 0;
  font-size: 0.9rem;
}

.method__steps p {
  margin: 0;
  color: #707070;
  font-size: 0.65rem;
  line-height: 1.6;
}

.method blockquote {
  display: flex;
  gap: 13px;
  margin: 24px 0 0;
  padding: 18px;
  border: 0;
  border-left:
    2px solid
    variables.$color-primary;
  background:
    rgba(212, 175, 55, 0.025);
}

.method blockquote > span {
  color: variables.$color-primary;
  font-size: 1.8rem;
  line-height: 0.8;
}

.method blockquote p {
  margin: 0;
  color: #aaa;
  font-size: 0.72rem;
  font-style: italic;
  line-height: 1.65;
}

/* =========================================================
   LEARNING
========================================================= */

.learning__grid {
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

.learning-card {
  display: flex;
  gap: 14px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: #101010;
}

.learning-card__icon {
  display: grid;
  width: 43px;
  height: 43px;
  flex: 0 0 auto;
  place-items: center;
  border:
    1px solid
    rgba(212, 175, 55, 0.24);
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 0.54rem;
  font-weight: 900;
}

.learning-card h3 {
  margin: 2px 0 6px;
  font-size: 0.81rem;
}

.learning-card p {
  margin: 0;
  color: #707070;
  font-size: 0.63rem;
  line-height: 1.55;
}

/* =========================================================
   JOURNEY
========================================================= */

.journey {
  padding: 125px 24px;
}

.journey__grid {
  display: grid;
  gap: 11px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      repeat(5, 1fr);
  }
}

.journey__grid article {
  padding: 22px;
  border: 1px solid var(--border);
  border-radius: 15px;
  background: var(--surface);
}

.journey__number {
  display: grid;
  width: 38px;
  height: 38px;
  margin-bottom: 22px;
  place-items: center;
  border-radius: 50%;
  color: #090909;
  background: variables.$color-primary;
  font-size: 0.54rem;
  font-weight: 900;
}

.journey__grid small {
  color: variables.$color-primary;
  font-size: 0.46rem;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.journey__grid h3 {
  margin: 8px 0 9px;
  font-size: 0.88rem;
}

.journey__grid p {
  margin: 0;
  color: #6d6d6d;
  font-size: 0.63rem;
  line-height: 1.6;
}

/* =========================================================
   CLASSROOM
========================================================= */

.classroom__grid {
  display: grid;
  gap: 65px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      0.8fr 1.2fr;
  }
}

.classroom__intro > p {
  max-width: 500px;
  margin-top: 23px;
  color: #787878;
  font-size: 0.79rem;
  line-height: 1.75;
}

.classroom__facts {
  display: grid;
  grid-template-columns:
    repeat(2, 1fr);
  gap: 1px;
  overflow: hidden;
  margin-top: 28px;
  border: 1px solid var(--border);
  border-radius: 11px;
  background: var(--border);
}

.classroom__facts > div {
  padding: 14px;
  background: #0c0c0c;
}

.classroom__facts small,
.classroom__facts strong {
  display: block;
}

.classroom__facts small {
  margin-bottom: 5px;
  color: #575757;
  font-size: 0.45rem;
  font-weight: 900;
  letter-spacing: 0.11em;
}

.classroom__facts strong {
  font-size: 0.64rem;
}

.classroom__timeline {
  display: grid;
  gap: 10px;
}

.classroom__timeline article {
  display: flex;
  gap: 17px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 13px;
  background: #101010;
}

.classroom__timeline article > span {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  place-items: center;
  border:
    1px solid
    rgba(212, 175, 55, 0.24);
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 0.5rem;
  font-weight: 900;
}

.classroom__timeline small {
  color: variables.$color-primary;
  font-size: 0.45rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.classroom__timeline h3 {
  margin: 5px 0;
  font-size: 0.85rem;
}

.classroom__timeline p {
  margin: 0;
  color: #6d6d6d;
  font-size: 0.63rem;
  line-height: 1.55;
}

/* =========================================================
   STAGE
========================================================= */

.stage {
  position: relative;
  overflow: hidden;
  padding: 135px 24px;
}

.stage__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 700px;
  border-radius: 50%;
  background:
    rgba(212, 175, 55, 0.05);
  transform:
    translate(-50%, -50%);
  filter: blur(170px);
}

.stage__grid {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 75px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      0.9fr 1.1fr;

    align-items: center;
  }
}

.stage__copy > p {
  max-width: 610px;
  color: #7e7e7e;
  font-size: 0.8rem;
  line-height: 1.8;
}

.tags,
.community__values {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-top: 25px;
}

.tags span,
.community__values span {
  padding: 8px 11px;
  border: 1px solid #303030;
  border-radius: 999px;
  color: #888;
  font-size: 0.57rem;
  font-weight: 800;
}

.stage__statement {
  display: flex;
  gap: 12px;
  margin-top: 27px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 11px;
  background: var(--surface);
}

.stage__statement > span {
  color: variables.$color-primary;
}

.stage__statement p {
  margin: 0;
  color: #777;
  font-size: 0.64rem;
  line-height: 1.6;
}

.stage__visual {
  position: relative;
}

.stage__visual figure {
  position: relative;
  overflow: hidden;
  min-height: 650px;
  margin: 0;
  border: 1px solid var(--border);
  border-radius: 24px;
}

.stage__visual img {
  width: 100%;
  height: 100%;
  min-height: 650px;
  object-fit: cover;
}

.stage__visual figcaption {
  position: absolute;
  z-index: 2;
  right: 30px;
  bottom: 30px;
  left: 30px;
}

.stage__visual figcaption small {
  color: variables.$color-primary;
  font-size: 0.48rem;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.stage__visual figcaption strong {
  display: block;
  margin-top: 10px;
  font-size: clamp(2rem, 4vw, 3.7rem);
  line-height: 0.97;
}

.stage__visual figcaption strong em {
  display: block;
  color: variables.$color-primary;
  font-style: normal;
}

.stage__badge {
  position: absolute;
  top: 27px;
  right: -17px;
  padding: 10px 14px;
  border-radius: 999px;
  color: #090909;
  background: variables.$color-primary;
  font-size: 0.47rem;
  font-weight: 900;
  letter-spacing: 0.09em;
}

/* =========================================================
   RESULTS
========================================================= */

.results__grid {
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

.results__grid article {
  padding: 25px;
  border: 1px solid var(--border);
  border-radius: 15px;
  background: #101010;
}

.results__grid article > span {
  color: variables.$color-primary;
  font-size: 0.52rem;
  font-weight: 900;
}

.results__grid h3 {
  margin: 18px 0 8px;
  font-size: 0.9rem;
}

.results__grid p {
  margin: 0;
  color: #707070;
  font-size: 0.64rem;
  line-height: 1.6;
}

/* =========================================================
   COMMUNITY
========================================================= */

.community {
  padding: 130px 24px;
}

.community__grid {
  display: grid;
  gap: 70px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      1.05fr 0.95fr;

    align-items: center;
  }
}

.community__photo {
  position: relative;
  overflow: hidden;
  min-height: 610px;
  margin: 0;
  border: 1px solid var(--border);
  border-radius: 22px;
}

.community__photo img {
  width: 100%;
  height: 100%;
  min-height: 610px;
  object-fit: cover;
}

.community__photo figcaption {
  position: absolute;
  z-index: 2;
  bottom: 25px;
  left: 25px;
}

.community__photo figcaption span {
  color: variables.$color-primary;
  font-size: 0.49rem;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.community__content > p {
  max-width: 560px;
  color: #7c7c7c;
  font-size: 0.8rem;
  line-height: 1.8;
}

/* =========================================================
   AUDIENCE
========================================================= */

.audience {
  padding: 125px 24px;
  background: #0b0b0b;
}

.audience__grid {
  display: grid;
  gap: 70px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      0.8fr 1.2fr;
  }
}

.audience__intro {
  max-width: 450px;
  margin-top: 23px;
  color: #777;
  font-size: 0.77rem;
  line-height: 1.75;
}

.audience__list {
  display: grid;
  gap: 10px;
}

.audience__list article {
  display: flex;
  gap: 17px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 13px;
  background: var(--surface);
}

.audience__list article > span {
  color: variables.$color-primary;
  font-size: 0.5rem;
  font-weight: 900;
}

.audience__list strong {
  display: block;
  font-size: 0.78rem;
}

.audience__list p {
  margin: 5px 0 0;
  color: #6d6d6d;
  font-size: 0.64rem;
  line-height: 1.55;
}

/* =========================================================
   CLOSING PHOTO
========================================================= */

.closing-photo {
  position: relative;
  min-height: 760px;
  overflow: hidden;
}

.closing-photo > img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.closing-photo__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.93) 0%,
      rgba(0, 0, 0, 0.68) 44%,
      rgba(0, 0, 0, 0.2) 100%
    );
}

.closing-photo__content {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 760px;
  flex-direction: column;
  justify-content: center;
  padding: 70px 24px;
}

.closing-photo h2 {
  max-width: 800px;
  margin: 19px 0 0;
  font-size:
    clamp(3rem, 6vw, 6.2rem);
  line-height: 0.9;
  letter-spacing: -0.065em;
}

.closing-photo h2 em {
  display: block;
  color: variables.$color-primary;
  font-style: normal;
}

.closing-photo__content > p {
  max-width: 540px;
  margin-top: 24px;
  color: #aaa;
  font-size: 0.82rem;
  line-height: 1.75;
}

/* =========================================================
   FAQ
========================================================= */

.faq__grid {
  display: grid;
  gap: 70px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      0.7fr 1.3fr;
  }
}

.faq__list {
  border-top: 1px solid var(--border);
}

.faq__list article {
  border-bottom: 1px solid var(--border);
}

.faq__list button {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 22px 0;
  border: 0;
  color: #ddd;
  background: transparent;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 800;
  text-align: left;
  cursor: pointer;
}

.faq__list button:hover {
  color: variables.$color-primary;
}

.faq__list button strong {
  color: variables.$color-primary;
  font-size: 1.05rem;
}

.faq__answer {
  overflow: hidden;
}

.faq__answer p {
  max-width: 680px;
  margin: 0;
  padding-bottom: 22px;
  color: #737373;
  font-size: 0.67rem;
  line-height: 1.65;
}

.faq-enter-active,
.faq-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.faq-enter-from,
.faq-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* =========================================================
   CTA
========================================================= */

.cta {
  position: relative;
  overflow: hidden;
  padding: 140px 24px;
  background: #090909;
}

.cta__grid {
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

.cta__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 850px;
  height: 500px;
  border-radius: 50%;
  background:
    rgba(212, 175, 55, 0.075);
  transform:
    translate(-50%, -50%);
  filter: blur(170px);
}

.cta__content {
  position: relative;
  z-index: 2;
  display: grid;
  justify-items: center;
  text-align: center;
}

.cta h2 {
  max-width: 970px;
  margin: 18px 0 0;
  font-size:
    clamp(3.2rem, 7vw, 6.8rem);
  line-height: 0.89;
  letter-spacing: -0.07em;
}

.cta h2 em {
  display: block;
  color: variables.$color-primary;
  font-style: normal;
}

.cta__content > p {
  max-width: 560px;
  margin: 25px 0 30px;
  color: #818181;
  font-size: 0.82rem;
  line-height: 1.7;
}

.cta__content > small {
  margin-top: 20px;
  color: #4f4f4f;
  font-size: 0.49rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1000px) {
  .hero__visual {
    min-height: 620px;
  }

  .method__visual figure,
  .method__visual img {
    min-height: 600px;
  }
}

@media (max-width: 900px) {
  .hero {
    padding:
      145px 20px
      90px;
  }

  .manifesto,
  .pillars,
  .method,
  .learning,
  .journey,
  .classroom,
  .stage,
  .results,
  .community,
  .audience,
  .faq {
    padding:
      90px 20px;
  }

  .story {
    padding:
      10px 20px
      90px;
  }

  .cta {
    padding:
      110px 20px;
  }

  .closing-photo,
  .closing-photo__content {
    min-height: 620px;
  }
}

@media (max-width: 700px) {
  .hero {
    padding:
      130px 17px
      75px;
  }

  .hero h1 {
    font-size:
      clamp(3rem, 14vw, 5rem);
  }

  .hero__actions {
    flex-direction: column;
  }

  .hero__actions .button {
    width: 100%;
  }

  .hero__facts {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .hero__visual {
    min-height: 500px;
  }

  .hero-photo {
    inset: 0;
  }

  .floating-card--top {
    top: 15px;
    left: 14px;
  }

  .floating-card--bottom {
    right: 14px;
    bottom: 14px;
  }

  .method__badge,
  .stage__badge {
    right: 14px;
  }

  .method__visual figure,
  .method__visual img,
  .stage__visual figure,
  .stage__visual img,
  .community__photo,
  .community__photo img {
    min-height: 500px;
  }

  .closing-photo__overlay {
    background:
      linear-gradient(
        to top,
        rgba(0, 0, 0, 0.94),
        rgba(0, 0, 0, 0.35)
      );
  }

  .classroom__facts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .hero__facts {
    grid-template-columns: 1fr;
  }

  .hero__visual {
    min-height: 430px;
  }

  .floating-card {
    padding: 9px 10px;
  }

  .floating-card > span {
    width: 28px;
    height: 28px;
  }

  .pillar {
    padding: 22px;
  }

  .method__steps article,
  .classroom__timeline article,
  .audience__list article {
    padding: 17px;
  }

  .method__visual figure,
  .method__visual img,
  .stage__visual figure,
  .stage__visual img,
  .community__photo,
  .community__photo img {
    min-height: 440px;
  }

  .closing-photo,
  .closing-photo__content {
    min-height: 560px;
  }
}
</style>
