import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getHistory, getPaymentStatus } from '../lib/api';
import { useAuth } from '../lib/auth';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [history, setHistory] = useState([]);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard — ResumeKar';
    Promise.all([getHistory(), getPaymentStatus()])
      .then(([histRes, usageRes]) => {
        setHistory(histRes.data.evaluations || []);
        setUsage(usageRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scoreClass = (s) => s?.startsWith('A') ? 'score-a' : s?.startsWith('B') ? 'score-b' : s?.startsWith('C') ? 'score-c' : 'score-d';
  const firstName = (profile?.full_name || user?.name || 'there').split(' ')[0];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4' }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26 }}>Good day, {firstName} 👋</h1>
          <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>
            {profile?.cv_text ? 'Your CV is ready — paste any job to evaluate' : 'Start by uploading your CV in Profile'}
          </p>
        </div>

        {usage && usage.plan === 'free' && (
          <div style={{ background: '#fff', border: '1px solid #e8e6e0', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Free plan — {usage.evaluationsUsed}/{usage.evaluationsLimit} evaluations used</div>
              <div style={{ marginTop: 8, width: 200 }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(usage.evaluationsUsed / 3) * 100}%` }}></div>
                </div>
              </div>
            </div>
            <Link to="/pricing" className="btn btn-primary btn-sm">Upgrade to Pro — ₹299/month</Link>
          </div>
        )}

        {!profile?.cv_text && (
          <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
            ⚡ Upload your CV first to start evaluating jobs. <Link to="/profile" style={{ color: '#185FA5', fontWeight: 500 }}>Go to Profile →</Link>
          </div>
        )}

        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          <Link to="/evaluate" className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '1.25rem', cursor: 'pointer' }}>
            <div style={{ width: 44, height: 44, background: '#E1F5EE', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>✦</div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 14, color: '#1a1a1a' }}>Evaluate a job</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Paste any JD → get score + tailored resume</div>
            </div>
            <div style={{ marginLeft: 'auto', color: '#1D9E75', fontSize: 18 }}>→</div>
          </Link>
          <Link to="/profile" className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '1.25rem', cursor: 'pointer' }}>
            <div style={{ width: 44, height: 44, background: '#E6F1FB', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📄</div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 14, color: '#1a1a1a' }}>Update your CV</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{profile?.cv_filename || 'No CV uploaded yet'}</div>
            </div>
            <div style={{ marginLeft: 'auto', color: '#666', fontSize: 18 }}>→</div>
          </Link>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Recent evaluations</div>
            <Link to="/evaluate" className="btn btn-sm btn-primary">+ New evaluation</Link>
          </div>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <div className="spinner" style={{ width: 24, height: 24, margin: '0 auto' }}></div>
            </div>
          ) : history.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
              <div style={{ fontWeight: 500, marginBottom: 6 }}>No evaluations yet</div>
              <div style={{ fontSize: 13 }}>Paste your first job description to get started</div>
              <Link to="/evaluate" className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>Evaluate a job →</Link>
            </div>
          ) : (
            history.map((ev, i) => (
              <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < history.length - 1 ? '1px solid #e8e6e0' : 'none' }}>
                <div className={`score ${scoreClass(ev.score)}`} style={{ width: 40, height: 40, fontSize: 15 }}>{ev.score}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{ev.verdict || 'Evaluation'}</div>
                  <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{new Date(ev.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · Match: {ev.match_pct}%</div>
                </div>
                <span className={`pill ${ev.salary_fit ? 'pill-green' : 'pill-red'}`}>{ev.salary_fit ? 'Salary ✓' : 'Salary ✗'}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
