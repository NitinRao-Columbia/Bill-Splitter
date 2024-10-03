import React from 'react';

interface Friend {
  name: string;
  amountPaid: number;
}

const SocialAccountability: React.FC = () => {
  // Hardcoded list of friends and the amount they've paid
  const leaderboardData: Friend[] = [
    { name: 'Phoebe', amountPaid: 150.75 },
    { name: 'Nitin', amountPaid: 90.30 },
    { name: 'Arin', amountPaid: 60.99 },
    { name: 'Jordyn', amountPaid: 120.40 }
  ];

  return (
    <div>
      <h1>Social Accountability Leaderboard</h1>
      <ul>
        {leaderboardData.map((friend, index) => (
          <li key={index}>
            {friend.name}: ${friend.amountPaid.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialAccountability;
