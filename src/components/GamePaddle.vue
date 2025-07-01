<script setup lang="ts">
import type { Paddle as PaddleType } from '../types' // Renomear para evitar conflito com o nome do componente
import gameSprites from '../assets/BasicArkanoidPack.png' // Importa a sprite sheet
import { computed } from 'vue'

const props = defineProps<{ paddle: PaddleType }>()

const paddleStyle = computed(() => ({
  width: `${props.paddle.width}px`,
  height: `${props.paddle.height}px`,
  left: `${props.paddle.x}px`,
  top: `${props.paddle.y}px`,
  backgroundImage: `url(${gameSprites})`,
  backgroundRepeat: 'no-repeat',
  // Posição da raquete do meio na sprite sheet (ajuste se necessário)
  // Baseado em uma sprite de 128x28px
  backgroundPosition: `-0px -120px`, // Exemplo: posição da raquete do meio (y ~200px)
  backgroundSize: '300px auto', // Ajuste para cobrir a largura total da sprite sheet horizontalmente (aproximado)
}))
</script>

<template>
  <div class="absolute rounded-lg shadow-lg" :style="paddleStyle"></div>
</template>

<style scoped>
/* Nenhum estilo scoped adicional, Tailwind e estilos inline fazem o trabalho */
</style>
