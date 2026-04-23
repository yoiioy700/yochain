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
            onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>✕</button>
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
            style={{ position: 'absolute', top: 0, right: 0, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', padding: '0.5rem' }}>✕</button>
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
  const [activeTab, setActiveTab] = useState(0);


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

            {/* Tab Navigation */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px', background: 'var(--border-color)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
              {[
                { id: 0, label: 'TEMPLATE' },
                { id: 1, label: 'PROFILE' },
                { id: 2, label: 'BACKGROUND' },
                { id: 3, label: 'PROJECTS' },
                { id: 4, label: 'CONTACT' },
              ].map(tab => (
                <div key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{ padding: '0.75rem 0.5rem', cursor: 'pointer', textAlign: 'center',
                    background: activeTab === tab.id ? '#0f0f0f' : '#0a0a0a',
                    borderBottom: activeTab === tab.id ? '2px solid var(--accent-orange)' : '2px solid transparent',
                    transition: 'all 0.15s' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1px', color: activeTab === tab.id ? 'var(--accent-orange)' : '#666' }}>{tab.label}</div>
                </div>
              ))}
            </div>

            {/* Tab 0: Template */}
            {activeTab === 0 && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border-color)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                  {[
                    { id: 'default', label: 'DEFAULT', desc: 'Dark magazine' },
                    { id: 'cyber',   label: 'CYBER',   desc: 'Neon green + dark' },
                    { id: 'minimal', label: 'MINIMAL',  desc: 'Clean white + BW' },
                    { id: 'modern',  label: 'MODERN',   desc: 'Red accent + bold' },
                  ].map(t => (
                    <div key={t.id} onClick={() => setTemplate(t.id)}
                      style={{ padding: '1.25rem 1rem', cursor: 'pointer',
                        background: template === t.id ? '#0f0f0f' : '#0a0a0a',
                        borderBottom: template === t.id ? '2px solid var(--accent-orange)' : '2px solid transparent',
                        transition: 'all 0.2s' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px', color: template === t.id ? 'var(--accent-orange)' : '#888' }}>{t.label}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem', textTransform: 'uppercase' }}>{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 1: Profile */}
            {activeTab === 1 && (
              <div>
                {/* Available toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1rem', background: '#0a0a0a', border: '1px solid var(--border-color)', borderLeft: available ? '4px solid var(--accent-orange)' : '4px solid #333', cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => setAvailable(v => !v)}>
                  <div style={{ width: '40px', height: '22px', background: available ? 'var(--accent-orange)' : '#222', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                    <div style={{ width: '14px', height: '14px', background: '#fff', position: 'absolute', top: '4px', left: available ? '22px' : '4px', transition: 'left 0.2s' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: available ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {available ? 'Available for Work' : 'Not Available'}
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
                    <span style={{ color: bio.length > 260 ? 'var(--accent-orange)' : 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{bio.length}/300</span>
                  </label>
                  <textarea className="form-input" placeholder="I am a passionate Web3 builder..."
                    value={bio} maxLength={300} onChange={e => setBio(e.target.value)} />
                </div>
              </div>
            )}

            {/* Tab 2: Background */}
            {activeTab === 2 && (
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
                  <label className="form-label">Languages</label>
                  <input type="text" className="form-input" placeholder="Indonesian, English, Japanese" value={languagesLine} onChange={e => setLanguagesLine(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Certifications</label>
                  <input type="text" className="form-input" placeholder="AWS Cloud Practitioner, Solana Bootcamp" value={certsLine} onChange={e => setCertsLine(e.target.value)} />
                </div>
              </div>
            )}

            {/* Tab 3: Projects */}
            {activeTab === 3 && (
              <div>
                <ProjectList projects={projects} setter={setProjects} />
              </div>
            )}

            {/* Tab 4: Contact */}
            {activeTab === 4 && (
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
                  <label className="form-label">Solana Address <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(for Onchain Score)</span></label>
                  <input type="text" className="form-input" placeholder="5zi..." value={solAddress} onChange={e => setSolAddress(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">EVM Address <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(for Multichain Score)</span></label>
                  <input type="text" className="form-input" placeholder="0x..." value={evmAddress} onChange={e => setEvmAddress(e.target.value)} />
                </div>
              </div>
            )}

            {/* Tab navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => setActiveTab(t => Math.max(0, t - 1))}
                className="btn btn-outline"
                style={{ fontSize: '0.75rem', padding: '0.5rem 1.5rem', borderRadius: 0, opacity: activeTab === 0 ? 0.3 : 1, pointerEvents: activeTab === 0 ? 'none' : 'auto' }}>
                ← PREV
              </button>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: 'center', letterSpacing: '1px' }}>{activeTab + 1} / 5</span>
              <button onClick={() => setActiveTab(t => Math.min(4, t + 1))}
                className="btn btn-outline"
                style={{ fontSize: '0.75rem', padding: '0.5rem 1.5rem', borderRadius: 0, opacity: activeTab === 4 ? 0.3 : 1, pointerEvents: activeTab === 4 ? 'none' : 'auto' }}>
                NEXT →
              </button>
            </div>

          </div>

          {/* ── Right: Live Preview ── */}
          <div style={{ position: 'sticky', top: '76px' }}>
            {/* Publish Section (Moved here to be always accessible) */}
            <div className="builder-panel" style={{ background: 'rgba(244, 106, 42, 0.05)', borderColor: 'var(--accent-orange)', marginBottom: '1rem', padding: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-orange)', fontSize: '1.1rem' }}>Share Your Profile</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary" onClick={copyLink} style={{ flex: 1, padding: '0.5rem' }}>
                  {copied ? 'Link Copied!' : 'Copy Share Link'}
                </button>
                <Link href={`/cv/${cvUsername}?d=${getEncodedData()}`} target="_blank" className="btn btn-outline" style={{ background: 'var(--bg-dark)', padding: '0.5rem 1rem' }}>
                  View Full CV →
                </Link>
              </div>
            </div>

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
              <div style={{ background: '#fafafa', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e8e8e8', zoom: 0.65, position: 'relative' }}>
                {/* Diagonal stripes background pattern */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03, pointerEvents: 'none', background: 'repeating-linear-gradient(45deg, #000, #000 2px, transparent 2px, transparent 10px)' }} />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', background: '#fff', borderBottom: '3px solid #e63329', position: 'relative', zIndex: 1 }}>
                  <div style={{ padding: '1.5rem 1rem 1.5rem 2rem', borderLeft: '8px solid #e63329' }}>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.2rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>Profile</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#111', lineHeight: 1.1, letterSpacing: '-0.5px', marginBottom: '0.2rem' }}>{name||'Your Name'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#e63329', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.8rem' }}>{role||'Role'}</div>
                    {bio && <p style={{ fontSize: '0.7rem', color: '#555', lineHeight: 1.6, marginBottom: '0.8rem' }}>{bio.slice(0,100)}</p>}
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', fontSize: '0.65rem', color: '#666', fontWeight: 500 }}>
                      {email && <span style={{ background: '#f5f5f5', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>📧 {email}</span>}
                      {twitterHandle && <span style={{ background: '#f5f5f5', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>𝕏 @{twitterHandle}</span>}
                    </div>
                    {available && <div style={{ marginTop: '0.6rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#e63329', color: '#fff', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} /> Available for Hire</div>}
                  </div>
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', background: '#e63329', clipPath: 'polygon(0 0, 100% 0, 100% 100%)', zIndex: 2 }} />
                    {photoUrl ? <img src={photoUrl} alt="p" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block', filter: 'contrast(1.1)' }} /> : <div style={{ width: '100%', height: '100%', background: '#eee' }} />}
                  </div>
                </div>
                
                <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                  
                  {/* Experience Cards */}
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#111', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}><span style={{ width: '12px', height: '3px', background: '#e63329', display: 'inline-block' }}/>Experience</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {experience.filter(e=>e.title).map((e,i) => (
                        <div key={i} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '6px', padding: '0.6rem 0.8rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                          <div style={{ fontSize: '0.55rem', color: '#fff', background: '#111', display: 'inline-block', padding: '0.15rem 0.4rem', borderRadius: '3px', fontWeight: 700, marginBottom: '0.3rem' }}>{e.date}</div>
                          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#222' }}>{e.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Star-rated Skills & Education */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#111', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}><span style={{ width: '12px', height: '3px', background: '#e63329', display: 'inline-block' }}/>Skills</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {parseList(skillsLine).map((s,i) => {
                          const stars = 5 - (i % 3);
                          return (
                            <div key={i} style={{ background: '#fff', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontSize: '0.6rem', color: '#111', fontWeight: 700 }}>{s}</div>
                              <div style={{ color: '#e63329', fontSize: '0.5rem', letterSpacing: '1px' }}>
                                {'★'.repeat(stars)}{'☆'.repeat(5-stars)}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#111', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}><span style={{ width: '12px', height: '3px', background: '#e63329', display: 'inline-block' }}/>Education</div>
                      {education.filter(e=>e.title).map((e,i) => (
                        <div key={i} style={{ marginBottom: '0.4rem', position: 'relative', paddingLeft: '0.6rem', borderLeft: '2px solid #ddd' }}>
                          <div style={{ fontSize: '0.5rem', color: '#e63329', fontWeight: 800 }}>{e.date}</div>
                          <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#333' }}>{e.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
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
