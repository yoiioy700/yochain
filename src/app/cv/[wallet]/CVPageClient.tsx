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
    <div id="cv-content" style={{position:'relative', background:'#0a0a0a', minHeight:'100vh', color:'#e0e0e0', overflowX:'hidden'}}>
      <style dangerouslySetInnerHTML={{__html:`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        .cv-root { font-family: 'Space Grotesk', system-ui, sans-serif; }

        .neo-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #555;
        }

        .neo-link {
          color: #aaa;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          transition: color 0.15s;
          padding-bottom: 2px;
          border-bottom: 1px solid #333;
        }
        .neo-link:hover { color: #fff; border-color: #fff; }

        /* Entrance */
        .rev { animation: su 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(32px); }
        .d1{animation-delay:0.05s} .d2{animation-delay:0.15s} .d3{animation-delay:0.25s} .d4{animation-delay:0.35s} .d5{animation-delay:0.45s}
        @keyframes su { to { opacity:1; transform:translateY(0); } }

        @media (max-width: 768px) {
          .cv-hero-grid { grid-template-columns: 1fr !important; }
          .cv-stat-bar { flex-wrap: wrap !important; }
          .cv-content-grid { grid-template-columns: 1fr !important; }
        }
      `}}/>

      {/* ── FULL-BLEED HEADER ── */}
      <div className="cv-root">

        {/* Decorative stripe at top */}
        <div style={{height:'3px', background:'linear-gradient(90deg, #9945FF 0%, #14F195 50%, transparent 100%)'}}/>

        {/* HERO SECTION — full width with photo sidebar */}
        <div className="cv-hero-grid rev d1" style={{display:'grid', gridTemplateColumns:'1fr 320px', minHeight:'70vh', borderBottom:'1px solid #1a1a1a'}}>

          {/* Left: Name + meta */}
          <div style={{padding:'clamp(2rem,5vw,5rem)', display:'flex', flexDirection:'column', justifyContent:'center', borderRight:'1px solid #1a1a1a'}}>
            {/* Top row micro-data */}
            <div style={{display:'flex', gap:'2rem', flexWrap:'wrap', marginBottom:'4rem'}}>
              <div>
                <div className="neo-label" style={{marginBottom:'0.4rem'}}>ONCHAIN ID</div>
                <div style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.9rem', color: solData?.domainName ? '#14F195' : '#444'}}>
                  {solData?.domainName || 'unregistered.sol'}
                </div>
              </div>
              <div>
                <div className="neo-label" style={{marginBottom:'0.4rem'}}>CURRENT FOCUS</div>
                <div style={{display:'flex', gap:'0.4rem', flexWrap:'wrap', fontFamily:"'JetBrains Mono', monospace", fontSize:'0.7rem'}}>
                  {data.foc ? data.foc.split(',').filter(Boolean).map((f, i) => (
                    <span key={i} style={{color: '#fff', border: '1px solid var(--accent-orange)', padding: '0.2rem 0.5rem', background: '#0a0a0a'}}>{f}</span>
                  )) : (
                    <span style={{fontSize:'0.9rem', color: data.avail==='1' ? '#14F195' : '#555'}}>
                      {data.avail==='1' ? 'Available for Work' : 'Not Available'}
                    </span>
                  )}
                </div>
              </div>
              {verifiedBadges.length > 0 && (
                <div>
                  <div className="neo-label" style={{marginBottom:'0.4rem'}}>CREDENTIALS</div>
                  <div style={{display:'flex', gap:'0.4rem', flexWrap:'wrap'}}>
                    {verifiedBadges.map((b,i) => (
                      <span key={i} style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.6rem', color:'#888', background:'#111', border:'1px solid #222', padding:'0.2rem 0.5rem'}}>{b}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Giant name */}
            <div>
              <h1 style={{fontSize:'clamp(3.5rem, 8vw, 7.5rem)', fontWeight:700, lineHeight:0.88, letterSpacing:'-0.04em', color:'#fff', textTransform:'uppercase', margin:'0 0 2rem 0', wordBreak:'break-word'}}>
                {data.n || 'NATIVE BUILDER'}
              </h1>
              <div style={{fontSize:'clamp(1.1rem, 2vw, 1.5rem)', color:'#555', fontWeight:400, marginBottom:'2rem'}}>
                {data.r || 'Web3 Developer'}
              </div>

              {/* Social + ecosystems in one row */}
              <div style={{display:'flex', flexWrap:'wrap', gap:'1rem', alignItems:'center'}}>
                {data.tw && <a href={`https://twitter.com/${data.tw}`} target="_blank" rel="noreferrer" className="neo-link"><XIcon/> @{data.tw}</a>}
                {data.gh && <a href={`https://github.com/${data.gh}`} target="_blank" rel="noreferrer" className="neo-link"><GhIcon/> {data.gh}</a>}
                {data.web && <a href={data.web.startsWith('http')?data.web:`https://${data.web}`} target="_blank" rel="noreferrer" className="neo-link"><WebIcon/> WEBSITE</a>}
                {ecoList.map((eco, i) => (
                  <span key={i} style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.65rem', color:'#14F195', border:'1px solid rgba(20,241,149,0.25)', padding:'0.3rem 0.65rem', background:'rgba(20,241,149,0.04)'}}>{eco}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Photo + Score panel */}
          <div style={{display:'flex', flexDirection:'column'}}>
            {/* Photo fills top */}
            <div style={{flex:1, background:'#0d0d0d', overflow:'hidden', position:'relative', minHeight:'300px'}}>
              {data.p ? (
                <img src={data.p} alt={data.n} style={{width:'100%', height:'100%', objectFit:'cover', filter:'grayscale(80%) contrast(1.1)', opacity:0.9}}/>
              ) : (
                <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'5rem', color:'#222', fontWeight:700, fontFamily:"'JetBrains Mono', monospace"}}>
                  {data.n?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              {/* Photo overlay gradient */}
              <div style={{position:'absolute', bottom:0, left:0, right:0, height:'60%', background:'linear-gradient(transparent, #0a0a0a)'}}/>
            </div>

            {/* Score panel at bottom */}
            <div style={{padding:'2rem', borderTop:'1px solid #1a1a1a', background:'#0d0d0d'}}>
              <div className="neo-label" style={{marginBottom:'0.75rem'}}>ONCHAIN_SCORE</div>
              <div style={{fontSize:'4rem', fontWeight:800, fontFamily:"'JetBrains Mono', monospace", color:'#14F195', lineHeight:0.9, marginBottom:'1rem'}}>
                {reputationScore}
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:'0.35rem'}}>
                {ghData && <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.65rem', fontFamily:"'JetBrains Mono', monospace", color:'#555'}}><span>GitHub</span><span style={{color:'#888'}}>+{((ghData.stats?.totalStars||0)*2 + (ghData.user?.publicRepos||0)).toFixed(0)}</span></div>}
                {solData && <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.65rem', fontFamily:"'JetBrains Mono', monospace", color:'#555'}}><span>Transactions</span><span style={{color:'#888'}}>+{((solData.totalTransactions||0)*0.04).toFixed(0)}</span></div>}
                {data.tw && <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.65rem', fontFamily:"'JetBrains Mono', monospace", color:'#555'}}><span>Twitter</span><span style={{color:'#888'}}>+50</span></div>}
                {projects.length > 0 && <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.65rem', fontFamily:"'JetBrains Mono', monospace", color:'#555'}}><span>Projects</span><span style={{color:'#888'}}>+{projects.length * 20}</span></div>}
              </div>
            </div>
          </div>
        </div>

        {/* BIO BAND — full width */}
        {data.b && (
          <div className="rev d2" style={{padding:'clamp(2rem,4vw,4rem) clamp(2rem,5vw,5rem)', borderBottom:'1px solid #1a1a1a', display:'flex', gap:'4rem', alignItems:'center'}}>
            <div className="neo-label" style={{flexShrink:0, writingMode:'vertical-rl', transform:'rotate(180deg)', letterSpacing:'0.15em'}}>BIO</div>
            <p style={{fontSize:'clamp(1.1rem, 2vw, 1.5rem)', lineHeight:1.6, color:'#888', fontWeight:400, margin:0, maxWidth:'800px'}}>
              {data.b}
            </p>
          </div>
        )}

        {/* STATS BAR — horizontal full bleed */}
        <div className="rev d2 cv-stat-bar" style={{display:'flex', borderBottom:'1px solid #1a1a1a', overflow:'hidden'}}>
          {[
            { label: 'REPOS', val: ghData?.user?.publicRepos || '—' },
            { label: 'SOL_TXs', val: solData?.totalTransactions || '—' },
            { label: 'NFTs_OWNED', val: solData?.nftCount || '—' },
            { label: 'TOKENS', val: solData?.tokenCount || '—' },
            { label: 'SKILLS', val: sklList.length || '—' },
            { label: 'PROJECTS', val: projects.length || '—' },
          ].map((s, i, arr) => (
            <div key={i} style={{flex:1, padding:'2rem 1.5rem', borderRight: i < arr.length-1 ? '1px solid #1a1a1a' : 'none', textAlign:'center'}}>
              <div style={{fontSize:'clamp(1.5rem, 3vw, 2.5rem)', fontWeight:800, fontFamily:"'JetBrains Mono', monospace", color:'#fff', lineHeight:1, marginBottom:'0.5rem'}}>
                {s.val}
              </div>
              <div className="neo-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* MAIN CONTENT — 3-col asymmetric grid */}
        <div className="cv-content-grid rev d3" style={{display:'grid', gridTemplateColumns:'2fr 1px 1fr', minHeight:'400px'}}>

          {/* WIDE LEFT: Experience + Projects */}
          <div style={{padding:'clamp(2rem,4vw,4rem) clamp(2rem,5vw,5rem)', display:'flex', flexDirection:'column', gap:'4rem'}}>

            {expList.length > 0 && (
              <div>
                <div style={{display:'flex', alignItems:'center', gap:'1rem', marginBottom:'3rem'}}>
                  <div className="neo-label" style={{color:'#9945FF'}}>// EXPERIENCE</div>
                  <div style={{flex:1, height:'1px', background:'#1a1a1a'}}/>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:0}}>
                  {expList.map((e,i)=>{
                    const split = e.split(':');
                    const period = split[0]?.trim();
                    const role = split.slice(1).join(':').trim() || e;
                    return (
                      <div key={i} style={{display:'grid', gridTemplateColumns:'140px 1fr', gap:'2rem', padding:'2rem 0', borderBottom:'1px solid #111', alignItems:'start'}}>
                        <div style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.7rem', color:'#555', paddingTop:'0.3rem'}}>{period}</div>
                        <div>
                          <div style={{fontSize:'1.1rem', fontWeight:600, color:'#fff', letterSpacing:'-0.01em', marginBottom:'0.25rem'}}>{role}</div>
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
                  <div style={{flex:1, height:'1px', background:'#1a1a1a'}}/>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:0}}>
                  {projects.map((p,i)=>(
                    <div key={i} style={{padding:'2.5rem 0', borderBottom: i<projects.length-1 ? '1px solid #111' : 'none'}}>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem', gap:'1rem'}}>
                        <div style={{fontSize:'1.35rem', fontWeight:700, color:'#fff', letterSpacing:'-0.02em'}}>{p.name}</div>
                        {p.url && <a href={p.url} target="_blank" rel="noreferrer" className="neo-link" style={{flexShrink:0}}>VISIT ↗</a>}
                      </div>
                      <p style={{fontSize:'0.95rem', color:'#666', lineHeight:1.7, margin:'0 0 1.5rem 0'}}>{p.desc}</p>
                      {p.tech && (
                        <div style={{display:'flex', flexWrap:'wrap', gap:'0.4rem'}}>
                          {p.tech.split(',').map((t,j)=>(
                            <span key={j} style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.65rem', color:'#555', background:'#111', padding:'0.2rem 0.5rem', border:'1px solid #1a1a1a'}}>{t.trim()}</span>
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
          <div style={{background:'#1a1a1a'}}/>

          {/* NARROW RIGHT: Skills + Education + Languages */}
          <div style={{padding:'clamp(2rem,4vw,4rem) 2rem', display:'flex', flexDirection:'column', gap:'3rem'}}>

            {sklList.length > 0 && (
              <div>
                <div className="neo-label" style={{color:'#14F195', marginBottom:'1.5rem'}}>CAPABILITIES</div>
                <div style={{display:'flex', flexWrap:'wrap', gap:'0.5rem'}}>
                  {sklList.map((s,i)=>(
                    <span key={i} style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.75rem', color:'#ccc', border:'1px solid #222', padding:'0.4rem 0.75rem', background:'#0d0d0d', transition:'all 0.15s', cursor:'default'}}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {eduList.length > 0 && (
              <div>
                <div className="neo-label" style={{color:'#9945FF', marginBottom:'1.5rem'}}>EDUCATION</div>
                <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
                  {eduList.map((e,i)=>{
                    const split = e.split(':');
                    return (
                      <div key={i} style={{paddingLeft:'1rem', borderLeft:'2px solid #222'}}>
                        <div style={{fontSize:'1rem', fontWeight:600, color:'#fff', marginBottom:'0.2rem'}}>{split[1]?.trim() || e}</div>
                        {split[0] && <div style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.65rem', color:'#555'}}>{split[0].trim()}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {data.lang && (
              <div>
                <div className="neo-label" style={{marginBottom:'1.5rem'}}>LANGUAGES</div>
                <div style={{display:'flex', flexWrap:'wrap', gap:'0.5rem'}}>
                  {parseList(data.lang).map((l,i)=>(
                    <span key={i} style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.7rem', color:'#888', padding:'0.3rem 0.6rem', border:'1px solid #1a1a1a'}}>{l}</span>
                  ))}
                </div>
              </div>
            )}

            {data.cert && (
              <div>
                <div className="neo-label" style={{marginBottom:'1.5rem'}}>CERTIFICATIONS</div>
                <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
                  {parseList(data.cert).map((c,i)=>(
                    <div key={i} style={{fontSize:'0.85rem', color:'#888', display:'flex', gap:'0.5rem', alignItems:'flex-start'}}>
                      <span style={{color:'#14F195', flexShrink:0}}>—</span>{c}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* BOTTOM STRIPE */}
        <div style={{height:'3px', background:'linear-gradient(90deg, transparent, #9945FF 50%, transparent 100%)'}}/>

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

    try {
      setIsMinting(true);

      // Always use Helius devnet — more reliable for Metaplex Core
      const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com';
      console.log('[Mint] Using RPC:', rpc);
      console.log('[Mint] Wallet:', walletAdapter.publicKey.toBase58());

      const umi = createUmi(rpc)
        .use(walletAdapterIdentity(walletAdapter))
        .use(mplCore());

      // URI must be a full valid URL — use a real metadata endpoint
      const baseUrl = window.location.origin;
      const uri = `${baseUrl}/api/mint/metadata?n=${encodeURIComponent(data?.n || 'Builder')}&r=${encodeURIComponent(data?.r || 'Web3 Dev')}&p=${encodeURIComponent(data?.p || '')}`;
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
      const canvas = await html2canvas(el,{scale:2,useCORS:true,allowTaint:true,backgroundColor:'#000000',logging:false,imageTimeout:15000});
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
    if(!p) return;
    try{
      const decoded = JSON.parse(atob(p));
      setData(decoded);
      
      const promises = [];
      if(decoded.gh) promises.push(fetch(`/api/github?username=${decoded.gh}`).then(r=>r.json()).then(setGhData).catch(console.error));
      if(decoded.sol) promises.push(fetch(`/api/solana?wallet=${decoded.sol}`).then(r=>r.json()).then(setSolData).catch(console.error));
      
      Promise.allSettled(promises).then(() => setIsLoadingScore(false));
    }catch(e){console.error(e); setIsLoadingScore(false);}
  },[]);

  if(!data) return <div style={{textAlign:'center',marginTop:'5rem',fontFamily:'monospace',color:'#888'}}>INITIALIZING_ONCHAIN_DATA...</div>;

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
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.9)',backdropFilter:'blur(10px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Space Grotesk', sans-serif"}}>
          <div style={{background:'#050505',padding:'3rem',border:'1px solid #333',width:'90%',maxWidth:'450px',color:'#fff'}}>
            <h3 style={{marginTop:0,marginBottom:'2rem',fontSize:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',fontWeight:700,textTransform:'uppercase'}}>
              <span>INITIATE_TRANSFER</span>
              <button onClick={()=>setShowTipModal(false)} style={{background:'transparent',border:'none',color:'#888',cursor:'pointer',fontSize:'1.5rem',padding:0,lineHeight:1}}>&times;</button>
            </h3>
            
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem',marginBottom:'2rem'}}>
              {['0.1','0.5','1.0'].map(amt => (
                <button key={amt} onClick={()=>setTipAmount(amt)} style={{padding:'1rem',background:tipAmount===amt?'#14F195':'transparent',color:tipAmount===amt?'#000':'#fff',border:'1px solid',borderColor:tipAmount===amt?'#14F195':'#333',cursor:'pointer',fontWeight:700,fontFamily:"'JetBrains Mono', monospace",transition:'all 0.2s'}}>
                  {amt} SOL
                </button>
              ))}
            </div>
            
            <div style={{marginBottom:'2rem'}}>
              <label style={{display:'block',fontSize:'0.75rem',color:'#888',marginBottom:'0.5rem',fontFamily:"'JetBrains Mono', monospace",textTransform:'uppercase'}}>CUSTOM_AMOUNT</label>
              <input type="number" step="0.1" value={tipAmount} onChange={(e)=>setTipAmount(e.target.value)} style={{width:'100%',padding:'1rem',background:'#111',border:'1px solid #333',color:'#14F195',fontSize:'1.25rem',fontFamily:"'JetBrains Mono', monospace"}} placeholder="0.25" />
            </div>

            <button onClick={()=>handleTip(tipAmount)} disabled={isTipping} style={{width:'100%',padding:'1.25rem',background:'#fff',color:'#000',border:'none',fontSize:'1rem',fontWeight:800,cursor:isTipping?'wait':'pointer',opacity:isTipping?0.5:1,textTransform:'uppercase',letterSpacing:'1px'}}>
              {isTipping ? 'PROCESSING_TRANSACTION...' : `SEND ${tipAmount} SOL`}
            </button>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertConfig.show && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(4px)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Space Grotesk', sans-serif"}}>
          <div style={{background:'#050505',padding:'2.5rem',border:`1px solid ${alertConfig.type === 'error' ? '#ff3333' : alertConfig.type === 'success' ? '#14F195' : '#333'}`,width:'90%',maxWidth:'450px',color:'#fff', borderRadius:'8px', boxShadow:`0 10px 40px rgba(${alertConfig.type === 'error' ? '255,51,51' : alertConfig.type === 'success' ? '20,241,149' : '255,255,255'}, 0.1)`}}>
            <h3 style={{marginTop:0,marginBottom:'1rem',fontSize:'1.25rem',display:'flex',alignItems:'center',gap:'0.75rem',fontWeight:700,color:alertConfig.type === 'error' ? '#ff3333' : alertConfig.type === 'success' ? '#14F195' : '#fff'}}>
              {alertConfig.type === 'error' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
              {alertConfig.type === 'success' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
              {alertConfig.type === 'info' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>}
              {alertConfig.title}
            </h3>
            
            <p style={{fontSize:'0.9rem',color:'#aaa',lineHeight:1.6,fontFamily:"'JetBrains Mono', monospace",marginBottom:'2rem', whiteSpace:'pre-wrap', wordBreak:'break-word'}}>
              {alertConfig.message}
            </p>

            {alertConfig.link && (
              <div style={{marginBottom:'2rem'}}>
                <a href={alertConfig.link} target="_blank" rel="noopener noreferrer" style={{color:'#14F195',textDecoration:'underline',fontFamily:"'JetBrains Mono', monospace",fontSize:'0.85rem'}}>
                  {alertConfig.linkText || alertConfig.link}
                </a>
              </div>
            )}
            
            <button 
              onClick={() => setAlertConfig({...alertConfig, show: false})} 
              style={{width:'100%',padding:'1rem',background:alertConfig.type === 'error' ? '#ff3333' : alertConfig.type === 'success' ? '#14F195' : '#fff',color:'#000',border:'none',fontSize:'0.9rem',fontWeight:800,cursor:'pointer',textTransform:'uppercase',letterSpacing:'1px',borderRadius:'4px'}}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Floating Mint Button - Only visible to the profile owner */}
      {walletAdapter.publicKey?.toBase58() === data.sol && (
        <div className="no-print" style={{position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999}}>
          <button 
            onClick={handleMintIdentity} 
            disabled={isMinting}
            style={{
              background: '#14F195',
              color: '#000',
              border: 'none',
              padding: '1rem 1.5rem',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: isMinting ? 'wait' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: isMinting ? 0.7 : 1,
              boxShadow: '0 0 0 1px rgba(20,241,149,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.boxShadow = '8px 8px 0px rgba(20,241,149,0.5)';
              e.currentTarget.style.transform = 'translate(-4px, -4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#14F195';
              e.currentTarget.style.boxShadow = '0 0 0 1px rgba(20,241,149,0.3)';
              e.currentTarget.style.transform = 'translate(0, 0)';
            }}
          >
            {isMinting ? 'MINTING...' : 'MINT ONCHAIN ID'}
          </button>
        </div>
      )}

      <div className="no-print" style={{background:'#050505',borderBottom:'1px solid #222',padding:'1rem 0'}}>
        <div className="container" style={{display:'flex',justifyContent:'flex-end',gap:'1rem'}}>
          <button onClick={() => setShowTipModal(true)} style={{fontSize:'0.75rem',padding:'0.75rem 1.25rem',background:'transparent',color:'#14F195',fontWeight:700,border:'1px solid #14F195',cursor:'pointer',fontFamily:"'JetBrains Mono', monospace",textTransform:'uppercase'}}>
            TIP DEVELOPER
          </button>
          <button onClick={downloadPDF} disabled={downloading} style={{fontSize:'0.75rem',padding:'0.75rem 1.25rem',background:'transparent',color:'#fff',border:'1px solid #333',cursor:'pointer',fontFamily:"'JetBrains Mono', monospace",textTransform:'uppercase'}}>
            {downloading?'GENERATING...':'DOWNLOAD PDF'}
          </button>
          <Link href="/" style={{fontSize:'0.75rem',padding:'0.75rem 1.25rem', background:'#fff', color:'#000', border:'none',textDecoration:'none',fontWeight:700,fontFamily:"'JetBrains Mono', monospace",textTransform:'uppercase'}}>BUILDER</Link>
        </div>
      </div>

      <SolanaNativeTemplate {...tmplProps} />
    </>
  );
}
