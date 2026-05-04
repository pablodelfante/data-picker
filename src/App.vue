<script setup lang="ts">
import { ref } from 'vue';
import DatePicker from './components/DatePicker.vue';

const selectedDate = ref<Date | null>(null);
</script>

<template>
  <main>
    <div class="background-blob"></div>
    <div class="background-blob secondary"></div>
    
    <div class="content">
      <header>
        <span class="badge">Technical Challenge</span>
        <h1>Headless <span>DatePicker</span></h1>
        <p class="subtitle">A framework-agnostic logic engine wrapped in Vue 3.</p>
      </header>

      <section class="picker-container">
        <DatePicker v-model="selectedDate" />
        
        <div v-if="selectedDate" class="selection-info">
          <p>Selected timestamp: <code>{{ selectedDate.getTime() }}</code></p>
        </div>
      </section>

      <footer>
        <p>Built with Vanilla TS & Vue 3</p>
      </footer>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: var(--bg);
}

.background-blob {
  position: absolute;
  top: -10%;
  left: -10%;
  width: 40vw;
  height: 40vw;
  background: radial-gradient(circle, var(--accent-bg) 0%, transparent 70%);
  filter: blur(60px);
  z-index: 0;
  animation: float 20s infinite alternate;
}

.background-blob.secondary {
  top: auto;
  bottom: -10%;
  right: -10%;
  left: auto;
  background: radial-gradient(circle, rgba(243, 156, 18, 0.1) 0%, transparent 70%);
  animation-delay: -10s;
}

@keyframes float {
  from { transform: translate(0, 0); }
  to { transform: translate(5%, 5%); }
}

.content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

header {
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: var(--accent-bg);
  color: var(--accent);
  border: 1px solid var(--accent-border);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

h1 {
  font-size: clamp(2.5rem, 8vw, 4rem);
  margin: 0;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.04em;
}

h1 span {
  background: linear-gradient(135deg, var(--accent), #f39c12);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  margin-top: 1rem;
  font-size: 1.2rem;
  opacity: 0.7;
}

.picker-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.selection-info {
  background: var(--code-bg);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  font-family: var(--mono);
  font-size: 0.9rem;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

footer {
  margin-top: 2rem;
  opacity: 0.4;
  font-size: 0.8rem;
}
</style>
