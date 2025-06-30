<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Paddle, Ball, Brick } from '@/types'
import gameSprites from '@/assets/BasicArkanoidPack.png' // Importa a sprite sheet

// Configurações do jogo (constantes)
const GAME_WIDTH = 800
const GAME_HEIGHT = 600
const PADDLE_HEIGHT = 28
const PADDLE_WIDTH = 176
const BALL_RADIUS = 14
const BRICK_WIDTH = 64
const BRICK_HEIGHT = 28
const BRICK_ROWS = 5
const BRICK_COLS = 10
const BRICK_PADDING = 5
const BRICK_OFFSET_TOP = 30
const BRICK_OFFSET_LEFT = 30
const BALL_INITIAL_SPEED = 5

const paddle = ref<Paddle>({
  x: GAME_WIDTH / 2,
  y: GAME_HEIGHT - PADDLE_HEIGHT - 10,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
})

const ball = ref<Ball>({
  x: GAME_WIDTH / 2,
  y: paddle.value.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  dx: BALL_INITIAL_SPEED,
  dy: -BALL_INITIAL_SPEED,
})

const bricks = ref<Brick[]>([])
const gameRunning = ref<boolean>(false)
const score = ref<number>(0)
const lives = ref<number>(3)

//variáveis para o loop do jogo
const animationFrameId: number | null = null

// --- Funções de Inicialização e Lógica ---

// 1 - Inicializar Tijolos
const initBricks = () => {
  bricks.value = [] //limpa tijolos existentes

  // O tipo 0 pode ser o laranja, 1 o vermelho, etc.
  // Aqui, vamos usar a linha de cima (0-5) dos tijolos para a cor.
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.value.push({
        x: c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
        y: r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
        width: BRICK_WIDTH,
        height: BRICK_HEIGHT,
        isBroken: false,
        type: r % 6, // Usar os 6 primeiros tipos de tijolos da linha superior
      })
    }
  }
}

// 2 - Iniciar o jogo
const startGame = () => {
  score.value = 0
  lives.value = 3
  initBricks()
  // Reseta a posição da raquete e bola
  paddle.value.x = GAME_WIDTH / 2 - PADDLE_WIDTH / 2
  ball.value.x = GAME_WIDTH / 2
  ball.value.y = paddle.value.y - BALL_RADIUS
  ball.value.dx = BALL_INITIAL_SPEED //garante a direçao inicial
  ball.value.dy = -BALL_INITIAL_SPEED
  gameRunning.value = true
  gameLoop() // Inicia o loop principal do jogo
}

//3 - Loop Principal do jogo
const gameLoop = () => {
  if (!gameRunning.value) return
  updateGame() //Atualiza a posição da bola, raquete, colisões
  drawGame() // redesenha os elementos na tela

  animationFrameId = requestAnimationFrame(gameLoop) //Solicita o próximo frame
}

// 4 Lógica de Atualização (Colisões, Movimento) - Ainda Não implementado Completamente
const updateGame = () => {
  //movimento da Bola
  ball.value.x += ball.value.dx
  ball.value.y += ball.value.dy

  //Colisão com as Paredes (topo, esquerda, direita)
  if (ball.value.x + ball.value.radius > GAME_WIDTH || ball.value.x - ball.value.radius < 0) {
    ball.value.dx *= -1 // Inverte direção X
  }
  if (ball.value.y - ball.value.radius < 0) {
    ball.value.dy *= -1 // Inverte direção Y (colisão com o topo)
  }

  // Colisão com o chão (perdeu vida)
  if (ball.value.y + ball.value.radius > GAME_HEIGHT) {
    lives.value--
    if (lives.value <= 0) {
      gameRunning.value = false
      alert('Game Over! Pontuação: ' + score.value)
      cancelAnimationFrame(animationFrameId!)
    } else {
      // Reseta a bola para a posição inicial da raquete
      ball.value.x = paddle.value.x + paddle.value.width / 2
      ball.value.y = paddle.value.y - BALL_RADIUS
      ball.value.dx = BALL_INITIAL_SPEED
      ball.value.dy = -BALL_INITIAL_SPEED
    }
  }

  // Colisão com a Raquete (detecção de colisão simples)
  if (
    ball.value.x + ball.value.radius > paddle.value.x &&
    ball.value.x - ball.value.radius < paddle.value.x + paddle.value.width &&
    ball.value.y + ball.value.radius > paddle.value.y &&
    ball.value.y - ball.value.radius < paddle.value.y + paddle.value.height
  ) {
    // Colisão com a raquete, inverte DY
    // Uma lógica mais avançada aqui faria a bola rebater em ângulos diferentes
    ball.value.dy *= -1
  }

  // Colisão com os Tijolos (lógica simplificada por enquanto)
  bricks.value.forEach((brick) => {
    if (!brick.isBroken) {
      if (
        ball.value.x + ball.value.radius > brick.x &&
        ball.value.x - ball.value.radius < brick.x + brick.width &&
        ball.value.y + ball.value.radius > brick.y &&
        ball.value.y - ball.value.radius < brick.y + brick.height
      ) {
        ball.value.dy *= -1 // Inverte direção Y da bola
        brick.isBroken = true // Marca o tijolo como quebrado
        score.value += 10 // Adiciona pontos
      }
    }
  })

  // Checar vitória
  const allBricksBroken = bricks.value.every((brick) => brick.isBroken)
  if (allBricksBroken) {
    gameRunning.value = false
    alert('Parabéns! Você venceu! Pontuação: ' + score.value)
    cancelAnimationFrame(animationFrameId!)
  }
}

// 5 - Lógica de Desenho (Atualiza estilos dos elementos HTML)
const drawGame = () => {
  // Os estilos reativos no template (v-bind:style) já fazem o "desenho"
  // Esta função é mais um placeholder para futuras lógicas de desenho mais complexas ou otimizações.
}

// --- Controles ---
const handleMouseMove = (event: MouseEvent) => {
  if (!gameRunning.value) return // Movimenta a raquete apenas se o jogo estiver rodando
  const gameContainer = document.getElementById('game-container')
  if (gameContainer) {
    const rect = gameContainer.getBoundingClientRect()
    // Garante que a raquete não saia dos limites do jogo
    let newX = event.clientX - rect.left - paddle.value.width / 2
    if (newX < 0) newX = 0
    if (newX + paddle.value.width > GAME_WIDTH) newX = GAME_WIDTH - paddle.value.width
    paddle.value.x = newX
  }
}

// --- Ciclo de Vida do Componente ---
// Adiciona o listener de movimento do mouse e chama startGame() quando o componente é inserido no DOM.
onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  startGame() // Inicia o jogo quando o componente é montado
})

//Remove o listener de movimento do mouse e cancela o loop do jogo quando o componente é removido para evitar vazamentos de memória.
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div
    id="game-container"
    class="relative overflow-hidden border-4 border-blue-500 bg-gray-800"
    :style="{ width: GAME_WIDTH + 'px', height: GAME_HEIGHT + 'px' }"
  >
    <div
      class="absolute rounded-lg"
      :style="{
        width: paddle.width + 'px',
        height: paddle.height + 'px',
        left: paddle.x + 'px',
        top: paddle.y + 'px',
        backgroundImage: `url(${gameSprites})`,
        backgroundRepeat: 'no-repeat',
        // Ajustar background-position para a raquete do meio na sprite sheet
        // A raquete do meio parece estar em torno de x=0, y=200px (aproximadamente)
        // Ajuste esses valores com base na sua imagem!
        backgroundPosition: `-0px -120px`, // Exemplo: posição da raquete do meio
        backgroundSize: '300px auto', // Ajuste este valor para encaixar todas as sprites horizontalmente
      }"
    ></div>

    <div
      class="absolute rounded-full"
      :style="{
        width: ball.radius * 2 + 'px',
        height: ball.radius * 2 + 'px',
        left: ball.x - ball.radius + 'px',
        top: ball.y - ball.radius + 'px',
        backgroundImage: `url(${gameSprites})`,
        backgroundRepeat: 'no-repeat',
        // Ajustar background-position para a primeira bola da sprite sheet
        // Bolas parecem estar em torno de x=0, y=140px (aproximadamente)
        backgroundPosition: `-0px -78px`, // Exemplo: posição da primeira bola
        backgroundSize: '290px auto', // Ajuste este valor
      }"
    ></div>

    <template v-for="(brick, index) in bricks" :key="index">
      <div
        v-if="!brick.isBroken"
        class="absolute rounded-sm"
        :style="{
          width: brick.width + 'px',
          height: brick.height + 'px',
          left: brick.x + 'px',
          top: brick.y + 'px',
          backgroundImage: `url(${gameSprites})`,
          backgroundRepeat: 'no-repeat',
          // Calcular background-position para cada tipo de tijolo
          // Cada tijolo tem 64px de largura e 28px de altura (aproximadamente)
          // A linha superior de tijolos começa em y=0.
          // brick.type * 64 para ir para o próximo tijolo na horizontal
          backgroundPosition: `-${brick.type * 64}px -0px`,
          backgroundSize: '700px auto', // Ajuste este valor para cobrir todos os tijolos
        }"
      ></div>
    </template>

    <div class="absolute top-2 left-2 text-white font-bold text-lg">Pontos: {{ score }}</div>
    <div class="absolute top-2 right-2 text-white font-bold text-lg">Vidas: {{ lives }}</div>

    <div
      v-if="!gameRunning && lives > 0"
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-3xl font-bold"
    >
      Clique ou mova o mouse para começar!
    </div>
    <div
      v-if="!gameRunning && lives <= 0"
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-3xl font-bold"
    >
      GAME OVER! Pontuação: {{ score }}
      <button
        @click="startGame"
        class="mt-4 px-6 block py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xl"
      >
        Jogar Novamente
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Nenhum estilo específico aqui, usamos Tailwind CSS */
</style>
