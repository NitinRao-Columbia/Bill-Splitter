import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/login-page/login';
import Home from './pages/home-welcome-page/home-page';
import BillSplitter from './pages/bill-splitter-page/BillSplitter';
import ExpensePlanner from './pages/expense-planning-page/ExpensePlanning';
import SocialAccountability from './pages/social-accountability-page/SocialAccountability';
import UserListing from './pages/users-listing-page/user-listing';
import './App.css';
import { useEffect, useState } from 'react';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:5001/oauth2/callback', {
          credentials: 'include', // Include cookies for session handling
        });
        if (response.ok) {
          setIsAuthenticated(true); // User is authenticated
        } else {
          setIsAuthenticated(false); // User is not authenticated
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <Router>
      {isAuthenticated && <NavBar />}
      <Routes>
        {/* Redirect to login if not authenticated */}
        <Route
          path="/"
          element={!isAuthenticated ? <Navigate to="/login" /> : <Navigate to="/home" />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        {/* Protected routes for main app */}
        <Route
          path="/app/billsplitter"
          element={isAuthenticated ? <BillSplitter /> : <Navigate to="/login" />}
        />
        <Route
          path="/app/expenseplanner"
          element={isAuthenticated ? <ExpensePlanner /> : <Navigate to="/login" />}
        />
        <Route
          path="/app/socialaccountability"
          element={isAuthenticated ? <SocialAccountability /> : <Navigate to="/login" />}
        />
        <Route
          path="/app/userlisting"
          element={isAuthenticated ? <UserListing /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
