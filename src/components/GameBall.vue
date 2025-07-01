<script setup lang="ts">
import { computed } from 'vue'
import type { Ball as BallType } from '../types' // Renomear para evitar conflito
import gameSprites from '../assets/BasicArkanoidPack.png' // Importa a sprite sheet

const props = defineProps<{
  ball: BallType
}>()

// Define o estilo da bola com base nas props e na sprite sheet
const ballStyle = computed(() => ({
  width: `${props.ball.radius * 2}px`,
  height: `${props.ball.radius * 2}px`,
  left: `${props.ball.x - props.ball.radius}px`,
  top: `${props.ball.y - props.ball.radius}px`,
  backgroundImage: `url(${gameSprites})`,
  backgroundRepeat: 'no-repeat',
  // Posição da primeira bola na sprite sheet (ajuste se necessário)
  // Baseado em uma sprite de 28x28px
  backgroundPosition: `-0px -78px`, // Exemplo: posição da primeira bola (y ~140px)
  backgroundSize: '290px auto', // Ajuste para cobrir a largura total da sprite sheet horizontalmente (aproximado)
}))
</script>

<template>
  <div class="absolute rounded-full shadow-md" :style="ballStyle"></div>
</template>

<style scoped>
/* Nenhum estilo scoped adicional */
</style>
