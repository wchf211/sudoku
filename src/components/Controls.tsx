interface ControlsProps {
  onNewGame: () => void;
  onClear: () => void;
  onTogglePause: () => void;
  onUndo: () => void;
  isPaused: boolean;
  canUndo: boolean;
}

const Controls = ({
  onNewGame,
  onClear,
  onTogglePause,
  onUndo,
  isPaused,
  canUndo,
}: ControlsProps) => (
  <div className="controls">
    <button type="button" onClick={onNewGame}>
      New Game
    </button>
    <button type="button" onClick={onClear}>
      Clear Board
    </button>
    <button type="button" onClick={onUndo} disabled={!canUndo}>
      Undo
    </button>
    <button type="button" onClick={onTogglePause}>
      {isPaused ? 'Resume' : 'Pause'}
    </button>
  </div>
);

export default Controls;
