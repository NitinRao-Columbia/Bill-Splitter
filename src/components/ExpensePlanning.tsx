import React from 'react';

interface EventExpense {
  event: string;
  participants: {
    name: string;
    amount: number;
  }[];
}

const GroupExpensePlanner: React.FC = () => {
  // Hardcoded list of events with participants and their contributions
  const expenses: EventExpense[] = [
    {
      event: 'Dinner',
      participants: [
        { name: 'Phoebe', amount: 50.75 },
        { name: 'Nitin', amount: 40.25 },
        { name: 'Arin', amount: 30.00 },
      ],
    },
    {
      event: 'Hotel',
      participants: [
        { name: 'Jordyn', amount: 150.00 },
        { name: 'Aidan', amount: 120.50 },
        { name: 'Eva', amount: 89.99 },
      ],
    },
    {
      event: 'Transport',
      participants: [
        { name: 'Phoebe', amount: 60.00 },
        { name: 'Lizzie', amount: 45.75 },
      ],
    },
    {
      event: 'Concert Tickets',
      participants: [
        { name: 'Arin', amount: 75.00 },
        { name: 'Nitin', amount: 60.00 },
      ],
    },
  ];

  return (
    <div>
      <h1>Group Expense Planner</h1>
      {expenses.map((expenseEvent, index) => (
        <div key={index}>
          <h2>{expenseEvent.event}</h2>
          <ul>
            {expenseEvent.participants.map((participant, idx) => (
              <li key={idx}>
                {participant.name}: ${participant.amount.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default GroupExpensePlanner;
