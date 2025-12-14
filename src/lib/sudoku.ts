import type { Puzzle } from '../data/puzzles';

export type CellKey = `${number}-${number}`;

export interface GameStateSnapshot {
  board: number[][];
  fixed: boolean[][];
}

export const cloneBoard = (board: number[][]): number[][] =>
  board.map((row) => [...row]);

export const buildFixedMatrix = (board: number[][]): boolean[][] =>
  board.map((row) => row.map((value) => value !== 0));

export const toCellKey = (row: number, col: number): CellKey => `${row}-${col}`;

export const validateBoard = (board: number[][]): Set<CellKey> => {
  const conflicts = new Set<CellKey>();

  // rows
  board.forEach((row, r) => {
    const seen = new Map<number, number>();
    row.forEach((value, c) => {
      if (!value) return;
      if (seen.has(value)) {
        conflicts.add(toCellKey(r, c));
        conflicts.add(toCellKey(r, seen.get(value)!));
      } else {
        seen.set(value, c);
      }
    });
  });

  // columns
  for (let col = 0; col < 9; col++) {
    const seen = new Map<number, number>();
    for (let row = 0; row < 9; row++) {
      const value = board[row][col];
      if (!value) continue;
      if (seen.has(value)) {
        conflicts.add(toCellKey(row, col));
        conflicts.add(toCellKey(seen.get(value)!, col));
      } else {
        seen.set(value, row);
      }
    }
  }

  // sub-grids
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Map<number, CellKey>();
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const row = boxRow * 3 + r;
          const col = boxCol * 3 + c;
          const value = board[row][col];
          if (!value) continue;
          const key = toCellKey(row, col);
          if (seen.has(value)) {
            conflicts.add(key);
            conflicts.add(seen.get(value)!);
          } else {
            seen.set(value, key);
          }
        }
      }
    }
  }

  return conflicts;
};

export const isBoardComplete = (board: number[][]): boolean =>
  board.every((row) => row.every((value) => value !== 0));

export const isSolved = (board: number[][], solution: number[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
};

export const getRandomPuzzle = (pool: Puzzle[]): Puzzle =>
  pool[Math.floor(Math.random() * pool.length)];

export const findEmptyCell = (board: number[][]): [number, number] | null => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return null;
};

export const serializeBoard = (board: number[][]): string =>
  board.map((row) => row.join('')).join('');
