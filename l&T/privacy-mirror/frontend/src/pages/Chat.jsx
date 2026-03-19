import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, ShieldAlert } from 'lucide-react';
import api from '../api';

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "👋 Hi! I am your AI Privacy Advisor.\nPaste any post, image caption, or ask me anything about staying safe online. I will analyze it and tell you exactly what is risky and how to fix it."}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "🔍 Check this post for risks",
    "📸 Is this caption safe to post?",
    "🕒 What routine am I revealing?",
    "📍 Am I sharing my location?",
    "🔐 How can I improve my privacy?"
  ];

  const suggestedReplies = ["Tell me more", "How do I fix this?", "Show safe version"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (text) => {
    const msg = text || input;
    if(!msg.trim()) return;
    
    setInput('');
    const newHistory = [...messages, { role: 'user', content: msg }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await api.post('/chat', { message: msg, history: newHistory.filter(m => m.role !== 'system') });
      setMessages([...newHistory, { role: 'assistant', content: res.data.reply }]);
    } catch(err) {
      setMessages([...newHistory, { role: 'assistant', content: '❌ Sorry, I encountered an error connecting to the server.' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="container" style={{display:'flex', height:'calc(100vh - 70px)', padding:'2rem 0', gap:'2rem'}}>
      
      {/* Left Sidebar */}
      <div style={{width:'240px', display: window.innerWidth > 768 ? 'flex' : 'none', flexDirection:'column', gap:'1.5rem'}} className="desktop-only">
        <h3 style={{fontSize:'1.1rem', fontWeight:600}}>Quick Actions</h3>
        <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
          {quickPrompts.map((p, i) => (
            <button key={i} onClick={() => setInput(p)} style={{textAlign:'left', padding:'0.75rem', background:'var(--bg-input)', border:'1px solid var(--border-normal)', borderRadius:'8px', fontSize:'0.875rem', color:'var(--text-secondary)', transition:'all 0.2s'}} onMouseOver={e=>e.currentTarget.style.borderColor='var(--purple-primary)'} onMouseOut={e=>e.currentTarget.style.borderColor='var(--border-normal)'}>
              {p}
            </button>
          ))}
        </div>

        <div style={{marginTop:'auto', background:'rgba(99, 102, 241, 0.05)', border:'1px solid var(--purple-glow)', padding:'1.25rem', borderRadius:'8px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'0.5rem', color:'var(--purple-light)', marginBottom:'0.75rem', fontWeight:600}}>
            <ShieldAlert size={18} /> Tip of the Day
          </div>
          <div style={{fontSize:'0.875rem', color:'var(--text-secondary)', lineHeight:1.5}}>
             Vague captions like "Out today!" are always safer than specific locations. Wait until you get home to post.
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="card animate-fade-up" style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
        
        {/* Chat Header */}
        <div style={{padding:'1rem 1.5rem', borderBottom:'1px solid var(--border-normal)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--bg-secondary)'}}>
           <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
             <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'var(--purple-dark)', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>
               <Bot size={24} />
             </div>
             <div>
               <div style={{fontWeight:600}}>Privacy Advisor</div>
               <div style={{fontSize:'0.75rem', color:'var(--green-safe)', display:'flex', alignItems:'center', gap:'0.25rem'}}>
                 <div style={{width:'6px', height:'6px', borderRadius:'50%', background:'var(--green-safe)'}}></div> Online
               </div>
             </div>
           </div>
           
           <button onClick={clearChat} className="btn-outline" style={{padding:'0.5rem 1rem', fontSize:'0.875rem'}}>
             <Trash2 size={16} /> Clear
           </button>
        </div>

        {/* Messages */}
        <div style={{flex:1, overflowY:'auto', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.5rem'}}>
          {messages.map((m, i) => (
             <div key={i} className="animate-fade-up" style={{display:'flex', gap:'1rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth:'80%', flexDirection: m.role === 'user' ? 'row-reverse' : 'row'}}>
               <div style={{width:'36px', height:'36px', flexShrink:0, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: m.role==='user'?'var(--bg-input)':'var(--purple-dark)', color: m.role==='user'?'var(--text-muted)':'white'}}>
                 {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
               </div>
               <div style={{padding:'1rem 1.25rem', borderRadius:'12px', lineHeight:1.5, background: m.role === 'user' ? 'var(--purple-glow)' : 'var(--bg-card)', border: `1px solid ${m.role === 'user' ? 'var(--purple-primary)' : 'var(--border-normal)'}`, color: 'var(--text-primary)', whiteSpace:'pre-wrap'}}>
                 {m.content}
               </div>
             </div>
          ))}
          
          {loading && (
             <div style={{display:'flex', gap:'1rem', alignSelf:'flex-start'}}>
               <div style={{width:'36px', height:'36px', flexShrink:0, borderRadius:'50%', background:'var(--purple-dark)', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}><Bot size={20} /></div>
               <div style={{padding:'1.25rem', borderRadius:'12px', background:'var(--bg-card)', border:'1px solid var(--border-normal)', display:'flex', gap:'0.3rem'}}>
                 <div className="animate-spin" style={{width: 8, height: 8, background: 'var(--text-muted)', borderRadius: '50%'}}></div>
                 <div className="animate-spin stagger-1" style={{width: 8, height: 8, background: 'var(--text-muted)', borderRadius: '50%'}}></div>
                 <div className="animate-spin stagger-2" style={{width: 8, height: 8, background: 'var(--text-muted)', borderRadius: '50%'}}></div>
                 <style>{`@keyframes spin { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }`}</style>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{padding:'1rem 1.5rem', background:'var(--bg-secondary)', borderTop:'1px solid var(--border-normal)'}}>
          
          {messages.length > 1 && !loading && messages[messages.length-1].role === 'assistant' && (
            <div style={{display:'flex', gap:'0.5rem', marginBottom:'1rem'}}>
              {suggestedReplies.map((r, i) => (
                <button key={i} onClick={() => handleSend(r)} style={{padding:'0.4rem 0.8rem', background:'var(--bg-input)', border:'1px solid var(--border-normal)', borderRadius:'999px', fontSize:'0.75rem', color:'var(--text-secondary)'}}>
                  {r}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={e => {e.preventDefault(); handleSend();}} style={{display:'flex', gap:'1rem'}}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Type a post or ask a privacy question..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{flex:1}}
            />
            <button type="submit" disabled={!input.trim() || loading} className="btn-primary" style={{padding:'0 1.5rem'}}>
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Right Sidebar */}
      <div style={{width:'240px', display: window.innerWidth > 1024 ? 'flex' : 'none', flexDirection:'column', gap:'1.5rem'}} className="desktop-only">
        <h3 style={{fontSize:'1.1rem', fontWeight:600}}>Session Status</h3>
        <div className="card" style={{padding:'1.25rem', fontSize:'0.875rem', color:'var(--text-secondary)'}}>
          <div style={{display:'flex', alignItems:'center', gap:'0.5rem', color:'var(--text-primary)', marginBottom:'0.5rem', fontWeight:600}}>
            🔒 Your chat is private
          </div>
          Session history is deleted automatically when you close this tab.
        </div>
        
        {messages.length > 3 && (
        <div className="animate-fade-up">
          <h4 style={{fontSize:'0.9rem', color:'var(--text-muted)', marginBottom:'0.75rem', textTransform:'uppercase'}}>Topics Detected</h4>
          <div style={{display:'flex', flexWrap:'wrap', gap:'0.5rem'}}>
            <span style={{padding:'0.25rem 0.75rem', background:'var(--red-glow)', color:'var(--red-danger)', borderRadius:'999px', fontSize:'0.75rem', fontWeight:600, border:'1px solid var(--red-danger)'}}>📍 Location</span>
            <span style={{padding:'0.25rem 0.75rem', background:'var(--orange-warning)', color:'#000', borderRadius:'999px', fontSize:'0.75rem', fontWeight:600}}>🕒 Routine</span>
          </div>
        </div>
        )}
      </div>
      <style>{`@media (max-width: 1024px) { .desktop-only { display: none !important; } }`}</style>
    </div>
  );
};
export default Chat;
