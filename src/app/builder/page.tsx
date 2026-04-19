'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import Link from 'next/link';

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
    <div className="form-group">
      <label className="form-label">{label}</label>
      {entries.map((entry, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 36px', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'start' }}>
          <input type="text" className="form-input" placeholder={datePlaceholder} value={entry.date}
            onChange={e => update(i, 'date', e.target.value)}
            style={{ fontSize: '0.8rem', padding: '0.6rem 0.75rem', height: '60px' }} />
          <textarea className="form-input" placeholder={titlePlaceholder} value={entry.title}
            onChange={e => update(i, 'title', e.target.value)}
            style={{ fontSize: '0.8rem', padding: '0.6rem 0.75rem', minHeight: '60px', resize: 'none' }} />
          <button onClick={() => remove(i)}
            style={{ background: '#2a2a2a', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', height: '60px' }}>✕</button>
        </div>
      ))}
      <button onClick={add} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', marginTop: '0.25rem' }}>+ Add {label}</button>
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
    <div className="form-group">
      <label className="form-label">Projects</label>
      {projects.map((p, i) => (
        <div key={i} style={{ background: '#181818', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input className="form-input" placeholder="Project Name" value={p.name}
              onChange={e => update(i, 'name', e.target.value)} style={{ fontSize: '0.8rem', padding: '0.55rem 0.75rem' }} />
            <input className="form-input" placeholder="https://github.com/..." value={p.url}
              onChange={e => update(i, 'url', e.target.value)} style={{ fontSize: '0.8rem', padding: '0.55rem 0.75rem' }} />
          </div>
          <textarea className="form-input" placeholder="Short description..." value={p.desc}
            onChange={e => update(i, 'desc', e.target.value)}
            style={{ fontSize: '0.8rem', padding: '0.55rem 0.75rem', minHeight: '55px', resize: 'none', marginBottom: '0.5rem' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
            <input className="form-input" placeholder="Tech stack (e.g. Next.js, Solana)" value={p.tech}
              onChange={e => update(i, 'tech', e.target.value)} style={{ fontSize: '0.8rem', padding: '0.55rem 0.75rem', flex: 1 }} />
            <button onClick={() => remove(i)}
              style={{ background: '#2a2a2a', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 0.75rem' }}>✕</button>
          </div>
        </div>
      ))}
      <button onClick={add} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', marginTop: '0.25rem' }}>+ Add Project</button>
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────────

export default function BuilderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
  }, [status, router]);

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
  const [evmAddress, setEvmAddress] = useState('');
  const [solAddress, setSolAddress] = useState('');
  const [available, setAvailable] = useState(false);
  const [template, setTemplate] = useState('default');
  const [copied, setCopied] = useState(false);


  useEffect(() => {
    if (session?.user && !name) setName(session.user.name || '');
    if (session?.user?.image && !photoUrl) setPhotoUrl(session.user.image);
    if (session?.user?.email && !email) setEmail(session.user.email);
  }, [session, name, photoUrl, email]);

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
      tw: twitterHandle, web: websiteUrl,
      evm: evmAddress, sol: solAddress,
      avail: available ? '1' : '0',
      tmpl: template,
      gh: (session as any)?.githubUsername || session?.user?.name || ''
    };
    return Buffer.from(JSON.stringify(dataObj)).toString('base64');
  };

  const cvUsername = (session as any)?.githubUsername || session?.user?.name || 'anonymous';
  const cvUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/cv/${cvUsername}?d=${getEncodedData()}`;

  const copyLink = () => {
    navigator.clipboard.writeText(cvUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === 'loading') return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>Authenticating...</div>;

  return (
    <>
      <Nav />
      <div className="container">
        <div style={{ padding: '2rem 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 className="display" style={{ fontSize: '2rem' }}>Builder 🛠</h1>
            <p style={{ color: 'var(--text-muted)' }}>Fill in your details below.</p>
          </div>
          <button onClick={() => signOut()} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>Sign Out</button>
        </div>

        <div className="builder-layout">
          {/* ── Left: Form ── */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>

            {/* 0. Template */}
            <div className="form-card">
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-orange)' }}>0. Template</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                {[
                  { id: 'default', label: '🌑 Default', desc: 'Dark magazine' },
                  { id: 'cyber',   label: '🟢 Cyber',   desc: 'Neon green + dark' },
                  { id: 'minimal', label: '⬜ Minimal',  desc: 'Clean white + BW' },
                  { id: 'modern',  label: '🔴 Modern',   desc: 'Red accent + bold' },
                ].map(t => (
                  <div key={t.id}
                    onClick={() => setTemplate(t.id)}
                    style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius)', cursor: 'pointer',
                      background: template === t.id ? 'rgba(244,106,42,0.12)' : '#181818',
                      border: `1px solid ${template === t.id ? 'var(--accent-orange)' : 'var(--border-color)'}`,
                      transition: 'all 0.2s' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: template === t.id ? 'var(--accent-orange)' : '#fff' }}>{t.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>


            {/* 1. Profile */}
            <div className="builder-panel">
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-orange)' }}>1. Profile</h3>
              
              {/* Available toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0.75rem 1rem', background: available ? 'rgba(244,106,42,0.08)' : '#181818', border: `1px solid ${available ? 'var(--accent-orange)' : 'var(--border-color)'}`, borderRadius: 'var(--radius)', cursor: 'pointer' }}
                onClick={() => setAvailable(v => !v)}>
                <div style={{ width: '36px', height: '20px', borderRadius: '100px', background: available ? 'var(--accent-orange)' : '#444', position: 'relative', transition: 'background 0.2s' }}>
                  <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: available ? '18px' : '2px', transition: 'left 0.2s' }} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: available ? 'var(--accent-orange)' : 'var(--text-muted)' }}>
                  {available ? '⚡ Available for Work / Hire' : 'Not Available for Work'}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Photo URL</label>
                <input type="text" className="form-input" placeholder="https://avatars.githubusercontent.com/..." value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} />
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
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Bio</span>
                  <span style={{ color: bio.length > 260 ? 'var(--accent-orange)' : 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                    {bio.length}/300
                  </span>
                </label>
                <textarea className="form-input" placeholder="I am a passionate Web3 builder..."
                  value={bio} maxLength={300}
                  onChange={e => setBio(e.target.value)} />
              </div>
            </div>

            {/* 2. Background */}
            <div className="builder-panel">
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-orange)' }}>2. Background</h3>
              <EntryList label="Education" entries={education} setter={setEducation}
                datePlaceholder="2020–2024" titlePlaceholder="Institut Teknologi Bandung" />
              <div style={{ marginTop: '1.25rem' }}>
                <EntryList label="Experience" entries={experience} setter={setExperience}
                  datePlaceholder="2022–Now" titlePlaceholder="Freelance Designer" />
              </div>
              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label className="form-label">Skills (Comma Separated)</label>
                <textarea className="form-input" placeholder="Photoshop, Next.js, Solana..." value={skillsLine} onChange={e => setSkillsLine(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Languages (Comma Separated)</label>
                <input type="text" className="form-input" placeholder="Indonesian, English, Japanese" value={languagesLine} onChange={e => setLanguagesLine(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Certifications (Comma Separated)</label>
                <input type="text" className="form-input" placeholder="AWS Cloud Practitioner, Solana Bootcamp" value={certsLine} onChange={e => setCertsLine(e.target.value)} />
              </div>
            </div>

            {/* 3. Projects */}
            <div className="builder-panel">
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-orange)' }}>3. Projects</h3>
              <ProjectList projects={projects} setter={setProjects} />
            </div>

            {/* 4. Contact */}
            <div className="builder-panel">
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-orange)' }}>4. Contact & Connections</h3>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Twitter / X Handle</label>
                <input type="text" className="form-input" placeholder="username (tanpa @)" value={twitterHandle} onChange={e => setTwitterHandle(e.target.value.replace('@', ''))} />
              </div>
              <div className="form-group">
                <label className="form-label">Personal Website / Portfolio</label>
                <input type="text" className="form-input" placeholder="https://..." value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Solana Address (Optional – onchain score)</label>
                <input type="text" className="form-input" placeholder="5zi..." value={solAddress} onChange={e => setSolAddress(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">EVM Address (Optional – multichain score)</label>
                <input type="text" className="form-input" placeholder="0x..." value={evmAddress} onChange={e => setEvmAddress(e.target.value)} />
              </div>
            </div>

            {/* 5. Publish */}
            <div className="builder-panel" style={{ background: 'rgba(244, 106, 42, 0.05)', borderColor: 'var(--accent-orange)' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-orange)' }}>5. Publish</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Data di-encode ke URL — share langsung tanpa database. Ini adalah YoChain profile lo.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary" onClick={copyLink} style={{ flex: 1 }}>
                  {copied ? 'Link Copied!' : 'Copy Share Link'}
                </button>
                <Link href={`/cv/${cvUsername}?d=${getEncodedData()}`} target="_blank" className="btn btn-outline" style={{ background: 'var(--bg-dark)' }}>
                  View Full CV →
                </Link>
              </div>
            </div>
          </div>

          {/* ── Right: Live Preview ── */}
          <div style={{ position: 'sticky', top: '76px' }}>
            <p className="form-label" style={{ marginBottom: '0.75rem' }}>Live Preview</p>

            {template === 'cyber' ? (
              <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '1.25rem', border: '1px solid #00ff4133', zoom: 0.65 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 4px 1fr', gap: '0', minHeight: '300px' }}>
                  <div style={{ background: '#111', padding: '1rem', borderRadius: '8px 0 0 8px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {photoUrl ? <img src={photoUrl} alt="p" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '6px', filter: 'grayscale(100%)', border: '2px solid #00ff41' }} /> : <div style={{ width: '100%', aspectRatio: '1', background: '#1a1a1a', borderRadius: '6px', border: '2px solid #00ff41' }} />}
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{(name||'YOUR NAME').split(' ').map((w,i) => <div key={i}><span style={{ color: '#00ff41' }}>{w[0]}</span>{w.slice(1)}</div>)}</div>
                    <div style={{ color: '#00ff41', fontSize: '0.65rem', textTransform: 'uppercase' }}>{role||'Role'}</div>
                    {available && <div style={{ background: '#00ff4122', border: '1px solid #00ff41', color: '#00ff41', padding: '0.2rem 0.5rem', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 700 }}>⚡ OPEN TO WORK</div>}
                    <div style={{ fontSize: '0.62rem', color: '#555' }}>✉ {email||'email'}</div>
                  </div>
                  <div style={{ background: 'linear-gradient(to bottom, transparent, #00ff41, transparent)', width: '2px', boxShadow: '0 0 8px #00ff41' }} />
                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {bio && <p style={{ color: '#777', fontSize: '0.7rem', lineHeight: 1.6, borderLeft: '3px solid #00ff41', paddingLeft: '0.5rem' }}>{bio.slice(0,80)}</p>}
                    <div><div style={{ color: '#00ff41', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Experience</div>{experience.filter(e=>e.date||e.title).map((exp,i) => <div key={i} style={{ borderLeft: '1px solid #00ff4133', paddingLeft: '0.5rem', marginBottom: '0.4rem' }}><div style={{ color: '#00ff41', fontSize: '0.58rem' }}>{exp.date}</div><div style={{ color: '#e0e0e0', fontSize: '0.65rem', fontWeight: 600 }}>{exp.title}</div></div>)}</div>
                    <div><div style={{ color: '#00ff41', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>{parseList(skillsLine).map((s,i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #00ff41', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.45rem', color: '#00ff41', fontWeight: 700 }}>{s.slice(0,2).toUpperCase()}</div>)}</div></div>
                  </div>
                </div>
              </div>
            ) : template === 'minimal' ? (
              <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0', overflow: 'hidden', zoom: 0.65 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', minHeight: '300px' }}>
                  <div style={{ borderRight: '1px solid #eee', padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', background: '#fff' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#111', lineHeight: 1.1 }}>{name||'YOUR NAME'}</div>
                    <div style={{ width: '20px', height: '2px', background: '#111' }} />
                    <div style={{ fontSize: '0.58rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{role||'Role'}</div>
                    {photoUrl ? <img src={photoUrl} alt="p" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', filter: 'grayscale(100%)' }} /> : <div style={{ width: '100%', aspectRatio: '3/4', background: '#f0f0f0' }} />}
                    {bio && <p style={{ fontSize: '0.58rem', color: '#555', lineHeight: 1.5 }}>{bio.slice(0,70)}</p>}
                    <div style={{ fontSize: '0.55rem', color: '#555' }}>{email && <div>✉ {email}</div>}{twitterHandle && <div>𝕏 @{twitterHandle}</div>}</div>
                  </div>
                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#fff' }}>
                    <div><div style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#111', marginBottom: '0.4rem' }}>Education</div>{education.filter(e=>e.date||e.title).map((edu,i) => <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 14px 1fr', gap: 0, marginBottom: '0.35rem', alignItems: 'start' }}><div style={{ fontSize: '0.5rem', color: '#888', textAlign: 'right', paddingRight: '6px', paddingTop: '2px' }}>{edu.date}</div><div style={{ width: '9px', height: '9px', borderRadius: '50%', border: '2px solid #222', flexShrink: 0 }} /><div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#111', paddingLeft: '5px' }}>{edu.title}</div></div>)}</div>
                    <div><div style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#111', marginBottom: '0.4rem' }}>Experience</div>{experience.filter(e=>e.date||e.title).map((exp,i) => <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 14px 1fr', gap: 0, marginBottom: '0.35rem', alignItems: 'start' }}><div style={{ fontSize: '0.5rem', color: '#888', textAlign: 'right', paddingRight: '6px', paddingTop: '2px' }}>{exp.date}</div><div style={{ width: '9px', height: '9px', borderRadius: '50%', border: '2px solid #222', flexShrink: 0 }} /><div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#111', paddingLeft: '5px' }}>{exp.title}</div></div>)}</div>
                    <div><div style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#111', marginBottom: '0.4rem' }}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>{parseList(skillsLine).map((s,i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.45rem', fontWeight: 800, color: '#111' }}>{s.slice(0,2).toUpperCase()}</div>)}</div></div>
                  </div>
                </div>
              </div>
            ) : template === 'modern' ? (
              <div style={{ background: '#fafafa', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e8e8e8', zoom: 0.65 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', background: '#fff', borderBottom: '2px solid #f0f0f0', position: 'relative' }}>
                  <div style={{ padding: '1.25rem 1rem 1.25rem 1.75rem', borderLeft: '6px solid #e63329' }}>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.1rem' }}>Hello... I'm</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#e63329', lineHeight: 1, letterSpacing: '-0.5px', marginBottom: '0.1rem' }}>{name||'Your Name'}</div>
                    <div style={{ fontSize: '0.62rem', color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>{role||'Role'}</div>
                    {bio && <p style={{ fontSize: '0.65rem', color: '#666', lineHeight: 1.5, marginBottom: '0.5rem' }}>{bio.slice(0,80)}</p>}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', fontSize: '0.58rem', color: '#777' }}>{email && <span>📧 {email}</span>}{twitterHandle && <span>𝕏 @{twitterHandle}</span>}</div>
                    {available && <div style={{ marginTop: '0.4rem', display: 'inline-block', background: '#e63329', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '3px', fontSize: '0.55rem', fontWeight: 700 }}>⚡ AVAILABLE</div>}
                  </div>
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', background: '#e63329' }} />
                    {photoUrl ? <img src={photoUrl} alt="p" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} /> : <div style={{ width: '100%', height: '140px', background: '#e0e0e0' }} />}
                  </div>
                </div>
                <div style={{ padding: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
                  <div><div style={{ fontSize: '0.58rem', fontWeight: 800, color: '#111', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '8px', height: '2px', background: '#e63329', display: 'inline-block' }}/>Experience</div>{experience.filter(e=>e.title).map((e,i) => <div key={i} style={{ borderLeft: '2px solid #e63329', paddingLeft: '0.35rem', marginBottom: '0.3rem' }}><div style={{ fontSize: '0.48rem', color: '#e63329', fontWeight: 700 }}>{e.date}</div><div style={{ fontSize: '0.55rem', fontWeight: 700 }}>{e.title}</div></div>)}</div>
                  <div><div style={{ fontSize: '0.58rem', fontWeight: 800, color: '#111', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '8px', height: '2px', background: '#e63329', display: 'inline-block' }}/>Skills</div>{parseList(skillsLine).map((s,i) => <div key={i} style={{ marginBottom: '0.3rem' }}><div style={{ fontSize: '0.55rem', color: '#333' }}>{s}</div><div style={{ color: '#e63329', fontSize: '0.62rem' }}>{'★'.repeat(5-i%2)+' ☆'.repeat(i%2)}</div></div>)}</div>
                  <div><div style={{ fontSize: '0.58rem', fontWeight: 800, color: '#111', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '8px', height: '2px', background: '#e63329', display: 'inline-block' }}/>Education</div>{education.filter(e=>e.title).map((e,i) => <div key={i} style={{ marginBottom: '0.3rem' }}><div style={{ fontSize: '0.48rem', color: '#e63329', fontWeight: 700 }}>{e.date}</div><div style={{ fontSize: '0.55rem', fontWeight: 700 }}>{e.title}</div></div>)}</div>
                </div>
              </div>
            ) : (
              <div className="cv-dark-wrapper" style={{ margin: 0, padding: '1.5rem', zoom: 0.65 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ color: 'var(--accent-orange)', fontSize: '1.5rem', fontWeight: 700 }}>{name || 'Your Name'}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{role || 'Role'}</div>
                  </div>
                  {available && <span style={{ background: 'rgba(244,106,42,0.12)', border: '1px solid var(--accent-orange)', color: 'var(--accent-orange)', padding: '0.2rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>⚡ Available</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                  <div>
                    {photoUrl ? <img src={photoUrl} alt="p" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', border: '4px solid #2a2a2a' }} /> : <div style={{ width: '100%', aspectRatio: '1', background: '#2a2a2a', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>[Photo]</div>}
                    <div className="section-title">Education</div>
                    <div className="timeline" style={{ marginBottom: '1.5rem' }}>{education.filter(e => e.date || e.title).map((edu, i) => (<div key={i} className="timeline-item" style={{ paddingBottom: '0.75rem' }}><div className="timeline-date">{edu.date}</div><div className="timeline-title" style={{ fontSize: '0.85rem' }}>{edu.title}</div></div>))}</div>
                    <div className="section-title">Skills</div>
                    <div className="skill-list">{parseList(skillsLine).map((s, i) => <div key={i} className="skill-item">{s}</div>)}</div>
                  </div>
                  <div>
                    <div className="cv-hello" style={{ fontSize: '3.5rem', letterSpacing: '-1px', marginBottom: '1rem' }}>HELLO<span>!</span></div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{bio || 'Your bio...'}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>{email && <div className="cv-contact-btn" style={{ fontSize: '0.8rem' }}>{email}</div>}{twitterHandle && <div className="cv-contact-btn" style={{ background: '#2a2a2a', fontSize: '0.8rem' }}>@{twitterHandle}</div>}</div>
                    <div className="section-title">Experience</div>
                    <div className="timeline">{experience.filter(e => e.date || e.title).map((exp, i) => (<div key={i} className="timeline-item"><div className="timeline-date" style={{ color: 'var(--accent-orange)' }}>{exp.date}</div><div className="timeline-title">{exp.title}</div></div>))}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

}
