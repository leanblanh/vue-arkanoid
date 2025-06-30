<script setup lang="ts">
import Game from '@/components/Game.vue'
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center py-8"
  >
    <h1 class="text-6xl font-extrabold text-green-400 mb-8 drop-shadow-lg animate-pulse">
      Arkanoid Vue
    </h1>
    <Game />
  </div>
</template>

<style scoped>
/* Não precisamos de estilos específicos aqui, Tailwind já faz o trabalho */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
</style>
