export interface Puzzle {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  startingBoard: number[][];
  solution: number[][];
}

export interface Transformation {
  rowMap: number[];
  colMap: number[];
}

export interface PuzzleVariant extends Puzzle {
  baseId: string;
  transformationIndex: number;
}

const easyPuzzle: Puzzle = {
  id: 'easy-1',
  difficulty: 'easy',
  startingBoard: [
    [0, 0, 0, 2, 6, 0, 7, 0, 1],
    [6, 8, 0, 0, 7, 0, 0, 9, 0],
    [1, 9, 0, 0, 0, 4, 5, 0, 0],
    [8, 2, 0, 1, 0, 0, 0, 4, 0],
    [0, 0, 4, 6, 0, 2, 9, 0, 0],
    [0, 5, 0, 0, 0, 3, 0, 2, 8],
    [0, 0, 9, 3, 0, 0, 0, 7, 4],
    [0, 4, 0, 0, 5, 0, 0, 3, 6],
    [7, 0, 3, 0, 1, 8, 0, 0, 0],
  ],
  solution: [
    [4, 3, 5, 2, 6, 9, 7, 8, 1],
    [6, 8, 2, 5, 7, 1, 4, 9, 3],
    [1, 9, 7, 8, 3, 4, 5, 6, 2],
    [8, 2, 6, 1, 9, 5, 3, 4, 7],
    [3, 7, 4, 6, 8, 2, 9, 1, 5],
    [9, 5, 1, 7, 4, 3, 6, 2, 8],
    [5, 1, 9, 3, 2, 6, 8, 7, 4],
    [2, 4, 8, 9, 5, 7, 1, 3, 6],
    [7, 6, 3, 4, 1, 8, 2, 5, 9],
  ],
};

const applyTransformation = (board: number[][], { rowMap, colMap }: Transformation): number[][] =>
  rowMap.map((rowIndex) => colMap.map((colIndex) => board[rowIndex][colIndex]));

const buildMaps = (): number[][] => {
  const bandPermutations = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ];

  const withinBand = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
  ];

  const maps: number[][] = [];

  outer: for (const bandOrder of bandPermutations) {
    for (const first of withinBand) {
      for (const second of withinBand) {
        for (const third of withinBand) {
          const inBandOrders = [first, second, third];
          const combined: number[] = [];
          bandOrder.forEach((bandIndex, idx) => {
            const base = bandIndex * 3;
            inBandOrders[idx].forEach((offset) => combined.push(base + offset));
          });
          maps.push(combined);
        }
      }
    }
  }

  return maps;
};

const selectMaps = (maps: number[][], count: number, seed: number): number[][] => {
  const pool = [...maps];
  const selected: number[][] = [];
  let state = seed >>> 0;
  const next = () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0xffffffff;
  };

  for (let i = 0; i < count && pool.length > 0; i++) {
    const index = Math.floor(next() * pool.length);
    selected.push(pool[index]);
    pool.splice(index, 1);
  }

  return selected;
};

const allMaps = buildMaps();
const identityMap = Array.from({ length: 9 }, (_, index) => index);
const rowMaps = selectMaps(allMaps, 10, 12345);
const colMaps = selectMaps(allMaps, 10, 98765);

const transformationPool: Transformation[] = [{ rowMap: identityMap, colMap: identityMap }];

for (const rowMap of rowMaps) {
  for (const colMap of colMaps) {
    transformationPool.push({ rowMap, colMap });
    if (transformationPool.length >= 101) {
      break;
    }
  }
  if (transformationPool.length >= 101) {
    break;
  }
}

export const transformations = transformationPool;

export const basePuzzles: Puzzle[] = [easyPuzzle];

export const createPuzzleVariant = (base: Puzzle, transformationIndex: number): PuzzleVariant => {
  const transform = transformations[transformationIndex] ?? transformations[0];
  return {
    id: `${base.id}-${transformationIndex}`,
    baseId: base.id,
    transformationIndex,
    difficulty: base.difficulty,
    startingBoard: applyTransformation(base.startingBoard, transform),
    solution: applyTransformation(base.solution, transform),
  };
};

const getBasePool = (difficulty: Puzzle['difficulty']) => {
  const filtered = basePuzzles.filter((puzzle) => puzzle.difficulty === difficulty);
  return filtered.length > 0 ? filtered : basePuzzles;
};

export const getRandomPuzzleVariant = (difficulty: Puzzle['difficulty']): PuzzleVariant => {
  const pool = getBasePool(difficulty);
  const base = pool[Math.floor(Math.random() * pool.length)];
  const transformationIndex = Math.floor(Math.random() * transformations.length);
  return createPuzzleVariant(base, transformationIndex);
};
