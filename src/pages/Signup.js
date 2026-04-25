import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup, login } from '../lib/api';
import { useAuth } from '../lib/auth';

export default function Signup() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
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
