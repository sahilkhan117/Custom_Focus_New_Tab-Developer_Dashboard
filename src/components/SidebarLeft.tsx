import { Panel, SectionLabel, DataText } from './UI';
import { useTime, useCountdown } from '../hooks/useTime';
import { useApp } from '../data/store';
import { LuHistory, LuFlame } from 'react-icons/lu';
import { LucideCheckCircle2 } from 'lucide-react';


export function AnalogClock() {
  const { hours, minutes, seconds } = useTime();
  const h = parseInt(hours);
  const m = parseInt(minutes);
  const s = parseInt(seconds);

  // Rotation angles with smoothing
  const hDeg = (h % 12) * 30 + m * 0.5;
  const mDeg = m * 6;
  const sDeg = s * 6;

  return (
    <Panel className="bg-black/30 flex flex-col items-center justify-center gap-4 rounded-3xl pb-8 relative overflow-hidden group">
      <div className="clock relative w-44 h-44 rounded-full border border-zinc-800/50 flex items-center justify-center bg-white/10 shadow-inner">
        {/* Hands */}
        <div
          className="hour_hand"
          style={{ transform: `rotate(${hDeg}deg)` }}
        />
        <div
          className="min_hand"
          style={{ transform: `rotate(${mDeg}deg)` }}
        />
        <div
          className="sec_hand"
          style={{ transform: `rotate(${sDeg}deg)` }}
        />

        {/* Center Point */}
        <div className="w-2.5 h-2.5 bg-zinc-200 rounded-full z-10 shadow-[0_0_10px_rgba(255,255,255,1)] border border-zinc-500"></div>

        {/* Numbers */}
        <span className="twelve">12</span>
        <span className="one">1</span>
        <span className="two">2</span>
        <span className="three">3</span>
        <span className="four">4</span>
        <span className="five">5</span>
        <span className="six">6</span>
        <span className="seven">7</span>
        <span className="eight">8</span>
        <span className="nine">9</span>
        <span className="ten">10</span>
        <span className="eleven">11</span>
      </div>

      <div className="text-center z-10">
        <SectionLabel className="mb-0 text-sky-500">Work Remaining</SectionLabel>
        <DataText className="text-3xl font-black text-white tracking-widest">
          {hours}:{minutes}:<span className='text-rose-500'>{seconds}</span>
        </DataText>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-sky-500/10 transition-colors duration-700"></div>
    </Panel>
  );
}

export function CriticalWindow() {
  const { timeLeft, progress } = useCountdown(24);
  
  return (
    <Panel className="flex flex-col gap-3 transition-all duration-500 overflow-hidden relative bg-black/40">
      <div className="flex justify-between items-start relative z-10">
        <SectionLabel className="mb-0 text-xs transition-colors text-sky-500">
          TIME LEFT
        </SectionLabel>
        <DataText className="transition-all duration-500 font-black tracking-tighter text-xl ">
          {timeLeft.slice(0, 5)}
          <span className='text-rose-500'>{timeLeft.slice(5, 8)}</span>
        </DataText>
      </div>

      <div className="relative h-2 bg-zinc-900/50 rounded-full overflow-hidden border border-zinc-800/50">
        <div
          className="h-full transition-all duration-1000 ease-out bg-linear-to-r from-rose-400 via-red-600 to-red-800"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </Panel>
  );
}

export function CompletedArchive() {
  const { tasks, toggleTaskDone } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];

  const completedTasks = tasks.filter(t => 
    (!t.isHabit && t.status === 'done') || 
    (t.isHabit && t.history?.[todayStr])
  );

  return (
    <Panel className="mt-auto border-sky-900/40 bg-black/40 flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LucideCheckCircle2 className="text-sky-500 text-lg" />
          <SectionLabel className="mb-0 text-slate-100 uppercase font-black tracking-widest">Completed Protocols</SectionLabel>
        </div>
        <DataText className="text-[16px] text-sky-400 font-black">{completedTasks.length} NODES</DataText>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll pr-2 flex flex-col gap-3">
        {completedTasks.length > 0 ? (
          completedTasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => toggleTaskDone(task.id)}
              className="flex flex-col gap-1 p-3 bg-zinc-950/40 rounded-xl border border-zinc-900/50 animate-in fade-in slide-in-from-left-4 duration-300 cursor-pointer hover:bg-zinc-900/40 transition-colors group"
              title="Click to restore to mission list"
            >
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${task.isHabit ? 'bg-sky-500 shadow-glow-blue' : 'bg-emerald-500'}`}></div>
                <span className="text-[13px] font-bold text-zinc-400 line-through tracking-tight truncate group-hover:text-sky-400 transition-colors">{task.title}</span>
              </div>
              {task.isHabit && (
                 <div className="flex items-center gap-1.5 opacity-80 ml-3.5">
                   <LuFlame size={10} className="text-sky-400" />
                   <span className="text-[9px] font-black uppercase tracking-tighter text-zinc-300">{task.streak}D Streak Maintained</span>
                 </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-10 py-10 scale-90">
            <LuHistory size={48} className="mb-4" />
            <p className="text-[10px] uppercase font-black tracking-[0.4em] text-center px-4">Daily Archive Empty</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-950">
         <div className="flex justify-between items-center opacity-30">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Sync Status</span>
            <div className="flex gap-1">
               <div className="w-1 h-1 bg-sky-500 rounded-full"></div>
               <div className="w-1 h-1 bg-sky-500 rounded-full animate-pulse"></div>
            </div>
         </div>
      </div>
    </Panel>
  );
}

export function SidebarLeft() {
  return (
    <aside className="flex flex-col gap-4 h-full">
      <AnalogClock />
      <CriticalWindow />
      <CompletedArchive />
    </aside>
  );
}
