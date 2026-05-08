'use client';

import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import Link from 'next/link';

/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */

interface Builder {
  username: string;
  name: string;
  role: string;
  photo: string;
  score: number;
  ecosystems: string[];
  focus: string;
  available: boolean;
  gh: string;
  tw: string;
  sol: string;
  profileUrl: string;
  savedAt: string;
}

const ALL_ECOSYSTEMS = ['All', 'Solana', 'Superteam', 'DeFi', 'NFTs', 'Base'];
const ALL_FOCUS = ['All Focus', 'Building New Project', 'Open for Hire', 'Looking for Co-founder', 'Raising Seed/Grants', 'Exploring Opportunities'];

export default function BuildersPage() {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ecoFilter, setEcoFilter] = useState('All');
  const [focusFilter, setFocusFilter] = useState('All Focus');
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    fetch('/api/profiles')
      .then(r => r.json())
      .then((data: Builder[]) => {
        // sort by score desc
        setBuilders(data.sort((a, b) => b.score - a.score));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = builders.filter(b => {
    const matchSearch = !search || b.name?.toLowerCase().includes(search.toLowerCase()) || b.role?.toLowerCase().includes(search.toLowerCase());
    const matchEco = ecoFilter === 'All' || b.ecosystems?.includes(ecoFilter);
    const matchFocus = focusFilter === 'All Focus' || b.focus === focusFilter;
    const matchAvail = !availableOnly || b.available;
    return matchSearch && matchEco && matchFocus && matchAvail;
  });

  return (
    <>
      <Nav />
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        .builder-card { transition: border-color 0.2s; }
        .builder-card:hover { border-color: #14F195 !important; }
        .filter-chip { transition: all 0.2s; cursor: pointer; }
        .filter-chip:hover { border-color: #14F195 !important; color: #14F195 !important; }
        .reveal { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; transform: translateY(20px); }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
      `}} />

      <main style={{ background: '#000', minHeight: '100vh', fontFamily: "'Space Grotesk', sans-serif", paddingTop: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>

          {/* Header */}
          <div className="reveal" style={{ marginBottom: '4rem' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#14F195', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem' }}>// NETWORK</div>
            <h1 style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 700, color: '#fff', margin: 0, textTransform: 'uppercase', lineHeight: 0.85, letterSpacing: '-0.04em' }}>BUILDERS</h1>
            <p style={{ fontSize: '1.2rem', color: '#666', marginTop: '1.5rem', maxWidth: '500px', lineHeight: 1.5 }}>
              Discover verified Solana builders ranked by their onchain reputation score.
            </p>
            <div style={{ display: 'flex', gap: '3rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #222' }}>
              {[
                { label: 'TOTAL_BUILDERS', val: builders.length },
                { label: 'AVAILABLE', val: builders.filter(b => b.available).length },
                { label: 'ECOSYSTEMS', val: [...new Set(builders.flatMap(b => b.ecosystems || []))].length },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{s.label}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <input type="text" placeholder="SEARCH_BUILDER..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: '#050505', border: '1px solid #333', color: '#fff', padding: '1rem 1.5rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', width: '100%', outline: 'none', letterSpacing: '0.05em' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', marginRight: '0.5rem' }}>ECOSYSTEM:</span>
              {ALL_ECOSYSTEMS.map(eco => (
                <button key={eco} className="filter-chip" onClick={() => setEcoFilter(eco)}
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', padding: '0.4rem 0.9rem', border: '1px solid', borderColor: ecoFilter === eco ? '#14F195' : '#333', color: ecoFilter === eco ? '#14F195' : '#666', background: ecoFilter === eco ? 'rgba(20,241,149,0.05)' : 'transparent', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {eco}
                </button>
              ))}
              <button className="filter-chip" onClick={() => setAvailableOnly(v => !v)}
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', padding: '0.4rem 0.9rem', border: '1px solid', borderColor: availableOnly ? '#14F195' : '#333', color: availableOnly ? '#14F195' : '#666', background: availableOnly ? 'rgba(20,241,149,0.05)' : 'transparent', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: 'auto' }}>
                AVAILABLE
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', marginRight: '0.5rem' }}>FOCUS:</span>
              {ALL_FOCUS.map(f => (
                <button key={f} className="filter-chip" onClick={() => setFocusFilter(f)}
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', padding: '0.4rem 0.9rem', border: '1px solid', borderColor: focusFilter === f ? '#9945FF' : '#333', color: focusFilter === f ? '#9945FF' : '#666', background: focusFilter === f ? 'rgba(153,69,255,0.05)' : 'transparent', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '6rem', fontFamily: "'JetBrains Mono', monospace", color: '#333', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              FETCHING_BUILDERS...
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '6rem', border: '1px dashed #222' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: '#444', textTransform: 'uppercase', marginBottom: '1rem' }}>
                {builders.length === 0 ? 'NO_PROFILES_PUBLISHED_YET' : 'NO_BUILDERS_MATCH_FILTER'}
              </div>
              {builders.length === 0 && (
                <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '2rem', lineHeight: 1.6 }}>
                  Be the first. Fill your profile and click <strong style={{color:'#14F195'}}>"Copy Share Link"</strong> or <strong style={{color:'#14F195'}}>"View Profile & Mint"</strong> in the Builder to publish.
                </p>
              )}
              <Link href="/builder" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#000', background: '#14F195', padding: '0.75rem 1.5rem', textDecoration: 'none', fontWeight: 700, textTransform: 'uppercase' }}>
                GO TO BUILDER →
              </Link>
            </div>
          )}

          {/* Grid */}
          {!loading && filtered.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1px', background: '#111' }}>
              {filtered.map((b, i) => (
                <div key={i} className="builder-card" style={{ background: '#000', padding: '2rem', border: '1px solid #111', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#333' }}>#{i + 1}</div>
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    {b.photo ? (
                      <img src={b.photo} alt={b.name} style={{ width: '56px', height: '56px', border: '1px solid #333', objectFit: 'cover', filter: 'grayscale(50%)' }} onError={e => { e.currentTarget.style.background = '#111'; e.currentTarget.src = ''; }} />
                    ) : (
                      <div style={{ width: '56px', height: '56px', background: '#111', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '1.2rem', color: '#333' }}>
                        {b.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{b.name || b.username}</div>
                      <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' }}>{b.role || 'Web3 Builder'}</div>
                      {b.available && <div style={{ fontSize: '0.6rem', fontFamily: "'JetBrains Mono', monospace", color: '#14F195', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AVAILABLE</div>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.55rem', fontFamily: "'JetBrains Mono', monospace", color: '#666', marginBottom: '0.2rem', textTransform: 'uppercase' }}>SCORE</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#14F195', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{b.score}</div>
                    </div>
                  </div>

                  {b.ecosystems?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                      {b.ecosystems.map((eco, j) => (
                        <span key={j} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#14F195', border: '1px solid rgba(20,241,149,0.25)', padding: '0.2rem 0.5rem', background: 'rgba(20,241,149,0.04)' }}>{eco}</span>
                      ))}
                    </div>
                  )}

                  {b.focus && (
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#9945FF', border: '1px solid rgba(153,69,255,0.3)', padding: '0.4rem 0.75rem', display: 'inline-block', marginBottom: '1.5rem', background: 'rgba(153,69,255,0.04)' }}>
                      {b.focus}
                    </div>
                  )}

                  {b.profileUrl ? (
                    <Link href={b.profileUrl} target="_blank" style={{ display: 'block', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#000', background: '#14F195', padding: '0.75rem', fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      VIEW PROFILE →
                    </Link>
                  ) : (
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#333', border: '1px solid #1a1a1a', padding: '0.75rem', textAlign: 'center', textTransform: 'uppercase' }}>PROFILE_NOT_PUBLISHED</div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  );
}
