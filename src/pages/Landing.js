import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />

      <section style={{ padding: '80px 2rem 60px', textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: '#E1F5EE', color: '#0F6E56', fontSize: 12, fontWeight: 600, padding: '4px 14px', borderRadius: 999, marginBottom: 20, letterSpacing: '0.05em' }}>
          🎓 Built for Indian students & freshers
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 600, lineHeight: 1.2, marginBottom: 20, color: '#1a1a1a' }}>
          Ek CV.<br />Har Job ke liye.
        </h1>
        <p style={{ fontSize: 18, color: '#666', marginBottom: 32, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 32px' }}>
          Upload your resume. Paste any job description. ResumeKar rewrites your CV to match that specific job — in 60 seconds.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" className="btn btn-primary btn-lg">Start for free — 3 evaluations/month</Link>
          <Link to="/pricing" className="btn btn-lg">See pricing</Link>
        </div>
        <p style={{ fontSize: 12, color: '#999', marginTop: 14 }}>No credit card required · Takes 2 minutes to set up</p>
      </section>

      <section style={{ background: '#f8f7f4', padding: '60px 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, textAlign: 'center', marginBottom: 40 }}>How it works</h2>
          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {[
              { step: '01', title: 'Upload your CV', desc: 'Upload your existing resume PDF. ResumeKar reads every detail — your skills, experience, projects, and education.' },
              { step: '02', title: 'Paste any job', desc: 'Copy-paste the job description from any company — Razorpay, Infosys, Google, anywhere. ResumeKar scores your fit instantly.' },
              { step: '03', title: 'Download tailored resume', desc: 'Get a perfectly tailored resume PDF that highlights the right skills for that specific job. ATS-optimised and ready to submit.' }
            ].map(item => (
              <div key={item.step} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#E1F5EE', fontFamily: "'Playfair Display', serif", marginBottom: 12 }}>{item.step}</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 2rem', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 12 }}>Why ResumeKar?</h2>
        <p style={{ color: '#666', marginBottom: 40, fontSize: 15 }}>Recruiters get 500+ applications daily. Most get ignored in 6 seconds. A tailored resume is the difference.</p>
        <div className="grid-3">
          {[
            { stat: '60 sec', label: 'To tailor your resume' },
            { stat: '3×', label: 'More interview callbacks' },
            { stat: '₹299', label: 'Per month for unlimited' }
          ].map(item => (
            <div key={item.stat} style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#1D9E75', fontFamily: "'Playfair Display', serif" }}>{item.stat}</div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: '#1D9E75', padding: '60px 2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#fff', marginBottom: 16 }}>Placement season is here.</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, marginBottom: 28 }}>Stop sending the same CV everywhere. Start getting shortlisted.</p>
        <Link to="/signup" className="btn btn-lg" style={{ background: '#fff', color: '#0F6E56', borderColor: '#fff', fontWeight: 600 }}>Get started free →</Link>
      </section>

      <footer style={{ padding: '24px 2rem', textAlign: 'center', fontSize: 12, color: '#999', borderTop: '1px solid #e8e6e0' }}>
        © 2026 ResumeKar · Built for India's placement season 🇮🇳
      </footer>
    </div>
  );
}
