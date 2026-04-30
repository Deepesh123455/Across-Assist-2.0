import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/axios';

export default function ResumePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError('Invalid resume link. Please check your email or start again.');
      setLoading(false);
      return;
    }

    api
      .get(`/sessions/resume/${token}`)
      .then((res) => {
        const data = res.data.data;

        localStorage.setItem('aa_session_token', data.sessionToken);
        if (data.formData) localStorage.setItem('aa_form_data', JSON.stringify(data.formData));
        if (data.email) localStorage.setItem('aa_email', data.email);
        if (data.recommendation) localStorage.setItem('aa_recommendation', JSON.stringify(data.recommendation));

        setRestored(true);
        toast('Welcome back! Your progress has been restored.', 'success');

        setTimeout(() => navigate('/advisor'), 1500);
      })
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 410) {
          setError('This resume link has expired. Please start a fresh recommendation.');
        } else if (status === 404) {
          setError('Invalid resume link. Please check your email or start again.');
        } else {
          setError('Something went wrong. Please try again.');
        }
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', padding: '32px' }}>
        {loading && !error && !restored && (
          <>
            <div
              style={{
                width: 48,
                height: 48,
                border: '3px solid #1A56DB',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 20px',
              }}
            />
            <p style={{ color: '#1A56DB', fontSize: 18, fontWeight: 600, margin: 0 }}>
              Restoring your session...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </>
        )}

        {restored && (
          <>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#10B981',
                color: '#fff',
                fontSize: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              ✓
            </div>
            <p style={{ color: '#0F172A', fontSize: 18, fontWeight: 600, margin: 0 }}>
              Session restored! Taking you back...
            </p>
          </>
        )}

        {error && (
          <>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#EF4444',
                color: '#fff',
                fontSize: 22,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              ✕
            </div>
            <p style={{ color: '#0F172A', fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>
              {error}
            </p>
            <button
              onClick={() => navigate('/advisor')}
              style={{
                marginTop: 20,
                background: '#F97316',
                color: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Start Fresh →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
