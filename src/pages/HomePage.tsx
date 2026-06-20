import React, { useState, useEffect } from 'react';
import { Menu, User, HelpCircle, ChevronDown } from 'lucide-react';
import { SidebarItem } from '../components/SidebarItem';
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
  const [userDropdown, setUserDropdown] = useState(false);
  const [menuTree, setMenuTree] = useState<IMenuItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  useEffect(() => {
    const cachedMenu = localStorage.getItem('afml_user_menu');
    if (cachedMenu) {
      const parsedMenu = JSON.parse(cachedMenu) as IMenuItem[];
      setMenuTree(parsedMenu);
    }
  }, []);

  const handleMenuToggle = (index: number) => {
    if (openMenuIndex === index) {
      setOpenMenuIndex(null);
    } else {
      setOpenMenuIndex(index);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-50 overflow-hidden font-sans m-0 p-0">
      
      {/* টপ গ্লোবাল ব্লু নেববার */}
      <header className="w-full h-12 bg-[#1a365d] text-white flex items-center justify-between px-4 z-50 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onMouseEnter={() => setIsSidebarOpen(true)}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-slate-800/40 rounded-md transition-colors cursor-pointer focus:outline-none"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
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

      {/* মেইন কন্টেইনার বডি */}
      <div className="w-full flex flex-1 overflow-hidden relative">
        
        {/* মাস্টার সাইডবার সেল: এখানে কোনো স্ক্রলবার তৈরি হতেই দেওয়া হবে না (overflow: hidden) */}
        <aside 
          className="h-full flex flex-col p-2 shadow-2xl transition-all duration-300 ease-in-out z-40 select-none border-r border-slate-900"
          style={{ 
            backgroundColor: '#313647',
            width: isSidebarOpen ? '280px' : '60px',
            overflow: 'hidden' 
          }}
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => {
            setIsSidebarOpen(false);
            setOpenMenuIndex(null); 
          }}
        >
          {/* ইনজেকশন স্টাইল ট্যাগ দিয়ে হ্যামার ফিক্স */}
          <style dangerouslySetInnerHTML={{__html: `
            .sidebar-scroll-box::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
            }
            .sidebar-scroll-box {
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
          `}} />

          {/* কন্টেন্ট বক্স: সাইডবারের ভেতরের এই ডিভটা আলাদাভাবে স্ক্রল হবে এবং এটার স্ক্রলবারও হাইড থাকবে */}
          <div className="flex-1 w-full overflow-y-auto overflow-x-hidden sidebar-scroll-box">
            {menuTree.map((node, index) => (
              <SidebarItem 
                key={index} 
                item={node} 
                isCollapsed={!isSidebarOpen} 
                isOpen={openMenuIndex === index}
                onToggle={() => handleMenuToggle(index)}
              />
            ))}
          </div>
          
          <div className="text-[9px] font-mono text-white-500 text-center pt-2 border-t border-slate-800/60 whitespace-nowrap overflow-hidden shrink-0">
            {isSidebarOpen ? 'Release 1.0' : 'v1'}
          </div>
        </aside>

        {/* রাইট ওয়ার্কস্পেস এরিয়া */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f1f5f9] relative">
          {children}
        </main>

      </div>
    </div>
  );
};