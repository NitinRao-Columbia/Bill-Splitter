import React, { useState } from 'react';

const BillSplitter: React.FC = () => {
  const [totalBill, setTotalBill] = useState('');
  const [numPeople, setNumPeople] = useState('');

  return (
    <div>
      <h1>Bill Splitter</h1>
      <div>
        <input
          type="number"
          value={totalBill}
          onChange={(e) => setTotalBill(e.target.value)}
          placeholder="Total Bill"
          step="0.01"
        />
        <input
          type="number"
          value={numPeople}
          onChange={(e) => setNumPeople(e.target.value)}
          placeholder="Number of People"
        />
      </div>
      <div>
        <p>Bill Total: {totalBill || 'N/A'}</p>
        <p>Number of People: {numPeople || 'N/A'}</p>
      </div>
    </div>
  );
};

export default BillSplitter;
