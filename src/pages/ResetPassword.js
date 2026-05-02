import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://cyiyumtetbzzqugtnuzw.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_nfc-31AcEQAxiZhRf3UuYg_W-KhSfK9';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }

    setLoading(true); setError('');
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, background: '#1D9E75', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18, margin: '0 auto 12px' }}>R</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 6 }}>Set new password</h1>
          <p style={{ color: '#666', fontSize: 13 }}>Choose a strong password for your account</p>
        </div>

        <div className="card">
          {success ? (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>Password updated!</div>
              <div style={{ fontSize: 13, color: '#666' }}>Redirecting you to login...</div>
            </div>
          ) : (
            <form onSubmit={handleReset}>
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-group">
                <label className="form-label">New password</label>
                <input className="form-input" type="password" placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm new password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  style={{ borderColor: confirmPassword && password !== confirmPassword ? '#A32D2D' : '' }}
                />
                {confirmPassword && password !== confirmPassword && (
                  <div style={{ fontSize: 11, color: '#A32D2D', marginTop: 4 }}>Passwords do not match</div>
                )}
              </div>
              <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                {loading ? <><span className="spinner"></span> Updating...</> : 'Update password →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
