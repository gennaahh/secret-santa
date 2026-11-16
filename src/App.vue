<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import SnowFall from './components/SnowFall.vue'
import StepCard from './components/StepCard.vue'
import { phases, steps, REPO_URL } from './data/steps.js'
import { useProgress } from './composables/useProgress.js'

const total = steps.length
const { current, last, goTo, next, prev, reset } = useProgress(total)

const isWelcome = computed(() => current.value === 0)
const isDone = computed(() => current.value === last)
const step = computed(() => (isWelcome.value || isDone.value ? null : steps[current.value - 1]))
const phaseOf = (s) => phases.find((p) => p.id === s.phase)

// Elenco step raggruppato per fase (usato nella barra laterale su tablet/pc)
const grouped = phases.map((p) => ({
  ...p,
  steps: steps.map((s, i) => ({ ...s, number: i + 1 })).filter((s) => s.phase === p.id),
}))

const progress = computed(() => Math.round((Math.min(current.value, total) / total) * 100))

// Direzione dell'animazione tra gli step
const direction = ref('forward')
watch(current, (n, o) => {
  direction.value = n >= o ? 'forward' : 'back'
})

// Porta in alto la pagina quando cambia lo step
const main = ref(null)
watch(current, async () => {
  await nextTick()
  window.scrollTo({ top: 0, behavior: 'smooth' })
  main.value?.focus({ preventScroll: true })
})

// Swipe orizzontale sul cellulare
let touchX = null
let touchY = null
const onTouchStart = (e) => {
  touchX = e.touches[0].clientX
  touchY = e.touches[0].clientY
}
const onTouchEnd = (e) => {
  if (touchX === null) return
  const dx = e.changedTouches[0].clientX - touchX
  const dy = e.changedTouches[0].clientY - touchY
  touchX = touchY = null
  if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return
  if (dx < 0 && !isDone.value) next()
  if (dx > 0 && !isWelcome.value) prev()
}

const confirmReset = () => {
  if (window.confirm('Vuoi ricominciare dall’inizio?')) reset()
}
</script>

<template>
  <SnowFall />

  <div class="shell">
    <header class="top">
      <button class="brand" type="button" @click="goTo(0)">
        <span aria-hidden="true">🎅</span> Secret Santa
      </button>
      <a class="gh-link" :href="REPO_URL" target="_blank" rel="noopener" aria-label="Codice su GitHub">
        <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
        <span class="gh-label">GitHub</span>
      </a>
    </header>

    <div class="layout">
      <!-- Barra laterale: visibile solo da tablet in su -->
      <nav class="sidebar card" aria-label="Elenco degli step">
        <div v-for="phase in grouped" :key="phase.id" class="side-phase">
          <p class="side-phase-title"><span aria-hidden="true">{{ phase.icon }}</span> {{ phase.title }}</p>
          <ol class="side-list">
            <li v-for="s in phase.steps" :key="s.number">
              <button
                type="button"
                class="side-item"
                :class="{ active: current === s.number, done: current > s.number }"
                :aria-current="current === s.number ? 'step' : undefined"
                @click="goTo(s.number)"
              >
                <span class="side-num">{{ current > s.number ? '✓' : s.number }}</span>
                <span>{{ s.title }}</span>
              </button>
            </li>
          </ol>
        </div>
      </nav>

      <main ref="main" class="content" tabindex="-1" @touchstart.passive="onTouchStart" @touchend="onTouchEnd">
        <div v-if="!isWelcome" class="progress" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>

        <Transition :name="'slide-' + direction" mode="out-in">
          <!-- Schermata iniziale -->
          <section v-if="isWelcome" key="welcome" class="card hero">
            <div class="hero-art" aria-hidden="true">🎁</div>
            <h1 class="hero-title">Il nostro Secret Santa</h1>
            <p class="hero-text">
              Tutte le regole, un passo alla volta. Il sito si ricorda a che punto sei arrivato,
              quindi puoi chiuderlo e riaprirlo quando vuoi.
            </p>
            <ul class="hero-phases">
              <li v-for="phase in grouped" :key="phase.id">
                <span aria-hidden="true">{{ phase.icon }}</span>
                <span><strong>{{ phase.title }}</strong> · step {{ phase.steps[0].number }}–{{ phase.steps.at(-1).number }}</span>
              </li>
            </ul>
            <button type="button" class="btn btn-primary btn-wide" @click="next">Iniziamo ✨</button>
          </section>

          <!-- Fine -->
          <section v-else-if="isDone" key="done" class="card hero">
            <div class="hero-art" aria-hidden="true">🎄</div>
            <h1 class="hero-title">Buon Secret Santa!</h1>
            <p class="hero-text">Hai visto tutti gli step. Ora non resta che divertirsi e provare a indovinare chi ti ha fatto il regalo.</p>
            <div class="hero-actions">
              <button type="button" class="btn btn-ghost" @click="prev">← Rivedi l’ultimo step</button>
              <button type="button" class="btn btn-primary" @click="reset">Ricomincia</button>
            </div>
          </section>

          <!-- Step -->
          <StepCard
            v-else
            :key="current"
            :step="step"
            :number="current"
            :total="total"
            :phase-title="phaseOf(step).title"
          />
        </Transition>

        <div v-if="!isWelcome && !isDone" class="nav">
          <button type="button" class="btn btn-ghost" @click="prev">← Indietro</button>
          <button type="button" class="btn btn-primary" @click="next">
            {{ current === total ? 'Fatto! 🎉' : 'Avanti →' }}
          </button>
        </div>

        <div v-if="!isWelcome && !isDone" class="dots" aria-hidden="true">
          <span v-for="n in total" :key="n" class="dot" :class="{ on: n === current, past: n < current }"></span>
        </div>

        <p v-if="!isWelcome && !isDone" class="hint">Puoi anche scorrere a destra o a sinistra 👆</p>
      </main>
    </div>

    <footer class="foot">
      <p>
        Fatto con 🤍 per il nostro Secret Santa ·
        <a :href="REPO_URL" target="_blank" rel="noopener">codice su GitHub</a>
      </p>
      <button v-if="!isWelcome" type="button" class="link-btn" @click="confirmReset">Ricomincia dall’inizio</button>
    </footer>
  </div>
</template>

<style scoped>
.shell {
  position: relative;
  z-index: 1;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: calc(env(safe-area-inset-top) + 0.75rem) 1rem calc(env(safe-area-inset-bottom) + 1rem);
  max-width: 1080px;
  margin: 0 auto;
}

/* Header */
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.brand {
  border: 0;
  background: none;
  padding: 0.3rem 0;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent-strong);
  cursor: pointer;
}

.gh-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  box-shadow: var(--shadow-sm);
}

.gh-link:hover {
  color: var(--accent-strong);
}

/* Layout: una colonna sul cellulare */
.layout {
  flex: 1;
  display: grid;
  gap: 1.25rem;
  align-content: start;
}

.sidebar {
  display: none;
}

.content {
  outline: none;
  min-width: 0;
}

/* Barra di avanzamento */
.progress {
  height: 0.55rem;
  border-radius: 999px;
  background: var(--surface-alt);
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: inset 0 1px 2px rgba(80, 40, 30, 0.08);
}

.progress-bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--green), var(--accent));
  transition: width 0.4s ease;
}

/* Schermate iniziale e finale */
.hero {
  text-align: center;
  padding-top: 2rem;
  padding-bottom: 1.75rem;
}

.hero-art {
  display: inline-grid;
  place-items: center;
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
  background: var(--accent-soft);
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: bob 3.5s ease-in-out infinite;
}

@keyframes bob {
  50% {
    transform: translateY(-6px) rotate(-4deg);
  }
}

.hero-title {
  margin: 0 0 0.6rem;
  font-family: var(--font-display);
  font-size: 1.85rem;
  line-height: 1.15;
  color: var(--accent-strong);
}

.hero-text {
  margin: 0 auto 1.25rem;
  max-width: 34rem;
  color: var(--text-muted);
}

.hero-phases {
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0;
  display: grid;
  gap: 0.6rem;
  text-align: left;
}

.hero-phases li {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background: var(--surface-alt);
}

.hero-phases li > span:first-child {
  font-size: 1.4rem;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* Navigazione */
.nav {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 0.75rem;
  margin-top: 1rem;
}

.dots {
  display: flex;
  justify-content: center;
  gap: 0.45rem;
  margin-top: 1.1rem;
}

.dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--line);
  transition: all 0.3s ease;
}

.dot.past {
  background: var(--green);
}

.dot.on {
  width: 1.5rem;
  background: var(--accent);
}

.hint {
  margin: 0.8rem 0 0;
  text-align: center;
  font-size: 0.82rem;
  color: var(--text-muted);
}

/* Footer */
.foot {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.foot p {
  margin: 0 0 0.4rem;
}

.foot a {
  color: var(--accent-strong);
  font-weight: 700;
}

.link-btn {
  border: 0;
  background: none;
  color: var(--text-muted);
  text-decoration: underline;
  font: inherit;
  cursor: pointer;
  padding: 0.3rem;
}

/* Transizioni tra step */
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-back-enter-active,
.slide-back-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.slide-forward-enter-from,
.slide-back-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.slide-forward-leave-to,
.slide-back-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}

/* Tablet */
@media (min-width: 768px) {
  .shell {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .top {
    margin-bottom: 1.5rem;
  }

  .brand {
    font-size: 1.5rem;
  }

  .hero {
    padding: 3rem 2.5rem 2.5rem;
  }

  .hero-title {
    font-size: 2.4rem;
  }

  .hero-phases {
    grid-template-columns: 1fr 1fr;
  }

  .hero-actions {
    flex-direction: row;
    justify-content: center;
  }

  .content {
    max-width: 640px;
    width: 100%;
    margin: 0 auto;
  }

  .nav {
    grid-template-columns: auto auto;
    justify-content: space-between;
  }

  .hint {
    display: none;
  }
}

/* PC: barra laterale con tutti gli step */
@media (min-width: 1024px) {
  .layout {
    grid-template-columns: 300px 1fr;
    gap: 2rem;
  }

  .sidebar {
    display: block;
    position: sticky;
    top: 1.5rem;
    align-self: start;
    padding: 1.25rem;
  }

  .content {
    margin: 0;
    max-width: 680px;
  }
}

.side-phase + .side-phase {
  margin-top: 1.1rem;
}

.side-phase-title {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.side-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.3rem;
}

.side-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.65rem;
  border: 0;
  border-radius: 0.9rem;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 0.92rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
}

.side-item:hover {
  background: var(--surface-alt);
}

.side-item.active {
  background: var(--accent-soft);
  font-weight: 700;
  color: var(--accent-strong);
}

.side-num {
  flex: none;
  display: grid;
  place-items: center;
  width: 1.7rem;
  height: 1.7rem;
  border-radius: 50%;
  background: var(--surface-alt);
  font-size: 0.8rem;
  font-weight: 800;
}

.side-item.active .side-num {
  background: var(--accent);
  color: #fff;
}

.side-item.done .side-num {
  background: var(--green);
  color: #fff;
}
</style>
