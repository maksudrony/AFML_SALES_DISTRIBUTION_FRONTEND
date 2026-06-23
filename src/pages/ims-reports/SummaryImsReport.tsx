import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import { RGBSpinner } from '../../components/RGBSpinner';
import { CommonDateRange } from '../../components/commonParameters/CommonDateRange';
import { CommonParameters } from '../../components/commonParameters/CommonParameters';
import { ProductCategorySelect } from '../../components/commonParameters/ProductCategoryParameter';
import { ShowReportButton } from '../../components/commonParameters/ShowReportButton';
import { ExcelDownloadButton } from '../../components/commonParameters/ExcelDownloadButton';
import type { ICommonParametersState } from '../../types/commonParameters';

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
  const [userId, setUserId] = useState<string>('');
  const [errorBanner, setErrorBanner] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [selectedProdCat, setSelectedProdCat] = useState<number | ''>('');

  const [locationValues, setLocationValues] = useState<ICommonParametersState>({
    channelId: 1, 
    zoneId: '',
    divisionId: '',
    areaId: '',
    territoryId: ''
  });

  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [dynamicDayColumns, setDynamicDayColumns] = useState<string[]>([]);

  useEffect(() => {
    setUserId(localStorage.getItem('afml_user_enroll') || '');
  }, []);

  const handleShowReport = async () => {
    setErrorBanner('');
    if (!fromDate || !toDate) {
      setErrorBanner("Opps! Dates cannot be null or empty. Please select From Date and To Date first.");
      return;
    }

    setReportData([]);
    setIsLoading(true);

    try {
      const response = await apiClient.get<ReportRow[]>('/SummaryImsReport/summary-ims-report', {
        params: {
          fromDate,
          toDate,
          prodCatId: selectedProdCat || null,
          entryBy: userId,
          channelId: locationValues.channelId,
          zoneId: locationValues.zoneId || null,
          divisionId: locationValues.divisionId || null,
          areaId: locationValues.areaId || null,
          territoryId: locationValues.territoryId || null
        }
      });

      const data = response.data;
      setReportData(data);

      if (data.length > 0) {
        setDynamicDayColumns(Object.keys(data[0].daysData || {}));
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const responseObj = (err as any).response;
        if (responseObj && responseObj.data) {
          setErrorBanner(responseObj.data.error || responseObj.data.message || "Server Error.");
          setIsLoading(false);
          return;
        }
      }
      setErrorBanner("Opps! Failed to connect with server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChangeReset = () => {
    setReportData([]);
  };

  return (
    <div className="w-full flex flex-col gap-2 font-sans text-slate-800 p-1 bg-white min-h-screen box-border shadow-none">
      
      {errorBanner && (
        <div className="p-2 bg-red-100 border border-red-300 rounded-md text-red-700 text-xs font-bold shadow-sm flex items-center justify-between w-full">
          <span>⚠️ {errorBanner}</span>
          <button type="button" onClick={() => setErrorBanner('')} className="text-red-500 hover:text-red-800 text-sm ml-2">✕</button>
        </div>
      )}

      {/* মেইন রাউন্ডেড বক্স কন্টেইনার */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm w-full box-border flex flex-col gap-1">
        
        {/* Top Segment */}
        <div className="flex items-center justify-between relative w-full">
          <div className="w-[120px] hidden sm:block" /> 
          
          <div className="text-center flex-1">
            <h3 className="text-[18px] font-black text-slate-900 tracking-wide uppercase">
              AKIJ FLOUR MILLS LTD.
            </h3>
            <p className="text-[15px] font-bold text-[#D91656] uppercase tracking-wider mt-0.5">
              SUMMARY IMS REPORT
            </p>
          </div>

          <ExcelDownloadButton disabled={false} onClick={() => alert("Excel downloading started...")} />
        </div>

        {/* 🚀 ফিক্স: grid-cols-9 এবং gap-2 এর মাধ্যমে ৯টি উপাদানের গ্যাপ এবং উইডথ গাণিতিকভাবে ১০০% সমান করা হলো */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-2 items-end w-full">
          
          <CommonDateRange 
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={(val) => { setFromDate(val); handleDateChangeReset(); }}
            onToDateChange={(val) => { setToDate(val); handleDateChangeReset(); }}
          />

          <CommonParameters 
            userId={userId}
            values={locationValues}
            onChange={(updated) => {
              setLocationValues(updated);
              setReportData([]); 
            }}
            onError={setErrorBanner}
          />

          <ProductCategorySelect 
            value={selectedProdCat}
            onChange={(val) => {
              setSelectedProdCat(val);
              setReportData([]);
            }}
            onError={setErrorBanner}
          />

          <ShowReportButton 
            onClick={handleShowReport}
            disabled={false}
            isLoading={isLoading}
          />

        </div>
      </div>

      {/* Main Data Grid Table Block */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 min-h-[350px] w-full box-border">
        
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
                    <td className="py-1 px-2 border border-slate-200 font-bold bg-[#fff6b3]">{row.territoryName}</td>
                    <td className="py-1 px-2 border border-slate-200 text-wrap whitespace-normal min-w-[280px] max-w-[450px] bg-[#ecfae5]">{row.distribName}</td>
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