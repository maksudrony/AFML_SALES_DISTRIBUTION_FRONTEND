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
      <div className="mb-0.5 font-sans select-none w-full overflow-hidden relative z-50 pointer-events-auto">
        <div 
          onClick={onToggle}
          className="flex items-center justify-between px-2 py-1.5 rounded-md text-[11px] font-semibold text-white 
          hover:bg-[#007979] hover:text-white transition-all cursor-pointer overflow-hidden whitespace-nowrap"
        >
          <div className="flex items-center gap-2 min-w-0">
            {/* Database Menu Icon */}
            <div className="text-white shrink-0 flex items-center justify-center w-5 h-5 text-xs">
              <i className={item.icon || 'fa fa-folder'}></i>
            </div>
            
            {!isCollapsed && (
              <span className="truncate tracking-wide text-white opacity-100 transition-opacity duration-200">
                {item.label}
              </span>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="text-white shrink-0">
              {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </div>
          )}
        </div>
        
        {isOpen && !isCollapsed && (
          <div className="mt-0.5 pl-2 space-y-0.5 border-l border-slate-300 ml-4 transition-all duration-200 overflow-hidden">
            {item.children.map((subItem, index) => {
              const normalizedSubPath = subItem.path ? subItem.path.toLowerCase() : '';
              const isSubActive = normalizedSubPath !== '' && currentBrowserPath === normalizedSubPath;
              
              return (
                subItem.path && (
                  <Link
                    key={index}
                    to={subItem.path}
                    className={`block px-3 py-1 text-[11px] font-medium rounded-md transition-all truncate whitespace-nowrap ${
                      isSubActive 
                        ? 'bg-cyan-600 text-white font-bold shadow-md' 
                        : 'text-white hover:bg-[#F48F68] hover:text-white text-[10px]'
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
      <Link
        to={item.path}
        className={`flex items-center gap-2 px-2 py-1.5 text-[11px] font-bold rounded-md mb-0.5 transition-all overflow-hidden whitespace-nowrap relative z-50 pointer-events-auto ${
          isMainActive 
            ? 'bg-cyan-600 text-white font-bold shadow-md' 
            : 'text-white hover:bg-[#F48F68] hover:text-white'
        }`}
      >
        <div className="text-white shrink-0 flex items-center justify-center w-5 h-5 text-xs">
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