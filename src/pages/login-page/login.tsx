import React from 'react';

const Login: React.FC = () => {
  const handleLogin = () => {
    // Redirect the user to the FastAPI login endpoint
    window.location.href = 'http://localhost:5001/login'; // FastAPI backend URL
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to BillsWithFriends</h1>
      <p>Please log in to continue:</p>
      <button
        onClick={handleLogin}
        style={{
          padding: '10px 20px',
          fontSize: '18px',
          cursor: 'pointer',
        }}
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;
