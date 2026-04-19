'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Nav() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className="nav" style={{ boxShadow: scrolled ? '0 2px 12px oklch(0% 0 0 / 0.06)' : 'none' }}>
      <div className="container">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            Yo<span>Chain</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {session?.user && (
              <Link
                href="/builder"
                className="btn btn-primary"
                style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}
              >
                Go to Builder
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
