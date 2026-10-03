import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle, Timer } from 'lucide-react';

export default function FocusTimerModal({ isOpen, onClose, task, onCompleteTask }) {
    const [minutes, setMinutes] = useState(25);
    const [secondsLeft, setSecondsLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (task) {
            const defaultMins = task.timerMinutes || 25;
            setMinutes(defaultMins);
            setSecondsLeft(defaultMins * 60);
            setIsRunning(false);
        }
    }, [task]);

    useEffect(() => {
        let interval = null;
        if (isRunning && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft((prev) => prev - 1);
            }, 1000);
        } else if (secondsLeft === 0 && isRunning) {
            setIsRunning(false);
            onCompleteTask(task.id);
        }
        return () => clearInterval(interval);
    }, [isRunning, secondsLeft, task, onCompleteTask]);

    if (!isOpen || !task) return null;

    const handleSetDuration = (mins) => {
        setMinutes(mins);
        setSecondsLeft(mins * 60);
        setIsRunning(false);
    };

    const formatTime = () => {
        const mins = Math.floor(secondsLeft / 60);
        const secs = secondsLeft % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="modal-backdrop">
            <div className="glass-island" style={{ width: '100%', maxWidth: '420px', padding: '28px', textAlign: 'center', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                    <X size={18} />
                </button>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '9999px', background: 'rgba(139, 92, 246, 0.15)', color: '#C084FC', fontSize: '11px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase' }}>
                    <Timer size={13} />
                    <span>Workflow Focus Timer</span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FAFAFA', marginBottom: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {task.title}
                </h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '24px' }}>
                    Execute with zero distraction. Task will auto-complete when finished.
                </p>

                {/* Circular Countdown Dial */}
                <div className="timer-dial" style={{ marginBottom: '24px' }}>
                    <span style={{ fontSize: '44px', fontWeight: 800, letterSpacing: '-0.02em', color: '#FAFAFA' }}>
                        {formatTime()}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
                        {isRunning ? 'FOCUS MODE ACTIVE' : 'PAUSED'}
                    </span>
                </div>

                {/* Quick Preset Buttons (e.g. Gym, Study, Pomodoro) */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                    {[
                        { label: 'Gym (45m)', mins: 45 },
                        { label: 'Study (25m)', mins: 25 },
                        { label: 'Sprint (15m)', mins: 15 },
                        { label: 'Deep (60m)', mins: 60 },
                    ].map((preset) => (
                        <button
                            key={preset.mins}
                            onClick={() => handleSetDuration(preset.mins)}
                            style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                padding: '6px 10px',
                                borderRadius: '8px',
                                background: minutes === preset.mins ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid',
                                borderColor: minutes === preset.mins ? '#8B5CF6' : 'rgba(255, 255, 255, 0.08)',
                                color: minutes === preset.mins ? '#FFFFFF' : '#94A3B8',
                                cursor: 'pointer',
                            }}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>

                {/* Action Controls */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className="btn-primary-gradient"
                        style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
                    >
                        {isRunning ? <Pause size={16} /> : <Play size={16} />}
                        <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
                    </button>

                    <button
                        onClick={() => handleSetDuration(minutes)}
                        style={{
                            padding: '10px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#94A3B8',
                            cursor: 'pointer',
                        }}
                    >
                        <RotateCcw size={16} />
                    </button>

                    <button
                        onClick={() => {
                            onCompleteTask(task.id);
                            onClose();
                        }}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '12px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            color: '#34D399',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        <CheckCircle size={15} />
                        <span>Finish Now</span>
                    </button>
                </div>
            </div>
        </div>
    );
}