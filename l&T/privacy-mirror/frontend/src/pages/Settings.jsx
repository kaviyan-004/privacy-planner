import React, { useState } from 'react';
import { User, Shield, Bell, Eye, Palette, Trash2, CheckCircle, Save } from 'lucide-react';

const Settings = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [settings, setSettings] = useState({
    username: user?.username || 'student',
    email: user?.email || 'student@srcas',
    dataRetention: '300', // 5 mins in seconds
    autoDelete: true,
    notifications: true,
    accentColor: '#8B5CF6',
    mockAuth: true
  });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'privacy', label: 'Privacy & Data', icon: <Shield size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <div className="animate-fade-up" style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Global Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>Manage your account preferences and privacy controls</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Navigation Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid transparent',
                background: activeTab === tab.id ? 'var(--purple-glow)' : 'transparent',
                color: activeTab === tab.id ? 'var(--purple-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? 600 : 500,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderColor: activeTab === tab.id ? 'var(--purple-light)' : 'transparent'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="card animate-fade-up" style={{ padding: '2rem', borderRadius: '20px', minHeight: '500px' }}>
          {activeTab === 'profile' && (
            <div className="animate-fade-up">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={24} color="var(--purple-primary)" /> Profile Information
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem', background: 'var(--bg-input)', borderRadius: '12px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: user?.avatar_color || 'var(--purple-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 800 }}>
                    {settings.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{settings.username}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Member since March 2026</div>
                    <button style={{ color: 'var(--purple-light)', fontSize: '0.875rem', marginTop: '4px', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>Change Avatar</button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Display Name</label>
                    <input className="input-field" value={settings.username} onChange={e => setSettings({...settings, username: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Email Address</label>
                    <input className="input-field" value={settings.email} disabled style={{ opacity: 0.6 }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="animate-fade-up">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={24} color="var(--purple-primary)" /> Privacy Controls
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-normal)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>Automatic Data Deletion</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Permanently wipe analysis history after defined period.</div>
                  </div>
                  <input type="checkbox" checked={settings.autoDelete} onChange={e => setSettings({...settings, autoDelete: e.target.checked})} style={{ width: '20px', height: '20px', accentColor: 'var(--purple-primary)' }} />
                </div>

                <div style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-normal)' }}>
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>Data Retention Period</label>
                  <select 
                    className="input-field" 
                    value={settings.dataRetention} 
                    onChange={e => setSettings({...settings, dataRetention: e.target.value})}
                    style={{ background: 'var(--bg-card)' }}
                  >
                    <option value="60">1 Minute</option>
                    <option value="300">5 Minutes (Recommended)</option>
                    <option value="3600">1 Hour</option>
                    <option value="0">Never (Risky)</option>
                  </select>
                </div>

                <button style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--red-danger)', borderRadius: '12px', color: 'var(--red-danger)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <Trash2 size={18} /> Clear All Current History
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="animate-fade-up">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Palette size={24} color="var(--purple-primary)" /> Appearance
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}>System Theme</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '2px solid var(--purple-primary)', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌑</div>
                      <div style={{ fontWeight: 600 }}>Neon Dark (Default)</div>
                    </div>
                    <div style={{ padding: '1.5rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid var(--border-normal)', textAlign: 'center', color: '#1e293b', opacity: 0.5 }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>☀️</div>
                      <div style={{ fontWeight: 600 }}>Clean Light (Coming Soon)</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}>Accent Color</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {['#8B5CF6', '#10B981', '#3B82F6', '#EF4444', '#F59E0B'].map(color => (
                      <div 
                        key={color} 
                        onClick={() => setSettings({...settings, accentColor: color})}
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          background: color, 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: settings.accentColor === color ? '3px solid white' : 'none',
                          boxShadow: settings.accentColor === color ? '0 0 10px '+color : 'none'
                        }}
                      >
                        {settings.accentColor === color && <CheckCircle size={20} color="white" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-fade-up">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={24} color="var(--purple-primary)" /> Notifications
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-normal)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>Real-time Risk Alerts</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Get notified when a new post analysis reveals high risk.</div>
                  </div>
                  <input type="checkbox" checked={settings.notifications} onChange={e => setSettings({...settings, notifications: e.target.checked})} style={{ width: '20px', height: '20px', accentColor: 'var(--purple-primary)' }} />
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border-normal)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            {success && <div style={{ color: 'var(--green-safe)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><CheckCircle size={18} /> Settings saved successfully</div>}
            <button 
              onClick={handleSave} 
              disabled={loading}
              className="btn-primary" 
              style={{ padding: '12px 24px', borderRadius: '10px', fontSize: '1rem' }}
            >
              {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
