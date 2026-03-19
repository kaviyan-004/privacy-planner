import React, { useState } from 'react';
import { Zap, Target, Search, Clock, Key, ArrowRight, Crosshair, ShieldAlert, CheckCircle } from 'lucide-react';
import api from '../api';

const WhatIf = () => {
  const [scenario, setScenario] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const scenarios = [
    { icon: Target, title: "Find My Home Location", desc: "How quickly can someone find where I live?", color: "var(--red-danger)", prompt: "What if someone wanted to find where I live using only my public social media posts?" },
    { icon: Clock, title: "When Am I Alone", desc: "Can someone figure out when I am vulnerable?", color: "var(--orange-warning)", prompt: "What if someone tried to figure out my exact daily routine and times when I am home alone based on my posts?" },
    { icon: Crosshair, title: "Targeted Phishing Attack", desc: "How personalized could a scam email be?", color: "var(--yellow-caution)", prompt: "What if a scammer used my posts to craft a highly personalized spear-phishing email targeting my workplace and hobbies?" },
    { icon: Key, title: "Guess My Password", desc: "Predict what my password contains", color: "var(--purple-primary)", prompt: "What if a hacker used my pets' names, favorite bands, and birth dates from my profile to crack my passwords?" }
  ];

  const handleSimulate = async () => {
    if(!scenario) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/whatif', { scenario, post_context: context });
      setResult(res.data);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{paddingTop:'4rem', paddingBottom:'6rem'}}>
      <div className="animate-fade-up" style={{textAlign:'center', marginBottom:'3rem'}}>
        <div style={{display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'var(--red-glow)', color:'var(--red-danger)', padding:'0.5rem 1rem', borderRadius:'999px', fontSize:'0.875rem', fontWeight:600, border:'1px solid var(--red-danger)', marginBottom:'2rem'}}>
          <ShieldAlert size={16} /> Educational simulation — shows real attack methods
        </div>
        <h1 style={{fontSize:'2.5rem', fontWeight:800, marginBottom:'0.5rem'}}>What If Simulator</h1>
        <p style={{color:'var(--text-secondary)', fontSize:'1.125rem'}}>How dangerous is your public data really?</p>
      </div>

      <div className="animate-fade-up stagger-1" style={{marginBottom:'4rem'}}>
        <h2 style={{fontSize:'1.25rem', marginBottom:'1.5rem', textAlign:'center'}}>Choose an Attack Scenario</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'1rem'}}>
          {scenarios.map((s, i) => (
            <div key={i} className="card" onClick={() => setScenario(s.prompt)} style={{padding:'1.5rem', cursor:'pointer', borderTop:`4px solid ${s.color}`, transition:'all 0.2s', transform: scenario === s.prompt ? 'translateY(-4px)' : 'none', boxShadow: scenario === s.prompt ? `0 8px 24px rgba(255,255,255,0.05)` : 'none'}}>
              <s.icon size={28} color={s.color} style={{marginBottom:'1rem'}} />
              <h3 style={{fontSize:'1.1rem', marginBottom:'0.5rem'}}>{s.title}</h3>
              <p style={{fontSize:'0.875rem', color:'var(--text-secondary)'}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'flex', gap:'2rem', flexWrap:'wrap', alignItems:'flex-start'}}>
        
        {/* Left - Input */}
        <div className="card animate-fade-up stagger-2" style={{flex:'1 1 40%', padding:'2rem', minWidth:'300px'}}>
          <div style={{marginBottom:'2rem'}}>
            <label style={{display:'block', marginBottom:'0.75rem', fontWeight:600}}>Your Scenario</label>
            <textarea 
              className="input-field" 
              style={{height:'120px', resize:'none', padding:'1rem'}}
              placeholder="What if someone wanted to find where I live using only my public social media posts?"
              value={scenario}
              onChange={e => setScenario(e.target.value)}
            ></textarea>
          </div>

          <div style={{marginBottom:'2.5rem'}}>
            <label style={{display:'block', marginBottom:'0.75rem', fontWeight:600, color:'var(--text-secondary)'}}>Add your recent posts for context (optional)</label>
            <textarea 
              className="input-field" 
              style={{height:'80px', resize:'none', padding:'1rem', background:'var(--bg-secondary)', borderColor:'var(--border-normal)'}}
              placeholder="Paste 2-3 recent posts here so the simulation is tailored to you..."
              value={context}
              onChange={e => setContext(e.target.value)}
            ></textarea>
          </div>

          <button onClick={handleSimulate} disabled={loading || !scenario} style={{width:'100%', padding:'1.25rem', fontSize:'1.125rem', background:'linear-gradient(135deg, var(--red-danger), #7f1d1d)', color:'white', border:'none', borderRadius:'8px', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', cursor: loading||!scenario?'not-allowed':'pointer', opacity: loading||!scenario?0.6:1, transition:'all 0.2s'}}>
            {loading ? <div className="animate-spin" style={{width: 24, height: 24, borderTop: '2px solid white', borderRadius: '50%'}}></div> : <><Zap size={22}/> Run Attack Simulation</>}
          </button>
        </div>

        {/* Right - Results */}
        <div style={{flex:'1 1 50%', minWidth:'300px'}}>
          {!result && !loading && (
            <div className="card animate-fade-up stagger-3" style={{height:'100%', minHeight:'400px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'3rem', color:'var(--text-muted)'}}>
              <Zap size={64} style={{opacity:0.2, marginBottom:'1rem'}} />
              <h3 style={{fontSize:'1.25rem', marginBottom:'0.5rem', color:'var(--text-secondary)'}}>Awaiting Scenario</h3>
              <p>Select or type a scenario and click run.</p>
            </div>
          )}

          {loading && (
             <div className="card" style={{height:'100%', minHeight:'400px', padding:'3rem', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'var(--red-danger)'}}>
               <div className="animate-spin" style={{width: 64, height: 64, borderTop: '4px solid var(--red-danger)', borderRadius: '50%', marginBottom:'2rem'}}></div>
               <h3 className="animate-pulse" style={{fontSize:'1.5rem'}}>Simulating Attack Vector...</h3>
             </div>
          )}

          {result && !loading && (
            <div className="animate-fade-up flex-col" style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
              
              <div className="card" style={{padding:'2rem', borderTop:'4px solid var(--red-danger)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:'1rem', borderBottom:'1px solid var(--border-normal)'}}>
                  <h2 style={{fontSize:'1.5rem', display:'flex', alignItems:'center', gap:'0.75rem', color:'white'}}><Zap color="var(--red-danger)" /> Simulation Results</h2>
                  <div style={{background:'var(--red-danger)', color:'white', padding:'0.4rem 1rem', borderRadius:'999px', fontSize:'0.875rem', fontWeight:600}}>
                    Est. time: {result.time_estimate}
                  </div>
                </div>

                <div style={{display:'flex', flexDirection:'column', gap:'1rem', marginTop:'1.5rem'}}>
                  {result.steps?.map((step, i) => (
                    <div key={i} style={{padding:'1.25rem', display:'flex', gap:'1rem', alignItems:'flex-start', background:'var(--bg-input)', borderRadius:'8px', border:'1px solid var(--border-normal)'}}>
                      <div style={{width:'32px', height:'32px', borderRadius:'50%', background:'var(--red-glow)', color:'var(--red-danger)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.875rem', fontWeight:'bold', flexShrink:0, border:'1px solid var(--red-danger)'}}>{i+1}</div>
                      <div style={{color:'var(--text-primary)', lineHeight:1.5, fontSize:'1.05rem'}}>
                        <ArrowRight size={16} color="var(--red-danger)" style={{display:'inline', marginRight:'0.5rem', transform:'translateY(2px)'}} />
                        {step}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{padding:'1.5rem', background:'var(--red-glow)', borderLeft:'4px solid var(--red-danger)', marginTop:'1.5rem', borderRadius:'0 8px 8px 0'}}>
                  <div style={{fontWeight:600, color:'var(--red-danger)', fontSize:'1.1rem'}}>⚠️ {result.conclusion}</div>
                </div>
              </div>

              <div className="card" style={{padding:'2rem', borderTop:'4px solid var(--green-safe)', marginTop:'1rem'}}>
                <h3 style={{fontSize:'1.25rem', marginBottom:'1.5rem', color:'var(--green-safe)', display:'flex', alignItems:'center', gap:'0.5rem'}}><ShieldAlert size={20}/> How To Prevent This</h3>
                <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
                  {result.tips?.map((tip, i) => (
                     <div key={i} style={{padding:'1rem', background:'rgba(16, 185, 129, 0.1)', color:'var(--text-primary)', borderRadius:'8px', display:'flex', gap:'0.75rem', alignItems:'flex-start'}}>
                       <CheckCircle size={18} color="var(--green-safe)" style={{flexShrink:0, marginTop:'0.1rem'}} />
                       <span style={{lineHeight:1.4}}>{tip}</span>
                     </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatIf;
