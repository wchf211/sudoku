export interface LeaderboardEntry {
  id: string;
  player: string;
  durationMs: number;
  mistakes: number;
  finishedAt: string;
  puzzleId: string;
}

const STORAGE_KEY = 'sudoku-leaderboard';

export const loadLeaderboard = (): LeaderboardEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.warn('Failed to load leaderboard', error);
    return [];
  }
};

export const saveLeaderboard = (entries: LeaderboardEntry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 10)));
  } catch (error) {
    console.warn('Failed to persist leaderboard', error);
  }
};
