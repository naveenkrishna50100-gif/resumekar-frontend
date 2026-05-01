import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup, login } from '../lib/api';
import { useAuth } from '../lib/auth';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://cyiyumtetbzzqugtnuzw.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_nfc-31AcEQAxiZhRf3UuYg_W-KhSfK9';

export default function Signup() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(form.fullName, form.email, form.password);
      const res = await login(form.email, form.password);
      loginUser(res.data.token, res.data.user);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (err) {
      setError('Google signup failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, background: '#1D9E75', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18, margin: '0 auto 12px' }}>R</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 6 }}>Create your account</h1>
          <p style={{ color: '#666', fontSize: 13 }}>Free — 3 evaluations per month</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
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
            <span style={{ fontSize: 12, color: '#999' }}>or sign up with email</span>
            <div style={{ flex: 1, height: 1, background: '#e8e6e0' }}></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className="form-input" type="text" placeholder="Your full name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={8} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                required
                style={{ borderColor: form.confirmPassword && form.password !== form.confirmPassword ? '#A32D2D' : '' }}
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <div style={{ fontSize: 11, color: '#A32D2D', marginTop: 4 }}>Passwords do not match</div>
              )}
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? <><span className="spinner"></span> Creating account...</> : 'Create free account →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#999', marginTop: 14 }}>By signing up you agree to our terms of service</p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#666', marginTop: 20 }}>
          Already have an account? <Link to="/login" style={{ color: '#1D9E75', fontWeight: 500 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
