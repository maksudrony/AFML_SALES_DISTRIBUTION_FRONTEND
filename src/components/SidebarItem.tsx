import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { IMenuItem } from '../types/auth';

interface SidebarItemProps {
  item: IMenuItem;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ item }) => {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  
  const currentBrowserPath = location.pathname ? location.pathname.toLowerCase() : '';

  if (hasChildren) {
    return (
      <div className="mb-4 font-sans select-none">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {item.label}
        </div>
        <div className="mt-1 space-y-0.5">
          {item.children.map((subItem, index) => {
            // Safe execution check for null/undefined subItem path
            const normalizedSubPath = subItem.path ? subItem.path.toLowerCase() : '';
            const isSubActive = normalizedSubPath !== '' && currentBrowserPath === normalizedSubPath;
            
            return (
              subItem.path && (
                <Link
                  key={index}
                  to={subItem.path}
                  className={`block px-5 py-2 text-xs font-semibold rounded-md transition-all ${
                    isSubActive 
                      ? 'bg-blue-600 text-white font-bold shadow-md' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {subItem.label}
                </Link>
              )
            );
          })}
        </div>
      </div>
    );
  }

  // Safe validation check for single root item path maps
  const normalizedMainPath = item.path ? item.path.toLowerCase() : '';
  const isMainActive = normalizedMainPath !== '' && currentBrowserPath === normalizedMainPath;

  return (
    item.path ? (
      <Link
        to={item.path}
        className={`block px-3 py-2.5 text-xs font-bold rounded-md mb-2 transition-all ${
          isMainActive 
            ? 'bg-blue-600 text-white font-bold shadow-md' 
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
      >
        {item.label}
      </Link>
    ) : null
  );
};