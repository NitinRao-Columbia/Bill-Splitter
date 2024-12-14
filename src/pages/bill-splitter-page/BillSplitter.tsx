import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './Upload-Button';

// Define an interface for the receipt item
interface ReceiptItem {
  id: string; // Item ID must match what is used in the backend
  item_name: string;
  price: number;
  quantity: number;
  paid?: boolean; // Optional property to track if the item is paid
}

const BillSplitter: React.FC = () => {
  const [totalBill, setTotalBill] = useState('');
  const [numPeople, setNumPeople] = useState('');
  const [splitCost, setSplitCost] = useState('');
  const [receiptDetails, setReceiptDetails] = useState<ReceiptItem[]>([]);
  const [error, setError] = useState('');
  const billId = 'b1f01e23c4d24e1ea6d9a26b5f1556d7'; // Static ID for demonstration

  const [email, setEmail] = useState(''); // State to hold the email input
  const [participants, setParticipants] = useState<string[]>([]); // List of participants
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const handleAddParticipant = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    try {
      const response = await axios.post(
        `http://3.137.160.197:8000/bills/${billId}/participants/${encodeURIComponent(email)}`,
        { email: email }
      );

      if (response.status === 201) {
        setParticipants([...participants, email]);
        setEmail(''); // Clear input after successful addition
        setError('');
        setConfirmationMessage(`Participant ${email} has been successfully added to the bill!`); // Show confirmation
        setTimeout(() => setConfirmationMessage(''), 3000); // Clear message after 3 seconds
      }
    } catch (error) {
      setError('Failed to add participant');
      console.error(error);
    }
  };

  const handlePayItem = async (itemId: string) => {
    try {
      const response = await axios.post(
        `http://3.137.160.197:8000/bills/${billId}/items/287/pay`,
        {
          user_id: '9f8ae3f2e2c54eeb995c5531c770498a', // Replace with the actual user ID if available
        }
      );

      if (response.status === 200) {
        alert('Item marked as paid successfully!');

        // Update the local state to mark the item as paid
        setReceiptDetails((prevDetails) =>
          prevDetails.map((item) =>
            item.id === itemId ? { ...item, paid: true } : item
          )
        );
      } else {
        alert(`Failed to mark item as paid: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error marking item as paid:', error);
      alert('Failed to mark item as paid. Please try again.');
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
      <button onClick={() => console.log('Splitting logic here')} className="btn" style={{ marginTop: '1rem' }}>
        Split Bill
      </button>
      {splitCost && <div className="result" style={{ marginTop: '1rem' }}>{splitCost}</div>}
      <hr />

      <FileUpload billId={billId} onUploadSuccess={fetchReceiptDetails} />

      {error && <div className="error">{error}</div>}
      {receiptDetails.length > 0 && (
        <div>
          <h3>Receipt Details</h3>
          <ul>
            {receiptDetails.map((item) => (
              <li key={item.id}>
                {item.item_name}: ${item.price} x {item.quantity}
                {item.paid ? (
                  <span style={{ color: 'green', marginLeft: '1rem' }}>Paid</span>
                ) : (
                  <button
                    onClick={() => handlePayItem(item.id)}
                    style={{ marginLeft: '1rem' }}
                  >
                    Pay
                  </button>
                )}
              </li>
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
            onChange={(e) => setEmail(e.target.value)}
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
        {confirmationMessage && <div className="success">{confirmationMessage}</div>}
      </div>
    </div>
  );
};

export default BillSplitter;