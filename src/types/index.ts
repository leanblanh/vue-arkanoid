//Definções de tipos typescript
export interface Paddle {
  x: number
  y: number
  width: number
  height: number
}

export interface Ball {
  x: number
  y: number
  radius: number
  dx: number //Delta X: velocidade no eixo X
  dy: number // Delta Y: velecidade no eixo Y
}

export interface Brick {
  x: number
  y: number
  width: number
  height: number
  isBroken: boolean
  type: number // Usaremos 'type' para determinar qual imagem do tijolo usar
}
