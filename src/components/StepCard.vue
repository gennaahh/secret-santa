<script setup>
import RichText from './RichText.vue'

defineProps({
  step: { type: Object, required: true },
  number: { type: Number, required: true },
  total: { type: Number, required: true },
  phaseTitle: { type: String, required: true },
})
</script>

<template>
  <article class="card step">
    <header class="step-head">
      <span class="step-icon" aria-hidden="true">{{ step.icon }}</span>
      <div>
        <p class="step-kicker">Step {{ number }} di {{ total }} · {{ phaseTitle }}</p>
        <h2 class="step-title">{{ step.title }}</h2>
      </div>
    </header>

    <p v-if="step.intro" class="step-intro"><RichText :text="step.intro" /></p>

    <ul v-if="step.items" class="step-list">
      <li v-for="(item, i) in step.items" :key="i"><RichText :text="item" /></li>
    </ul>

    <ol v-if="step.substeps" class="step-sublist">
      <li v-for="(item, i) in step.substeps" :key="i"><RichText :text="item" /></li>
    </ol>

    <aside v-if="step.tip" class="box box-tip">
      <p class="box-title"><span aria-hidden="true">{{ step.tip.icon }}</span> {{ step.tip.title }}:</p>
      <ul>
        <li v-for="(item, i) in step.tip.items" :key="i"><RichText :text="item" /></li>
      </ul>
    </aside>

    <aside v-if="step.note" class="box box-note">
      <span class="box-note-icon" aria-hidden="true">{{ step.note.icon }}</span>
      <p><RichText :text="step.note.text" /></p>
    </aside>
  </article>
</template>

<style scoped>
.step-head {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1.1rem;
}

.step-icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 1.2rem;
  background: var(--accent-soft);
  font-size: 1.7rem;
}

.step-kicker {
  margin: 0 0 0.2rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text-muted);
}

.step-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.35rem;
  line-height: 1.2;
  color: var(--accent-strong);
}

.step-intro {
  margin: 0 0 1rem;
}

.step-list,
.step-sublist,
.box ul {
  margin: 0 0 1rem;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.7rem;
}

.step-list li,
.box ul li {
  position: relative;
  padding-left: 1.5rem;
}

.step-list li::before,
.box ul li::before {
  content: '✦';
  position: absolute;
  left: 0;
  top: 0.05em;
  color: var(--gold);
  font-size: 0.95em;
}

.step-sublist {
  counter-reset: sub;
  margin-left: 0.4rem;
}

.step-sublist li {
  counter-increment: sub;
  position: relative;
  padding: 0.65rem 0.85rem 0.65rem 2.9rem;
  border-radius: 1rem;
  background: var(--surface-alt);
}

.step-sublist li::before {
  content: counter(sub);
  position: absolute;
  left: 0.7rem;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  background: var(--green);
  color: #fff;
  font-weight: 800;
  font-size: 0.85rem;
}

.box {
  border-radius: 1.2rem;
  padding: 0.95rem 1rem;
  margin-top: 0.4rem;
}

.box ul {
  margin: 0;
}

.box-tip {
  background: var(--gold-soft);
  border: 1.5px dashed var(--gold);
}

.box-title {
  margin: 0 0 0.6rem;
  font-weight: 800;
}

.box-note {
  display: flex;
  gap: 0.7rem;
  align-items: flex-start;
  background: var(--green-soft);
}

.box-note p {
  margin: 0;
}

.box-note-icon {
  font-size: 1.2rem;
  line-height: 1.4;
}

@media (min-width: 768px) {
  .step-title {
    font-size: 1.6rem;
  }

  .step-icon {
    width: 4rem;
    height: 4rem;
    font-size: 2rem;
  }
}
</style>
