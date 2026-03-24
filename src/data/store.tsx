import React, { createContext, useContext, useState, useEffect } from 'react';

export type Priority = 'emergency' | 'warning' | 'primary';
export type TaskStatus = 'active' | 'overdue' | 'done';
export type MemoryImportance = 1 | 2 | 3; // 1: Small, 2: Medium, 3: Large

export interface MemoryNode {
  id: string;
  title: string;
  detail: string;
  importance: MemoryImportance;
}

export interface QuickLink {
  id: number;
  url: string;
  title: string;
}

export interface Task {
  id: number;
  title: string;
  priority: Priority;
  status: TaskStatus;
  isHabit?: boolean;
  streak?: number;
  history?: Record<string, boolean>; // date string -> isDone
  code?: string;
}

interface AppState {
  tasks: Task[];
  activeTaskId: number | null;
  pomodoroTime: number; 
  isPomodoroActive: boolean;
  isFocusMode: boolean;
  quickLinks: QuickLink[];
  targetDeadline: string; 
  memories: MemoryNode[];
  deadlineTitle: string;
}

interface AppContextType extends AppState {
  addTask: (title: string, priority: Priority, isHabit: boolean) => void;
  toggleTaskDone: (id: number) => void;
  deleteTask: (id: number) => void;
  setFocusMode: (active: boolean) => void;
  setActiveTask: (id: number | null) => void;
  startPomodoro: () => void;
  stopPomodoro: () => void;
  resetPomodoro: () => void;
  addQuickLink: (url: string, title: string) => void;
  removeQuickLink: (id: number) => void;
  setTargetDeadline: (date: string) => void;
  setDeadlineTitle: (title: string) => void;
  addMemory: (title: string, detail: string, importance: MemoryImportance) => void;
  removeMemory: (id: string) => void;
  updateMemory: (id: string, title: string, detail: string, importance: MemoryImportance) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('dev_dashboard_tasks_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(() => {
    const saved = localStorage.getItem('dev_dashboard_links_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [targetDeadline, setTargetDeadline] = useState<string>(() => {
    const saved = localStorage.getItem('dev_dashboard_deadline_v2');
    if (saved) return saved;
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString();
  });

  const [deadlineTitle, setDeadlineTitle] = useState<string>(() => {
    return localStorage.getItem('dev_dashboard_deadline_title_v2') || 'Neural Deadline';
  });

  const [memories, setMemories] = useState<MemoryNode[]>(() => {
    const saved = localStorage.getItem('dev_dashboard_memories_v1');
    return saved ? JSON.parse(saved) : [];
  });

  // Effects
  useEffect(() => { localStorage.setItem('dev_dashboard_tasks_v3', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('dev_dashboard_links_v2', JSON.stringify(quickLinks)); }, [quickLinks]);
  useEffect(() => { localStorage.setItem('dev_dashboard_deadline_v2', targetDeadline); }, [targetDeadline]);
  useEffect(() => { localStorage.setItem('dev_dashboard_memories_v1', JSON.stringify(memories)); }, [memories]);
  useEffect(() => { localStorage.setItem('dev_dashboard_deadline_title_v2', deadlineTitle); }, [deadlineTitle]);

  const addTask = (title: string, priority: Priority, isHabit: boolean) => {
    setTasks(prev => [...prev, {
      id: Date.now(),
      title,
      priority: isHabit ? 'emergency' : priority,
      status: 'active',
      isHabit,
      streak: isHabit ? 0 : undefined
    }]);
  };

  const toggleTaskDone = (id: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (t.isHabit) {
          const today = new Date().toISOString().split('T')[0];
          const currentStatus = t.history?.[today] || false;
          const newHistory = { ...t.history, [today]: !currentStatus };
          const newStreak = !currentStatus ? (t.streak || 0) + 1 : Math.max(0, (t.streak || 0) - 1);
          return { ...t, streak: newStreak, history: newHistory };
        }
        return { ...t, status: t.status === 'done' ? 'active' : 'done' };
      }
      return t;
    }));
  };

  const deleteTask = (id: number) => setTasks(prev => prev.filter(t => t.id !== id));
  const startPomodoro = () => setIsPomodoroActive(true);
  const stopPomodoro = () => setIsPomodoroActive(false);
  const resetPomodoro = () => { setIsPomodoroActive(false); setPomodoroTime(25 * 60); };
  
  const addQuickLink = (url: string, title: string) => setQuickLinks(prev => [...prev, { id: Date.now(), url, title }]);
  const removeQuickLink = (id: number) => setQuickLinks(prev => prev.filter(l => l.id !== id));

  const addMemory = (title: string, detail: string, importance: MemoryImportance) => {
    setMemories(prev => [{ id: Date.now().toString(), title, detail, importance }, ...prev]);
  };
  const removeMemory = (id: string) => setMemories(prev => prev.filter(m => m.id !== id));
  const updateMemory = (id: string, title: string, detail: string, importance: MemoryImportance) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, title, detail, importance } : m));
  };

  const value = {
    tasks, activeTaskId, pomodoroTime, isPomodoroActive, isFocusMode, quickLinks, targetDeadline, memories, deadlineTitle,
    addTask, toggleTaskDone, deleteTask, setFocusMode: setIsFocusMode, setActiveTask: setActiveTaskId,
    startPomodoro, stopPomodoro, resetPomodoro, addQuickLink, removeQuickLink, setTargetDeadline, setDeadlineTitle,
    addMemory, removeMemory, updateMemory
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};