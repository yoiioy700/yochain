'use client';

import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import Link from 'next/link';

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
   TEMPLATE 1 — CYBER (neon green, dark, circular skills)
══════════════════════════════════════════════════════════════ */
function CyberTemplate({data, ghData, parseList, reputationScore, wallet}: TmplProps) {
  const G = '#00ff41';
  const skillList = parseList(data.skl);
  const langList  = parseList(data.lang);
  const expList   = parseList(data.exp);
  const eduList   = parseList(data.edu);
  const certList  = parseList(data.cert);


  const bar = (pct: number) => (
    <div style={{height:'4px',background:'#1a1a1a',borderRadius:'2px',overflow:'hidden',marginTop:'4px'}}>
      <div style={{height:'100%',width:`${pct}%`,background:G,borderRadius:'2px',boxShadow:`0 0 8px ${G}`}}/>
    </div>
  );

  return (
    <div style={{display:'grid',gridTemplateColumns:'280px 8px 1fr',background:'#0a0a0a',borderRadius:'16px',overflow:'hidden',minHeight:'700px',fontFamily:"'Space Grotesk',sans-serif"}}>
      {/* ── Left Panel ── */}
      <div style={{background:'#111',padding:'2rem 1.5rem',display:'flex',flexDirection:'column',gap:'1.25rem',justifyContent:'space-between'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
        {data.p
          ? <img src={data.p} alt={data.n} style={{width:'100%',aspectRatio:'1',objectFit:'cover',borderRadius:'12px',filter:'grayscale(100%) contrast(1.1)',border:`2px solid ${G}`,boxShadow:`0 0 20px ${G}33`}}/>
          : <div style={{width:'100%',aspectRatio:'1',background:'#1a1a1a',borderRadius:'12px',border:`2px solid ${G}`,display:'flex',alignItems:'center',justifyContent:'center',color:'#444'}}>No Photo</div>
        }
        <div>
          <div style={{fontSize:'1.8rem',fontWeight:900,color:'#fff',lineHeight:1,letterSpacing:'-1px'}}>
            {(data.n||'Your Name').split(' ').map((w,i)=>(
              <div key={i}><span style={{color:G}}>{w[0]}</span>{w.slice(1)}</div>
            ))}
          </div>
          <div style={{color:G,fontSize:'0.8rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',marginTop:'0.5rem'}}>{data.r||'Role'}</div>
          {data.avail==='1' && <div style={{marginTop:'0.5rem',display:'inline-block',background:`${G}22`,border:`1px solid ${G}`,color:G,padding:'0.2rem 0.75rem',borderRadius:'100px',fontSize:'0.7rem',fontWeight:700}}>⚡ OPEN TO WORK</div>}
        </div>

        {/* Contact */}
        <div>
          <div style={{color:G,fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.1em',marginBottom:'0.75rem',borderBottom:`1px solid ${G}33`,paddingBottom:'0.5rem'}}>CONTACT</div>
          {data.e && <div style={{fontSize:'0.8rem',color:'#aaa',marginBottom:'0.4rem',wordBreak:'break-all'}}>✉ {data.e}</div>}
          {data.tw && <div style={{fontSize:'0.8rem',color:'#aaa',marginBottom:'0.4rem'}}>𝕏 @{data.tw}</div>}
          {data.gh && <div style={{fontSize:'0.8rem',color:'#aaa',marginBottom:'0.4rem'}}>⌥ github.com/{data.gh}</div>}
          {data.web && <div style={{fontSize:'0.8rem',color:'#aaa',wordBreak:'break-all'}}>◈ {data.web}</div>}
        </div>

        {/* Certifications */}
        {certList.length>0 && (
          <div>
            <div style={{color:G,fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.1em',marginBottom:'0.5rem',borderBottom:`1px solid ${G}33`,paddingBottom:'0.4rem'}}>CERTIFICATIONS</div>
            {certList.map((c,i)=><div key={i} style={{fontSize:'0.75rem',color:'#aaa',marginBottom:'0.3rem'}}>🏅 {c}</div>)}
          </div>
        )}

        {/* Languages */}
        {langList.length>0 && (
          <div>
            <div style={{color:G,fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.1em',marginBottom:'0.5rem',borderBottom:`1px solid ${G}33`,paddingBottom:'0.4rem'}}>LANGUAGES</div>
            {langList.map((l,i)=>(
              <div key={i} style={{marginBottom:'0.5rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.78rem',color:'#ccc',marginBottom:'0.2rem'}}><span>{l}</span></div>
                {bar(i===0?92:i===1?84:70)}
              </div>
            ))}
          </div>
        )}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
        {reputationScore !== '0' && (
          <div style={{background:`${G}11`,border:`1px solid ${G}44`,borderRadius:'8px',padding:'0.75rem',textAlign:'center'}}>
            <div style={{fontSize:'2rem',fontWeight:900,color:G,textShadow:`0 0 20px ${G}`}}>{reputationScore}</div>
            <div style={{fontSize:'0.65rem',color:'#555',textTransform:'uppercase',letterSpacing:'0.05em'}}>Web3 Score</div>
          </div>
        )}

        </div>
      </div>

      {/* ── Neon Divider ── */}
      <div style={{background:`linear-gradient(to bottom, transparent, ${G}, ${G}88, transparent)`,width:'2px',margin:'2rem 0',boxShadow:`0 0 12px ${G}`}}/>

      {/* ── Right Panel ── */}
      <div style={{padding:'2rem',overflowY:'auto'}}>

        {data.b && <p style={{color:'#777',fontSize:'0.9rem',lineHeight:1.7,marginBottom:'2rem',borderLeft:`3px solid ${G}`,paddingLeft:'1rem'}}>{data.b}</p>}

        {/* Experience */}
        {expList.length>0 && (
          <div style={{marginBottom:'2rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1rem'}}>
              <span style={{color:G,fontSize:'1.1rem'}}>◈</span>
              <span style={{fontSize:'0.75rem',fontWeight:700,letterSpacing:'0.15em',color:G,textTransform:'uppercase'}}>EXP<span style={{color:'#fff'}}>E</span>R<span style={{color:'#fff'}}>I</span>E<span style={{color:'#fff'}}>N</span>CE</span>
            </div>
            {expList.map((e,i)=>{
              const [date,...rest]=e.split(':');
              return (
                <div key={i} style={{marginBottom:'1rem',paddingLeft:'1rem',borderLeft:`1px solid ${G}44`}}>
                  <div style={{color:G,fontSize:'0.75rem',fontWeight:600,marginBottom:'0.2rem'}}>{date}</div>
                  <div style={{color:'#e0e0e0',fontWeight:600}}>{rest.join(':').trim()}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Education */}
        {eduList.length>0 && (
          <div style={{marginBottom:'2rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1rem'}}>
              <span style={{color:G,fontSize:'1.1rem'}}>◉</span>
              <span style={{fontSize:'0.75rem',fontWeight:700,letterSpacing:'0.15em',color:G,textTransform:'uppercase'}}>EDU<span style={{color:'#fff'}}>C</span>ATION<span style={{color:'#fff'}}>S</span></span>
            </div>
            {eduList.map((e,i)=>{
              const [date,...rest]=e.split(':');
              return (
                <div key={i} style={{marginBottom:'0.75rem',paddingLeft:'1rem',borderLeft:`1px solid ${G}44`}}>
                  <div style={{color:'#777',fontSize:'0.72rem'}}>{date}</div>
                  <div style={{color:'#e0e0e0',fontWeight:600}}>{rest.join(':').trim()}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Skills — Circular rings */}
        {skillList.length>0 && (
          <div style={{marginBottom:'2rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1rem'}}>
              <span style={{color:G}}>◎</span>
              <span style={{fontSize:'0.75rem',fontWeight:700,letterSpacing:'0.15em',color:G,textTransform:'uppercase'}}>SK<span style={{color:'#fff'}}>I</span>LL<span style={{color:'#fff'}}>S</span></span>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'1.25rem'}}>
              {skillList.map((s,i)=>(
                <div key={i} style={{textAlign:'center',width:'72px'}}>
                  <div style={{width:'52px',height:'52px',borderRadius:'50%',border:`3px solid ${G}`,boxShadow:`0 0 12px ${G}55`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto',background:'#111'}}>
                    <span style={{fontSize:'0.65rem',color:G,fontWeight:700}}>{s.slice(0,2).toUpperCase()}</span>
                  </div>
                  <div style={{fontSize:'0.65rem',color:'#888',marginTop:'0.35rem',lineHeight:1.2}}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Language bars */}
        {langList.length>0 && (
          <div style={{marginBottom:'2rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1rem'}}>
              <span style={{color:G}}>◑</span>
              <span style={{fontSize:'0.75rem',fontWeight:700,letterSpacing:'0.15em',color:G,textTransform:'uppercase'}}>LAN<span style={{color:'#fff'}}>G</span>UAGE</span>
            </div>
            {langList.map((l,i)=>(
              <div key={i} style={{marginBottom:'0.6rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.8rem',color:'#ccc',marginBottom:'0.25rem'}}>
                  <span>{l}</span>
                </div>
                {bar(i===0?95:i===1?85:70)}
              </div>
            ))}
          </div>
        )}

        {/* GitHub repos */}
        {ghData && !ghData.error && ghData.topRepos?.length>0 && (
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1rem'}}>
              <span style={{color:G}}>⌥</span>
              <span style={{fontSize:'0.75rem',fontWeight:700,letterSpacing:'0.15em',color:G,textTransform:'uppercase'}}>GITHUB REPOS</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.6rem'}}>
              {ghData.topRepos.slice(0,4).map((r:any,i:number)=>(
                <a key={i} href={r.url} target="_blank" rel="noreferrer" style={{textDecoration:'none',background:'#1a1a1a',border:`1px solid ${G}33`,borderRadius:'8px',padding:'0.6rem',display:'block'}}>
                  <div style={{color:G,fontSize:'0.8rem',fontWeight:700,marginBottom:'0.2rem'}}>{r.name}</div>
                  <div style={{fontSize:'0.68rem',color:'#555'}}>⭐{r.stars} 🍴{r.forks} {r.language&&`• ${r.language}`}</div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 2 — MINIMAL (clean white, hollow circles, BW photo)
══════════════════════════════════════════════════════════════ */
function MinimalTemplate({data, ghData, parseList, projects, wallet, reputationScore}: TmplProps) {
  const expList = parseList(data.exp);
  const eduList = parseList(data.edu);
  const sklList = parseList(data.skl);
  const certList = parseList(data.cert);
  const langList = parseList(data.lang);

  const timelineItem = (date: string, title: string, idx: number) => (
    <div key={idx} style={{display:'grid',gridTemplateColumns:'90px 20px 1fr',gap:'0',marginBottom:'0.75rem',alignItems:'start'}}>
      <div style={{fontSize:'0.72rem',color:'#888',paddingTop:'2px',textAlign:'right',paddingRight:'12px'}}>{date}</div>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div style={{width:'12px',height:'12px',borderRadius:'50%',border:'2px solid #222',background:'#fff',flexShrink:0}}/>
        <div style={{width:'1px',background:'#e0e0e0',flex:1,marginTop:'4px'}}/>
      </div>
      <div style={{paddingLeft:'10px'}}>
        <div style={{fontSize:'0.85rem',fontWeight:700,color:'#111',lineHeight:1.3}}>{title}</div>
      </div>
    </div>
  );

  return (
    <div style={{display:'grid',gridTemplateColumns:'220px 1fr',background:'#fff',borderRadius:'16px',overflow:'hidden',minHeight:'700px',fontFamily:"'Inter',sans-serif",color:'#111'}}>
      {/* ── Left ── */}
      <div style={{background:'#fff',borderRight:'1px solid #eee',padding:'2rem 1.25rem',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:'1.6rem',fontWeight:900,color:'#111',lineHeight:1.1,letterSpacing:'-1px',marginBottom:'0.5rem'}}>{data.n||'YOUR NAME'}</div>
          <div style={{width:'30px',height:'3px',background:'#111',marginBottom:'0.75rem'}}/>
          <div style={{fontSize:'0.75rem',color:'#888',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'1rem'}}>{data.r||'Role'}</div>

          {data.p
            ? <img src={data.p} alt={data.n} style={{width:'100%',aspectRatio:'3/4',objectFit:'cover',objectPosition:'top',marginBottom:'1rem',filter:'grayscale(100%)'}}/>
            : <div style={{width:'100%',aspectRatio:'3/4',background:'#f0f0f0',marginBottom:'1rem',display:'flex',alignItems:'center',justifyContent:'center',color:'#ccc',fontSize:'0.8rem'}}>No Photo</div>
          }

          {data.b && (
            <div style={{marginBottom:'1rem'}}>
              <div style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'#111',marginBottom:'0.4rem'}}>About Me</div>
              <p style={{fontSize:'0.72rem',color:'#555',lineHeight:1.7}}>{data.b}</p>
            </div>
          )}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          <div>
            <div style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'#111',marginBottom:'0.4rem'}}>Contact</div>
            {data.e && <div style={{fontSize:'0.68rem',color:'#555',marginBottom:'0.25rem'}}>✉ {data.e}</div>}
            {data.tw && <div style={{fontSize:'0.68rem',color:'#555',marginBottom:'0.25rem'}}>𝕏 @{data.tw}</div>}
            {data.gh && <div style={{fontSize:'0.68rem',color:'#555',marginBottom:'0.25rem'}}>⌥ @{data.gh}</div>}
            {data.web && <div style={{fontSize:'0.68rem',color:'#555',wordBreak:'break-all'}}>{data.web}</div>}
          </div>

          {certList.length>0 && (
            <div>
              <div style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'#111',marginBottom:'0.4rem'}}>Certifications</div>
              {certList.map((c,i)=><div key={i} style={{fontSize:'0.68rem',color:'#555',marginBottom:'0.2rem'}}>🏅 {c}</div>)}
            </div>
          )}

          {langList.length>0 && (
            <div>
              <div style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'#111',marginBottom:'0.4rem'}}>Languages</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.3rem'}}>
                {langList.map((l,i)=><span key={i} style={{fontSize:'0.65rem',background:'#f0f0f0',color:'#555',padding:'0.15rem 0.5rem',borderRadius:'100px'}}>{l}</span>)}
              </div>
            </div>
          )}

          {reputationScore!=='0' && (
            <div style={{background:'#f8f8f8',border:'1px solid #e0e0e0',borderRadius:'8px',padding:'0.6rem',textAlign:'center'}}>
              <div style={{fontSize:'1.5rem',fontWeight:900,color:'#111'}}>{reputationScore}</div>
              <div style={{fontSize:'0.55rem',color:'#aaa',textTransform:'uppercase',letterSpacing:'0.08em'}}>Web3 Score</div>
            </div>
          )}

          {data.avail==='1' && <div style={{background:'#111',color:'#fff',padding:'0.4rem 0.75rem',borderRadius:'4px',fontSize:'0.68rem',fontWeight:700,textAlign:'center'}}>OPEN TO WORK</div>}
        </div>
      </div>

      {/* ── Right ── */}
      <div style={{padding:'1.5rem 1.5rem 1.5rem 1.25rem',overflowY:'auto'}}>
        {/* Education */}
        {eduList.length>0 && (
          <div style={{marginBottom:'1rem',paddingBottom:'1rem',borderBottom:'1px solid #eee'}}>
            <div style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.15em',color:'#111',marginBottom:'0.75rem'}}>Education</div>
            {eduList.map((e,i)=>{const[d,...r]=e.split(':');return timelineItem(d,r.join(':').trim(),i);})}
          </div>
        )}

        {/* Experience */}
        {expList.length>0 && (
          <div style={{marginBottom:'1rem',paddingBottom:'1rem',borderBottom:'1px solid #eee'}}>
            <div style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.15em',color:'#111',marginBottom:'0.75rem'}}>Experience</div>
            {expList.map((e,i)=>{const[d,...r]=e.split(':');return timelineItem(d,r.join(':').trim(),i);})}
          </div>
        )}

        {/* Skills */}
        {sklList.length>0 && (
          <div style={{marginBottom:'1rem',paddingBottom:'1rem',borderBottom:'1px solid #eee'}}>
            <div style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.15em',color:'#111',marginBottom:'0.75rem'}}>Skills</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem'}}>
              {sklList.map((s,i)=>(
                <div key={i} style={{textAlign:'center',width:'56px'}}>
                  <div style={{width:'40px',height:'40px',borderRadius:'50%',border:'2px solid #222',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto',background:'#f8f8f8'}}>
                    <span style={{fontSize:'0.65rem',fontWeight:800,color:'#111'}}>{s.slice(0,2).toUpperCase()}</span>
                  </div>
                  <div style={{fontSize:'0.6rem',color:'#777',marginTop:'0.25rem'}}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top repos */}
        {ghData?.topRepos?.length>0 && (
          <div>
            <div style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.15em',color:'#111',marginBottom:'0.75rem'}}>GitHub Projects</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}>
              {ghData.topRepos.slice(0,4).map((r:any,i:number)=>(
                <a key={i} href={r.url} target="_blank" rel="noreferrer" style={{textDecoration:'none',border:'1px solid #e0e0e0',borderRadius:'6px',padding:'0.6rem',display:'block'}}>
                  <div style={{fontWeight:700,color:'#111',fontSize:'0.75rem',marginBottom:'0.15rem'}}>{r.name}</div>
                  {r.description && <div style={{fontSize:'0.65rem',color:'#888',marginBottom:'0.25rem',lineHeight:1.4}}>{r.description.slice(0,60)}...</div>}
                  <div style={{fontSize:'0.62rem',color:'#aaa'}}>⭐{r.stars} 🍴{r.forks}</div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 3 — MODERN (red accent, "Hello I'm", star skills)
══════════════════════════════════════════════════════════════ */
function ModernTemplate({data, ghData, parseList, projects, reputationScore, wallet}: TmplProps) {
  const RED = '#e63329';
  const expList = parseList(data.exp);
  const eduList = parseList(data.edu);
  const sklList = parseList(data.skl);
  const langList = parseList(data.lang);
  const certList = parseList(data.cert);

  const stars = (n: number) => (
    <span>{'★'.repeat(n)}<span style={{color:'#ddd'}}>{'★'.repeat(5-n)}</span></span>
  );

  const SectionHead = ({label}: {label:string}) => (
    <div style={{fontSize:'1rem',fontWeight:900,color:'#111',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.6rem'}}>
      <span style={{display:'inline-block',width:'18px',height:'3px',background:RED,borderRadius:'2px',flexShrink:0}}/>
      {label}
    </div>
  );

  return (
    <div style={{background:'#f5f5f5',borderRadius:'16px',overflow:'hidden',fontFamily:"'Inter',sans-serif",color:'#111'}}>

      {/* ── Hero Header ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 300px',background:'#fff',position:'relative',overflow:'hidden',minHeight:'220px'}}>
        {/* Soft diagonal stripes top-left */}
        <div style={{position:'absolute',top:0,left:0,width:'100px',height:'100%',background:`repeating-linear-gradient(45deg,transparent,transparent 6px,${RED}18 6px,${RED}18 8px)`,pointerEvents:'none'}}/>
        {/* Red left accent bar */}
        <div style={{position:'absolute',top:0,left:0,width:'6px',height:'100%',background:RED}}/>

        <div style={{padding:'2rem 2rem 2rem 3.5rem',zIndex:1}}>
          <div style={{fontSize:'0.85rem',color:'#888',fontWeight:400,marginBottom:'0.2rem',fontStyle:'italic'}}>Hello... I'm</div>
          <div style={{fontSize:'2.6rem',fontWeight:900,color:'#111',lineHeight:1,letterSpacing:'-1.5px',marginBottom:'0.3rem'}}>{data.n||'Your Name'}</div>
          <div style={{fontSize:'0.8rem',color:RED,fontWeight:700,marginBottom:'1rem',textTransform:'uppercase',letterSpacing:'0.12em'}}>{data.r||'Role'}</div>
          {data.b && <p style={{fontSize:'0.82rem',color:'#555',lineHeight:1.7,maxWidth:'440px',marginBottom:'1rem'}}>{data.b}</p>}
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',marginBottom:'0.75rem'}}>
            {data.e&&<span style={{display:'inline-flex',alignItems:'center',gap:'0.3rem',background:'#f0f0f0',padding:'0.25rem 0.7rem',borderRadius:'100px',fontSize:'0.73rem',color:'#555'}}>📧 {data.e}</span>}
            {data.tw&&<span style={{display:'inline-flex',alignItems:'center',gap:'0.3rem',background:'#f0f0f0',padding:'0.25rem 0.7rem',borderRadius:'100px',fontSize:'0.73rem',color:'#555'}}>𝕏 @{data.tw}</span>}
            {data.web&&<span style={{display:'inline-flex',alignItems:'center',gap:'0.3rem',background:'#f0f0f0',padding:'0.25rem 0.7rem',borderRadius:'100px',fontSize:'0.73rem',color:'#555'}}>🌐 {data.web.replace(/https?:\/\//,'').split('/')[0]}</span>}
          </div>
          {data.avail==='1'&&<div style={{display:'inline-block',background:RED,color:'#fff',padding:'0.35rem 1rem',borderRadius:'4px',fontSize:'0.75rem',fontWeight:700,letterSpacing:'0.05em'}}>⚡ AVAILABLE FOR WORK</div>}
        </div>

        {/* Photo col */}
        <div style={{position:'relative',overflow:'hidden'}}>
          {/* dot grid decoration */}
          <div style={{position:'absolute',top:8,left:-12,width:'80px',height:'80px',background:`radial-gradient(circle, ${RED}99 1px, transparent 1px)`,backgroundSize:'10px 10px',zIndex:0}}/>
          <div style={{position:'absolute',top:0,right:0,width:'36px',height:'36px',background:RED,zIndex:1}}/>
          {data.p
            ? <img src={data.p} alt={data.n} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top',display:'block',position:'relative',zIndex:0}}/>
            : <div style={{width:'100%',height:'220px',background:'#ddd',display:'flex',alignItems:'center',justifyContent:'center',color:'#aaa'}}>No Photo</div>
          }
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{padding:'2rem'}}>

        {/* Work Experience – cards */}
        {expList.length>0 && (
          <div style={{marginBottom:'2rem',paddingBottom:'2rem',borderBottom:'2px solid #e8e8e8'}}>
            <SectionHead label="Work Experience"/>
            <div style={{display:'grid',gridTemplateColumns:`repeat(${Math.min(expList.length,3)},1fr)`,gap:'1rem'}}>
              {expList.map((e,i)=>{
                const[date,...rest]=e.split(':');
                const parts = rest.join(':').trim().split('—');
                const company = parts[0]?.trim();
                const role2   = parts[1]?.trim();
                return (
                  <div key={i} style={{background:'#fff',borderRadius:'10px',borderTop:`4px solid ${RED}`,padding:'1rem',boxShadow:'0 2px 12px #0001'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'0.4rem',marginBottom:'0.35rem'}}>
                      <span style={{width:'8px',height:'8px',borderRadius:'50%',background:RED,flexShrink:0,display:'inline-block'}}/>
                      <span style={{fontSize:'0.65rem',color:RED,fontWeight:700}}>{date}</span>
                    </div>
                    <div style={{fontSize:'0.88rem',fontWeight:800,color:'#111',marginBottom:'0.15rem',textTransform:'uppercase',letterSpacing:'0.03em'}}>{company}</div>
                    {role2 && <div style={{fontSize:'0.75rem',color:'#888',fontWeight:600}}>{role2}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Middle 3-col: Education | Skills | Certs+Langs */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'2rem',marginBottom:'2rem',paddingBottom:'2rem',borderBottom:'2px solid #e8e8e8'}}>

          {/* Education */}
          <div>
            <SectionHead label="Education"/>
            {eduList.map((e,i)=>{
              const[date,...rest]=e.split(':');
              return (
                <div key={i} style={{marginBottom:'1rem',paddingLeft:'1rem',borderLeft:`3px solid ${RED}`,position:'relative'}}>
                  <div style={{position:'absolute',left:'-6px',top:'3px',width:'9px',height:'9px',borderRadius:'50%',background:RED}}/>
                  <div style={{fontSize:'0.65rem',color:RED,fontWeight:700,marginBottom:'0.15rem'}}>{date}</div>
                  <div style={{fontSize:'0.82rem',fontWeight:800,color:'#111'}}>{rest.join(':').trim()}</div>
                </div>
              );
            })}
          </div>

          {/* Skills */}
          <div>
            <SectionHead label="Skills"/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem 1rem'}}>
              {sklList.map((s,i)=>(
                <div key={i} style={{marginBottom:'0.35rem'}}>
                  <div style={{fontSize:'0.78rem',color:'#333',fontWeight:600,marginBottom:'0.1rem'}}>{s}</div>
                  <div style={{color:RED,fontSize:'0.85rem',letterSpacing:'1px'}}>{stars(5-i%2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Certs + Languages */}
          <div>
            {certList.length>0 && (
              <>
                <SectionHead label="Certifications"/>
                {certList.map((c,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.5rem'}}>
                    <span style={{width:'8px',height:'8px',borderRadius:'50%',background:RED,flexShrink:0,display:'inline-block'}}/>
                    <span style={{fontSize:'0.78rem',color:'#555'}}>{c}</span>
                  </div>
                ))}
                {langList.length>0 && <div style={{marginTop:'1rem'}}/>}
              </>
            )}
            {langList.length>0 && (
              <>
                <SectionHead label="Languages"/>
                {langList.map((l,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.4rem'}}>
                    <div style={{width:'28px',height:'28px',borderRadius:'50%',border:`2px solid ${RED}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.55rem',color:RED,fontWeight:700,flexShrink:0}}>{l.slice(0,2).toUpperCase()}</div>
                    <span style={{fontSize:'0.78rem',color:'#555'}}>{l}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Bottom: Portfolio + GitHub + Score */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'2rem'}}>

          {/* Portfolio / Projects */}
          <div>
            {projects.length>0 ? (
              <>
                <SectionHead label="Portfolio"/>
                {projects.map((p,i)=>(
                  <div key={i} style={{marginBottom:'0.75rem'}}>
                    <div style={{fontSize:'0.82rem',fontWeight:800,color:'#111'}}>{p.name}</div>
                    {p.desc && <div style={{fontSize:'0.72rem',color:'#888',lineHeight:1.4,marginBottom:'0.2rem'}}>{p.desc}</div>}
                    {p.url && <a href={p.url} target="_blank" rel="noreferrer" style={{fontSize:'0.68rem',color:RED,textDecoration:'none',fontWeight:700}}>↗ {p.url.replace(/https?:\/\//,'').slice(0,30)}</a>}
                  </div>
                ))}
              </>
            ) : (
              ghData?.topRepos?.slice(0,3).map((r:any,i:number)=>(
                <div key={i} style={{marginBottom:'0.75rem'}}>
                  <a href={r.url} target="_blank" rel="noreferrer" style={{fontSize:'0.82rem',fontWeight:800,color:RED,textDecoration:'none'}}>↗ {r.name}</a>
                  {r.description && <div style={{fontSize:'0.72rem',color:'#888',lineHeight:1.4}}>{r.description.slice(0,60)}</div>}
                </div>
              ))
            )}
          </div>

          {/* GitHub stats */}
          {ghData && !ghData.error && (
            <div>
              <SectionHead label="GitHub"/>
              <div style={{background:'#fff',borderRadius:'10px',padding:'1rem',boxShadow:'0 2px 12px #0001'}}>
                {ghData.user?.avatarUrl && <img src={ghData.user.avatarUrl} alt="gh" style={{width:'40px',height:'40px',borderRadius:'50%',marginBottom:'0.5rem',border:`2px solid ${RED}`}} />}
                <div style={{fontSize:'0.8rem',fontWeight:700,color:'#111',marginBottom:'0.5rem'}}>@{ghData.user?.login}</div>
                <div style={{fontSize:'0.75rem',color:'#666',marginBottom:'0.25rem'}}>⭐ {ghData.stats?.totalStars||0} Stars</div>
                <div style={{fontSize:'0.75rem',color:'#666'}}>📁 {ghData.user?.publicRepos||0} Repos</div>
              </div>
            </div>
          )}

          {/* Web3 Score */}
          {reputationScore!=='0' && (
            <div>
              <SectionHead label="Web3 Score"/>
              <div style={{background:'#fff',borderRadius:'10px',padding:'1.25rem',boxShadow:'0 2px 12px #0001',textAlign:'center',borderTop:`4px solid ${RED}`}}>
                <div style={{fontSize:'3rem',fontWeight:900,color:RED,lineHeight:1}}>{reputationScore}</div>
                <div style={{fontSize:'0.65rem',color:'#aaa',marginTop:'0.3rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>Web3 Score</div>
              </div>
            </div>
          )}
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
      if(decoded.gh) fetch(`/api/github?username=${decoded.gh}`).then(r=>r.json()).then(setGhData).catch(console.error);
      if(decoded.sol) fetch(`/api/solana?wallet=${decoded.sol}`).then(r=>r.json()).then(setSolData).catch(console.error);
      if(decoded.evm?.startsWith('0x')&&decoded.evm.length>=40){
        const chains=[
          {rpc:'https://ethereum.publicnode.com'},{rpc:'https://polygon-rpc.com'},
          {rpc:'https://bsc-dataseed.binance.org'},{rpc:'https://arb1.arbitrum.io/rpc'},
          {rpc:'https://mainnet.base.org'},{rpc:'https://mainnet.optimism.io'},
          {rpc:'https://rpc.linea.build'},{rpc:'https://mainnet.era.zksync.io'},
          {rpc:'https://api.avax.network/ext/bc/C/rpc'},
        ];
        const body=JSON.stringify({jsonrpc:'2.0',method:'eth_getTransactionCount',params:[decoded.evm,'latest'],id:1});
        Promise.allSettled(chains.map(c=>fetch(c.rpc,{method:'POST',headers:{'Content-Type':'application/json'},body})
          .then(r=>r.json()).then(d=>parseInt(d.result||'0x0',16)).catch(()=>0)))
          .then(rs=>{const t=rs.reduce((s,r)=>s+(r.status==='fulfilled'?r.value:0),0);setEvmData({address:decoded.evm,txCount:t});});
      }
    }catch(e){console.error(e);}
  },[]);

  if(!data) return <div style={{textAlign:'center',marginTop:'5rem',color:'var(--text-muted)'}}>Loading YoChain Profile...</div>;

  const isDark   = cvTheme === 'dark';
  const c        = (dark:string,light:string) => isDark?dark:light;
  const projects = parseProjects(data.proj);
  const reputationScore = (
    (solData?.totalTransactions||0)*0.05 +
    (evmData?.txCount||0)*0.05 +
    (ghData?.stats?.totalStars||0)*2 +
    (ghData?.user?.publicRepos||0)*1 +
    (data.tw?50:0)
  ).toFixed(0);

  const tmpl = data.tmpl || 'default';
  const tmplProps: TmplProps = {data,ghData,solData,evmData,projects,parseList,reputationScore,wallet,isDark,c};
  const isSpecialTemplate = ['cyber','minimal','modern'].includes(tmpl);

  return (
    <>
      <Nav />
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
          background: tmpl==='minimal'||tmpl==='modern' ? 'linear-gradient(to right,#c8c8c8,transparent)' : 'linear-gradient(to right,#080808,transparent)',
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
          background: tmpl==='minimal'||tmpl==='modern' ? 'linear-gradient(to left,#c8c8c8,transparent)' : 'linear-gradient(to left,#080808,transparent)',
        }}>
          {tmpl==='cyber' && <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>{[...Array(8)].map((_,i)=><div key={i} style={{width:`${60-i*5}px`,height:'2px',background:`rgba(0,255,65,${(8-i)/8*0.8})`}}/>)}</div>}
          {tmpl==='modern' && <div><div style={{width:'4px',height:'100px',background:'linear-gradient(to bottom,#e63329,transparent)',borderRadius:'2px',marginBottom:'0.75rem'}}/><div style={{fontSize:'0.58rem',color:'rgba(230,51,41,0.35)',textTransform:'uppercase',letterSpacing:'0.15em',writingMode:'vertical-rl'}}>YoChain CV</div></div>}
          {tmpl==='minimal' && <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>{[...Array(5)].map((_,i)=><div key={i} style={{width:`${40-i*4}px`,height:'2px',background:'rgba(0,0,0,0.15)'}}/>)}</div>}
          {tmpl==='default' && <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>{[...Array(6)].map((_,i)=><div key={i} style={{width:`${50-i*4}px`,height:'2px',background:`rgba(244,106,42,${(6-i)/6*0.5})`}}/>)}</div>}
        </div>

        {/* CV content */}
        <div style={{maxWidth:'960px',margin:'0 auto',padding:'0 1.5rem',position:'relative',zIndex:1}}>
          <div id="cv-content">
            {tmpl==='cyber'   && <CyberTemplate {...tmplProps}/>}
            {tmpl==='minimal' && <MinimalTemplate {...tmplProps}/>}
            {tmpl==='modern'  && <ModernTemplate {...tmplProps}/>}
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
        <div style={{color:'var(--text-muted)',fontSize:'0.85rem',textAlign:'right'}}>Wallet Verified<br/><span style={{color:'var(--text-main)',fontFamily:'monospace'}}>{wallet?`${wallet.slice(0,8)}...${wallet.slice(-6)}`:''}</span></div>
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
                <div style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>Solana TXs + EVM TXs + GitHub + Socials</div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              {solData&&<div className="stat-box" style={{borderColor:'#9945FF'}}><span style={{fontSize:'0.75rem',color:'#9945FF',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em'}}>Solana</span><div className="stat-box-val" style={{color:'#9945FF',marginTop:'0.5rem'}}>{solData.totalTransactions>1000?`${(solData.totalTransactions/1000).toFixed(1)}k`:solData.totalTransactions}</div><div className="stat-box-lbl">Total Transactions</div></div>}
              {evmData&&<div className="stat-box" style={{borderColor:'#627EEA'}}><span style={{fontSize:'0.75rem',color:'#627EEA',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em'}}>EVM Multichain</span><div className="stat-box-val" style={{color:'#627EEA',marginTop:'0.5rem'}}>{evmData.txCount>1000?`${(evmData.txCount/1000).toFixed(1)}k`:evmData.txCount}</div><div className="stat-box-lbl">TXs (ETH+BSC+ARB+Base+OP+More)</div></div>}
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
