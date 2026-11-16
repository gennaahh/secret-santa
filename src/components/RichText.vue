<script setup>
import { computed } from 'vue'

// Trasforma **testo** in grassetto senza usare v-html
const props = defineProps({ text: { type: String, required: true } })

const parts = computed(() =>
  props.text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((p) =>
      p.startsWith('**') && p.endsWith('**')
        ? { bold: true, value: p.slice(2, -2) }
        : { bold: false, value: p },
    ),
)
</script>

<template>
  <template v-for="(p, i) in parts" :key="i">
    <strong v-if="p.bold">{{ p.value }}</strong>
    <template v-else>{{ p.value }}</template>
  </template>
</template>
