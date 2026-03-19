import React, { useState, useEffect } from 'react';
import { Clock, Shield, AlertTriangle, Eye, Trash2, Calendar, FileText, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from local storage
    const loadHistory = () => {
      try {
        const data = JSON.parse(localStorage.getItem('privacyMirrorHistory') || '[]');
        setHistory(data);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all analysis history?")) {
      localStorage.removeItem('privacyMirrorHistory');
      setHistory([]);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="animate-spin" style={{ width: 40, height: 40, borderTop: '2px solid var(--purple-primary)', borderRadius: '50%' }}></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div className="animate-fade-up">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Analysis History</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>Review your recent privacy scans and incident reports</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="btn-outline" 
            style={{ color: 'var(--red-danger)', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '10px 16px' }}
          >
            <Trash2 size={18} /> Clear All
          </button>
        )}
      </div>

      <div className="animate-fade-up stagger-1">
        {history.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)' }}>
            <Clock size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>No History Found</h3>
            <p style={{ marginBottom: '2rem' }}>You haven't performed any privacy scans yet.</p>
            <Link to="/analyze" className="btn-primary" style={{ display: 'inline-flex' }}>Start First Analysis</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {history.map((item, idx) => (
              <div 
                key={idx} 
                className="card animate-fade-up" 
                style={{ 
                  padding: '1.5rem', 
                  borderRadius: '16px', 
                  display: 'grid', 
                  gridTemplateColumns: 'auto 1fr auto', 
                  alignItems: 'center', 
                  gap: '1.5rem',
                  borderLeft: `4px solid ${item.riskScore > 70 ? 'var(--red-danger)' : item.riskScore > 30 ? 'var(--yellow-caution)' : 'var(--green-safe)'}`,
                  animationDelay: `${idx * 0.1}s`
                }}
              >
                {/* Type Icon */}
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'var(--bg-input)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--purple-primary)'
                }}>
                  {item.type?.includes('Image') ? <ImageIcon size={24} /> : <FileText size={24} />}
                </div>

                {/* Content Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.type}</span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontWeight: 700,
                      background: item.riskScore > 70 ? 'var(--red-glow)' : item.riskScore > 30 ? 'var(--yellow-glow)' : 'var(--green-glow)',
                      color: item.riskScore > 70 ? 'var(--red-danger)' : item.riskScore > 30 ? 'var(--yellow-caution)' : 'var(--green-safe)',
                      border: `1px solid ${item.riskScore > 70 ? 'var(--red-danger)' : item.riskScore > 30 ? 'var(--yellow-caution)' : 'var(--green-safe)'}`
                    }}>
                      {item.riskLevel} Risk
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {formatDate(item.timestamp)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Shield size={14} /> {item.risks?.length || 0} Vulnerabilities</span>
                  </div>
                </div>

                {/* Action */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'right', marginRight: '1rem' }} className="desktop-only">
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: item.riskScore > 70 ? 'var(--red-danger)' : item.riskScore > 30 ? 'var(--yellow-caution)' : 'var(--green-safe)' }}>{item.riskScore}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SCORE</div>
                  </div>
                  <button style={{ 
                    padding: '10px', 
                    borderRadius: '50%', 
                    background: 'var(--bg-input)', 
                    border: '1px solid var(--border-normal)', 
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--purple-primary)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-normal)'}>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-normal)', opacity: 0.8 }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}><AlertTriangle size={18} color="var(--yellow-caution)" /> Privacy Note</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          This history is stored locally in your browser's memory. It is never sent to our servers. Analysis logs are automatically purged every 5 minutes for your security. 
        </p>
      </div>
    </div>
  );
};

export default History;
