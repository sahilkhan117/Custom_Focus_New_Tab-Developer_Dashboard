import { Panel, SectionLabel, DataText } from './UI';
import { useTime, useCountdown } from '../hooks/useTime';
import { useApp } from '../data/store';
import { LuZap, LuPause, LuPlay, LuRefreshCw } from 'react-icons/lu';

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

export function Pomodoro() {
  const {
    pomodoroTime,
    isPomodoroActive,
    startPomodoro,
    stopPomodoro,
    resetPomodoro,
    tasks,
    activeTaskId
  } = useApp();

  const activeTask = tasks.find(t => t.id === activeTaskId);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentProgress = ((25 * 60 - pomodoroTime) / (25 * 60)) * 100;

  return (
    <Panel className="mt-auto border-sky-900/40 bg-black/40">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LuZap className="text-sky-500 text-lg" />
          <SectionLabel className="mb-0 text-slate-100 uppercase font-black tracking-widest">Neural Deep Work</SectionLabel>
        </div>
        <div className="flex gap-3">
          <button
            onClick={isPomodoroActive ? stopPomodoro : startPomodoro}
            className="text-zinc-500 hover:text-sky-400 transition-all transform hover:scale-110 active:scale-95"
            title={isPomodoroActive ? 'Pause Session' : 'Start Session'}
          >
            {isPomodoroActive ? <LuPause size={18} /> : <LuPlay size={18} />}
          </button>
          <button
            onClick={resetPomodoro}
            className="text-zinc-500 hover:text-red-500 transition-all transform hover:rotate-180"
            title="Reset Cycle"
          >
            <LuRefreshCw size={16} />
          </button>
        </div>
      </div>
      <DataText className="text-5xl font-black mb-3 tracking-tighter block text-zinc-100">{formatTime(pomodoroTime)}</DataText>
      <div className="w-full h-1.5 bg-zinc-900 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-sky-500 transition-all duration-700 shadow-glow-blue" style={{ width: `${currentProgress}%` }}></div>
      </div>
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3">
        <SectionLabel className="text-[9px] text-sky-500/50 mb-1.5 font-black uppercase tracking-[0.2em]">Active Node</SectionLabel>
        <p className="text-[13px] font-bold text-zinc-300 truncate tracking-tight">{activeTask?.title || "NO LINK ESTABLISHED"}</p>
      </div>
    </Panel>
  );
}

export function SidebarLeft() {
  return (
    <aside className="flex flex-col gap-4 h-full">
      <AnalogClock />
      <CriticalWindow />
      <Pomodoro />
    </aside>
  );
}
