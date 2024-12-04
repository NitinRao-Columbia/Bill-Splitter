import React, { useState } from 'react';
import FileUpload from './Upload-Button'; // Adjust the import path as necessary
import './billsplitter.css'; // Assuming this is your CSS file

const BillSplitter: React.FC = () => {
  const [totalBill, setTotalBill] = useState<string>('');
  const [numPeople, setNumPeople] = useState<string>('');
  const [splitCost, setSplitCost] = useState<string>('');
  const billId = 'b1f01e23c4d24e1ea6d9a26b5f1556d7';  // Ensure this billId exists in your backend

  const handleSplitBill = async () => {
    const bill = parseFloat(totalBill);
    const people = parseInt(numPeople);

    if (bill > 0 && people > 0) {
      const costPerPerson = (bill / people).toFixed(2);

      try {
        const response = await fetch(`http://10.206.104.164:8000/bills/${billId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ total_amount: bill }),
        });

        if (response.ok) {
          setSplitCost(`Each person should pay: $${costPerPerson}`);
        } else {
          const errorData = await response.json();
          setSplitCost(`Error: ${errorData.detail || 'Failed to update the bill.'}`);
        }
      } catch (error) {
        setSplitCost('Error updating the bill. Please try again.');
      }
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
