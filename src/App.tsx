// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import BillSplitter from './components/BillSplitter.tsx';
// import GroupExpensePlanner from './components/ExpensePlanning.tsx';  
// import Leaderboard from './components/SocialAccountability.tsx';

// const App: React.FC = () => {
//   return (
//     <Router>
//       <div className="App">
//         <nav>
//           <ul>
//             <li>
//               <Link to="/">Bill Splitter</Link>
//             </li>
//             <li>
//               <Link to="/group-expense-planner">Group Expense Planner</Link>
//             </li>
//             <li>
//               <Link to="/leaderboard">Leaderboard</Link>
//             </li>
//           </ul>
//         </nav>

//         <Routes>
//           <Route path="/" element={<BillSplitter />} />
//           <Route path="/group-expense-planner" element={<GroupExpensePlanner />} />
//           <Route path="/leaderboard" element={<Leaderboard />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;

import React, { useState } from 'react';
import BillSplitter from './components/BillSplitter';
import ExpensePlanner from './components/ExpensePlanning';
import Leaderboard from './components/SocialAccountability';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>('bill-splitter');

  const renderSection = () => {
    switch (currentSection) {
      case 'bill-splitter':
        return <BillSplitter />;
      case 'expense-planner':
        return <ExpensePlanner />;
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return <BillSplitter />;
    }
  };

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentSection('bill-splitter')}>Bill Splitter</button>
        <button onClick={() => setCurrentSection('expense-planner')}>Expense Planner</button>
        <button onClick={() => setCurrentSection('leaderboard')}>Leaderboard</button>
      </nav>
      <div>{renderSection()}</div>
    </div>
  );
};

export default App;

