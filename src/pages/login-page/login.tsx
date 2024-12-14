import React from 'react';
import './login.css';

const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5001/login';
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome to BillsWithFriends</h2>
          <p className="mt-2 text-sm text-gray-600">Please sign in to continue</p>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="login-button"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
