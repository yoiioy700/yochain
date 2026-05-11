'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const slides = [
  // Slide 1: Title
  {
    id: 'title',
    content: (
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em' }}>Yo<span style={{ color: '#14F195' }}>Chain</span></span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: '#e8e8e8', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Your onchain story,<br />
          <em style={{ color: '#9945FF', fontStyle: 'normal' }}>proven.</em>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Web3 Developer Identity Platform on Solana.<br />
          Stop sending static PDFs. Start proving your worth.
        </p>
      </div>
    )
  },
  // Slide 2: Problem
  {
    id: 'problem',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '800px' }}>
        <h2 style={{ fontSize: '0.9rem', color: '#ff4444', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', fontWeight: 700 }}>// The Problem</h2>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#fff', marginBottom: '3rem', lineHeight: 1.1 }}>
          Web3 Hiring is <span style={{ color: '#ff4444' }}>Fragmented</span>.
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ background: 'rgba(255, 68, 68, 0.05)', padding: '2rem', borderLeft: '2px solid #ff4444' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>Unverified Claims</h3>
            <p style={{ color: '#888', lineHeight: 1.6 }}>Traditional PDF resumes are easily faked and cannot dynamically prove real technical capability or on-chain interactions.</p>
          </div>
          <div style={{ background: 'rgba(255, 68, 68, 0.05)', padding: '2rem', borderLeft: '2px solid #ff4444' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>Split Identity</h3>
            <p style={{ color: '#888', lineHeight: 1.6 }}>A developer's open-source work lives on GitHub (Web2), while their real transaction history and dApp usage lives on-chain (Web3).</p>
          </div>
        </div>
      </div>
    )
  },
  // Slide 3: Solution
  {
    id: 'solution',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '800px' }}>
        <h2 style={{ fontSize: '0.9rem', color: '#14F195', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', fontWeight: 700 }}>// The Solution</h2>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#fff', marginBottom: '2rem', lineHeight: 1.1 }}>
          A Unified, <span style={{ color: '#14F195' }}>Verifiable</span> Hub.
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: '3rem', lineHeight: 1.6 }}>
          YoChain aggregates your real GitHub contributions and Solana on-chain activity to instantly generate a premium, editorial-grade digital CV.
        </p>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ padding: '1rem 2rem', background: '#0a0a0a', border: '1px solid #333', borderRadius: '100px', color: '#fff', fontWeight: 600 }}>1. Connect GitHub</div>
          <div style={{ color: '#333' }}>→</div>
          <div style={{ padding: '1rem 2rem', background: '#0a0a0a', border: '1px solid #333', borderRadius: '100px', color: '#fff', fontWeight: 600 }}>2. Connect Solana</div>
          <div style={{ color: '#333' }}>→</div>
          <div style={{ padding: '1rem 2rem', background: 'rgba(20, 241, 149, 0.1)', border: '1px solid #14F195', borderRadius: '100px', color: '#14F195', fontWeight: 600 }}>3. Prove Identity</div>
        </div>
      </div>
    )
  },
  // Slide 4: Features
  {
    id: 'features',
    content: (
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        <h2 style={{ fontSize: '0.9rem', color: '#9945FF', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', fontWeight: 700, textAlign: 'center' }}>// Key Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '3rem' }}>
          {[
            { t: 'Automated Data Sync', d: 'Pulls live GitHub repos/stars and Solana tx history, DeFi usage, and NFTs via Helius.', c: '#14F195' },
            { t: 'Metaplex Core NFT Minting', d: 'Profiles are not just web pages; they are minted as lightweight Core Identity NFTs on Solana.', c: '#9945FF' },
            { t: 'Solana Blinks Integration', d: 'Visitors and recruiters can tip developers directly in SOL straight from their X (Twitter) timeline.', c: '#14F195' },
            { t: 'Smart Export (ATS-Friendly)', d: 'Advanced CSS algorithms to export the high-end dark mode UI into clean, readable PDFs.', c: '#9945FF' }
          ].map((f, i) => (
            <div key={i} style={{ background: '#080808', padding: '2.5rem', border: `1px solid ${f.c}33`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: f.c }} />
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1rem', fontWeight: 700 }}>{f.t}</h3>
              <p style={{ color: '#777', lineHeight: 1.6 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  // Slide 5: Tech Stack
  {
    id: 'tech',
    content: (
      <div style={{ textAlign: 'center', maxWidth: '800px' }}>
         <h2 style={{ fontSize: '0.9rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', fontWeight: 700 }}>// Under The Hood</h2>
         <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#fff', marginBottom: '4rem', lineHeight: 1.1 }}>
          Built for <span style={{ color: '#14F195' }}>Speed</span> & <span style={{ color: '#9945FF' }}>Scale</span>.
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div style={{ padding: '1.5rem', background: '#0a0a0a', border: '1px solid #222', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '120px', color: '#14F195', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px' }}>FRONTEND</div>
            <div style={{ color: '#ddd' }}>Next.js (App Router), React, Vanilla CSS Keyframes</div>
          </div>
          <div style={{ padding: '1.5rem', background: '#0a0a0a', border: '1px solid #222', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '120px', color: '#9945FF', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px' }}>ON-CHAIN</div>
            <div style={{ color: '#ddd' }}>Solana Web3.js, Metaplex Umi (Core NFT Standard)</div>
          </div>
          <div style={{ padding: '1.5rem', background: '#0a0a0a', border: '1px solid #222', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '120px', color: '#14F195', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px' }}>APIs & DATA</div>
            <div style={{ color: '#ddd' }}>Helius RPC (Enriched Tx parsing), GitHub OAuth API</div>
          </div>
          <div style={{ padding: '1.5rem', background: '#0a0a0a', border: '1px solid #222', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '120px', color: '#9945FF', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px' }}>BACKEND</div>
            <div style={{ color: '#ddd' }}>Supabase (PostgreSQL) for Global Leaderboard</div>
          </div>
        </div>
      </div>
    )
  },
  // Slide 6: Demo
  {
    id: 'demo',
    content: (
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: 'rgba(20, 241, 149, 0.1)', border: '2px solid #14F195', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <div style={{ width: 0, height: 0, borderTop: '15px solid transparent', borderBottom: '15px solid transparent', borderLeft: '24px solid #14F195', marginLeft: '8px' }} />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
          Live Demo
        </h1>
        <p style={{ color: '#888', fontSize: '1.2rem' }}>Let's see YoChain in action.</p>
      </div>
    )
  },
  // Slide 7: Roadmap
  {
    id: 'roadmap',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '800px' }}>
        <h2 style={{ fontSize: '0.9rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', fontWeight: 700 }}>// What's Next</h2>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#fff', marginBottom: '3rem', lineHeight: 1.1 }}>
          The Road Ahead.
        </h1>
        <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px solid #333' }}>
          <div style={{ position: 'relative', marginBottom: '3rem' }}>
            <div style={{ position: 'absolute', left: '-39px', top: '4px', width: '14px', height: '14px', background: '#14F195', borderRadius: '50%', boxShadow: '0 0 10px #14F195' }} />
            <h3 style={{ color: '#14F195', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Q3 2026: Mainnet & Domains</h3>
            <p style={{ color: '#888' }}>Deploy Core NFTs to Solana Mainnet. Allow users to map custom subdomains (e.g. <code>ariq.yochain.tech</code>).</p>
          </div>
          <div style={{ position: 'relative', marginBottom: '3rem' }}>
            <div style={{ position: 'absolute', left: '-39px', top: '4px', width: '14px', height: '14px', background: '#333', borderRadius: '50%' }} />
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Q4 2026: Superteam Earn Integration</h3>
            <p style={{ color: '#888' }}>Directly apply to Bounties & Grants using the YoChain verifiable identity profile in one click.</p>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-39px', top: '4px', width: '14px', height: '14px', background: '#333', borderRadius: '50%' }} />
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Q1 2027: Proof of Work Credentials</h3>
            <p style={{ color: '#888' }}>Protocols can airdrop "Completed Bounty" badges natively to the developer's YoChain profile.</p>
          </div>
        </div>
      </div>
    )
  }
];

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const nextSlide = useCallback(() => {
    setCurrentSlide(c => Math.min(c + 1, slides.length - 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(c => Math.max(c - 1, 0));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'Enter') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape') {
        router.push('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, router]);

  return (
    <div style={{ 
      width: '100vw', height: '100vh', 
      background: '#000', color: '#fff', 
      overflow: 'hidden', position: 'relative',
      fontFamily: "'Space Grotesk', sans-serif"
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.5,
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(20,241,149,0.15) 0%, transparent 60%)',
        filter: 'blur(60px)', zIndex: 0
      }} />
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(153,69,255,0.15) 0%, transparent 60%)',
        filter: 'blur(60px)', zIndex: 0
      }} />

      {/* Header / Nav indicator */}
      <div style={{ position: 'absolute', top: '2rem', left: '2rem', right: '2rem', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#555' }}>
          YoChain // Colosseum Submission
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#555', display: 'flex', gap: '0.5rem' }}>
          {slides.map((_, i) => (
            <div key={i} style={{ width: '30px', height: '2px', background: i === currentSlide ? '#14F195' : '#333', transition: 'background 0.3s' }} />
          ))}
        </div>
      </div>

      {/* Main Slide Content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
        <div 
          key={currentSlide}
          style={{
            animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            width: '100%', display: 'flex', justifyContent: 'center'
          }}
        >
          {slides[currentSlide].content}
        </div>
      </div>

      {/* Navigation Controls (Visible on hover or mobile) */}
      <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 10, display: 'flex', gap: '1rem' }}>
        <button onClick={prevSlide} disabled={currentSlide === 0} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#111', border: '1px solid #333', color: '#fff', cursor: currentSlide === 0 ? 'not-allowed' : 'pointer', opacity: currentSlide === 0 ? 0.3 : 1 }}>←</button>
        <button onClick={nextSlide} disabled={currentSlide === slides.length - 1} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#14F195', border: 'none', color: '#000', cursor: currentSlide === slides.length - 1 ? 'not-allowed' : 'pointer', opacity: currentSlide === slides.length - 1 ? 0.3 : 1 }}>→</button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@400;600;700;800&display=swap');
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
