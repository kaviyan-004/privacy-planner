import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Background elements */}
      <div style={{position:'absolute', top:'10%', right:'10%', width:'400px', height:'400px', background:'radial-gradient(var(--purple-primary), transparent 70%)', filter:'blur(80px)', pointerEvents:'none', opacity:0.3}}></div>
      <div style={{position:'absolute', top:'40%', left:'5%', width:'400px', height:'400px', background:'radial-gradient(var(--blue-info), transparent 70%)', filter:'blur(80px)', pointerEvents:'none', opacity:0.2}}></div>

      <div className="container" style={{paddingTop: '6rem', paddingBottom: '6rem', textAlign: 'center', position:'relative', zIndex:2}}>
        <div className="animate-fade-up stagger-1" style={{display:'inline-block', padding:'0.5rem 1rem', border:'1px solid var(--purple-primary)', borderRadius:'999px', fontSize:'0.875rem', fontWeight:600, color:'var(--purple-light)', marginBottom:'2rem', backgroundColor:'var(--purple-glow)'}}>
          🔐 AI-Powered Cybersecurity Tool
        </div>
        
        <h1 className="animate-fade-up stagger-2" style={{fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem', background: 'linear-gradient(to right, white, var(--purple-light), var(--blue-info))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800}}>
          See What the Internet<br/>Sees About You
        </h1>
        
        <p className="animate-fade-up stagger-3" style={{fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6}}>
          Every post you share reveals more than you think. Privacy Mirror shows you exactly what a stranger, hacker, or stalker can learn about you — and how to stop it.
        </p>
        
        <div className="animate-fade-up stagger-4" style={{display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap', marginBottom:'1.5rem'}}>
          <Link to="/analyze" className="btn-primary" style={{padding:'1rem 2rem', fontSize:'1.125rem'}}>Analyze My Posts →</Link>
          <Link to="/about" className="btn-outline" style={{padding:'1rem 2rem', fontSize:'1.125rem'}}>See How It Works</Link>
        </div>
        
        <div className="animate-fade-up stagger-4" style={{fontSize:'0.875rem', color:'var(--text-muted)'}}>
          <span style={{color:'var(--green-safe)'}}>●</span> 🔒 No data stored. No account needed to demo. 100% private.
        </div>
      </div>

      {/* Stats Section */}
      <div className="container" style={{paddingBottom: '6rem', position:'relative', zIndex:2}}>
        <h2 style={{textAlign:'center', marginBottom:'3rem', fontSize:'2rem'}}>The Problem Is Bigger Than You Think</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'2rem'}}>
          {[
            {num: "68%", text: "of people overshare location online", color: "var(--red-danger)", glow: "var(--red-glow)"},
            {num: "1 in 4", text: "cyberstalking cases from social media", color: "var(--orange-warning)", glow: "var(--orange-warning)"},
            {num: "79%", text: "students unaware of what they reveal", color: "var(--yellow-caution)", glow: "var(--yellow-caution)"}
          ].map((stat, i) => (
            <div key={i} className="card animate-fade-up" style={{animationDelay: `0.${i+2}s`, padding:'2rem', borderLeft:`4px solid ${stat.color}`, background: `linear-gradient(90deg, ${stat.glow} 0%, transparent 50%), var(--bg-card)`}}>
              <div style={{fontSize:'3rem', fontWeight:800, color: stat.color, marginBottom:'0.5rem', fontFamily:'JetBrains Mono'}}>{stat.num}</div>
              <div style={{color:'var(--text-secondary)', fontSize:'1.125rem'}}>{stat.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Section */}
      <div className="container" style={{paddingBottom: '6rem'}}>
        <h2 style={{textAlign:'center', marginBottom:'3rem', fontSize:'2rem'}}>See It In Action</h2>
        <div style={{display:'flex', flexWrap:'wrap', gap:'2rem', alignItems:'center', justifyContent:'center'}}>
          <div className="card" style={{flex:1, minWidth:'300px', padding:'2rem', background:'var(--red-glow)', borderColor:'var(--red-danger)'}}>
            <h3 style={{color:'var(--red-danger)', marginBottom:'1rem'}}>❌ What You Posted</h3>
            <p style={{fontStyle:'italic', color:'var(--text-primary)', lineHeight:1.6, fontSize:'1.1rem'}}>
              "Going to Goa tomorrow from Chennai! ✈️<br/><br/>Staying at Palm Beach Resort until Sunday 🌴 excited to see everyone!"
            </p>
          </div>
          <div style={{fontSize:'2.5rem', color:'var(--purple-primary)', fontWeight:'bold'}}>→</div>
          <div className="card" style={{flex:1, minWidth:'300px', padding:'2rem', borderTop:'4px solid var(--blue-info)'}}>
            <h3 style={{color:'var(--blue-info)', marginBottom:'1rem'}}>🔍 What We Found</h3>
            <ul style={{color:'var(--text-secondary)', lineHeight:2, fontSize:'1.1rem'}}>
              <li>📍 Current city: <strong style={{color:'white'}}>Chennai</strong></li>
              <li>✈️ Destination: <strong style={{color:'white'}}>Goa</strong></li>
              <li>🏨 Hotel: <strong style={{color:'white'}}>Palm Beach Resort</strong></li>
              <li>📅 Return: <strong style={{color:'white'}}>Sunday</strong></li>
              <li>🏠 Home empty: <strong style={{color:'var(--red-danger)'}}>Until Sunday (Risk)</strong></li>
            </ul>
            <div style={{marginTop:'1.5rem', padding:'1rem', background:'var(--red-glow)', borderRadius:'8px', border:'1px solid var(--red-danger)', color:'var(--red-danger)', fontWeight:'bold', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <span>⚠️ Risk Score:</span>
              <span style={{fontSize:'1.5rem', fontFamily:'JetBrains Mono'}}>87/100</span>
            </div>
          </div>
        </div>
        <div style={{textAlign:'center', marginTop:'4rem'}}>
           <Link to="/analyze" className="btn-primary" style={{padding:'1rem 3rem', fontSize:'1.25rem'}}>Analyze Your Own Posts →</Link>
        </div>
      </div>
      
      {/* Footer is part of Base/App? I'll just add simple footer here. */}
      <footer style={{padding:'2rem', textAlign:'center', borderTop:'1px solid var(--border-normal)', color:'var(--text-muted)'}}>
        <div className="container" style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem'}}>
          <div>🪞 Privacy Mirror — See What the Internet Sees About You</div>
          <div>🔒 Hackathon Project • 100% Private</div>
        </div>
      </footer>
    </div>
  )
}
export default Home;
