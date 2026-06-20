export const RGBSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 
        border-transparent border-t-indigo-500 border-r-pink-500 border-b-cyan-500 
        border-l-emerald-500 animate-spin"></div>
        {/* global inner dot */}
        <div className="absolute inset-2 bg-white dark:bg-slate-950 rounded-full 
        flex items-center justify-center shadow-inner">
          <div className="w-2 h-2 bg-[#1a365d] rounded-full animate-ping"></div>
        </div>
      </div>
      <p className="text-[11px] font-bold text-slate-500 mt-3 tracking-widest uppercase animate-pulse">
        Generating Report Data...
      </p>
    </div>
  );
};