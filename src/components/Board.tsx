import Cell from './Cell';
import type { CellKey } from '../lib/sudoku';

interface BoardProps {
  board: number[][];
  fixed: boolean[][];
  selected: [number, number] | null;
  conflicts: Set<CellKey>;
  notes: boolean[][][];
  onSelect: (row: number, col: number) => void;
}

const Board = ({ board, fixed, selected, conflicts, notes, onSelect }: BoardProps) => {
  const selectedValue = selected ? board[selected[0]][selected[1]] : null;

  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          const key = `${rowIndex}-${colIndex}` as CellKey;
          const isSelected = selected?.[0] === rowIndex && selected?.[1] === colIndex;
          const shareRow = selected?.[0] === rowIndex;
          const shareCol = selected?.[1] === colIndex;
          const shareValue = selectedValue && value === selectedValue && value !== 0;
          const isHighlighted = (!isSelected && (shareRow || shareCol || shareValue)) ?? false;
          const boxRow = Math.floor(rowIndex / 3);
          const boxCol = Math.floor(colIndex / 3);
          const inAlternateBox = (boxRow + boxCol) % 2 === 0;
          const blockTop = rowIndex % 3 === 0;
          const blockLeft = colIndex % 3 === 0;
          const blockBottom = rowIndex % 3 === 2 || rowIndex === 8;
          const blockRight = colIndex % 3 === 2 || colIndex === 8;

          return (
            <Cell
              key={key}
              value={value}
              fixed={fixed[rowIndex][colIndex]}
              selected={isSelected}
              highlighted={Boolean(isHighlighted)}
              conflict={conflicts.has(key)}
              alternateBackground={inAlternateBox}
              blockTop={blockTop}
              blockLeft={blockLeft}
              blockBottom={blockBottom}
              blockRight={blockRight}
              notes={notes[rowIndex][colIndex]}
              onClick={() => onSelect(rowIndex, colIndex)}
            />
          );
        }),
      )}
    </div>
  );
};

export default Board;
