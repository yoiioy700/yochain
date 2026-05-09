'use client';

import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import Link from 'next/link';

/* eslint-disable @next/next/no-img-element */

interface Builder {
  username: string;
  name: string;
  role: string;
  photo: string;
  score: number;
  ecosystems: string[];
  focus: string[] | string;
  available: boolean;
  profileUrl: string;
  savedAt: string;
}

export default function LeaderboardPage() {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'all' | 'weekly' | 'monthly'>('all');

  useEffect(() => {
    fetch('/api/profiles')
      .then(r => r.json())
      .then((data: Builder[]) => {
        let list = [...data];

        if (period === 'weekly') {
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          list = list.filter(b => new Date(b.savedAt) > weekAgo);
        } else if (period === 'monthly') {
          const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          list = list.filter(b => new Date(b.savedAt) > monthAgo);
        }

        setBuilders(list.sort((a, b) => b.score - a.score));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  const topThree = builders.slice(0, 3);
  const rest = builders.slice(3);

  return (
    <>
      <Nav />
      <style dangerouslySetInnerHTML={{__html:`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        .podium-card { transition: transform 0.2s, border-color 0.2s; }
        .podium-card:hover { transform: translateY(-4px); border-color: #14F195 !important; }
        .row-item { transition: background 0.15s; }
        .row-item:hover { background: rgba(20,241,149,0.03) !important; }
        .reveal-row { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; transform: translateY(12px); }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
      `}}/>

      <main style={{ background: '#000', minHeight: '100vh', fontFamily: "'Space Grotesk', sans-serif", paddingTop: '80px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>

          {/* Header */}
          <div className="reveal-row" style={{ marginBottom: '5rem' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#9945FF', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem' }}>// RANKINGS</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
              <h1 style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 700, color: '#fff', margin: 0, textTransform: 'uppercase', lineHeight: 0.85, letterSpacing: '-0.04em' }}>LEADERBOARD</h1>
              <div style={{ display: 'flex', border: '1px solid #222', overflow: 'hidden' }}>
                {(['all', 'monthly', 'weekly'] as const).map(p => (
                  <button key={p} onClick={() => setPeriod(p)} style={{ padding: '0.6rem 1.25rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', background: period === p ? '#14F195' : '#050505', color: period === p ? '#000' : '#666', border: 'none', cursor: 'pointer', fontWeight: period === p ? 700 : 400, transition: 'all 0.2s' }}>
                    {p === 'all' ? 'All Time' : p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '6rem', fontFamily: "'JetBrains Mono', monospace", color: '#333', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              FETCHING_RANKINGS...
            </div>
          )}

          {/* Empty State */}
          {!loading && builders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '6rem', border: '1px dashed #222' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: '#444', textTransform: 'uppercase', marginBottom: '1rem' }}>NO_BUILDERS_ON_LEADERBOARD_YET</div>
              <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '2rem', lineHeight: 1.6 }}>
                Publish your profile first via the Builder to appear on the leaderboard.
              </p>
              <Link href="/builder" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#000', background: '#14F195', padding: '0.75rem 1.5rem', textDecoration: 'none', fontWeight: 700, textTransform: 'uppercase' }}>
                BUILD YOUR PROFILE →
              </Link>
            </div>
          )}

          {/* PODIUM — Top 3 */}
          {!loading && topThree.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: `1fr ${topThree.length >= 2 ? '1.15fr' : ''} ${topThree.length >= 3 ? '1fr' : ''}`.trim(), gap: '1px', marginBottom: '1px', background: '#111', alignItems: 'end' }}>
              {/* 2nd — only show if exists */}
              {topThree[1] && (
                <div className="podium-card" style={{ background: '#000', padding: '2.5rem 2rem', border: '1px solid #1a1a1a', borderBottom: 'none' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.5rem', color: '#888', fontWeight: 800, marginBottom: '1.5rem' }}>#2</div>
                  <img src={topThree[1].photo} alt="" style={{ width: '60px', height: '60px', border: '1px solid #333', objectFit: 'cover', filter: 'grayscale(50%)', marginBottom: '1rem' }} onError={e => { e.currentTarget.style.background='#111'; e.currentTarget.src=''; }} />
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{topThree[1].name || topThree[1].username}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem', marginBottom: '1.5rem' }}>{topThree[1].role}</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', fontFamily: "'JetBrains Mono', monospace" }}>{topThree[1].score}</div>
                </div>
              )}

              {/* 1st */}
              <div className="podium-card" style={{ background: '#000', padding: '3.5rem 2rem 2.5rem', border: '1px solid #1a1a1a', borderBottom: 'none', borderTop: '2px solid #14F195' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '2rem', color: '#14F195', fontWeight: 800, marginBottom: '1.5rem' }}>#1</div>
                <img src={topThree[0].photo} alt="" style={{ width: '72px', height: '72px', border: '1px solid #14F195', objectFit: 'cover', marginBottom: '1rem' }} onError={e => { e.currentTarget.style.background='#111'; e.currentTarget.src=''; }} />
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{topThree[0].name || topThree[0].username}</div>
                <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem', marginBottom: '1.5rem' }}>{topThree[0].role}</div>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#14F195', fontFamily: "'JetBrains Mono', monospace", lineHeight: 0.9 }}>{topThree[0].score}</div>
                {topThree[0].profileUrl && (
                  <Link href={topThree[0].profileUrl} target="_blank" style={{ display: 'inline-block', marginTop: '1.5rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#000', background: '#14F195', padding: '0.6rem 1.25rem', textDecoration: 'none', fontWeight: 700, textTransform: 'uppercase' }}>VIEW PROFILE →</Link>
                )}
              </div>

              {/* 3rd — only show if exists */}
              {topThree[2] && (
                <div className="podium-card" style={{ background: '#000', padding: '2rem', border: '1px solid #1a1a1a', borderBottom: 'none' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.5rem', color: '#666', fontWeight: 800, marginBottom: '1.5rem' }}>#3</div>
                  <img src={topThree[2].photo} alt="" style={{ width: '60px', height: '60px', border: '1px solid #333', objectFit: 'cover', filter: 'grayscale(50%)', marginBottom: '1rem' }} onError={e => { e.currentTarget.style.background='#111'; e.currentTarget.src=''; }} />
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{topThree[2].name || topThree[2].username}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem', marginBottom: '1.5rem' }}>{topThree[2].role}</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', fontFamily: "'JetBrains Mono', monospace" }}>{topThree[2].score}</div>
                </div>
              )}
            </div>
          )}

          {/* Table — Rest */}
          {!loading && rest.length > 0 && (
            <div style={{ border: '1px solid #111', borderTop: 'none' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 120px 160px', padding: '0.75rem 2rem', borderBottom: '1px solid #1a1a1a', background: '#050505' }}>
                {['#', 'BUILDER', 'SCORE', 'ECOSYSTEM'].map((h, i) => (
                  <div key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</div>
                ))}
              </div>
              {rest.map((b, i) => (
                <div key={i} className="row-item reveal-row" style={{ display: 'grid', gridTemplateColumns: '48px 1fr 120px 160px', padding: '1.25rem 2rem', borderBottom: i < rest.length - 1 ? '1px solid #0d0d0d' : 'none', alignItems: 'center', animationDelay: `${i * 0.05}s`, background: '#000' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', color: '#444', fontWeight: 700 }}>{i + 4}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={b.photo} alt="" style={{ width: '36px', height: '36px', border: '1px solid #222', objectFit: 'cover', filter: 'grayscale(70%)' }} onError={e => { e.currentTarget.style.background='#111'; e.currentTarget.src=''; }} />
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>{b.name || b.username}</div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>{b.role}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>{b.score}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {(b.ecosystems || []).slice(0, 2).map((eco, j) => (
                      <span key={j} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: '#14F195', border: '1px solid rgba(20,241,149,0.2)', padding: '0.15rem 0.4rem' }}>{eco}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  );
}
