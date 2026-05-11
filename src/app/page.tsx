'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import Nav from '@/components/Nav';

export default function LandingPage() {
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Nav />
      <main style={{ overflow: 'hidden' }}>

        {/* ── HERO ── */}
        <section style={{
          minHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(4rem,10vw,8rem) clamp(1.5rem,5vw,4rem)',
          position: 'relative',
          borderBottom: '1px solid #1a1a1a',
        }}>
          {/* grid bg */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            opacity: 0.35,
          }} />
          {/* orange glow */}
          <div aria-hidden style={{
            position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
            width: '800px', height: '500px',
            background: 'radial-gradient(ellipse, rgba(255,68,0,0.12) 0%, transparent 70%)',
            zIndex: 0, pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
            <div style={{
              opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#FF4400', fontWeight: 700, marginBottom: '1.5rem',
              }}>
                ◆ Web3 Developer Identity
              </p>
              <h1 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(3.2rem, 9vw, 7.5rem)',
                fontWeight: 700, lineHeight: 0.92, letterSpacing: '-0.03em',
                color: '#e8e8e8', marginBottom: '2rem',
              }}>
                Your onchain<br />
                story,{' '}
                <em style={{ color: '#FF4400', fontStyle: 'normal' }}>proven.</em>
              </h1>
              <p style={{
                fontSize: 'clamp(1rem,2vw,1.25rem)', color: '#666',
                maxWidth: '520px', lineHeight: 1.65, marginBottom: '3rem',
              }}>
                Connect GitHub. YoChain builds a stunning developer CV backed by
                your real onchain activity on Solana — mintable as an NFT identity.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  id="hero-cta-github"
                  onClick={() => session?.user ? window.location.href = '/builder' : signIn('github')}
                  style={{
                    background: '#FF4400', color: '#fff',
                    border: 'none', borderRadius: '100px',
                    padding: '0.9rem 2.2rem', fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                    transition: 'transform 0.2s, opacity 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  {session?.user ? 'Go to Builder →' : 'Start with GitHub →'}
                </button>
                <Link
                  href="/builders"
                  style={{
                    color: '#555', fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none',
                    borderBottom: '1px solid #333', paddingBottom: '2px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#e8e8e8')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                >
                  Browse Builders
                </Link>
              </div>
            </div>

            {/* stat strip */}
            <div style={{
              display: 'flex', gap: 'clamp(2rem,5vw,5rem)', marginTop: 'clamp(4rem,8vw,7rem)',
              flexWrap: 'wrap',
              opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)',
              transition: 'opacity 0.7s 0.3s ease, transform 0.7s 0.3s ease',
            }}>
              {[
                { val: 'Solana', lbl: 'Native Chain' },
                { val: 'NFT', lbl: 'Identity Minting' },
                { val: 'Blinks', lbl: 'Tipping via X' },
                { val: 'Free', lbl: 'Forever' },
              ].map(s => (
                <div key={s.lbl}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 700, color: '#e8e8e8', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: '0.72rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '0.4rem' }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{
          padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,4rem)',
          borderBottom: '1px solid #1a1a1a',
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF4400', fontWeight: 700, marginBottom: '1rem', fontFamily: "'Space Grotesk', sans-serif" }}>
              How it works
            </p>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, color: '#e8e8e8', marginBottom: 'clamp(3rem,6vw,5rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Three steps.<br />One identity.
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0' }}>
              {[
                {
                  num: '01',
                  title: 'Connect GitHub',
                  body: 'Sign in with GitHub OAuth. We pull your real contribution data — repos, stars, languages, commits — automatically.',
                },
                {
                  num: '02',
                  title: 'Build Your Profile',
                  body: 'Fill in your Solana wallet and bio. YoChain composes an editorial-grade developer CV from your activity.',
                },
                {
                  num: '03',
                  title: 'Mint & Share',
                  body: 'Mint your identity as a Metaplex Core NFT on Solana Devnet. Share your profile link and enable tipping via Solana Blinks.',
                },
              ].map((step, i) => (
                <div key={step.num} style={{
                  padding: '2.5rem',
                  borderLeft: i === 0 ? '1px solid #1a1a1a' : '1px solid #1a1a1a',
                  borderTop: '1px solid #1a1a1a',
                  borderBottom: '1px solid #1a1a1a',
                  borderRight: i === 2 ? '1px solid #1a1a1a' : 'none',
                  position: 'relative',
                  transition: 'background 0.3s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,68,0,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '3.5rem', fontWeight: 700, color: '#1e1e1e', lineHeight: 1, marginBottom: '1.5rem' }}>{step.num}</div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#e8e8e8', marginBottom: '0.75rem' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.65 }}>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{
          padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,4rem)',
          borderBottom: '1px solid #1a1a1a',
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF4400', fontWeight: 700, marginBottom: '1rem', fontFamily: "'Space Grotesk', sans-serif" }}>
              Features
            </p>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, color: '#e8e8e8', marginBottom: 'clamp(3rem,6vw,5rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Everything a dev<br />identity needs.
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5px', background: '#1a1a1a' }}>
              {[
                {
                  tag: 'GitHub Integration',
                  title: 'Real contribution data',
                  body: 'No fake numbers. Your repos, stars, top languages, and commit history are pulled live from GitHub API.',
                  accent: '#FF4400',
                },
                {
                  tag: 'Solana Native',
                  title: 'NFT Identity Minting',
                  body: 'Mint your developer profile as a Metaplex Core NFT. Your onchain reputation, permanently yours.',
                  accent: '#14F195',
                },
                {
                  tag: 'Solana Blinks',
                  title: 'Tip via X / Twitter',
                  body: 'Share your Blinks URL and let anyone send SOL directly to your wallet from any tweet or link.',
                  accent: '#9945FF',
                },
                {
                  tag: 'Editorial CV',
                  title: 'Beautiful by default',
                  body: 'A dark, editorial-grade profile layout. Exportable as PDF. No template, just your story.',
                  accent: '#FF4400',
                },
                {
                  tag: 'Public Directory',
                  title: 'Builder Leaderboard',
                  body: 'Get discovered. Your profile lives in a searchable directory of verified Web3 builders on Solana.',
                  accent: '#14F195',
                },
                {
                  tag: 'Zero Cost',
                  title: 'Free to use',
                  body: 'YoChain is free. Only pay Solana transaction fees when minting — fractions of a cent.',
                  accent: '#FF4400',
                },
              ].map(f => (
                <div key={f.title} style={{
                  background: '#040404', padding: '2.5rem',
                  transition: 'background 0.3s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#0a0a0a')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#040404')}
                >
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: f.accent, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
                    marginBottom: '1.25rem',
                    padding: '0.3rem 0.7rem',
                    border: `1px solid ${f.accent}33`,
                    borderRadius: '100px',
                  }}>{f.tag}</span>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', fontWeight: 700, color: '#e8e8e8', marginBottom: '0.75rem' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.65 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROFILE PREVIEW ── */}
        <section style={{
          padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,4rem)',
          borderBottom: '1px solid #1a1a1a',
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF4400', fontWeight: 700, marginBottom: '1rem', fontFamily: "'Space Grotesk', sans-serif" }}>
                Profile Preview
              </p>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 700, color: '#e8e8e8', marginBottom: '1.5rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                A CV that speaks<br />onchain.
              </h2>
              <p style={{ fontSize: '1rem', color: '#555', lineHeight: 1.7, marginBottom: '2rem' }}>
                Your profile shows real GitHub stats, your Solana wallet, top languages, 
                skills, and onchain activity — all in one shareable link.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Share a link — no signup required for viewers', 'Export as PDF in one click', 'Mintable as NFT with your metadata onchain', 'Receiveable tips via Solana Blinks'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem', color: '#888' }}>
                    <span style={{ color: '#14F195', flexShrink: 0, marginTop: '2px' }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* mock profile card */}
            <div style={{
              background: '#0a0a0a', border: '1px solid #1e1e1e',
              borderRadius: '4px', overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            }}>
              {/* card header */}
              <div style={{ background: '#111', borderBottom: '1px solid #1e1e1e', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {['#FF5F57', '#FEBC2E', '#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
                <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', color: '#333', fontFamily: 'monospace' }}>yochain.tech/cv/devbuilder</span>
              </div>
              <div style={{ padding: '2rem' }}>
                {/* avatar + name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF4400 0%, #ff6600 100%)' }} />
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#e8e8e8', fontSize: '1rem' }}>Dev Builder</div>
                    <div style={{ fontSize: '0.75rem', color: '#555' }}>5xKt...9mZq · Solana Devnet</div>
                  </div>
                </div>
                {/* stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {[['142', 'Repos'], ['3.8k', 'Stars'], ['24', 'Score']].map(([v, l]) => (
                    <div key={l} style={{ background: '#040404', border: '1px solid #1a1a1a', padding: '0.85rem', textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.2rem', color: '#e8e8e8' }}>{v}</div>
                      <div style={{ fontSize: '0.65rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l}</div>
                    </div>
                  ))}
                </div>
                {/* languages */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.65rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Top Languages</div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {['TypeScript', 'Rust', 'Go', 'Python'].map(lang => (
                      <span key={lang} style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', border: '1px solid #1e1e1e', color: '#555', borderRadius: '100px' }}>{lang}</span>
                    ))}
                  </div>
                </div>
                {/* blink badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(153,69,255,0.06)', border: '1px solid rgba(153,69,255,0.15)', borderRadius: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9945FF' }}>◆</span>
                  <span style={{ fontSize: '0.78rem', color: '#666' }}>Solana Blinks tipping enabled</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{
          padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,4rem)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div aria-hidden style={{
            position: 'absolute', bottom: '-40%', left: '50%', transform: 'translateX(-50%)',
            width: '700px', height: '400px',
            background: 'radial-gradient(ellipse, rgba(255,68,0,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 700, color: '#e8e8e8', letterSpacing: '-0.03em', lineHeight: 0.95, marginBottom: '1.5rem' }}>
              Ready to go<br /><em style={{ color: '#FF4400', fontStyle: 'normal' }}>onchain?</em>
            </h2>
            <p style={{ fontSize: '1rem', color: '#555', marginBottom: '2.5rem', lineHeight: 1.65 }}>
              Free to start. Connect GitHub and your Solana wallet in under two minutes.
            </p>
            <button
              id="cta-bottom-github"
              onClick={() => signIn('github')}
              style={{
                background: '#FF4400', color: '#fff', border: 'none',
                borderRadius: '100px', padding: '1rem 2.8rem',
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                fontSize: '1.05rem', cursor: 'pointer',
                transition: 'transform 0.2s, opacity 0.2s',
                boxShadow: '0 0 40px rgba(255,68,0,0.25)',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
            >
              Start Building — it&apos;s free
            </button>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          borderTop: '1px solid #1a1a1a',
          padding: '2rem clamp(1.5rem,5vw,4rem)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
        }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#e8e8e8' }}>
            Yo<span style={{ color: '#FF4400' }}>Chain</span>
          </span>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[['Builders', '/builders'], ['Leaderboard', '/leaderboard']].map(([label, href]) => (
              <Link key={href} href={href} style={{ fontSize: '0.82rem', color: '#444', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#888')}
                onMouseLeave={e => (e.currentTarget.style.color = '#444')}
              >{label}</Link>
            ))}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#333' }}>Built on Solana · {new Date().getFullYear()}</span>
        </footer>

      </main>

      <style>{`
        @media (max-width: 768px) {
          section > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
