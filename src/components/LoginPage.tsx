'use client';

import React, { useState } from 'react';
import { Lock, KeyRound, User, Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      // Check credentials: mafiaBos / mafiaBos625
      if (username.trim() === 'mafiaBos' && password === 'mafiaBos625') {
        if (rememberMe) {
          localStorage.setItem('talentpulse_auth', JSON.stringify({
            username: 'mafiaBos',
            token: 'tp_auth_mafiaBos_' + Date.now(),
            loggedInAt: new Date().toISOString(),
          }));
        } else {
          sessionStorage.setItem('talentpulse_auth', JSON.stringify({
            username: 'mafiaBos',
            token: 'tp_auth_mafiaBos_' + Date.now(),
            loggedInAt: new Date().toISOString(),
          }));
        }
        setIsLoading(false);
        onLoginSuccess('mafiaBos');
      } else {
        setIsLoading(false);
        setErrorMsg('Username atau password salah! Akses ditolak.');
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    }, 450);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.18), transparent 45%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.12), transparent 40%), #0a0b12',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: 450,
        height: 450,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '20%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* Login Card */}
      <div 
        className={shake ? 'animate-shake' : ''}
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'rgba(18, 21, 38, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 20,
          padding: '36px 32px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(139, 92, 246, 0.15)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Lock Icon Header */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.25))',
            border: '2px solid rgba(139, 92, 246, 0.4)',
            boxShadow: '0 0 25px rgba(139, 92, 246, 0.3)',
            marginBottom: 16,
          }}>
            <Lock size={28} color="#c084fc" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#f472b6',
              background: 'rgba(236, 72, 153, 0.15)',
              padding: '2px 8px',
              borderRadius: 20,
            }}>
              Security Lock Active
            </span>
          </div>

          <h2 style={{
            fontSize: '1.55rem',
            fontWeight: 800,
            margin: '8px 0 4px 0',
            background: 'linear-gradient(to right, #ffffff, #e2e8f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            TalentPulse Hub
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            Aplikasi diproteksi. Masukkan akun untuk membuka akses.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            fontSize: '0.82rem',
            marginBottom: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Username Input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginBottom: 6,
            }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-dim)',
                display: 'flex',
              }}>
                <User size={16} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username (mafiaBos)"
                autoFocus
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginBottom: 6,
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-dim)',
                display: 'flex',
              }}>
                <KeyRound size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 38px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 2,
                  display: 'flex',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me Option */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              userSelect: 'none',
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <span>Ingat sesi di perangkat ini</span>
            </label>

            <span style={{ fontSize: '0.74rem', color: '#a78bfa', fontWeight: 600 }}>
              Kredensial Resmi
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            id="btn-login-submit"
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.92rem',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 10,
              boxShadow: '0 8px 25px -4px rgba(139, 92, 246, 0.5)',
              transition: 'all 0.2s ease',
              opacity: isLoading ? 0.8 : 1,
            }}
          >
            {isLoading ? (
              <span>Memverifikasi Akses...</span>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Buka Kunci Aplikasi</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Security Footer Note */}
        <div style={{
          marginTop: 24,
          paddingTop: 16,
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', margin: 0 }}>
            🔒 Private Encrypted Talent Directory & CRM
          </p>
        </div>
      </div>
    </div>
  );
}
