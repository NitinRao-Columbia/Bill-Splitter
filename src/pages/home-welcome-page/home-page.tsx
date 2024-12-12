import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5001/me', {
          credentials: 'include'
        });
        if (!response.ok) {
          navigate('/login');
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to BillsWithFriends</h1>
      <p>Select an option below to get started:</p>
      <nav style={{ marginTop: '20px' }}>
        <Link
          to="/app/billsplitter"
          style={{ display: 'block', margin: '10px 0', textDecoration: 'none', fontSize: '18px' }}
        >
          Bill Splitter
        </Link>
        <Link
          to="/app/expenseplanner"
          style={{ display: 'block', margin: '10px 0', textDecoration: 'none', fontSize: '18px' }}
        >
          Expense Planner
        </Link>
        <Link
          to="/app/socialaccountability"
          style={{ display: 'block', margin: '10px 0', textDecoration: 'none', fontSize: '18px' }}
        >
          Social Accountability
        </Link>
        <Link
          to="/app/userlisting"
          style={{ display: 'block', margin: '10px 0', textDecoration: 'none', fontSize: '18px' }}
        >
          User Listing
        </Link>
      </nav>
    </div>
  );
};

export default Home;
