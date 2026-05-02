import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showReport, setShowReport] = useState(false);
  const [reportMsg, setReportMsg] = useState('');
  const [reportSent, setReportSent] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/evaluate', label: 'Evaluate Job' },
    { to: '/profile', label: 'Profile & CV' },
    { to: '/pricing', label: 'Upgrade' },
  ];

  const handleReportSubmit = () => {
    if (!reportMsg.trim()) return;
    const subject = encodeURIComponent('ResumeKar — Problem Report');
    const body = encodeURIComponent(
      `User: ${user?.email || 'Unknown'}\nPage: ${window.location.href}\n\nProblem:\n${reportMsg}`
    );
    window.open(`mailto:naveenkrishna50100@gmail.com?subject=${subject}&body=${body}`);
    setReportSent(true);
    setTimeout(() => {
      setShowReport(false);
      setReportSent(false);
      setReportMsg('');
    }, 2000);
  };

  return (
    <>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <>
              {/* Report a Problem button */}
              <button
                onClick={() => setShowReport(true)}
                style={{ background: 'none', border: '1px solid #e8e6e0', borderRadius: 8, padding: '5px 10px', fontSize: 12, color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'DM Sans', sans-serif" }}
              >
                🐛 Report
              </button>

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

      {/* Report a Problem Modal */}
      {showReport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>🐛 Report a problem</div>
              <button onClick={() => setShowReport(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#666', lineHeight: 1 }}>×</button>
            </div>

            {reportSent ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                <div style={{ fontWeight: 500 }}>Thanks for reporting!</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>We'll fix it ASAP.</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 13, color: '#666', marginBottom: '1rem' }}>
                  Describe what went wrong and we'll fix it as soon as possible.
                </div>
                <div className="form-group">
                  <label className="form-label">What happened?</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder="e.g. PDF download not working, evaluation stuck loading, resume showing wrong name..."
                    value={reportMsg}
                    onChange={e => setReportMsg(e.target.value)}
                  />
                </div>
                <div style={{ fontSize: 11, color: '#999', marginBottom: '1rem' }}>
                  Your email ({user?.email}) and current page will be included automatically.
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleReportSubmit} disabled={!reportMsg.trim()}>
                    Send report →
                  </button>
                  <button className="btn" onClick={() => setShowReport(false)}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
