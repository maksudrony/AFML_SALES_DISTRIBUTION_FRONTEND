import React, { useState, useEffect } from 'react';
import { Search, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { RGBSpinner } from '../../components/RGBSpinner';

interface DropdownItem {
  id: number | string;
  name: string;
}

export const SummaryImsReport = () => {
  // ১. ডেট ফিল্টারের স্টেট (Default: Month First Day to Sysdate)
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  // ২. ফিল্টার আইটেম ও সিলেকশন স্টেট
  const [channels, setChannels] = useState<DropdownItem[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');

  const [zones, setZones] = useState<DropdownItem[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>('');

  const [divisions, setDivisions] = useState<DropdownItem[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>('');

  const [areas, setAreas] = useState<DropdownItem[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('');

  const [territories, setTerritories] = useState<DropdownItem[]>([]);
  const [selectedTerritory, setSelectedTerritory] = useState<string>('');

  const [categories, setCategories] = useState<DropdownItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // ৩. ইউআই স্ট্যাটাস স্টেট
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<any[]>([]);
  const [dynamicDayColumns, setDynamicDayColumns] = useState<string[]>([]);

  // ডিফল্ট ডেট ক্যালকুলেশন (Trunc Sysdate 'MON' & Trunc Sysdate)
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    
    setFromDate(`${yyyy}-${mm}-01`); 
    setToDate(`${yyyy}-${mm}-${dd}`);   

    setChannels([
      { id: 1, name: "Flour General Channel" },
      { id: 2, name: "Corporate Channel" }
    ]);
    setCategories([
      { id: 53, name: "Atta" },
      { id: 54, name: "Maida" },
      { id: 55, name: "Suji" }
    ]);
  }, []);

  // ক্যাসকেডিং হ্যান্ডলারস (ফিউচারে এপিআই এর সাথে ম্যাপ হবে)
  const handleChannelChange = (val: string) => {
    setSelectedChannel(val);
    setSelectedZone(''); setSelectedDivision(''); setSelectedArea(''); setSelectedTerritory('');
    if (val) {
      setZones([{ id: 101, name: "Dhaka Zone" }, { id: 102, name: "Chittagong Zone" }]);
    } else { 
      setZones([]); 
    }
  };

  const handleZoneChange = (val: string) => {
    setSelectedZone(val);
    setSelectedDivision(''); setSelectedArea(''); setSelectedTerritory('');
    if (val) {
      setDivisions([{ id: 201, name: "Dhaka North Division" }, { id: 202, name: "Dhaka South Division" }]);
    } else { 
      setDivisions([]); 
    }
  };

  const handleDivisionChange = (val: string) => {
    setSelectedDivision(val);
    setSelectedArea(''); setSelectedTerritory('');
    if (val) {
      setAreas([{ id: 301, name: "Gulshan Area" }, { id: 302, name: "Mirpur Area" }]);
    } else { 
      setAreas([]); 
    }
  };

  const handleAreaChange = (val: string) => {
    setSelectedArea(val);
    setSelectedTerritory('');
    if (val) {
      setTerritories([{ id: 401, name: "Gulshan-1 Territory" }, { id: 402, name: "Badda Territory" }]);
    } else { 
      setTerritories([]); 
    }
  };

  // শো রিপোর্ট বাটন ক্লিক অ্যাকশন 
  const handleShowReport = () => {
    setIsLoading(true);
    setReportData([]);

    setTimeout(() => {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      const cols = [];
      for (let i = 1; i <= Math.min(diffDays, 31); i++) {
        cols.push(`Day ${i}`);
      }
      setDynamicDayColumns(cols);

      setReportData([
        {
          channel_name: "Flour General", zone_name: "Dhaka Zone", division_name: "Dhaka North", 
          area_name: "Gulshan Area", territory_name: "Gulshan-1", distrib_name: "M/S Korim Traders",
          so_enrol: "EMP-9902", emp_name: "Arif Ahmed", joining_date: "12-Jan-2024",
          daysData: cols.reduce((acc: any, curr) => ({ ...acc, [curr]: Math.floor(Math.random() * 50) }), {}),
          grand_total: 450
        }
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full flex flex-col gap-4 font-sans text-slate-800 select-none">
      
      {/* ১. টপ হেডার বার */}
      <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Summary IMS Report (Pivot View)</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Secondary Sales Daily Summary Statement from Oracle Database</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-md shadow-sm cursor-pointer transition-colors">
          <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
        </button>
      </div>

      {/* ২. রিউজেবল প্যারামিটার প্যানেল - ডেক্সটপে ১ লাইনে সেম সাইজ (Flex), মোবাইল ও ট্যাবে রেসপনসিভ গ্রিড */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-row gap-2 items-end w-full">
        
        {/* From Date */}
        <div className="flex-1 min-w-[110px] sm:min-w-0 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase truncate">From Date</label>
          <input 
            type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
            className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        {/* To Date */}
        <div className="flex-1 min-w-[110px] sm:min-w-0 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase truncate">To Date</label>
          <input 
            type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
            className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        {/* Channel */}
        <div className="flex-1 min-w-[120px] sm:min-w-0 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase truncate">Channel</label>
          <select value={selectedChannel} onChange={(e) => handleChannelChange(e.target.value)}
            className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white truncate"
          >
            <option value="">- Select -</option>
            {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Zone */}
        <div className="flex-1 min-w-[120px] sm:min-w-0 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase truncate">Zone</label>
          <select value={selectedZone} onChange={(e) => handleZoneChange(e.target.value)} disabled={!selectedChannel}
            className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-400 truncate"
          >
            <option value="">- Select -</option>
            {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
        </div>

        {/* Division */}
        <div className="flex-1 min-w-[120px] sm:min-w-0 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase truncate">Division</label>
          <select value={selectedDivision} onChange={(e) => handleDivisionChange(e.target.value)} disabled={!selectedZone}
            className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-400 truncate"
          >
            <option value="">- Select -</option>
            {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        {/* Area */}
        <div className="flex-1 min-w-[120px] sm:min-w-0 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase truncate">Area</label>
          <select value={selectedArea} onChange={(e) => handleAreaChange(e.target.value)} disabled={!selectedDivision}
            className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-400 truncate"
          >
            <option value="">- Select -</option>
            {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>

        {/* Territory */}
        <div className="flex-1 min-w-[120px] sm:min-w-0 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase truncate">Territory</label>
          <select value={selectedTerritory} onChange={(e) => setSelectedTerritory(e.target.value)} disabled={!selectedArea}
            className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-400 truncate"
          >
            <option value="">- Select -</option>
            {territories.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        {/* Product Category */}
        <div className="flex-1 min-w-[120px] sm:min-w-0 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase truncate">Product Cat</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white truncate"
          >
            <option value="">- ALL -</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>

        {/* Show Report Button */}
        <div className="flex-1 min-w-[120px] sm:min-w-0">
          <button 
            onClick={handleShowReport} disabled={isLoading}
            className="w-full flex items-center justify-center gap-1 h-[28px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-md shadow-md cursor-pointer transition-all active:scale-95 disabled:bg-slate-400"
          >
            {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
            Show Report
          </button>
        </div>

      </div>

      {/* ৩. রিপোর্ট গ্রিড টেবিল এরিয়া */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 min-h-[350px]">
        
        {isLoading && <RGBSpinner />}

        {!isLoading && reportData.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-2">
            <Search className="w-8 h-8 text-slate-300 stroke-[1.5]" />
            <p className="text-xs font-medium">Please click 'Show Report'.</p>
          </div>
        )}

        {!isLoading && reportData.length > 0 && (
          <div className="w-full overflow-auto max-h-[500px]">
            <table className="w-full text-left border-collapse select-text">
              <thead>
                <tr className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider sticky top-0 z-10 whitespace-nowrap">
                  <th className="p-2 border border-slate-800">Channel</th>
                  <th className="p-2 border border-slate-800">Zone</th>
                  <th className="p-2 border border-slate-800">Division</th>
                  <th className="p-2 border border-slate-800">Area</th>
                  <th className="p-2 border border-slate-800">Territory</th>
                  <th className="p-2 border border-slate-800">Distributor</th>
                  <th className="p-2 border border-slate-800">SO Enrol</th>
                  <th className="p-2 border border-slate-800">SO Name</th>
                  <th className="p-2 border border-slate-800">Joining Date</th>
                  
                  {dynamicDayColumns.map((dayCol, idx) => (
                    <th key={idx} className="p-2 border border-slate-800 text-center bg-blue-950/80">{dayCol}</th>
                  ))}
                  
                  <th className="p-2 border border-slate-800 text-center bg-indigo-950">Grand Total</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-medium text-slate-700 divide-y divide-slate-200 whitespace-nowrap">
                {reportData.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2 border border-slate-200">{row.channel_name}</td>
                    <td className="p-2 border border-slate-200">{row.zone_name}</td>
                    <td className="p-2 border border-slate-200">{row.division_name}</td>
                    <td className="p-2 border border-slate-200">{row.area_name}</td>
                    <td className="p-2 border border-slate-200 font-bold text-slate-900">{row.territory_name}</td>
                    <td className="p-2 border border-slate-200 truncate max-w-[180px]">{row.distrib_name}</td>
                    <td className="p-2 border border-slate-200 font-mono text-slate-500">{row.so_enrol}</td>
                    <td className="p-2 border border-slate-200">{row.emp_name}</td>
                    <td className="p-2 border border-slate-200 text-slate-400">{row.joining_date}</td>
                    
                    {dynamicDayColumns.map((dayCol, idx) => (
                      <td key={idx} className="p-2 border border-slate-200 text-center font-mono font-bold text-blue-600">
                        {row.daysData[dayCol] || 0}
                      </td>
                    ))}
                    
                    <td className="p-2 border border-slate-200 text-center font-mono font-extrabold text-indigo-700 bg-indigo-50/50">
                      {row.grand_total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};