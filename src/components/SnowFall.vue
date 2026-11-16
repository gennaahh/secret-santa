<script setup>
// Fiocchi di neve generati una volta sola, animati solo con CSS (leggero sui cellulari)
const COUNT = 36
const glyphs = ['❄', '❅', '❆', '•']

const rand = (min, max) => Math.random() * (max - min) + min

const flakes = Array.from({ length: COUNT }, (_, i) => ({
  id: i,
  glyph: glyphs[i % glyphs.length],
  style: {
    left: `${rand(0, 100)}%`,
    fontSize: `${rand(0.6, 1.5)}rem`,
    opacity: rand(0.35, 0.85).toFixed(2),
    animationDuration: `${rand(9, 20)}s, ${rand(3, 6)}s`,
    animationDelay: `-${rand(0, 20)}s, -${rand(0, 6)}s`,
  },
}))
</script>

<template>
  <div class="snow" aria-hidden="true">
    <span v-for="f in flakes" :key="f.id" class="flake" :style="f.style">{{ f.glyph }}</span>
  </div>
</template>

<style scoped>
.snow {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.flake {
  position: absolute;
  top: -2rem;
  color: var(--snow);
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
  animation-name: fall, sway;
  animation-timing-function: linear, ease-in-out;
  animation-iteration-count: infinite, infinite;
  animation-direction: normal, alternate;
  will-change: transform;
}

@keyframes fall {
  to {
    top: 105vh;
  }
}

@keyframes sway {
  from {
    transform: translateX(-14px) rotate(0deg);
  }
  to {
    transform: translateX(14px) rotate(40deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .flake {
    animation: none;
    display: none;
  }
}
</style>
