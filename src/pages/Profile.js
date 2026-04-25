import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { updateProfile, saveCV } from '../lib/api';
import { useAuth } from '../lib/auth';

export default function Profile() {
  const { profile, loadProfile } = useAuth();
  const [form, setForm] = useState({ fullName: '', phone: '', location: '', targetRoles: '', minSalary: 10, experienceLevel: 'fresher' });
  const [cvStatus, setCvStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.full_name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        targetRoles: profile.target_roles || '',
        minSalary: profile.min_salary || 10,
        experienceLevel: profile.experience_level || 'fresher'
      });
      if (profile.cv_filename) setCvStatus(`${profile.cv_filename} · ${(profile.cv_text || '').split(' ').length} words`);
    }
  }, [profile]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      await updateProfile(form);
      await loadProfile();
      setSuccess('Profile saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCvUploading(true); setError(''); setCvStatus('Reading PDF...');
    try {
      if (!window.pdfjsLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.onload = resolve; script.onerror = reject;
          document.head.appendChild(script);
        });
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map(item => item.str).join(' ') + '\n';
      }
      if (!fullText.trim()) throw new Error('Could not extract text from PDF.');
      await saveCV(fullText.trim(), file.name);
      await loadProfile();
      setCvStatus(`${file.name} · ${fullText.trim().split(' ').length} words extracted ✓`);
      setSuccess('CV uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to read PDF. Please try again.');
      setCvStatus('');
    } finally {
      setCvUploading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26 }}>Profile & CV</h1>
          <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>The more accurate your profile, the better ResumeKar tailors your resume</p>
        </div>
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div className="card">
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #e8e6e0' }}>Your CV</div>
            {cvStatus && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', background: '#f8f7f4', borderRadius: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>📄</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{cvStatus.split('·')[0]}</div>
                  <div style={{ fontSize: 11, color: '#1D9E75' }}>{cvStatus.split('·').slice(1).join('·')}</div>
                </div>
              </div>
            )}
            <div className="upload-box" style={{ padding: '2rem' }}>
              <input type="file" accept=".pdf" onChange={handleCVUpload} disabled={cvUploading} />
              <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>
                {cvUploading ? 'Reading your CV...' : cvStatus ? 'Upload a new CV' : 'Upload your CV'}
              </div>
              <div style={{ fontSize: 12, color: '#999' }}>PDF only · Max 5MB</div>
              {cvUploading && <div className="spinner" style={{ margin: '12px auto 0' }}></div>}
            </div>
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f7f4', borderRadius: 8, fontSize: 12, color: '#666', lineHeight: 1.8 }}>
              <strong style={{ color: '#1a1a1a', fontSize: 13 }}>Tips for best results:</strong><br />
              • Include all projects with tech stack and impact numbers<br />
              • List skills explicitly<br />
              • Add internship details with company name<br />
              • Include GitHub or portfolio link
            </div>
          </div>
          <div className="card">
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #e8e6e0' }}>Your preferences</div>
            <form onSubmit={handleSaveProfile}>
              <div className="form-group"><label className="form-label">Full name</label><input className="form-input" type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="Your full name" /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" /></div>
              <div className="form-group"><label className="form-label">Location</label><input className="form-input" type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Bangalore, India" /></div>
              <div className="form-group"><label className="form-label">Target roles</label><input className="form-input" type="text" value={form.targetRoles} onChange={e => setForm({ ...form, targetRoles: e.target.value })} placeholder="SDE-1, Backend Engineer" /></div>
              <div className="form-group">
                <label className="form-label">Minimum salary expectation (LPA)</label>
                <input className="form-input" type="number" value={form.minSalary} onChange={e => setForm({ ...form, minSalary: parseInt(e.target.value) })} min={1} max={100} />
                <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Jobs below this will show salary fit as ✗</div>
              </div>
              <div className="form-group">
                <label className="form-label">Experience level</label>
                <select className="form-input" value={form.experienceLevel} onChange={e => setForm({ ...form, experienceLevel: e.target.value })}>
                  <option value="fresher">Fresher (0-1 year)</option>
                  <option value="junior">Junior (1-3 years)</option>
                  <option value="mid">Mid-level (3-5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                </select>
              </div>
              <button className="btn btn-primary btn-full" type="submit" disabled={saving}>
                {saving ? <><span className="spinner"></span> Saving...</> : 'Save profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
