import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../lib/auth';

export default function Pricing() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free', price: '₹0', period: '/month',
      features: ['3 job evaluations/month', '3 tailored resume PDFs', 'Basic gap analysis', 'ATS-optimised resume'],
      missing: ['Unlimited evaluations', 'Priority AI processing', 'Interview prep questions', 'Salary negotiation scripts'],
      cta: profile?.plan === 'free' ? 'Current plan' : 'Get started',
      action: () => navigate('/signup'),
      disabled: profile?.plan === 'free'
    },
    {
      name: 'Pro', price: '₹299', period: '/month', featured: true,
      features: ['Unlimited evaluations', 'Unlimited resume PDFs', 'Deep gap analysis', 'ATS-optimised resume', 'Priority AI processing', 'Interview prep questions', 'Salary negotiation scripts', 'Cancel anytime'],
      cta: profile?.plan === 'pro' ? '✓ Current plan' : 'Upgrade to Pro',
      action: () => alert('Payments coming soon! Email us at hello@resumekar.in to get Pro access early.'),
      disabled: profile?.plan === 'pro'
    },
    {
      name: 'College', price: '₹75,000', period: '/year',
      features: ['Everything in Pro', 'Up to 500 students', 'Placement cell dashboard', 'Batch resume generation', 'TPO analytics & reports', 'Dedicated support'],
      cta: 'Contact us',
      action: () => window.open('mailto:hello@resumekar.in?subject=College Plan Inquiry'),
      disabled: false
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4' }}>
      <Navbar />
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, marginBottom: 12 }}>Simple, honest pricing</h1>
          <p style={{ color: '#666', fontSize: 16 }}>Smart applications, not mass applications</p>
        </div>
        <div className="grid-3" style={{ gap: '1.5rem', alignItems: 'start' }}>
          {plans.map(plan => (
            <div key={plan.name} className="card" style={{ border: plan.featured ? '2px solid #1D9E75' : '1px solid #e8e6e0', padding: '1.5rem' }}>
              {plan.featured && <div className="pill pill-green" style={{ marginBottom: 12, fontSize: 11 }}>Most popular</div>}
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 4 }}>
                {plan.price}<span style={{ fontSize: 14, fontWeight: 400, color: '#666' }}>{plan.period}</span>
              </div>
              <div style={{ height: 1, background: '#e8e6e0', margin: '16px 0' }}></div>
              {plan.features.map(f => (
                <div key={f} style={{ fontSize: 13, color: '#444', padding: '4px 0', display: 'flex', gap: 8 }}>
                  <span style={{ color: '#1D9E75' }}>✓</span>{f}
                </div>
              ))}
              {(plan.missing || []).map(f => (
                <div key={f} style={{ fontSize: 13, color: '#ccc', padding: '4px 0', display: 'flex', gap: 8 }}>
                  <span>✗</span>{f}
                </div>
              ))}
              <button className={`btn ${plan.featured ? 'btn-primary' : ''} btn-full`} style={{ marginTop: '1.25rem' }} onClick={plan.action} disabled={plan.disabled}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#999', fontSize: 13 }}>
          All plans include ATS-optimised resumes · No credit card required for free plan
        </div>
      </div>
    </div>
  );
}
