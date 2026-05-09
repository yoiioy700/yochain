'use client';

import { useEffect, useState } from 'react';

type GitHubData = {
  username: string;
  publicRepos: number;
  totalStars: number;
  topLanguages: string[];
  createdAt: string;
  totalContributions: number;
  error?: string;
};

export default function GitHubStats({ username }: { username: string }) {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    
    let isMounted = true;
    setLoading(true);

    fetch(`/api/github/${username}`)
      .then(res => res.json())
      .then(json => {
        if (isMounted) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Error fetching GitHub stats:', err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [username]);

  if (loading) {
    return (
      <div style={{ padding: '1.5rem', background: '#111', borderRadius: '12px', border: '1px solid #222' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#222', animation: 'pulse 1.5s infinite' }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: '20px', width: '150px', background: '#222', borderRadius: '4px', marginBottom: '0.5rem', animation: 'pulse 1.5s infinite' }} />
            <div style={{ height: '14px', width: '100px', background: '#222', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          <div style={{ height: '80px', background: '#222', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
          <div style={{ height: '80px', background: '#222', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
          <div style={{ height: '80px', background: '#222', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}} />
      </div>
    );
  }

  if (!data || data.error) {
    return null;
  }

  const joinDate = new Date(data.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });

  return (
    <div style={{ padding: '1.5rem', background: 'linear-gradient(145deg, #111, #0a0a0a)', borderRadius: '12px', border: '1px solid #333' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#fff' }}>
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{data.username}</h3>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bergabung pada {joinDate}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Public Repos</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>{data.publicRepos}</div>
        </div>
        <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Total Stars</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F1C40F' }}>{data.totalStars}</div>
        </div>
        <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Contributions</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#14F195' }}>{data.totalContributions.toLocaleString('id-ID')}</div>
        </div>
      </div>

      {data.topLanguages.length > 0 && (
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Top Languages</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {data.topLanguages.map(lang => (
              <span key={lang} style={{ padding: '0.2rem 0.6rem', background: '#222', border: '1px solid #333', borderRadius: '100px', fontSize: '0.75rem', color: '#ccc' }}>
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
