import React, { useState } from 'react';
import './socialaccountability.css';

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
    <div className="centered-content">
      <h2>Social Accountability</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Person's name"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <input
          type="number"
          placeholder="Contribution"
          value={contribution}
          onChange={(e) => setContribution(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <button onClick={addContribution} className="btn">
          Add Contribution
        </button>
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
