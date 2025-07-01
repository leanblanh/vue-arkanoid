// src/game/index.ts
import { ref, type Ref, readonly } from 'vue'
import type { Paddle, Ball, Brick } from '../types' // Importa as interfaces

// --- Constantes do Jogo ---
export const GAME_WIDTH = 800
export const GAME_HEIGHT = 600
export const PADDLE_HEIGHT = 28 // Ajustado para a sprite
export const PADDLE_WIDTH = 178 // Ajustado para a sprite
export const BALL_RADIUS = 14 // Ajustado para a sprite (diâmetro 28px)
export const BRICK_WIDTH = 64 // Ajustado para a sprite
export const BRICK_HEIGHT = 28 // Ajustado para a sprite
export const BRICK_ROWS = 5
export const BRICK_COLS = 10
export const BRICK_PADDING = 5
export const BRICK_OFFSET_TOP = 30
export const BRICK_OFFSET_LEFT = 30
export const BALL_INITIAL_SPEED = 5

export class GameEngine {
  // --- Estados Reativos Internos ---
  private _paddle: Ref<Paddle>
  private _ball: Ref<Ball>
  private _bricks: Ref<Brick[]>
  private _gameRunning: Ref<boolean>
  private _score: Ref<number>
  private _lives: Ref<number>

  // Variáveis para o loop do jogo
  private animationFrameId: number | null = null

  constructor() {
    // Inicializa estados reativos
    this._paddle = ref({
      x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2,
      y: GAME_HEIGHT - PADDLE_HEIGHT - 10,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    })
    this._ball = ref({
      x: GAME_WIDTH / 2,
      y: this._paddle.value.y - BALL_RADIUS,
      radius: BALL_RADIUS,
      dx: BALL_INITIAL_SPEED,
      dy: -BALL_INITIAL_SPEED,
    })
    this._bricks = ref([])
    this._gameRunning = ref(false)
    this._score = ref(0)
    this._lives = ref(3)

    // Inicializa tijolos na construção para que estejam prontos
    this.initBricks()
  }

  // --- Expondo Estados Reativos (Somente Leitura) ---
  get paddle() {
    return readonly(this._paddle)
  }
  get ball() {
    return readonly(this._ball)
  }
  get bricks() {
    return readonly(this._bricks)
  }
  get gameRunning() {
    return readonly(this._gameRunning)
  }
  get score() {
    return readonly(this._score)
  }
  get lives() {
    return readonly(this._lives)
  }

  // --- Métodos do Jogo ---
  private initBricks() {
    this._bricks.value = []
    // Os 'types' dos tijolos podem ser mapeados para diferentes sprites
    // Usaremos 6 tipos para os 6 primeiros tijolos da sprite sheet
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        this._bricks.value.push({
          x: c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
          y: r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          isBroken: false,
          type: r % 6, // Cicla entre 0 e 5 para os tipos de tijolos
        })
      }
    }
  }

  public startGame() {
    this._score.value = 0
    this._lives.value = 3
    this.initBricks()
    // Reseta a posição da raquete e bola
    this._paddle.value.x = GAME_WIDTH / 2 - PADDLE_WIDTH / 2
    this._ball.value.x = GAME_WIDTH / 2
    this._ball.value.y = this._paddle.value.y - BALL_RADIUS
    this._ball.value.dx = BALL_INITIAL_SPEED
    this._ball.value.dy = -BALL_INITIAL_SPEED
    this._gameRunning.value = true
    this.gameLoop() // Inicia o loop principal do jogo
  }

  public stopGame() {
    this._gameRunning.value = false
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  private gameLoop = () => {
    // Usar arrow function para manter 'this'
    if (!this._gameRunning.value) {
      this.stopGame() // Garante que o loop pare se o jogo não estiver rodando
      return
    }

    this.updateGame()

    // Verifica Game Over ou Vitória após a atualização
    if (this._lives.value <= 0) {
      this.stopGame()
      alert('Game Over! Pontuação: ' + this._score.value)
    } else {
      const allBricksBroken = this._bricks.value.every((brick) => brick.isBroken)
      if (allBricksBroken) {
        this.stopGame()
        alert('Parabéns! Você venceu! Pontuação: ' + this._score.value)
      }
    }

    if (this._gameRunning.value) {
      // Só solicita o próximo frame se o jogo ainda estiver rodando
      this.animationFrameId = requestAnimationFrame(this.gameLoop)
    }
  }

  private updateGame() {
    // Movimento da Bola
    this._ball.value.x += this._ball.value.dx
    this._ball.value.y += this._ball.value.dy

    // Colisão com as Paredes (topo, esquerda, direita)
    if (
      this._ball.value.x + this._ball.value.radius > GAME_WIDTH ||
      this._ball.value.x - this._ball.value.radius < 0
    ) {
      this._ball.value.dx *= -1
    }
    if (this._ball.value.y - this._ball.value.radius < 0) {
      this._ball.value.dy *= -1
    }

    // Colisão com o chão (perdeu vida)
    if (this._ball.value.y + this._ball.value.radius > GAME_HEIGHT) {
      this._lives.value--
      if (this._lives.value <= 0) {
        this.stopGame() // Game Over
        return // Sai da função de atualização para não continuar o movimento
      } else {
        // Reseta a bola para a posição inicial da raquete
        this._ball.value.x = this._paddle.value.x + this._paddle.value.width / 2
        this._ball.value.y = this._paddle.value.y - BALL_RADIUS
        this._ball.value.dx = BALL_INITIAL_SPEED
        this._ball.value.dy = -BALL_INITIAL_SPEED
      }
    }

    // Colisão com a Raquete (detecção de colisão simples)
    if (
      this._ball.value.x + this._ball.value.radius > this._paddle.value.x &&
      this._ball.value.x - this._ball.value.radius <
        this._paddle.value.x + this._paddle.value.width &&
      this._ball.value.y + this._ball.value.radius > this._paddle.value.y &&
      this._ball.value.y - this._ball.value.radius <
        this._paddle.value.y + this._paddle.value.height
    ) {
      // Colisão com a raquete, inverte DY
      // Uma lógica mais avançada aqui faria a bola rebater em ângulos diferentes
      this._ball.value.dy *= -1
      // Garante que a bola não fique presa dentro da raquete
      this._ball.value.y = this._paddle.value.y - this._ball.value.radius
    }

    // Colisão com os Tijolos (lógica simplificada)
    this._bricks.value.forEach((brick) => {
      if (!brick.isBroken) {
        // Colisão AABB (Axis-Aligned Bounding Box) entre a bola e o tijolo
        // Simplificado para colisão na vertical para o Arkanoid
        if (
          this._ball.value.x + this._ball.value.radius > brick.x &&
          this._ball.value.x - this._ball.value.radius < brick.x + brick.width &&
          this._ball.value.y + this._ball.value.radius > brick.y &&
          this._ball.value.y - this._ball.value.radius < brick.y + brick.height
        ) {
          this._ball.value.dy *= -1 // Inverte direção Y da bola
          brick.isBroken = true // Marca o tijolo como quebrado
          this._score.value += 10 // Adiciona pontos
        }
      }
    })
  }

  // Método para atualizar a posição da raquete a partir da UI
  public updatePaddlePosition(newX: number) {
    if (!this._gameRunning.value) return
    let finalX = newX
    if (finalX < 0) finalX = 0
    if (finalX + this._paddle.value.width > GAME_WIDTH)
      finalX = GAME_WIDTH - this._paddle.value.width
    this._paddle.value.x = finalX
  }
}
