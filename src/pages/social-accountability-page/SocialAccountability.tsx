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
    const normalizedPerson = person.toLowerCase();
    const contributionValue = parseFloat(contribution);
    setContributions((prevContributions) => {
      const existingIndex = prevContributions.findIndex((entry) => entry.person === normalizedPerson);
      if (existingIndex !== -1) {
        const updatedContributions = prevContributions.map((entry, index) =>
          index === existingIndex
            ? { ...entry, contribution: entry.contribution + contributionValue }
            : entry
        );
        return updatedContributions;
      }
      return [...prevContributions, { person: normalizedPerson, contribution: contributionValue }];
    });
    setPerson('');
    setContribution('');
  };

  const sortedContributions = contributions.sort((a, b) => b.contribution - a.contribution);

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
      <table className="contribution-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '0.5rem' }}>Rank</th>
            <th style={{ padding: '0.5rem' }}>Name</th>
            <th style={{ padding: '0.5rem' }}>Contribution</th>
          </tr>
        </thead>
        <tbody>
          {sortedContributions.map((entry, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '0.5rem' }}>{index + 1}</td>
              <td style={{ padding: '0.5rem' }}>{entry.person}</td>
              <td style={{ padding: '0.5rem' }}>${entry.contribution.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SocialAccountability;