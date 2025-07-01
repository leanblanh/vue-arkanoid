<script setup lang="ts">
import { computed } from 'vue'
import type { Brick as BrickType } from '../types' // Renomear para evitar conflito
import gameSprites from '../assets/BasicArkanoidPack.png' // Importa a sprite sheet
import { BRICK_WIDTH } from '../game' // Importa BRICK_WIDTH para calcular a posição X da sprite

const props = defineProps<{
  brick: BrickType
}>()

// Define o estilo do tijolo com base nas props e na sprite sheet
const brickStyle = computed(() => {
  // Cálculo da posição X na sprite sheet: brick.type * BRICK_WIDTH
  // A linha superior de tijolos na sua sprite sheet começa em y=0px.
  const backgroundX = props.brick.type * BRICK_WIDTH
  const backgroundY = 0 // Assume que todos os tijolos estão na primeira linha da sprite sheet

  return {
    width: `${props.brick.width}px`,
    height: `${props.brick.height}px`,
    left: `${props.brick.x}px`,
    top: `${props.brick.y}px`,
    backgroundImage: `url(${gameSprites})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: `-${backgroundX}px -${backgroundY}px`,
    backgroundSize: '700px auto', // Ajuste este valor para cobrir todos os tijolos horizontalmente
  }
})
</script>

<template>
  <div class="absolute rounded-sm shadow-sm" :style="brickStyle"></div>
</template>

<style scoped>
/* Nenhum estilo scoped adicional */
</style>
