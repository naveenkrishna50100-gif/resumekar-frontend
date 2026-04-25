import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { evaluateJob } from '../lib/api';
import { useAuth } from '../lib/auth';
import { Link } from 'react-router-dom';

export default function Evaluate() {
  const { profile } = useAuth();
  const [jd, setJd] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [upgradeNeeded, setUpgradeNeeded] = useState(false);
  const resultRef = useRef(null);

  const handleEvaluate = async () => {
    if (!jd && !jobUrl) { setError('Please paste a job description'); return; }
    if (!profile?.cv_text) { setError('Please upload your CV in Profile first'); return; }
    setError(''); setLoading(true); setResult(null); setUpgradeNeeded(false);
    try {
      const res = await evaluateJob(jd, jobUrl);
      setResult(res.data.evaluation);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      if (err.response?.data?.upgrade) {
        setUpgradeNeeded(true);
      } else {
        setError(err.response?.data?.error || 'Evaluation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const scoreClass = (s) => s?.startsWith('A') ? 'score-a' : s?.startsWith('B') ? 'score-b' : s?.startsWith('C') ? 'score-c' : 'score-d';

  const downloadPDF = () => {
    if (!result) return;
    const r = result;
    const expHTML = (r.experience || []).map(e => `
      <div class="exp-item">
        <div class="exp-row"><div><div class="exp-title">${e.title}</div><div class="exp-co">${e.company}</div></div><div class="exp-date">${e.date}</div></div>
        <div class="exp-desc">${(e.bullets || []).map(b => '• ' + b).join('<br>')}</div>
      </div>`).join('');
    const projHTML = (r.projects || []).map(p => `
      <div class="exp-item">
        <div class="exp-row"><div class="exp-title">${p.name}</div><div class="exp-date">${p.date}</div></div>
        <div class="exp-desc">${p.description}</div>
      </div>`).join('');
    const skillsHTML = (r.key_skills || []).map(s => `<span class="skill">${s}</span>`).join('');
    const certsHTML = (r.certifications || []).length > 0
      ? `<div class="section"><div class="section-title">Certifications</div><div class="exp-desc">${r.certifications.map(c => '• ' + c).join('<br>')}</div></div>` : '';
    const edu = r.education || {};
    const contacts = [r.candidate_email, r.candidate_phone, r.candidate_github, r.candidate_linkedin, r.candidate_location].filter(Boolean).join(' · ');

    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${r.candidate_name} — ResumeKar</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@500;600&display=swap');
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:'DM Sans',sans-serif;color:#1a1a1a;background:#fff;}
      .page{width:210mm;min-height:297mm;margin:0 auto;padding:40px 48px;}
      .header{border-bottom:2.5px solid #1D9E75;padding-bottom:20px;margin-bottom:24px;}
      .name{font-family:'Playfair Display',serif;font-size:28px;font-weight:600;}
      .tagline{font-size:13px;color:#555;margin-top:4px;}
      .contacts{font-size:12px;color:#666;margin-top:8px;}
      .section{margin-bottom:20px;}
      .section-title{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;color:#1D9E75;margin-bottom:10px;padding-bottom:4px;border-bottom:0.5px solid #e0e0e0;}
      .summary{font-size:13px;line-height:1.75;color:#333;}
      .skills-wrap{display:flex;flex-wrap:wrap;gap:6px;}
      .skill{background:#E1F5EE;color:#0F6E56;font-size:11px;padding:4px 10px;border-radius:4px;font-weight:500;}
      .exp-item{margin-bottom:14px;}
      .exp-row{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;}
      .exp-title{font-size:14px;font-weight:500;}
      .exp-co{font-size:13px;color:#1D9E75;margin-top:1px;}
      .exp-date{font-size:11px;color:#999;}
      .exp-desc{font-size:12px;color:#444;line-height:1.75;margin-top:5px;}
      .footer{margin-top:32px;padding-top:12px;border-top:0.5px solid #e8e8e8;font-size:10px;color:#aaa;text-align:center;}
      @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
    </style></head><body><div class="page">
      <div class="header">
        <div class="name">${r.candidate_name || 'Candidate'}</div>
        <div class="tagline">${r.candidate_tagline || r.role}</div>
        <div class="contacts">${contacts}</div>
      </div>
      <div class="section"><div class="section-title">Professional Summary</div><div class="summary">${r.tailored_summary}</div></div>
      <div class="section"><div class="section-title">Core Skills</div><div class="skills-wrap">${skillsHTML}</div></div>
      ${expHTML ? `<div class="section"><div class="section-title">Experience</div>${expHTML}</div>` : ''}
      ${projHTML ? `<div class="section"><div class="section-title">Projects</div>${projHTML}</div>` : ''}
      <div class="section"><div class="section-title">Education</div>
        <div class="exp-item">
          <div class="exp-row"><div><div class="exp-title">${edu.degree || ''}</div><div class="exp-co">${edu.college || ''}</div></div><div class="exp-date">${edu.date || ''}</div></div>
          ${edu.cgpa ? `<div class="exp-desc">CGPA: ${edu.cgpa}${edu.coursework ? ' · ' + edu.coursework : ''}</div>` : ''}
        </div>
      </div>
      ${certsHTML}
      <div class="footer">Generated by ResumeKar · resumekar.in · Tailored for ${r.company} — ${r.role}</div>
    </div><script>setTimeout(()=>window.print(),800);<\/script></body></html>`);
    win.document.close();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26 }}>Evaluate a job</h1>
          <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Paste any job description — AI scores your fit and generates a tailored resume PDF</p>
        </div>

        {!profile?.cv_text && (
          <div className="alert alert-info">Upload your CV first. <Link to="/profile" style={{ color: '#185FA5', fontWeight: 500 }}>Go to Profile →</Link></div>
        )}

        {upgradeNeeded && (
          <div className="alert" style={{ background: '#FAEEDA', color: '#854F0B', border: '1px solid #f5d5a0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span>You've used all 3 free evaluations this month.</span>
            <Link to="/pricing" className="btn btn-sm" style={{ background: '#854F0B', color: '#fff', borderColor: '#854F0B' }}>Upgrade to Pro — ₹299/month</Link>
          </div>
        )}

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Job description</div>
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-group">
                <label className="form-label">Job URL (optional)</label>
                <input className="form-input" type="url" placeholder="https://razorpay.com/jobs/..." value={jobUrl} onChange={e => setJobUrl(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Paste full job description</label>
                <textarea className="form-input" rows={10} placeholder="Copy and paste the complete job description..." value={jd} onChange={e => setJd(e.target.value)} />
              </div>
              <button className="btn btn-primary btn-full" onClick={handleEvaluate} disabled={loading || !profile?.cv_text}>
                {loading ? <><span className="spinner"></span> Evaluating your fit...</> : 'Evaluate this job ✦'}
              </button>
            </div>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Your CV</div>
              {profile?.cv_text ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#f8f7f4', borderRadius: 8 }}>
                  <span style={{ fontSize: 20 }}>📄</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{profile.cv_filename || 'resume.pdf'}</div>
                    <div style={{ fontSize: 11, color: '#999' }}>{profile.cv_text.split(' ').length} words extracted ✓</div>
                  </div>
                  <Link to="/profile" className="btn btn-sm" style={{ marginLeft: 'auto' }}>Change</Link>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#999' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>📄</div>
                  <div style={{ fontSize: 13 }}>No CV uploaded</div>
                  <Link to="/profile" className="btn btn-sm btn-primary" style={{ marginTop: 12 }}>Upload CV →</Link>
                </div>
              )}
            </div>
          </div>

          <div ref={resultRef}>
            {loading && (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto 16px' }}></div>
                <div style={{ fontWeight: 500, marginBottom: 6 }}>Analysing your CV against the job...</div>
                <div style={{ fontSize: 12, color: '#999' }}>This takes 10-20 seconds</div>
              </div>
            )}
            {!loading && !result && (
              <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✦</div>
                <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 6, color: '#1a1a1a' }}>Paste a job to evaluate</div>
                <div style={{ fontSize: 13 }}>AI will score your fit, find gaps, and generate a tailored resume PDF</div>
              </div>
            )}
            {result && !loading && (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid #e8e6e0', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div className={`score ${scoreClass(result.score)}`}>{result.score}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{result.company} — {result.role}</div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{result.verdict} · {result.salary} · {result.location}</div>
                  </div>
                  {result.worth_applying !== false && (
                    <button className="btn btn-primary btn-sm" onClick={downloadPDF}>Download PDF ↗</button>
                  )}
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <div className="grid-3" style={{ gap: 8, marginBottom: '1rem' }}>
                    <div className="metric"><div className="metric-label">Skills match</div><div className="metric-value" style={{ fontSize: 20 }}>{result.match_pct}%</div></div>
                    <div className="metric"><div className="metric-label">Exp match</div><div className="metric-value" style={{ fontSize: 20 }}>{result.exp_match}%</div></div>
                    <div className="metric"><div className="metric-label">Salary fit</div><div className="metric-value" style={{ fontSize: 20 }}>{result.salary_fit ? '✓' : '✗'}</div></div>
                  </div>
                  {result.worth_applying === false && (
                    <div className="alert alert-error"><strong>Not recommended.</strong> {result.interview_angle}</div>
                  )}
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Gap analysis</div>
                  {(result.gaps || []).map((g, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid #f0ede8', fontSize: 13, alignItems: 'flex-start' }}>
                      <span style={{ color: g.type === 'match' ? '#1D9E75' : g.type === 'warning' ? '#854F0B' : '#A32D2D', fontSize: 14, flexShrink: 0 }}>
                        {g.type === 'match' ? '✓' : g.type === 'warning' ? '△' : '✗'}
                      </span>
                      <span>{g.text}</span>
                    </div>
                  ))}
                  {result.worth_applying !== false && (
                    <>
                      <div className="divider"></div>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Tailored summary for {result.candidate_name}</div>
                      <div style={{ fontSize: 13, lineHeight: 1.75, background: '#f8f7f4', padding: 12, borderRadius: 8, marginBottom: '1rem' }}>{result.tailored_summary}</div>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Key skills to highlight</div>
                      <div style={{ marginBottom: '1rem' }}>{(result.key_skills || []).map(s => <span key={s} className="tag">{s}</span>)}</div>
                      <div style={{ background: '#E1F5EE', padding: 12, borderRadius: 8, fontSize: 12, color: '#0F6E56' }}>
                        <strong>Interview angle:</strong> {result.interview_angle}
                      </div>
                      <button className="btn btn-primary btn-full" onClick={downloadPDF} style={{ marginTop: '1rem' }}>
                        Download tailored resume PDF ↗
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
