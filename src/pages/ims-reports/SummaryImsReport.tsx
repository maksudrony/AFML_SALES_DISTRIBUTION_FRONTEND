import React, { useState, useEffect } from 'react';
import { Search, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { apiClient } from '../../api/apiClient'; 
import { RGBSpinner } from '../../components/RGBSpinner';

interface DropdownItem {
  id: number | string;
  name: string;
}

interface ReportRow {
  channelName: string;
  zoneName: string;
  divisionName: string;
  areaName: string;
  territoryName: string;
  distribName: string;
  soEnrol: string;
  empName: string;
  joiningDate: string;
  daysData: Record<string, number>;
  grandTotal: number;
}

export const SummaryImsReport = () => {
  // Dynamic Read From Local Storage for User ID
  const [userId, setUserId] = useState<string>('');

  // Date Filter States
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  // Items Filter States
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

  // UI States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [dynamicDayColumns, setDynamicDayColumns] = useState<string[]>([]);

  // Initial Setup: Date Calculation and API Call
  useEffect(() => {
    const savedUserId = localStorage.getItem('afml_user_enroll') || ''; 
    setUserId(savedUserId);

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    
    setFromDate(`${yyyy}-${mm}-01`);
    setToDate(`${yyyy}-${mm}-${dd}`);

    if (savedUserId) {
      apiClient.get<DropdownItem[]>(`/SummaryImsReport/parameters/channels/${savedUserId}`)
        .then((res) => {
          const filtered = res.data.filter(c => String(c.id) === '1');
          setChannels(filtered);

          if (filtered.length > 0) {
            setSelectedChannel('1');
            fetchZonesForChannelOne(savedUserId, '1');
          }
        })
        .catch((err) => {
          console.error("Error loading channels via apiClient:", err);
        });
    }

    apiClient.get<DropdownItem[]>(`/SummaryImsReport/parameters/product-categories`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("Error loading product categories via apiClient:", err);
      });
  }, []);

  const fetchZonesForChannelOne = async (uId: string, channelId: string) => {
    try {
      const res = await apiClient.get<DropdownItem[]>(`/SummaryImsReport/parameters/zones/${uId}/${channelId}`);
      setZones(res.data);
    } catch (err) {
      console.error("Error fetching initial zones:", err);
    }
  };

  // Cascading Handler 1: Channel Change -> Load Zones & Hide Old Report Grid
  const handleChannelChange = async (val: string) => {
    setSelectedChannel(val);
    setSelectedZone(''); setSelectedDivision(''); setSelectedArea(''); setSelectedTerritory('');
    setZones([]); setDivisions([]); setAreas([]); setTerritories([]);
    setReportData([]); 
    
    if (val) {
      try {
        const res = await apiClient.get<DropdownItem[]>(`/SummaryImsReport/parameters/zones/${userId}/${val}`);
        setZones(res.data);
      } catch (err) {
        console.error("Error fetching zones:", err);
      }
    }
  };

  // Cascading Handler 2: Zone Change -> Load Divisions & Hide Old Report Grid
  const handleZoneChange = async (val: string) => {
    setSelectedZone(val);
    setSelectedDivision(''); setSelectedArea(''); setSelectedTerritory('');
    setDivisions([]); setAreas([]); setTerritories([]);
    setReportData([]); 

    if (val) {
      try {
        const res = await apiClient.get<DropdownItem[]>(`/SummaryImsReport/parameters/divisions/${userId}/${val}`);
        setDivisions(res.data);
      } catch (err) {
        console.error("Error fetching divisions:", err);
      }
    }
  };

  // Cascading Handler 3: Division Change -> Load Areas & Hide Old Report Grid
  const handleDivisionChange = async (val: string) => {
    setSelectedDivision(val);
    setSelectedArea(''); setSelectedTerritory('');
    setAreas([]); setTerritories([]);
    setReportData([]); 

    if (val) {
      try {
        const res = await apiClient.get<DropdownItem[]>(`/SummaryImsReport/parameters/areas/${userId}/${val}`);
        setAreas(res.data);
      } catch (err) {
        console.error("Error fetching areas:", err);
      }
    }
  };

  // Cascading Handler 4: Area Change -> Load Territories & Hide Old Report Grid
  const handleAreaChange = async (val: string) => {
    setSelectedArea(val);
    setSelectedTerritory('');
    setTerritories([]);
    setReportData([]); 

    if (val) {
      try {
        const res = await apiClient.get<DropdownItem[]>(`/SummaryImsReport/parameters/territories/${userId}/${val}`);
        setTerritories(res.data);
      } catch (err) {
        console.error("Error fetching territories:", err);
      }
    }
  };

  // Main execution trigger handler for the pivot summary grid report
  const handleShowReport = async () => {
    if (!fromDate || !toDate || !selectedChannel) {
      alert("Opps! Please select From Date, To Date, and Channel.");
      return;
    }

    setIsLoading(true);
    setReportData([]);
    setDynamicDayColumns([]);

    try {
      const response = await apiClient.get<ReportRow[]>(`/SummaryImsReport/summary-ims-report`, {
        params: {
          fromDate: fromDate,
          toDate: toDate,
          prodCatId: selectedCategory || null,
          entryBy: String(userId).trim(),
          channelId: selectedChannel ? parseFloat(selectedChannel) : null,
          zoneId: selectedZone ? parseFloat(selectedZone) : null,
          divisionId: selectedDivision ? parseFloat(selectedDivision) : null,
          areaId: selectedArea ? parseFloat(selectedArea) : null,
          territoryId: selectedTerritory ? parseFloat(selectedTerritory) : null
        }
      });

      const fetchedData = response.data;

      if (fetchedData && fetchedData.length > 0) {
        const dayKeys = Object.keys(fetchedData[0].daysData).sort((a, b) => {
          const numA = parseInt(a.replace(/[^0-9]/g, ''), 10);
          const numB = parseInt(b.replace(/[^0-9]/g, ''), 10);
          return numA - numB;
        });
        setDynamicDayColumns(dayKeys);
      } else {
        const start = new Date(fromDate);
        const end = new Date(toDate);
        const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const cols = Array.from({ length: Math.min(diffDays, 31) }, (_, i) => `Day ${i + 1}`);
        setDynamicDayColumns(cols);
      }

      setReportData(fetchedData);
    } catch (err) {
      console.error("Error executing report:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 font-sans text-slate-800">
      
      {/* Unified Parent Container: Header and Controls are now grouped into one single element */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4 w-full">
        
        {/* Top Segment: Centered Titles with Right-aligned Excel Action */}
        <div className="flex items-center justify-between relative w-full pb-0">
          {/* Invisible spacer to handle the mathematical center balance */}
          <div className="w-[110px] hidden sm:block" /> 

          {/* Core Corporate Branding Titles */}
          <div className="text-center flex-1">
            <h3 className="text-base font-black text-slate-900 tracking-wide uppercase">
              AKIJ FLOUR MILLS LTD.
            </h3>
            <p className="text-[12px] font-bold text-[#D91656] uppercase tracking-wider mt-0.5">
              SUMMARY IMS REPORT
            </p>
          </div>

          {/* Export Utility Action Trigger */}
          <div className="min-w-[110px] text-right">
            <button className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-md shadow-sm cursor-pointer transition-colors">
              <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
            </button>
          </div>
        </div>

        {/* Bottom Segment: Parameter Filter Elements Layout Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-row gap-2 items-end w-full">
          
          {/* From Date Filter Picker */}
          <div className="flex-1 min-w-[110px] sm:min-w-0 flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase truncate">From Date</label>
            <input 
              type="date" 
              value={fromDate} 
              onChange={(e) => { 
                setFromDate(e.target.value); 
                setReportData([]); 
              }}
              className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-slate-50/50"
            />
          </div>

          {/* To Date Filter Picker */}
          <div className="flex-1 min-w-[110px] sm:min-w-0 flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase truncate">To Date</label>
            <input 
              type="date" 
              value={toDate} 
              onChange={(e) => { 
                setToDate(e.target.value); 
                setReportData([]); 
              }}
              className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-slate-50/50"
            />
          </div>

          {/* Corporate Sales Channel Selection Component */}
          <div className="flex-1 min-w-[120px] sm:min-w-0 flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase truncate">Channel</label>
            <select value={selectedChannel} onChange={(e) => { handleChannelChange(e.target.value); }}
              className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white truncate"
            >
              {channels.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Sales Distribution Zone Picker */}
          <div className="flex-1 min-w-[120px] sm:min-w-0 flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase truncate">Zone</label>
            <select value={selectedZone} onChange={(e) => { handleZoneChange(e.target.value); }} disabled={!selectedChannel}
              className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-400 truncate"
            >
              <option value="">- Select -</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>

          {/* Corporate Division Picker */}
          <div className="flex-1 min-w-[120px] sm:min-w-0 flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase truncate">Division</label>
            <select value={selectedDivision} onChange={(e) => { handleDivisionChange(e.target.value); }} disabled={!selectedZone}
              className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-400 truncate"
            >
              <option value="">- Select -</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Local Area Picker Configuration */}
          <div className="flex-1 min-w-[120px] sm:min-w-0 flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase truncate">Area</label>
            <select value={selectedArea} onChange={(e) => { handleAreaChange(e.target.value); }} disabled={!selectedDivision}
              className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-400 truncate"
            >
              <option value="">- Select -</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Regional Territory Picker Component */}
          <div className="flex-1 min-w-[120px] sm:min-w-0 flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase truncate">Territory</label>
            <select 
              value={selectedTerritory} 
              onChange={(e) => { 
                setSelectedTerritory(e.target.value); 
                setReportData([]); 
              }} 
              disabled={!selectedArea}
              className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-400 truncate"
            >
              <option value="">- Select -</option>
              {territories.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Product Category Dropdown */}
          <div className="flex-1 min-w-[120px] sm:min-w-0 flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase truncate">Product Cat</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => { 
                setSelectedCategory(e.target.value); 
                setReportData([]); 
              }}
              className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white truncate"
            >
              <option value="">- ALL -</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Action Form Submission Button */}
          <div className="flex-1 min-w-[120px] sm:min-w-0">
            <button 
              onClick={handleShowReport} disabled={isLoading}
              className="w-full flex items-center justify-center gap-1 h-[30px] text-white 
              font-bold text-[11px] rounded-md shadow-md cursor-pointer transition-all active:scale-95 disabled:bg-slate-400
              show-report"
            >
              Show Report
              {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
    
            </button>
          </div>

        </div>

      </div>

      {/* 3. Main Data Grid Table Engine Block */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 min-h-[350px]">
        
        {isLoading && <RGBSpinner />}

        {!isLoading && reportData.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-2">
            <Search className="w-8 h-8 text-slate-300 stroke-[1.5]" />
            <p className="text-xs font-medium">Please click 'Show Report'.</p>
          </div>
        )}

        {!isLoading && reportData.length > 0 && (
          <div className="w-full overflow-auto max-h-[430px]">
            <table className="w-full text-left border-collapse select-text">
              <thead>
                <tr className="table-header text-[10px] font-bold uppercase tracking-wider sticky top-0 z-10 whitespace-nowrap">
                  {/* <th className="p-2 border border-slate-200">Channel</th>
                  <th className="p-2 border border-slate-200">Zone</th>
                  <th className="p-2 border border-slate-200">Division</th>
                  <th className="p-2 border border-slate-200">Area</th> */}
                  <th className="p-2 border border-slate-200">Territory</th>
                  <th className="p-2 border border-slate-200">Distributor</th>
                  <th className="p-2 border border-slate-200">SO Enrol</th>
                  <th className="p-2 border border-slate-200">SO Name</th>
                  <th className="p-2 border border-slate-200">Joining Date</th>
                  
                  {dynamicDayColumns.map((dayCol, idx) => (
                    <th key={idx} className="p-2 border border-slate-200 text-center bg-[#FFD09B]">{dayCol}</th>
                  ))}
                  
                  <th className="p-2 border border-slate-200 text-center bg-[#FFD09B]">Grand Total</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-medium text-slate-700 divide-y divide-slate-200 whitespace-nowrap">
                {reportData.map((row, index) => (
                  <tr key={index} className="table-data">
                    {/* <td className="p-2 border border-slate-200 bg-[#fff5ce]">{row.channelName}</td>
                    <td className="p-2 border border-slate-200 bg-[#dbffcb]">{row.zoneName}</td>
                    <td className="p-2 border border-slate-200">{row.divisionName}</td>
                    <td className="p-2 border border-slate-200">{row.areaName}</td> */}
                    <td className="py-1 px-2 border border-slate-200 font-bold bg-[#fff6b3]">{row.territoryName}</td>
                    <td className="py-1 px-2 border border-slate-200 text-wrap whitespace-normal min-w-[280px] max-w-[450px]
                     bg-[#ecfae5]">{row.distribName}</td>
                    <td className="py-1 px-2 border border-slate-200 font-mono text-slate-500 bg-[#ffd6ba]">{row.soEnrol}</td>
                    <td className="py-1 px-2 border border-slate-200 bg-[#dbffcb]">{row.empName}</td>
                    <td className="py-1 px-2 border border-slate-200 text-slate-400 bg-[#fff5ce]">{row.joiningDate}</td>
                    
                    {dynamicDayColumns.map((dayCol, idx) => (
                      <td key={idx} className="py-1 px-2 border border-slate-200 text-right font-mono font-bold table-data">
                        {row.daysData[dayCol] !== undefined ? row.daysData[dayCol] : 0}
                      </td>
                    ))}
                    
                    <td className="py-1 px-2 border border-slate-200 text-right font-mono font-extrabold bg-[#dbffcb] table-data">
                      {row.grandTotal}
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