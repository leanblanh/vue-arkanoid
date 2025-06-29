<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

//Definções de tipos typescript
interface Paddle {
  x: number
  y: number
  width: number
  height: number
}

interface Ball {
  x: number
  y: number
  radius: number
  dx: number //Delta X: velocidade no eixo X
  dy: number // Delta Y: velecidade no eixo Y
}

interface Brick {
  x: number
  y: number
  width: number
  height: number
  isBroken: boolean
  color: string //Adicinar uma cor para o tijolo
}

// Configurações do jogo (constantes)
const GAME_WIDTH = 800
const GAME_HEIGHT = 600
const PADDLE_HEIGHT = 20
const PADDLE_WIDTH = 100
const BALL_RADIUS = 10
const BRICK_WIDTH = 70
const BRICK_HEIGHT = 20
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
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500']

  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.value.push({
        x: c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
        y: r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
        width: BRICK_WIDTH,
        height: BRICK_HEIGHT,
        isBroken: false,
        color: colors[r % colors.length], // Cicla cores por linha
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

// --- Ciclo de Vida do Componente ---
onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  startGame() // Inicia o jogo quando o componente é montado
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>
