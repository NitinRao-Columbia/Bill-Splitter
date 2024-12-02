import React, { useState } from 'react';
import FileUpload from './Upload-Button'; // Adjust the import path as necessary
import './billsplitter.css'; // Assuming this is your CSS file

const BillSplitter: React.FC = () => {
  const [totalBill, setTotalBill] = useState<string>('');
  const [numPeople, setNumPeople] = useState<string>('');
  const [splitCost, setSplitCost] = useState<string>('');
  const billId = '1'; // Example bill ID, can be dynamic

  const handleSplitBill = () => {
    const bill = parseFloat(totalBill);
    const people = parseInt(numPeople);

    if (bill > 0 && people > 0) {
      const costPerPerson = (bill / people).toFixed(2);
      setSplitCost(`Each person should pay: $${costPerPerson}`);
    } else {
      setSplitCost('Please enter valid numbers for total bill and number of people.');
    }
  };

  return (
    <div className="centered-content">
      <h1>Bill Splitter</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="total-bill">Total Bill:</label>
        <input
          type="number"
          id="total-bill"
          placeholder="Total Bill"
          step="0.01"
          value={totalBill}
          onChange={(e) => setTotalBill(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="num-people">Number of People:</label>
        <input
          type="number"
          id="num-people"
          placeholder="Number of People"
          value={numPeople}
          onChange={(e) => setNumPeople(e.target.value)}
        />
      </div>
      <button onClick={handleSplitBill} className="btn" style={{ marginTop: '1rem' }}>
        Split Bill
      </button>
      {splitCost && <div className="result" style={{ marginTop: '1rem' }}>{splitCost}</div>}

      <hr />

      {/* Integrate the FileUpload Component */}
      <FileUpload billId={billId} />
    </div>
  );
};

export default BillSplitter;