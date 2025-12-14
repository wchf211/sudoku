interface StatusBarProps {
  elapsedMs: number;
  remaining: number;
  isSolved: boolean;
}

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const StatusBar = ({ elapsedMs, remaining, isSolved }: StatusBarProps) => (
  <div className="status-bar">
    <span>⏱ {formatTime(elapsedMs)}</span>
    <span>Cells: {remaining}</span>
    {isSolved && <span className="status-success">Completed!</span>}
  </div>
);

export default StatusBar;
