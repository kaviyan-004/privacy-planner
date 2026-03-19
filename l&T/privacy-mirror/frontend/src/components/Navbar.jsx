import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import api from '../api';
import logo from '../pages/icon/webicon.jpeg';

const Navbar = ({ user, setUser }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      setUser(null);
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { name: 'Analysis', path: '/analyze' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Chatbot', path: '/chat' },
    { name: 'History', path: '/history' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <>
      <button 
        className="mobile-toggle" 
        style={{
          position: 'fixed', top: '15px', left: '15px', zIndex: 60, display: 'none',
          background: 'var(--bg-card)', border: '1px solid var(--border-normal)',
          borderRadius: '8px', padding: '8px', color: 'var(--text-primary)',
          cursor: 'pointer'
        }} 
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu />
      </button>

      {mobileOpen && (
        <div 
          className="mobile-overlay"
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.5)', zIndex: 45, display: 'none'
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <nav className={`sidebar ${mobileOpen ? 'open' : ''}`} style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', width: '240px', 
        zIndex: 50, background: 'var(--bg-sidebar)',
        backdropFilter: 'blur(12px)', borderRight: '1px solid var(--border-normal)',
        display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease'
      }}>
        {/* Brand Desktop Center Logo */}
        <div style={{padding:'1.5rem', marginBottom:'24px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderBottom: '1px solid var(--border-normal)'}}>
          <Link to="/dashboard" style={{display:'block', textDecoration:'none', width:'100%', textAlign:'center'}}>
            <img 
              src={logo} 
              alt="Privacy Mirror Logo" 
              style={{
                width: '120px', 
                height: 'auto', 
                margin: '20px auto',
                display: 'block',
                borderRadius: '12px',
                maxWidth: '100%',
                objectFit: 'contain'
              }} 
            />
          </Link>
          <button className="mobile-toggle" style={{display:'none'}} onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div style={{flex: 1, padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto'}}>
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} style={{
              margin: '0 15px', padding: '12px 16px', borderRadius: '8px', fontSize: '1rem', fontWeight: 500,
              color: location.pathname === link.path ? 'var(--purple-primary)' : 'var(--text-secondary)',
              background: location.pathname === link.path ? 'var(--purple-glow)' : 'transparent',
              display: 'flex', alignItems: 'center', transition: 'all 0.2s'
            }}>
              {link.name}
            </Link>
          ))}
        </div>

        <div style={{padding: '20px', borderTop: '1px solid var(--border-normal)', display: 'flex', flexDirection: 'column', gap: '10px'}}>
          {!user ? (
            <>
              <Link to="/login" className="btn-outline" style={{width: '100%', textAlign: 'center'}} onClick={()=>setMobileOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary" style={{width: '100%', textAlign: 'center'}} onClick={()=>setMobileOpen(false)}>Register</Link>
            </>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'10px', paddingBottom: '10px', borderBottom: '1px solid var(--border-normal)'}}>
                <div style={{width:'36px', height:'36px', borderRadius:'50%', backgroundColor: user.avatar_color, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold', flexShrink: 0}}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                  <span style={{fontWeight:500, display: 'block'}}>{user.username}</span>
                </div>
              </div>
              <button onClick={() => {handleLogout(); setMobileOpen(false);}} style={{padding:'8px 0', color:'var(--red-danger)', textAlign:'left'}}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
          .mobile-toggle { display: block !important; }
          .mobile-overlay { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-toggle { display: none !important; }
          .mobile-overlay { display: none !important; }
        }
      `}</style>
    </>
  );
};
export default Navbar;
