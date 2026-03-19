import React, { useState } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import api from '../api';

const ImageAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  const handleUpload = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
    }
  };

  const loadSample = (type) => {
    alert(`This would normally load a predefined ${type} image for demonstration.`);
  };

  const handleAnalyze = async () => {
    if(!file) return;
    setLoading(true);
    setAnimatedScore(0);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await api.post('/image', formData, {headers: {'Content-Type': 'multipart/form-data'}});
      setResult(res.data);
      
      await api.post('/save', {
        type: 'image',
        input_preview: file.name,
        risk_score: res.data.risk_score,
        safe_version: res.data.recommendations?.join(', ') || ''
      }).catch(e => console.error(e));

      // Animate score
      let curr = 0;
      const t = setInterval(() => {
        curr += 2;
        if(curr >= res.data.risk_score) {
           setAnimatedScore(res.data.risk_score);
           clearInterval(t);
        } else setAnimatedScore(curr);
      }, 20);

    } catch(err) {
      console.error(err);
      alert('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{paddingTop:'4rem', paddingBottom:'6rem'}}>
      <div className="animate-fade-up" style={{textAlign:'center', marginBottom:'4rem'}}>
        <h1 style={{fontSize:'2.5rem', fontWeight:800, marginBottom:'0.5rem'}}>Image Privacy Analyzer</h1>
        <p style={{color:'var(--text-secondary)', fontSize:'1.125rem'}}>We see what your eyes miss</p>
      </div>

      <div style={{display:'flex', gap:'2rem', flexWrap:'wrap', alignItems:'flex-start'}}>
        {/* Left - Upload */}
        <div className="card animate-fade-up stagger-1" style={{flex:'1 1 40%', padding:'2rem', minWidth:'300px'}}>
           <div style={{border:'2px dashed var(--purple-primary)', borderRadius:'12px', padding:'3rem 1rem', textAlign:'center', cursor:'pointer', position:'relative', transition:'all 0.3s', background: preview ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-card)'}}>
              <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleUpload} style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0, cursor:'pointer', zIndex:10}} />
              
              {!preview ? (
                <>
                  <Camera size={48} color="var(--purple-light)" style={{marginBottom:'1rem', opacity:0.8, margin:'0 auto'}} />
                  <h3 style={{fontSize:'1.25rem', marginBottom:'0.5rem'}}>Upload Your Photo</h3>
                  <div style={{color:'var(--text-muted)'}}>Drop image here or click to browse</div>
                  <div style={{fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.5rem'}}>Accepts JPG, PNG, WEBP</div>
                </>
              ) : (
                <div style={{position:'relative', zIndex:5}}>
                  <img src={preview} alt="Upload preview" style={{maxHeight:'300px', maxWidth:'100%', objectFit:'contain', borderRadius:'8px', marginBottom:'1rem'}} />
                  <div style={{color:'var(--text-secondary)', fontWeight:500}}>{file.name}</div>
                  <div style={{color:'var(--text-muted)', fontSize:'0.875rem'}}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              )}
           </div>

           {preview && (
              <button className="btn-primary" onClick={handleAnalyze} disabled={loading} style={{width:'100%', marginTop:'1.5rem', padding:'1rem', fontSize:'1.1rem'}}>
                {loading ? <div className="animate-spin" style={{width: 20, height: 20, borderTop: '2px solid white', borderRadius: '50%'}}></div> : 'Analyze This Image'}
              </button>
           )}

           <div style={{marginTop:'2rem', display:'flex', flexDirection:'column', gap:'0.75rem'}}>
             <div style={{color:'var(--text-secondary)', fontSize:'0.875rem'}}>Try a sample:</div>
             <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
               <button className="btn-outline" onClick={()=>loadSample('House')} style={{padding:'0.5rem 1rem', fontSize:'0.875rem'}}>House Photo</button>
               <button className="btn-outline" onClick={()=>loadSample('Selfie')} style={{padding:'0.5rem 1rem', fontSize:'0.875rem'}}>Street Selfie</button>
               <button className="btn-outline" onClick={()=>loadSample('QR')} style={{padding:'0.5rem 1rem', fontSize:'0.875rem'}}>QR Code Test</button>
             </div>
           </div>
        </div>

        {/* Right - Results */}
        <div style={{flex:'1 1 50%', minWidth:'300px'}}>
           {!result && !loading && (
             <div className="card animate-fade-up stagger-2" style={{height:'100%', minHeight:'400px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'3rem', color:'var(--text-muted)'}}>
               <img src="https://via.placeholder.com/150/0a0a0f/9090a8?text=%F0%9F%93%B7" alt="placeholder" style={{opacity:0.2, marginBottom:'1rem'}} />
               <p>Upload a photo to see privacy detections.</p>
             </div>
           )}

           {loading && (
             <div className="card" style={{height:'100%', minHeight:'400px', position:'relative', overflow:'hidden', padding:'2rem', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
               <div style={{position:'absolute', top:0, left:0, width:'100%', height:'4px', background:'var(--purple-primary)', animation:'scan 2s linear infinite'}} />
               <style>{`@keyframes scan { 0% { top: 0; } 100% { top: 100%; } }`}</style>
               <Search size={48} color="var(--purple-light)" className="animate-pulse" style={{marginBottom:'1rem'}} />
               <h3 className="animate-pulse" style={{color:'var(--purple-light)'}}>Scanning image for privacy risks...</h3>
             </div>
           )}

           {result && (
             <div className="animate-fade-up flex-col" style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
               <div className="card" style={{padding:'2rem'}}>
                 <h2 style={{fontSize:'1.25rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><AlertTriangle size={20} color="var(--red-danger)"/> What We Found In Your Image</h2>
                 
                 <div style={{display:'flex', flexDirection:'column', gap:'1rem', marginBottom:'2rem'}}>
                   {result.detections?.map((d, i) => (
                     <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem', background:'var(--bg-input)', borderRadius:'8px', border:'1px solid var(--border-normal)'}}>
                       <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
                         <div style={{width:'32px', height:'32px', background:'rgba(255,255,255,0.05)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>🕵️</div>
                         <div>
                           <div style={{fontWeight:600}}>{d.category}</div>
                           <div style={{fontSize:'0.875rem', color:'var(--text-secondary)'}}>{d.value}</div>
                         </div>
                       </div>
                       <div style={{padding:'0.25rem 0.75rem', fontSize:'0.75rem', fontWeight:'bold', borderRadius:'999px', background: d.risk.includes('HIGH') ? 'var(--red-danger)' : 'var(--yellow-caution)', color: d.risk.includes('HIGH') ? 'white' : '#000'}}>
                         {d.risk}
                       </div>
                     </div>
                   ))}
                 </div>

                 <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.5rem', background:'var(--bg-main)', borderRadius:'8px', marginTop:'1rem', border:`1px solid ${result.risk_score >= 70 ? 'var(--red-danger)' : 'var(--yellow-caution)'}`}}>
                   <div>
                     <div style={{fontWeight:600, color:'var(--text-secondary)', marginBottom:'0.25rem'}}>OVERALL IMAGE RISK</div>
                     <div style={{fontSize:'0.875rem', color:'var(--text-muted)'}}>Issues found: {result.detections.length}</div>
                   </div>
                   <div style={{fontSize:'2.5rem', fontWeight:800, fontFamily:'JetBrains Mono', color: result.risk_score >= 70 ? 'var(--red-danger)' : 'var(--yellow-caution)'}}>
                     {animatedScore} <span style={{fontSize:'1rem', color:'var(--text-muted)'}}>/ 100</span>
                   </div>
                 </div>
               </div>

               <div className="card" style={{padding:'2rem', borderTop:'4px solid var(--green-safe)'}}>
                 <h2 style={{fontSize:'1.25rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem', color:'var(--green-safe)'}}><CheckCircle size={20}/> How To Fix Before Posting</h2>
                 <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                   {result.recommendations?.map((rec, i) => (
                     <div key={i} style={{padding:'1rem', background:'rgba(16, 185, 129, 0.1)', borderLeft:'3px solid var(--green-safe)', borderRadius:'4px', color:'var(--text-primary)'}}>
                       {rec}
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
export default ImageAnalyzer;
