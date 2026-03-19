import React, { useState, useEffect } from 'react';
import { Upload, Search, ShieldAlert, Terminal, Edit3, BarChart2, CheckCircle } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend,
} from 'chart.js';
import api from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const Analyze = () => {
  const [postText, setPostText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Terminal state
  const [terminalLines, setTerminalLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const [imagePreview, setImagePreview] = useState(null);

  const handleFileUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      setFile(f);
      setImagePreview(URL.createObjectURL(f));
    }
  };

  const handleReset = () => {
    setPostText('');
    setFile(null);
    setImagePreview(null);
    setResult(null);
    setTerminalLines([]);
    setCurrentLineIndex(0);
    setAnimatedScore(0);
  };

  const analyzePostLocal = (text, hasFile) => {
    const lower = text ? text.toLowerCase() : '';

    // 2. CAPTION ANALYZER
    const locations = ['goa', 'chennai', 'pondicherry', 'delhi', 'mumbai'];
    const timeWords = ['tomorrow', 'today'];
    const travelWords = ['staying', 'going', 'travel'];
    const personalWords = ['alone', 'home', 'house'];

    let detectedLocations = [];
    let detectedTimes = [];
    let detectedTravel = [];
    let detectedPersonal = [];

    locations.forEach(loc => { if (new RegExp(`\\b${loc}\\b`, 'i').test(lower)) detectedLocations.push(loc); });
    timeWords.forEach(t => { if (new RegExp(`\\b${t}\\b`, 'i').test(lower)) detectedTimes.push(t); });
    travelWords.forEach(tr => { if (new RegExp(`\\b${tr}\\b`, 'i').test(lower)) detectedTravel.push(tr); });
    personalWords.forEach(p => { if (new RegExp(`\\b${p}\\b`, 'i').test(lower)) detectedPersonal.push(p); });

    let riskScore = 0;
    let terminalLines = [];
    let hackerSteps = [];
    let removedItems = [];

    terminalLines.push("> INIT privacy_scanner v2.4");
    if (hasFile) {
      terminalLines.push("[*] Analyzing image metadata...");
      terminalLines.push("THREAT: EXIF GPS data found");
      terminalLines.push("[*] Scanning image content...");
      terminalLines.push("THREAT: Possible personal items detected");
      riskScore += 30;
    }
    if (text) terminalLines.push("[*] Processing text payload...");

    // 4. RISK SCORE ENGINE
    if (detectedLocations.length > 0) {
      riskScore += 40;
      removedItems.push(...detectedLocations);
      terminalLines.push(`THREAT: Location match [${detectedLocations[0]}]`);
    }
    if (detectedTimes.length > 0) {
      riskScore += 20;
      removedItems.push(...detectedTimes);
      terminalLines.push(`THREAT: Temporal marker [${detectedTimes[0]}]`);
    }
    if (detectedTravel.length > 0) {
      riskScore += 20;
      removedItems.push(...detectedTravel);
      terminalLines.push(`THREAT: Travel intent [${detectedTravel[0]}]`);
    }
    if (detectedPersonal.length > 0) {
      riskScore += 20;
      removedItems.push(...detectedPersonal);
      terminalLines.push(`THREAT: Vulnerability status [${detectedPersonal[0]}]`);
    }

    riskScore = Math.min(riskScore, 100);
    terminalLines.push(`> CALC_RISK: risk_score = ${riskScore}/100`);

    const riskTags = [];
    if (detectedLocations.length > 0) riskTags.push('Location Tracking');
    if (detectedTimes.length > 0) riskTags.push('Routine Exposure');
    if (detectedPersonal.length > 0) riskTags.push('Vulnerability');
    if (hasFile) riskTags.push('Metadata Leak');

    // 5. PRIVACY PROFILE
    const profile = {
      'Profile Type': detectedTravel.length > 0 ? 'Traveler/Explorer' : 'Casual User',
      'Location': detectedLocations.length > 0 ? detectedLocations[0].charAt(0).toUpperCase() + detectedLocations[0].slice(1) : 'Not detected',
      'Routine': detectedTimes.length > 0 ? 'Active Routine Detected' : 'Not clear',
      'Risk Indicators': String(detectedLocations.length + detectedTimes.length + detectedTravel.length + detectedPersonal.length + (hasFile ? 2 : 0))
    };

    // 6. HACKER SIMULATION
    let hStep = 1;
    if (hasFile) hackerSteps.push(`Extract EXIF GPS coordinates from the uploaded image.`);
    if (detectedLocations.length > 0) hackerSteps.push(`Identify user location as ${detectedLocations[0]}.`);
    if (detectedTravel.length > 0) hackerSteps.push(`Detect travel pattern involving "${detectedTravel[0]}".`);
    if (detectedPersonal.length > 0 && detectedPersonal.includes('alone')) hackerSteps.push(`Infer vulnerability: target is alone.`);
    if (detectedPersonal.length > 0 && (detectedPersonal.includes('home') || detectedPersonal.includes('house'))) hackerSteps.push(`Infer target is currently at their residence.`);
    if (hackerSteps.length === 0) hackerSteps.push(`Monitor account for future location or routine leaks.`);
    hackerSteps.push(`Combine extracted data points for complete profiling and tracking.`);

    // 7. SMART SAFE REWRITE
    let safeVersion = text;
    if (riskScore > 0 && text) {
      if (detectedTravel.length > 0) {
        safeVersion = "Enjoying some time off ✨";
      } else if (detectedLocations.length > 0) {
        safeVersion = "Exploring new places! 🌍";
      } else if (detectedPersonal.length > 0) {
        safeVersion = "Relaxing day at my safe space 🏠";
      } else {
        safeVersion = "Having a great time! 😊";
      }
    } else if (!text && hasFile) {
      safeVersion = "Image processed safely.";
    } else {
      safeVersion = "Sharing a simple moment 😊";
    }

    // 8. FINAL SUMMARY BLOCK details
    const mainProblem = detectedLocations.length > 0 ? `Location exposure detected: ${detectedLocations[0]}` :
      detectedTimes.length > 0 ? `Routine exposure detected: ${detectedTimes[0]}` :
        hasFile ? `Image metadata exposure` : `Minimal exposure`;

    const totalRisk = riskScore >= 71 ? 'High' : riskScore >= 31 ? 'Medium' : 'Low';

    return {
      risk_score: riskScore,
      risk_tags: riskTags,
      profile: profile,
      hacker_steps: hackerSteps,
      terminal_lines: terminalLines,
      safe_version: safeVersion,
      removed_info: removedItems.join(', ') || 'No identifiable text',
      summary: {
        totalRisk: totalRisk,
        mainProblem: mainProblem,
        quickFixes: ['Use generic captions', 'Avoid real-time posting', 'Blur sensitive areas in images']
      }
    };
  };

  const handleAnalyze = async () => {
    if (!postText && !file) return;
    setLoading(true);
    setResult(null);
    setTerminalLines([]);
    setCurrentLineIndex(0);
    setAnimatedScore(0);

    try {
      await new Promise(r => setTimeout(r, 1200)); // Simulate AI delay

      const resData = analyzePostLocal(postText, !!file);
      setResult(resData);

      // Map risks to required format
      const rawRisks = [];
      if(resData.risk_tags.includes('Location Tracking')) rawRisks.push('Location');
      if(resData.risk_tags.includes('Routine Exposure')) rawRisks.push('Time');
      if(resData.removed_info.includes('staying') || resData.removed_info.includes('travel') || resData.removed_info.includes('going') || resData.profile['Profile Type'] === 'Traveler/Explorer') rawRisks.push('Travel');
      if(resData.risk_tags.includes('Vulnerability')) rawRisks.push('Personal');
      if(resData.risk_tags.includes('Metadata Leak')) rawRisks.push('Image');

      const minimalData = {
        riskScore: resData.risk_score,
        riskLevel: resData.summary.totalRisk,
        risks: rawRisks,
        safeCaption: resData.safe_version,
        timestamp: Date.now(),
        type: file && !postText ? 'Image Upload' : file && postText ? 'Image + Text' : 'Text Post',
        imagePreview: imagePreview // Store preview for results
      };

      const existing = JSON.parse(localStorage.getItem('privacyMirrorHistory') || '[]');
      const updated = [minimalData, ...existing].slice(0, 5);
      localStorage.setItem('privacyMirrorHistory', JSON.stringify(updated));

      // Auto delete after 5 mins (300000ms)
      clearTimeout(window._privacyClearTimeout);
      window._privacyClearTimeout = setTimeout(() => {
        localStorage.removeItem('privacyMirrorHistory');
      }, 300000);

      startScoreAnimation(resData.risk_score);
    } catch (err) {
      console.error(err);
      alert('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const startScoreAnimation = (target) => {
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= target) {
        setAnimatedScore(target);
        clearInterval(interval);
      } else {
        setAnimatedScore(current);
      }
    }, 20);
  };

  useEffect(() => {
    if (result && result.terminal_lines && currentLineIndex < result.terminal_lines.length) {
      const timer = setTimeout(() => {
        setTerminalLines(prev => [...prev, result.terminal_lines[currentLineIndex]]);
        setCurrentLineIndex(prev => prev + 1);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [result, currentLineIndex]);

  const scoreColor = animatedScore < 40 ? 'var(--green-safe)' : animatedScore < 70 ? 'var(--yellow-caution)' : 'var(--red-danger)';
  const riskLabel = animatedScore < 40 ? 'LOW RISK' : animatedScore < 70 ? 'MEDIUM RISK' : 'HIGH RISK';

  // Chart data setup
  const chartData = {
    labels: result?.timeline_scores?.map((_, i) => `Post ${i + 1}`) || [],
    datasets: [{
      label: 'Privacy Risk Score',
      data: result?.timeline_scores || [],
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
      fill: true,
      tension: 0.3,
      pointBackgroundColor: result?.timeline_scores?.map(s => s < 40 ? '#10B981' : s < 70 ? '#F59E0B' : '#EF4444') || [],
      pointRadius: 6,
    }]
  };
  const chartOptions = {
    responsive: true,
    scales: { y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { color: 'transparent' } } },
    plugins: { legend: { display: false } }
  };

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Analyze Your Digital Footprint</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>Paste any post to see what it reveals about you</p>
      </div>

      <div className="two-column-grid" style={{ alignItems: 'flex-start' }}>
        {/* Left Column - Input */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'sticky', top: '100px' }}>
          <div className="card animate-fade-up stagger-1" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Edit3 size={20} /> Your Post</h2>
            <div style={{ position: 'relative' }}>
              <textarea
                className="input-field"
                placeholder="Paste your social media post here...&#10;Example: Just reached Marina Beach with friends! 🌊"
                style={{ height: '200px', resize: 'none', padding: '1rem', fontSize: '1rem', lineHeight: 1.5 }}
                value={postText}
                onChange={e => setPostText(e.target.value)}
              ></textarea>
              <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {postText.length} chars
              </div>
            </div>
          </div>

          <div className="card animate-fade-up stagger-2" style={{ padding: '2rem', marginTop: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Upload size={20} /> Image </h2>
            <div style={{ border: '2px dashed var(--border-hover)', borderRadius: '12px', padding: '2.5rem 1rem', textAlign: 'center', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', background: file ? 'rgba(16, 185, 129, 0.05)' : 'transparent' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--purple-primary)'} onMouseOut={e => e.currentTarget.style.borderColor = file ? 'var(--green-safe)' : 'var(--border-hover)'}>
              <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleFileUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
              {imagePreview ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', marginBottom: '1rem' }} />
                  <div style={{ fontWeight: 500, color: 'var(--green-safe)' }}>{file.name}</div>
                </div>
              ) : file ? (
                <>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅</div>
                  <div style={{ fontWeight: 500, color: 'var(--green-safe)' }}>{file.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Ready to analyze</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📸</div>
                  <div style={{ fontWeight: 500 }}>Click to upload an Image</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Supports JPG, PNG, WEBP</div>
                </>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '24px' }}>
            <button onClick={handleAnalyze} disabled={loading || (!postText && !file)} className="btn-primary" style={{ flex: 1, padding: '1.25rem', fontSize: '1.125rem', opacity: loading || (!postText && !file) ? 0.6 : 1 }}>
              {loading ? <div className="animate-spin" style={{ width: 24, height: 24, borderTop: '2px solid white', borderRadius: '50%', margin: 'auto' }}></div> : <><Search size={22} /> Analyze</>}
            </button>
            <button onClick={handleReset} disabled={loading || (!postText && !file && !result)} className="btn-outline" style={{ padding: '1.25rem', fontSize: '1.125rem' }}>
              Reset
            </button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div style={{ flex: '1 1 55%', minWidth: '300px' }}>
          {!result && !loading && (
            <div className="card animate-fade-up stagger-4" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '500px', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Search size={64} style={{ marginBottom: '2rem', opacity: 0.2 }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Waiting for input</h3>
              <p>Paste a post or upload an image and click Analyze to see your privacy risks.</p>
            </div>
          )}

          {loading && (
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '500px', padding: '3rem', textAlign: 'center', color: 'var(--purple-light)' }}>
              <div className="animate-spin" style={{ width: 64, height: 64, borderTop: '4px solid var(--purple-primary)', borderRadius: '50%', marginBottom: '2rem' }}></div>
              <h3 className="animate-pulse" style={{ fontSize: '1.5rem' }}>Scanning digital footprint...</h3>
            </div>
          )}

          {result && !loading && (
            <div className="animate-fade-up">
              <div className="two-column-grid" style={{ marginBottom: '24px' }}>

                {/* Card 1: Risk Score */}
                <div className="card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>Risk Score</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '3rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{animatedScore}</span>
                    <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>/100</span>
                  </div>
                  <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: scoreColor === 'var(--red-danger)' ? 'var(--red-glow)' : 'var(--bg-input)', borderRadius: '6px', color: scoreColor, fontWeight: 'bold', border: `1px solid ${scoreColor}`, fontSize: '0.75rem', marginBottom: '1rem', alignSelf: 'flex-start' }}>{riskLabel}</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Based on our AI analysis of your post visibility and data exposure.</p>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${animatedScore}%`, background: `linear-gradient(90deg, var(--green-safe) 0%, var(--yellow-caution) 50%, var(--red-danger) 100%)`, transition: 'width 0.5s ease', boxShadow: `0 0 10px ${scoreColor}` }}></div>
                  </div>
                </div>

                {/* Card 2: Analyzed Image (New) */}
                {imagePreview && (
                  <div className="card animate-fade-up stagger-1" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600, width: '100%' }}>Analyzed Image</h3>
                    <img src={imagePreview} alt="Analyzed" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '12px', border: '1px solid var(--border-normal)' }} />
                    <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--green-safe)', fontWeight: 600 }}>Object & Metadata Scan Complete</div>
                  </div>
                )}

                {/* Card 3: Privacy Profile */}
                <div className="card animate-fade-up stagger-2" style={{ padding: '20px', borderRadius: '16px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.125rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Privacy Profile</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {Object.entries(result.profile || {}).map(([key, val], i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-normal)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {key.includes('Location') ? '📍' : key.includes('Routine') ? '🕒' : key.includes('Risk') ? '⚠️' : '👤'} {key}
                        </div>
                        <div style={{ fontWeight: 500, color: (key.includes('Risk') && val !== 'None') ? 'var(--red-danger)' : 'white', fontSize: '0.875rem', textAlign: 'right' }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 4: Hacker Simulation Mode */}
                <div className="card animate-fade-up stagger-3" style={{ padding: '20px', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--red-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><Terminal size={18} /> Hacker Simulation Mode</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>If I were an attacker...</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {result.hacker_steps?.map((step, i) => (
                      <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ color: 'var(--red-danger)', fontFamily: 'JetBrains Mono', fontSize: '0.875rem', fontWeight: 'bold', marginTop: '2px' }}>0{i + 1}</div>
                        <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem', lineHeight: 1.5 }}>{step}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: '3px', width: '100%', background: 'linear-gradient(90deg, var(--red-danger) 0%, transparent 100%)', marginTop: '1.5rem', opacity: 0.3, borderRadius: '2px' }}></div>
                </div>

                {/* Card 5: Smart Safe Rewrite */}
                <div className="card animate-fade-up stagger-4" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}><Edit3 size={18} /> Smart Safe Rewrite</h3>

                  <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--red-glow)' }}>
                    <div style={{ color: 'var(--red-danger)', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.75rem' }}>RISKY VERSION</div>
                    <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.875rem' }}>{postText || "Uploaded Image (Metadata Leak)"}</div>
                  </div>

                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--green-glow)' }}>
                    <div style={{ color: 'var(--green-safe)', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={14} /> SAFE VERSION</div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.875rem' }}>{result.safe_version}</div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-normal)' }}>
                    <span style={{ fontWeight: 600 }}>Removed:</span> {result.removed_info}
                  </div>
                </div>

              </div>

              {/* Final Summary Block */}
              {result.summary && (
                <div className="card animate-fade-up stagger-4" style={{ padding: '2rem', borderRadius: '16px', marginTop: '24px' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}><ShieldAlert size={20} /> Privacy Analysis Summary</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-normal)' }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>TOTAL RISK LEVEL</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: result.summary.totalRisk === 'High' ? 'var(--red-danger)' : result.summary.totalRisk === 'Medium' ? 'var(--yellow-caution)' : 'var(--green-safe)' }}>{result.summary.totalRisk}</div>
                    </div>

                    <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-normal)' }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>MAIN VULNERABILITY</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: '1.5' }}>{result.summary.mainProblem}</div>
                    </div>

                    <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-normal)' }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>RECOMMENDED ACTIONS</div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {result.summary.quickFixes.map((fix, idx) => (
                          <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle size={14} color="var(--green-safe)" style={{ flexShrink: 0 }} /> {fix}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Analyze;
