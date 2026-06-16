import React, { useState, useEffect } from 'react';
import { Menu, User, HelpCircle, ChevronDown } from 'lucide-react';
import { SidebarItem } from '../components/SidebarItem';
import type { IMenuItem } from '../types/auth';

// হোম পেজের মূল টাইটেল ও কন্টেন্ট সরাসরি এই ফাইলের ভেতরেই থাকবে
export const HomeDashboard = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 font-sans">
      <h2 className="text-md font-bold text-slate-800">AFML Sales and Distribution</h2>
      <p className="text-xs text-slate-400 mt-1">Welcome to Akij Flour Mills Sales and Distribution System.</p>
    </div>
  );
};

interface HomePageProps {
  empName: string;
  onLogout: () => void;
  children: React.ReactNode;
}

export const HomePage: React.FC<HomePageProps> = ({ empName, onLogout, children }) => {
  const [userDropdown, setUserDropdown] = useState(false);
  const [menuTree, setMenuTree] = useState<IMenuItem[]>([]);

  useEffect(() => {
    const cachedMenu = localStorage.getItem('afml_user_menu');
    if (cachedMenu) {
      const parsedMenu = JSON.parse(cachedMenu) as IMenuItem[];
      setMenuTree(parsedMenu);
    }
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-50 overflow-hidden font-sans m-0 p-0 select-none">
      <header className="w-full h-12 bg-[#1a365d] text-white flex items-center justify-between px-4 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5 text-white" />
          <span className="font-bold text-xs tracking-wider uppercase">Sales & Distribution Portal</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold relative">
          <HelpCircle className="w-4 h-4 text-slate-300" />
          
          <div className="relative">
            <button 
              onClick={() => setUserDropdown(!userDropdown)}
              className="flex items-center gap-1 hover:bg-slate-800/40 px-2 py-1 rounded-md transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 bg-slate-800 rounded-full p-0.5 text-white" />
              <span className="lowercase text-slate-200 font-bold">{empName}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {userDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50 text-slate-800">
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-100 text-red-600 cursor-pointer"
                >
                  Logout Session
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="w-full flex flex-1 overflow-hidden">
        <aside 
          className="w-64 h-full flex flex-col p-3 overflow-y-auto shadow-2xl"
          style={{ backgroundColor: '#121212' }}
        >
          <div className="flex-1">
            {menuTree.map((node, index) => (
              <SidebarItem key={index} item={node} />
            ))}
          </div>
          <div className="text-[10px] font-mono text-slate-600 text-center py-2 border-t border-slate-800/60">
            Release 1.0
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f1f5f9]">
          {children}
        </main>
      </div>
    </div>
  );
};