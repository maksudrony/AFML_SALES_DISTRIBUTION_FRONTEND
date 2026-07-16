import React, { useState } from 'react';
import { Menu, User, ChevronDown, X, LogOut, CircleUserRound } from 'lucide-react'; 
import { SidebarItem } from '../components/SidebarItem';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setSidebarOpen, toggleMenuIndex } from '../features/ui/uiSlice';
import type { IMenuItem } from '../types/auth';

export const HomeDashboard = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 font-sans text-center">
      <h2 className="text-md font-bold text-slate-800">Sales and Distribution Workspace</h2>
      <p className="text-xs text-slate-400 mt-1">Welcome to Akij Flour Mills Enterprise System.</p>
    </div>
  );
};

interface HomePageProps {
  empName: string;
  onLogout: () => void;
  children: React.ReactNode;
}

export const HomePage: React.FC<HomePageProps> = ({ empName, onLogout, children }) => {
  const dispatch = useAppDispatch();
  const { isSidebarOpen, openMenuIndex } = useAppSelector((state) => state.ui);
  const menuTree = useAppSelector((state) => state.auth.menuTree);
  const [userDropdown, setUserDropdown] = useState(false);

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-slate-50 overflow-hidden font-sans m-0 p-0">
      
      {/* Navbar Area */}
      <nav className="w-full h-12 navbar-color  
      border border-white/10 shadow-2xl text-white flex items-center justify-between px-3 sm:px-4 z-50 shrink-0">
        
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button 
            title="Toggle Sidebar"
            onMouseEnter={() => window.innerWidth > 768 && dispatch(setSidebarOpen(true))}
            onClick={() => dispatch(setSidebarOpen(!isSidebarOpen))}
            className="p-1 hover:bg-slate-800/40 rounded-md transition-colors cursor-pointer focus:outline-none shrink-0"
          >
            {isSidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
          
          <div className="tracking-wider uppercase text-xs sm:text-sm font-semibold truncate">
            <span className="inline md:hidden">AFML Sales & Dist.</span>
            
            <span className="hidden md:inline">AFML Sales & Distribution Portal</span>
          </div>
        </div>

        {/* Right Side: Profile Action */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold relative shrink-0">
          <div className="relative">
            
            {/* RGB Gradient Outer Border Box */}
            <div className="p-[2.5px] bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 
                rounded-full flex items-center justify-center shadow-md animate-rgb-border">
                  
              <button 
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/30 backdrop-blur-md hover:bg-slate-900/50
                px-3 sm:px-4 py-1 rounded-full transition-colors cursor-pointer focus:outline-none text-white框架"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full p-0.5 text-white" />
                <span className="uppercase text-white truncate max-w-[70px] sm:max-w-none">{empName}</span>
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 p-0.5 text-white/70" />
              </button>

            </div>

            {/* Dropdown Menu */}
            {userDropdown && (
              <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-white/20 bg-white/90
                  backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] animate-in fade-in zoom-in-95 duration-200 z-50"
              >
                {/* Arrow */}
                {/* <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 border-l border-t border-white/20 bg-white"/> */}

                {/* RGB Top Border */}
                <div className="h-1 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400" />

                {/* User Information */}
                <div className="flex items-center gap-4 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br
                      from-cyan-400 via-violet-500 to-pink-500 shadow-lg">
                    <CircleUserRound
                      size={28}
                      className="text-white"
                    />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-xs font-bold uppercase text-slate-800">{empName}</span>
                    <span className="text-xs text-slate-500">Sales & Distribution Portal</span>
                    <span className="mt-1 inline-flex w-fit rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                      ● Online
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-5 border-t border-slate-200" />

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="group flex w-full items-center justify-between p-3 transition-all duration-200 hover:bg-red-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 transition-all duration-200
                        group-hover:bg-red-500">
                      <LogOut
                        size={18}
                        className="text-red-600 group-hover:text-white"
                      />
                    </div>

                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800">Logout</p>
                      <p className="text-xs text-slate-500">End current session</p>
                    </div>
                  </div>

                  <ChevronDown className="-rotate-90 h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            )}

            {/* Dropdown Menu Overlay */}
            {/*{userDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50 text-slate-800">
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-100 text-red-600 cursor-pointer"
                >
                  Logout Session
                </button>
              </div>
            )} */}
          </div>
        </div>
      </nav>

      {/* Main Content Body (Sidebar + Content Area) */}
      <div className="w-full flex flex-1 overflow-hidden relative">
        
        {/* Sidebar Layer */}
        <aside 
          className={`
            h-full flex flex-col p-2 shadow-2xl transition-all duration-300 ease-in-out z-40 select-none 
            border-r border-white 
            sidebar-menu-color
            absolute md:relative top-0 bottom-0 left-0 pointer-events-auto
            ${isSidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full md:translate-x-0 md:w-[60px]'}
          `}
          // style={{ backgroundColor: '#313647' }}
          onMouseEnter={() => window.innerWidth > 768 && dispatch(setSidebarOpen(true))}
          onMouseLeave={(e) => {
            if (window.innerWidth > 768) {
              dispatch(setSidebarOpen(false));
              // dispatch(toggleMenuIndex(-1));
            } else {
              e.preventDefault();
            }
          }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .sidebar-scroll-box::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
            .sidebar-scroll-box { scrollbar-width: none !important; -ms-overflow-style: none !important; }
          `}} />

          <div className="flex-1 w-full overflow-y-auto overflow-x-hidden sidebar-scroll-box">
            {menuTree.map((node: IMenuItem, index: number) => (
              <SidebarItem 
                key={index} 
                item={node} 
                isCollapsed={window.innerWidth > 768 ? !isSidebarOpen : false} 
                isOpen={openMenuIndex === index}
                onToggle={() => dispatch(toggleMenuIndex(index))}
              />
            ))}
          </div>
          
          <div className="text-[9px] font-mono text-white text-center pt-2 border-t border-white whitespace-nowrap 
          overflow-hidden shrink-0">
            {isSidebarOpen ? 'Release 1.0' : 'v1'}
          </div>
        </aside>

        {/* Mobile Sidebar Backdrop Layer */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/10 z-30 md:hidden"
            onClick={() => dispatch(setSidebarOpen(false))}
          />
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-hidden p-4 sm:p-6 bg-white relative w-full">
          {children}
        </main>
      </div>
    </div>
  );
};