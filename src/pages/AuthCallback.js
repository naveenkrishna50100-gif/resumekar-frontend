import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://cyiyumtetbzzqugtnuzw.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_nfc-31AcEQAxiZhRf3UuYg_W-KhSfK9';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Handle hash fragment from Supabase OAuth
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken) {
          // Set session from hash params
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error || !data.session) {
            navigate('/login');
            return;
          }

          const apiUrl = process.env.REACT_APP_API_URL || 'https://api.resumekar.in';
          const response = await fetch(`${apiUrl}/api/auth/google-callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: data.session.access_token })
          });

          const result = await response.json();
          if (result.success) {
            loginUser(result.token, result.user);
            window.location.href = '/dashboard';
          } else {
            navigate('/login');
          }
        } else {
          // Try getting existing session
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error || !session) {
            navigate('/login');
            return;
          }

          const apiUrl = process.env.REACT_APP_API_URL || 'https://api.resumekar.in';
          const response = await fetch(`${apiUrl}/api/auth/google-callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: session.access_token })
          });

          const result = await response.json();
          if (result.success) {
            loginUser(result.token, result.user);
            window.location.href = '/dashboard';
          } else {
            navigate('/login');
          }
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, loginUser]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f4' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 16px' }}></div>
        <div style={{ fontWeight: 500, fontSize: 16 }}>Signing you in with Google...</div>
        <div style={{ color: '#666', fontSize: 13, marginTop: 6 }}>Please wait</div>
      </div>
    </div>
  );
}
