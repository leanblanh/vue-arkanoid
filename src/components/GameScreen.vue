<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

// Importa a classe GameEngine e as constantes do jogo
import { GameEngine, GAME_WIDTH, GAME_HEIGHT, PADDLE_WIDTH } from '../game'

// Importa os novos componentes de apresentação
import GamePaddle from './GamePaddle.vue'
import GameBall from './GameBall.vue'
import GameBrick from './GameBrick.vue'

// Instancia o GameEngine. O Vue manterá esta instância ao longo do ciclo de vida do componente.
const gameEngine = new GameEngine()

// --- Controles ---
const handleMouseMove = (event: MouseEvent) => {
  const gameContainer = document.getElementById('game-container')
  if (gameContainer) {
    const rect = gameContainer.getBoundingClientRect()
    // Calcula a nova posição X da raquete baseada no mouse
    // Passa a responsabilidade de validar e atualizar para o GameEngine
    gameEngine.updatePaddlePosition(event.clientX - rect.left - PADDLE_WIDTH / 2)
  }
}

// --- Ciclo de Vida do Componente ---
onMounted(() => {
  // Adiciona o listener de movimento do mouse ao documento
  document.addEventListener('mousemove', handleMouseMove)
  // Inicia o jogo quando o componente é montado
  gameEngine.startGame()
})

onUnmounted(() => {
  // Remove o listener de movimento do mouse ao desmontar o componente
  document.removeEventListener('mousemove', handleMouseMove)
  // Para o loop do jogo para evitar vazamentos de memória
  gameEngine.stopGame()
})

// Funções para interação da UI, se necessário (ex: botão de reiniciar)
const restartGame = () => {
  gameEngine.startGame()
}
</script>

<template>
  <div
    id="game-container"
    class="relative overflow-hidden border-4 border-blue-500 bg-gray-800"
    :style="{ width: GAME_WIDTH + 'px', height: GAME_HEIGHT + 'px' }"
  >
    <GamePaddle :paddle="gameEngine.paddle.value" />

    <GameBall :ball="gameEngine.ball.value" />

    <template v-for="(brick, index) in gameEngine.bricks.value" :key="index">
      <GameBrick v-if="!brick.isBroken" :brick="brick" />
    </template>

    <div class="absolute top-2 left-2 text-white font-bold text-lg">
      Pontos: {{ gameEngine.score }}
    </div>
    <div class="absolute top-2 right-2 text-white font-bold text-lg">
      Vidas: {{ gameEngine.lives }}
    </div>

    <div
      v-if="!gameEngine.gameRunning.value && gameEngine.lives.value > 0"
      class="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white text-3xl font-bold"
    >
      Mova o mouse para começar!
      <button
        type="button"
        class="px-6 py-3 mt-2 rounded-lg text-xl text-white bg-green-500 hover:bg-green-700"
        @click="restartGame"
      >
        Começar
      </button>
    </div>
    <div
      v-if="!gameEngine.gameRunning.value && gameEngine.lives.value <= 0"
      class="absolute inset-0 flex items-center justify-center flex-col bg-black bg-opacity-50 text-white text-3xl font-bold"
    >
      GAME OVER! Pontuação: {{ gameEngine.score }}
      <button
        @click="restartGame"
        class="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xl"
      >
        Jogar Novamente
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Nenhum estilo scoped adicional aqui, Tailwind e estilos inline fazem o trabalho */
</style>
