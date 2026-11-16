import { ref, watch } from 'vue'

const STORAGE_KEY = 'secret-santa:step'

function readSaved(max) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const n = Number.parseInt(raw ?? '', 10)
    if (Number.isInteger(n) && n >= 0 && n <= max) return n
  } catch {
    // localStorage non disponibile (es. navigazione privata): si riparte dall'inizio
  }
  return 0
}

/**
 * Indice dello step corrente, salvato in localStorage.
 * 0 = schermata iniziale, 1..total = step, total + 1 = fine.
 */
export function useProgress(total) {
  const last = total + 1
  const current = ref(readSaved(last))

  watch(current, (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      // ignora: il progresso semplicemente non verrà ricordato
    }
  })

  const goTo = (i) => {
    current.value = Math.min(Math.max(i, 0), last)
  }

  return {
    current,
    last,
    goTo,
    next: () => goTo(current.value + 1),
    prev: () => goTo(current.value - 1),
    reset: () => goTo(0),
  }
}
