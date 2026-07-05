import { useState } from 'react';
import { Search } from 'lucide-react';
import { RGBSpinner } from '../../components/RGBSpinner';
import { CommonDateRange } from '../../components/commonParameters/CommonDateRange';

import { ChannelSelect } from '../../components/commonParameters/ChannelParameter';
import { ZoneSelect } from '../../components/commonParameters/ZoneParameter';
import { DivisionSelect } from '../../components/commonParameters/DivisionParameter';
import { AreaSelect } from '../../components/commonParameters/AreaParameter';
import { TerritorySelect } from '../../components/commonParameters/TerritoryParameter';

import { ProductCategorySelect } from '../../components/commonParameters/ProductCategoryParameter';
import { ShowReportButton } from '../../components/commonParameters/ShowReportButton';
import { ExcelDownloadButton } from '../../components/commonParameters/ExcelDownloadButton';
import type { ICommonParametersState } from '../../types/commonParameters';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useLazyGetSummaryImsReportQuery } from '../../services/summaryImsReportApi';
import type { IImsReportRow } from '../../services/summaryImsReportApi';


export const SummaryImsReport = () => {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.empEnroll || '';

  const [errorBanner, setErrorBanner] = useState<string>('');
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

  const [showReport, setShowReport] = useState<boolean>(false);
  
  const [isLocalLoading, setIsLocalLoading] = useState<boolean>(false);

  const [triggerReport, { data: reportData = [], isFetching }] = useLazyGetSummaryImsReportQuery();

  const formatDecimal = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(Number(num))) return '0.00';
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(num));
  };

  const handleLocationChange = (field: keyof ICommonParametersState, value: number | '') => {
    setShowReport(false);
    setLocationValues((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'channelId') {
        updated.zoneId = ''; updated.divisionId = ''; updated.areaId = ''; updated.territoryId = '';
      } else if (field === 'zoneId') {
        updated.divisionId = ''; updated.areaId = ''; updated.territoryId = '';
      } else if (field === 'divisionId') {
        updated.areaId = ''; updated.territoryId = '';
      } else if (field === 'areaId') {
        updated.territoryId = '';
      }
      return updated;
    });
  };

  const handleShowReport = async () => {
    setErrorBanner('');
    if (!fromDate || !toDate) {
      setErrorBanner("Opps! Dates cannot be null!! Please select From Date and To Date first!");
      return;
    }

    setShowReport(false);
    setIsLocalLoading(true); // spinner started

    try {
      const res = await triggerReport({
        fromDate,
        toDate,
        prodCatId: selectedProdCat === '' ? null : selectedProdCat, // '' এর বদলে null
        entryBy: userId,
        channelId: locationValues.channelId === '' ? null : locationValues.channelId,
        zoneId: locationValues.zoneId === '' ? null : locationValues.zoneId,
        divisionId: locationValues.divisionId === '' ? null : locationValues.divisionId,
        areaId: locationValues.areaId === '' ? null : locationValues.areaId,
        territoryId: locationValues.territoryId === '' ? null : locationValues.territoryId
      }, false).unwrap();

      if (res) {
        setShowReport(true);
      }
    } catch (err) {
      console.error(err);
      setErrorBanner("Opps! Failed to connect with server or generate report");
    } finally {
      setIsLocalLoading(false); 
    }
  };

  const showSpinner = isFetching || isLocalLoading;

  return (
    <div className="w-full flex flex-col gap-2 font-sans text-slate-800 p-1 bg-white min-h-screen box-border">
      {errorBanner && (
        <div className="p-1 bg-red-100 border border-red-300 rounded-md text-red-700 text-[15px] font-bold flex items-center justify-between w-full">
          <span>🤒 {errorBanner} ❗</span>
          <button type="button" onClick={() => setErrorBanner('')} className="text-red-500 hover:text-red-800 text-sm ml-2">✕</button>
        </div>
      )}

      <div className="bg-gradient-to-r from-orange-200 to-red-50 p-3 rounded-xl border border-slate-200 shadow-sm w-full box-border flex flex-col gap-1">
        <div className="text-center w-full">
          <h3 className="text-[16px] font-black text-slate-900 uppercase">AKIJ FLOUR MILLS LTD.</h3>
          <p className="text-[14px] font-bold text-[#D91656] uppercase mt-0.5">SUMMARY IMS REPORT</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-10 items-end gap-1.5 w-full bg-transparent">
          <CommonDateRange
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={(val) => { setFromDate(val); setShowReport(false);; }} 
            onToDateChange={(val) => { setToDate(val); setShowReport(false);; }}     
          />

          <ChannelSelect 
            userId={userId} 
            value={locationValues.channelId} 
            onlyConsumer={true} 
            onChange={(val) => handleLocationChange('channelId', val)} 
            onError={setErrorBanner} 
          />
          <ZoneSelect 
            userId={userId} 
            channelId={locationValues.channelId} 
            value={locationValues.zoneId} 
            onChange={(val) => handleLocationChange('zoneId', val)} 
            onError={setErrorBanner} 
          />
          <DivisionSelect 
            userId={userId} 
            zoneId={locationValues.zoneId} 
            value={locationValues.divisionId} 
            onChange={(val) => handleLocationChange('divisionId', val)} 
            onError={setErrorBanner} 
          />
          <AreaSelect 
            userId={userId} 
            divisionId={locationValues.divisionId} 
            value={locationValues.areaId} 
            onChange={(val) => handleLocationChange('areaId', val)} 
            onError={setErrorBanner} 
          />
          <TerritorySelect 
            userId={userId} 
            areaId={locationValues.areaId} 
            value={locationValues.territoryId} 
            onChange={(val) => handleLocationChange('territoryId', val)} 
            onError={setErrorBanner} 
          />

          <ProductCategorySelect 
            value={selectedProdCat} 
            onChange={(val) => { setSelectedProdCat(val); setShowReport(false); }} 
            onError={setErrorBanner} 
          />

          <div className="w-full">
            <ShowReportButton onClick={handleShowReport} buttonAnimate={false} isLoading={showSpinner} />
          </div>
          <div className="w-full">
            <ExcelDownloadButton tableId="summary-ims-report-table" reportTitle="Akij Flour Mills Ltd. - Summary IMS Report" fileName="Summary IMS Report" hasData={reportData.length > 0} onError={setErrorBanner} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 min-h-[350px] w-full box-border">
        {showSpinner && <RGBSpinner />}
        
        {!showSpinner && ( !showReport || reportData.length === 0 ) && (
          <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-2">
            <Search className="w-8 h-8 text-slate-300" />
            <p className="text-xs font-medium">Please click 'Show Report'.</p>
          </div>
        )}
        
        {!showSpinner && showReport && reportData.length > 0 && (
          <div className="w-full overflow-auto max-h-[420px]">
            <table id="summary-ims-report-table" className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="text-[10px] font-bold uppercase text-slate-900 whitespace-nowrap">
                  <th className="p-1 px-2 bg-[#D4F6FF]">Territory</th>
                  <th className="p-1 px-2 bg-[#D4F6FF]">Distributor</th>
                  <th className="p-1 px-2 bg-[#D4F6FF]">SO Enrol</th>
                  <th className="p-1 px-2 bg-[#D4F6FF]">SO Name</th>
                  <th className="p-1 px-2 bg-[#D4F6FF]">Joining Date</th>
                  {Object.keys(reportData[0]?.daysData || {}).map((dayCol, idx) => (
                    <th key={idx} className="p-1 px-2 text-center bg-[#FFD09B]">{dayCol}</th>
                  ))}
                  <th className="p-1 px-2 text-center bg-[#FFD09B]">Grand Total</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-medium text-slate-700 divide-y divide-slate-200 whitespace-nowrap">
                {reportData.map((row: IImsReportRow, index: number) => (
                  <tr key={index} className="table-data">
                    <td className="py-0 px-2 border border-slate-200 font-bold bg-[#fff6b3]">{row.territoryName}</td>
                    <td className="py-0 px-2 border border-slate-200 text-wrap whitespace-normal min-w-[280px] max-w-[450px] bg-[#ecfae5]">{row.distribName}</td>
                    <td className="py-0 px-2 border border-slate-200 text-slate-600 bg-[#ffd6ba]">{row.soEnrol}</td>
                    <td className="py-0 px-2 border border-slate-200 bg-[#dbffcb]">{row.empName}</td>
                    <td className="py-0 px-2 border border-slate-200 text-slate-600 bg-[#fff5ce]">{row.joiningDate}</td>
                    {Object.keys(reportData[0]?.daysData || {}).map((dayCol, idx) => (
                      <td key={idx} className="py-0 px-2 border border-slate-200 text-right font-mono">
                        {row.daysData?.[dayCol] !== undefined ? formatDecimal(row.daysData[dayCol]) : 0}
                      </td>
                    ))} 
                    <td className="py-0 px-2 border border-slate-200 text-right bg-[#dbffcb]">{formatDecimal(row.grandTotal)}</td>
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