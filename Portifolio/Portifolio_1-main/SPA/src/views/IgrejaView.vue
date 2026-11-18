<!-- src/views/IgrejaView.vue -->
<template>
  <main class="tela">
    <div class="cena" @mousemove="medir">
      <!-- Fundo (se a imagem não existir, aparece a cor provisória) -->
      <img class="fundo" :src="fundo" alt="" @error="esconder" />

      <RouterLink to="/cidade" class="voltar">← Voltar à vila</RouterLink>
      <h1 class="titulo">A Igreja</h1>

      <!-- Uma vela por história -->
      <button
        v-for="(v, i) in velas"
        :key="v.id"
        class="vela"
        :style="estilo(v, i)"
        :aria-label="v.titulo"
        @click="aberto = v"
      >
        <img v-if="v.imagem" :src="v.imagem" alt="" @error="esconder" />
        <span v-else class="cera"></span>
        <span class="rotulo">{{ v.titulo }}</span>
      </button>

      <!-- Pergaminho com a história -->
      <div v-if="aberto" class="modal-fundo" @click.self="aberto = null">
        <article class="pergaminho">
          <button class="fechar" type="button" @click="aberto = null">✕</button>
          <h2>{{ aberto.titulo }}</h2>
          <p v-for="(p, i) in aberto.texto" :key="i">{{ p }}</p>

          <div v-if="aberto.link" class="links">
            <a :href="aberto.link.url" target="_blank" rel="noopener">{{ aberto.link.nome }}</a>
          </div>
        </article>
      </div>

      <!-- Modo de ajuste: aperte D -->
      <div v-if="debug" class="medidor">Modo ajuste (D para sair)<br />mouse: x {{ mouse.x }} · y {{ mouse.y }}</div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { velas } from '../data/velas'

// pega o tipo direto da lista (funciona qualquer que seja o nome do tipo)
type VelaItem = (typeof velas)[number]

const fundo = '/igreja/Fundo.jpg'
const aberto = ref<VelaItem | null>(null)

function esconder(e: Event) {
  ;(e.target as HTMLImageElement).style.display = 'none'
}

// Posição de cada vela. Se a vela não tiver x/y/w no velas.ts, ela é
// distribuída sozinha em fileiras de 5, para você já ver todas na tela.
function estilo(v: VelaItem, i: number) {
  const x = v.x ?? 20 + (i % 5) * 15
  const y = v.y ?? 70 + Math.floor(i / 5) * 18
  const w = v.w ?? 6
  return {
    left: x + '%',
    top: y + '%',
    width: w + '%',
    zIndex: Math.round(y * 10),
    '--cor': v.cor ?? '#ffcf6b',
  }
}

// ----- modo de ajuste (descobrir coordenadas) -----
const debug = ref(false)
const mouse = ref({ x: 0, y: 0 })

function medir(e: MouseEvent) {
  if (!debug.value) return
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  mouse.value = {
    x: +(((e.clientX - r.left) / r.width) * 100).toFixed(1),
    y: +(((e.clientY - r.top) / r.height) * 100).toFixed(1),
  }
}

function aoApertarTecla(e: KeyboardEvent) {
  if (e.key === 'Escape') aberto.value = null
  if (e.key.toLowerCase() === 'd') debug.value = !debug.value
}
onMounted(() => window.addEventListener('keydown', aoApertarTecla))
onBeforeUnmount(() => window.removeEventListener('keydown', aoApertarTecla))
</script>

<style scoped>
.tela {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #0d0d12;
}

/* A cena mantém 16:9: fundo e velas escalam juntos */
.cena {
  position: relative;
  width: min(100vw, calc(100vh * 16 / 9));
  aspect-ratio: 16 / 9;
  overflow: hidden;
  /* provisório: igreja escura enquanto não há imagem */
  background: linear-gradient(#1b1d33 0 60%, #3a3a4a 60% 100%);
  image-rendering: pixelated;
  font-family: 'MedievalSharp', 'Georgia', serif;
}

.fundo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
}

.titulo {
  position: absolute;
  top: 3%;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  z-index: 5;
  color: #e0b040;
  font-size: clamp(1.2rem, 2.6vw, 2.6rem);
  text-shadow: 3px 3px 0 #000;
  white-space: nowrap;
}

.voltar {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1000;
  padding: 4px 12px;
  color: #f1e3c0;
  background: #8b1e2d;
  border: 2px solid #3b2a1c;
  text-decoration: none;
  font-size: 0.9rem;
}

/* ---------- VELAS ---------- */
.vela {
  position: absolute;
  padding: 0;
  border: 0;
  background: none;
  transform: translate(-50%, -100%);
  cursor: pointer;
  transition: translate 0.2s, filter 0.2s;
}
.vela:hover {
  translate: 0 -4px;
  filter: brightness(1.25) drop-shadow(0 0 10px var(--cor));
}
.vela img { display: block; width: 100%; height: auto; image-rendering: pixelated; }

/* vela provisória desenhada em CSS (some quando há imagem) */
.cera {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 1 / 2.4;
  background: #f1e3c0;
  border: 2px solid #3b2a1c;
  border-radius: 4px 4px 2px 2px;
}
.cera::before { /* chama */
  content: '';
  position: absolute;
  top: -48%;
  left: 50%;
  width: 40%;
  aspect-ratio: 1 / 1.6;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at 50% 70%, #fff6c0, var(--cor));
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  box-shadow: 0 0 14px 4px var(--cor);
  animation: tremer 1.2s ease-in-out infinite;
}
@keyframes tremer {
  0%, 100% { scale: 1 1; }
  50%      { scale: 0.9 1.12; }
}

/* título da vela só aparece ao passar o mouse */
.rotulo {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 6px);
  padding: 0.1em 0.5em;
  font-size: clamp(8px, 0.85vw, 14px);
  color: #f1e3c0;
  background: #6b4a2a;
  border: 2px solid #3b2a1c;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}
.vela:hover .rotulo { opacity: 1; }

/* ---------- PERGAMINHO ---------- */
.modal-fundo {
  position: absolute;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.7);
}

.pergaminho {
  position: relative;
  width: min(520px, 90%);
  max-height: 90%;
  overflow: auto;
  padding: 24px 28px;
  color: #3b2a1c;
  background: #e8d5a8;
  border: 4px solid #5a3d1c;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(120, 80, 30, 0.35);
}
.pergaminho h2 { margin: 0 0 12px; padding-right: 28px; color: #8b1e2d; font-size: 1.6rem; }
.pergaminho p { margin: 0 0 10px; line-height: 1.5; }

.fechar {
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 1.2rem;
  color: #3b2a1c;
  background: none;
  border: none;
  cursor: pointer;
}

.links { display: flex; gap: 10px; margin-top: 18px; }
.links a {
  padding: 6px 14px;
  color: #f1e3c0;
  background: #5a3d1c;
  border: 2px solid #3b2a1c;
  text-decoration: none;
}
.links a:hover { background: #8b1e2d; }

/* ---------- MODO AJUSTE ---------- */
.medidor {
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 3000;
  padding: 8px 12px;
  color: #fff;
  background: rgba(0, 0, 0, 0.8);
  font: 12px/1.5 monospace;
}
</style>