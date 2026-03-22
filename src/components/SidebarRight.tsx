import { useState, useEffect } from 'react';
import { Panel, SectionLabel, DataText } from './UI';
import { useApp } from '../data/store';
import { LuCalendar, LuPlus, LuX, LuActivity, LuTrash2, LuFlame } from 'react-icons/lu';

export function DeadlineCountdown() {
  const { targetDeadline, setTargetDeadline, deadlineTitle, setDeadlineTitle } = useApp();
  const [daysLeft, setDaysLeft] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(deadlineTitle);
  
  useEffect(() => {
    const update = () => {
      const target = new Date(targetDeadline);
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysLeft(Math.max(0, days));
    };
    
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [targetDeadline]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetDeadline(new Date(e.target.value).toISOString());
    setIsEditing(false);
  };

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDeadlineTitle(tempTitle);
    setIsEditingTitle(false);
  };

  return (
    <Panel 
      className="bg-black/40 flex flex-col items-center justify-center text-center group relative py-8 overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-1">
        <LuCalendar className="text-sky-500/40" size={12} />
        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit} className="inline-block animate-in zoom-in-95 duration-200">
            <input 
              className="bg-zinc-950 border border-sky-500/30 text-2xl uppercase tracking-widest px-2 py-0.5 rounded outline-none text-sky-400 font-black w-32"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              autoFocus
            />
          </form>
        ) : (
          <SectionLabel 
            className="mb-0 cursor-pointer text-sky-500 transition-colors text-xl"
            onClick={() => setIsEditingTitle(true)}
          >
            {deadlineTitle}
          </SectionLabel>
        )}
      </div>
      
      {isEditing ? (
        <div className="flex flex-col items-center animate-in zoom-in-95 duration-200">
          <input 
            type="date" 
            autoFocus 
            className="bg-zinc-950 border border-sky-500/50 text-white text-sm p-3 rounded-2xl mb-3 outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-mono shadow-2xl"
            defaultValue={targetDeadline.split('T')[0]}
            onChange={handleDateChange}
            onBlur={() => setIsEditing(false)}
          />
          <button 
            onClick={() => setIsEditing(false)}
            className="text-[10px] text-zinc-500 hover:text-white uppercase font-black tracking-widest transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div 
            className="relative mb-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-300"
            onClick={() => setIsEditing(true)}
          >
            <DataText className={`text-7xl font-black leading-none tracking-tighter ${daysLeft <= 5 ? 'text-red-500 ' : 'text-yellow-400'}`}>
              {String(daysLeft).padStart(2, '0')}
            </DataText>
            {daysLeft <= 5 && <div className="absolute -inset-4 bg-red-500/10 blur-2xl animate-pulse rounded-full -z-10"></div>}
          </div>
          {/* explicit date */}
          <DataText className="text-xl font-black leading-none tracking-tighter">
            {new Date(targetDeadline).toLocaleDateString("en-IN", { 
              year: "numeric", 
              month: "short", 
              day: "numeric" 
            })}
          </DataText>
        </>
      )}

      {!isEditing && (
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 text-zinc-800 opacity-0 group-hover:opacity-100 hover:text-sky-500 transition-all p-2 hover:bg-sky-500/10 rounded-full"
          title="Adjust Protocol Deadline"
        >
          <LuPlus size={16} />
        </button>
      )}
      
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full pointer-events-none"></div>
    </Panel>
  );
}

export function AgendaView() {
  const { 
    agendaItems, 
    addAgendaItem, 
    removeAgendaItem 
  } = useApp();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newMeta, setNewMeta] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime || !newTitle) return;
    addAgendaItem(newTime, newTitle, newMeta);
    setNewTime('');
    setNewTitle('');
    setNewMeta('');
    setIsAdding(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-black/40 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-5 border-b border-zinc-950 flex justify-between items-center bg-zinc-950/50 transition-colors">
        <SectionLabel className="mb-0">Protocol Agenda</SectionLabel>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`transition-all transform hover:scale-110 active:scale-95 ${isAdding ? 'text-red-500 rotate-90' : 'text-sky-700 hover:text-sky-400'}`}
        >
          {isAdding ? <LuX size={18} /> : <LuPlus size={20} />}
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto custom-scroll flex flex-col gap-5">
        {isAdding && (
          <form onSubmit={handleAdd} className="flex flex-col gap-3 p-4 bg-zinc-950 rounded-2xl border border-dashed border-sky-500/30 animate-in zoom-in-95 duration-200">
             <div className="flex gap-2">
               <input 
                 className="bg-black border border-zinc-800 rounded-lg text-[10px] w-16 p-2 text-sky-400 focus:ring-1 focus:ring-sky-500 outline-none font-mono" 
                 placeholder="HH:MM" 
                 value={newTime}
                 onChange={e => setNewTime(e.target.value)}
                 autoFocus
               />
               <input 
                 className="flex-1 bg-black border border-zinc-800 rounded-lg text-[10px] p-2 text-zinc-100 focus:ring-1 focus:ring-sky-500 outline-none font-medium" 
                 placeholder="Node Activity Title" 
                 value={newTitle}
                 onChange={e => setNewTitle(e.target.value)}
               />
             </div>
             <input 
               className="bg-black border border-zinc-800 rounded-lg text-[10px] p-2 text-zinc-400 focus:ring-1 focus:ring-sky-500 outline-none" 
               placeholder="Context / Identifier" 
               value={newMeta}
               onChange={e => setNewMeta(e.target.value)}
             />
             <button type="submit" className="text-[10px] bg-sky-500/10 text-sky-400 font-black uppercase py-2 rounded-lg border border-sky-500/20 hover:bg-sky-500 hover:text-white transition-all">Synchronize Node</button>
          </form>
        )}

        {agendaItems.length > 0 ? (
          agendaItems.map((item) => (
            <div key={item.id} className="flex gap-4 group relative animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex flex-col items-center">
                <DataText className="text-[11px] font-black leading-none text-sky-600">
                  {item.time}
                </DataText>
                <div className="w-px h-full bg-zinc-900 mt-2 group-last:hidden"></div>
              </div>
              <div className="flex-1 pb-4">
                <p className="text-[13px] font-bold leading-tight transition-colors text-zinc-200 group-hover:text-sky-400">
                  {item.title}
                </p>
                {item.meta && <p className="text-[10px] text-zinc-500 font-mono mt-1 tracking-tight">{item.meta}</p>}
              </div>
              <button 
                onClick={() => removeAgendaItem(item.id)}
                className="text-zinc-800 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 absolute -right-2 top-0"
              >
                <LuTrash2 size={14} />
              </button>
            </div>
          ))
        ) : !isAdding && (
          <div className="flex flex-col items-center justify-center h-full opacity-10 py-10 scale-90">
            <LuActivity size={48} className="animate-pulse" />
            <p className="text-[11px] uppercase font-black tracking-[0.4em] mt-4">Static Protocol</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function WeeklyHabitCheck() {
  const { tasks } = useApp();
  const habits = tasks.filter(t => t.isHabit);

  if (habits.length === 0) return null;

  const daysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: daysShort[d.getDay()],
      isToday: d.toISOString().split('T')[0] === todayStr
    };
  });

  return (
    <Panel className="bg-black/20 border-zinc-900/50 p-4">
      <div className="flex items-center gap-2 mb-4">
        <LuFlame className="text-rose-500" size={14} />
        <SectionLabel className="mb-0 text-[10px]">Weekly Habit Pulse</SectionLabel>
      </div>
      
      <div className="flex flex-col gap-4">
        {habits.map(habit => (
          <div key={habit.id} className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold text-zinc-400 truncate max-w-[120px] tracking-tight">{habit.title}</span>
              <DataText className="text-[9px] text-sky-500/40 font-black tracking-tighter">{habit.streak}D STREAK</DataText>
            </div>
            <div className="flex justify-between gap-1.5">
              {last7Days.map((day, i) => {
                const isDone = habit.history?.[day.dateStr];
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                    <div 
                      className={`w-full h-1 rounded-full transition-all duration-700 ${isDone ? 'bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.3)]' : day.isToday ? 'bg-zinc-800 animate-pulse' : 'bg-zinc-600/50'}`}
                      title={day.dateStr}
                    ></div>
                    <span className={`text-[7px] font-black ${day.isToday ? 'text-sky-600' : 'text-zinc-600'}`}>{day.dayName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function SidebarRight() {
  return (
    <aside className="flex flex-col gap-4 h-full overflow-hidden focus-visible:outline-none">
      <DeadlineCountdown />
      <WeeklyHabitCheck />
      <AgendaView />
    </aside>
  );
}
