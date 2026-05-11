'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

const slides = [
  // 01: TITLE
  {
    id: 'title',
    content: (
      <div className="slide-content" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10vw' }}>
        <div className="stagger-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#14F195', fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>
          // Colosseum Hackathon Submission
        </div>
        <h1 className="stagger-2" style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 800, lineHeight: 0.9, letterSpacing: '-0.04em', textTransform: 'uppercase', color: '#fff', margin: '0 0 2rem 0' }}>
          Resumes<br/>
          Are <span style={{ color: '#ff3333', textDecoration: 'line-through' }}>Dead</span>.
        </h1>
        <p className="stagger-3" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', color: '#888', maxWidth: '600px', lineHeight: 1.4 }}>
          Stop sending static PDFs.<br/>
          Start proving your worth on-chain.
        </p>
        <div className="stagger-4" style={{ marginTop: '4rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ width: '60px', height: '2px', background: '#333' }} />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#555', letterSpacing: '0.1em' }}>PRESS [SPACE] TO CONTINUE</div>
        </div>
      </div>
    )
  },
  // 02: THE PROBLEM
  {
    id: 'problem',
    content: (
      <div className="slide-content" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', padding: '10vw' }}>
        <div style={{ position: 'absolute', right: '-5vw', top: '50%', transform: 'translateY(-50%)', fontSize: '40vw', fontWeight: 800, color: 'rgba(255,255,255,0.02)', lineHeight: 0.8, pointerEvents: 'none', userSelect: 'none' }}>01</div>
        
        <div style={{ maxWidth: '800px', zIndex: 1 }}>
          <div className="stagger-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#ff3333', fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '3rem' }}>
            // The Problem
          </div>
          <h2 className="stagger-2" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', color: '#fff', marginBottom: '4rem' }}>
            Web3 hiring is<br/>90% noise.
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div className="stagger-3" style={{ borderTop: '2px solid #ff3333', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem', fontWeight: 600 }}>Unverified Bullshit</h3>
              <p style={{ color: '#777', lineHeight: 1.6, fontSize: '0.95rem' }}>Web2 CVs are just text files full of self-reported claims. Anyone can write "Solana Expert" on a PDF.</p>
            </div>
            <div className="stagger-4" style={{ borderTop: '2px solid #333', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem', fontWeight: 600 }}>Split Identity</h3>
              <p style={{ color: '#777', lineHeight: 1.6, fontSize: '0.95rem' }}>A developer's code lives on GitHub. Their financial skin-in-the-game lives on-chain. Recruiters currently have to dig through both manually.</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  // 03: THE SOLUTION
  {
    id: 'solution',
    content: (
      <div className="slide-content" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', padding: '10vw' }}>
        <div style={{ position: 'absolute', right: '-5vw', top: '50%', transform: 'translateY(-50%)', fontSize: '40vw', fontWeight: 800, color: 'rgba(255,255,255,0.02)', lineHeight: 0.8, pointerEvents: 'none', userSelect: 'none' }}>02</div>
        
        <div style={{ maxWidth: '900px', zIndex: 1 }}>
          <div className="stagger-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#14F195', fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '3rem' }}>
            // The Solution
          </div>
          <h2 className="stagger-2" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', color: '#fff', marginBottom: '2rem' }}>
            The ultimate<br/>source of truth.
          </h2>
          <p className="stagger-3" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: '#888', maxWidth: '600px', lineHeight: 1.5, marginBottom: '4rem' }}>
            YoChain aggregates your real GitHub contributions and Solana on-chain footprint into a single, undeniable cryptographic identity.
          </p>
          
          <div className="stagger-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ padding: '1rem 1.5rem', border: '1px solid #333', color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>GH_COMMITS</div>
            <div style={{ padding: '1rem', color: '#555' }}>+</div>
            <div style={{ padding: '1rem 1.5rem', border: '1px solid #333', color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>SOL_TX_HISTORY</div>
            <div style={{ padding: '1rem', color: '#555' }}>=</div>
            <div style={{ padding: '1rem 1.5rem', background: '#14F195', color: '#000', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>VERIFIED_PROFILE</div>
          </div>
        </div>
      </div>
    )
  },
  // 04: KEY MECHANICS
  {
    id: 'mechanics',
    content: (
      <div className="slide-content" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10vw' }}>
        <div className="stagger-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#9945FF', fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4rem' }}>
          // How it actually works
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%' }}>
          {[
            { n: '01', t: 'Data Aggregation', d: 'We hit the GitHub API and Helius RPC simultaneously to parse your entire dev history, wallet age, and protocol interactions in milliseconds.', c: '#fff' },
            { n: '02', t: 'Identity Minting', d: 'Your profile isn\'t just a web page. It\'s minted directly to your wallet as a Metaplex Core NFT. It\'s your soulbound CV.', c: '#9945FF' },
            { n: '03', t: 'Direct Tipping', d: 'Native Solana Blinks integration. Anyone who sees your profile link on X (Twitter) can fund you directly from their timeline.', c: '#14F195' }
          ].map((f, i) => (
            <div key={i} className={`stagger-${i+2}`} style={{ padding: '2.5rem', background: '#050505', border: '1px solid #222', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '320px' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: f.c }} />
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#111', fontFamily: "'JetBrains Mono', monospace", marginBottom: '1rem', letterSpacing: '-0.05em' }}>{f.n}</div>
              <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.5rem', fontWeight: 600 }}>{f.t}</h3>
              <p style={{ color: '#777', lineHeight: 1.6, fontSize: '0.95rem', marginTop: 'auto' }}>{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  // 05: TECH STACK
  {
    id: 'tech',
    content: (
      <div className="slide-content" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', padding: '10vw' }}>
        <div style={{ position: 'absolute', right: '-5vw', top: '50%', transform: 'translateY(-50%)', fontSize: '40vw', fontWeight: 800, color: 'rgba(255,255,255,0.02)', lineHeight: 0.8, pointerEvents: 'none', userSelect: 'none' }}>04</div>
        
        <div style={{ maxWidth: '800px', zIndex: 1, width: '100%' }}>
          <div className="stagger-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#fff', fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '3rem' }}>
            // Architecture
          </div>
          <h2 className="stagger-2" style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', color: '#fff', marginBottom: '4rem' }}>
            Built for speed.
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { l: 'FRONTEND', r: 'Next.js 14 App Router + Pure CSS Animations' },
              { l: 'ON-CHAIN', r: 'Solana Web3.js + Metaplex UMI' },
              { l: 'RPC LAYER', r: 'Helius (Enriched TX Parsing)' },
              { l: 'DATABASE', r: 'Supabase PostgreSQL (Global Leaderboard)' }
            ].map((s, i) => (
              <div key={i} className={`stagger-${i+3}`} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', padding: '1.5rem 0', borderBottom: '1px solid #222', alignItems: 'center' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: i % 2 === 0 ? '#14F195' : '#9945FF', letterSpacing: '0.1em' }}>{s.l}</div>
                <div style={{ color: '#ccc', fontSize: '1.1rem' }}>{s.r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  // 06: DEMO
  {
    id: 'demo',
    content: (
      <div className="slide-content" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="stagger-1" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '1px solid rgba(20, 241, 149, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -20, border: '1px dashed rgba(20, 241, 149, 0.1)', borderRadius: '50%', animation: 'spin 10s linear infinite' }} />
          <div style={{ width: 0, height: 0, borderTop: '20px solid transparent', borderBottom: '20px solid transparent', borderLeft: '32px solid #14F195', marginLeft: '12px' }} />
        </div>
        <h2 className="stagger-2" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', color: '#fff', marginBottom: '1rem' }}>
          Talk is cheap.
        </h2>
        <p className="stagger-3" style={{ fontSize: '1.5rem', color: '#666' }}>Let's see it in action.</p>
        <div className="stagger-4" style={{ marginTop: '3rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#444', letterSpacing: '0.2em' }}>PRESS [ESC] TO EXIT TO APP</div>
      </div>
    )
  },
  // 07: ROADMAP
  {
    id: 'roadmap',
    content: (
      <div className="slide-content" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', padding: '10vw' }}>
        <div style={{ maxWidth: '800px', zIndex: 1 }}>
          <div className="stagger-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#fff', fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '3rem' }}>
            // What's Next
          </div>
          <h2 className="stagger-2" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', color: '#fff', marginBottom: '4rem' }}>
            The Road Ahead.
          </h2>
          
          <div style={{ position: 'relative', paddingLeft: '3rem' }}>
            <div style={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom, #14F195 0%, #333 50%, transparent 100%)' }} />
            
            <div className="stagger-3" style={{ position: 'relative', marginBottom: '4rem' }}>
              <div style={{ position: 'absolute', left: '-3rem', top: '0.5rem', width: '15px', height: '15px', background: '#000', border: '2px solid #14F195', borderRadius: '50%', boxShadow: '0 0 15px rgba(20,241,149,0.5)' }} />
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#14F195', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Q3 2026</div>
              <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem', fontWeight: 600 }}>Mainnet & Domains</h3>
              <p style={{ color: '#777', lineHeight: 1.6, maxWidth: '500px' }}>Deploy Core NFTs to Solana Mainnet. Allow users to map custom subdomains (e.g. <code>ariq.yochain.tech</code>).</p>
            </div>
            
            <div className="stagger-4" style={{ position: 'relative', marginBottom: '4rem' }}>
              <div style={{ position: 'absolute', left: '-3rem', top: '0.5rem', width: '15px', height: '15px', background: '#000', border: '2px solid #555', borderRadius: '50%' }} />
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#777', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Q4 2026</div>
              <h3 style={{ fontSize: '1.5rem', color: '#ccc', marginBottom: '0.5rem', fontWeight: 600 }}>Superteam Earn Integration</h3>
              <p style={{ color: '#666', lineHeight: 1.6, maxWidth: '500px' }}>Directly apply to Bounties & Grants using the YoChain verifiable identity profile in one click.</p>
            </div>
            
            <div className="stagger-5" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-3rem', top: '0.5rem', width: '15px', height: '15px', background: '#000', border: '2px solid #333', borderRadius: '50%' }} />
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#555', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Q1 2027</div>
              <h3 style={{ fontSize: '1.5rem', color: '#888', marginBottom: '0.5rem', fontWeight: 600 }}>On-chain Credentials</h3>
              <p style={{ color: '#555', lineHeight: 1.6, maxWidth: '500px' }}>Protocols can airdrop "Completed Bounty" badges natively to the developer's YoChain profile NFT.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom Mouse Spotlight Shader Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;
      containerRef.current.style.setProperty('--mouse-x', `${x}%`);
      containerRef.current.style.setProperty('--mouse-y', `${y}%`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const changeSlide = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex === currentSlide) return;
    
    setDirection(newIndex > currentSlide ? 1 : -1);
    setIsTransitioning(true);
    setCurrentSlide(newIndex);
    
    // Lock transitions for duration of animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);
  }, [currentSlide, isTransitioning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      
      if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'Enter') {
        if (currentSlide < slides.length - 1) changeSlide(currentSlide + 1);
      } else if (e.key === 'ArrowLeft') {
        if (currentSlide > 0) changeSlide(currentSlide - 1);
      } else if (e.key === 'Escape') {
        router.push('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isTransitioning, changeSlide, router]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100vw', height: '100vh', 
        background: '#000', color: '#fff', 
        overflow: 'hidden', position: 'relative',
        fontFamily: "'Space Grotesk', sans-serif",
        '--mouse-x': '50%',
        '--mouse-y': '50%',
      } as React.CSSProperties}
    >
      {/* Dynamic Cinematic Backgrounds */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(20,241,149,0.08) 0%, transparent 40%), radial-gradient(circle at calc(100% - var(--mouse-x)) calc(100% - var(--mouse-y)), rgba(153,69,255,0.05) 0%, transparent 40%)',
        transition: 'background 0.1s ease'
      }} />
      
      {/* Noise overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.5\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        opacity: 0.04, mixBlendMode: 'screen'
      }} />

      {/* Frame Borders */}
      <div style={{ position: 'absolute', inset: '2rem', border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 10 }} />

      {/* Progress Indicators */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', zIndex: 20, display: 'flex', gap: '0.5rem' }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => changeSlide(i)} style={{ width: '40px', height: '2px', background: i === currentSlide ? '#fff' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} />
        ))}
      </div>
      
      {/* Slide Counter */}
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#555' }}>
        {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>

      {/* Presentation Engine */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        const isPast = index < currentSlide;
        const isFuture = index > currentSlide;
        
        // Advanced cinematic clip-path reveal
        let clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
        if (!isActive) {
          if (direction > 0) {
            clipPath = isPast ? 'polygon(0 0, 0 0, 0 100%, 0 100%)' : 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)';
          } else {
            clipPath = isPast ? 'polygon(0 0, 0 0, 0 100%, 0 100%)' : 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)';
          }
        }

        return (
          <div 
            key={slide.id}
            className={\`slide-container \${isActive ? 'active' : ''}\`}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: isActive ? 5 : 1,
              clipPath: isActive ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' : clipPath,
              transition: 'clip-path 1s cubic-bezier(0.77, 0, 0.175, 1)',
              pointerEvents: isActive ? 'auto' : 'none',
              visibility: (isActive || isTransitioning) ? 'visible' : 'hidden'
            }}
          >
            {slide.content}
          </div>
        );
      })}

      <style dangerouslySetInnerHTML={{__html: \`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@400;600;700;800&display=swap');
        
        /* Staggered text animations triggered by active class */
        .slide-container.active .stagger-1 { animation: revealUp 1s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .slide-container.active .stagger-2 { animation: revealUp 1s 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .slide-container.active .stagger-3 { animation: revealUp 1s 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .slide-container.active .stagger-4 { animation: revealUp 1s 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .slide-container.active .stagger-5 { animation: revealUp 1s 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }

        @keyframes revealUp {
          from { opacity: 0; transform: translateY(40px); clip-path: polygon(0 0, 100% 0, 100% 0, 0 0); }
          to { opacity: 1; transform: translateY(0); clip-path: polygon(0 -100%, 100% -100%, 100% 200%, 0 200%); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      \`}} />
    </div>
  );
}
