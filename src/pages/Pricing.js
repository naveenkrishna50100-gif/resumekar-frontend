import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../lib/auth';
import { createSubscription, verifyPayment } from '../lib/api';

const COUPONS = {
  'APNA50': { discount: 50, label: '50% off — Apna College' },
  'STRIVER30': { discount: 30, label: '30% off — Striver' },
  'COLLEGE50': { discount: 50, label: '50% off — College special' },
  'LAUNCH50': { discount: 50, label: '50% off — Launch offer' },
  'FREE100': { discount: 100, label: '100% off — Full free access' },
};

export default function Pricing() {
  const { user, profile, loadProfile } = useAuth();
  const navigate = useNavigate();
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (window.Razorpay) { setRazorpayLoaded(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    document.head.appendChild(script);
  }, []);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ code, ...COUPONS[code] });
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Please check and try again.');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  const getPrice = (original) => {
    if (!appliedCoupon) return original;
    return Math.round(original * (1 - appliedCoupon.discount / 100));
  };

  const handleUpgrade = async (plan) => {
    if (!user) { navigate('/signup'); return; }

    if (!razorpayLoaded) {
      alert('Payment system loading. Please try again in a moment.');
      return;
    }

    try {
      setLoading(plan);
      const res = await createSubscription(plan);
      const { subscriptionId, razorpayKeyId, userEmail, userName } = res.data;

      const options = {
        key: razorpayKeyId,
        subscription_id: subscriptionId,
        name: 'ResumeKar',
        description: plan === 'annual' ? 'Pro Annual — ₹999/year' : 'Pro Monthly — ₹299/month',
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({ ...response, plan });
            await loadProfile();
            alert('🎉 ' + verifyRes.data.message);
            navigate('/dashboard');
          } catch (err) {
            alert('Payment successful but verification failed. Please contact naveenkrishna50100@gmail.com with payment ID: ' + response.razorpay_payment_id);
          }
        },
        prefill: { email: userEmail, name: userName },
        theme: { color: '#1D9E75' },
        modal: { ondismiss: () => setLoading(null) }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        alert('Payment failed: ' + response.error.description);
        setLoading(null);
      });
      rzp.open();

    } catch (err) {
      alert(err.response?.data?.error || 'Payment failed. Please try again.');
      setLoading(null);
    }
  };

  const handleCollegeContact = () => {
    const subject = encodeURIComponent('ResumeKar College Plan Inquiry');
    const body = encodeURIComponent(
      `Hi Naveenkrishna,\n\nI'm interested in the College Plan for ResumeKar.\n\nCollege name:\nNumber of students:\nContact person:\nPhone:\n\nPlease share more details.\n\nThanks`
    );
    window.open(`mailto:naveenkrishna50100@gmail.com?subject=${subject}&body=${body}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4' }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '3rem 2rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, marginBottom: 12 }}>Simple, honest pricing</h1>
          <p style={{ color: '#666', fontSize: 16 }}>Smart applications, not mass applications</p>
        </div>

        {/* Coupon Code */}
        <div className="card" style={{ maxWidth: 500, margin: '0 auto 2rem', padding: '1.25rem' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>🎟 Have a coupon code?</div>
          {appliedCoupon ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#E1F5EE', borderRadius: 8 }}>
              <span style={{ fontSize: 16 }}>✅</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F6E56' }}>{appliedCoupon.code} applied!</div>
                <div style={{ fontSize: 12, color: '#0F6E56' }}>{appliedCoupon.label}</div>
              </div>
              <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 20 }}>×</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="form-input"
                placeholder="Enter coupon code e.g. LAUNCH50"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary" onClick={applyCoupon}>Apply</button>
            </div>
          )}
          {couponError && <div style={{ fontSize: 12, color: '#A32D2D', marginTop: 6 }}>{couponError}</div>}
        </div>

        {/* Plans */}
        <div className="grid-3" style={{ gap: '1.5rem', alignItems: 'start' }}>

          {/* Free */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Free</div>
            <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 4 }}>
              ₹0<span style={{ fontSize: 14, fontWeight: 400, color: '#666' }}>/month</span>
            </div>
            <div style={{ height: 1, background: '#e8e6e0', margin: '16px 0' }}></div>
            {['3 job evaluations/month', '3 tailored resume PDFs', 'Basic gap analysis', 'ATS-optimised resume'].map(f => (
              <div key={f} style={{ fontSize: 13, color: '#444', padding: '4px 0', display: 'flex', gap: 8 }}>
                <span style={{ color: '#1D9E75' }}>✓</span>{f}
              </div>
            ))}
            {['Unlimited evaluations', 'Annual plan savings', 'Priority AI processing', 'Salary negotiation scripts'].map(f => (
              <div key={f} style={{ fontSize: 13, color: '#ccc', padding: '4px 0', display: 'flex', gap: 8 }}>
                <span>✗</span>{f}
              </div>
            ))}
            <button className="btn btn-full" style={{ marginTop: '1.25rem' }} onClick={() => navigate('/signup')} disabled={profile?.plan === 'free'}>
              {profile?.plan === 'free' ? 'Current plan' : 'Get started free'}
            </button>
          </div>

          {/* Pro Monthly */}
          <div className="card" style={{ border: '2px solid #1D9E75', padding: '1.5rem' }}>
            <div className="pill pill-green" style={{ marginBottom: 12, fontSize: 11 }}>Most popular</div>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Pro</div>
            <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 4 }}>
              {appliedCoupon ? (
                <span><span style={{ textDecoration: 'line-through', color: '#999', fontSize: 20 }}>₹299</span> ₹{getPrice(299)}</span>
              ) : '₹299'}
              <span style={{ fontSize: 14, fontWeight: 400, color: '#666' }}>/month</span>
            </div>
            {appliedCoupon && <div style={{ fontSize: 12, color: '#0F6E56', fontWeight: 500, marginBottom: 4 }}>{appliedCoupon.discount}% off applied! 🎉</div>}
            <div style={{ height: 1, background: '#e8e6e0', margin: '16px 0' }}></div>
            {['Unlimited evaluations', 'Unlimited resume PDFs', 'Deep gap analysis', 'ATS-optimised resume', 'Priority AI processing', 'Interview prep questions', 'Salary negotiation scripts', 'Cancel anytime'].map(f => (
              <div key={f} style={{ fontSize: 13, color: '#444', padding: '4px 0', display: 'flex', gap: 8 }}>
                <span style={{ color: '#1D9E75' }}>✓</span>{f}
              </div>
            ))}
            <button
              className="btn btn-primary btn-full"
              style={{ marginTop: '1.25rem' }}
              onClick={() => handleUpgrade('monthly')}
              disabled={profile?.plan === 'pro' || loading === 'monthly'}
            >
              {loading === 'monthly' ? <><span className="spinner"></span> Processing...</> :
               profile?.plan === 'pro' ? '✓ Current plan' :
               `Upgrade — ₹${getPrice(299)}/month`}
            </button>
          </div>

          {/* Annual */}
          <div className="card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 16, right: -24, background: '#1D9E75', color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 32px', transform: 'rotate(35deg)' }}>
              SAVE 72%
            </div>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Pro Annual</div>
            <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 2 }}>
              {appliedCoupon ? (
                <span><span style={{ textDecoration: 'line-through', color: '#999', fontSize: 20 }}>₹999</span> ₹{getPrice(999)}</span>
              ) : '₹999'}
              <span style={{ fontSize: 14, fontWeight: 400, color: '#666' }}>/year</span>
            </div>
            <div style={{ fontSize: 12, color: '#1D9E75', fontWeight: 500, marginBottom: 4 }}>
              Just ₹{Math.round(getPrice(999) / 12)}/month · Auto-renews yearly
            </div>
            {appliedCoupon && <div style={{ fontSize: 12, color: '#0F6E56', fontWeight: 500, marginBottom: 4 }}>{appliedCoupon.discount}% off applied! 🎉</div>}
            <div style={{ height: 1, background: '#e8e6e0', margin: '16px 0' }}></div>
            {['Everything in Pro', 'Auto-renews yearly', 'Best value for active job seekers', 'Priority support', 'Early access to new features', 'Lock in current price forever'].map(f => (
              <div key={f} style={{ fontSize: 13, color: '#444', padding: '4px 0', display: 'flex', gap: 8 }}>
                <span style={{ color: '#1D9E75' }}>✓</span>{f}
              </div>
            ))}
            <button
              className="btn btn-full"
              style={{ marginTop: '1.25rem', background: '#1a1a1a', color: '#fff', borderColor: '#1a1a1a' }}
              onClick={() => handleUpgrade('annual')}
              disabled={loading === 'annual'}
            >
              {loading === 'annual' ? <><span className="spinner"></span> Processing...</> :
               `Get annual — ₹${getPrice(999)}/year`}
            </button>
          </div>

        </div>

        {/* College Plan */}
        <div className="card" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, padding: '1.25rem 1.5rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>🏫 College / Institution plan — ₹75,000/year</div>
            <div style={{ fontSize: 13, color: '#666' }}>Up to 500 students · Placement cell dashboard · TPO analytics · Batch resume generation · Priority support</div>
          </div>
          <button className="btn" onClick={handleCollegeContact}>Contact us →</button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#999', fontSize: 13 }}>
          Questions? Email us at <a href="mailto:naveenkrishna50100@gmail.com" style={{ color: '#1D9E75' }}>naveenkrishna50100@gmail.com</a>
          <br />
          <span style={{ fontSize: 11, marginTop: 6, display: 'block' }}>Secure payments via Razorpay · Cancel anytime</span>
        </div>
      </div>
    </div>
  );
}
