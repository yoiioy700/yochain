'use client';

import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { create } from '@metaplex-foundation/mpl-core';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { generateSigner } from '@metaplex-foundation/umi';

function shortAddr(a: string) { return a ? `${a.slice(0,6)}...${a.slice(-6)}` : ''; }

interface ProjectEntry { name: string; desc: string; url: string; tech: string; }
interface CVData {
  p:string; n:string; r:string; b:string; e:string;
  edu:string; exp:string; skl:string; proj?:string; lang?:string; cert?:string;
  tw:string; web:string; gh:string; sol?:string; evm?:string; avail?:string; tmpl?:string;
}

type TmplProps = {
  data: CVData; ghData:any; solData:any; evmData:any;
  projects: ProjectEntry[]; parseList:(s?:string)=>string[];
  reputationScore:string; wallet:string; isDark:boolean; c:(d:string,l:string)=>string;
};

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 1 — CYBER (terminal hacker, chip skills, scanlines)
══════════════════════════════════════════════════════════════ */
const CYBER_G = '#39ff14';

const CyberSHead = ({label}: {label:string}) => (
  <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1rem'}}>
    <span style={{fontFamily:'monospace',color:CYBER_G,fontSize:'0.7rem',opacity:0.6}}>{'>>//'}</span>
    <span style={{fontSize:'0.65rem',fontWeight:800,letterSpacing:'0.2em',color:CYBER_G,textTransform:'uppercase'}}>{label}</span>
    <div style={{flex:1,height:'1px',background:`linear-gradient(to right, ${CYBER_G}44, transparent)`}}/>
  </div>
);

function CyberTemplate({data, ghData, parseList, projects, reputationScore}: TmplProps) {
  const G = CYBER_G;
  const skillList = parseList(data.skl);
  const langList  = parseList(data.lang);
  const expList   = parseList(data.exp);
  const eduList   = parseList(data.edu);
  const certList  = parseList(data.cert);

  return (
    <div style={{background:'#030a03',fontFamily:"'Space Mono','Courier New',monospace",color:'#c8f5c8',minHeight:'700px',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)',pointerEvents:'none',zIndex:0}}/>
      <div style={{position:'relative',zIndex:1,display:'grid',gridTemplateColumns:'260px 1fr'}}>
        <div style={{background:'#060e06',borderRight:`1px solid ${G}22`,padding:'2rem 1.5rem',minHeight:'700px',display:'flex',flexDirection:'column',gap:'1.5rem'}}>
          <div style={{position:'relative'}}>
            {data.p ? <img src={data.p} alt={data.n} style={{width:'100%',aspectRatio:'1',objectFit:'cover',objectPosition:'top',filter:'grayscale(100%) contrast(1.2) brightness(0.85)',display:'block'}}/> : <div style={{width:'100%',aspectRatio:'1',background:'#1a2e1a',display:'flex',alignItems:'center',justifyContent:'center',color:'#2a4a2a',fontSize:'0.8rem'}}>NO_PHOTO</div>}
            <div style={{position:'absolute',inset:0,border:`1px solid ${G}44`,pointerEvents:'none'}}/>
          </div>
          <div>
            <div style={{fontSize:'0.5rem',color:`${G}55`,letterSpacing:'0.15em',marginBottom:'0.3rem'}}>IDENTITY.DAT</div>
            <div style={{fontSize:'1.5rem',fontWeight:700,color:'#fff',lineHeight:1,textShadow:`0 0 30px ${G}44`}}>{(data.n||'UNKNOWN').toUpperCase()}</div>
            <div style={{fontSize:'0.7rem',color:G,marginTop:'0.4rem',letterSpacing:'0.1em'}}>{data.r||'ROLE'}</div>
            {data.avail==='1' && <div style={{marginTop:'0.75rem',display:'inline-flex',alignItems:'center',gap:'0.4rem',background:`${G}15`,border:`1px solid ${G}`,color:G,padding:'0.2rem 0.75rem',fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.1em'}}>◉ AVAILABLE</div>}
          </div>
          {data.b && <div style={{fontSize:'0.7rem',color:'#5a8a5a',lineHeight:1.7,borderLeft:`2px solid ${G}33`,paddingLeft:'0.75rem'}}>{data.b}</div>}
          <div>
            <CyberSHead label="CONTACT"/>
            {data.e && <div style={{fontSize:'0.67rem',color:'#7ab87a',marginBottom:'0.35rem',wordBreak:'break-all'}}>@ {data.e}</div>}
            {data.tw && <div style={{fontSize:'0.67rem',color:'#7ab87a',marginBottom:'0.35rem'}}>x @{data.tw}</div>}
            {data.gh && <div style={{fontSize:'0.67rem',color:'#7ab87a',marginBottom:'0.35rem'}}>/ github/{data.gh}</div>}
            {data.web && <div style={{fontSize:'0.67rem',color:'#7ab87a',wordBreak:'break-all'}}>~ {data.web.replace(/https?:\/\//,'')}</div>}
          </div>
          {langList.length>0 && <div><CyberSHead label="LANGUAGES"/>{langList.map((l,i)=><div key={i} style={{marginBottom:'0.5rem'}}><div style={{fontSize:'0.67rem',color:'#7ab87a',marginBottom:'3px'}}>{l}</div><div style={{height:'2px',background:'#0d1f0d'}}><div style={{height:'100%',width:`${i===0?95:i===1?82:68}%`,background:G,boxShadow:`0 0 6px ${G}`}}/></div></div>)}</div>}
          {certList.length>0 && <div><CyberSHead label="CERTS"/>{certList.map((c,i)=><div key={i} style={{fontSize:'0.67rem',color:'#5a8a5a',marginBottom:'0.3rem',display:'flex',gap:'0.4rem'}}><span style={{color:G}}>✓</span>{c}</div>)}</div>}
          {reputationScore!=='0' && <div style={{marginTop:'auto',border:`1px solid ${G}33`,padding:'1rem',textAlign:'center',background:`${G}07`}}><div style={{fontSize:'0.5rem',color:`${G}55`,letterSpacing:'0.1em',marginBottom:'0.25rem'}}>WEB3_SCORE.EXE</div><div style={{fontSize:'2.5rem',fontWeight:700,color:G,textShadow:`0 0 20px ${G}`,lineHeight:1}}>{reputationScore}</div></div>}
        </div>
        <div style={{padding:'2rem',display:'flex',flexDirection:'column',gap:'1.75rem'}}>
          {expList.length>0 && <div><CyberSHead label="EXPERIENCE"/>{expList.map((e,i)=>{const[date,...rest]=e.split(':');return(<div key={i} style={{marginBottom:'0.75rem',display:'grid',gridTemplateColumns:'110px 1fr',gap:'0.75rem'}}><div style={{fontFamily:'monospace',fontSize:'0.63rem',color:`${G}77`,paddingTop:'2px',textAlign:'right'}}>{date}</div><div style={{borderLeft:`1px solid ${G}33`,paddingLeft:'0.75rem'}}><div style={{fontSize:'0.85rem',fontWeight:700,color:'#c8f5c8'}}>{rest.join(':').trim()}</div></div></div>);})}</div>}
          {eduList.length>0 && <div><CyberSHead label="EDUCATION"/>{eduList.map((e,i)=>{const[date,...rest]=e.split(':');return(<div key={i} style={{marginBottom:'0.75rem',display:'grid',gridTemplateColumns:'110px 1fr',gap:'0.75rem'}}><div style={{fontFamily:'monospace',fontSize:'0.63rem',color:`${G}55`,paddingTop:'2px',textAlign:'right'}}>{date}</div><div style={{borderLeft:`1px solid ${G}22`,paddingLeft:'0.75rem'}}><div style={{fontSize:'0.85rem',color:'#a0c8a0'}}>{rest.join(':').trim()}</div></div></div>);})}</div>}
          {skillList.length>0 && <div><CyberSHead label="TECH_STACK"/><div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>{skillList.map((s,i)=><span key={i} style={{fontSize:'0.72rem',fontFamily:'monospace',color:G,border:`1px solid ${G}44`,background:`${G}0a`,padding:'0.3rem 0.75rem',letterSpacing:'0.05em',whiteSpace:'nowrap'}}>{s}</span>)}</div></div>}
          {ghData && !ghData.error && ghData.topRepos?.length>0 && <div><CyberSHead label="REPOSITORIES"/><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}>{ghData.topRepos.slice(0,4).map((r:any,i:number)=><a key={i} href={r.url} target="_blank" rel="noreferrer" style={{textDecoration:'none',border:`1px solid ${G}22`,background:`${G}05`,padding:'0.75rem',display:'block'}}><div style={{color:G,fontSize:'0.78rem',fontWeight:700,marginBottom:'0.2rem',fontFamily:'monospace'}}>{r.name}</div>{r.description&&<div style={{fontSize:'0.63rem',color:'#4a7a4a',lineHeight:1.4,marginBottom:'0.3rem'}}>{r.description.slice(0,55)}</div>}<div style={{fontSize:'0.6rem',color:`${G}55`,fontFamily:'monospace'}}>★{r.stars} ⑂{r.forks}{r.language&&` · ${r.language}`}</div></a>)}</div></div>}
          {projects.length>0 && <div><CyberSHead label="PROJECTS_DIR"/><div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>{projects.map((p,i)=><div key={i} style={{borderLeft:`2px solid ${G}`,paddingLeft:'0.75rem'}}><div style={{display:'flex',alignItems:'baseline',gap:'0.5rem'}}><span style={{color:'#fff',fontWeight:700,fontSize:'0.85rem'}}>{p.name}</span>{p.url&&<a href={p.url} target="_blank" rel="noreferrer" style={{color:G,textDecoration:'none',fontSize:'0.6rem',fontFamily:'monospace'}}>[LINK]</a>}</div>{p.desc&&<div style={{color:'#8aab8a',fontSize:'0.7rem',marginTop:'0.2rem'}}>{p.desc}</div>}{p.tech&&<div style={{color:`${G}88`,fontSize:'0.6rem',fontFamily:'monospace',marginTop:'0.3rem'}}>++ {p.tech}</div>}</div>)}</div></div>}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 2 — MINIMAL (editorial black header, clean layout)
══════════════════════════════════════════════════════════════ */
const MinimalRow = ({date, title}: {date:string, title:string}) => (
  <div style={{display:'grid',gridTemplateColumns:'100px 1fr',gap:'1.5rem',padding:'0.75rem 0',borderBottom:'1px solid #efefef'}}>
    <div style={{fontSize:'0.68rem',color:'#999',paddingTop:'2px'}}>{date}</div>
    <div style={{fontSize:'0.88rem',fontWeight:600,color:'#111',lineHeight:1.3}}>{title}</div>
  </div>
);
const MinimalSH = ({label}:{label:string}) => <div style={{fontSize:'0.58rem',fontWeight:800,letterSpacing:'0.2em',textTransform:'uppercase',color:'#111',borderBottom:'2px solid #111',paddingBottom:'0.5rem',marginBottom:'0.75rem'}}>{label}</div>;

function MinimalTemplate({data, ghData, parseList, projects, reputationScore}: TmplProps) {
  const expList = parseList(data.exp);
  const eduList = parseList(data.edu);
  const sklList = parseList(data.skl);
  const certList = parseList(data.cert);
  const langList = parseList(data.lang);

  return (
    <div style={{background:'#fafafa',fontFamily:"'Inter',system-ui,sans-serif",color:'#111',minHeight:'700px'}}>
      <div style={{background:'#111',padding:'2.5rem 3rem',display:'grid',gridTemplateColumns:'1fr auto',gap:'2rem',alignItems:'center'}}>
        <div>
          <div style={{fontSize:'0.6rem',color:'#555',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'0.5rem'}}>CV / Portfolio</div>
          <div style={{fontSize:'3rem',fontWeight:900,color:'#fff',lineHeight:1,letterSpacing:'-2px'}}>{data.n||'YOUR NAME'}</div>
          <div style={{fontSize:'0.78rem',color:'#666',marginTop:'0.5rem',letterSpacing:'0.1em',textTransform:'uppercase'}}>{data.r||'ROLE'}</div>
          {data.avail==='1' && <div style={{marginTop:'1rem',display:'inline-block',background:'#fff',color:'#111',padding:'0.3rem 1rem',fontSize:'0.65rem',fontWeight:800,letterSpacing:'0.1em'}}>OPEN TO WORK</div>}
        </div>
        <div>{data.p ? <img src={data.p} alt={data.n} style={{width:'110px',height:'110px',objectFit:'cover',objectPosition:'top',filter:'grayscale(100%)',display:'block'}}/> : <div style={{width:'110px',height:'110px',background:'#333'}}/>}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'270px 1fr',minHeight:'580px'}}>
        <div style={{background:'#f4f4f4',borderRight:'1px solid #e8e8e8',padding:'2rem 1.75rem',display:'flex',flexDirection:'column',gap:'1.75rem'}}>
          {data.b && <p style={{fontSize:'0.8rem',color:'#555',lineHeight:1.8,margin:0}}>{data.b}</p>}
          <div><MinimalSH label="Contact"/>{data.e&&<div style={{fontSize:'0.73rem',color:'#555',marginBottom:'0.35rem'}}>{data.e}</div>}{data.tw&&<div style={{fontSize:'0.73rem',color:'#555',marginBottom:'0.35rem'}}>x @{data.tw}</div>}{data.gh&&<div style={{fontSize:'0.73rem',color:'#555',marginBottom:'0.35rem'}}>github/{data.gh}</div>}{data.web&&<div style={{fontSize:'0.73rem',color:'#555',wordBreak:'break-all'}}>{data.web.replace(/https?:\/\//,'')}</div>}</div>
          {sklList.length>0 && <div><MinimalSH label="Skills"/><div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem'}}>{sklList.map((s,i)=><span key={i} style={{fontSize:'0.7rem',background:'#fff',border:'1px solid #ddd',color:'#333',padding:'0.3rem 0.65rem',fontWeight:500}}>{s}</span>)}</div></div>}
          {langList.length>0 && <div><MinimalSH label="Languages"/><div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem'}}>{langList.map((l,i)=><span key={i} style={{fontSize:'0.7rem',background:'#fff',border:'1px solid #ddd',color:'#333',padding:'0.3rem 0.65rem',fontWeight:500}}>{l}</span>)}</div></div>}
          {certList.length>0 && <div><MinimalSH label="Certifications"/>{certList.map((c,i)=><div key={i} style={{fontSize:'0.73rem',color:'#555',marginBottom:'0.35rem'}}>— {c}</div>)}</div>}
          {reputationScore!=='0' && <div style={{marginTop:'auto',background:'#111',padding:'1rem',textAlign:'center'}}><div style={{fontSize:'2rem',fontWeight:900,color:'#fff',lineHeight:1}}>{reputationScore}</div><div style={{fontSize:'0.55rem',color:'#666',textTransform:'uppercase',letterSpacing:'0.1em',marginTop:'0.25rem'}}>Web3 Score</div></div>}
        </div>
        <div style={{padding:'2rem 2.5rem'}}>
          {expList.length>0 && <div style={{marginBottom:'2rem'}}><MinimalSH label="Experience"/>{expList.map((e,i)=>{const[d,...r]=e.split(':');return <MinimalRow key={i} date={d} title={r.join(':').trim()}/>;})}</div>}
          {eduList.length>0 && <div style={{marginBottom:'2rem'}}><MinimalSH label="Education"/>{eduList.map((e,i)=>{const[d,...r]=e.split(':');return <MinimalRow key={i} date={d} title={r.join(':').trim()}/>;})}</div>}
          {ghData?.topRepos?.length>0 && <div style={{marginBottom:'2rem'}}><MinimalSH label="GitHub Repos"/><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>{ghData.topRepos.slice(0,4).map((r:any,i:number)=><a key={i} href={r.url} target="_blank" rel="noreferrer" style={{textDecoration:'none',background:'#fff',border:'1px solid #e8e8e8',padding:'0.85rem',display:'block'}}><div style={{fontWeight:700,color:'#111',fontSize:'0.8rem',marginBottom:'0.2rem'}}>{r.name}</div>{r.description&&<div style={{fontSize:'0.65rem',color:'#888',lineHeight:1.4,marginBottom:'0.3rem'}}>{r.description.slice(0,60)}</div>}<div style={{fontSize:'0.62rem',color:'#bbb'}}>★{r.stars} ⑂{r.forks}</div></a>)}</div></div>}
          {projects.length>0 && <div><MinimalSH label="Portfolio"/>{projects.map((p,i)=><div key={i} style={{marginBottom:'1rem'}}><div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}><span style={{fontSize:'0.88rem',fontWeight:600,color:'#111'}}>{p.name}</span>{p.url&&<a href={p.url} target="_blank" rel="noreferrer" style={{fontSize:'0.65rem',color:'#666',textDecoration:'underline'}}>Visit ↗</a>}</div>{p.desc&&<div style={{fontSize:'0.75rem',color:'#555',lineHeight:1.5,marginTop:'0.25rem'}}>{p.desc}</div>}{p.tech&&<div style={{fontSize:'0.65rem',color:'#888',marginTop:'0.3rem',fontFamily:'monospace'}}>{p.tech}</div>}</div>)}</div>}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 3 — MODERN (dark navy, amber, premium card layout)
══════════════════════════════════════════════════════════════ */
const MODERN_AMBER = '#f59e0b';
const ModernSH = ({label}:{label:string}) => (
  <div style={{fontSize:'0.6rem',fontWeight:800,letterSpacing:'0.2em',textTransform:'uppercase',color:MODERN_AMBER,marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.75rem'}}>
    <div style={{width:'20px',height:'1px',background:MODERN_AMBER}}/>{label}
  </div>
);

function ModernTemplate({data, ghData, parseList, projects, reputationScore}: TmplProps) {
  const NAVY = '#0d1b2a';
  const AMBER = MODERN_AMBER;
  const expList = parseList(data.exp);
  const eduList = parseList(data.edu);
  const sklList = parseList(data.skl);
  const langList = parseList(data.lang);
  const certList = parseList(data.cert);

  return (
    <div style={{background:NAVY,fontFamily:"'Inter',system-ui,sans-serif",color:'#e8e8e8',minHeight:'700px',display:'grid',gridTemplateColumns:'300px 1fr'}}>
      <div style={{background:'#0a1520',borderRight:`1px solid ${AMBER}22`,padding:'2.5rem 2rem',display:'flex',flexDirection:'column',gap:'1.75rem'}}>
        <div style={{position:'relative'}}>{data.p ? <img src={data.p} alt={data.n} style={{width:'100%',aspectRatio:'1',objectFit:'cover',objectPosition:'top',display:'block',borderBottom:`3px solid ${AMBER}`}}/> : <div style={{width:'100%',aspectRatio:'1',background:'#1a2a3a',borderBottom:`3px solid ${AMBER}`}}/>}</div>
        <div>
          <div style={{fontSize:'0.5rem',color:`${AMBER}77`,letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'0.35rem'}}>Profile</div>
          <div style={{fontSize:'1.75rem',fontWeight:900,color:'#fff',lineHeight:1.05,letterSpacing:'-0.5px'}}>{data.n||'Your Name'}</div>
          <div style={{fontSize:'0.72rem',color:AMBER,marginTop:'0.4rem',letterSpacing:'0.08em',textTransform:'uppercase'}}>{data.r||'Role'}</div>
          {data.avail==='1' && <div style={{marginTop:'0.75rem',display:'inline-flex',alignItems:'center',gap:'0.4rem',background:`${AMBER}18`,border:`1px solid ${AMBER}55`,color:AMBER,padding:'0.25rem 0.85rem',fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.1em'}}>◉ AVAILABLE</div>}
        </div>
        {data.b && <p style={{fontSize:'0.77rem',color:'#7a8898',lineHeight:1.8,margin:0,borderLeft:`2px solid ${AMBER}33`,paddingLeft:'0.85rem'}}>{data.b}</p>}
        <div><ModernSH label="Contact"/>{data.e&&<div style={{fontSize:'0.72rem',color:'#8898aa',marginBottom:'0.35rem'}}>{data.e}</div>}{data.tw&&<div style={{fontSize:'0.72rem',color:'#8898aa',marginBottom:'0.35rem'}}>x @{data.tw}</div>}{data.gh&&<div style={{fontSize:'0.72rem',color:'#8898aa',marginBottom:'0.35rem'}}>gh/{data.gh}</div>}{data.web&&<div style={{fontSize:'0.72rem',color:'#8898aa',wordBreak:'break-all'}}>{data.web.replace(/https?:\/\//,'')}</div>}</div>
        {langList.length>0 && <div><ModernSH label="Languages"/><div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem'}}>{langList.map((l,i)=><span key={i} style={{fontSize:'0.7rem',background:`${AMBER}18`,border:`1px solid ${AMBER}33`,color:AMBER,padding:'0.25rem 0.65rem'}}>{l}</span>)}</div></div>}
        {certList.length>0 && <div><ModernSH label="Certifications"/>{certList.map((c,i)=><div key={i} style={{fontSize:'0.72rem',color:'#8898aa',marginBottom:'0.35rem',display:'flex',gap:'0.5rem'}}><span style={{color:AMBER}}>✓</span>{c}</div>)}</div>}
        {reputationScore!=='0' && <div style={{marginTop:'auto',border:`1px solid ${AMBER}33`,padding:'1.25rem',textAlign:'center',background:`${AMBER}08`}}><div style={{fontSize:'0.5rem',color:`${AMBER}66`,letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:'0.35rem'}}>Web3 Score</div><div style={{fontSize:'2.5rem',fontWeight:900,color:AMBER,lineHeight:1}}>{reputationScore}</div></div>}
      </div>
      <div style={{padding:'2.5rem 2rem',display:'flex',flexDirection:'column',gap:'2rem'}}>
        {expList.length>0 && <div><ModernSH label="Work Experience"/><div style={{display:'flex',flexDirection:'column',gap:'0.6rem'}}>{expList.map((e,i)=>{const[date,...rest]=e.split(':');return(<div key={i} style={{background:'#0a1520',border:`1px solid ${AMBER}18`,borderLeft:`3px solid ${AMBER}`,padding:'0.85rem 1rem'}}><div style={{fontSize:'0.6rem',color:`${AMBER}88`,fontWeight:700,letterSpacing:'0.08em',marginBottom:'0.2rem'}}>{date}</div><div style={{fontSize:'0.9rem',fontWeight:700,color:'#fff'}}>{rest.join(':').trim()}</div></div>);})}</div></div>}
        {eduList.length>0 && <div><ModernSH label="Education"/><div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>{eduList.map((e,i)=>{const[date,...rest]=e.split(':');return(<div key={i} style={{display:'grid',gridTemplateColumns:'100px 1fr',gap:'1rem',padding:'0.6rem 0',borderBottom:`1px solid ${AMBER}11`}}><div style={{fontSize:'0.65rem',color:`${AMBER}66`,paddingTop:'2px'}}>{date}</div><div style={{fontSize:'0.85rem',color:'#ccc',fontWeight:600}}>{rest.join(':').trim()}</div></div>);})}</div></div>}
        {sklList.length>0 && <div><ModernSH label="Tech Stack"/><div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>{sklList.map((s,i)=><span key={i} style={{fontSize:'0.75rem',background:'#0a1520',border:`1px solid ${AMBER}33`,color:'#c8d6e5',padding:'0.35rem 0.85rem',fontWeight:500}}>{s}</span>)}</div></div>}
        {ghData && !ghData.error && ghData.topRepos?.length>0 && <div><ModernSH label="Projects"/><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.6rem'}}>{ghData.topRepos.slice(0,4).map((r:any,i:number)=><a key={i} href={r.url} target="_blank" rel="noreferrer" style={{textDecoration:'none',background:'#0a1520',border:`1px solid ${AMBER}18`,padding:'0.85rem',display:'block'}}><div style={{color:AMBER,fontSize:'0.8rem',fontWeight:700,marginBottom:'0.2rem'}}>{r.name}</div>{r.description&&<div style={{fontSize:'0.65rem',color:'#5a7a9a',lineHeight:1.4,marginBottom:'0.3rem'}}>{r.description.slice(0,55)}</div>}<div style={{fontSize:'0.62rem',color:`${AMBER}55`}}>★{r.stars} ⑂{r.forks}{r.language&&` · ${r.language}`}</div></a>)}</div></div>}
        {projects.length>0 && <div><ModernSH label="Portfolio"/>{projects.map((p,i)=><div key={i} style={{marginBottom:'0.75rem',borderBottom:`1px solid ${AMBER}11`,paddingBottom:'0.75rem'}}><div style={{fontSize:'0.88rem',fontWeight:700,color:'#fff'}}>{p.name}</div>{p.desc&&<div style={{fontSize:'0.73rem',color:'#5a7a9a',lineHeight:1.5,marginBottom:'0.2rem'}}>{p.desc}</div>}{p.url&&<a href={p.url} target="_blank" rel="noreferrer" style={{fontSize:'0.68rem',color:AMBER,textDecoration:'none',fontWeight:600}}>↗ {p.url.replace(/https?:\/\//,'').slice(0,30)}</a>}</div>)}</div>}
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════
   TEMPLATE 4 — BRUTALIST (Neo-brutalism, bold, high contrast)
══════════════════════════════════════════════════════════════ */
const BrutalistSH = ({label}:{label:string}) => (
  <div style={{fontSize:'1.5rem',fontWeight:900,textTransform:'uppercase',color:'#000',marginBottom:'1rem',borderBottom:'4px solid #000',display:'inline-block',lineHeight:1}}>{label}</div>
);

function BrutalistTemplate({data, ghData, parseList, projects, reputationScore}: TmplProps) {
  const expList = parseList(data.exp);
  const eduList = parseList(data.edu);
  const sklList = parseList(data.skl);
  
  return (
    <div style={{background:'#ffde00',fontFamily:"'Inter',system-ui,sans-serif",color:'#000',minHeight:'700px',border:'4px solid #000',boxShadow:'8px 8px 0 #000',position:'relative',overflow:'hidden',padding:'2rem'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:'2rem',alignItems:'end',borderBottom:'4px solid #000',paddingBottom:'2rem',marginBottom:'2rem'}}>
        <div>
          <div style={{background:'#000',color:'#fff',display:'inline-block',padding:'0.2rem 0.6rem',fontWeight:800,fontSize:'0.7rem',textTransform:'uppercase',marginBottom:'0.5rem',transform:'rotate(-2deg)'}}>Web3 Native</div>
          <div style={{fontSize:'3.5rem',fontWeight:900,lineHeight:1,textTransform:'uppercase',letterSpacing:'-2px',textShadow:'3px 3px 0 #fff'}}>{data.n||'YOUR NAME'}</div>
          <div style={{fontSize:'1.2rem',fontWeight:700,marginTop:'0.5rem',background:'#ff61d8',display:'inline-block',padding:'0.2rem 0.5rem',border:'2px solid #000'}}>{data.r||'ROLE'}</div>
          {data.avail==='1' && <div style={{marginTop:'1rem',display:'inline-block',background:'#00ff00',border:'2px solid #000',color:'#000',padding:'0.4rem 1rem',fontSize:'0.8rem',fontWeight:900,boxShadow:'3px 3px 0 #000'}}>⚡ AVAILABLE</div>}
        </div>
        {data.p ? <img src={data.p} alt={data.n} style={{width:'150px',height:'150px',objectFit:'cover',border:'4px solid #000',boxShadow:'6px 6px 0 #000',background:'#fff'}}/> : <div style={{width:'150px',height:'150px',background:'#000'}}/>}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'300px 1fr',gap:'2.5rem'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'2rem'}}>
          {data.b && <div style={{background:'#fff',border:'3px solid #000',padding:'1.25rem',boxShadow:'5px 5px 0 #000',fontSize:'0.9rem',fontWeight:600,lineHeight:1.6}}>{data.b}</div>}
          
          <div style={{background:'#00ffff',border:'3px solid #000',padding:'1.25rem',boxShadow:'5px 5px 0 #000'}}>
            <div style={{fontWeight:900,fontSize:'1.2rem',marginBottom:'0.75rem',borderBottom:'2px solid #000'}}>CONTACT</div>
            {data.e&&<div style={{fontWeight:700,marginBottom:'0.3rem'}}>✉ {data.e}</div>}
            {data.tw&&<div style={{fontWeight:700,marginBottom:'0.3rem'}}>𝕏 @{data.tw}</div>}
            {data.gh&&<div style={{fontWeight:700,marginBottom:'0.3rem'}}>gh/{data.gh}</div>}
            {data.web&&<div style={{fontWeight:700}}>🌐 {data.web.replace(/https?:\/\//,'')}</div>}
          </div>

          {sklList.length>0 && <div>
            <BrutalistSH label="Skills"/>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
              {sklList.map((s,i)=><span key={i} style={{background:['#ff61d8','#00ffff','#00ff00','#fff'][i%4],border:'2px solid #000',padding:'0.3rem 0.6rem',fontWeight:800,fontSize:'0.75rem',boxShadow:'2px 2px 0 #000'}}>{s}</span>)}
            </div>
          </div>}

          {reputationScore!=='0' && <div style={{marginTop:'auto',background:'#000',color:'#fff',padding:'1.5rem',textAlign:'center',border:'4px solid #fff',boxShadow:'8px 8px 0 #000'}}>
            <div style={{fontSize:'0.8rem',fontWeight:800,color:'#ffde00',marginBottom:'0.5rem'}}>ONCHAIN SCORE</div>
            <div style={{fontSize:'3.5rem',fontWeight:900,lineHeight:1}}>{reputationScore}</div>
          </div>}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'2.5rem'}}>
          {expList.length>0 && <div>
            <BrutalistSH label="Experience"/>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {expList.map((e,i)=>{const[date,...rest]=e.split(':');return(
                <div key={i} style={{background:'#fff',border:'3px solid #000',padding:'1rem',boxShadow:'4px 4px 0 #000'}}>
                  <div style={{background:'#000',color:'#fff',display:'inline-block',padding:'0.1rem 0.4rem',fontWeight:800,fontSize:'0.65rem',marginBottom:'0.4rem'}}>{date}</div>
                  <div style={{fontSize:'1.1rem',fontWeight:800}}>{rest.join(':').trim()}</div>
                </div>
              );})}
            </div>
          </div>}

          {(projects.length>0 || (ghData?.topRepos?.length>0)) && <div>
            <BrutalistSH label="Projects"/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              {projects.map((p,i)=>(
                <div key={i} style={{background:'#ff61d8',border:'3px solid #000',padding:'1rem',boxShadow:'4px 4px 0 #000',display:'flex',flexDirection:'column'}}>
                  <div style={{fontSize:'1.1rem',fontWeight:900,color:'#000',marginBottom:'0.3rem'}}>{p.name}</div>
                  {p.desc&&<div style={{fontSize:'0.8rem',fontWeight:600,marginBottom:'0.5rem',lineHeight:1.4}}>{p.desc}</div>}
                  <div style={{marginTop:'auto',display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
                    <div style={{fontSize:'0.65rem',fontWeight:800,background:'#000',color:'#fff',padding:'0.1rem 0.3rem'}}>{p.tech||'WEB3'}</div>
                    {p.url&&<a href={p.url} target="_blank" rel="noreferrer" style={{color:'#000',fontWeight:900,textDecoration:'none',borderBottom:'2px solid #000'}}>↗ GO</a>}
                  </div>
                </div>
              ))}
              {ghData?.topRepos?.slice(0, projects.length>0 ? 2 : 4).map((r:any,i:number)=>(
                <a key={`gh-${i}`} href={r.url} target="_blank" rel="noreferrer" style={{background:'#fff',border:'3px solid #000',padding:'1rem',boxShadow:'4px 4px 0 #000',display:'flex',flexDirection:'column',textDecoration:'none',color:'#000'}}>
                  <div style={{fontSize:'1rem',fontWeight:900,marginBottom:'0.3rem'}}>{r.name}</div>
                  {r.description&&<div style={{fontSize:'0.75rem',fontWeight:600,marginBottom:'0.5rem',lineHeight:1.4}}>{r.description.slice(0,50)}</div>}
                  <div style={{marginTop:'auto',fontSize:'0.7rem',fontWeight:800}}>★ {r.stars} · {r.language||'CODE'}</div>
                </a>
              ))}
            </div>
          </div>}
          
          {eduList.length>0 && <div>
            <BrutalistSH label="Education"/>
            {eduList.map((e,i)=>{const[date,...rest]=e.split(':');return(
              <div key={i} style={{borderBottom:'3px solid #000',paddingBottom:'0.5rem',marginBottom:'0.5rem',display:'grid',gridTemplateColumns:'80px 1fr'}}>
                <div style={{fontWeight:800,fontSize:'0.8rem'}}>{date}</div>
                <div style={{fontWeight:700}}>{rest.join(':').trim()}</div>
              </div>
            );})}
          </div>}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 5 — GLASS (Ethereal, premium DeFi, glowing)
══════════════════════════════════════════════════════════════ */
const GlassSH = ({label}:{label:string}) => (
  <div style={{fontSize:'0.75rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.15em',color:'#a2b2e8',marginBottom:'1rem',borderBottom:'1px solid rgba(162,178,232,0.2)',paddingBottom:'0.5rem'}}>{label}</div>
);

function GlassTemplate({data, ghData, parseList, projects, reputationScore}: TmplProps) {
  const expList = parseList(data.exp);
  const sklList = parseList(data.skl);

  return (
    <div style={{background:'#040509',fontFamily:"'Inter',system-ui,sans-serif",color:'#e4eaf5',minHeight:'700px',position:'relative',overflow:'hidden',padding:'2rem'}}>
      {/* Background Orbs */}
      <div style={{position:'absolute',top:'-10%',left:'-10%',width:'50%',aspectRatio:'1',background:'radial-gradient(circle, rgba(62,43,158,0.4) 0%, transparent 70%)',filter:'blur(60px)',zIndex:0,pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:'-20%',right:'-10%',width:'60%',aspectRatio:'1',background:'radial-gradient(circle, rgba(32,95,175,0.3) 0%, transparent 70%)',filter:'blur(60px)',zIndex:0,pointerEvents:'none'}}/>
      
      <div style={{position:'relative',zIndex:1,display:'grid',gridTemplateColumns:'320px 1fr',gap:'2rem'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'24px',padding:'2rem',backdropFilter:'blur(20px)',boxShadow:'0 20px 40px rgba(0,0,0,0.4)'}}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:'1.5rem'}}>
              {data.p ? <img src={data.p} alt={data.n} style={{width:'140px',height:'140px',objectFit:'cover',borderRadius:'50%',border:'2px solid rgba(162,178,232,0.3)',boxShadow:'0 0 20px rgba(62,43,158,0.5)'}}/> : <div style={{width:'140px',height:'140px',borderRadius:'50%',background:'linear-gradient(135deg, rgba(62,43,158,0.5), rgba(32,95,175,0.5))',border:'2px solid rgba(162,178,232,0.3)'}}/>}
            </div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'1.8rem',fontWeight:700,background:'linear-gradient(to right, #fff, #a2b2e8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',lineHeight:1.2,marginBottom:'0.3rem'}}>{data.n||'Your Name'}</div>
              <div style={{fontSize:'0.85rem',color:'#8497ce',fontWeight:500,letterSpacing:'0.05em'}}>{data.r||'Role'}</div>
              {data.avail==='1' && <div style={{marginTop:'1rem',display:'inline-flex',alignItems:'center',gap:'0.4rem',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',color:'#818cf8',padding:'0.3rem 0.8rem',borderRadius:'100px',fontSize:'0.65rem',fontWeight:600}}><div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#818cf8',boxShadow:'0 0 8px #818cf8'}}/> AVAILABLE</div>}
            </div>
          </div>

          <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:'24px',padding:'1.75rem',backdropFilter:'blur(20px)'}}>
            {data.b && <p style={{fontSize:'0.8rem',color:'#b0c0d0',lineHeight:1.7,marginBottom:'1.5rem'}}>{data.b}</p>}
            <GlassSH label="Contact"/>
            <div style={{display:'flex',flexDirection:'column',gap:'0.6rem'}}>
              {data.e&&<div style={{fontSize:'0.75rem',color:'#a2b2e8'}}>{data.e}</div>}
              {data.tw&&<div style={{fontSize:'0.75rem',color:'#a2b2e8'}}>𝕏 / @{data.tw}</div>}
              {data.gh&&<div style={{fontSize:'0.75rem',color:'#a2b2e8'}}>GitHub / {data.gh}</div>}
              {data.web&&<div style={{fontSize:'0.75rem',color:'#a2b2e8'}}>🌐 {data.web.replace(/https?:\/\//,'')}</div>}
            </div>
          </div>
          
          {reputationScore!=='0' && <div style={{background:'linear-gradient(135deg, rgba(62,43,158,0.2), rgba(32,95,175,0.2))',border:'1px solid rgba(162,178,232,0.2)',borderRadius:'24px',padding:'1.5rem',backdropFilter:'blur(20px)',textAlign:'center',marginTop:'auto'}}>
            <div style={{fontSize:'0.65rem',color:'#8497ce',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.5rem'}}>Web3 Reputation</div>
            <div style={{fontSize:'2.8rem',fontWeight:300,color:'#fff',textShadow:'0 0 20px rgba(162,178,232,0.5)',lineHeight:1}}>{reputationScore}</div>
          </div>}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
          {expList.length>0 && <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:'24px',padding:'2rem',backdropFilter:'blur(20px)'}}>
            <GlassSH label="Experience"/>
            <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
              {expList.map((e,i)=>{const[date,...rest]=e.split(':');return(
                <div key={i} style={{position:'relative',paddingLeft:'1.25rem',borderLeft:'1px solid rgba(162,178,232,0.2)'}}>
                  <div style={{position:'absolute',left:'-3px',top:'5px',width:'5px',height:'5px',borderRadius:'50%',background:'#a2b2e8',boxShadow:'0 0 8px #a2b2e8'}}/>
                  <div style={{fontSize:'0.65rem',color:'#8497ce',marginBottom:'0.2rem'}}>{date}</div>
                  <div style={{fontSize:'0.9rem',fontWeight:500,color:'#e4eaf5'}}>{rest.join(':').trim()}</div>
                </div>
              );})}
            </div>
          </div>}

          {(projects.length>0 || ghData?.topRepos?.length>0) && <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:'24px',padding:'2rem',backdropFilter:'blur(20px)'}}>
            <GlassSH label="Selected Work"/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              {projects.map((p,i)=>(
                <div key={i} style={{background:'rgba(0,0,0,0.2)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'1.25rem',transition:'transform 0.2s'}}>
                  <div style={{fontSize:'0.9rem',fontWeight:600,color:'#fff',marginBottom:'0.4rem'}}>{p.name}</div>
                  {p.desc&&<div style={{fontSize:'0.7rem',color:'#8497ce',lineHeight:1.5,marginBottom:'0.75rem'}}>{p.desc}</div>}
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'auto'}}>
                    <div style={{fontSize:'0.6rem',color:'#6b7280',background:'rgba(255,255,255,0.05)',padding:'0.2rem 0.5rem',borderRadius:'100px'}}>{p.tech||'Project'}</div>
                    {p.url&&<a href={p.url} target="_blank" rel="noreferrer" style={{color:'#a2b2e8',fontSize:'0.7rem',textDecoration:'none'}}>↗</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>}

          {sklList.length>0 && <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:'24px',padding:'2rem',backdropFilter:'blur(20px)'}}>
            <GlassSH label="Capabilities"/>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.6rem'}}>
              {sklList.map((s,i)=><span key={i} style={{fontSize:'0.75rem',color:'#c4d0eb',background:'rgba(162,178,232,0.1)',border:'1px solid rgba(162,178,232,0.2)',padding:'0.4rem 0.8rem',borderRadius:'100px'}}>{s}</span>)}
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 6 — PAPER (Scholar, research, editorial, serif)
══════════════════════════════════════════════════════════════ */
const PaperSH = ({label}:{label:string}) => (
  <div style={{fontSize:'0.8rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'#800000',borderBottom:'1px solid #ccc',paddingBottom:'0.4rem',marginBottom:'1.25rem',fontFamily:"'Georgia',serif"}}>{label}</div>
);

function PaperTemplate({data, parseList, projects, reputationScore}: TmplProps) {
  const expList = parseList(data.exp);
  const eduList = parseList(data.edu);
  const sklList = parseList(data.skl);

  return (
    <div style={{background:'#fcfbf8',fontFamily:"'Georgia','Times New Roman',serif",color:'#222',minHeight:'700px',padding:'3rem 4rem',boxShadow:'inset 0 0 60px rgba(0,0,0,0.02)',position:'relative'}}>
      {/* Texture hint */}
      <div style={{position:'absolute',inset:0,opacity:0.4,pointerEvents:'none',backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}/>
      
      <div style={{position:'relative',zIndex:1,maxWidth:'800px',margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:'3rem',display:'flex',flexDirection:'column',alignItems:'center'}}>
          {data.p && <img src={data.p} alt="profile" style={{width:'100px',height:'100px',borderRadius:'50%',objectFit:'cover',marginBottom:'1.5rem',filter:'grayscale(100%)',border:'1px solid #ccc'}}/>}
          <div style={{fontSize:'2.5rem',fontWeight:400,color:'#111',marginBottom:'0.5rem',letterSpacing:'-0.5px'}}>{data.n||'Firstname Lastname'}</div>
          <div style={{fontSize:'1rem',fontStyle:'italic',color:'#555',marginBottom:'1rem'}}>{data.r||'Professional Title'}</div>
          <div style={{display:'flex',justifyContent:'center',gap:'1rem',fontSize:'0.75rem',color:'#444',fontFamily:"system-ui,sans-serif"}}>
            {data.e&&<span>{data.e}</span>}
            {data.tw&&<span>• @{data.tw}</span>}
            {data.web&&<span>• {data.web.replace(/https?:\/\//,'')}</span>}
          </div>
          {data.avail==='1' && <div style={{marginTop:'1rem',fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.1em',color:'#800000',fontFamily:"system-ui,sans-serif"}}>Currently Available for Opportunities</div>}
        </div>

        {data.b && <div style={{fontSize:'0.95rem',lineHeight:1.8,color:'#333',marginBottom:'3rem',textAlign:'justify',textIndent:'2rem'}}>
          {data.b}
        </div>}

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3rem'}}>
          <div>
            {expList.length>0 && <div style={{marginBottom:'2.5rem'}}>
              <PaperSH label="Professional Experience"/>
              <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
                {expList.map((e,i)=>{const[date,...rest]=e.split(':');return(
                  <div key={i}>
                    <div style={{fontSize:'0.9rem',fontWeight:700,color:'#111',marginBottom:'0.2rem'}}>{rest.join(':').trim()}</div>
                    <div style={{fontSize:'0.75rem',fontStyle:'italic',color:'#666'}}>{date}</div>
                  </div>
                );})}
              </div>
            </div>}
            
            {eduList.length>0 && <div>
              <PaperSH label="Education"/>
              <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                {eduList.map((e,i)=>{const[date,...rest]=e.split(':');return(
                  <div key={i}>
                    <div style={{fontSize:'0.9rem',color:'#111'}}>{rest.join(':').trim()}</div>
                    <div style={{fontSize:'0.75rem',fontStyle:'italic',color:'#666'}}>{date}</div>
                  </div>
                );})}
              </div>
            </div>}
          </div>

          <div>
            {projects.length>0 && <div style={{marginBottom:'2.5rem'}}>
              <PaperSH label="Selected Projects"/>
              <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
                {projects.map((p,i)=>(
                  <div key={i}>
                    <div style={{display:'flex',alignItems:'baseline',gap:'0.5rem',marginBottom:'0.2rem'}}>
                      <span style={{fontSize:'0.9rem',fontWeight:700,color:'#111'}}>{p.name}</span>
                      {p.url&&<a href={p.url} target="_blank" rel="noreferrer" style={{fontSize:'0.7rem',color:'#800000',textDecoration:'none',fontFamily:"system-ui,sans-serif"}}>[Link]</a>}
                    </div>
                    {p.desc&&<div style={{fontSize:'0.8rem',lineHeight:1.6,color:'#444',marginBottom:'0.3rem'}}>{p.desc}</div>}
                    {p.tech&&<div style={{fontSize:'0.7rem',color:'#666',fontStyle:'italic'}}>{p.tech}</div>}
                  </div>
                ))}
              </div>
            </div>}

            {sklList.length>0 && <div>
              <PaperSH label="Technical Skills"/>
              <p style={{fontSize:'0.85rem',lineHeight:1.8,color:'#333'}}>
                {sklList.join(' • ')}
              </p>
            </div>}

            {reputationScore!=='0' && <div style={{marginTop:'2.5rem',borderTop:'1px solid #ccc',paddingTop:'1.5rem',textAlign:'center'}}>
              <div style={{fontSize:'0.75rem',fontFamily:"system-ui,sans-serif",textTransform:'uppercase',letterSpacing:'0.1em',color:'#666',marginBottom:'0.5rem'}}>Verified Web3 Reputation</div>
              <div style={{fontSize:'2rem',color:'#800000'}}>{reputationScore}</div>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}



/* ══════════════════════════════════════════════════════════════
   MAIN CLIENT COMPONENT
══════════════════════════════════════════════════════════════ */
export default function CVPageClient({ wallet }: { wallet: string }) {
  const [data, setData]       = useState<CVData|null>(null);
  const [solData, setSolData] = useState<any>(null);
  const [ghData, setGhData]   = useState<any>(null);
  const [evmData, setEvmData] = useState<any>(null);
  const [isLoadingScore, setIsLoadingScore] = useState(true);
  
  const walletAdapter = useWallet();
  const [isMinting, setIsMinting] = useState(false);

  const handleMintIdentity = async () => {
    if (!walletAdapter.connected || !walletAdapter.publicKey) {
      alert("Please connect your Solana wallet first (using the top right nav button)!");
      return;
    }

    try {
      setIsMinting(true);
      const umi = createUmi(process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.mainnet-beta.solana.com')
        .use(walletAdapterIdentity(walletAdapter));

      const asset = generateSigner(umi);
      const uri = `${window.location.origin}/api/mint/metadata?n=${encodeURIComponent(data?.n || '')}&r=${encodeURIComponent(data?.r || '')}&p=${encodeURIComponent(data?.p || '')}`;

      await create(umi, {
        asset,
        name: `YoChain ID: ${data?.n || 'User'}`,
        uri: uri,
      }).sendAndConfirm(umi);

      alert(`Identity Minted successfully! Check your wallet for the NFT.\nAddress: ${asset.publicKey.toString()}`);
    } catch (err: any) {
      console.error(err);
      alert(`Failed to mint identity: ${err.message}`);
    } finally {
      setIsMinting(false);
    }
  };

  const [downloading, setDownloading] = useState(false);
  const [cvTheme, setCvTheme] = useState<'dark'|'light'>('dark');

  const downloadPDF = async () => {
    const el = document.getElementById('cv-content');
    if (!el) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(el,{scale:2,useCORS:true,allowTaint:true,backgroundColor:'#1e1e1e',logging:false,imageTimeout:15000});
      const pdf = new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height*pdfW)/canvas.width;
      pdf.addImage(canvas.toDataURL('image/jpeg',0.95),'JPEG',0,0,pdfW,pdfH);
      const url = URL.createObjectURL(pdf.output('blob'));
      window.open(url,'_blank');
      setTimeout(()=>URL.revokeObjectURL(url),10000);
    } catch(err){ console.error(err); alert('Gagal generate PDF.'); }
    finally { setDownloading(false); }
  };

  const parseList = (str?:string) => !str ? [] : str.split(',').filter(s=>s.trim()).map(s=>s.trim());
  const parseProjects = (str?:string): ProjectEntry[] => !str ? [] :
    str.split(';;').filter(Boolean).map(p=>{const[n,d,u,t]=p.split('|');return{name:n||'',desc:d||'',url:u||'',tech:t||''};});

  useEffect(()=>{
    const p = new URLSearchParams(window.location.search).get('d');
    if(!p) return;
    try{
      const decoded = JSON.parse(atob(p));
      setData(decoded);
      if(decoded.theme) setCvTheme(decoded.theme);
      
      const promises = [];
      if(decoded.gh) promises.push(fetch(`/api/github?username=${decoded.gh}`).then(r=>r.json()).then(setGhData).catch(console.error));
      if(decoded.sol) promises.push(fetch(`/api/solana?wallet=${decoded.sol}`).then(r=>r.json()).then(setSolData).catch(console.error));
      // Now uses server-side /api/evm for proper multi-chain support + Covalent
      if(decoded.evm?.startsWith('0x') && decoded.evm.length >= 40) {
        promises.push(fetch(`/api/evm?address=${decoded.evm}`).then(r=>r.json()).then(setEvmData).catch(console.error));
      }
      
      Promise.allSettled(promises).then(() => setIsLoadingScore(false));
    }catch(e){console.error(e); setIsLoadingScore(false);}
  },[]);

  if(!data) return <div style={{textAlign:'center',marginTop:'5rem',color:'var(--text-muted)'}}>Loading YoChain Profile...</div>;

  const isDark   = cvTheme === 'dark';
  const c        = (dark:string,light:string) => isDark?dark:light;
  const projects = parseProjects(data.proj);
  const reputationScore = isLoadingScore ? '...' : (
    (solData?.totalTransactions||0) * 0.04 +
    (solData?.swapCount||0) * 5 +
    (solData?.nftCount||0) * 3 +
    (solData?.tokenCount||0) * 2 +
    (evmData?.txCount||0) * 0.05 +
    ((evmData?.chains?.length||0)) * 20 +
    (ghData?.stats?.totalStars||0) * 2 +
    (ghData?.user?.publicRepos||0) * 1 +
    (data.tw ? 50 : 0)
  ).toFixed(0);

  const tmpl = data.tmpl || 'default';
  const tmplProps: TmplProps = {data,ghData,solData,evmData,projects,parseList,reputationScore,wallet,isDark,c};
  const isSpecialTemplate = ['cyber','minimal','modern','brutalist','glass','paper'].includes(tmpl);

  return (
    <>
      <Nav />
      {/* Floating Mint Button */}
      <div className="no-print" style={{position: 'fixed', bottom: '2.5rem', right: '2.5rem', zIndex: 999}}>
        <button 
          onClick={handleMintIdentity} 
          disabled={isMinting}
          style={{
            background: 'rgba(12, 12, 12, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: '#eaeaea',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '0.85rem 1.4rem',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            cursor: isMinting ? 'wait' : 'pointer',
            transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
            opacity: isMinting ? 0.7 : 1,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            borderRadius: '2px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(24, 24, 24, 0.95)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(12, 12, 12, 0.85)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {isMinting ? 'MINTING IN PROGRESS' : 'MINT ONCHAIN ID'}
        </button>
      </div>

      <div className="no-print" style={{background:'#1a1a1a',borderBottom:'1px solid var(--border-color)',padding:'0.75rem 0'}}>
        <div className="container" style={{display:'flex',justifyContent:'flex-end',gap:'0.75rem'}}>
          <button onClick={downloadPDF} disabled={downloading} className="btn btn-outline" style={{fontSize:'0.8rem',padding:'0.5rem 1rem'}}>
            {downloading?'Generating...':'⬇ Download PDF'}
          </button>
          {!isSpecialTemplate && (
            <button onClick={()=>setCvTheme(t=>t==='dark'?'light':'dark')} className="btn btn-outline" style={{fontSize:'0.8rem',padding:'0.5rem 1rem'}}>
              {cvTheme==='dark'?'☀️ Light Mode':'🌙 Dark Mode'}
            </button>
          )}
          <Link href="/" className="btn btn-primary" style={{fontSize:'0.8rem',padding:'0.5rem 1rem'}}>Build Your YoChain Profile</Link>
        </div>
      </div>

      {/* ── Full-width CV page with side decorations ── */}
      <div style={{
        position:'relative', minHeight:'100vh',
        background: tmpl==='minimal' ? '#e8e8e8' : tmpl==='modern' ? '#e0e0e0' : '#0e0e0e',
        padding:'2rem 0 4rem',
      }}>
        {/* Left decoration panel */}
        <div className="no-print" style={{
          position:'fixed', top:0, left:0, bottom:0, width:'calc((100vw - 960px)/2)',
          display:'flex', flexDirection:'column', alignItems:'flex-end', justifyContent:'center',
          padding:'0 1.5rem', pointerEvents:'none', zIndex:0,
          background: tmpl==='minimal'||tmpl==='modern'||tmpl==='paper' ? 'linear-gradient(to right,#c8c8c8,transparent)' : tmpl==='brutalist' ? 'linear-gradient(to right,#ffde00,transparent)' : 'linear-gradient(to right,#080808,transparent)',
        }}>
          {tmpl==='cyber' && (
            <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',alignItems:'flex-end'}}>
              {[...Array(8)].map((_,i)=><div key={i} style={{width:`${60-i*5}px`,height:'2px',background:`rgba(0,255,65,${(8-i)/8*0.8})`}}/>)}
              <div style={{marginTop:'2rem',fontFamily:'monospace',fontSize:'0.62rem',color:'rgba(0,255,65,0.35)',writingMode:'vertical-rl'}}>YOCHAIN // WEB3</div>
            </div>
          )}
          {tmpl==='modern' && (
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',alignItems:'flex-end'}}>
              {[...Array(6)].map((_,i)=><div key={i} style={{width:`${50-i*5}px`,height:'3px',background:`rgba(230,51,41,${(6-i)/6*0.6})`,borderRadius:'2px'}}/>)}
              <div style={{marginTop:'1.5rem',fontSize:'0.58rem',color:'rgba(230,51,41,0.35)',textTransform:'uppercase',letterSpacing:'0.2em',writingMode:'vertical-rl'}}>Portfolio · Web3</div>
            </div>
          )}
          {tmpl==='minimal' && <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',alignItems:'flex-end'}}>{[...Array(5)].map((_,i)=><div key={i} style={{width:`${40-i*4}px`,height:'2px',background:'rgba(0,0,0,0.15)'}}/>)}</div>}
          {tmpl==='brutalist' && <div style={{display:'flex',flexDirection:'column',gap:'1rem',alignItems:'flex-end'}}><div style={{width:'80px',height:'20px',background:'#000',transform:'skew(-20deg)'}}/><div style={{fontSize:'2rem',fontWeight:900,color:'rgba(0,0,0,0.1)',writingMode:'vertical-rl'}}>RAW</div></div>}
          {tmpl==='glass' && <div style={{width:'2px',height:'150px',background:'linear-gradient(to bottom, transparent, rgba(162,178,232,0.5), transparent)'}}/>}
          {tmpl==='paper' && <div style={{fontSize:'0.7rem',fontFamily:"'Georgia',serif",color:'rgba(0,0,0,0.2)',writingMode:'vertical-rl',letterSpacing:'0.2em'}}>C V .</div>}
          {tmpl==='default' && (
            <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',alignItems:'flex-end'}}>
              {[...Array(8)].map((_,i)=><div key={i} style={{width:`${60-i*5}px`,height:'2px',background:`rgba(244,106,42,${(8-i)/8*0.7})`}}/>)}
              <div style={{marginTop:'2rem',fontSize:'0.58rem',color:'rgba(244,106,42,0.3)',textTransform:'uppercase',letterSpacing:'0.2em',writingMode:'vertical-rl'}}>YoChain Profile</div>
            </div>
          )}
        </div>

        {/* Right decoration panel */}
        <div className="no-print" style={{
          position:'fixed', top:0, right:0, bottom:0, width:'calc((100vw - 960px)/2)',
          display:'flex', flexDirection:'column', alignItems:'flex-start', justifyContent:'center',
          padding:'0 1.5rem', pointerEvents:'none', zIndex:0,
          background: tmpl==='minimal'||tmpl==='modern'||tmpl==='paper' ? 'linear-gradient(to left,#c8c8c8,transparent)' : tmpl==='brutalist' ? 'linear-gradient(to left,#ffde00,transparent)' : 'linear-gradient(to left,#080808,transparent)',
        }}>
          {tmpl==='cyber' && <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>{[...Array(8)].map((_,i)=><div key={i} style={{width:`${60-i*5}px`,height:'2px',background:`rgba(0,255,65,${(8-i)/8*0.8})`}}/>)}</div>}
          {tmpl==='modern' && <div><div style={{width:'4px',height:'100px',background:'linear-gradient(to bottom,#e63329,transparent)',borderRadius:'2px',marginBottom:'0.75rem'}}/><div style={{fontSize:'0.58rem',color:'rgba(230,51,41,0.35)',textTransform:'uppercase',letterSpacing:'0.15em',writingMode:'vertical-rl'}}>YoChain CV</div></div>}
          {tmpl==='minimal' && <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>{[...Array(5)].map((_,i)=><div key={i} style={{width:`${40-i*4}px`,height:'2px',background:'rgba(0,0,0,0.15)'}}/>)}</div>}
          {tmpl==='brutalist' && <div style={{width:'40px',height:'40px',background:'#ffde00',border:'3px solid #000',boxShadow:'4px 4px 0 #000',transform:'rotate(15deg)'}}/>}
          {tmpl==='glass' && <div style={{width:'100px',height:'100px',borderRadius:'50%',background:'radial-gradient(circle, rgba(162,178,232,0.1), transparent)',filter:'blur(20px)'}}/>}
          {tmpl==='paper' && <div style={{width:'1px',height:'200px',background:'rgba(0,0,0,0.1)'}}/>}
          {tmpl==='default' && <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>{[...Array(6)].map((_,i)=><div key={i} style={{width:`${50-i*4}px`,height:'2px',background:`rgba(244,106,42,${(6-i)/6*0.5})`}}/>)}</div>}
        </div>

        {/* CV content */}
        <div style={{maxWidth:'960px',margin:'0 auto',padding:'0 1.5rem',position:'relative',zIndex:1}}>
          <div id="cv-content">
            {tmpl==='cyber'   && <CyberTemplate {...tmplProps}/>}
            {tmpl==='minimal' && <MinimalTemplate {...tmplProps}/>}
            {tmpl==='modern'  && <ModernTemplate {...tmplProps}/>}
            {tmpl==='brutalist' && <BrutalistTemplate {...tmplProps}/>}
            {tmpl==='glass'   && <GlassTemplate {...tmplProps}/>}
            {tmpl==='paper'   && <PaperTemplate {...tmplProps}/>}
            {tmpl==='default' && <DefaultTemplate {...tmplProps} cvTheme={cvTheme}/>}
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 0 — DEFAULT (existing dark magazine)
══════════════════════════════════════════════════════════════ */
function DefaultTemplate({data,ghData,solData,evmData,projects,parseList,reputationScore,wallet,isDark,c,cvTheme}: TmplProps&{cvTheme:string}) {
  const expList = parseList(data.exp);
  const eduList = parseList(data.edu);
  const sklList = parseList(data.skl);
  const langList= parseList(data.lang);
  const certList= parseList(data.cert);
  const isAvailable = data.avail==='1';

  return (
    <div className={`cv-dark-wrapper ${cvTheme==='light'?'cv-theme-light':''}`} style={{boxShadow:'none'}}>
      {/* Header */}
      <div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'2rem',paddingBottom:'2rem',borderBottom:'1px solid #2a2a2a'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
          <h1 style={{color:'var(--accent-orange)',fontSize:'2.5rem',marginBottom:0}}>{data.n||'Web3 Developer'}</h1>
          <h2 style={{color:'var(--text-muted)',fontSize:'1.25rem',fontWeight:400}}>{data.r||'Digital Native'}</h2>
          <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginTop:'0.25rem'}}>
            {isAvailable&&<span style={{display:'inline-flex',alignItems:'center',gap:'0.4rem',background:'rgba(244,106,42,0.12)',border:'1px solid var(--accent-orange)',color:'var(--accent-orange)',padding:'0.3rem 0.9rem',borderRadius:'100px',fontSize:'0.8rem',fontWeight:700}}>⚡ Available for Work</span>}
            {data.web&&<a href={data.web.startsWith('http')?data.web:`https://${data.web}`} target="_blank" rel="noreferrer" style={{display:'inline-flex',alignItems:'center',gap:'0.4rem',background:'#2a2a2a',border:'1px solid var(--border-color)',color:'var(--text-muted)',padding:'0.3rem 0.9rem',borderRadius:'100px',fontSize:'0.8rem',textDecoration:'none'}}>🌐 {data.web.replace(/https?:\/\//,'').split('/')[0]}</a>}
          </div>
        </div>
        <div style={{color:'var(--text-muted)',fontSize:'0.85rem',textAlign:'right'}}>
          Wallet Verified<br/>
          {solData?.domainName ? (
            <span style={{color:'#14F195',fontWeight:700}}>{solData.domainName}</span>
          ) : (
            <span style={{color:'var(--text-main)',fontFamily:'monospace'}}>{wallet?`${wallet.slice(0,8)}...${wallet.slice(-6)}`:''}</span>
          )}
        </div>
      </div>

      <div className="cv-grid">
        {/* Left */}
        <div>
          {data.p?<img src={data.p} alt={data.n} className="cv-photo" style={{border:'5px solid #2a2a2a'}}/>:<div className="cv-photo" style={{display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)',border:'5px solid #2a2a2a'}}>No Photo</div>}

          <div className="section-title">Experience</div>
          <div className="timeline" style={{marginBottom:'2.5rem'}}>
            {expList.map((e,i)=>{const[date,...r]=e.split(':');return(<div key={i} className="timeline-item"><div className="timeline-date" style={{color:'var(--accent-orange)',fontWeight:600}}>{date}</div><div className="timeline-title" style={{fontSize:'1rem',color:c('#fff','#111')}}>{r.join(':').trim()}</div></div>);})}
            {expList.length===0&&<div style={{color:'var(--text-muted)',fontSize:'0.9rem'}}>N/A</div>}
          </div>

          <div className="section-title">Education</div>
          <div className="timeline" style={{marginBottom:'2.5rem'}}>
            {eduList.map((e,i)=>{const[date,...r]=e.split(':');return(<div key={i} className="timeline-item" style={{paddingBottom:'1rem'}}><div className="timeline-date">{date}</div><div className="timeline-title" style={{fontSize:'1rem'}}>{r.join(':').trim()}</div></div>);})}
            {eduList.length===0&&<div style={{color:'var(--text-muted)',fontSize:'0.9rem'}}>N/A</div>}
          </div>

          {certList.length>0&&<><div className="section-title">Certifications</div><div style={{display:'flex',flexDirection:'column',gap:'0.5rem',marginBottom:'2.5rem'}}>{certList.map((c2,i)=><div key={i} style={{fontSize:'0.9rem',color:'var(--text-main)',padding:'0.5rem 0.75rem',background:'rgba(244,106,42,0.08)',border:'1px solid rgba(244,106,42,0.25)',borderRadius:'var(--radius)',display:'flex',alignItems:'center',gap:'0.5rem'}}>🏅 {c2}</div>)}</div></>}

          <div className="section-title">Skills</div>
          <div className="skill-list" style={{gap:'0.8rem',marginBottom:'2.5rem'}}>{sklList.map((s,i)=><div key={i} className="skill-item" style={{fontSize:'1.05rem',fontWeight:600,color:c('#fff','#222')}}>{s}</div>)}</div>

          {langList.length>0&&<><div className="section-title">Languages</div><div className="skill-list" style={{gap:'0.6rem',marginBottom:'2.5rem'}}>{langList.map((l,i)=><div key={i} className="skill-item">{l}</div>)}</div></>}
        </div>

        {/* Right */}
        <div>
          <div className="cv-hello">HELLO<span>!</span></div>
          <div className="cv-bio-text"><p>{data.b||'Decentralized builder navigating the new internet.'}</p></div>

          {/* Top GitHub Repos */}
          {ghData&&!ghData.error&&ghData.topRepos?.length>0&&(<>
            <div className="section-title">Top GitHub Repos</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'2.5rem'}}>
              {ghData.topRepos.slice(0,4).map((r:any,i:number)=>(
                <a key={i} href={r.url} target="_blank" rel="noreferrer" style={{textDecoration:'none',background:'var(--bg-dark)',border:'1px solid var(--border-color)',borderRadius:'var(--radius)',padding:'0.85rem',display:'block'}}>
                  <div style={{fontWeight:700,color:'var(--accent-orange)',fontSize:'0.9rem',marginBottom:'0.3rem'}}>{r.name}</div>
                  {r.description&&<div style={{fontSize:'0.78rem',color:'var(--text-muted)',marginBottom:'0.5rem',lineHeight:1.4}}>{r.description.slice(0,80)}{r.description.length>80?'...':''}</div>}
                  <div style={{display:'flex',gap:'0.75rem',fontSize:'0.75rem',color:'var(--text-muted)'}}>
                    <span>⭐{r.stars}</span><span>🍴{r.forks}</span>
                    {r.language&&<span style={{color:c('#fff','#333')}}>● {r.language}</span>}
                  </div>
                </a>
              ))}
            </div>
          </>)}

          {/* Projects */}
          {projects.length>0&&(<>
            <div className="section-title">Projects</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'2.5rem'}}>
              {projects.map((p,i)=>(
                <div key={i} style={{background:'var(--bg-dark)',border:'1px solid var(--border-color)',borderRadius:'var(--radius)',padding:'1rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.4rem'}}>
                    <div style={{fontWeight:700,color:c('#fff','#111'),fontSize:'1rem'}}>{p.name}</div>
                    {p.url&&<a href={p.url} target="_blank" rel="noreferrer" style={{color:'var(--accent-orange)',fontSize:'0.8rem',textDecoration:'none',whiteSpace:'nowrap',marginLeft:'0.5rem'}}>↗ Link</a>}
                  </div>
                  {p.desc&&<div style={{fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:'0.6rem',lineHeight:1.5}}>{p.desc}</div>}
                  {p.tech&&<div style={{display:'flex',flexWrap:'wrap',gap:'0.3rem'}}>{p.tech.split(',').map((t,j)=><span key={j} style={{fontSize:'0.7rem',background:'rgba(244,106,42,0.12)',color:'var(--accent-orange)',padding:'0.15rem 0.5rem',borderRadius:'100px'}}>{t.trim()}</span>)}</div>}
                </div>
              ))}
            </div>
          </>)}

          {/* Reputation Score */}
          {(solData||ghData||evmData)&&(<>
            <div className="section-title" style={{color:'var(--text-muted)'}}>Reputation Score</div>
            <div className="stat-box" style={{display:'flex',alignItems:'center',gap:'1.5rem',background:'linear-gradient(135deg, rgba(244,106,42,0.15) 0%, rgba(30,30,30,0.5) 100%)',borderColor:'var(--accent-orange)',marginBottom:'1rem'}}>
              <div className="stat-box-val" style={{fontSize:'3.5rem',marginBottom:0,color:'var(--accent-orange)'}}>{reputationScore}</div>
              <div>
                <div style={{color:c('#fff','#111'),fontWeight:700,fontSize:'1.1rem'}}>Total Web3 Score</div>
                <div style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>Solana + EVM Multichain + GitHub + Socials</div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              {solData && (
                <div className="stat-box" style={{borderColor:'#9945FF'}}>
                  <span style={{fontSize:'0.75rem',color:'#9945FF',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em'}}>Solana</span>
                  <div className="stat-box-val" style={{color:'#9945FF',marginTop:'0.5rem'}}>
                    {solData.totalTransactions > 1000 ? `${(solData.totalTransactions/1000).toFixed(1)}k` : solData.totalTransactions}
                  </div>
                  <div className="stat-box-lbl">
                    {solData.swapCount > 0 ? `${solData.swapCount} Swaps` : 'Transactions'}
                  </div>
                  {solData.protocols?.length > 0 && (
                    <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.4'}}>
                      Top Protocols: <span style={{color: '#ccc'}}>{solData.protocols.slice(0,5).join(', ')}</span>
                    </div>
                  )}
                  {solData.badges?.length > 0 && (
                    <div style={{marginTop:'0.75rem',display:'flex',flexWrap:'wrap',gap:'0.4rem'}}>
                      {solData.badges.map((b: string, i: number) => (
                        <span key={`badge-${i}`} style={{fontSize:'0.7rem',background:'rgba(20,241,149,0.05)',border:'1px solid rgba(20,241,149,0.3)',color:'#14F195',padding:'0.15rem 0.4rem',borderRadius:'4px',fontWeight:600}}>
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {evmData && (
                <div className="stat-box" style={{borderColor:'#627EEA'}}>
                  <span style={{fontSize:'0.75rem',color:'#627EEA',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em'}}>EVM Multichain</span>
                  <div className="stat-box-val" style={{color:'#627EEA',marginTop:'0.5rem'}}>
                    {evmData.txCount > 1000 ? `${(evmData.txCount/1000).toFixed(1)}k` : evmData.txCount}
                  </div>
                  <div className="stat-box-lbl">{evmData.chains?.length || 0} Active Chains</div>
                  {evmData.chains?.length > 0 && (
                    <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.4'}}>
                      <span style={{color: '#ccc'}}>{evmData.chains.slice(0,6).map((c:any)=>c.chain).join(', ')}</span>
                    </div>
                  )}
                </div>
              )}
              {ghData&&!ghData.error&&<div className="stat-box"><span style={{fontSize:'0.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em'}}>GitHub</span><div className="stat-box-val" style={{marginTop:'0.5rem'}}>{ghData.stats?.totalStars||0}</div><div className="stat-box-lbl">{ghData.user?.publicRepos||0} Repos · Stars</div></div>}
              {data.tw&&<div className="stat-box"><span style={{fontSize:'0.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em'}}>X / Twitter</span><div className="stat-box-val" style={{marginTop:'0.5rem'}}>+50</div><div className="stat-box-lbl">@{data.tw} · Identity Bonus</div></div>}
            </div>
          </>)}

          {/* Contact & Socials */}
          {(data.e||data.tw||data.gh||data.web)&&(<>
            <div className="section-title" style={{marginTop:'2.5rem'}}>Contact & Socials</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem'}}>
              {data.e&&<a href={`mailto:${data.e}`} className="cv-contact-btn">{data.e}</a>}
              {data.tw&&<a href={`https://twitter.com/${data.tw}`} target="_blank" rel="noreferrer" className="cv-contact-btn" style={{background:'#2a2a2a'}}>@{data.tw}</a>}
              {data.web&&<a href={data.web.startsWith('http')?data.web:`https://${data.web}`} target="_blank" rel="noreferrer" className="cv-contact-btn" style={{background:'#2a2a2a'}}>🌐 {data.web.replace(/https?:\/\//,'').split('/')[0]}</a>}
              {data.gh&&<a href={`https://github.com/${data.gh}`} target="_blank" rel="noreferrer" className="cv-contact-btn" style={{background:'transparent',border:'1px solid var(--accent-orange)',color:'var(--accent-orange)'}}>GitHub: @{data.gh}</a>}
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}
