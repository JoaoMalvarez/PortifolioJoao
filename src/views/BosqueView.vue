<!-- src/views/BosqueView.vue -->
<template>
  <main class="tela">
    <div class="cena">
      <!-- Fundo (a cena pode ter o seu próprio; o :key recria a imagem ao trocar) -->
      <img :key="fundoAtual" class="fundo" :src="asset(fundoAtual)" alt="" @error="esconder" />

      <RouterLink to="/cidade" class="voltar">← Voltar à vila</RouterLink>

      <!-- Vida -->
      <div class="vida" aria-label="Vida">
        <span v-for="n in configuracao.vidaInicial" :key="n" :class="{ vazio: n > vida }">♥</span>
      </div>

      <!-- Caixa de texto -->
      <section class="caixa">
        <h2 v-if="cena.titulo">{{ cena.titulo }}</h2>
        <p v-for="(p, i) in cena.texto" :key="i">{{ p }}</p>

        <template v-if="!rolando && !resultado">
          <div v-if="cena.escolhas?.length" class="escolhas">
            <button v-for="(e, i) in cena.escolhas" :key="i" type="button" @click="escolher(e)">
              {{ e.texto }}
              <small v-if="e.teste">d20 · dificuldade {{ e.teste.dificuldade }}</small>
            </button>
          </div>

          <div v-else class="fim">
            <strong v-if="cena.fim === 'vitoria'">Vitória!</strong>
            <strong v-else-if="cena.fim === 'derrota'">Fim da jornada</strong>
            <strong v-else-if="cena.fim === 'fim'">O fim</strong>
            <button type="button" @click="reiniciar">Jogar de novo</button>
            <small>Finais encontrados: {{ finaisVistos.length }} / {{ totalFinais }}</small>
          </div>
        </template>
      </section>

      <!-- Dado -->
      <div v-if="rolando || resultado" class="dado-fundo">
        <div class="mesa-dado" :class="{ critico: resultado?.critico, desastre: resultado?.desastre }">
          <div class="dado-sombra" :class="{ rolando }"></div>
          <!-- voo: o dado é jogado e quica; giro: ele gira em 3D -->
          <div class="dado-voo" :class="{ rolando }">
            <div class="dado-giro" :class="{ rolando, pousou: !!resultado }">
              <svg class="dado-svg" viewBox="0 0 100 100" aria-hidden="true">
                <polygon class="face" points="50,4 91,27 91,73 50,96 9,73 9,27" />
                <polygon class="face-meio" points="50,22 76,66 24,66" />
                <path
                  class="arestas"
                  d="M50 4V22 M91 27L50 22 M91 27L76 66 M91 73L76 66 M50 96L76 66 M50 96L24 66 M9 73L24 66 M9 27L24 66 M9 27L50 22"
                />
              </svg>
              <span class="dado-numero">{{ numero }}</span>
            </div>
          </div>
        </div>

        <!-- área reservada: o dado não "pula" quando o resultado aparece -->
        <div class="area-resultado">
          <div v-if="resultado" class="resultado">
            <p v-if="resultado.critico" class="destaque">Acerto crítico!</p>
            <p v-else-if="resultado.desastre" class="destaque">Falha crítica!</p>
            <p>
              Você tirou {{ resultado.dado }}
              <template v-if="resultado.bonus">+ {{ resultado.bonus }} = {{ resultado.total }}</template>
              (precisava de {{ resultado.dificuldade }})
            </p>
            <p class="veredito" :class="{ ok: resultado.passou }">{{ resultado.passou ? 'Sucesso!' : 'Falhou!' }}</p>
            <p v-if="resultado.perdeu">Você perdeu {{ resultado.perdeu }} de vida.</p>
            <button type="button" @click="continuar">Continuar</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { asset } from '../utils/asset'
import { cenas, configuracao, type Cena, type Escolha, type Teste } from '../data/historia'

const mapa = new Map(cenas.map((c) => [c.id, c]))

// se um id estiver errado na história, aparece um aviso em vez de quebrar
function buscar(id: string): Cena {
  return (
    mapa.get(id) ?? {
      id: 'erro',
      titulo: 'Cena não encontrada',
      texto: [`Não existe uma cena com o id "${id}". Confira o arquivo historia.ts.`],
      escolhas: [{ texto: 'Voltar ao início', vai: configuracao.inicio }],
    }
  )
}

const cena = ref<Cena>(buscar(configuracao.inicio))
const vida = ref(configuracao.vidaInicial)

const fundoAtual = computed(() => cena.value.fundo ?? '/bosque/Fundo.jpg')

function esconder(e: Event) {
  ;(e.target as HTMLImageElement).style.display = 'none'
}

// ----- finais já encontrados (guardados só neste navegador) -----
const CHAVE = 'bosque-finais'
function carregarFinais(): string[] {
  try {
    const t = localStorage.getItem(CHAVE)
    return t ? JSON.parse(t) : []
  } catch {
    return []
  }
}
const finaisVistos = ref<string[]>(carregarFinais())
const totalFinais = cenas.filter((c) => c.fim).length

function registrarFinal(id: string) {
  if (finaisVistos.value.includes(id)) return
  finaisVistos.value.push(id)
  try {
    localStorage.setItem(CHAVE, JSON.stringify(finaisVistos.value))
  } catch {
    /* sem armazenamento: tudo bem, só não salva */
  }
}

// ----- navegação entre cenas -----
function irPara(id: string) {
  cena.value = buscar(id)
  if (cena.value.fim) registrarFinal(cena.value.id)
}

function reiniciar() {
  vida.value = configuracao.vidaInicial
  resultado.value = null
  irPara(configuracao.inicio)
}

function escolher(e: Escolha) {
  if (e.teste) rolar(e.teste)
  else if (e.vai) irPara(e.vai)
}

// ----- dado d20 -----
type Resultado = {
  dado: number
  bonus: number
  total: number
  dificuldade: number
  passou: boolean
  critico: boolean
  desastre: boolean
  perdeu: number
  proxima: string
}

const rolando = ref(false)
const resultado = ref<Resultado | null>(null)
const numero = ref(20)
let timer: number | undefined

const d20 = () => Math.floor(Math.random() * 20) + 1

// Pausa (em ms) entre um número e o próximo: o dado começa rápido e vai
// desacelerando até parar. A soma é 1200 ms, igual à duração das animações
// do dado no CSS (se mudar um, mude o outro).
const ATRASOS = [45, 45, 50, 55, 60, 70, 85, 100, 120, 145, 175, 250]

function rolar(t: Teste) {
  window.clearTimeout(timer)
  rolando.value = true
  resultado.value = null

  let i = 0
  const passo = () => {
    if (i < ATRASOS.length) {
      numero.value = d20()
      timer = window.setTimeout(passo, ATRASOS[i++])
      return
    }

    // o dado parou: agora sim sorteia o resultado de verdade
    const dado = d20()
    numero.value = dado
    const bonus = t.bonus ?? 0
    const total = dado + bonus
    const critico = dado === 20 // 20 sempre passa
    const desastre = dado === 1 // 1 sempre falha
    const passou = critico || (!desastre && total >= t.dificuldade)

    resultado.value = {
      dado,
      bonus,
      total,
      dificuldade: t.dificuldade,
      passou,
      critico,
      desastre,
      perdeu: passou ? 0 : (t.dano ?? 0),
      proxima: passou ? t.sucesso : t.falha,
    }
    rolando.value = false
  }
  passo()
}

function continuar() {
  const r = resultado.value
  if (!r) return
  resultado.value = null
  vida.value = Math.max(0, vida.value - r.perdeu)
  irPara(vida.value === 0 ? configuracao.cenaSemVida : r.proxima)
}

onBeforeUnmount(() => window.clearTimeout(timer))
</script>

<style scoped>
.tela {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #0d0d12;
}

.cena {
  position: relative;
  width: min(100vw, calc(100vh * 16 / 9));
  aspect-ratio: 16 / 9;
  overflow: hidden;
  /* provisório enquanto não há imagem de fundo */
  background: linear-gradient(#1d3a2a, #0f2418);
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

.voltar {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  padding: 4px 12px;
  color: #f1e3c0;
  background: #8b1e2d;
  border: 2px solid #3b2a1c;
  text-decoration: none;
  font-size: 0.9rem;
}

.vida {
  position: absolute;
  top: 12px;
  right: 14px;
  z-index: 10;
  font-size: clamp(18px, 2.4vw, 32px);
  color: #e0384c;
  text-shadow: 2px 2px 0 #000;
  letter-spacing: 0.15em;
}
.vida .vazio { color: #3a2a2a; }

/* ---------- CAIXA DE TEXTO ---------- */
.caixa {
  position: absolute;
  left: 3%;
  right: 3%;
  bottom: 3%;
  max-height: 58%;
  overflow: auto;
  padding: 1.4% 2%;
  color: #f1e3c0;
  background: rgba(30, 20, 10, 0.9);
  border: 4px solid #5a3d1c;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.6);
  font-size: clamp(12px, 1.35vw, 22px);
  line-height: 1.5;
}
.caixa h2 {
  margin: 0 0 0.4em;
  color: #e0b040;
  font-size: 1.3em;
}
.caixa p { margin: 0 0 0.6em; }

.escolhas { display: grid; gap: 0.5em; margin-top: 0.8em; }
.escolhas button,
.fim button,
.resultado button {
  padding: 0.5em 1em;
  font: inherit;
  text-align: left;
  color: #3b2a1c;
  background: #e8d5a8;
  border: 3px solid #5a3d1c;
  cursor: pointer;
}
.escolhas button:hover,
.fim button:hover,
.resultado button:hover { background: #f5e6bd; }
.escolhas small { display: block; opacity: 0.7; font-size: 0.8em; }

.fim { display: grid; gap: 0.6em; justify-items: start; margin-top: 0.8em; }
.fim strong { color: #e0b040; font-size: 1.2em; }
.fim small { opacity: 0.7; }

/* ---------- DADO ---------- */
.dado-fundo {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 1em;
  background: rgba(0, 0, 0, 0.7);
  color: #f1e3c0;
  font-size: clamp(12px, 1.5vw, 22px);
  text-align: center;
}

/* mesa onde o dado cai (perspective dá a profundidade do giro 3D) */
.mesa-dado {
  position: relative;
  width: 9em;
  height: 9em;
  perspective: 700px;
  --corpo: #e8d5a8;
  --meio: #d8c08a;
  --tinta: #3b2a1c;
}
.mesa-dado.critico { --corpo: #f2c84b; --meio: #e0a92a; }
.mesa-dado.desastre { --corpo: #8b1e2d; --meio: #6f1723; --tinta: #f1e3c0; }

/* sombra no chão: some e volta conforme o dado sobe e desce */
.dado-sombra {
  position: absolute;
  left: 50%;
  bottom: -0.8em;
  width: 7em;
  height: 1.3em;
  margin-left: -3.5em;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  filter: blur(2px);
  opacity: 0.6;
}
.dado-sombra.rolando { animation: sombra 1.2s linear forwards; }
@keyframes sombra {
  0%   { scale: 0.3; opacity: 0; }
  28%  { scale: 1;    opacity: 0.6; }
  44%  { scale: 0.7;  opacity: 0.35; }
  58%  { scale: 1;    opacity: 0.6; }
  70%  { scale: 0.8;  opacity: 0.4; }
  80%  { scale: 1;    opacity: 0.6; }
  88%  { scale: 0.92; opacity: 0.5; }
  100% { scale: 1;    opacity: 0.6; }
}

/* voo: cai de cima, quica 3 vezes (cada quique menor) e para */
.dado-voo { width: 100%; height: 100%; }
.dado-voo.rolando { animation: quicar 1.2s linear forwards; }
@keyframes quicar {
  0%   { translate: -22em -18em; opacity: 0; animation-timing-function: cubic-bezier(0.5, 0, 1, 0.6); }
  4%   { opacity: 1; }
  28%  { translate: -6em 0;      animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1); }
  44%  { translate: -3em -5em;   animation-timing-function: cubic-bezier(0.5, 0, 1, 0.6); }
  58%  { translate: -1em 0;      animation-timing-function: ease-out; }
  70%  { translate: 0 -2.2em;    animation-timing-function: ease-in; }
  80%  { translate: 0 0;         animation-timing-function: ease-out; }
  88%  { translate: 0 -0.7em;    animation-timing-function: ease-in; }
  100% { translate: 0 0; opacity: 1; }
}

/* giro: várias voltas em 3D que desaceleram e terminam "de frente" (múltiplos de 360) */
.dado-giro {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}
.dado-giro.rolando { animation: giro3d 1.2s cubic-bezier(0.2, 0.6, 0.3, 1) forwards; }
@keyframes giro3d {
  from { transform: rotateX(0) rotateY(0) rotateZ(0); }
  to   { transform: rotateX(720deg) rotateY(720deg) rotateZ(360deg); }
}

/* pouso: um "achatadinho" quando o dado para */
.dado-giro.pousou { animation: pousar 0.3s ease-out; }
@keyframes pousar {
  0%   { scale: 1.12 0.86; }
  60%  { scale: 0.96 1.04; }
  100% { scale: 1 1; }
}
/* 20: pulsa dourado | 1: treme */
.mesa-dado.critico .dado-giro.pousou { animation: pousar 0.3s ease-out, pulso 0.7s ease-in-out 0.3s 2; }
.mesa-dado.critico .dado-svg { filter: drop-shadow(0 0 0.8em #ffd36b); }
.mesa-dado.desastre .dado-giro.pousou { animation: pousar 0.3s ease-out, abalo 0.5s ease-in-out 0.3s; }
@keyframes pulso {
  0%, 100% { scale: 1 1; }
  50%      { scale: 1.12 1.12; }
}
@keyframes abalo {
  0%, 100% { translate: 0 0; }
  20%      { translate: -0.35em 0; }
  40%      { translate: 0.35em 0; }
  60%      { translate: -0.25em 0; }
  80%      { translate: 0.25em 0; }
}

/* desenho do d20 (hexágono + triângulo central + arestas) */
.dado-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  filter: drop-shadow(0.15em 0.15em 0 rgba(0, 0, 0, 0.5));
}
.face, .face-meio { stroke: #3b2a1c; stroke-linejoin: round; }
.face { fill: var(--corpo); stroke-width: 4; }
.face-meio { fill: var(--meio); stroke-width: 3; }
.arestas { fill: none; stroke: #3b2a1c; stroke-width: 2.5; stroke-linecap: round; }

.dado-numero {
  position: absolute;
  left: 50%;
  top: 54%;
  translate: -50% -50%;
  font-size: 2.1em;
  line-height: 1;
  color: var(--tinta);
}

.area-resultado { min-height: 11em; }

/* quem prefere menos movimento: o número ainda troca, mas o dado não voa nem gira */
@media (prefers-reduced-motion: reduce) {
  .dado-voo.rolando,
  .dado-giro.rolando,
  .dado-sombra.rolando { animation: none; }
}

.resultado p { margin: 0 0 0.4em; }
.destaque { color: #e0b040; font-size: 1.3em; }
.veredito { font-size: 1.4em; color: #e0384c; }
.veredito.ok { color: #6ccf6c; }
.resultado button { margin-top: 0.6em; text-align: center; }

/* ---------- CELULAR (em pé) ---------- */
@media (max-width: 700px) {
  .cena {
    width: 100%;
    aspect-ratio: auto;
    min-height: 100vh;
  }
  .caixa {
    max-height: 70%;
    font-size: 14px;
  }
  .dado-fundo { font-size: 15px; }
}
</style>
