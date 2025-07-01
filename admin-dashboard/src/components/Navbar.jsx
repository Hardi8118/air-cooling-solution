import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <nav style={{
      backgroundColor: '#1e90ff',
      padding: '15px 25px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#fff'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: 18 }}>
        Admin Dashboard
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={linkStyle}>🏠 Home</Link>
        <Link to="/orders" style={linkStyle}>📦 Orders</Link>
        <Link to="/users" style={linkStyle}>👤 Users</Link>
        <Link to="/statistics" style={linkStyle}>📊 Statistik</Link>
        <button onClick={handleLogout} style={{
          backgroundColor: 'red',
          color: '#fff',
          border: 'none',
          padding: '6px 12px',
          borderRadius: 5,
          cursor: 'pointer'
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: '500'
};
