import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './Upload-Button';

const BillSplitter: React.FC = () => {
  const [totalBill, setTotalBill] = useState('');
  const [numPeople, setNumPeople] = useState('');
  const [splitCost, setSplitCost] = useState('');
  const [receiptDetails, setReceiptDetails] = useState([]);
  const [error, setError] = useState('');
  const billId = 'b1f01e23c4d24e1ea6d9a26b5f1556d7';

  const handleSplitBill = async () => {
    const bill = parseFloat(totalBill);
    const people = parseInt(numPeople);
    if (bill > 0 && people > 0) {
      const costPerPerson = (bill / people).toFixed(2);
      try {
        const response = await axios.put(`http://3.137.160.197:8000/bills/${billId}`, { total_amount: bill });
        if (response.status === 200) {
          setSplitCost(`Each person should pay: $${costPerPerson}`);
        } else {
          setSplitCost('Error: Failed to update the bill.');
        }
      } catch (error) {
        setSplitCost('Error updating the bill. Please try again.');
        console.error(error);
      }
    } else {
      setSplitCost('Please enter valid numbers for total bill and number of people.');
    }
  };

  const fetchReceiptDetails = async () => {
    try {
      const response = await axios.get(`http://3.137.160.197:8000/bills/${billId}/items`);
      if (response.data && response.data.length > 0) {
        setReceiptDetails(response.data);
      } else {
        throw new Error('No receipt details available');
      }
    } catch (error) {
      setError(`Failed to fetch receipt details: ${error.message || 'Failed to fetch receipt details'}`);
    }
  };

  return (
    <div className="centered-content">
      <h1>Bill Splitter</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="total-bill">Total Bill:</label>
        <input type="number" id="total-bill" placeholder="Total Bill" step="0.01" value={totalBill} onChange={e => setTotalBill(e.target.value)} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="num-people">Number of People:</label>
        <input type="number" id="num-people" placeholder="Number of People" value={numPeople} onChange={e => setNumPeople(e.target.value)} />
      </div>
      <button onClick={handleSplitBill} className="btn" style={{ marginTop: '1rem' }}>Split Bill</button>
      {splitCost && <div className="result" style={{ marginTop: '1rem' }}>{splitCost}</div>}
      <hr />

      <FileUpload billId={billId} onUploadSuccess={fetchReceiptDetails} />

      {error && <div className="error">{error}</div>}
      {receiptDetails.length > 0 && (
        <div>
          <h3>Receipt Details</h3>
          <ul>
            {receiptDetails.map((item, index) => (
              <li key={index}>{item.item_name}: ${item.price} x {item.quantity}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BillSplitter;
