import type { LeaderboardEntry } from '../lib/storage';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const Leaderboard = ({ entries }: LeaderboardProps) => (
  <section className="leaderboard">
    <h2>Leaderboard</h2>
    {entries.length === 0 ? (
      <p>No finished games yet.</p>
    ) : (
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Time</th>
            <th>Mistakes</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.player}</td>
              <td>{formatTime(entry.durationMs)}</td>
              <td>{entry.mistakes}</td>
              <td>{new Date(entry.finishedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </section>
);

export default Leaderboard;
