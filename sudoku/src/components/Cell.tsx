import type { CellKey } from '../lib/sudoku';

interface CellProps {
  value: number;
  fixed: boolean;
  selected: boolean;
  highlighted: boolean;
  conflict: boolean;
  alternateBackground: boolean;
  blockTop: boolean;
  blockLeft: boolean;
  blockBottom: boolean;
  blockRight: boolean;
  notes: boolean[];
  onClick: () => void;
}

const Cell = ({
  value,
  fixed,
  selected,
  highlighted,
  conflict,
  alternateBackground,
  blockTop,
  blockLeft,
  blockBottom,
  blockRight,
  notes,
  onClick,
}: CellProps) => {
  const classNames = ['cell'];
  if (alternateBackground) classNames.push('cell-box-alt');
  if (fixed) classNames.push('cell-fixed');
  if (selected) classNames.push('cell-selected');
  if (highlighted) classNames.push('cell-highlight');
  if (conflict) classNames.push('cell-conflict');
  if (blockTop) classNames.push('cell-block-top');
  if (blockLeft) classNames.push('cell-block-left');
  if (blockBottom) classNames.push('cell-block-bottom');
  if (blockRight) classNames.push('cell-block-right');
  const hasNotes = value === 0 && notes.some((active, index) => index > 0 && active);

  return (
    <button className={classNames.join(' ')} onClick={onClick} type="button">
      {value === 0 ? (
        hasNotes ? (
          <div className="cell-notes">
            {Array.from({ length: 9 }, (_, idx) => {
              const digit = idx + 1;
              const active = notes[digit];
              return (
                <span key={digit} className={active ? 'cell-note-active' : 'cell-note'}>
                  {active ? digit : ''}
                </span>
              );
            })}
          </div>
        ) : (
          ''
        )
      ) : (
        value
      )}
    </button>
  );
};

export type { CellKey };
export default Cell;
