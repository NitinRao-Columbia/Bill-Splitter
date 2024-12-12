import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './Upload-Button';

// Define an interface for the receipt item
interface ReceiptItem {
  item_name: string;
  price: number;
  quantity: number;
}

const BillSplitter: React.FC = () => {
  const [totalBill, setTotalBill] = useState('');
  const [numPeople, setNumPeople] = useState('');
  const [splitCost, setSplitCost] = useState('');
  const [receiptDetails, setReceiptDetails] = useState<ReceiptItem[]>([]);
  const [error, setError] = useState('');
  const billId = 'b1f01e23c4d24e1ea6d9a26b5f1556d7';

  const [email, setEmail] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);

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
      const response = await axios.get<ReceiptItem[]>(`http://3.137.160.197:8000/bills/${billId}/items`);
      if (response.data && response.data.length > 0) {
        setReceiptDetails(response.data);
      } else {
        throw new Error('No receipt details available');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`Failed to fetch receipt details: ${error.message}`);
      } else {
        setError('Failed to fetch receipt details');
      }
    }
  };

  const handleAddParticipant = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    try {
      const response = await axios.post(
        `http://3.137.160.197:8000/bills/${billId}/participants`,
        { email: email }
      );
      
      if (response.status === 200) {
        setParticipants([...participants, email]);
        setEmail(''); // Clear input after successful addition
        setError('');
      }
    } catch (error) {
      setError('Failed to add participant');
      console.error(error);
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

    <div style={{ marginTop: '2rem' }}>
    <h3>Add Participants</h3>
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor="participant-email">Participant Email:</label>
      <input
        type="email"
        id="participant-email"
        placeholder="Enter email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button 
        onClick={handleAddParticipant}
        className="btn"
        style={{ marginLeft: '0.5rem' }}
      >
        Add Participant
      </button>
    </div>

    {participants.length > 0 && (
      <div>
        <h4>Current Participants:</h4>
        <ul>
          {participants.map((participant, index) => (
            <li key={index}>{participant}</li>
          ))}
        </ul>
      </div>
    )}
    </div>
    </div>
  );
};

export default BillSplitter;