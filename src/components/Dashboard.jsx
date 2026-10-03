import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    ArrowLeft,
    Plus,
    Search,
    Calendar,
    Check,
    Trash2,
    Pencil,
    History,
    SlidersHorizontal,
    CheckCircle2,
    SearchX,
    Timer,
    Repeat,
    Copy,
    TrendingUp,
    BarChart3
} from 'lucide-react';
import PriorityManagerModal from './PriorityManagerModal';
import FocusTimerModal from './FocusTimerModal';

export default function Dashboard({
    tasks,
    historyLogs = [],
    priorities,
    onAddTask,
    onToggleTask,
    onDeleteTask,
    onEditTask,
    onClearCompleted,
    onAddPriority,
    onDeletePriority,
    onReplicateWeek,
    onBackToLanding,
}) {
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'all' | 'history'
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Task input state
    const [title, setTitle] = useState('');
    const [selectedPriority, setSelectedPriority] = useState(priorities[0]?.id || 'high');
    const [dueDate, setDueDate] = useState('');
    const [isDaily, setIsDaily] = useState(false);
    const [timerMinutes, setTimerMinutes] = useState('');
    const [inputError, setInputError] = useState('');

    // Inline editing
    const [editingId, setEditingId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const editInputRef = useRef(null);

    // Modals state
    const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
    const [activeTimerTask, setActiveTimerTask] = useState(null);

    useEffect(() => {
        if (editingId && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingId]);

    const handleCreateTask = (e) => {
        e.preventDefault();
        const clean = title.trim();
        if (!clean) {
            setInputError('Task title cannot be empty.');
            return;
        }
        if (clean.length > 120) {
            setInputError('Max 120 characters allowed.');
            return;
        }

        onAddTask({
            title: clean,
            priority: selectedPriority,
            dueDate: dueDate || null,
            isDaily: Boolean(isDaily),
            timerMinutes: timerMinutes ? parseInt(timerMinutes, 10) : null,
        });

        setTitle('');
        setDueDate('');
        setIsDaily(false);
        setTimerMinutes('');
        setInputError('');
    };

    const handleStartEdit = (task) => {
        setEditingId(task.id);
        setEditingTitle(task.title);
    };

    const handleSaveEdit = (id) => {
        const clean = editingTitle.trim();
        if (clean) {
            onEditTask(id, clean);
        }
        setEditingId(null);
    };

    // Metrics calculations
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const remainingCount = totalTasks - completedTasks;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Rolling 7-day Weekly Analytics
    const weeklyMetrics = useMemo(() => {
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const addedThisWeek = tasks.filter((t) => (t.createdAt || 0) >= oneWeekAgo).length;
        const completedThisWeek = [
            ...tasks.filter((t) => t.completed && (t.completedAt || 0) >= oneWeekAgo),
            ...historyLogs.filter((h) => (h.completedAt || 0) >= oneWeekAgo),
        ].length;

        return { addedThisWeek, completedThisWeek };
    }, [tasks, historyLogs]);

    // Priority lookup
    const priorityMap = useMemo(() => {
        const map = {};
        priorities.forEach((p) => {
            map[p.id] = p;
        });
        return map;
    }, [priorities]);

    // Filtered tasks
    const filteredTasks = useMemo(() => {
        if (activeTab === 'history') return historyLogs;

        return tasks.filter((task) => {
            if (activeTab === 'active' && task.completed) return false;

            if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

            if (searchQuery.trim() !== '') {
                const matches = task.title.toLowerCase().includes(searchQuery.toLowerCase());
                if (!matches) return false;
            }
            return true;
        });
    }, [tasks, historyLogs, activeTab, priorityFilter, searchQuery]);

    return (
        <div className="dashboard-container">
            {/* Ambient Canvas Glows */}
            <div className="bg-glow-purple" />
            <div className="bg-glow-blue" />

            {/* Top Header Bar */}
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <button
                        onClick={onBackToLanding}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#C084FC',
                            padding: '8px 14px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                        }}
                    >
                        <ArrowLeft size={14} />
                        <span>Landing</span>
                    </button>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FAFAFA', letterSpacing: '-0.02em' }}>
                            FocusList
                        </h1>
                        <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                            Velocity dashboard & execution engine
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        onClick={() => setIsPriorityModalOpen(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            color: '#FAFAFA',
                            padding: '7px 12px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '12px',
                        }}
                    >
                        <SlidersHorizontal size={14} />
                        <span>Priorities</span>
                    </button>
                </div>
            </header>

            {/* 1. PROGRESS BAR & 2. WEEKLY VELOCITY METRIC TILES */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {/* Progress Bar Widget */}
                <div className="glass-island" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TrendingUp size={16} color="#C084FC" />
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FAFAFA' }}>Today's Progress</span>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#22D3EE' }}>
                            {progressPercentage}% Completed
                        </span>
                    </div>

                    <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '8px' }}>
                        <span>{completedTasks} completed</span>
                        <span>{remainingCount} active</span>
                        <span>{totalTasks} total</span>
                    </div>
                </div>

                {/* Weekly Added vs Completed Widget */}
                <div className="glass-island" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BarChart3 size={16} color="#60A5FA" />
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FAFAFA' }}>Weekly Velocity (Last 7 Days)</span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Rolling Span</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="stat-pill" style={{ borderLeft: '3px solid #8B5CF6' }}>
                            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>TASKS ADDED</div>
                            <div style={{ fontSize: '20px', fontWeight: 800, color: '#FAFAFA', marginTop: '2px' }}>
                                {weeklyMetrics.addedThisWeek}
                            </div>
                        </div>

                        <div className="stat-pill" style={{ borderLeft: '3px solid #10B981' }}>
                            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>COMPLETED</div>
                            <div style={{ fontSize: '20px', fontWeight: 800, color: '#34D399', marginTop: '2px' }}>
                                {weeklyMetrics.completedThisWeek}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TASK INPUT FORM WITH DAILY REPEAT & TIMER WORKFLOW */}
            <section className="glass-island" style={{ padding: '20px', marginBottom: '24px' }}>
                <form onSubmit={handleCreateTask}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="What needs to be accomplished?"
                            value={title}
                            maxLength={120}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (inputError) setInputError('');
                            }}
                            className="custom-input"
                        />
                        <button
                            type="submit"
                            className="btn-primary-gradient"
                            style={{
                                padding: '0 20px',
                                height: '48px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '14px',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <Plus size={16} />
                            <span>Add Task</span>
                        </button>
                    </div>

                    {inputError && (
                        <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>
                            {inputError}
                        </div>
                    )}

                    {/* Quick Sub-Controls: Priority, Date, Repeat Daily, Custom Timer */}
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '14px',
                            paddingTop: '12px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                            gap: '12px',
                        }}
                    >
                        {/* Priority badges selector */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                                Priority:
                            </span>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {priorities.map((p) => {
                                    const active = selectedPriority === p.id;
                                    return (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => setSelectedPriority(p.id)}
                                            className="priority-pill"
                                            style={{
                                                background: active ? `${p.color}22` : 'rgba(255, 255, 255, 0.03)',
                                                borderColor: active ? p.color : 'rgba(255, 255, 255, 0.08)',
                                                color: active ? p.color : '#94A3B8',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.color }} />
                                            {p.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Workflow controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            {/* Daily Repeat Toggle (Feature 4) */}
                            <button
                                type="button"
                                onClick={() => setIsDaily(!isDaily)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: isDaily ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                                    border: '1px solid',
                                    borderColor: isDaily ? '#8B5CF6' : 'rgba(255, 255, 255, 0.08)',
                                    color: isDaily ? '#C084FC' : '#94A3B8',
                                    padding: '5px 10px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                }}
                            >
                                <Repeat size={13} />
                                <span>Repeat Daily</span>
                            </button>

                            {/* Timer Duration Input (Feature 3) */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 255, 255, 0.04)', padding: '3px 8px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                <Timer size={13} color="#94A3B8" />
                                <input
                                    type="number"
                                    placeholder="Mins (e.g. 30)"
                                    value={timerMinutes}
                                    onChange={(e) => setTimerMinutes(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', color: '#FAFAFA', fontSize: '12px', width: '80px', outline: 'none' }}
                                />
                            </div>

                            {/* Due Date Picker */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Calendar size={13} color="#94A3B8" />
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    style={{
                                        background: 'rgba(10, 10, 16, 0.8)',
                                        color: '#FAFAFA',
                                        border: '1px solid rgba(255, 255, 255, 0.12)',
                                        borderRadius: '8px',
                                        padding: '4px 8px',
                                        fontSize: '12px',
                                        outline: 'none',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </section>

            {/* SEARCH AND FILTER BAR */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={16} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search tasks by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="custom-input"
                        style={{ paddingLeft: '40px', paddingRight: '14px', paddingTop: '10px', paddingBottom: '10px', fontSize: '13px' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.04)', padding: '3px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        {[
                            { id: 'active', label: `Active (${remainingCount})` },
                            { id: 'all', label: `All Tasks (${totalTasks})` },
                            { id: 'history', label: `History Logs (${historyLogs.length})` },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    background: activeTab === tab.id ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                                    color: activeTab === tab.id ? '#FAFAFA' : '#94A3B8',
                                    border: 'none',
                                    padding: '6px 14px',
                                    borderRadius: '9px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            style={{
                                background: 'rgba(18, 18, 26, 0.9)',
                                color: '#CBD5E1',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                borderRadius: '10px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="all">All Priorities</option>
                            {priorities.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.label}
                                </option>
                            ))}
                        </select>

                        {completedTasks > 0 && activeTab !== 'active' && activeTab !== 'history' && (
                            <button
                                onClick={onClearCompleted}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#EF4444',
                                    fontSize: '12px',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                }}
                            >
                                Clear completed
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* TASK LIST & HISTORY LOG */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredTasks.length === 0 ? (
                    <div className="glass-island" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        {activeTab === 'history' ? (
                            <>
                                <History size={36} color="#64748B" />
                                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FAFAFA' }}>No recurring history logged yet</h3>
                                <p style={{ fontSize: '12px', color: '#94A3B8' }}>Completed daily habits and tasks archive automatically here.</p>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={36} color="#10B981" />
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FAFAFA' }}>All caught up!</h3>
                                <p style={{ fontSize: '13px', color: '#94A3B8' }}>Add a task above or plan your week to start executing.</p>
                            </>
                        )}
                    </div>
                ) : (
                    filteredTasks.map((task) => {
                        const priorityObj = priorityMap[task.priority] || { label: task.priority, color: '#8B5CF6' };
                        const isEditing = editingId === task.id;

                        return (
                            <div
                                key={task.id}
                                className={activeTab === 'history' ? 'history-item' : 'glass-island'}
                                style={{
                                    padding: '14px 18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '14px',
                                }}
                            >
                                {/* Left: Checkbox + Content */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                                    <button
                                        onClick={() => onToggleTask(task.id)}
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '6px',
                                            border: task.completed ? 'none' : '1px solid #64748B',
                                            background: task.completed ? '#8B5CF6' : 'rgba(0, 0, 0, 0.4)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {task.completed && <Check size={13} strokeWidth={3} color="#FFFFFF" />}
                                    </button>

                                    {isEditing ? (
                                        <input
                                            ref={editInputRef}
                                            type="text"
                                            value={editingTitle}
                                            onChange={(e) => setEditingTitle(e.target.value)}
                                            onBlur={() => handleSaveEdit(task.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSaveEdit(task.id);
                                                if (e.key === 'Escape') setEditingId(null);
                                            }}
                                            className="custom-input"
                                            style={{ padding: '6px 10px', fontSize: '14px' }}
                                        />
                                    ) : (
                                        <div
                                            onDoubleClick={() => !task.completed && handleStartEdit(task)}
                                            style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, cursor: 'pointer' }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span
                                                    style={{
                                                        fontSize: '14px',
                                                        fontWeight: 500,
                                                        textDecoration: task.completed ? 'line-through' : 'none',
                                                        color: task.completed ? '#64748B' : '#FAFAFA',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {task.title}
                                                </span>

                                                {/* Daily habit badge */}
                                                {task.isDaily && (
                                                    <span style={{ fontSize: '10px', color: '#C084FC', background: 'rgba(139, 92, 246, 0.15)', padding: '1px 6px', borderRadius: '6px', border: '1px solid rgba(139, 92, 246, 0.25)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                                        <Repeat size={10} />
                                                        Daily
                                                    </span>
                                                )}
                                            </div>

                                            {/* Metadata */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                                                {task.dueDate && <span>Due: {task.dueDate}</span>}
                                                {task.timerMinutes && (
                                                    <span style={{ color: '#60A5FA' }}>• {task.timerMinutes}m focus timer</span>
                                                )}
                                                {task.completedAt && (
                                                    <span>• Archived on {new Date(task.completedAt).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right: Actions (Timer, Week Replication, Edit, Delete) */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                    <span
                                        className="priority-pill"
                                        style={{
                                            background: `${priorityObj.color}15`,
                                            borderColor: `${priorityObj.color}40`,
                                            color: priorityObj.color,
                                        }}
                                    >
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: priorityObj.color }} />
                                        {priorityObj.label}
                                    </span>

                                    {/* 3. Launch Timer Action */}
                                    {!task.completed && (
                                        <button
                                            onClick={() => setActiveTimerTask(task)}
                                            title="Launch Focus Timer"
                                            style={{
                                                background: 'rgba(99, 102, 241, 0.12)',
                                                border: '1px solid rgba(99, 102, 241, 0.25)',
                                                color: '#818CF8',
                                                cursor: 'pointer',
                                                padding: '6px 8px',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                            }}
                                        >
                                            <Timer size={13} />
                                            <span style={{ display: 'none', md: 'inline' }}>Timer</span>
                                        </button>
                                    )}

                                    {/* 5. 1-Click Week Planner / Copy Throughout Span of Week */}
                                    {!task.completed && (
                                        <button
                                            onClick={() => onReplicateWeek(task)}
                                            title="Duplicate task across the next 7 days"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                color: '#22D3EE',
                                                cursor: 'pointer',
                                                padding: '6px 8px',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                            }}
                                        >
                                            <Copy size={13} />
                                            <span>7-Day Plan</span>
                                        </button>
                                    )}

                                    {!task.completed && (
                                        <button
                                            onClick={() => handleStartEdit(task)}
                                            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                                        >
                                            <Pencil size={15} />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => onDeleteTask(task.id)}
                                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </section>

            {/* Priority Manager Modal */}
            <PriorityManagerModal
                isOpen={isPriorityModalOpen}
                onClose={() => setIsPriorityModalOpen(false)}
                priorities={priorities}
                onAddPriority={onAddPriority}
                onDeletePriority={onDeletePriority}
            />

            {/* Focus Timer Modal */}
            <FocusTimerModal
                isOpen={Boolean(activeTimerTask)}
                task={activeTimerTask}
                onClose={() => setActiveTimerTask(null)}
                onCompleteTask={(id) => {
                    onToggleTask(id);
                    setActiveTimerTask(null);
                }}
            />
        </div>
    );
}