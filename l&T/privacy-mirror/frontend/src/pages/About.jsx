import React from 'react';
import { Shield, Lock, EyeOff, Server, Terminal, LineChart, FileText } from 'lucide-react';

const About = () => {
  return (
    <div className="container" style={{paddingBottom:'6rem'}}>
      
      {/* Mission */}
      <div className="animate-fade-up" style={{textAlign:'center', padding:'6rem 1rem', maxWidth:'800px', margin:'0 auto'}}>
        <div style={{fontSize:'3rem', marginBottom:'2rem'}}>🪞</div>
        <h1 style={{fontSize:'2.5rem', fontWeight:800, marginBottom:'1.5rem', fontStyle:'italic', color:'white'}}>
          "Most privacy tools tell you there is a problem.<br/>
          Privacy Mirror makes you feel the problem."
        </h1>
        <p style={{fontSize:'1.125rem', color:'var(--text-secondary)', lineHeight:1.8}}>
          Built as an experiential tool designed to wake people up to the realities of oversharing online. By simulating an attacker's perspective, we aim to educate users on how seemingly innocent posts can be stitched together to reveal critical private information.
        </p>
      </div>

      {/* Problem */}
      <div className="card animate-fade-up stagger-1" style={{padding:'3rem', marginBottom:'4rem', display:'flex', flexWrap:'wrap', gap:'3rem', alignItems:'center'}}>
        <div style={{flex:'1 1 400px'}}>
          <h2 style={{fontSize:'2rem', marginBottom:'1.5rem'}}>The Problem We Are Solving</h2>
          <div style={{color:'var(--text-secondary)', fontSize:'1.1rem', lineHeight:1.8, display:'flex', flexDirection:'column', gap:'1rem'}}>
             <p>People often share isolated pieces of information, thinking each piece is harmless. A coffee shop photo here, a rant about morning traffic there.</p>
             <p>However, digital footprint aggregation is real. Attackers and automated scripts combine these isolated data points to construct terrifyingly accurate profiles of your routines, locations, and vulnerabilities.</p>
             <p>We built this to visually demonstrate <strong>Data Aggregation Risk</strong>.</p>
          </div>
        </div>
        <div style={{flex:'1 1 300px', display:'flex', flexDirection:'column', gap:'1rem'}}>
          <div style={{background:'var(--bg-input)', padding:'1.5rem', borderRadius:'8px', borderLeft:'4px solid var(--red-danger)'}}>
            <div style={{fontSize:'2rem', fontWeight:800, color:'var(--red-danger)', fontFamily:'JetBrains Mono'}}>68%</div>
            <div style={{fontSize:'0.875rem', color:'var(--text-secondary)'}}>of people overshare location online</div>
          </div>
          <div style={{background:'var(--bg-input)', padding:'1.5rem', borderRadius:'8px', borderLeft:'4px solid var(--orange-warning)'}}>
            <div style={{fontSize:'2rem', fontWeight:800, color:'var(--orange-warning)', fontFamily:'JetBrains Mono'}}>1 in 4</div>
            <div style={{fontSize:'0.875rem', color:'var(--text-secondary)'}}>cyberstalking cases originate from social media</div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="animate-fade-up stagger-2" style={{marginBottom:'6rem'}}>
        <h2 style={{fontSize:'2rem', marginBottom:'3rem', textAlign:'center'}}>Under The Hood</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'2rem'}}>
          {[
            {icon: FileText, title: "1. Data Collection", desc: "You provide unstructured text or images from a social media post."},
            {icon: Server, title: "2. AI Processing", desc: "Claude API models analyze the data exactly how a malicious scraper would."},
            {icon: Shield, title: "3. Remediation", desc: "We provide risk scores and immediately suggest safer alternatives."}
          ].map((s, i) => (
            <div key={i} className="card" style={{padding:'2rem', textAlign:'center', position:'relative', overflow:'hidden'}}>
              <div style={{position:'absolute', top:'-20px', right:'-20px', fontSize:'8rem', opacity:0.03, fontWeight:900}}>{i+1}</div>
              <s.icon size={48} color="var(--purple-light)" style={{marginBottom:'1.5rem', margin:'0 auto', opacity:0.8}} />
              <h3 style={{fontSize:'1.25rem', marginBottom:'1rem'}}>{s.title}</h3>
              <p style={{color:'var(--text-secondary)', lineHeight:1.6}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="animate-fade-up stagger-3" style={{marginBottom:'6rem'}}>
        <h2 style={{fontSize:'2rem', marginBottom:'3rem', textAlign:'center'}}>Built With</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'1rem'}}>
          {[
            {icon: '🤖', title: "Claude AI API", desc: "Powers all advanced text and simulation logic."},
            {icon: '🐍', title: "Python Flask", desc: "Lightweight and secure backend API server."},
            {icon: '⚛️', title: "React & Vite", desc: "High-performance frontend component architecture."},
            {icon: '📊', title: "Chart.js", desc: "Visualizing privacy risk timelines."},
            {icon: '👁️', title: "Claude Vision API", desc: "Detecting physical security risks in uploaded photos."},
            {icon: '🔒', title: "Zero Storage Design", desc: "Privacy by design principle implemented everywhere."}
          ].map((tech, i) => (
            <div key={i} className="card" style={{padding:'1.5rem', display:'flex', gap:'1rem', alignItems:'center'}}>
              <div style={{fontSize:'2rem', width:'60px', height:'60px', background:'var(--bg-input)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid var(--border-normal)', flexShrink:0}}>{tech.icon}</div>
              <div>
                <h4 style={{fontSize:'1.1rem', marginBottom:'0.25rem'}}>{tech.title}</h4>
                <div style={{fontSize:'0.875rem', color:'var(--text-secondary)'}}>{tech.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Promise */}
      <div className="card animate-fade-up stagger-4" style={{padding:'4rem 2rem', background:'linear-gradient(135deg, var(--purple-dark), var(--bg-secondary))', borderColor:'var(--purple-light)', textAlign:'center'}}>
        <Lock size={64} color="var(--green-safe)" style={{marginBottom:'1.5rem', margin:'0 auto'}} />
        <h2 style={{fontSize:'2.5rem', marginBottom:'2rem', color:'white'}}>Our Privacy Promise</h2>
        
        <div style={{display:'inline-flex', flexDirection:'column', gap:'1.5rem', textAlign:'left', maxWidth:'600px', margin:'0 auto', width:'100%'}}>
          {[
            "We never store your posts, images, or analysis results permanently.",
            "All session data is deleted when you close your browser or log out.",
            "Using the tool does not require linking any real social accounts.",
            "We cannot see, access, or share your submitted information."
          ].map((promise, i) => (
             <div key={i} style={{display:'flex', gap:'1rem', alignItems:'center'}}>
               <div style={{width:'32px', height:'32px', borderRadius:'50%', background:'var(--green-safe)', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>✅</div>
               <div style={{fontSize:'1.1rem', color:'white'}}>{promise}</div>
             </div>
          ))}
        </div>
        
        <div style={{marginTop:'3rem', fontSize:'1.25rem', color:'var(--purple-light)', fontWeight:600, fontStyle:'italic'}}>
          Privacy Mirror practices what it preaches.
        </div>
      </div>

    </div>
  );
};

export default About;
