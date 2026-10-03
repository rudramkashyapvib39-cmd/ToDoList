import React, { useState } from 'react';
import { Sparkles, ArrowRight, Flame, Plus, Zap, Check, Compass, Layers } from 'lucide-react';

export default function FloatingIslands({
    tasks = [],
    onEnterDashboard,
    onQuickAddTask,
    onToggleTask
}) {
    const [taskText, setTaskText] = useState('');

    const handleQuickAdd = (e) => {
        e.preventDefault();
        if (!taskText.trim()) return;
        onQuickAddTask(taskText.trim());
        setTaskText('');
    };

    const activeCount = tasks.filter((t) => !t.completed).length;

    return (
        <div className="landing-container">
            {/* Ambient Gradient Glows */}
            <div className="bg-glow-purple" />
            <div className="bg-glow-blue" />
            <div className="bg-glow-cyan" />

            {/* Top Floating Island (Navbar) */}
            <header className="island-float-1" style={{ display: 'flex', justifyContent: 'center', zIndex: 20 }}>
                <div className="glass-island" style={{ padding: '10px 24px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06B6D4', boxShadow: '0 0 10px #06B6D4' }} />
                        <span style={{ fontWeight: 600, color: '#CBD5E1', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '11px' }}>Focus Mode</span>
                    </div>

                    <span style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.15)' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#C084FC', fontWeight: 500 }}>
                        <Zap size={14} color="#C084FC" />
                        <span>Velocity: Optimal</span>
                    </div>

                    <span style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.15)' }} />

                    <button
                        onClick={onEnterDashboard}
                        style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                    >
                        <span>Launch App</span>
                        <ArrowRight size={13} />
                    </button>
                </div>
            </header>

            {/* Main Hero & Floating Island Grid */}
            <main className="hero-grid">
                {/* Left Side: Branding & Quick Capture */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(147, 51, 234, 0.15)', border: '1px solid rgba(147, 51, 234, 0.3)', color: '#D8B4FE', fontSize: '12px', fontWeight: 600 }}>
                        <Sparkles size={14} color="#C084FC" />
                        <span>Next-Gen Minimal Productivity</span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                        Capture it. <br />
                        <span style={{ background: 'linear-gradient(135deg, #C084FC 0%, #818CF8 50%, #60A5FA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Finish it. Move on.
                        </span>
                    </h1>

                    <p style={{ color: '#94A3B8', fontSize: '16px', lineHeight: 1.6, maxWidth: '520px' }}>
                        A distraction-free canvas engineered for speed. Zero cloud clutter, zero friction—just raw focused flow.
                    </p>

                    {/* Quick Capture Island */}
                    <div className="island-float-2">
                        <div className="glass-island" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: '#94A3B8', textTransform: 'uppercase' }}>
                                <span>Quick Command</span>
                                <span style={{ color: '#60A5FA', background: 'rgba(59, 130, 246, 0.15)', padding: '2px 8px', borderRadius: '9999px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>Ready</span>
                            </div>

                            <form onSubmit={handleQuickAdd} style={{ display: 'flex', gap: '12px' }}>
                                <input
                                    type="text"
                                    value={taskText}
                                    onChange={(e) => setTaskText(e.target.value)}
                                    placeholder="Capture your next priority..."
                                    className="custom-input"
                                />
                                <button type="submit" className="btn-primary-gradient" style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                                    <Plus size={16} />
                                    <span>Capture</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Side: Orbiting Task Island */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    <div className="island-float-1">
                        <div className="glass-island" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(147, 51, 234, 0.15)', border: '1px solid rgba(147, 51, 234, 0.3)', color: '#C084FC', display: 'flex' }}>
                                        <Compass size={18} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>Live Focus Island</h3>
                                        <p style={{ fontSize: '12px', color: '#94A3B8' }}>Interactive live queue</p>
                                    </div>
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: 600, color: '#C084FC', background: 'rgba(147, 51, 234, 0.18)', border: '1px solid rgba(147, 51, 234, 0.3)', padding: '3px 10px', borderRadius: '9999px' }}>
                                    {activeCount} Active
                                </span>
                            </div>

                            {/* Task Items */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                                {tasks.slice(0, 3).map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => onToggleTask(task.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '12px 14px',
                                            borderRadius: '14px',
                                            background: task.completed ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid',
                                            borderColor: task.completed ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.1)',
                                            opacity: task.completed ? 0.45 : 1,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div
                                                style={{
                                                    width: '18px',
                                                    height: '18px',
                                                    borderRadius: '6px',
                                                    border: task.completed ? 'none' : '1px solid #64748B',
                                                    background: task.completed ? '#8B5CF6' : 'rgba(0, 0, 0, 0.4)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {task.completed && <Check size={12} strokeWidth={3} color="#FFFFFF" />}
                                            </div>
                                            <span
                                                style={{
                                                    fontSize: '13px',
                                                    fontWeight: 500,
                                                    textDecoration: task.completed ? 'line-through' : 'none',
                                                    color: task.completed ? '#64748B' : '#F1F5F9',
                                                }}
                                            >
                                                {task.title}
                                            </span>
                                        </div>

                                        <span
                                            style={{
                                                fontSize: '10px',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                padding: '3px 8px',
                                                borderRadius: '9999px',
                                                background: 'rgba(139, 92, 246, 0.15)',
                                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                                color: '#C084FC',
                                            }}
                                        >
                                            {task.priority}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="island-float-3">
                        <div className="glass-island" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(147, 51, 234, 0.15)', border: '1px solid rgba(147, 51, 234, 0.25)', color: '#C084FC', display: 'flex' }}>
                                    <Flame size={18} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Focus Velocity</div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>5-Day Flow Streak</div>
                                </div>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#22D3EE', background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.25)', padding: '4px 10px', borderRadius: '9999px' }}>
                                100% In Sync
                            </span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Launchpad Dock */}
            <footer className="island-float-2" style={{ display: 'flex', justifyContent: 'center', zIndex: 20 }}>
                <div className="glass-island" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '13px' }}>
                        <Layers size={15} color="#818CF8" />
                        <span>Ready to enter your focused workspace?</span>
                    </div>

                    <button
                        onClick={onEnterDashboard}
                        className="btn-primary-gradient"
                        style={{ padding: '8px 18px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <span>Open FocusList</span>
                        <ArrowRight size={14} />
                    </button>
                </div>
            </footer>
        </div>
    );
}