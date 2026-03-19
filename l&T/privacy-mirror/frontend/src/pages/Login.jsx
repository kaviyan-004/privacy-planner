import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import api from '../api';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Hardcoded demo authentication
    setTimeout(() => {
      if (email === 'student@srcas' && password === 'student') {
        setUser({ username: 'student', email: 'student@srcas', avatar_color: 'var(--purple-primary)' });
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please use student@srcas / student');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{display:'flex', minHeight:'calc(100vh - 70px)'}}>
      {/* Left Half */}
      <div style={{flex:1, background:'var(--bg-secondary)', display:'flex', flexDirection:'column', justifyContent:'center', padding:'4rem'}} className="desktop-only">
        <div style={{maxWidth:'500px', margin:'0 auto'}}>
          <div style={{fontSize:'5rem', marginBottom:'1rem'}}>🪞</div>
          <h1 style={{fontSize:'3rem', fontWeight:800, marginBottom:'0.5rem'}}>Privacy Mirror</h1>
          <p style={{color:'var(--purple-light)', fontStyle:'italic', fontSize:'1.25rem', marginBottom:'2rem'}}>See what the internet sees about you</p>
          <div style={{borderTop:'1px solid var(--border-normal)', marginBottom:'2rem', width:'50px'}}></div>
          <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
            <div style={{display:'flex', alignItems:'center', gap:'1rem', fontSize:'1.1rem'}}><span style={{color:'var(--green-safe)'}}>✅</span> Analyze your posts for hidden risks</div>
            <div style={{display:'flex', alignItems:'center', gap:'1rem', fontSize:'1.1rem'}}><span style={{color:'var(--green-safe)'}}>✅</span> See through a hacker's eyes</div>
            <div style={{display:'flex', alignItems:'center', gap:'1rem', fontSize:'1.1rem'}}><span style={{color:'var(--green-safe)'}}>✅</span> Zero data stored — 100% private</div>
          </div>
          <div style={{marginTop:'3rem', color:'var(--text-secondary)'}}>
            Don't have an account? <Link to="/register" style={{color:'var(--purple-light)'}}>Register here →</Link>
          </div>
        </div>
      </div>

      {/* Right Half Form */}
      <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background:'var(--bg-main)'}}>
        <div className="card animate-fade-up" style={{width:'100%', maxWidth:'480px', padding:'2.5rem', borderColor:'var(--purple-dark)'}}>
          <h2 style={{fontSize:'2rem', marginBottom:'0.5rem', fontWeight:800}}>Welcome Back</h2>
          <p style={{color:'var(--text-secondary)', marginBottom:'2rem'}}>Log in to your Privacy Mirror account</p>
          
          <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
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
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.5rem'}}>
                <label style={{fontWeight:500}}>Password</label>
                <Link to="#" style={{color:'var(--purple-light)', fontSize:'0.875rem'}}>Forgot password?</Link>
              </div>
              <div style={{position:'relative'}}>
                <Lock style={{position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)'}} size={20} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  className="input-field"
                  style={{paddingLeft:'3rem', paddingRight:'3rem'}}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{position:'absolute', right:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)'}}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="animate-fade-up" style={{background:'var(--red-glow)', padding:'1rem', borderRadius:'8px', display:'flex', alignItems:'center', gap:'0.5rem', color:'var(--red-danger)', fontSize:'0.875rem', border:'1px solid var(--red-danger)'}}>
                <AlertTriangle size={18} /> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary" style={{width:'100%', padding:'1rem', fontSize:'1.1rem', marginTop:'0.5rem'}}>
              {loading ? <div className="animate-spin" style={{width: 20, height: 20, borderTop: '2px solid white', borderRadius: '50%'}}></div> : 'Login to Privacy Mirror'}
            </button>
          </form>

          <div style={{display:'flex', alignItems:'center', margin:'2rem 0', color:'var(--text-muted)'}}>
            <div style={{flex:1, height:'1px', background:'var(--border-normal)'}}></div>
            <span style={{padding:'0 1rem', fontSize:'0.875rem', fontWeight:600}}>OR</span>
            <div style={{flex:1, height:'1px', background:'var(--border-normal)'}}></div>
          </div>

          <div style={{textAlign:'center', color:'var(--text-secondary)'}}>
            Don't have an account? <Link to="/register" style={{color:'var(--purple-light)', fontWeight:600}}>Register here</Link>
          </div>
        </div>
      </div>
      
      <style>{`@media (max-width: 768px) { .desktop-only { display: none !important; } }`}</style>
    </div>
  );
};
export default Login;
