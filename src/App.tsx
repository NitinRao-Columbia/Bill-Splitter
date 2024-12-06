import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/NavBar';
import { Routes, Route } from 'react-router-dom';
import BillSplitter from './pages/bill-splitter-page/BillSplitter';
import ExpensePlanner from './pages/expense-planning-page/ExpensePlanning';
import SocialAccountability from './pages/social-accountability-page/SocialAccountability';
import UserListing from './pages/users_listing_page/user_listing';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-title">
        <h1>BillsWithFriends</h1>
      </div>
      <NavBar />
      <Routes>
        <Route path="/billsplitter" element={<BillSplitter />} />
        <Route path="/expenseplanner" element={<ExpensePlanner />} />
        <Route path="/socialaccountability" element={<SocialAccountability />} />
        <Route path="/userlisting" element={<UserListing />} /> {/* Add this */}
      </Routes>
    </Router>
  );
};

export default App;
