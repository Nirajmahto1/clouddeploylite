import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (token) {
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else if (error) {
      // Handle error
      console.error('Auth error:', error);
      setTimeout(() => {
        navigate('/login?error=' + error);
      }, 2000);
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div className="spinner" />
      <p>Authenticating...</p>
    </div>
  );
}

export default AuthCallback;