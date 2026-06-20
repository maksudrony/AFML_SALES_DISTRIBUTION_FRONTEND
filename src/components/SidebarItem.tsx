import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { IMenuItem } from '../types/auth';

interface SidebarItemProps {
  item: IMenuItem;
  isCollapsed: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ item, isCollapsed, isOpen, onToggle }) => {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  
  const currentBrowserPath = location.pathname ? location.pathname.toLowerCase() : '';

  if (hasChildren) {
    return (
      // mb-0.5 দিয়ে মেইন ক্যাটাগরির নিচের মার্জিন কমানো হয়েছে
      <div className="mb-0.5 font-sans select-none w-full overflow-hidden">
        {/* মেইন ক্যাটাগরি মেনু বাটন: py-1.5 দিয়ে চিকন প্যাডিং এবং text-[11px] দিয়ে ফন্ট ছোট করা হয়েছে */}
        <div 
          onClick={onToggle}
          className="flex items-center justify-between px-2 py-1.5 rounded-md text-[11px] font-semibold text-slate-300 hover:bg-[#007979] hover:text-white transition-all cursor-pointer overflow-hidden whitespace-nowrap"
        >
          <div className="flex items-center gap-2 min-w-0">
            {/* ডিরেক্ট ডাটাবেজের আইকন কলাম এখানে i ট্যাগে বসানো হলো, সাইজ সামান্য ছোট (text-xs) */}
            <div className="text-slate-300 shrink-0 flex items-center justify-center w-5 h-5 text-xs">
              <i className={item.icon || 'fa fa-folder'}></i>
            </div>
            
            {!isCollapsed && (
              <span className="truncate tracking-wide text-slate-200 opacity-100 transition-opacity duration-200">
                {item.label}
              </span>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="text-slate-300 shrink-0">
              {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </div>
          )}
        </div>
        
        {/* সাবমেনু ড্রপডাউন লিস্ট: pl-2 এবং ml-4 দিয়ে স্পেসিং ও space-y-0.5 দিয়ে গ্যাপ কমানো হয়েছে */}
        {isOpen && !isCollapsed && (
          <div className="mt-0.5 pl-2 space-y-0.5 border-l border-slate-800 ml-4 transition-all duration-200 overflow-hidden">
            {item.children.map((subItem, index) => {
              const normalizedSubPath = subItem.path ? subItem.path.toLowerCase() : '';
              const isSubActive = normalizedSubPath !== '' && currentBrowserPath === normalizedSubPath;
              
              return (
                subItem.path && (
                  // সাবমেনু লিঙ্ক: px-3 py-1 এবং text-[11px] দিয়ে একদম ছিমছাম করা হয়েছে
                  <Link
                    key={index}
                    to={subItem.path}
                    className={`block px-3 py-1 text-[11px] font-medium rounded-md transition-all truncate whitespace-nowrap ${
                      isSubActive 
                        ? 'bg-cyan-600 text-white font-bold shadow-md' 
                        : 'text-slate-300 hover:bg-[#F48F68] hover:text-white text-[12px]'
                    }`}
                  >
                    {subItem.label}
                  </Link>
                )
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const normalizedMainPath = item.path ? item.path.toLowerCase() : '';
  const isMainActive = normalizedMainPath !== '' && currentBrowserPath === normalizedMainPath;

  return (
    item.path ? (
      // সিঙ্গেল মেইন মেনু বাটন (যেমন: Home): py-1.5, mb-0.5 এবং text-[11px] এ লকড
      <Link
        to={item.path}
        className={`flex items-center gap-2 px-2 py-1.5 text-[11px] font-bold rounded-md mb-0.5 transition-all overflow-hidden whitespace-nowrap ${
          isMainActive 
            ? 'bg-blue-600 text-white font-bold shadow-md' 
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
      >
        {/* স্ট্যান্ডঅ্যালোন বা সিঙ্গেল পেজের সরাসরি ডাটাবেজ আইকন */}
        <div className="text-slate-400 shrink-0 flex items-center justify-center w-5 h-5 text-xs">
          <i className={item.icon || 'fa fa-link'}></i>
        </div>
        
        {!isCollapsed && (
          <span className="truncate tracking-wide opacity-100 transition-opacity duration-200">
            {item.label}
          </span>
        )}
      </Link>
    ) : null
  );
};