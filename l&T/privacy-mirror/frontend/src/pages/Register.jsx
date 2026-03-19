import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Check, AlertTriangle } from 'lucide-react';
import api from '../api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password strength logic
  const [strength, setStrength] = useState(0); // 0-4
  useEffect(() => {
    let s = 0;
    if(password.length >= 8) s += 1;
    if(/[A-Z]/.test(password)) s += 1;
    if(/[0-9]/.test(password)) s += 1;
    if(/[^A-Za-z0-9]/.test(password)) s += 1;
    setStrength(password.length === 0 ? 0 : Math.max(1, s));
  }, [password]);

  const strengthColors = ['var(--border-normal)', 'var(--red-danger)', 'var(--orange-warning)', 'var(--yellow-caution)', 'var(--green-safe)'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Register form submitted:', { username, email }); // Log form data
    if(password !== confirmPassword) {
      setError("Passwords do not match"); return;
    }
    if(!agreed) {
      setError("Please agree to the privacy policy"); return;
    }

    setError('');
    setLoading(true);
    try {
      console.log('Sending POST request to /api/register...');
      const res = await api.post('/register', { username, email, password });
      console.log('Response received:', res.data);
      if (res.data.success) {
        alert("Registration successful! Redirecting to login...");
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display:'flex', minHeight:'calc(100vh - 70px)'}}>
      {/* Left Half same as login */}
      <div style={{flex:1, background:'var(--bg-secondary)', display:'flex', flexDirection:'column', justifyContent:'center', padding:'4rem'}} className="desktop-only">
        <div style={{maxWidth:'500px', margin:'0 auto'}}>
          <div style={{fontSize:'5rem', marginBottom:'1rem'}}>🪞</div>
          <h1 style={{fontSize:'3rem', fontWeight:800, marginBottom:'0.5rem'}}>Privacy Mirror</h1>
          <p style={{color:'var(--purple-light)', fontStyle:'italic', fontSize:'1.25rem', marginBottom:'2rem'}}>Start protecting your digital privacy today</p>
          <div style={{borderTop:'1px solid var(--border-normal)', marginBottom:'2rem', width:'50px'}}></div>
          <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
             <div style={{display:'flex', alignItems:'center', gap:'1rem', fontSize:'1.1rem'}}><span style={{color:'var(--green-safe)'}}>✅</span> Analyze your posts for hidden risks</div>
            <div style={{display:'flex', alignItems:'center', gap:'1rem', fontSize:'1.1rem'}}><span style={{color:'var(--green-safe)'}}>✅</span> See through a hacker's eyes</div>
            <div style={{display:'flex', alignItems:'center', gap:'1rem', fontSize:'1.1rem'}}><span style={{color:'var(--green-safe)'}}>✅</span> Zero data stored — 100% private</div>
          </div>
        </div>
      </div>

      {/* Right Half Form */}
      <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background:'var(--bg-main)'}}>
        <div className="card animate-fade-up" style={{width:'100%', maxWidth:'480px', padding:'2.5rem', borderColor:'var(--purple-dark)'}}>
          <h2 style={{fontSize:'2rem', marginBottom:'0.5rem', fontWeight:800}}>Create Your Account</h2>
          <p style={{color:'var(--text-secondary)', marginBottom:'2rem'}}>Start protecting your digital privacy today</p>
          
          <form onSubmit={handleRegister} style={{display:'flex', flexDirection:'column', gap:'1.25rem'}}>
            
            <div>
              <label style={{display:'block', marginBottom:'0.5rem', fontWeight:500}}>Username</label>
              <div style={{position:'relative'}}>
                <User style={{position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)'}} size={20} />
                <input 
                  type="text" 
                  required
                  placeholder="cooluser123"
                  className="input-field"
                  style={{paddingLeft:'3rem'}}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{display:'block', marginBottom:'0.5rem', fontWeight:500}}>Email Address</label>
              <div style={{position:'relative'}}>
                <Mail style={{position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)'}} size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="you@example.com"
                  className="input-field"
                  style={{paddingLeft:'3rem'}}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{display:'block', marginBottom:'0.5rem', fontWeight:500}}>Create Password</label>
              <div style={{position:'relative'}}>
                <Lock style={{position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)'}} size={20} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimum 8 characters"
                  className="input-field"
                  style={{paddingLeft:'3rem', paddingRight:'3rem'}}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{position:'absolute', right:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)'}}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* password strength */}
              {password.length > 0 && (
                <div style={{marginTop:'0.5rem'}}>
                  <div style={{display:'flex', gap:'4px', height:'4px', marginBottom:'0.25rem'}}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{flex:1, borderRadius:'2px', background: strength >= i ? strengthColors[strength] : 'var(--border-normal)', transition:'all 0.3s'}}></div>
                    ))}
                  </div>
                  <div style={{fontSize:'0.75rem', color: strengthColors[strength], textAlign:'right', fontWeight:600}}>
                    {strengthLabels[strength]}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label style={{display:'block', marginBottom:'0.5rem', fontWeight:500}}>Confirm Password</label>
              <div style={{position:'relative'}}>
                <Lock style={{position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)'}} size={20} />
                <input 
                  type="password"
                  required
                  placeholder="Repeat your password"
                  className="input-field"
                  style={{paddingLeft:'3rem', paddingRight:'3rem'}}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                {confirmPassword && confirmPassword === password && (
                  <Check style={{position:'absolute', right:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--green-safe)'}} size={20} />
                )}
              </div>
            </div>

            <label style={{display:'flex', gap:'0.75rem', alignItems:'flex-start', cursor:'pointer', marginTop:'0.5rem'}}>
              <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:'0.25rem', width:'18px', height:'18px', accentColor:'var(--purple-primary)'}} />
              <span style={{color:'var(--text-secondary)', fontSize:'0.9rem', lineHeight:1.4}}>
                I understand my data is never stored permanently and is deleted after analysis.
              </span>
            </label>

            {error && (
              <div className="animate-fade-up" style={{background:'var(--red-glow)', padding:'1rem', borderRadius:'8px', display:'flex', alignItems:'center', gap:'0.5rem', color:'var(--red-danger)', fontSize:'0.875rem', border:'1px solid var(--red-danger)'}}>
                <AlertTriangle size={18} /> {error}
              </div>
            )}

            <button type="submit" disabled={loading || !agreed || password !== confirmPassword} className="btn-primary" style={{width:'100%', padding:'1rem', fontSize:'1.1rem', marginTop:'0.5rem'}}>
              {loading ? <div className="animate-spin" style={{width: 20, height: 20, borderTop: '2px solid white', borderRadius: '50%'}}></div> : 'Create My Account'}
            </button>
          </form>

          <div style={{textAlign:'center', color:'var(--text-secondary)', marginTop:'2rem'}}>
            Already have an account? <Link to="/login" style={{color:'var(--purple-light)', fontWeight:600}}>Login here</Link>
          </div>
        </div>
      </div>
      
      <style>{`@media (max-width: 768px) { .desktop-only { display: none !important; } }`}</style>
    </div>
  );
};
export default Register;
