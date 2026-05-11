'use client';

import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import Link from 'next/link';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { create, mplCore } from '@metaplex-foundation/mpl-core';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { generateSigner } from '@metaplex-foundation/umi';

/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */

function shortAddr(a: string) { return a ? `${a.slice(0,6)}...${a.slice(-6)}` : ''; }

const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const GhIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>;
const WebIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>;

interface ProjectEntry { name: string; desc: string; url: string; tech: string; }
interface CVData {
  p:string; n:string; r:string; b:string; e:string;
  edu:string; exp:string; skl:string; proj?:string; lang?:string; cert?:string;
  tw:string; web:string; gh:string; sol?:string; avail?:string; tmpl?:string;
  eco?:string; foc?:string;
}

type TmplProps = {
  data: CVData; ghData:any; solData:any;
  projects: ProjectEntry[]; parseList:(s?:string)=>string[];
  reputationScore:string; wallet:string; isDark:boolean; c:(d:string,l:string)=>string;
};

/* ══════════════════════════════════════════════════════════════
   SOLANA NATIVE TEMPLATE (Dark Editorial / Magazine)
══════════════════════════════════════════════════════════════ */
function SolanaNativeTemplate({data, solData, ghData, parseList, projects, reputationScore}: TmplProps) {
  const expList = parseList(data.exp);
  const eduList = parseList(data.edu);
  const sklList = parseList(data.skl);
  const ecoList = parseList(data.eco);

  const verifiedBadges: string[] = [];
  if (solData?.totalTransactions > 0) verifiedBadges.push('Onchain Active');
  if (solData?.domainName) verifiedBadges.push('SNS Owner');
  if (ghData) verifiedBadges.push('GitHub Dev');
  if (data.tw) verifiedBadges.push('X Verified');

  return (
    <div id="cv-content" style={{position:'relative', background:'#000', minHeight:'100vh', color:'#e0e0e0', overflowX:'hidden'}}>
      <style dangerouslySetInnerHTML={{__html:`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Space+Grotesk:wght@300;400;500;600;700;800&display=swap');

        .cv-root { font-family: 'Space Grotesk', system-ui, sans-serif; position: relative; z-index: 1; }
        
        /* Animated Background Grid */
        .bg-grid {
          position: absolute; inset: 0; z-index: 0;
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 100%);
          pointer-events: none;
        }

        /* Animated Glowing Orbs */
        .orb-1 { position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(20,241,149,0.08) 0%, transparent 70%); top: -200px; right: -200px; z-index: 0; pointer-events: none; filter: blur(50px); animation: pulseOrb 8s infinite alternate ease-in-out; }
        .orb-2 { position: absolute; width: 500px; height: 500px; background: radial-gradient(circle, rgba(153,69,255,0.08) 0%, transparent 70%); bottom: 100px; left: -200px; z-index: 0; pointer-events: none; filter: blur(50px); animation: pulseOrb 10s infinite alternate-reverse ease-in-out; }
        @keyframes pulseOrb { 0% { opacity: 0.5; transform: scale(1); } 100% { opacity: 1; transform: scale(1.1) translate(20px, 20px); } }

        .neo-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #666;
        }

        .neo-link {
          color: #ccc;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          padding-bottom: 2px;
          border-bottom: 1px solid #333;
        }
        .neo-link:hover { color: #14F195; border-color: #14F195; transform: translateY(-1px); }

        /* Entrance Animations */
        .rev { animation: su 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(40px); }
        .d1{animation-delay:0.1s} .d2{animation-delay:0.25s} .d3{animation-delay:0.4s} .d4{animation-delay:0.55s} .d5{animation-delay:0.7s}
        @keyframes su { to { opacity:1; transform:translateY(0); } }

        /* Interactive Hover States */
        .hover-card { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; }
        .hover-card::before { content:''; position:absolute; inset:0; border: 1px solid transparent; transition: border-color 0.3s; pointer-events:none; }
        .hover-card:hover { background: rgba(255,255,255,0.02); transform: translateY(-4px); }
        .hover-card:hover::before { border-color: rgba(20,241,149,0.3); }

        .glass-badge {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(8px);
        }

        /* Score Glow */
        .score-glow {
          text-shadow: 0 0 40px rgba(20,241,149,0.4);
          background: linear-gradient(to bottom right, #fff, #14F195);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Export Mode Fixes for html2canvas */
        .export-mode .bg-grid, .export-mode .orb-1, .export-mode .orb-2 { display: none !important; }
        .export-mode .cv-root { background: #000 !important; }
        .export-mode * { animation: none !important; transition: none !important; }
        .export-mode .score-glow { background: none !important; -webkit-text-fill-color: #14F195 !important; color: #14F195 !important; text-shadow: none !important; }
        .export-mode .profile-img { mix-blend-mode: normal !important; filter: none !important; }
        .export-mode .text-name { font-size: 5.5rem !important; text-shadow: none !important; }
        .export-mode .text-role { font-size: 1.5rem !important; }
        .export-mode .text-bio { font-size: 1.4rem !important; }
        .export-mode .text-stat { font-size: 2.5rem !important; }
        .export-mode .pad-hero { padding: 4rem !important; }
        .export-mode .pad-bio { padding: 4rem !important; }
        .export-mode .pad-main { padding: 4rem !important; }
        .export-mode .cv-hero-grid { min-height: auto !important; }

        @media print {
          .bg-grid, .orb-1, .orb-2 { display: none !important; }
          .cv-root { background: #000 !important; }
        }

        @media (max-width: 768px) {
          .cv-hero-grid { grid-template-columns: 1fr !important; }
          .cv-stat-bar { flex-wrap: wrap !important; }
          .cv-content-grid { grid-template-columns: 1fr !important; }
        }
      `}}/>

      <div className="bg-grid"></div>
      <div className="orb-1"></div>
      <div className="orb-2"></div>

      {/* ── FULL-BLEED HEADER ── */}
      <div className="cv-root">

        {/* Decorative stripe at top */}
        <div style={{height:'2px', background:'linear-gradient(90deg, #9945FF 0%, #14F195 50%, #FF4400 100%)', opacity:0.8}}/>

        {/* HERO SECTION — full width with photo sidebar */}
        <div className="cv-hero-grid rev d1" style={{display:'grid', gridTemplateColumns:'1fr 340px', minHeight:'75vh', borderBottom:'1px solid #111', background:'linear-gradient(to bottom, rgba(10,10,10,0.8), #000)'}}>

          {/* Left: Name + meta */}
          <div className="pad-hero" style={{padding:'clamp(2rem,5vw,5rem)', display:'flex', flexDirection:'column', justifyContent:'center', borderRight:'1px solid #111', position:'relative'}}>
            
            {/* Top row micro-data */}
            <div style={{display:'flex', gap:'2rem', flexWrap:'wrap', marginBottom:'5rem'}}>
              <div>
                <div className="neo-label" style={{marginBottom:'0.5rem'}}>ONCHAIN ID</div>
                <div style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.9rem', color: solData?.domainName ? '#14F195' : '#555', display:'flex', alignItems:'center', gap:'0.4rem'}}>
                  {solData?.domainName && <span style={{display:'inline-block', width:'6px', height:'6px', background:'#14F195', borderRadius:'50%', boxShadow:'0 0 8px #14F195'}}></span>}
                  {solData?.domainName || 'unregistered.sol'}
                </div>
              </div>
              <div>
                <div className="neo-label" style={{marginBottom:'0.5rem'}}>CURRENT FOCUS</div>
                <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap', fontFamily:"'JetBrains Mono', monospace", fontSize:'0.75rem'}}>
                  {data.foc ? data.foc.split(',').filter(Boolean).map((f, i) => (
                    <span key={i} className="glass-badge" style={{color: '#fff', padding: '0.25rem 0.6rem'}}>{f}</span>
                  )) : (
                    <span style={{fontSize:'0.9rem', color: data.avail==='1' ? '#14F195' : '#555'}}>
                      {data.avail==='1' ? 'Available for Work' : 'Not Available'}
                    </span>
                  )}
                </div>
              </div>
              {verifiedBadges.length > 0 && (
                <div>
                  <div className="neo-label" style={{marginBottom:'0.5rem'}}>CREDENTIALS</div>
                  <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
                    {verifiedBadges.map((b,i) => (
                      <span key={i} className="glass-badge" style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.65rem', color:'#aaa', padding:'0.25rem 0.6rem'}}>{b}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Giant name */}
            <div style={{position:'relative', zIndex:1}}>
              <h1 className="text-name" style={{fontSize:'clamp(3.5rem, 7vw, 7.5rem)', fontWeight:800, lineHeight:0.9, letterSpacing:'-0.03em', color:'#fff', textTransform:'uppercase', margin:'0 0 1.5rem 0', wordBreak:'break-word', textShadow:'0 20px 40px rgba(0,0,0,0.5)'}}>
                {data.n || 'NATIVE BUILDER'}
              </h1>
              <div className="text-role" style={{fontSize:'clamp(1.2rem, 2vw, 1.8rem)', color:'#888', fontWeight:400, marginBottom:'3rem', letterSpacing:'-0.01em'}}>
                {data.r || 'Web3 Developer'}
              </div>

              {/* Social + ecosystems in one row */}
              <div style={{display:'flex', flexWrap:'wrap', gap:'1.5rem', alignItems:'center'}}>
                {data.tw && <a href={`https://twitter.com/${data.tw}`} target="_blank" rel="noreferrer" className="neo-link"><XIcon/> @{data.tw}</a>}
                {data.gh && <a href={`https://github.com/${data.gh}`} target="_blank" rel="noreferrer" className="neo-link"><GhIcon/> {data.gh}</a>}
                {data.web && <a href={data.web.startsWith('http')?data.web:`https://${data.web}`} target="_blank" rel="noreferrer" className="neo-link"><WebIcon/> WEBSITE</a>}
                {ecoList.map((eco, i) => (
                  <span key={i} style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.7rem', color:'#14F195', border:'1px solid rgba(20,241,149,0.3)', padding:'0.3rem 0.75rem', background:'rgba(20,241,149,0.05)', boxShadow:'inset 0 0 10px rgba(20,241,149,0.05)'}}>{eco}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Photo + Score panel */}
          <div style={{display:'flex', flexDirection:'column'}}>
            {/* Photo fills top */}
            <div style={{flex:1, background:'#050505', overflow:'hidden', position:'relative', minHeight:'350px'}}>
              {data.p ? (
                <img src={data.p} alt={data.n} className="profile-img" style={{width:'100%', height:'100%', objectFit:'cover', filter:'grayscale(100%) contrast(1.2)', opacity:0.85, transition:'all 0.5s', mixBlendMode:'luminosity'}} onMouseEnter={(e)=>e.currentTarget.style.filter='grayscale(0%) contrast(1)'} onMouseLeave={(e)=>e.currentTarget.style.filter='grayscale(100%) contrast(1.2)'}/>
              ) : (
                <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'6rem', color:'#111', fontWeight:800, fontFamily:"'JetBrains Mono', monospace", background:'linear-gradient(135deg, #111, #000)'}}>
                  {data.n?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              {/* Photo overlay gradient */}
              <div style={{position:'absolute', bottom:0, left:0, right:0, height:'70%', background:'linear-gradient(transparent, #000)'}}/>
            </div>

            {/* Score panel at bottom */}
            <div style={{padding:'2.5rem', borderTop:'1px solid #111', background:'rgba(5,5,5,0.8)', backdropFilter:'blur(10px)'}}>
              <div className="neo-label" style={{marginBottom:'1rem'}}>ONCHAIN_SCORE</div>
              <div className="score-glow" style={{fontSize:'4.5rem', fontWeight:800, fontFamily:"'JetBrains Mono', monospace", lineHeight:0.9, marginBottom:'1.5rem'}}>
                {reputationScore}
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                {ghData && <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.7rem', fontFamily:"'JetBrains Mono', monospace", color:'#888'}}><span>GitHub</span><span style={{color:'#fff'}}>+{((ghData.stats?.totalStars||0)*2 + (ghData.user?.publicRepos||0)).toFixed(0)}</span></div>}
                {solData && <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.7rem', fontFamily:"'JetBrains Mono', monospace", color:'#888'}}><span>Transactions</span><span style={{color:'#fff'}}>+{((solData.totalTransactions||0)*0.04).toFixed(0)}</span></div>}
                {data.tw && <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.7rem', fontFamily:"'JetBrains Mono', monospace", color:'#888'}}><span>Twitter</span><span style={{color:'#fff'}}>+50</span></div>}
                {projects.length > 0 && <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.7rem', fontFamily:"'JetBrains Mono', monospace", color:'#888'}}><span>Projects</span><span style={{color:'#fff'}}>+{projects.length * 20}</span></div>}
              </div>
            </div>
          </div>
        </div>

        {/* BIO BAND — full width */}
        {data.b && (
          <div className="rev d2 pad-bio" style={{padding:'clamp(3rem,6vw,5rem) clamp(2rem,5vw,5rem)', borderBottom:'1px solid #111', display:'flex', gap:'4rem', alignItems:'center', background:'rgba(255,255,255,0.01)'}}>
            <div className="neo-label" style={{flexShrink:0, writingMode:'vertical-rl', transform:'rotate(180deg)', letterSpacing:'0.2em'}}>BIO</div>
            <p className="text-bio" style={{fontSize:'clamp(1.2rem, 2.5vw, 1.8rem)', lineHeight:1.6, color:'#b0b0b0', fontWeight:300, margin:0, maxWidth:'900px'}}>
              {data.b}
            </p>
          </div>
        )}

        {/* STATS BAR — horizontal full bleed */}
        <div className="rev d3 cv-stat-bar" style={{display:'flex', borderBottom:'1px solid #111', overflow:'hidden', background:'#000'}}>
          {[
            { label: 'REPOS', val: ghData?.user?.publicRepos || '—' },
            { label: 'SOL_TXs', val: solData?.totalTransactions || '—' },
            { label: 'NFTs_OWNED', val: solData?.nftCount || '—' },
            { label: 'TOKENS', val: solData?.tokenCount || '—' },
            { label: 'SKILLS', val: sklList.length || '—' },
            { label: 'PROJECTS', val: projects.length || '—' },
          ].map((s, i, arr) => (
            <div key={i} style={{flex:1, padding:'2.5rem 1.5rem', borderRight: i < arr.length-1 ? '1px solid #111' : 'none', textAlign:'center', transition:'background 0.3s'}} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(20,241,149,0.02)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
              <div className="text-stat" style={{fontSize:'clamp(1.8rem, 3.5vw, 3rem)', fontWeight:800, fontFamily:"'JetBrains Mono', monospace", color:'#fff', lineHeight:1, marginBottom:'0.75rem'}}>
                {s.val}
              </div>
              <div className="neo-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* MAIN CONTENT — 3-col asymmetric grid */}
        <div className="cv-content-grid rev d4" style={{display:'grid', gridTemplateColumns:'2fr 1px 1fr', minHeight:'400px'}}>

          {/* WIDE LEFT: Experience + Projects */}
          <div className="pad-main" style={{padding:'clamp(3rem,5vw,6rem) clamp(2rem,5vw,5rem)', display:'flex', flexDirection:'column', gap:'5rem'}}>

            {expList.length > 0 && (
              <div>
                <div style={{display:'flex', alignItems:'center', gap:'1rem', marginBottom:'3rem'}}>
                  <div className="neo-label" style={{color:'#9945FF'}}>// EXPERIENCE</div>
                  <div style={{flex:1, height:'1px', background:'#111'}}/>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:0}}>
                  {expList.map((e,i)=>{
                    const split = e.split(':');
                    const period = split[0]?.trim();
                    const role = split.slice(1).join(':').trim() || e;
                    return (
                      <div key={i} className="hover-card" style={{display:'grid', gridTemplateColumns:'150px 1fr', gap:'2rem', padding:'2.5rem 1.5rem', borderBottom:'1px solid #111', alignItems:'start', margin:'0 -1.5rem'}}>
                        <div style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.75rem', color:'#888', paddingTop:'0.4rem'}}>{period}</div>
                        <div>
                          <div style={{fontSize:'1.2rem', fontWeight:600, color:'#fff', letterSpacing:'-0.01em', marginBottom:'0.25rem'}}>{role}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <div style={{display:'flex', alignItems:'center', gap:'1rem', marginBottom:'3rem'}}>
                  <div className="neo-label" style={{color:'#14F195'}}>// SELECTED_WORK</div>
                  <div style={{flex:1, height:'1px', background:'#111'}}/>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:0}}>
                  {projects.map((p,i)=>(
                    <div key={i} className="hover-card" style={{padding:'3rem 1.5rem', borderBottom: i<projects.length-1 ? '1px solid #111' : 'none', margin:'0 -1.5rem'}}>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem', gap:'1rem'}}>
                        <div style={{fontSize:'1.5rem', fontWeight:700, color:'#fff', letterSpacing:'-0.02em'}}>{p.name}</div>
                        {p.url && <a href={p.url} target="_blank" rel="noreferrer" className="neo-link" style={{flexShrink:0}}>VISIT ↗</a>}
                      </div>
                      <p style={{fontSize:'1.05rem', color:'#999', lineHeight:1.7, margin:'0 0 2rem 0', maxWidth:'700px'}}>{p.desc}</p>
                      {p.tech && (
                        <div style={{display:'flex', flexWrap:'wrap', gap:'0.5rem'}}>
                          {p.tech.split(',').map((t,j)=>(
                            <span key={j} className="glass-badge" style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.7rem', color:'#aaa', padding:'0.3rem 0.6rem'}}>{t.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Divider line */}
          <div style={{background:'#111'}}/>

          {/* NARROW RIGHT: Skills + Education + Languages */}
          <div style={{padding:'clamp(3rem,5vw,6rem) 2.5rem', display:'flex', flexDirection:'column', gap:'4rem'}}>

            {sklList.length > 0 && (
              <div>
                <div className="neo-label" style={{color:'#14F195', marginBottom:'2rem'}}>CAPABILITIES</div>
                <div style={{display:'flex', flexWrap:'wrap', gap:'0.6rem'}}>
                  {sklList.map((s,i)=>(
                    <span key={i} style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.75rem', color:'#ccc', border:'1px solid #222', padding:'0.5rem 0.85rem', background:'rgba(255,255,255,0.02)', transition:'all 0.2s', cursor:'default'}} onMouseEnter={(e)=>{e.currentTarget.style.borderColor='rgba(20,241,149,0.5)'; e.currentTarget.style.color='#fff'}} onMouseLeave={(e)=>{e.currentTarget.style.borderColor='#222'; e.currentTarget.style.color='#ccc'}}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {eduList.length > 0 && (
              <div>
                <div className="neo-label" style={{color:'#9945FF', marginBottom:'2rem'}}>EDUCATION</div>
                <div style={{display:'flex', flexDirection:'column', gap:'2rem'}}>
                  {eduList.map((e,i)=>{
                    const split = e.split(':');
                    return (
                      <div key={i} style={{transition:'border-color 0.3s', paddingLeft:'1.25rem', borderLeft:'2px solid #222', position:'relative'}} onMouseEnter={(e)=>e.currentTarget.style.borderLeftColor='#9945FF'} onMouseLeave={(e)=>e.currentTarget.style.borderLeftColor='#222'}>
                        <div style={{fontSize:'1.1rem', fontWeight:600, color:'#fff', marginBottom:'0.3rem'}}>{split[1]?.trim() || e}</div>
                        {split[0] && <div style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.7rem', color:'#888'}}>{split[0].trim()}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {data.lang && (
              <div>
                <div className="neo-label" style={{marginBottom:'2rem'}}>LANGUAGES</div>
                <div style={{display:'flex', flexWrap:'wrap', gap:'0.6rem'}}>
                  {parseList(data.lang).map((l,i)=>(
                    <span key={i} className="glass-badge" style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.75rem', color:'#aaa', padding:'0.4rem 0.75rem'}}>{l}</span>
                  ))}
                </div>
              </div>
            )}

            {data.cert && (
              <div>
                <div className="neo-label" style={{marginBottom:'2rem'}}>CERTIFICATIONS</div>
                <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                  {parseList(data.cert).map((c,i)=>(
                    <div key={i} style={{fontSize:'0.9rem', color:'#aaa', display:'flex', gap:'0.75rem', alignItems:'flex-start'}}>
                      <span style={{color:'#14F195', flexShrink:0, fontWeight:700}}>—</span>{c}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* BOTTOM STRIPE */}
        <div style={{height:'2px', background:'linear-gradient(90deg, transparent, #14F195 50%, transparent 100%)', opacity:0.5}}/>

      </div>
    </div>
  );
}


export default function CVPageClient({ wallet }: { wallet: string }) {
  const [data, setData]       = useState<CVData|null>(null);
  const [solData, setSolData] = useState<any>(null);
  const [ghData, setGhData]   = useState<any>(null);
  const [isLoadingScore, setIsLoadingScore] = useState(true);
  
  const walletAdapter = useWallet();
  const { connection } = useConnection();
  const [isMinting, setIsMinting] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState('0.1');
  const [isTipping, setIsTipping] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{show: boolean; title: string; message: string; type: 'success'|'error'|'info'; link?: string; linkText?: string}>({
    show: false, title: '', message: '', type: 'info'
  });

  const showAlert = (title: string, message: string, type: 'success'|'error'|'info' = 'info', link?: string, linkText?: string) => {
    setAlertConfig({ show: true, title, message, type, link, linkText });
  };

  const handleTip = async (amountVal: string) => {
    if (!walletAdapter.connected || !walletAdapter.publicKey) {
      showAlert("Connection Required", "Please connect your wallet first to send a tip.", "error");
      return;
    }
    const recipientAddress = data?.sol;
    if (!recipientAddress) {
      showAlert("Address Missing", "This profile hasn't set a Solana address yet. Ask them to add one in their Builder settings.", "error");
      return;
    }
    const amount = parseFloat(amountVal);
    if (isNaN(amount) || amount <= 0) {
      showAlert("Invalid Amount", "Please enter a valid amount.", "error");
      return;
    }
    
    try {
      setIsTipping(true);
      const targetWallet = new PublicKey(recipientAddress);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: walletAdapter.publicKey,
          toPubkey: targetWallet,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
      
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = walletAdapter.publicKey;
      
      const signature = await walletAdapter.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      setShowTipModal(false);
      showAlert("Tip Sent!", `Successfully sent ${amount} SOL tip!`, "success");
    } catch (err: any) {
      console.error(err);
      showAlert("Tip Failed", err.message, "error");
    } finally {
      setIsTipping(false);
    }
  };

  const handleMintIdentity = async () => {
    if (!walletAdapter.connected || !walletAdapter.publicKey) {
      showAlert("Connection Required", "Please connect your Solana wallet first (using the top right nav button)!", "error");
      return;
    }

    // Guard: 1 GitHub account = 1 YoChain Identity
    // Check if this GitHub user already minted with a different wallet
    if (data?.gh) {
      try {
        const existingRes = await fetch(`/api/profiles?username=${data.gh}`);
        const existing = await existingRes.json();
        if (existing?.sol && existing.sol !== walletAdapter.publicKey.toBase58()) {
          showAlert(
            "Identity Already Exists",
            `Your GitHub account (@${data.gh}) already has a YoChain Identity minted to wallet:\n${existing.sol}\n\nEach GitHub account can only have 1 YoChain ID. Connect that wallet to view your identity.`,
            "error"
          );
          return;
        }
      } catch { /* If check fails, allow mint to proceed */ }
    }

    try {
      setIsMinting(true);

      // Always use Helius devnet — more reliable for Metaplex Core
      const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com';
      console.log('[Mint] Using RPC:', rpc);
      console.log('[Mint] Wallet:', walletAdapter.publicKey.toBase58());

      const umi = createUmi(rpc)
        .use(walletAdapterIdentity(walletAdapter))
        .use(mplCore());

      // URI must be a full valid URL — include gh & d so My Profile can reconstruct the CV link
      const baseUrl = window.location.origin;
      const d = new URLSearchParams(window.location.search).get('d') || '';
      const uri = `${baseUrl}/api/mint/metadata?n=${encodeURIComponent(data?.n || 'Builder')}&r=${encodeURIComponent(data?.r || 'Web3 Dev')}&p=${encodeURIComponent(data?.p || '')}&gh=${encodeURIComponent(data?.gh || '')}`;
      const name = `YoChain ID: ${data?.n || 'Builder'}`;

      console.log('[Mint] Name:', name);
      console.log('[Mint] URI:', uri);

      // Verify metadata endpoint is reachable first
      const metaCheck = await fetch(uri);
      if (!metaCheck.ok) {
        throw new Error(`Metadata endpoint returned ${metaCheck.status}. Check /api/mint/metadata`);
      }
      console.log('[Mint] Metadata OK');

      const asset = generateSigner(umi);
      console.log('[Mint] Asset keypair:', asset.publicKey);

      const result = await create(umi, {
        asset,
        name,
        uri,
      }).sendAndConfirm(umi, { confirm: { commitment: 'confirmed' } });

      console.log('[Mint] Success! Signature:', result.signature);
      showAlert(
        "Identity Minted!", 
        `Your onchain ID was successfully minted!\nNFT Address: ${asset.publicKey.toString()}`,
        "success",
        `https://explorer.solana.com/address/${asset.publicKey.toString()}?cluster=devnet`,
        "View on Solana Explorer ↗"
      );
    } catch (err: any) {
      console.error('[Mint] Full error:', err);
      console.error('[Mint] Logs:', err?.logs);
      const logs = err?.logs ? '\n\nLogs:\n' + err.logs.slice(-5).join('\n') : '';
      showAlert("Mint Failed", `${err.message}${logs}`, "error");
    } finally {
      setIsMinting(false);
    }
  };



  const [downloading, setDownloading] = useState(false);

  const downloadPDF = async () => {
    const el = document.getElementById('cv-content');
    if (!el) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(el,{
        scale:2,
        useCORS:true,
        allowTaint:true,
        backgroundColor:'#000000',
        windowWidth: 1200, // Enforce a standard desktop width
        logging:false,
        imageTimeout:15000,
        onclone: (clonedDoc) => {
          // Apply 'export-mode' to fix clamp() and unsupported CSS in html2canvas
          const clonedEl = clonedDoc.getElementById('cv-content');
          if (clonedEl) {
            clonedEl.classList.add('export-mode');
          }
        }
      });
      
      const pdf = new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height*pdfW)/canvas.width;
      pdf.addImage(canvas.toDataURL('image/jpeg',0.95),'JPEG',0,0,pdfW,pdfH);
      const url = URL.createObjectURL(pdf.output('blob'));
      window.open(url,'_blank');
      setTimeout(()=>URL.revokeObjectURL(url),10000);
    } catch(err){ console.error(err); showAlert("PDF Error", "Gagal generate PDF.", "error"); }
    finally { setDownloading(false); }
  };

  const parseList = (str?:string) => !str ? [] : str.split(',').filter(s=>s.trim()).map(s=>s.trim());
  const parseProjects = (str?:string): ProjectEntry[] => !str ? [] :
    str.split(';;').filter(Boolean).map(p=>{const[n,d,u,t]=p.split('|');return{name:n||'',desc:d||'',url:u||'',tech:t||''};});

  useEffect(()=>{
    const p = new URLSearchParams(window.location.search).get('d');
    
    const loadProfileData = (base64Payload: string) => {
      try {
        const binString = atob(base64Payload);
        const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
        const decodedStr = new TextDecoder().decode(bytes);
        const decoded = JSON.parse(decodedStr);
        setData(decoded);
        
        const promises = [];
        if(decoded.gh) promises.push(fetch(`/api/github?username=${decoded.gh}`).then(r=>r.json()).then(setGhData).catch(console.error));
        if(decoded.sol) promises.push(fetch(`/api/solana?wallet=${decoded.sol}`).then(r=>r.json()).then(setSolData).catch(console.error));
        
        Promise.allSettled(promises).then(() => setIsLoadingScore(false));

        // Auto-save to Supabase so leaderboard & profile page work
        const username = decoded.gh || wallet;
        if (username) {
          fetch('/api/profiles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: username,
              name: decoded.n,
              profileUrl: `${window.location.origin}/cv/${username}?d=${base64Payload}`,
              role: decoded.r,
              photo: decoded.p,
              tw: decoded.tw,
              sol: decoded.sol
            })
          }).catch(console.error);
        }
      } catch (err) {
        console.error("Error decoding profile payload:", err);
      }
    };

    if (p) {
      loadProfileData(p);
    } else {
      // If 'd' is missing (e.g. from a clean URL or new NFT), fetch it from Supabase!
      fetch(`/api/profiles?username=${wallet}`)
        .then(r => r.json())
        .then(profile => {
          if (profile && profile.profileUrl) {
            try {
              const url = new URL(profile.profileUrl, window.location.origin);
              const dbPayload = url.searchParams.get('d');
              if (dbPayload) {
                loadProfileData(dbPayload);
                return;
              }
            } catch (e) {
              console.error("Failed to parse db profileUrl", e);
            }
          }
          // Fallback: if no ?d= in profileUrl (or no profileUrl at all),
          // build CVData directly from Supabase fields so the page still loads
          if (profile && (profile.name || profile.username)) {
            setData({
              n: profile.name || profile.username || wallet,
              r: profile.role || 'Web3 Developer',
              p: profile.photo || '',
              sol: profile.sol || '',
              gh: profile.gh || profile.username || wallet,
              tw: profile.tw || '',
              b: '',
              eco: Array.isArray(profile.ecosystems) ? profile.ecosystems.join(',') : '',
              foc: Array.isArray(profile.focus) ? profile.focus.join(',') : '',
              avail: profile.available ? '1' : '0',
              skl: '', exp: '', edu: '', proj: '', cert: '', lang: '', web: '',
            });
            const promises = [];
            if (profile.gh || profile.username) {
              promises.push(fetch(`/api/github?username=${profile.gh || profile.username}`).then(r=>r.json()).then(setGhData).catch(console.error));
            }
            if (profile.sol) {
              promises.push(fetch(`/api/solana?wallet=${profile.sol}`).then(r=>r.json()).then(setSolData).catch(console.error));
            }
            Promise.allSettled(promises).then(() => setIsLoadingScore(false));
          }
        })
        .catch(console.error);
    }
  }, [wallet]);



  // After GitHub + Solana data load, update score in Supabase
  useEffect(() => {
    if (isLoadingScore || !data) return;
    const username = data.gh || wallet;
    if (!username) return;
    const score = Math.round(
      (solData?.totalTransactions||0) * 0.04 +
      (ghData?.stats?.totalStars||0) * 2 +
      (ghData?.user?.publicRepos||0) * 1 +
      (data.tw ? 50 : 0) +
      (parseProjects(data.proj).length) * 20
    );
    fetch('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        name: data.n, role: data.r, photo: data.p,
        ecosystems: data.eco ? data.eco.split(',').map((s:string)=>s.trim()).filter(Boolean) : [],
        focus: data.foc ? data.foc.split(',').map((s:string)=>s.trim()).filter(Boolean) : [],
        available: data.avail === '1', score,
        gh: data.gh||'', tw: data.tw||'', sol: data.sol||'',
        // Do NOT update profileUrl here — window.location.href may not have ?d= param
        // profileUrl is only set when loading from the builder with a d= payload
        savedAt: new Date().toISOString(),
      }),
    }).catch(()=>{});
  }, [isLoadingScore]);

  if(!data) return (
    <div style={{textAlign:'center',marginTop:'5rem',fontFamily:'monospace',color:'#888'}}>
      <div>INITIALIZING_ONCHAIN_DATA...</div>
      <div style={{marginTop:'1rem',fontSize:'0.75rem',color:'#444'}}>
        If this takes too long, the profile may not exist yet.
        <br/>
        <a href="/builders" style={{color:'#14F195',textDecoration:'none'}}>← Browse Builders</a>
      </div>
    </div>
  );

  const isDark   = true;
  const c        = (dark:string,light:string) => dark;
  const projects = parseProjects(data.proj);
  const reputationScore = isLoadingScore ? '...' : (
    (solData?.totalTransactions||0) * 0.04 +
    (ghData?.stats?.totalStars||0) * 2 +
    (ghData?.user?.publicRepos||0) * 1 +
    (data.tw ? 50 : 0) +
    (projects.length) * 20
  ).toFixed(0);

  const tmplProps: TmplProps = {data,ghData,solData,projects,parseList,reputationScore,wallet,isDark,c};

  return (
    <>
      <Nav />
      {/* Tipping Modal */}
      {showTipModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(20px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Space Grotesk', sans-serif", opacity:1, animation:'su 0.4s ease-out forwards'}}>
          <div style={{background:'rgba(5,5,5,0.95)',padding:'3rem',border:'1px solid rgba(255,255,255,0.1)',width:'90%',maxWidth:'450px',color:'#fff', boxShadow:'0 20px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) inset', borderRadius:'16px', position:'relative', overflow:'hidden'}}>
            <div style={{position:'absolute', top:'-100px', right:'-100px', width:'200px', height:'200px', background:'radial-gradient(circle, rgba(20,241,149,0.2) 0%, transparent 70%)', filter:'blur(40px)', zIndex:0}}></div>
            <div style={{position:'relative', zIndex:1}}>
              <h3 style={{marginTop:0,marginBottom:'2.5rem',fontSize:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',fontWeight:800,letterSpacing:'-0.02em'}}>
                <span style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
                  <span style={{color:'#14F195'}}>◆</span> INITIATE TRANSFER
                </span>
                <button onClick={()=>setShowTipModal(false)} style={{background:'transparent',border:'none',color:'#888',cursor:'pointer',fontSize:'1.5rem',padding:0,lineHeight:1, transition:'color 0.2s'}} onMouseEnter={(e)=>e.currentTarget.style.color='#fff'} onMouseLeave={(e)=>e.currentTarget.style.color='#888'}>&times;</button>
              </h3>
              
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.75rem',marginBottom:'2rem'}}>
                {['0.1','0.5','1.0'].map(amt => (
                  <button key={amt} onClick={()=>setTipAmount(amt)} style={{padding:'1rem 0.5rem',background:tipAmount===amt?'rgba(20,241,149,0.1)':'rgba(255,255,255,0.03)',color:tipAmount===amt?'#14F195':'#aaa',border:'1px solid',borderColor:tipAmount===amt?'rgba(20,241,149,0.5)':'rgba(255,255,255,0.1)',cursor:'pointer',fontWeight:700,fontFamily:"'JetBrains Mono', monospace",transition:'all 0.2s', borderRadius:'8px', boxShadow:tipAmount===amt?'inset 0 0 20px rgba(20,241,149,0.1)':'none'}} onMouseEnter={(e)=>{if(tipAmount!==amt)e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'}} onMouseLeave={(e)=>{if(tipAmount!==amt)e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}}>
                    {amt} SOL
                  </button>
                ))}
              </div>
              
              <div style={{marginBottom:'2.5rem'}}>
                <label style={{display:'block',fontSize:'0.75rem',color:'#888',marginBottom:'0.75rem',fontFamily:"'JetBrains Mono', monospace",textTransform:'uppercase', letterSpacing:'0.05em'}}>CUSTOM AMOUNT</label>
                <div style={{position:'relative'}}>
                  <input type="number" step="0.1" value={tipAmount} onChange={(e)=>setTipAmount(e.target.value)} style={{width:'100%',padding:'1.25rem',background:'rgba(0,0,0,0.5)',border:'1px solid rgba(255,255,255,0.1)',color:'#14F195',fontSize:'1.5rem',fontFamily:"'JetBrains Mono', monospace", borderRadius:'8px', outline:'none', transition:'border-color 0.2s'}} onFocus={(e)=>e.target.style.borderColor='#14F195'} onBlur={(e)=>e.target.style.borderColor='rgba(255,255,255,0.1)'} placeholder="0.25" />
                  <span style={{position:'absolute', right:'1.5rem', top:'50%', transform:'translateY(-50%)', fontFamily:"'JetBrains Mono', monospace", color:'#555', fontSize:'1rem'}}>SOL</span>
                </div>
              </div>

              <button onClick={()=>handleTip(tipAmount)} disabled={isTipping} style={{width:'100%',padding:'1.25rem',background:isTipping?'rgba(20,241,149,0.2)':'#14F195',color:isTipping?'#14F195':'#000',border:'none',fontSize:'1rem',fontWeight:800,cursor:isTipping?'wait':'pointer',textTransform:'uppercase',letterSpacing:'0.05em',borderRadius:'8px', transition:'all 0.2s', boxShadow:isTipping?'none':'0 10px 20px rgba(20,241,149,0.2)'}} onMouseEnter={(e)=>{if(!isTipping) {e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 15px 30px rgba(20,241,149,0.3)';}}} onMouseLeave={(e)=>{if(!isTipping) {e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 10px 20px rgba(20,241,149,0.2)';}}}>
                {isTipping ? 'PROCESSING...' : `SEND ${tipAmount} SOL`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertConfig.show && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(20px)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Space Grotesk', sans-serif", opacity:1, animation:'su 0.4s ease-out forwards'}}>
          <div style={{background:'rgba(5,5,5,0.95)',padding:'3rem',border:`1px solid ${alertConfig.type === 'error' ? 'rgba(255,51,51,0.3)' : alertConfig.type === 'success' ? 'rgba(20,241,149,0.3)' : 'rgba(255,255,255,0.1)'}`,width:'90%',maxWidth:'450px',color:'#fff', borderRadius:'16px', boxShadow:`0 20px 80px rgba(0,0,0,0.8), 0 0 40px ${alertConfig.type === 'error' ? 'rgba(255,51,51,0.1)' : alertConfig.type === 'success' ? 'rgba(20,241,149,0.1)' : 'rgba(255,255,255,0.05)'} inset`}}>
            <h3 style={{marginTop:0,marginBottom:'1.5rem',fontSize:'1.35rem',display:'flex',alignItems:'center',gap:'0.75rem',fontWeight:800,letterSpacing:'-0.01em',color:alertConfig.type === 'error' ? '#ff3333' : alertConfig.type === 'success' ? '#14F195' : '#fff'}}>
              {alertConfig.type === 'error' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
              {alertConfig.type === 'success' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
              {alertConfig.type === 'info' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>}
              {alertConfig.title}
            </h3>
            
            <p style={{fontSize:'0.95rem',color:'#aaa',lineHeight:1.7,fontFamily:"'JetBrains Mono', monospace",marginBottom:'2.5rem', whiteSpace:'pre-wrap', wordBreak:'break-word'}}>
              {alertConfig.message}
            </p>

            {alertConfig.link && (
              <div style={{marginBottom:'2.5rem'}}>
                <a href={alertConfig.link} target="_blank" rel="noopener noreferrer" style={{color:'#14F195',textDecoration:'none',fontFamily:"'JetBrains Mono', monospace",fontSize:'0.85rem', borderBottom:'1px solid rgba(20,241,149,0.4)', paddingBottom:'2px', transition:'all 0.2s'}} onMouseEnter={(e)=>e.currentTarget.style.borderBottomColor='#14F195'}>
                  {alertConfig.linkText || alertConfig.link}
                </a>
              </div>
            )}
            
            <button 
              onClick={() => setAlertConfig({...alertConfig, show: false})} 
              style={{width:'100%',padding:'1.25rem',background:alertConfig.type === 'error' ? 'rgba(255,51,51,0.1)' : alertConfig.type === 'success' ? 'rgba(20,241,149,0.1)' : 'rgba(255,255,255,0.05)',color:alertConfig.type === 'error' ? '#ff3333' : alertConfig.type === 'success' ? '#14F195' : '#fff',border:`1px solid ${alertConfig.type === 'error' ? 'rgba(255,51,51,0.3)' : alertConfig.type === 'success' ? 'rgba(20,241,149,0.3)' : 'rgba(255,255,255,0.1)'}`,fontSize:'0.9rem',fontWeight:800,cursor:'pointer',textTransform:'uppercase',letterSpacing:'0.05em',borderRadius:'8px', transition:'all 0.2s'}}
              onMouseEnter={(e)=>e.currentTarget.style.background=alertConfig.type === 'error' ? 'rgba(255,51,51,0.2)' : alertConfig.type === 'success' ? 'rgba(20,241,149,0.2)' : 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e)=>e.currentTarget.style.background=alertConfig.type === 'error' ? 'rgba(255,51,51,0.1)' : alertConfig.type === 'success' ? 'rgba(20,241,149,0.1)' : 'rgba(255,255,255,0.05)'}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Floating Mint Button - Only visible to the profile owner */}
      {walletAdapter.publicKey?.toBase58() === data.sol && (
        <div className="no-print" style={{position: 'fixed', bottom: '6rem', right: '2rem', zIndex: 999}}>
          <button 
            onClick={handleMintIdentity} 
            disabled={isMinting}
            style={{
              background: '#14F195',
              color: '#000',
              border: 'none',
              padding: '1.25rem 2rem',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.9rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: isMinting ? 'wait' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: isMinting ? 0.7 : 1,
              borderRadius: '100px',
              boxShadow: '0 10px 30px rgba(20,241,149,0.3), inset 0 -3px 0 rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
            onMouseEnter={(e) => {
              if(!isMinting) {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(20,241,149,0.4), inset 0 -3px 0 rgba(0,0,0,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if(!isMinting) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(20,241,149,0.3), inset 0 -3px 0 rgba(0,0,0,0.1)';
              }
            }}
          >
            {isMinting ? (
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            )}
            {isMinting ? 'MINTING TO SOLANA...' : 'MINT ONCHAIN ID'}
          </button>
        </div>
      )}

      <div className="no-print" style={{position:'fixed', bottom:0, left:0, right:0, background:'rgba(5,5,5,0.85)', backdropFilter:'blur(20px)', borderTop:'1px solid rgba(255,255,255,0.05)', padding:'1rem 0', zIndex:900, transform:'translateY(0)', transition:'transform 0.3s'}}>
        <div className="container" style={{display:'flex',justifyContent:'flex-start',gap:'1rem',flexWrap:'wrap', alignItems:'center'}}>
          <Link href="/" style={{fontSize:'0.75rem',padding:'0.75rem 1.25rem', background:'rgba(255,255,255,0.05)', color:'#fff', border:'1px solid rgba(255,255,255,0.1)',textDecoration:'none',fontWeight:700,fontFamily:"'JetBrains Mono', monospace",textTransform:'uppercase', borderRadius:'100px', transition:'all 0.2s'}} onMouseEnter={(e)=>{e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#000'}} onMouseLeave={(e)=>{e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#fff'}}>← BUILDER</Link>
          <div style={{flex:1}}></div>
          {/* Share on X with Solana Blinks */}
          {data.sol && (() => {
            const blinkUrl = `https://dial.to/?action=solana-action:${encodeURIComponent(`https://yochain.tech/api/actions/tip/${data.sol}`)}`;
            const tweetText = `I just minted my onchain identity as a Web3 builder on yochain.tech\n\nVerified on Solana. No resume needed — just vibes & code.\n\nTip me SOL directly from this tweet ⚡ (Solana Blinks)`;
            const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(blinkUrl)}`;
            return (
              <a href={shareUrl} target="_blank" rel="noreferrer" style={{fontSize:'0.75rem',padding:'0.75rem 1.25rem',background:'rgba(153,69,255,0.1)',color:'#9945FF',fontWeight:700,border:'1px solid rgba(153,69,255,0.3)',cursor:'pointer',fontFamily:"'JetBrains Mono', monospace",textTransform:'uppercase',textDecoration:'none',display:'flex',alignItems:'center',gap:'0.5rem', borderRadius:'100px', transition:'all 0.2s'}} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(153,69,255,0.2)'} onMouseLeave={(e)=>e.currentTarget.style.background='rgba(153,69,255,0.1)'}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                SHARE BLINK
              </a>
            );
          })()}
          <button onClick={() => setShowTipModal(true)} style={{fontSize:'0.75rem',padding:'0.75rem 1.25rem',background:'rgba(20,241,149,0.1)',color:'#14F195',fontWeight:700,border:'1px solid rgba(20,241,149,0.3)',cursor:'pointer',fontFamily:"'JetBrains Mono', monospace",textTransform:'uppercase', borderRadius:'100px', transition:'all 0.2s'}} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(20,241,149,0.2)'} onMouseLeave={(e)=>e.currentTarget.style.background='rgba(20,241,149,0.1)'}>
            TIP DEVELOPER
          </button>
          <button onClick={downloadPDF} disabled={downloading} style={{fontSize:'0.75rem',padding:'0.75rem 1.25rem',background:'transparent',color:'#aaa',border:'1px solid rgba(255,255,255,0.1)',cursor:'pointer',fontFamily:"'JetBrains Mono', monospace",textTransform:'uppercase', borderRadius:'100px', transition:'all 0.2s'}} onMouseEnter={(e)=>{e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'}} onMouseLeave={(e)=>{e.currentTarget.style.color='#aaa'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}}>
            {downloading?'GENERATING...':'DOWNLOAD PDF'}
          </button>
        </div>
      </div>

      <SolanaNativeTemplate {...tmplProps} />
    </>
  );
}
