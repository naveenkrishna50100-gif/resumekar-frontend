import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../lib/api';
import { useAuth } from '../lib/auth';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://cyiyumtetbzzqugtnuzw.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_nfc-31AcEQAxiZhRf3UuYg_W-KhSfK9';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await login(email, password);
      loginUser(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) throw error;
    } catch (err) {
      setError('Google login failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      setForgotSent(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Forgot password mode
  if (forgotMode) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f7f4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, background: '#1D9E75', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18, margin: '0 auto 12px' }}>R</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 6 }}>Reset password</h1>
            <p style={{ color: '#666', fontSize: 13 }}>We'll send you a reset link</p>
          </div>
          <div className="card">
            {forgotSent ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📧</div>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>Reset link sent!</div>
                <div style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>Check your email at <strong>{forgotEmail}</strong> and click the reset link.</div>
                <button className="btn btn-primary btn-full" onClick={() => { setForgotMode(false); setForgotSent(false); }}>Back to login</button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                {error && <div className="alert alert-error">{error}</div>}
                <div className="form-group">
                  <label className="form-label">Your email address</label>
                  <input className="form-input" type="email" placeholder="you@email.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                </div>
                <button className="btn btn-primary btn-full" type="submit" disabled={forgotLoading}>
                  {forgotLoading ? <><span className="spinner"></span> Sending...</> : 'Send reset link →'}
                </button>
                <button type="button" onClick={() => setForgotMode(false)} style={{ width: '100%', marginTop: 10, background: 'none', border: 'none', color: '#666', fontSize: 13, cursor: 'pointer', padding: '8px' }}>
                  ← Back to login
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, background: '#1D9E75', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18, margin: '0 auto 12px' }}>R</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: '#666', fontSize: 13 }}>Login to your ResumeKar account</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            style={{ width: '100%', padding: '10px', border: '1px solid #e8e6e0', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 14, fontWeight: 500, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}
          >
            {googleLoading ? (
              <span className="spinner"></span>
            ) : (
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.7-.4-4z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.5 35.5 26.9 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.5 39.5 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.2 5.2C40.9 35.2 44 30 44 24c0-1.3-.1-2.7-.4-4z"/>
              </svg>
            )}
            {googleLoading ? 'Redirecting...' : 'Continue with Google'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: '#e8e6e0' }}></div>
            <span style={{ fontSize: 12, color: '#999' }}>or login with email</span>
            <div style={{ flex: 1, height: 1, background: '#e8e6e0' }}></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <button type="button" onClick={() => setForgotMode(true)} style={{ background: 'none', border: 'none', color: '#1D9E75', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  Forgot password?
                </button>
              </div>
              <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? <><span className="spinner"></span> Logging in...</> : 'Login →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#666', marginTop: 20 }}>
          Don't have an account? <Link to="/signup" style={{ color: '#1D9E75', fontWeight: 500 }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
}
