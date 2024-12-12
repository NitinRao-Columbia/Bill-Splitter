import React, { useEffect, useState } from 'react';
import './socialaccountability.css';

interface LeaderboardEntry {
  user_id: string;
  first_name: string;
  last_name: string;
  points: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch leaderboard data from the backend
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://18.220.217.116:8002/leaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data = await response.json();
        setLeaderboard(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇'; // Gold medal
    if (rank === 2) return '🥈'; // Silver medal
    if (rank === 3) return '🥉'; // Bronze medal
    return `${rank}`; // Default: rank number for others
  };

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="centered-content">
      <h2 className="leaderboard-title">LEADERBOARD</h2>
      <table className="contribution-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '0.5rem' }}>Rank</th>
            <th style={{ padding: '0.5rem' }}>Name</th>
            <th style={{ padding: '0.5rem' }}>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry.user_id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '0.5rem' }}>{getRankEmoji(index + 1)}</td>
              <td style={{ padding: '0.5rem' }}>{`${entry.first_name} ${entry.last_name}`}</td>
              <td style={{ padding: '0.5rem' }}>{entry.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
