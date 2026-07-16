import { useState } from 'react';
import { Search } from 'lucide-react';
import { RGBSpinner } from '../../components/RGBSpinner';
import { FromDateSelect } from '../../components/commonParameters/FromDateParameter';
import { ToDateSelect } from '../../components/commonParameters/ToDateParameter';

import { ChannelSelect } from '../../components/commonParameters/ChannelParameter';
import { ZoneSelect } from '../../components/commonParameters/ZoneParameter';
import { DivisionSelect } from '../../components/commonParameters/DivisionParameter';
import { AreaSelect } from '../../components/commonParameters/AreaParameter';
import { TerritorySelect } from '../../components/commonParameters/TerritoryParameter';

import { ProductCategorySelect } from '../../components/commonParameters/ProductCategoryParameter';
import { ShowReportButton } from '../../components/commonParameters/ShowReportButton';
import { ExcelDownloadButton } from '../../components/commonParameters/ExcelDownloadButton';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useLazyGetSummaryImsReportQuery } from '../../services/summaryImsReportApi';
import type { IImsReportRow } from '../../services/summaryImsReportApi';


export const SummaryImsReport = () => {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.empEnroll || '';

  const [errorBanner, setErrorBanner] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [selectedProdCat, setSelectedProdCat] = useState<number>(0);

  const [selectedChannel, setSelectedChannel] = useState<number>(1);
  const [selectedZone, setSelectedZone] = useState<number>(0);
  const [selectedDivision, setSelectedDivision] = useState<number>(0);
  const [selectedArea, setSelectedArea] = useState<number>(0);
  const [selectedTerritory, setSelectedTerritory] = useState<number>(0);

  const [showReport, setShowReport] = useState<boolean>(false);
  
  const [isLocalLoading, setIsLocalLoading] = useState<boolean>(false);

  const [triggerReport, { data: reportData = [], isFetching }] = useLazyGetSummaryImsReportQuery();

  const formatDecimal = (num: number | undefined | null): string => {
    if (!num || isNaN(Number(num))) return '';
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(num));
  };

  const handleShowReport = async () => {
    setErrorBanner('');
    if (!fromDate || !toDate) {
      setErrorBanner("Opps! Dates cannot be null!! Please select From Date and To Date first!");
      return;
    }
    else if (selectedChannel === 0) {
      setErrorBanner("Opps! Channel Type cannot be null!! Please select a Channel Type first!");
      return;
    }

    setShowReport(false);
    setIsLocalLoading(true); // spinner started

    try {
      const res = await triggerReport({
        fromDate,
        toDate,
        prodCatId: selectedProdCat === 0 ? null : selectedProdCat,
        entryBy: userId,
        channelId: selectedChannel === 0 ? null : selectedChannel,
        zoneId: selectedZone === 0 ? null : selectedZone,
        divisionId: selectedDivision === 0 ? null : selectedDivision,
        areaId: selectedArea === 0 ?null : selectedArea,
        territoryId: selectedTerritory === 0 ? null : selectedTerritory
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

      <div className="p-3 rounded-xl border border-emerald-200/60 bg-gradient-to-r
      from-teal-200 via-purple-100 to-pink-200 shadow-sm  
      shadow-violet-200 w-full flex flex-col gap-1">
        <div className="text-center w-full">
          <h3 className="page-main-header">AKIJ FLOUR MILLS LTD.</h3>
          <p className="page-sub-header">SUMMARY IMS REPORT</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-10 items-end gap-1.5 w-full bg-transparent">
          <FromDateSelect
						fromDate={fromDate}
						onFromDateChange={(val) => { setFromDate(val); }}   
					/>
          <ToDateSelect
						toDate={toDate}
						onToDateChange={(val) => { setToDate(val); }}   
					/>

          <ChannelSelect 
            userId={userId} 
            value={selectedChannel} 
            onChange={(val) => {
              setSelectedChannel(val);
              setSelectedZone(0);
              setSelectedDivision(0);
              setSelectedArea(0);
              setSelectedTerritory(0);
              setShowReport(false);
            }} 
            onError={setErrorBanner} 
            includeValues={[1]}
          />
          <ZoneSelect 
            userId={userId} 
            channelId={selectedChannel} 
            value={selectedZone} 
            onChange={(val) => {
              setSelectedZone(val);
              setSelectedDivision(0);
              setSelectedArea(0);
              setSelectedTerritory(0);
              setShowReport(false);
            }} 
            onError={setErrorBanner} 
          />
          <DivisionSelect 
            userId={userId} 
            zoneId={selectedZone} 
            value={selectedDivision} 
            onChange={(val) => {
              setSelectedDivision(val);
              setSelectedArea(0);
              setSelectedTerritory(0);
              setShowReport(false);
            }} 
            onError={setErrorBanner} 
          />
          <AreaSelect 
            userId={userId} 
            divisionId={selectedDivision} 
            value={selectedArea} 
            onChange={(val) => {
              setSelectedArea(val);
              setSelectedTerritory(0);
              setShowReport(false);
            }} 
            onError={setErrorBanner} 
          />
          <TerritorySelect 
            userId={userId} 
            areaId={selectedArea} 
            value={selectedTerritory} 
            onChange={(val) => {
              setSelectedTerritory(val);
              setShowReport(false);
            }} 
            onError={setErrorBanner} 
          />

          <ProductCategorySelect 
            value={selectedProdCat} 
            onChange={(val) => { 
              setSelectedProdCat(val); 
              setShowReport(false); 
            }} 
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 
      min-h-[420px] w-full box-border">
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
                <tr className="text-[10px] font-bold uppercase whitespace-nowrap">
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Territory</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Distributor</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">SO Enrol</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">SO Name</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Joining Date</th>
                  {Object.keys(reportData[0]?.daysData || {}).map((dayCol, idx) => (
                    <th key={idx} className="p-1 px-2 text-center bg-[#FFD09B] sticky top-0 z-30">{dayCol}</th>
                  ))}
                  <th className="p-1 px-2 text-center bg-[#FFD09B] sticky top-0 z-30">Grand Total</th>
                </tr>
              </thead>
              <tbody className="text-[11px] divide-y divide-slate-200 whitespace-nowrap">
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
                    <td className="py-0 px-2 border border-slate-200 text-right bg-[#dbffcb] text-indigo-900">{formatDecimal(row.grandTotal)}</td>
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