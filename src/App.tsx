import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import NavBar from './components/NavBar';
import BillSplitter from './pages/bill-splitter-page/BillSplitter';
import SocialAccountability from './pages/social-accountability-page/SocialAccountability';
import UserListing from './pages/users-listing-page/user-listing';
import LoginPage from './pages/login-page/login';
import HomePage from './pages/home-welcome-page/home-page';
import './App.css';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AuthCallback = () => {
  const { setIsAuthenticated, setUser } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        localStorage.setItem('jwt_token', token);

        // Verify token with the backend
        try {
          const response = await fetch('http://localhost:5001/verify-token', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setIsAuthenticated(true);
            setUser(data.user);

            // Redirect to home
            window.location.href = '/home';
          } else {
            throw new Error('Invalid token');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('jwt_token');
          setIsAuthenticated(false);
          setUser(null);

          // Redirect to login on failure
          window.location.href = '/login';
        }
      }
    };

    handleAuthCallback();
  }, [setIsAuthenticated, setUser]);

  return <div>Loading...</div>; // Temporary loading state
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5001/verify-token', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('jwt_token');
    }
  };

  const authContextValue: AuthContextType = {
    isAuthenticated,
    user,
    setIsAuthenticated,
    setUser,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <div className="app-container">
        <div className="app-title">
          <img
            src="/images/logo.png"
            alt="BillsWithFriends Logo"
            className="app-logo"
          />
          <h1 className="app-title-text">BillsWithFriends</h1>
        </div>
          {isAuthenticated && <NavBar />}
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/billsplitter" element={<ProtectedRoute><BillSplitter /></ProtectedRoute>} />
            <Route path="/socialaccountability" element={<ProtectedRoute><SocialAccountability /></ProtectedRoute>} />
            <Route path="/userlisting" element={<ProtectedRoute><UserListing /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
