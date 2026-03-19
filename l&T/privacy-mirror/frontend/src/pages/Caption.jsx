import React, { useState } from 'react';
import { Search, Copy, CheckCircle, ShieldAlert } from 'lucide-react';
import api from '../api';

const Caption = () => {
  const [caption, setCaption] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const platforms = ['Instagram', 'WhatsApp', 'Twitter', 'Facebook', 'LinkedIn'];

  const examples = [
    { old: "Leaving Chennai at 6AM for Bangalore ✈️", new: "Off on an adventure! ✈️" },
    { old: "At Anna Nagar park right now 😊", new: "Out enjoying the day! 😊" },
    { old: "Home alone tonight, parents are in Coimbatore", new: "Quiet evening at home 🏠" },
    { old: "Just bought iPhone 15 from Phoenix Mall Chennai!", new: "Treated myself today! 🎉" }
  ];

  const analyzeCaptionLocal = (text) => {
    const lower = text.toLowerCase();
    
    const locations = ['goa', 'chennai', 'bangalore', 'coimbatore', 'mumbai', 'delhi', 'anna nagar', 'resort', 'mall', 'park', 'airport', 'beach', 'hotel'];
    const times = ['tomorrow', 'today', 'tonight', 'now', '6am', 'morning', 'evening', 'weekend', 'sunday', 'monday', 'friday'];
    const actions = ['leaving', 'going', 'staying', 'bought', 'traveling', 'flying', 'driving', 'exploring', 'visiting'];
    
    let detectedRisks = [];
    let removedItems = [];
    
    locations.forEach(loc => {
      const regex = new RegExp(`\\b${loc}\\b`, 'i');
      if(regex.test(text)) {
        detectedRisks.push({ category: '📍 Location', value: loc, severity: 'High Risk' });
        removedItems.push(loc);
      }
    });
    
    times.forEach(t => {
      const regex = new RegExp(`\\b${t}\\b`, 'i');
      if(regex.test(text)) {
        detectedRisks.push({ category: '🕒 Time', value: t, severity: 'Medium Risk' });
        removedItems.push(t);
      }
    });
    
    actions.forEach(a => {
      const regex = new RegExp(`\\b${a}\\b`, 'i');
      if(regex.test(text)) {
        detectedRisks.push({ category: '🧳 Travel/Activity', value: a, severity: 'Low Risk' });
        removedItems.push(a);
      }
    });

    let riskScore = (detectedRisks.filter(r => r.severity === 'High Risk').length * 40) + 
                    (detectedRisks.filter(r => r.severity === 'Medium Risk').length * 20) + 
                    (detectedRisks.filter(r => r.severity === 'Low Risk').length * 10);
                    
    const level = riskScore >= 60 ? 'High Risk' : riskScore >= 30 ? 'Medium Risk' : 'Low Risk';

    let safeVersion = text;
    if(detectedRisks.length > 0) {
      if (lower.includes('going') || lower.includes('leaving') || lower.includes('flight')) {
         safeVersion = "Grateful for some time off! ✨";
      } else if (lower.includes('bought') || lower.includes('shopping') || lower.includes('iphone')) {
         safeVersion = "Treated myself today! 🎉";
      } else if (lower.includes('home') || lower.includes('alone')) {
         safeVersion = "Quiet evening vibes 🏠";
      } else if (lower.includes('park') || lower.includes('outside')) {
         safeVersion = "Out enjoying the day! 😊";
      } else {
         safeVersion = "Enjoying the little moments ✨";
      }
    } else {
      safeVersion = text + " ✨";
    }

    return {
      detected_risks: detectedRisks,
      removed_items: removedItems,
      risk_level: level,
      safe_caption: safeVersion,
      original_caption: text
    };
  };

  const renderHighlightedCaption = (text, risks) => {
    if (!risks || risks.length === 0) return <span>{text}</span>;
    const wordsToHighlight = risks.map(r => r.value.toLowerCase());
    
    const tokens = text.split(/(\s+)/);
    return tokens.map((token, i) => {
      const cleaned = token.replace(/[.,!?]/g, '').toLowerCase();
      if (wordsToHighlight.includes(cleaned)) {
        return <span key={i} style={{background: 'rgba(239,68,68,0.15)', color: 'var(--red-danger)', padding:'0.1rem 0.3rem', borderRadius:'4px', border:'1px solid var(--red-danger)'}}>{token}</span>;
      }
      return <span key={i}>{token}</span>;
    });
  };

  const handleAnalyze = async () => {
    if(!caption) return;
    setLoading(true);
    setResult(null);
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const resData = analyzeCaptionLocal(caption);
      setResult(resData);
      
      await api.post('/save', {
        type: 'caption',
        input_preview: caption,
        risk_score: resData.risk_level === 'High Risk' ? 80 : resData.risk_level === 'Medium Risk' ? 50 : 10,
        safe_version: resData.safe_caption
      }).catch(err => console.log("Save error:", err));
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if(!result) return;
    navigator.clipboard.writeText(result.safe_caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container" style={{paddingTop:'4rem', paddingBottom:'6rem'}}>
      <div className="animate-fade-up" style={{textAlign:'center', marginBottom:'4rem'}}>
        <h1 style={{fontSize:'2.5rem', fontWeight:800, marginBottom:'0.5rem'}}>Smart Caption Privacy Recommender</h1>
        <p style={{color:'var(--text-secondary)', fontSize:'1.125rem'}}>Say the same thing — but safely</p>
      </div>

      <div className="card animate-fade-up stagger-1" style={{padding:'2.5rem', maxWidth:'800px', margin:'0 auto 3rem'}}>
        <h2 style={{fontSize:'1.25rem', marginBottom:'1.5rem'}}>Type Your Caption</h2>
        <textarea 
          className="input-field" 
          style={{height:'120px', resize:'none', padding:'1rem', fontSize:'1.1rem', marginBottom:'1.5rem'}}
          placeholder="At Anna Nagar park right now with friends 😊"
          value={caption}
          onChange={e => setCaption(e.target.value)}
        ></textarea>
        
        <div style={{display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem', flexWrap:'wrap'}}>
          <div style={{color:'var(--text-secondary)', fontWeight:500}}>Platform:</div>
          <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
            {platforms.map(p => (
              <button 
                key={p} 
                onClick={() => setPlatform(p)} 
                style={{
                  padding:'0.5rem 1rem', borderRadius:'999px', fontSize:'0.875rem', fontWeight:500, transition:'all 0.2s',
                  background: platform === p ? 'var(--purple-primary)' : 'var(--bg-input)',
                  border: `1px solid ${platform === p ? 'var(--purple-primary)' : 'var(--border-normal)'}`,
                  color: platform === p ? 'white' : 'var(--text-secondary)'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleAnalyze} disabled={loading || !caption} className="btn-primary" style={{width:'100%', padding:'1.25rem', fontSize:'1.125rem'}}>
          {loading ? <div className="animate-spin" style={{width: 24, height: 24, borderTop: '2px solid white', borderRadius: '50%'}}></div> : <><Search size={22}/> Check This Caption</>}
        </button>
      </div>

      {result && (
        <div className="animate-fade-up stagger-2" style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
          
          {/* Risky Version Card */}
          <div className="card" style={{padding:'2rem', background:'var(--red-glow)', borderColor:'var(--red-danger)', borderRadius:'16px'}}>
            <h3 style={{color:'var(--red-danger)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><ShieldAlert size={20}/> Risky Version</h3>
            <div style={{fontStyle:'italic', color:'var(--text-primary)', fontSize:'1.125rem', marginBottom:'1.5rem', lineHeight:1.6}}>
              {renderHighlightedCaption(caption, result.detected_risks)}
            </div>
            
            {result.detected_risks?.length > 0 && (
              <div style={{marginTop:'1.5rem', borderTop:'1px solid var(--red-danger)', paddingTop:'1rem'}}>
                <div style={{color:'var(--red-danger)', fontWeight:600, marginBottom:'0.75rem', fontSize:'0.875rem'}}>DETECTED RISKS:</div>
                <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                  {result.detected_risks.map((r, i) => (
                    <div key={i} style={{display:'flex', gap:'0.5rem', fontSize:'0.875rem'}}>
                      <span style={{fontWeight:600}}>{r.category}</span>
                      <span style={{color:'var(--text-secondary)'}}>({r.severity}):</span>
                      <span style={{color:'white'}}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Safe Version Card */}
          <div className="card" style={{padding:'2rem', background:'rgba(16, 185, 129, 0.1)', borderColor:'var(--green-safe)', position:'relative', borderRadius:'16px'}}>
            <h3 style={{color:'var(--green-safe)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><CheckCircle size={20}/> Safe Version</h3>
            <p style={{color:'var(--text-primary)', fontSize:'1.125rem', fontWeight:600, marginBottom:'1.5rem'}}>{result.safe_caption}</p>
            
            <div style={{fontSize:'0.875rem', color:'var(--text-muted)'}}>
              <span style={{fontWeight:600, color:'var(--green-safe)'}}>Removed:</span> specific locations, dates, and sensitive details
            </div>

            <button onClick={copyToClipboard} style={{position:'absolute', top:'2rem', right:'2rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.5rem', background:'var(--bg-main)', borderRadius:'8px', border:'1px solid var(--border-normal)', cursor:'pointer'}}>
              {copied ? <CheckCircle size={16} color="var(--green-safe)" /> : <Copy size={16} />}
              {copied ? <span style={{color:'var(--green-safe)', fontSize:'0.75rem'}}>Copied!</span> : <span style={{fontSize:'0.75rem'}}>Copy</span>}
            </button>
          </div>

        </div>
      )}

      {/* Examples Bank */}
      <div className="card animate-fade-up stagger-3" style={{marginTop:'4rem', padding:'2rem'}}>
        <h2 style={{fontSize:'1.5rem', marginBottom:'1.5rem'}}>Quick Examples to Try</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'1rem'}}>
          {examples.map((ex, i) => (
            <div key={i} onClick={() => setCaption(ex.old)} style={{padding:'1.5rem', background:'var(--bg-input)', borderRadius:'8px', border:'1px solid var(--border-normal)', cursor:'pointer', transition:'all 0.2s'}} onMouseOver={e=>e.currentTarget.style.borderColor='var(--purple-primary)'} onMouseOut={e=>e.currentTarget.style.borderColor='var(--border-normal)'}>
              <div style={{color:'var(--red-danger)', fontSize:'0.875rem', marginBottom:'0.5rem', fontStyle:'italic'}}>❌ "{ex.old}"</div>
              <div style={{color:'var(--green-safe)', fontSize:'0.875rem', fontWeight:600}}>✅ "{ex.new}"</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Caption;
