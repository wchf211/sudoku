# Sudoku Vibes

This is a small “build it because it’s fun” project: a cozy Sudoku experience crafted with Vite + React + TypeScript, plenty of CSS tweaking, and a pencil of optimism.

## Sudoku recap

- A 9×9 grid split into nine 3×3 subgrids.
- Each row, column, and subgrid must contain the digits 1–9 exactly once.
- Most puzzles start with a partially filled board (aka “givens”) and you deduce the rest.

## What the app offers

- **Randomized boards**: We store base puzzles and lazily apply deterministic row/column transformations (100+ variants) so every New Game feels fresh.
- **Board interactions**: tap/click to select cells, highlight matching numbers, and see conflicts immediately.
- **Keyboard + mouse input**: use the on-screen number pad (with hint + clear) or type 1–9 / Backspace.
- **Pencil mode**: jot candidate digits in each cell; toggling pencil automatically switches the number pad styling, and undo/redo handles notes too.
- **Undo, hints, timer**: track elapsed time, remaining cells, limit hints (3 per puzzle), and roll back moves whenever you need.
- **Leaderboard**: optional name entry when you solve a puzzle; results persist via `localStorage`.
- **Mobile-friendly UI**: compact header, centered status bar, responsive board, and touch-friendly controls so you can play on your phone or tablet.

Pull requests are welcome—feel free to add more base puzzles, difficulty selectors, or fresh styling ideas. Happy puzzling! 🧩✨

## Getting started

```bash
# clone and install
git clone https://github.com/wchf211/sudoku.git
cd sudoku
npm install

# start dev server (adds --host so phones/tablets on the same Wi-Fi can join)
npm run dev -- --host

# open http://localhost:5173 (or http://<LAN-IP>:5173 on other devices)
```

### Useful scripts

| Script            | Description                                   |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Launch Vite dev server with HMR                |
| `npm run build`   | Type-check + create production build in `dist` |
| `npm run preview` | Preview the production build locally           |
