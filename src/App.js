
import React, { useState } from 'react';

function App() {
  const [section, setSection] = useState('bill-splitter');
  const [totalBill, setTotalBill] = useState('');
  const [numPeople, setNumPeople] = useState('');
  const [result, setResult] = useState('');

  // Function to handle showing and hiding sections
  const showSection = (sectionId) => {
    setSection(sectionId);
  };

  // Split bill function
  const splitBill = async () => {
    const response = await fetch('http://localhost:8000/split-bill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        total_bill: parseFloat(totalBill),
        number_of_people: parseInt(numPeople),
      }),
    });

    const data = await response.json();
    setResult(`Each person should pay: $${data.per_person}`);
  };

  return (
    <div>
      <nav>
        <a onClick={() => showSection('bill-splitter')}>Bill Splitter</a>
        <a onClick={() => showSection('expense-planner')}>Expense Planner</a>
        <a onClick={() => showSection('leaderboard')}>Leaderboard</a>
      </nav>

      {/* Bill Splitter Section */}
      {section === 'bill-splitter' && (
        <div>
          <h1>Bill Splitter</h1>
          <p>Enter the total bill and the number of people to split the bill.</p>
          <div>
            <label htmlFor="total-bill">Total Bill: </label>
            <input
              type="number"
              id="total-bill"
              placeholder="Total Bill"
              step="0.01"
              value={totalBill}
              onChange={(e) => setTotalBill(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="num-people">Number of People: </label>
            <input
              type="number"
              id="num-people"
              placeholder="Number of People"
              value={numPeople}
              onChange={(e) => setNumPeople(e.target.value)}
            />
          </div>
          <button onClick={splitBill}>Split Bill</button>
          {result && <div className="result">{result}</div>}
        </div>
      )}

      {/* Expense Planner Section */}
      {section === 'expense-planner' && (
        <div>
          <h1>Group Expense Planner</h1>
          <ul>
            <li>Dinner - Phoebe: $50.75, Nitin: $40.25, Arin: $30.00</li>
            <li>Hotel - Jordyn: $150.00, Lizzie: $120.50, Aiden: $89.99</li>
            <li>Transport - Eva: $60.00, Phoebe: $45.75</li>
            <li>Concert Tickets - Nitin: $75.00, Arin: $60.00</li>
          </ul>
        </div>
      )}

      {/* Leaderboard Section */}
      {section === 'leaderboard' && (
        <div>
          <h1>Leaderboard</h1>
          <ul>
            <li>Phoebe - $150.75</li>
            <li>Arin - $90.30</li>
            <li>Nitin - $60.99</li>
            <li>Jordyn - $120.40</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
