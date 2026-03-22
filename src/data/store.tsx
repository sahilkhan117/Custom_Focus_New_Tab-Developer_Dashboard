import React, { createContext, useContext, useState, useEffect } from 'react';

export type Priority = 'emergency' | 'warning' | 'primary';
export type TaskStatus = 'active' | 'overdue' | 'done';

export interface Habit {
  id: number;
  title: string;
  streak: number;
}

export interface QuickLink {
  id: number;
  url: string;
  title: string;
  localIcon?: string;
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  meta: string;
}

export interface Task {
  id: number;
  title: string;
  priority: Priority;
  status: TaskStatus;
  isHabit?: boolean;
  streak?: number;
  lastCompletedDate?: string; // YYYY-MM-DD
  history?: Record<string, boolean>; // YYYY-MM-DD -> boolean
  code?: string;
}

interface AppState {
  tasks: Task[];
  activeTaskId: number | null;
  pomodoroTime: number; // seconds
  isPomodoroActive: boolean;
  isFocusMode: boolean;
  quickLinks: QuickLink[];
  targetDeadline: string; // ISO date string
  agendaItems: AgendaItem[];
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
  addAgendaItem: (time: string, title: string, meta: string) => void;
  removeAgendaItem: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Updated to Founder/Senior Dev Persona
const DEFAULT_TASKS: Task[] = [
  { id: 1, title: "Approve PR #402 (Next.js App Router)", priority: 'emergency', status: 'active' },
  { id: 2, title: "Finalize serverless DB scaling strategy", priority: 'warning', status: 'active' },
  { id: 3, title: "Draft slides 4-7 for angel investor meeting", priority: 'primary', status: 'active' },
  { id: 4, title: "Leetcode", priority: 'emergency', status: 'active', isHabit: true, streak: 12, lastCompletedDate: '', history: {} }
];

// Updated to Production/Founder Tools
const DEFAULT_LINKS: QuickLink[] = [
  { id: 1, url: 'https://leetcode.com', title: 'LeetCode' },
  { id: 2, url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', title: 'TakeUForward' },
  { id: 3, url: 'https://aws.amazon.com', title: 'AWS' },
  { id: 4, url: 'https://vercel.com', title: 'Vercel' },
  { id: 5, url: 'https://notion.com', title: 'notion' },
];

// Updated to High-Stakes Schedule
const DEFAULT_AGENDA: AgendaItem[] = [
  { id: '1', time: '09:30', title: 'Daily Meeting: Eng Team', meta: 'Blocker review' },
  { id: '2', time: '14:00', title: 'New Product Pitch Practice', meta: 'With Co-founder' }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Incremented to v4 to force cache refresh for new mock data
    const saved = localStorage.getItem('dev_dashboard_tasks_v4');
    const loadedTasks: Task[] = saved ? JSON.parse(saved) : DEFAULT_TASKS;
    
    // Habit Reset Logic (run during initialization)
    const today = new Date().toISOString().split('T')[0];
    return loadedTasks.map(task => {
      if (task.isHabit && task.status === 'done' && task.lastCompletedDate !== today) {
        return { ...task, status: 'active' };
      }
      return task;
    });
  });

  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(() => {
    // Incremented to v3
    const saved = localStorage.getItem('dev_dashboard_links_v3');
    const links: QuickLink[] = saved ? JSON.parse(saved) : DEFAULT_LINKS;
    
    // Auto-assign local icons for defaults
    return links.map(link => {
      return { ...link, localIcon: link.localIcon };
    });
  });

  const [targetDeadline, setTargetDeadline] = useState<string>(() => {
    const saved = localStorage.getItem('dev_dashboard_deadline_v3');
    // Set a default deadline ~30 days out for the seed round
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    return saved || defaultDate.toISOString();
  });

  const [deadlineTitle, setDeadlineTitle] = useState<string>(() => {
    return localStorage.getItem('dev_dashboard_deadline_title_v3') || 'New Product Launch';
  });

  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(() => {
    const saved = localStorage.getItem('dev_dashboard_agenda_v3');
    return saved ? JSON.parse(saved) : DEFAULT_AGENDA;
  });

  // Effects - Using updated v3/v4 keys
  useEffect(() => { localStorage.setItem('dev_dashboard_tasks_v4', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('dev_dashboard_links_v3', JSON.stringify(quickLinks)); }, [quickLinks]);
  useEffect(() => { localStorage.setItem('dev_dashboard_deadline_v3', targetDeadline); }, [targetDeadline]);
  useEffect(() => { localStorage.setItem('dev_dashboard_agenda_v3', JSON.stringify(agendaItems)); }, [agendaItems]);
  useEffect(() => { localStorage.setItem('dev_dashboard_deadline_title_v3', deadlineTitle); }, [deadlineTitle]);

  const addTask = (title: string, priority: Priority, isHabit: boolean) => {
    setTasks(prev => [...prev, {
      id: Date.now(),
      title,
      priority: isHabit ? 'emergency' : priority,
      status: 'active',
      isHabit,
      history: isHabit ? {} : undefined,
      streak: isHabit ? 0 : undefined
    }]);
  };

  const toggleTaskDone = (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (t.isHabit) {
          const isCompleting = t.status !== 'done';
          return { 
            ...t, 
            status: isCompleting ? 'done' : 'active',
            streak: isCompleting ? (t.streak || 0) + 1 : Math.max(0, (t.streak || 0) - 1),
            lastCompletedDate: isCompleting ? today : t.lastCompletedDate,
            history: {
              ...(t.history || {}),
              [today]: isCompleting
            }
          };
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
  
  const addQuickLink = (url: string, title: string) => {
    let localIcon: string | undefined = undefined;
    const domain = new URL(url).hostname;
    
    if (domain.includes('github.com')) localIcon = 'github.png';
    else if (domain.includes('google.com')) localIcon = 'google.png';
    else if (domain.includes('linkedin.com')) localIcon = 'linkedin.png';
    else if (domain.includes('netflix.com')) localIcon = 'netflix.png';

    setQuickLinks(prev => [...prev, { id: Date.now(), url, title, localIcon }]);
  };
  const removeQuickLink = (id: number) => setQuickLinks(prev => prev.filter(l => l.id !== id));

  const addAgendaItem = (time: string, title: string, meta: string) => {
    setAgendaItems(prev => [...prev, { id: Date.now().toString(), time, title, meta }].sort((a,b) => a.time.localeCompare(b.time)));
  };
  const removeAgendaItem = (id: string) => setAgendaItems(prev => prev.filter(item => item.id !== id));

  const value = {
    tasks, activeTaskId, pomodoroTime, isPomodoroActive, isFocusMode, quickLinks, targetDeadline, agendaItems, deadlineTitle,
    addTask, toggleTaskDone, deleteTask, setFocusMode: setIsFocusMode, setActiveTask: setActiveTaskId,
    startPomodoro, stopPomodoro, resetPomodoro, addQuickLink, removeQuickLink, setTargetDeadline, setDeadlineTitle,
    addAgendaItem, removeAgendaItem
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};