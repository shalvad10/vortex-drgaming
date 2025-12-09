## Overview

This is a prototype of a spinning “vortex” cashout game.  
The player places a bet, a spinning slot in the center reveals symbols, and matching rings around the vortex gradually fill to build a multiplier. The player can **cash out anytime**, but if a forbidden symbol appears, all progress is lost.

The project focuses on:
- **Responsive and animated game UI using PixiJS.**
- **Lottie-based 2D animated symbols.**
- **Zustand-driven state for deterministic gameplay logic.**
- **Modular, testable ring + progress architecture.**

---

## Installation & Running

```bash
# Install dependencies
npm install

# Run development
npm run dev

# Build production bundle
npm run build

# Optional: Preview build
npm run preview
```

### Requirements
- **Node.js 18+**
- A modern browser with WebGL support (Chrome/Brave/Edge/Firefox)

---

## Libraries Used

| Library | Purpose |
|---------|---------|
| **PixiJS** | Real-time 2D rendering of rings, vortex, and slot symbols |
| **Zustand** | Predictable and lightweight game state store |
| **Lottie-Web** | Vector animation playback for winning/losing symbols |
| **React + Next.js** | UI layer and game container |

### Why these?

| Need | Choice | Reason |
|------|--------|--------|
| High-frequency animation | PixiJS | WebGL accelerated, highly performant |
| Persistent but minimal game logic | Zustand | Small, no boilerplate, great for prototypes |
| Playable symbol animations | Lottie | Lightweight and scalable vector effects |
| Meta UI, screens, future expansion | React/Next | Perfect for overlays, menus, store, etc. |

---

## Architecture Overview

### **1. Game State (Zustand)**

- Holds balance, current bet, ring progress, canCashOut flag.
- Multiplier calculated as sum of filled segments across rings.
- Runtime `runSpin()` function injected by Pixi layer to trigger spins.

```ts
runSpin: (bet) => Promise<void>
```

 **Pixi just renders. Zustand is the single source of truth.**

---

### **2. Vortex + Progress Rendering (PixiJS)**

- Rings are generated from shared JSON config `RING_CONFIGS`.
- Each ring has:
  - Gradient fill texture
  - Segment dividers
  - Progress arc visualization
  - Optional icon
- Slot machine is masked inside the center circle.

 **Progress UI updates only mirror Zustand state. Never compute logic in Pixi.**

---

### **3. Symbol Animation (Lottie)**

- Each symbol has:
  - A static texture (for slot spinning)
  - An animation (when result is revealed)
- Lottie is rendered off-screen, converted to canvas, and mapped to a Pixi texture.

 Used only on result, not during spinning → performance win.

---

## Future Improvements (with extra 1–2 days)

| Feature | Benefit |
|---------|--------|
| Symbol probability weighting | Makes the game fair & tunable |
| Persistent economy + backend | Track live users, losses, wins |
| FX shader (glow + blur) on progress arcs | More premium look |
| Audio feedback for cashout & losses | Higher player excitement |
| Multi-ring probability linking | Enables “rare jackpots” and risk tiers |
| Mobile gesture support | Tap/drag/spin interactions |

---

## Notes

- Prototype prioritizes **architecture over polish**, allowing for quick scaling.
- All visual configurations are centralized in a single `ringConfig` file.
- The central vortex is intentionally isolated from business logic, making it replaceable with any game mechanic later.