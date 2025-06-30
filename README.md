# Vue Arkanoid

A simple clone of the classic Arkanoid, developed with Vue 3 + Vite.

## About the Project

This project is an Arkanoid game built from scratch using Vue 3, Typescript, and Vite. The goal is to practice modern web development concepts, game logic, and componentization with Vue.

### Features Already Implemented

- Game canvas rendering.
- Paddle movement using the keyboard.
- Basic ball physics (bounces off walls and paddle).
- Generation and display of bricks to destroy.
- Collision detection between ball, paddle, and bricks.
- Score counting when destroying bricks.
- Game over when the ball is lost.

### In Development

- Extra lives and advanced scoring system.
- Visual and sound effects.
- Progressive levels.
- Start screen and game over screen.
- Responsiveness for mobile devices.

## How to Run the Project

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Installation

```sh
pnpm install
```

### Run in Development Mode

```sh
pnpm dev
```

### Build for Production

```sh
pnpm build
```

### Type Checking

```sh
pnpm type-check
```

### Lint

```sh
pnpm lint
```

## Project Structure

- `src/components/Game.vue`: Main game component.
- `src/assets/`: Images and styles.
- `src/types/`: TypeScript types used in the project.

## Contributing

Feel free to open issues or pull requests with suggestions, improvements, or fixes!
