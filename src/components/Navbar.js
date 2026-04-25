import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/evaluate', label: 'Evaluate Job' },
    { to: '/profile', label: 'Profile & CV' },
    { to: '/pricing', label: 'Upgrade' },
  ];

  return (
    <nav style={{
      background: '#fff', borderBottom: '1px solid #e8e6e0',
      padding: '0 2rem', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: 58, position: 'sticky',
      top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
    }}>
      <Link to={user ? '/dashboard' : '/'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 28, height: 28, background: '#1D9E75', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14 }}>R</div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 500, color: '#1a1a1a' }}>ResumeKar</span>
      </Link>

      {user && (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 13, textDecoration: 'none',
              color: location.pathname === link.to ? '#0F6E56' : '#666',
              background: location.pathname === link.to ? '#E1F5EE' : 'transparent',
              fontWeight: location.pathname === link.to ? 500 : 400,
              transition: 'all 0.15s'
            }}>{link.label}</Link>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <>
            {profile?.plan === 'pro' && (
              <span className="pill pill-green" style={{ fontSize: 11 }}>Pro</span>
            )}
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#0F6E56' }}>
              {(user.name || user.email || 'U')[0].toUpperCase()}
            </div>
            <button className="btn btn-sm" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-sm">Login</Link>
            <Link to="/signup" className="btn btn-sm btn-primary">Get started free</Link>
          </>
        )}
      </div>
    </nav>
  );
}
