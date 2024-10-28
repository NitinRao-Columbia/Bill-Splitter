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
