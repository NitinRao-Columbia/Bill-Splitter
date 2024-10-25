// import React from 'react';

// interface Friend {
//   name: string;
//   amountPaid: number;
// }

// const SocialAccountability: React.FC = () => {
//   // Hardcoded list of friends and the amount they've paid
//   const leaderboardData: Friend[] = [
//     { name: 'Phoebe', amountPaid: 150.75 },
//     { name: 'Nitin', amountPaid: 90.30 },
//     { name: 'Arin', amountPaid: 60.99 },
//     { name: 'Jordyn', amountPaid: 120.40 }
//   ];

//   return (
//     <div>
//       <h1>Social Accountability Leaderboard</h1>
//       <ul>
//         {leaderboardData.map((friend, index) => (
//           <li key={index}>
//             {friend.name}: ${friend.amountPaid.toFixed(2)}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SocialAccountability;


import React, { useState } from 'react';

interface Contribution {
  person: string;
  contribution: number;
}

const SocialAccountability: React.FC = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [person, setPerson] = useState<string>('');
  const [contribution, setContribution] = useState<string>('');

  const addContribution = () => {
    if (!person || !contribution) return;
    const newContribution = {
      person,
      contribution: parseFloat(contribution),
    };
    setContributions([...contributions, newContribution]);
    setPerson('');
    setContribution('');
  };

  return (
    <div>
      <h2>Social Accountability</h2>
      <div>
        <input
          type="text"
          placeholder="Person's name"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
        />
        <input
          type="number"
          placeholder="Contribution"
          value={contribution}
          onChange={(e) => setContribution(e.target.value)}
        />
        <button onClick={addContribution}>Add Contribution</button>
      </div>
      <ul>
        {contributions.map((entry, index) => (
          <li key={index}>
            {entry.person} - ${entry.contribution.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialAccountability;
