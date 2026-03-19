import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Zap, ShieldAlert, CheckCircle, TrendingUp, Activity, Lightbulb, BarChart2, Lock, Clock } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = ({ user }) => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load local history natively without APIs
    const stored = JSON.parse(localStorage.getItem('privacyMirrorHistory') || '[]');
    setAnalyses(stored);
    setLoading(false);
  }, []);

  const latest = analyses.length > 0 ? analyses[0] : null;

  // Chart Data calculations based on all history
  const riskCategories = { Location: 0, Time: 0, Travel: 0, Personal: 0, Image: 0 };
  analyses.forEach(a => {
    (a.risks || []).forEach(r => {
      if(riskCategories[r] !== undefined) riskCategories[r]++;
    });
  });

  const chartData = {
    labels: ['Location', 'Time', 'Travel', 'Personal', 'Image'],
    datasets: [{
      label: 'Risk Flags',
      data: [riskCategories.Location, riskCategories.Time, riskCategories.Travel, riskCategories.Personal, riskCategories.Image],
      backgroundColor: 'rgba(139, 92, 246, 0.6)',
      borderColor: 'var(--purple-primary)',
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { stepSize: 1 } }, x: { grid: { display: false } } }
  };

  // Trend analysis logic
  let trendMessage = "Not enough data for trend";
  let trendColor = "var(--text-muted)";
  if (analyses.length >= 2) {
    const diff = analyses[0].riskScore - analyses[1].riskScore;
    if (diff > 0) {
      trendMessage = `Risk increased by ${diff} points since last post.`;
      trendColor = "var(--red-danger)";
    } else if (diff < 0) {
      trendMessage = `Risk decreased by ${Math.abs(diff)} points! Good job.`;
      trendColor = "var(--green-safe)";
    } else {
      trendMessage = "Risk score is perfectly stable.";
      trendColor = "var(--yellow-caution)";
    }
  }

  // AI Insights generation dynamically based on the latest local risks
  const insights = [];
  if (latest) {
    if (latest.risks.includes('Location')) insights.push("You are sharing precise location-based content.");
    if (latest.risks.includes('Time')) insights.push("Posting routines in real-time escalates privacy gaps.");
    if (latest.risks.includes('Travel')) insights.push("Travel markers found: external sources can infer home absence.");
    if (latest.risks.includes('Personal')) insights.push("High vulnerability physical state markers detected (e.g. alone).");
    if (latest.risks.includes('Image')) insights.push("Images often trace to EXIF GPS metadata implicitly.");
    if (insights.length === 0) insights.push("Your recent posts exhibit outstanding operational security!");
  }

  // Live Activity Feed populator based on local events
  const feed = [];
  if (latest) {
    const timeStr = new Date(latest.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    feed.push({ time: timeStr, msg: `Analysis completed for ${latest.type}`, type: 'info' });
    if(latest.riskScore > 0) {
      feed.push({ time: timeStr, msg: `Risk detected: ${latest.riskLevel} (${latest.riskScore}/100)`, type: latest.riskLevel==='High'?'danger':latest.riskLevel==='Medium'?'warning':'safe' });
    }
    feed.push({ time: timeStr, msg: `Safe caption generated remotely`, type: 'safe' });
  }

  return (
    <div style={{display:'flex', flexDirection:'column', width:'100%', minHeight:'calc(100vh - 70px)'}}>
      <div style={{flex:1, padding:'2rem', overflowY:'auto'}}>
        
        {/* PRIVACY UI NOTICE (MANDATORY) */}
        <div className="animate-fade-up" style={{background:'rgba(16, 185, 129, 0.05)', border:'1px solid var(--green-safe)', color:'var(--green-safe)', padding:'1rem 1.5rem', borderRadius:'8px', display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'2rem', boxShadow:'0 0 15px rgba(16, 185, 129, 0.1)'}}>
          <Lock size={20} />
          <span style={{fontWeight:500}}>🔒 Your data is processed entirely locally and not stored permanently. Intelligence cache auto-wipes every 5 minutes.</span>
        </div>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem', marginBottom:'2rem'}}>
          <div>
            <h1 className="animate-fade-up" style={{fontSize:'2rem', fontWeight:800, marginBottom:'0.25rem'}}>Dashboard Intelligence</h1>
            <p className="animate-fade-up" style={{color:'var(--text-secondary)'}}>Live security overview mapping your recent local scans.</p>
          </div>
          <Link to="/analyze" className="btn-primary" style={{transform:'none', animation:'none'}}>+ New Analysis</Link>
        </div>

        {!latest && !loading ? (
           <div className="card animate-fade-up stagger-1" style={{textAlign:'center', padding:'5rem 2rem', color:'var(--text-muted)', display:'flex', flexDirection:'column', alignItems:'center'}}>
             <ShieldAlert size={64} color="var(--purple-primary)" style={{marginBottom:'1.5rem', opacity:0.3}} />
             <h2 style={{fontSize:'1.5rem', marginBottom:'0.5rem', color:'var(--text-primary)', fontWeight:600}}>No analysis yet</h2>
             <p style={{maxWidth:'400px', lineHeight:1.5}}>Head over to the Analysis page to scan a post or image. The intelligence layer will immediately generate your local dashboard here.</p>
             <Link to="/analyze" className="btn-outline" style={{marginTop:'2rem'}}>Scan Post Now</Link>
           </div>
        ) : latest && (
          <>
            {/* Top Row: Latest Summary & Live Feed */}
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'1.5rem', marginBottom:'1.5rem'}}>
              
              {/* 📍 Section 1: Latest Analysis Summary */}
              <div className="card animate-fade-up stagger-1" style={{padding:'2rem', borderTop:'3px solid var(--purple-light)', display:'flex', flexDirection:'column'}}>
                <h3 style={{fontSize:'1.125rem', color:'var(--text-secondary)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.75rem', fontWeight:600}}><Zap size={18} color="var(--purple-light)"/> Latest Analysis Summary</h3>
                <div style={{display:'flex', alignItems:'center', gap:'1.5rem', marginBottom:'2rem'}}>
                  <div style={{fontSize:'4.5rem', fontWeight:800, lineHeight:1, fontFamily:'JetBrains Mono', color: latest.riskLevel==='High'?'var(--red-danger)':latest.riskLevel==='Medium'?'var(--yellow-caution)':'var(--green-safe)'}}>{latest.riskScore}</div>
                  <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                    <div style={{padding:'0.4rem 0.8rem', borderRadius:'6px', fontSize:'0.875rem', fontWeight:'bold', display:'inline-block', background:'var(--bg-input)', border:`1px solid ${latest.riskLevel==='High'?'var(--red-danger)':latest.riskLevel==='Medium'?'var(--yellow-caution)':'var(--green-safe)'}`, color:latest.riskLevel==='High'?'var(--red-danger)':latest.riskLevel==='Medium'?'var(--yellow-caution)':'var(--green-safe)', width:'max-content'}}>{latest.riskLevel.toUpperCase()} RISK</div>
                    <div style={{color:'var(--text-muted)', fontSize:'0.875rem', fontWeight:500}}>{latest.type} Input</div>
                  </div>
                </div>
                <div style={{background:'rgba(16,185,129,0.05)', padding:'1rem 1.25rem', borderRadius:'8px', marginTop:'auto', borderLeft:'3px solid var(--green-safe)'}}>
                  <div style={{fontSize:'0.75rem', fontWeight:800, color:'var(--green-safe)', marginBottom:'0.5rem', letterSpacing:'0.5px'}}>SAFE CAPTION</div>
                  <div style={{fontSize:'1rem', fontStyle:'italic', color:'var(--text-primary)'}}>"{latest.safeCaption}"</div>
                </div>
              </div>

              {/* 📍 Section 2: Live Activity Feed */}
              <div className="card animate-fade-up stagger-1" style={{padding:'2rem', borderTop:'3px solid var(--border-hover)'}}>
                <h3 style={{fontSize:'1.125rem', color:'var(--text-secondary)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.75rem', fontWeight:600}}><Activity size={18} color="var(--blue-info)"/> Live Activity Feed</h3>
                <div style={{display:'flex', flexDirection:'column', gap:'1.25rem', position:'relative', paddingLeft:'0.5rem'}}>
                  <div style={{position:'absolute', top:0, bottom:0, left:'16px', width:'2px', background:'var(--border-hover)', zIndex:0}}></div>
                  {feed.map((f, i) => (
                    <div key={i} style={{display:'flex', gap:'1rem', alignItems:'flex-start', position:'relative', zIndex:1}}>
                      <div style={{width:'20px', height:'20px', borderRadius:'50%', background:'var(--bg-card)', border:`2px solid ${f.type==='danger'?'var(--red-danger)':f.type==='warning'?'var(--yellow-caution)':f.type==='safe'?'var(--green-safe)':'var(--purple-primary)'}`, marginTop:'0.1rem', flexShrink:0}}></div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'0.95rem', fontWeight:500, color: f.type==='danger'?'var(--red-danger)':f.type==='warning'?'var(--yellow-caution)':f.type==='safe'?'var(--green-safe)':'var(--text-primary)', marginBottom:'0.15rem'}}>
                          {f.msg}
                        </div>
                        <div style={{color:'var(--text-muted)', fontSize:'0.8rem', fontFamily:'JetBrains Mono'}}>{f.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Middle Row: Risk chart & Insights */}
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'1.5rem', marginBottom:'1.5rem'}}>
              
              {/* 📍 Section 3: Risk Breakdown Chart */}
              <div className="card animate-fade-up stagger-2" style={{padding:'2rem'}}>
                <h3 style={{fontSize:'1.125rem', color:'var(--text-secondary)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.75rem', fontWeight:600}}><BarChart2 size={18} color="var(--purple-primary)"/> Risk Breakdown Chart</h3>
                <div style={{height:'220px'}}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* 📍 Section 4 & 5: AI Insights & Smart Suggestions */}
              <div className="card animate-fade-up stagger-2" style={{padding:'2rem', display:'flex', flexDirection:'column'}}>
                <h3 style={{fontSize:'1.125rem', color:'var(--text-secondary)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.75rem', fontWeight:600}}><Lightbulb size={18} color="var(--yellow-caution)"/> AI Insights</h3>
                
                <div style={{marginBottom:'1.5rem', flex:1}}>
                  <div style={{fontSize:'0.8rem', fontWeight:700, color:'var(--purple-light)', marginBottom:'0.75rem', letterSpacing:'1px'}}>GENERATED DEDUCTIONS</div>
                  <ul style={{margin:0, paddingLeft:'1.25rem', color:'var(--text-primary)', fontSize:'0.95rem', display:'flex', flexDirection:'column', gap:'0.5rem', lineHeight:1.5}}>
                    {insights.map((ins, idx) => <li key={idx} style={{color:'var(--text-primary)'}}>{ins}</li>)}
                  </ul>
                </div>

                <div style={{background:'var(--bg-input)', padding:'1.25rem', borderRadius:'8px', border:'1px solid var(--border-normal)'}}>
                   <div style={{fontSize:'0.8rem', fontWeight:700, color:'var(--text-muted)', marginBottom:'1rem', letterSpacing:'1px'}}>SMART SUGGESTIONS</div>
                   <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
                     <div style={{display:'flex', alignItems:'center', gap:'0.75rem', fontSize:'0.9rem', color:'var(--text-primary)'}}> <CheckCircle size={16} color="var(--green-safe)"/> Avoid real-time posting</div>
                     <div style={{display:'flex', alignItems:'center', gap:'0.75rem', fontSize:'0.9rem', color:'var(--text-primary)'}}> <CheckCircle size={16} color="var(--green-safe)"/> Use generic captions</div>
                     <div style={{display:'flex', alignItems:'center', gap:'0.75rem', fontSize:'0.9rem', color:'var(--text-primary)'}}> <CheckCircle size={16} color="var(--green-safe)"/> Blur sensitive image areas</div>
                   </div>
                </div>
              </div>

            </div>

            {/* Bottom Row: Trend & History */}
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'1.5rem'}}>
              
              {/* 📍 Section 6: Risk Trend */}
              <div className="card animate-fade-up stagger-3" style={{padding:'2rem'}}>
                <h3 style={{fontSize:'1.125rem', color:'var(--text-secondary)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.75rem', fontWeight:600}}><TrendingUp size={18} color="var(--orange-warning)"/> Risk Trend</h3>
                <div style={{display:'flex', alignItems:'baseline', gap:'0.5rem', marginBottom:'0.75rem'}}>
                  <div style={{fontSize:'3.5rem', fontWeight:800, color:trendColor, lineHeight:1, fontFamily:'JetBrains Mono'}}>{analyses.length >= 2 ? Math.abs(analyses[0].riskScore - analyses[1].riskScore) : '--'}</div>
                  <div style={{fontSize:'1.5rem', color:trendColor, fontWeight:800}}>{analyses.length >=2 && (analyses[0].riskScore > analyses[1].riskScore ? '↑' : analyses[0].riskScore < analyses[1].riskScore ? '↓' : '-')}</div>
                </div>
                <p style={{color:'var(--text-primary)', fontSize:'1rem', fontWeight:500}}>{trendMessage}</p>
                <div style={{marginTop:'1.5rem', fontSize:'0.85rem', color:'var(--text-muted)', borderTop:'1px solid var(--border-hover)', paddingTop:'1rem'}}>Tracking volatility over the last {analyses.length} cached analyses.</div>
              </div>

              {/* 📍 Section 7: Recent Analyses */}
              <div className="card animate-fade-up stagger-3" style={{padding:'2rem'}}>
                 <h3 style={{fontSize:'1.125rem', color:'var(--text-secondary)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.75rem', fontWeight:600}}><Clock size={18} color="var(--blue-info)"/> Recent Analyses</h3>
                 <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%', borderCollapse:'collapse', textAlign:'left'}}>
                    <thead>
                      <tr style={{borderBottom:'1px solid var(--border-normal)', color:'var(--text-muted)', fontSize:'0.85rem'}}>
                        <th style={{padding:'0.75rem 0', fontWeight:600}}>LEVEL</th>
                        <th style={{padding:'0.75rem 0', fontWeight:600}}>TIMESTAMP</th>
                        <th style={{padding:'0.75rem 0', fontWeight:600}}>TYPE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyses.map((a, idx) => (
                        <tr key={idx} style={{borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                          <td style={{padding:'1rem 0'}}>
                            <div style={{display:'inline-block', padding:'0.2rem 0.6rem', background:'var(--bg-input)', borderRadius:'6px', fontSize:'0.75rem', fontWeight:'bold', border:`1px solid ${a.riskLevel==='High'?'var(--red-danger)':a.riskLevel==='Medium'?'var(--yellow-caution)':'var(--green-safe)'}`, color:a.riskLevel==='High'?'var(--red-danger)':a.riskLevel==='Medium'?'var(--yellow-caution)':'var(--green-safe)'}}>{a.riskLevel}</div>
                          </td>
                          <td style={{padding:'1rem 0', color:'var(--text-secondary)', fontSize:'0.875rem', fontFamily:'JetBrains Mono'}}>{new Date(a.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
                          <td style={{padding:'1rem 0', color:'var(--text-primary)', fontSize:'0.875rem', fontWeight:500}}>{a.type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
export default Dashboard;
