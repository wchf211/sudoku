import { useCallback, useEffect, useMemo, useState } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import Leaderboard from './components/Leaderboard';
import StatusBar from './components/StatusBar';
import NumberPad from './components/NumberPad';
import { getRandomPuzzleVariant } from './data/puzzles';
import {
  buildFixedMatrix,
  cloneBoard,
  findEmptyCell,
  isBoardComplete,
  isSolved,
  validateBoard,
} from './lib/sudoku';
import './App.css';
import type { LeaderboardEntry } from './lib/storage';
import { loadLeaderboard, saveLeaderboard } from './lib/storage';

type NoteCell = boolean[];
type NotesGrid = NoteCell[][];

interface MoveSnapshot {
  board: number[][];
  mistakes: number;
  notes: NotesGrid;
}

const createEmptyNotes = (): NotesGrid =>
  Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => Array(10).fill(false)),
  );

const cloneNotes = (notes: NotesGrid): NotesGrid =>
  notes.map((row) => row.map((cell) => [...cell]));

const pickPuzzle = () => getRandomPuzzleVariant('easy');

const App = () => {
  const [puzzle, setPuzzle] = useState(() => pickPuzzle());
  const [board, setBoard] = useState(() => cloneBoard(puzzle.startingBoard));
  const [fixed, setFixed] = useState(() => buildFixedMatrix(puzzle.startingBoard));
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [conflicts, setConflicts] = useState(() => validateBoard(board));
  const [mistakes, setMistakes] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isSolvedState, setIsSolvedState] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => loadLeaderboard());
  const [remainingHints, setRemainingHints] = useState(3);
  const [history, setHistory] = useState<MoveSnapshot[]>([]);
  const [notes, setNotes] = useState<NotesGrid>(() => createEmptyNotes());
  const [isPencilMode, setIsPencilMode] = useState(false);

  const remainingCells = useMemo(
    () => board.flat().filter((value) => value === 0).length,
    [board],
  );

  const digitCounts = useMemo(() => {
    const counts = Array(10).fill(0);
    board.forEach((row) =>
      row.forEach((value) => {
        if (value > 0) counts[value] += 1;
      }),
    );
    return counts;
  }, [board]);

  const captureSnapshot = useCallback(() => {
    setHistory((prev) => [...prev, { board: cloneBoard(board), mistakes, notes: cloneNotes(notes) }]);
  }, [board, mistakes, notes]);

  const pruneNotesForValue = (grid: NotesGrid, row: number, col: number, value: number) => {
    for (let c = 0; c < 9; c++) {
      grid[row][c][value] = false;
    }
    for (let r = 0; r < 9; r++) {
      grid[r][col][value] = false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        grid[r][c][value] = false;
      }
    }
  };

  const updateCell = useCallback((row: number, col: number, value: number) => {
    if (fixed[row][col]) return;
    const currentValue = board[row][col];
    if (currentValue === value) {
      return;
    }
    captureSnapshot();
    setBoard((prev) => {
      const next = cloneBoard(prev);
      next[row][col] = value;
      return next;
    });
    setNotes((prev) => {
      const next = cloneNotes(prev);
      next[row][col].fill(false);
      if (value !== 0) {
        pruneNotesForValue(next, row, col, value);
      }
      return next;
    });
    if (value !== 0 && value !== puzzle.solution[row][col]) {
      setMistakes((m) => m + 1);
    }
    if (!isRunning && !isPaused) {
      setIsRunning(true);
    }
  }, [fixed, board, captureSnapshot, isRunning, isPaused, puzzle.solution]);

  const handleWin = () => {
    setIsSolvedState(true);
    setIsRunning(true);
    setIsPaused(false);
    const player = window.prompt('Great job! Enter your name for the leaderboard:', 'Player');
    if (!player) return;
    const entry: LeaderboardEntry = {
      id: `${puzzle.id}-${Date.now()}`,
      player,
      durationMs: elapsedMs,
      mistakes,
      finishedAt: new Date().toISOString(),
      puzzleId: puzzle.id,
    };
    setLeaderboard((prev) => {
      const updated = [...prev, entry].sort((a, b) => a.durationMs - b.durationMs).slice(0, 10);
      saveLeaderboard(updated);
      return updated;
    });
  };

  const handleNumberInput = useCallback(
    (value: number) => {
      if (!selectedCell || isPaused || isSolvedState) return;
      const [row, col] = selectedCell;
      if (fixed[row][col]) return;
      if (value === 0) {
        updateCell(row, col, 0);
        return;
      }
      if (isPencilMode) {
        captureSnapshot();
        setBoard((prev) => {
          if (prev[row][col] === 0) return prev;
          const next = cloneBoard(prev);
          next[row][col] = 0;
          return next;
        });
        setNotes((prev) => {
          const next = cloneNotes(prev);
          next[row][col][value] = !next[row][col][value];
          return next;
        });
        if (!isRunning && !isPaused) {
          setIsRunning(true);
        }
        return;
      }
      updateCell(row, col, value);
    },
    [selectedCell, isPaused, isSolvedState, fixed, updateCell, isPencilMode, captureSnapshot, isRunning],
  );

  useEffect(() => {
    if (!isRunning || isPaused) {
      return;
    }
    const timerId = window.setInterval(() => {
      setElapsedMs((ms) => ms + 1000);
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [isRunning, isPaused]);

  useEffect(() => {
    setConflicts(validateBoard(board));
    if (isBoardComplete(board) && isSolved(board, puzzle.solution) && !isSolvedState) {
      handleWin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, puzzle.solution]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedCell || isPaused || isSolvedState) {
        return;
      }
      const [row, col] = selectedCell;
      if (fixed[row][col]) return;

      if (event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') {
        event.preventDefault();
        handleNumberInput(0);
        return;
      }

      const digit = Number(event.key);
      if (Number.isInteger(digit) && digit >= 1 && digit <= 9) {
        event.preventDefault();
        handleNumberInput(digit);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, fixed, isPaused, isSolvedState, handleNumberInput]);

  const handleNewGame = () => {
    const nextPuzzle = pickPuzzle();
    setPuzzle(nextPuzzle);
    setBoard(cloneBoard(nextPuzzle.startingBoard));
    setFixed(buildFixedMatrix(nextPuzzle.startingBoard));
    setConflicts(validateBoard(nextPuzzle.startingBoard));
    setSelectedCell(null);
    setMistakes(0);
    setElapsedMs(0);
    setIsRunning(true);
    setIsPaused(false);
    setIsSolvedState(false);
    setHistory([]);
    setRemainingHints(3);
    setNotes(createEmptyNotes());
    setIsPencilMode(false);
  };

  const handleClear = () => {
    setBoard(cloneBoard(puzzle.startingBoard));
    setConflicts(validateBoard(puzzle.startingBoard));
    setMistakes(0);
    setSelectedCell(null);
    setElapsedMs(0);
    setIsRunning(false);
    setIsSolvedState(false);
    setHistory([]);
    setRemainingHints(3);
    setNotes(createEmptyNotes());
    setIsPencilMode(false);
  };

  const handleHint = () => {
    if (isSolvedState || isPaused || remainingHints === 0) return;
    const empty = findEmptyCell(board);
    if (!empty) return;
    const [row, col] = empty;
    updateCell(row, col, puzzle.solution[row][col]);
    setRemainingHints((prev) => Math.max(prev - 1, 0));
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleUndo = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) {
        return prevHistory;
      }
      const nextHistory = prevHistory.slice(0, -1);
      const lastSnapshot = prevHistory[prevHistory.length - 1];
      const snapshotBoard = cloneBoard(lastSnapshot.board);
      setBoard(snapshotBoard);
      setConflicts(validateBoard(snapshotBoard));
      setMistakes(lastSnapshot.mistakes);
      setIsSolvedState(false);
      setSelectedCell(null);
      setNotes(cloneNotes(lastSnapshot.notes));
      return nextHistory;
    });
  };

  const handleSelectCell = (row: number, col: number) => {
    if (isPaused || isSolvedState) return;
    setSelectedCell([row, col]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sudoku</h1>
      </header>

      <StatusBar
        elapsedMs={elapsedMs}
        remaining={remainingCells}
        isSolved={isSolvedState}
      />

      <Board
        board={board}
        fixed={fixed}
        selected={selectedCell}
        conflicts={conflicts}
        notes={notes}
        onSelect={handleSelectCell}
      />

      <NumberPad
        counts={digitCounts}
        onInput={handleNumberInput}
        onClear={() => handleNumberInput(0)}
        onHint={handleHint}
        onTogglePencil={() => setIsPencilMode((prev) => !prev)}
        isPencilMode={isPencilMode}
        disabled={!selectedCell || isPaused || isSolvedState}
        hintDisabled={isSolvedState || isPaused || remainingHints === 0}
        remainingHints={remainingHints}
      />

      <Controls
        onNewGame={handleNewGame}
        onClear={handleClear}
        onTogglePause={handleTogglePause}
        onUndo={handleUndo}
        isPaused={isPaused}
        canUndo={history.length > 0}
      />

      <Leaderboard entries={leaderboard} />
      <footer>
        <small>
          Puzzle ID: {puzzle.id} · Difficulty: {puzzle.difficulty}
        </small>
      </footer>
    </div>
  );
};

export default App;
