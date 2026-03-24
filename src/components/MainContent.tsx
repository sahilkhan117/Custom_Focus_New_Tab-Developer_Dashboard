import { useState } from 'react';
import { DataText } from './UI';
import { useApp, type Priority } from '../data/store';
import { FcGoogle } from 'react-icons/fc';
import { LuPlus, LuX, LuTerminal, LuRefreshCcw, LuFlame, LuTrash2, LuCheck } from 'react-icons/lu';

export function RapidAccess() {
  const [showInput, setShowInput] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const { quickLinks, addQuickLink, removeQuickLink } = useApp();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    const title = newTitle || new URL(newUrl).hostname.replace('www.', '');
    addQuickLink(newUrl, title);
    setNewUrl('');
    setNewTitle('');
    setShowInput(false);
  };

  return (
    <div className="flex items-center gap-4 w-full">
      <div className="flex-1 overflow-x-auto custom-scroll pb-2">
        <div className="flex gap-4 items-center justify-center min-w-max px-2">
          {quickLinks.map(link => (
              <div key={link.id} className="relative flex flex-col group shrink-0">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-18 h-18 border border-zinc-900 rounded-3xl bg-zinc-700/50 flex items-center justify-center transition-all overflow-hidden hover-lift shadow-lg"
                  title={link.title}
                >
                  <img
                    className="h-14 p-1 object-contain rounded-2xl"
                    alt={link.title}
                    src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=128`}
                  />
                </a>
                <button
                  onClick={() => removeQuickLink(link.id)}
                  className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg flex items-center justify-center"
                >
                  <LuX size={10} strokeWidth={3} />
                </button>
                <DataText className="text-xs text-zinc-300 text-center mt-1 hover:text-white uppercase font-black tracking-widest transition-colors">{link.title}</DataText>
              </div>
          ))}

          {showInput ? (
            <form onSubmit={handleAdd} className="flex flex-col gap-1 bg-black border border-zinc-800 rounded-2xl p-2 animate-in slide-in-from-left-2 duration-300 z-20 shadow-2xl shrink-0">
              <input
                className="bg-transparent border-none focus:ring-0 text-[10px] w-32 p-0 text-white font-mono"
                placeholder="URL (https://...)"
                autoFocus
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
              <input
                className="bg-transparent border-none focus:ring-0 text-[10px] w-32 p-0 text-zinc-500 font-mono"
                placeholder="Title (Optional)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <button type="submit" className="hidden"></button>
            </form>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="w-16 h-16 border border-dashed border-zinc-800 rounded-3xl flex items-center justify-center text-zinc-700 hover:text-sky-500 hover:border-gray-500 transition-all bg-zinc-950/20 shrink-0"
            >
              <LuPlus size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ExecutionList() {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('primary');
  const [isHabitMode, setIsHabitMode] = useState(false);

  const {
    tasks,
    addTask,
    toggleTaskDone,
    deleteTask,
    setActiveTask,
    activeTaskId,
    setFocusMode,
    isFocusMode
  } = useApp();

  const sortedTasks = [...tasks]
    .filter(task => {
      if (task.isHabit) return !task.history?.[new Date().toISOString().split('T')[0]];
      return task.status !== 'done';
    })
    .sort((a, b) => {
      if (a.isHabit && !b.isHabit) return -1;
      if (!a.isHabit && b.isHabit) return 1;
      const priorityMap = { emergency: 0, warning: 1, primary: 2 };
      return priorityMap[a.priority] - priorityMap[b.priority];
    });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle, selectedPriority, isHabitMode);
    setNewTaskTitle('');
    setIsHabitMode(false);
  };

  return (
    <div className="flex-1 bg-black/40 border border-zinc-900 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
      <div className="flex border-b border-zinc-950 px-6 py-4 justify-between items-center bg-zinc-950/30">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500">Personal Execution Stream</h2>
        <DataText className="text-[9px] text-sky-400 font-black">{sortedTasks.length} NODES ACTIVE</DataText>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 custom-scroll">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <div
              key={task.id}
              onContextMenu={(e) => {
                e.preventDefault();
                setFocusMode(!isFocusMode);
              }}
              onClick={() => setActiveTask(task.id)}
              className={`flex items-center gap-4 p-4 bg-zinc-950/40 rounded-2xl border cursor-pointer group transition-all duration-300 hover:bg-zinc-900/40 ${task.status === 'overdue' ? 'border-red-500/40 bg-red-500/5' : 'border-zinc-900/50'} ${activeTaskId === task.id ? 'border-sky-500 bg-sky-500/5 shadow-glow-blue' : ''}`}
            >
              <button
                onClick={(e) => { e.stopPropagation(); toggleTaskDone(task.id); }}
                className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${task.status === 'done' ? 'bg-sky-500 border-sky-500' : 'border-zinc-800 hover:border-sky-500 group-hover:bg-sky-500/10'}`}
              >
                {(task.status === 'done' || task.isHabit) && (
                  <div className="text-white font-black animate-in zoom-in-50">
                    {task.isHabit ? <LuRefreshCcw size={10} strokeWidth={4} /> : <LuCheck size={12} strokeWidth={4} />}
                  </div>
                )}
              </button>

              <div className={`w-2 h-2 rounded-full ${task.isHabit ? 'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]' : task.priority === 'emergency' ? 'bg-red-500 shadow-glow-red animate-pulse' : task.priority === 'warning' ? 'bg-amber-500' : 'bg-zinc-300'}`}></div>
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[15px] font-bold tracking-tight truncate hover:text-sky-400 ${task.status === 'done' ? 'text-zinc-200 line-through opacity-80' : 'text-zinc-100'}`}>{task.title}</span>
                    {task.isHabit && (
                      <DataText className="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Recurring</DataText>
                    )}
                  </div>
                  {task.isHabit && task.history && (
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: 14 }).map((_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() - (13 - i));
                        const dateStr = d.toISOString().split('T')[0];
                        const isDone = task.history?.[dateStr];
                        return (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-sm transition-colors ${isDone ? 'bg-sky-500 shadow-[0_0_5px_rgba(56,189,248,0.4)]' : 'bg-zinc-900 border border-zinc-800'}`}
                            title={dateStr}
                          ></div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {task.isHabit && (
                <div className="flex items-center gap-2 bg-black px-3 py-1.5 rounded-xl border border-zinc-900 group-hover:border-sky-900/50 transition-colors">
                  <LuFlame className="text-sky-400" size={12} />
                  <DataText className="text-[11px] text-rose-500 font-black">{task.streak}D</DataText>
                </div>
              )}

              <button
                onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                className="text-zinc-800 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110"
              >
                <LuTrash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-10 py-10 scale-90">
            <LuTerminal size={64} className="mb-6" />
            <p className="text-[11px] uppercase font-black tracking-[0.4em]">Node Cluster Offline</p>
          </div>
        )}
      </div>

      <form onSubmit={handleAddTask} className="p-5 border-t border-zinc-950 bg-zinc-950/20 flex flex-col gap-4">
        <div className="flex gap-3 items-center">
          <div className="flex gap-1.5 bg-black p-1.5 rounded-xl border border-zinc-900">
            <button
              type="button"
              onClick={() => { setSelectedPriority('emergency'); setIsHabitMode(false); }}
              className={`w-7 h-7 rounded-lg bg-red-600 transition-all ${selectedPriority === 'emergency' && !isHabitMode ? 'scale-110 shadow-glow-red ring-1 ring-white/50' : 'opacity-50 '}`}
            ></button>
            <button
              type="button"
              onClick={() => { setSelectedPriority('warning'); setIsHabitMode(false); }}
              className={`font-bold w-7 h-7 rounded-lg bg-amber-500 transition-all ${selectedPriority === 'warning' && !isHabitMode ? 'scale-110 ring-1 ring-white/50' : 'opacity-50 '}`}
            ></button>
            <button
              type="button"
              onClick={() => { setSelectedPriority('primary'); setIsHabitMode(false); }}
              className={`w-7 h-7 rounded-lg bg-zinc-600 transition-all ${selectedPriority === 'primary' && !isHabitMode ? 'scale-110 ring-1 ring-white/0' : 'opacity-50'}`}
            ></button>
          </div>

          <button
            type="button"
            onClick={() => setIsHabitMode(!isHabitMode)}
            className={`flex items-center gap-2.5 px-5 py-2 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${isHabitMode ? 'bg-sky-500 border-sky-500 text-white shadow-glow-blue' : 'border-zinc-800 text-zinc-400 hover:text-zinc-300'}`}
          >
            <LuRefreshCcw size={12} strokeWidth={3} />
            Recurring Protocol
          </button>
        </div>

        <div className="flex gap-3">
          <input
            className="flex-1 bg-black border border-zinc-900 rounded-xl px-4 py-3 text-sm font-mono text-zinc-100 focus:outline-none focus:border-sky-500/50 transition-all placeholder:text-zinc-400 shadow-inner"
            placeholder={`${isHabitMode ? 'Recurring Protocol' : '🔥 Active Node'}...`}
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button type="submit" className="mono text-[14px] bg-sky-500 px-4 my-0.5 rounded-2xl uppercase font-black tracking-widest text-white hover:bg-sky-500 hover:text-white transition-all duration-300 border border-sky-900/30">Commit</button>
        </div>
      </form>
    </div>
  );
}

export function MainContent() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <main className="flex flex-col gap-4 h-full overflow-hidden p-1">
      <div className="items-center">
        <RapidAccess />
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none group-focus-within:text-sky-500 transition-all duration-300 z-10 pl-5">
            <FcGoogle size={36} className="" />
          </div>
          <input
            className="w-full h-16 bg-black/40 border border-zinc-900 rounded-2xl pl-16 pr-6 text-2xl font-mono tracking-tight focus:outline-none focus:border-gray-500 transition-all placeholder:text-zinc-600 text-zinc-100 shadow-2xl"
            placeholder="Search Google..."
            type="text"
            value={searchTerm}
            autoFocus
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="hidden"></button>
        </form>
      </div>
      <ExecutionList />
    </main>
  );
}
