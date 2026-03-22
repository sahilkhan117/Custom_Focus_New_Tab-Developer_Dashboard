import { SidebarLeft } from './components/SidebarLeft';
import { MainContent } from './components/MainContent';
import { SidebarRight } from './components/SidebarRight';
import { AppProvider, useApp } from './data/store';
import aroraImg from './assets/arora.png';

function Dashboard() {
  const { isFocusMode } = useApp();
  
  return (
    <div className={`relative bg-transparent text-slate-100 antialiased overflow-hidden h-screen w-screen transition-all duration-500 ${isFocusMode ? 'focus-dim' : ''}`}>
      {/* Background Image Layer */}
      <img 
        src={aroraImg} 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none mix-blend-screen transition-opacity duration-1000"
      />
      
      {/* Main Grid Container: 1440x900 viewport target */}
      <div className={`relative z-10 grid grid-cols-[240px_1fr_240px] gap-3 h-full max-w-[1408px] mx-auto p-4 transition-opacity duration-500 ${isFocusMode ? 'opacity-20' : 'opacity-100'}`}>
        <SidebarLeft />
        <MainContent />
        <SidebarRight />
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}

export default App;
