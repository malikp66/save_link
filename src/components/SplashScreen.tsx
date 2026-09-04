'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Users2, Layers } from 'lucide-react';

interface SplashScreenProps {
  isLoading: boolean;
  minDuration?: number; // minimum time in ms to show splash screen (e.g. 1000ms)
  onFinish?: () => void;
}

const LOADING_STEPS = [
  { text: 'Memuat database talenta...', progress: 30 },
  { text: 'Menyiapkan kurasi media visual...', progress: 65 },
  { text: 'Sinkronisasi status CRM & analitik...', progress: 90 },
  { text: 'Selamat datang di TalentPulse', progress: 100 },
];

export default function SplashScreen({
  isLoading,
  minDuration = 1000,
  onFinish,
}: SplashScreenProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Step progression timer
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, minDuration / 3);

    return () => clearInterval(stepInterval);
  }, [minDuration]);

  useEffect(() => {
    if (!isLoading) {
      // Ensure minimum display time before fading out
      const timer = setTimeout(() => {
        setFading(true);
        const removeTimer = setTimeout(() => {
          setVisible(false);
          if (onFinish) onFinish();
        }, 500); // match transition duration
        return () => clearTimeout(removeTimer);
      }, minDuration);

      return () => clearTimeout(timer);
    }
  }, [isLoading, minDuration, onFinish]);

  if (!visible) return null;

  const currentStep = LOADING_STEPS[currentStepIndex];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#0a0b12',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        opacity: fading ? 0 : 1,
        transform: fading ? 'scale(1.02)' : 'scale(1)',
        transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s ease',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* Background ambient radial glows */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.08) 45%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'splashPulse 3s ease-in-out infinite alternate',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 380,
          width: '100%',
          animation: 'splashIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Glowing Logo Icon */}
        <div
          style={{
            position: 'relative',
            width: 80,
            height: 80,
            marginBottom: 24,
          }}
        >
          {/* Animated Glow Halo */}
          <div
            style={{
              position: 'absolute',
              inset: -8,
              borderRadius: 24,
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4)',
              opacity: 0.6,
              filter: 'blur(16px)',
              animation: 'splashRotate 4s linear infinite',
            }}
          />

          {/* Logo Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: 20,
              background: 'linear-gradient(135deg, #1e1b4b, #0f172a)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
            }}
          >
            <Sparkles size={36} color="#c084fc" />
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '1.9rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '0 0 6px 0',
            background: 'linear-gradient(135deg, #ffffff 30%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          TalentPulse
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '0.86rem',
            color: 'var(--text-muted)',
            margin: '0 0 32px 0',
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          IG &amp; TikTok Talent Intelligence &amp; Content CRM
        </p>

        {/* Animated Progress Bar Container */}
        <div
          style={{
            width: '100%',
            maxWidth: 260,
            height: 4,
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 9999,
            overflow: 'hidden',
            position: 'relative',
            marginBottom: 14,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${currentStep.progress}%`,
              background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #06b6d4)',
              borderRadius: 9999,
              transition: 'width 0.4s ease',
              boxShadow: '0 0 12px rgba(139, 92, 246, 0.8)',
            }}
          />
        </div>

        {/* Current Loading Step Text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.78rem',
            color: 'var(--text-dim)',
            fontWeight: 500,
            minHeight: 20,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#34d399',
              boxShadow: '0 0 8px #34d399',
              animation: 'pulse 1.5s infinite',
            }}
          />
          <span>{currentStep.text}</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes splashIn {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes splashPulse {
          0% {
            transform: scale(0.85);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.15);
            opacity: 1;
          }
        }
        @keyframes splashRotate {
          0% {
            filter: blur(14px) hue-rotate(0deg);
          }
          100% {
            filter: blur(14px) hue-rotate(360deg);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.8);
          }
        }
      `}</style>
    </div>
  );
}
