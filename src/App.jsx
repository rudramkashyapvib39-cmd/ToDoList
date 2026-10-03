import React, { useState, useEffect } from 'react';
import FloatingIslands from './components/FloatingIslands';
import Dashboard from './components/Dashboard';

const DEFAULT_PRIORITIES = [
  { id: 'high', label: 'High Priority', color: '#EF4444', isCustom: false },
  { id: 'medium', label: 'Medium Priority', color: '#F59E0B', isCustom: false },
  { id: 'low', label: 'Low Priority', color: '#10B981', isCustom: false },
];

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'dashboard'

  // 1. Tasks state with localStorage
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('focuslist_tasks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 't-1',
        title: 'Morning Gym Workout',
        completed: false,
        priority: 'high',
        isDaily: true,
        timerMinutes: 45,
        dueDate: 'Today',
        createdAt: Date.now() - 3600000 * 24,
        completedAt: null,
      },
      {
        id: 't-2',
        title: 'Submit DBMS Architecture project',
        completed: false,
        priority: 'high',
        isDaily: false,
        timerMinutes: 30,
        dueDate: 'Today',
        createdAt: Date.now() - 3600000 * 12,
        completedAt: null,
      },
    ];
  });

  // 2. Historical archive of completed & recurring logs
  const [historyLogs, setHistoryLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('focuslist_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // 3. Priorities state with localStorage
  const [priorities, setPriorities] = useState(() => {
    try {
      const saved = localStorage.getItem('focuslist_priorities');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PRIORITIES;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('focuslist_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('focuslist_history', JSON.stringify(historyLogs));
  }, [historyLogs]);

  useEffect(() => {
    localStorage.setItem('focuslist_priorities', JSON.stringify(priorities));
  }, [priorities]);

  // Task creation handler
  const handleAddTask = ({ title, priority = 'medium', dueDate = null, isDaily = false, timerMinutes = null }) => {
    const newTask = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title,
      completed: false,
      priority,
      dueDate,
      isDaily,
      timerMinutes,
      createdAt: Date.now(),
      completedAt: null,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // 4. Toggle completion + Daily habit archive logic
  const handleToggleTask = (id) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    const willBeCompleted = !target.completed;
    const now = Date.now();

    // If it's a daily recurring task, log an archived completion record
    if (target.isDaily && willBeCompleted) {
      const archiveEntry = {
        ...target,
        id: `history-${Date.now()}`,
        completed: true,
        completedAt: now,
      };
      setHistoryLogs((prev) => [archiveEntry, ...prev]);
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            completed: willBeCompleted,
            completedAt: willBeCompleted ? now : null,
          };
        }
        return t;
      })
    );
  };

  // 5. One-click 7-day span replication
  const handleReplicateWeek = (taskToReplicate) => {
    const newTasks = [];
    const baseDate = new Date();

    for (let i = 1; i <= 7; i++) {
      const targetDate = new Date(baseDate);
      targetDate.setDate(baseDate.getDate() + i);
      const dateString = targetDate.toISOString().split('T')[0];

      newTasks.push({
        id: `replica-${Date.now()}-${i}`,
        title: `${taskToReplicate.title}`,
        completed: false,
        priority: taskToReplicate.priority,
        dueDate: dateString,
        isDaily: taskToReplicate.isDaily,
        timerMinutes: taskToReplicate.timerMinutes,
        createdAt: Date.now(),
        completedAt: null,
      });
    }

    setTasks((prev) => [...newTasks, ...prev]);
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditTask = (id, newTitle) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    );
  };

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const handleAddPriority = (newPriority) => {
    setPriorities((prev) => [...prev, newPriority]);
  };

  const handleDeletePriority = (id) => {
    setPriorities((prev) => prev.filter((p) => p.id !== id));
  };

  if (view === 'landing') {
    return (
      <FloatingIslands
        tasks={tasks}
        onEnterDashboard={() => setView('dashboard')}
        onQuickAddTask={(title) => handleAddTask({ title, priority: 'high' })}
        onToggleTask={handleToggleTask}
      />
    );
  }

  return (
    <Dashboard
      tasks={tasks}
      historyLogs={historyLogs}
      priorities={priorities}
      onAddTask={handleAddTask}
      onToggleTask={handleToggleTask}
      onDeleteTask={handleDeleteTask}
      onEditTask={handleEditTask}
      onClearCompleted={handleClearCompleted}
      onAddPriority={handleAddPriority}
      onDeletePriority={handleDeletePriority}
      onReplicateWeek={handleReplicateWeek}
      onBackToLanding={() => setView('landing')}
    />
  );
}