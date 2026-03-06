import React from 'react';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>CloudDeployLite</h1>
        <div className="user-info">
          <img src={user?.avatar_url} alt={user?.username} />
          <span>{user?.username}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        <h2>Welcome, {user?.username}! 👋</h2>
        <p>Your apps will appear here.</p>
        <p className="coming-soon">(Dashboard coming in Phase 2...)</p>
      </main>
    </div>
  );
}

export default DashboardPage;