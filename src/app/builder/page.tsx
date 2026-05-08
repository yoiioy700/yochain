'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';

interface Entry { date: string; title: string; }
interface ProjectEntry { name: string; desc: string; url: string; tech: string; }

const emptyEntry = (): Entry => ({ date: '', title: '' });
const emptyProject = (): ProjectEntry => ({ name: '', desc: '', url: '', tech: '' });

// ─── EntryList MUST be outside BuilderPage to avoid re-mount on every keystroke ───
function EntryList({ label, entries, setter, datePlaceholder, titlePlaceholder }: {
  label: string; entries: Entry[];
  setter: React.Dispatch<React.SetStateAction<Entry[]>>;
  datePlaceholder: string; titlePlaceholder: string;
}) {
  const add    = () => setter(prev => [...prev, emptyEntry()]);
  const remove = (i: number) => setter(prev => prev.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Entry, val: string) =>
    setter(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  return (
    <div className="form-group" style={{ marginBottom: '2rem' }}>
      <label className="form-label">{label}</label>
      {entries.map((entry, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 40px', gap: '1px', marginBottom: '1rem', alignItems: 'start', background: 'var(--border-color)', border: '1px solid var(--border-color)' }}>
          <input type="text" className="form-input" placeholder={datePlaceholder} value={entry.date}
            onChange={e => update(i, 'date', e.target.value)}
            style={{ fontSize: '0.85rem', padding: '0.75rem', height: '100%', border: 'none', borderBottom: 'none' }} />
          <textarea className="form-input" placeholder={titlePlaceholder} value={entry.title}
            onChange={e => update(i, 'title', e.target.value)}
            style={{ fontSize: '0.85rem', padding: '0.75rem', minHeight: '60px', resize: 'none', border: 'none', borderBottom: 'none' }} />
          <button onClick={() => remove(i)}
            style={{ background: '#0a0a0a', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem', height: '100%', transition: 'color 0.2s' }}
            onMouseOver={e => e.currentTarget.style.color = '#fff'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>x</button>
        </div>
      ))}
      <button onClick={add} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem 1.5rem', marginTop: '0.5rem', borderRadius: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>+ Add {label}</button>
    </div>
  );
}

function ProjectList({ projects, setter }: {
  projects: ProjectEntry[];
  setter: React.Dispatch<React.SetStateAction<ProjectEntry[]>>;
}) {
  const add    = () => setter(prev => [...prev, emptyProject()]);
  const remove = (i: number) => setter(prev => prev.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof ProjectEntry, val: string) =>
    setter(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  return (
    <div className="form-group" style={{ marginBottom: '2rem' }}>
      <label className="form-label">Projects</label>
      {projects.map((p, i) => (
        <div key={i} style={{ background: 'transparent', borderLeft: '2px solid var(--accent-orange)', paddingLeft: '1.25rem', marginBottom: '1.5rem', position: 'relative' }}>
          <button onClick={() => remove(i)}
            style={{ position: 'absolute', top: 0, right: 0, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', padding: '0.5rem' }}>x</button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', marginBottom: '1px', background: 'var(--border-color)' }}>
            <input className="form-input" placeholder="Project Name" value={p.name}
              onChange={e => update(i, 'name', e.target.value)} style={{ border: 'none', borderBottom: 'none' }} />
            <input className="form-input" placeholder="https://github.com/..." value={p.url}
              onChange={e => update(i, 'url', e.target.value)} style={{ border: 'none', borderBottom: 'none' }} />
          </div>
          <div style={{ background: 'var(--border-color)', paddingBottom: '1px', marginBottom: '1px' }}>
            <textarea className="form-input" placeholder="Short description..." value={p.desc}
              onChange={e => update(i, 'desc', e.target.value)}
              style={{ minHeight: '80px', resize: 'none', border: 'none', borderBottom: 'none' }} />
          </div>
          <div style={{ background: 'var(--border-color)' }}>
            <input className="form-input" placeholder="Tech stack (e.g. Next.js, Solana)" value={p.tech}
              onChange={e => update(i, 'tech', e.target.value)} style={{ border: 'none', borderBottom: 'none' }} />
          </div>
        </div>
      ))}
      <button onClick={add} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem 1.5rem', marginTop: '0.5rem', borderRadius: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>+ Add Project</button>
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────────

export default function BuilderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { publicKey, connected } = useWallet();
  const [walletFilled, setWalletFilled] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
  }, [status, router]);

  const autofillWallet = useCallback(() => {
    if (!publicKey) return;
    setSolAddress(publicKey.toBase58());
    setWalletFilled(true);
    setTimeout(() => setWalletFilled(false), 2000);
  }, [publicKey]);

  const [photoUrl, setPhotoUrl] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [education, setEducation] = useState<Entry[]>([emptyEntry()]);
  const [experience, setExperience] = useState<Entry[]>([emptyEntry()]);
  const [projects, setProjects] = useState<ProjectEntry[]>([emptyProject()]);
  const [skillsLine, setSkillsLine] = useState('');
  const [languagesLine, setLanguagesLine] = useState('');
  const [certsLine, setCertsLine] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  const [solAddress, setSolAddress] = useState('');
  const [available, setAvailable] = useState(false);
  const [focus, setFocus] = useState('');
  const [ecosystemsLine, setEcosystemsLine] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (session?.user && !name) setName(session.user.name || '');
    if (session?.user?.image && !photoUrl) setPhotoUrl(session.user.image);
    if (session?.user?.email && !email) setEmail(session.user.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const parseList = (str: string) => str.split(',').filter(s => s.trim().length > 0).map(s => s.trim());
  const serializeEntries = (entries: Entry[]) =>
    entries.filter(e => e.date || e.title).map(e => `${e.date}: ${e.title}`).join(',');
  const serializeProjects = (ps: ProjectEntry[]) =>
    ps.filter(p => p.name).map(p => `${p.name}|${p.desc}|${p.url}|${p.tech}`).join(';;');

  const getEncodedData = () => {
    const dataObj = {
      p: photoUrl, n: name, r: role, b: bio, e: email,
      edu: serializeEntries(education),
      exp: serializeEntries(experience),
      proj: serializeProjects(projects),
      skl: skillsLine, lang: languagesLine, cert: certsLine,
      eco: ecosystemsLine, foc: focus,
      tw: twitterHandle, web: websiteUrl,
      sol: solAddress,
      avail: available ? '1' : '0',
      gh: (session as any)?.githubUsername || session?.user?.name || ''
    };
    return Buffer.from(JSON.stringify(dataObj)).toString('base64');
  };

  const cvUsername = (session as any)?.githubUsername || session?.user?.name || 'anonymous';
  const cvUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/cv/${cvUsername}?d=${getEncodedData()}`;

  const saveProfile = async () => {
    try {
      const reputationScore = (
        (skillsLine.split(',').filter(Boolean).length) * 5 +
        (twitterHandle ? 50 : 0) +
        (solAddress ? 30 : 0) +
        (experience.filter(e => e.title).length * 10) +
        (projects.filter(p => p.name).length * 20)
      );
      await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cvUsername,
          name,
          role,
          photo: photoUrl,
          ecosystems: ecosystemsLine.split(',').map(s => s.trim()).filter(Boolean),
          focus,
          available,
          score: reputationScore,
          gh: (session as any)?.githubUsername || session?.user?.name || '',
          tw: twitterHandle,
          sol: solAddress,
          profileUrl: cvUrl,
          savedAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error('Failed to save profile', err);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(cvUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    saveProfile();
  };

  if (status === 'loading') return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>Authenticating...</div>;

  return (
    <>
      <Nav />
      <div className="container">
        <div style={{ padding: '2rem 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 className="display" style={{ fontSize: '2rem' }}>Builder</h1>
            <p style={{ color: 'var(--text-muted)' }}>Fill in your details below.</p>
          </div>
          <button onClick={() => signOut()} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>Sign Out</button>
        </div>

        <div className="builder-layout">
          {/* ── Left: Form ── */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>

            {/* Tab Navigation */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border-color)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
              {[
                { id: 0, label: 'PROFILE' },
                { id: 1, label: 'BACKGROUND' },
                { id: 2, label: 'PROJECTS' },
                { id: 3, label: 'CONTACT' },
              ].map(tab => (
                <div key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{ padding: '0.75rem 0.5rem', cursor: 'pointer', textAlign: 'center',
                    background: activeTab === tab.id ? '#0f0f0f' : '#0a0a0a',
                    borderBottom: activeTab === tab.id ? '2px solid #14F195' : '2px solid transparent',
                    transition: 'all 0.15s' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1px', color: activeTab === tab.id ? '#14F195' : '#666' }}>{tab.label}</div>
                </div>
              ))}
            </div>

            {/* Tab 0: Profile */}
            {activeTab === 0 && (
              <div>
                {/* Available toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1rem', background: '#0a0a0a', border: '1px solid var(--border-color)', borderLeft: available ? '4px solid #14F195' : '4px solid #333', cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => setAvailable(v => !v)}>
                  <div style={{ width: '40px', height: '22px', background: available ? '#14F195' : '#222', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                    <div style={{ width: '14px', height: '14px', background: '#000', position: 'absolute', top: '4px', left: available ? '22px' : '4px', transition: 'left 0.2s' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: available ? '#14F195' : 'var(--text-muted)' }}>
                    {available ? 'Available for Work' : 'Not Available'}
                  </span>
                </div>
                <div className="form-group">
                  <label className="form-label">Photo (URL or Upload)</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" className="form-input" style={{ flex: 1 }} placeholder="https://..." value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} />
                    <label className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0 1rem', fontSize: '0.8rem', flexShrink: 0 }}>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('file', file);
                        const label = e.target.parentElement;
                        if(label) label.style.opacity = '0.5';
                        try {
                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          const data = await res.json();
                          if (data.url) setPhotoUrl(data.url);
                          else alert('Upload failed');
                        } catch (err) {
                          alert('Upload failed');
                        } finally {
                          if(label) label.style.opacity = '1';
                        }
                      }} />
                      Upload
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" placeholder="e.g. Satoshi Nakamoto" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Role / Title</label>
                  <input type="text" className="form-input" placeholder="e.g. Full Stack Developer" value={role} onChange={e => setRole(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Current Focus</label>
                  <select className="form-input" value={focus} onChange={e => setFocus(e.target.value)} style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                    <option value="">-- Select Focus --</option>
                    <option value="Building New Project">Building New Project</option>
                    <option value="Looking for Co-founder">Looking for Co-founder</option>
                    <option value="Raising Seed/Grants">Raising Seed/Grants</option>
                    <option value="Exploring Opportunities">Exploring Opportunities</option>
                    <option value="Open for Hire">Open for Hire</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Bio</span>
                    <span style={{ color: bio.length > 260 ? 'var(--accent-orange)' : 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{bio.length}/300</span>
                  </label>
                  <textarea className="form-input" placeholder="I am a passionate Web3 builder..."
                    value={bio} maxLength={300} onChange={e => setBio(e.target.value)} />
                </div>
              </div>
            )}

            {/* Tab 1: Background */}
            {activeTab === 1 && (
              <div>
                <EntryList label="Education" entries={education} setter={setEducation}
                  datePlaceholder="2020–2024" titlePlaceholder="Institut Teknologi Bandung" />
                <EntryList label="Experience" entries={experience} setter={setExperience}
                  datePlaceholder="2022–Now" titlePlaceholder="Freelance Designer" />
                <div className="form-group">
                  <label className="form-label">Skills (Comma Separated)</label>
                  <textarea className="form-input" placeholder="Photoshop, Next.js, Solana..." value={skillsLine} onChange={e => setSkillsLine(e.target.value)} style={{ minHeight: '80px' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Ecosystems (Comma Separated)</label>
                  <input type="text" className="form-input" placeholder="Solana, Superteam, Base..." value={ecosystemsLine} onChange={e => setEcosystemsLine(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Languages</label>
                  <input type="text" className="form-input" placeholder="Indonesian, English, Japanese" value={languagesLine} onChange={e => setLanguagesLine(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Certifications</label>
                  <input type="text" className="form-input" placeholder="AWS Cloud Practitioner, Solana Bootcamp" value={certsLine} onChange={e => setCertsLine(e.target.value)} />
                </div>
              </div>
            )}

            {/* Tab 2: Projects */}
            {activeTab === 2 && (
              <div>
                <ProjectList projects={projects} setter={setProjects} />
              </div>
            )}

            {/* Tab 3: Contact */}
            {activeTab === 3 && (
              <div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Twitter / X Handle</label>
                  <input type="text" className="form-input" placeholder="username (without @)" value={twitterHandle} onChange={e => setTwitterHandle(e.target.value.replace('@', ''))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Personal Website</label>
                  <input type="text" className="form-input" placeholder="https://..." value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Solana Address <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(for Onchain Score &amp; SNS)</span></span>
                    {connected && (
                      <button
                        type="button"
                        onClick={autofillWallet}
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          padding: '0.2rem 0.65rem',
                          background: walletFilled ? 'rgba(20,241,149,0.15)' : 'transparent',
                          border: '1px solid',
                          borderColor: walletFilled ? '#14F195' : 'rgba(20,241,149,0.4)',
                          color: walletFilled ? '#14F195' : 'rgba(20,241,149,0.7)',
                          borderRadius: '100px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {walletFilled ? 'Filled' : 'Autofill'}
                      </button>
                    )}
                  </label>
                  <input type="text" className="form-input" placeholder="5zi... (or click Autofill if wallet connected)" value={solAddress} onChange={e => setSolAddress(e.target.value)} />
                </div>

              </div>
            )}

            {/* Tab navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', alignItems: 'center' }}>
              <button onClick={() => setActiveTab(t => Math.max(0, t - 1))}
                className="btn btn-outline"
                style={{ fontSize: '0.75rem', padding: '0.5rem 1.5rem', borderRadius: 0, opacity: activeTab === 0 ? 0.3 : 1, pointerEvents: activeTab === 0 ? 'none' : 'auto' }}>
                ← PREV
              </button>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: 'center', letterSpacing: '1px' }}>{activeTab + 1} / 4</span>
              {activeTab === 3 ? (
                <button 
                  onClick={async () => {
                    setIsGenerating(true);
                    await saveProfile();
                    router.push(`/cv/${cvUsername}?d=${getEncodedData()}`);
                  }} 
                  disabled={isGenerating}
                  className="btn" 
                  style={{ background: '#14F195', color: '#000', fontWeight: 700, fontSize: '0.75rem', padding: '0.5rem 1.5rem', borderRadius: 0, textTransform: 'uppercase', opacity: isGenerating ? 0.7 : 1, cursor: isGenerating ? 'wait' : 'pointer' }}
                >
                  {isGenerating ? 'GENERATING...' : 'View Profile & Mint ↗'}
                </button>
              ) : (
                <button onClick={() => setActiveTab(t => Math.min(3, t + 1))}
                  className="btn btn-outline"
                  style={{ fontSize: '0.75rem', padding: '0.5rem 1.5rem', borderRadius: 0 }}>
                  NEXT →
                </button>
              )}
            </div>

          </div>

          {/* ── Right: Live Preview ── */}
          <div style={{ position: 'sticky', top: '76px' }}>
            {/* Publish Section (Moved here to be always accessible) */}
            <div className="builder-panel" style={{ background: 'rgba(20, 241, 149, 0.05)', borderColor: '#14F195', marginBottom: '1rem', padding: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#14F195', fontSize: '1.1rem' }}>Share Your Profile</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                <strong>Blink Ready:</strong> Paste your link on X (Twitter) to let people tip you SOL directly!
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn" onClick={copyLink} style={{ flex: 1, padding: '0.5rem', background: '#14F195', color: '#000', fontWeight: 700, border: 'none' }}>
                  {copied ? 'Link Copied!' : 'Copy Share Link'}
                </button>
              </div>
            </div>

            <p className="form-label" style={{ marginBottom: '0.75rem' }}>Live Preview</p>

            <div style={{ background: '#000000', border: '1px solid #333', overflow: 'hidden', zoom: 0.65, position: 'relative' }}>
              <style dangerouslySetInnerHTML={{__html:`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
              `}}/>
              {/* Noise Texture */}
              <div style={{position:'absolute', inset:0, background:'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.5\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")', opacity:0.06, mixBlendMode:'screen', zIndex:1, pointerEvents:'none'}}/>
              
              <div style={{position:'absolute', top:0, right:0, width:'50vw', height:'2px', background:'linear-gradient(90deg, transparent, #14F195)', zIndex:2}}/>

              <div style={{ position: 'relative', zIndex: 2, padding: '3rem', fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                  {photoUrl ? (
                    <img src={photoUrl} alt="profile" style={{ width: '80px', height: '80px', objectFit: 'cover', border: '1px solid #333', filter: 'grayscale(100%) contrast(1.2)' }} />
                  ) : (
                    <div style={{ width: '80px', height: '80px', background: '#111', border: '1px solid #333' }} />
                  )}
                  <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: '#fff', margin: 0, textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-0.04em' }}>{name || 'NATIVE BUILDER'}</h2>
                  <div style={{ fontSize: '1.2rem', color: '#888', marginTop: '0.5rem' }}>{role || 'WEB3 DEVELOPER'}</div>
                  
                  {/* Ecosystems Badges in Preview */}
                  {ecosystemsLine && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                      {ecosystemsLine.split(',').map((eco, i) => eco.trim() && (
                        <span key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#14F195', border: '1px solid #14F195', padding: '0.2rem 0.5rem', background: 'rgba(20, 241, 149, 0.1)', borderRadius: '4px' }}>
                          {eco.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {focus && <div style={{ fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color: '#9945FF', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '1rem', border: '1px solid #9945FF', padding: '0.5rem 1rem', display: 'inline-block', width: 'fit-content' }}>{focus}</div>}
                  {available && !focus && <div style={{ fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color: '#14F195', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '1rem' }}>AVAILABLE_FOR_WORK</div>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: 'rgba(10,10,10,0.5)', padding: '1.5rem', border: '1px solid #333' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#9945FF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>// EXPERIENCE</div>
                    {experience.filter(e => e.title).map((e, i) => (
                      <div key={i} style={{ marginBottom: '1rem', borderLeft: '1px solid #333', paddingLeft: '1rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '-3px', top: '0', width: '5px', height: '5px', background: '#9945FF' }} />
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#888', marginBottom: '0.2rem' }}>{e.date}</div>
                        <div style={{ fontSize: '1rem', color: '#fff', fontWeight: 500 }}>{e.title}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'rgba(10,10,10,0.5)', padding: '1.5rem', border: '1px solid #333' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#14F195', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>// CAPABILITIES</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {skillsLine.split(',').slice(0,4).map((s, i) => s.trim() && (
                        <span key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#fff', border: '1px solid #333', padding: '0.3rem 0.6rem', background: '#050505' }}>
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
