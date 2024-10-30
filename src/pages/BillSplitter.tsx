

// import React, { useState } from 'react';
// import '../App.css'; // Import global CSS for centered-content

// const BillSplitter: React.FC = () => {
//   const [totalBill, setTotalBill] = useState<string>('');
//   const [numPeople, setNumPeople] = useState<string>('');
//   const [splitCost, setSplitCost] = useState<string>('');

//   const handleSplitBill = () => {
//     const bill = parseFloat(totalBill);
//     const people = parseInt(numPeople);

//     if (bill > 0 && people > 0) {
//       const costPerPerson = (bill / people).toFixed(2);
//       setSplitCost(`Each person should pay: $${costPerPerson}`);
//     } else {
//       setSplitCost('Please enter valid numbers for total bill and number of people.');
//     }
//   };

//   return (
//     <div className="centered-content">
//       <h1>Bill Splitter</h1>
//       <div>
//         <label htmlFor="total-bill">Total Bill:</label>
//         <input
//           type="number"
//           id="total-bill"
//           placeholder="Total Bill"
//           step="0.01"
//           value={totalBill}
//           onChange={(e) => setTotalBill(e.target.value)}
//         />
//       </div>
//       <div>
//         <label htmlFor="num-people">Number of People:</label>
//         <input
//           type="number"
//           id="num-people"
//           placeholder="Number of People"
//           value={numPeople}
//           onChange={(e) => setNumPeople(e.target.value)}
//         />
//       </div>
//       <button onClick={handleSplitBill} className="btn">Split Bill</button>
//       {splitCost && <div className="result">{splitCost}</div>}
//     </div>
//   );
// };

// export default BillSplitter;

import React, { useState } from 'react';
import '../App.css';

const BillSplitter: React.FC = () => {
  const [totalBill, setTotalBill] = useState<string>('');
  const [numPeople, setNumPeople] = useState<string>('');
  const [splitCost, setSplitCost] = useState<string>('');

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
      <div style={{ marginBottom: '1rem' }}>  {/* Add margin here */}
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
      <div style={{ marginBottom: '1rem' }}> {/* Add margin here */}
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
    </div>
  );
};

export default BillSplitter;

// Possible help with front end to flask integration
// // BillSplitter.tsx - Update to integrate with Flask API using Axios
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// interface Bill {
//   id: string;
//   user_id: string;
//   total: number;
//   items: Array<{ item_id: string; cost: number; quantity: number }>;
// }

// const BillSplitter: React.FC = () => {
//   const [bills, setBills] = useState<Bill[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     // Fetch all bills when the component mounts
//     axios.get('http://localhost:5000/bills')
//       .then(response => {
//         setBills(response.data);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('There was an error fetching the bills!', error);
//         setLoading(false);
//       });
//   }, []);

//   const handleAddBill = () => {
//     // Example for adding a new bill
//     const newBill = { user_id: 'user123', total: 0, items: [] };
//     axios.post('http://localhost:5000/bills', newBill)
//       .then(response => {
//         setBills(prevBills => [...prevBills, { ...newBill, id: response.data.id }]);
//       })
//       .catch(error => {
//         console.error('There was an error creating the bill!', error);
//       });
//   };

//   return (
//     <div>
//       <h1>Bill Splitter</h1>
//       {loading ? (
//         <p>Loading bills...</p>
//       ) : (
//         <div>
//           {bills.map((bill) => (
//             <div key={bill.id}>
//               <h3>Bill ID: {bill.id}</h3>
//               <p>User ID: {bill.user_id}</p>
//               <p>Total: {bill.total}</p>
//             </div>
//           ))}
//         </div>
//       )}
//       <button onClick={handleAddBill}>Add Bill</button>
//     </div>
//   );
// };

// export default BillSplitter;
