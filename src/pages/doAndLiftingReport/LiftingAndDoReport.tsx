import { useEffect, useState, useRef } from 'react';
import { CommonDateRange } from '../../components/commonParameters/CommonDateRange';
import { CommonDayDateRange } from '../../components/commonParameters/CommonDayDateRange';
import { ShowReportButton } from '../../components/commonParameters/ShowReportButton'; 
import { ExcelDownloadButton } from '../../components/commonParameters/ExcelDownloadButton';
import { ExcelDownloadButtonV2 } from '../../components/commonParameters/ExcelDownloadButtonV2'
import { PdfPrintButton } from '../../components/commonParameters/PdfPrintButton';
import { RGBSpinner } from '../../components/RGBSpinner';
import { Search } from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useLazyGetLiftingAndDoReportQuery } from '../../services/doAndLiftingReportService/liftingAndDoReportApi';
import { SalesChannelTypeSelect } from '../../components/commonParameters/SalesChannelTypeParameter';
import { ChannelSelect } from '../../components/commonParameters/ChannelParameter';
import { QuantityTypeSelect } from '../../components/commonParameters/QuantityTypeParameter';
import { ReportTypeSelect } from '../../components/commonParameters/ReportTypeParameter';


export const LiftingAndDoReport = () => {
  
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.empEnroll || '';
  const empName = user?.empName || '';
  const tokenId = useAppSelector((state) => state.auth.token) || '';

  const [errorBanner, setErrorBanner] = useState<string>('');

  // 3. Create DOM reference pointer for printing container area
  const reportPrintRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date) => 
  {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const today = new Date();

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const previousDay = new Date();
  previousDay.setDate(today.getDate() - 1);

  const defaultFromDate = formatDate(firstDayOfMonth);
  const defaultToDate = formatDate(previousDay);

  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);

  const [dayFromDate, setDayFromDate] = useState(defaultToDate);
  const [dayToDate, setDayToDate] = useState(defaultToDate);

  const [selectedChannelType, setSelectedChannelType] = useState<number | ''>(0);
  const [selectedChannel, setSelectedChannel] = useState<number | ''>('');
  const [selectedQuantityType, setSelectedQuantityType] = useState<number | ''>(1);
  const [selectedReportType, setSelectedReportType] = useState<number | ''>(1);


  const [showReport, setShowReport] = useState<boolean>(false);

  const [isLocalLoading, setIsLocalLoading] = useState<boolean>(false);

  const [triggerReport, { data: reportResponse, isFetching }] = useLazyGetLiftingAndDoReportQuery();

  const reportHeader = reportResponse?.reportHeader;
  const reportData = reportResponse?.reportRows ?? [];

  // Count the number of rows for each channel name
  const TableChannelCount: Record<string, number> = {};

  for (let i = 0; i < reportData.length; i++) {
    const tableChannel = reportData[i].channelName;
    TableChannelCount[tableChannel] = (TableChannelCount[tableChannel] || 0) + 1;
  }

  const formatDecimal = (num: number | undefined | null): string => {
    if (!num || isNaN(Number(num))) return '';
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(num));
  };

  const getPrintDateTime = (): string => {
    const now = new Date();
    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    return `${String(now.getDate()).padStart(2, '0')}-${months[now.getMonth()]}-${now.getFullYear()} ${String(now.getHours() % 12 || 12).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
  };

  const handleShowReport = async () => {

    setErrorBanner('');
    if (!fromDate || !toDate) {
      setErrorBanner("Opps! Dates cannot be null!! Please select From Date and To Date first!");
      return;
    }
    else if (!dayFromDate || !dayToDate) {
      setErrorBanner("Opps! Day Dates cannot be null!! Please select Day From Date and Day To Date first!");
      return;
    }
    else if (!selectedQuantityType) {
      setErrorBanner("Opps! Quantity Type cannot be null!! Please select a Quantity Type first!");
      return;
    }
    else if (!selectedReportType) {
      setErrorBanner("Opps! Report Type cannot be null!! Please select a Report Type first!");
      return;
    }
    else if (selectedChannelType === '') {
      setErrorBanner("Opps! Channel Type cannot be null!! Please select a Channel Type first!");
      return;
    }
    
    setShowReport(false);
    setIsLocalLoading(true);

    try {
      const res = await triggerReport({
        fromDate,
        toDate,
        dayFromDate,
        dayToDate,
        channelId: selectedChannel === '' ? null : selectedChannel,
        channelTypeId: selectedChannelType, 
        typeId: selectedQuantityType,
        reportTypeId: selectedReportType,
        entryBy: userId
      }, false).unwrap();
      
      if (res) {
        // console.log(res);
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
    <div className="w-full flex flex-col gap-2 font-sans text-slate-800 p-1 bg-white min-h-screen box-border shadow-none">
      {errorBanner && (
        <div className="p-1 bg-red-100 border border-red-300 rounded-md text-red-700 text-[15px] font-bold flex items-center justify-between w-full">
          <span>🤒 {errorBanner} ❗</span>
          <button type="button" onClick={() => setErrorBanner('')} className="text-red-500 hover:text-red-800 text-sm ml-2">✕</button>
        </div>
      )}

      <div className="report-parameter-box p-3 rounded-xl shadow-sm w-full flex flex-col gap-1">
        <div className="text-center w-full">
          <h3 className="page-main-header">AKIJ FLOUR MILLS LTD.</h3>
          <p className="page-sub-header">LIFTING AND DO REPORT</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-11 items-end gap-1 w-full bg-transparent ">
          <CommonDateRange
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={(val) => { setFromDate(val); setShowReport(false); }} 
            onToDateChange={(val) => { setToDate(val); setShowReport(false); }}   
          />
          <CommonDayDateRange
            dayFromDate={dayFromDate}
            dayToDate={dayToDate}
            onDayFromDateChange={(val) => { setDayFromDate(val); setShowReport(false); }} 
            onDayToDateChange={(val) => { setDayToDate(val); setShowReport(false); }}   
          />
          <SalesChannelTypeSelect 
            userId={userId}
            value={selectedChannelType} 
            onChange={(val) => { setSelectedChannelType(val); setShowReport(false); }} 
            onError={setErrorBanner} 
          />
          <ChannelSelect 
            userId={userId} 
            value={selectedChannel} 
            onlyConsumer={false} 
            onChange={(val) => { setSelectedChannel(val); setShowReport(false); }} 
            onError={setErrorBanner} 
          />
          <QuantityTypeSelect 
            value={selectedQuantityType} 
            onChange={(val) => { setSelectedQuantityType(val); setShowReport(false); }} 
            onError={setErrorBanner} 
          />
          <ReportTypeSelect 
            value={selectedReportType} 
            onChange={(val) => { setSelectedReportType(val); setShowReport(false); }} 
            onError={setErrorBanner} 
            excludeValues={[3, 4]}
          />
          <ShowReportButton 
            onClick={handleShowReport} 
            buttonAnimate={false} 
            isLoading={showSpinner} 
          />
          {/*<ExcelDownloadButton 
            tableId="lifting-and-do-report-table" 
            reportTitle="Akij Flour Mills Ltd. - Lifting and DO Report" 
            fileName="Lifting and DO Report" 
            hasData={reportData.length > 0} 
            onError={setErrorBanner} 
          />*/}
          <ExcelDownloadButtonV2 
            tableId="lifting-and-do-report-table" 
            reportTitle="Lifting and DO Report" 
            fileName="Lifting and DO Report" 
            hasData={showReport && reportData.length > 0} 
            generatedBy={empName}
            companyName="AKIJ FLOUR MILLS LTD."
            dateRange={{
              from: fromDate,
              to: toDate
            }}
            dayRange={{
              from: dayFromDate,
              to: dayToDate
            }}
            onError={setErrorBanner} 
          />
          <PdfPrintButton 
            contentRef={reportPrintRef} 
            hasData={showReport && reportData.length > 0} 
            documentTitle="Lifting And Do Report"
            orientation="portrait"
            onError={setErrorBanner} 
          />
        </div>
      </div> 
      
      {!showSpinner && showReport && reportHeader?.reportType && (
        <div className="border border-rose-200/50 bg-gradient-to-r
      from-orange-300 via-orange-100 to-rose-200
        shadow-sm shadow-rose-200 p-0.5 rounded-xl shadow-sm w-full flex flex-col gap-1">
          <p className="text-[13px] font-bold text-slate-700 text-center">
            {reportHeader.reportType}
          </p>
        </div>
      )}

      <div ref={reportPrintRef} className="bg-white rounded-xl border border-slate-200 
      shadow-sm overflow-hidden flex-1 
      max-h-[425px] w-full box-border printable-report-area">

        <div className="print-only-preview-header text-center mb-4 hidden print:block">
          <h2 className="page-main-header">AKIJ FLOUR MILLS LTD.</h2>
          <h3 className="page-sub-header">LIFTING AND DO REPORT</h3>
        </div>

        {showSpinner && <RGBSpinner />} 
        
        {!showSpinner && ( !showReport || reportData.length === 0 ) && (
          <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-2">
            <Search className="w-8 h-8 text-slate-300" />
            <p className="text-xs font-medium">Please click 'Show Report'.</p>
          </div>
        )}
        
        {!showSpinner && showReport && reportData.length > 0 && (
          <div className="w-full overflow-auto max-h-[420px]">

            <table id="lifting-and-do-report-table" className="w-full text-left border-separate 
            border-spacing-0">
              <thead>
                <tr className="h-7 text-[10px] font-bold uppercase whitespace-nowrap">
                  {/* <th className="p-1 px-2 table-header">Channel Type</th>
                  <th className="p-1 px-2 table-header">Channel Id</th> */}
                  <th rowSpan={2} className="p-0 px-2 table-header sticky top-0 z-30">
                    Channel Name
                  </th>

                  <th rowSpan={2} className="p-0 px-2 table-header sticky top-0 z-30">
                    Product Code
                  </th>

                  <th rowSpan={2} className="p-0 px-2 table-header sticky top-0 z-30">
                    Product Name
                  </th>

                  <th colSpan={5} className="p-0 px-2 bg-teal-200 text-slate-900 font-bold text-center sticky top-0 z-30">
                    {reportHeader?.monthlyDateRange}
                  </th>

                  <th colSpan={5} className="p-0 px-2 bg-emerald-200 text-slate-900 font-bold text-center sticky top-0 z-30">
                    {reportHeader?.dailyDateRange}
                  </th>
                </tr>
                <tr className="text-[10px] font-bold uppercase whitespace-nowrap">
                  <th className="p-0 px-2 bg-purple-100 text-slate-900 font-bold sticky top-7 z-20">Consumer</th>
                  <th className="p-0 px-2 bg-purple-100 text-slate-900 font-bold sticky top-7 z-20">Bulk</th>  
                  <th className="p-0 px-2 bg-purple-100 text-slate-900 font-bold sticky top-7 z-20">Corporate</th>
                  <th className="p-0 px-2 bg-purple-100 text-slate-900 font-bold sticky top-7 z-20">Commodity Trading</th>
                  <th className="p-0 px-2 bg-purple-100 text-slate-900 font-bold sticky top-7 z-20">Monthly Total</th>

                  <th className="p-0 px-2 bg-fuchsia-200 text-slate-900 font-bold sticky top-7 z-20">Consumer</th>
                  <th className="p-0 px-2 bg-fuchsia-200 text-slate-900 font-bold sticky top-7 z-20">Bulk</th>
                  <th className="p-0 px-2 bg-fuchsia-200 text-slate-900 font-bold sticky top-7 z-20">Corporate</th>
                  <th className="p-0 px-2 bg-fuchsia-200 text-slate-900 font-bold sticky top-7 z-20">Commodity Trading</th>
                  <th className="p-0 px-2 bg-fuchsia-200 text-slate-900 font-bold sticky top-7 z-20">Daily Total</th>
                </tr>
              </thead> 
              
              <tbody className="text-[11px] divide-y divide-slate-200 text-end">
                {reportData.map((row, index) => {
                  const previousChannel = reportData[index - 1]?.channelName;

                  const isGrandTotal = row.productName === 'Grand Total';
                  const isSubTotal = row.productName.includes('Total');

                  let rowTotalClass = "table-data";

                  if (isGrandTotal) {
                    rowTotalClass = "bg-grand-total";
                  } else if (isSubTotal) {
                    rowTotalClass = "bg-sub-total";
                  }

                  return (
                    <tr key={index} className={rowTotalClass}>   
                      {/* <td className="py-0 px-2 border border-slate-200">{row.channelType}</td>
                      <td className="py-0 px-2 border border-slate-200">{row.channelId}</td> */}
                      {
                        row.channelName !== previousChannel &&
                        <td className="py-0 px-2 border border-slate-200 text-center" 
                          rowSpan={TableChannelCount[row.channelName]}>
                          {row.channelName}
                        </td>
                      }
                      <td className="py-0 px-2 border border-slate-200">{row.productId}</td>
                      <td className="py-0 px-2 border border-slate-200 text-left
                      min-w-[350px] max-w-[500px] whitespace-normal text-[12px]"
                      >{row.productName}</td>

                      <td className={`py-0 px-2 border border-slate-200
                      ${isGrandTotal ? 'bg-green-200 text-rose-900 text-[13px]'
                        : isSubTotal ? 'bg-yellow-100 text-pink-800 text-[13px]' : 'bg-transparent'}
                      `}
                      >{formatDecimal(row.monthlyConsumer)}</td>
                      <td className={`py-0 px-2 border border-slate-200 
                      ${isGrandTotal ? 'bg-green-200 text-rose-900 text-[13px]'
                        : isSubTotal ? 'bg-yellow-100 text-pink-800 text-[13px]' : 'bg-transparent'}
                      `}
                      >{formatDecimal(row.monthlyBulk)}</td>
                      <td className={`py-0 px-2 border border-slate-200
                      ${isGrandTotal ? 'bg-green-200 text-rose-900 text-[13px]'
                        : isSubTotal ? 'bg-yellow-100 text-pink-800 text-[13px]' : 'bg-transparent'}
                      `}
                      >{formatDecimal(row.monthlyCorporate)}</td>
                      <td className={`py-0 px-2 border border-slate-200
                      ${isGrandTotal ? 'bg-green-200 text-rose-900 text-[13px]'
                        : isSubTotal ? 'bg-yellow-100 text-pink-800 text-[13px]' : 'bg-transparent'}
                      `}
                      >{formatDecimal(row.monthlyCommodityTrading)}</td>
                      <td className={`py-0 px-2 border border-slate-200
                      ${isGrandTotal ? 'bg-green-200 text-rose-900 text-[13px]'
                        : isSubTotal ? 'bg-yellow-100 text-pink-800 text-[13px]' : 'bg-transparent'}
                      `}
                      >{formatDecimal(row.monthlyTotal)}</td>


                      <td className={`py-0 px-2 border border-slate-200
                      ${isGrandTotal ? 'bg-emerald-300 text-rose-900 text-[13px]'
                        : isSubTotal ? 'bg-orange-200 text-pink-800 text-[13px]' : 'bg-transparent'}
                      `}
                      >{formatDecimal(row.dailyConsumer)}</td>
                      <td className={`py-0 px-2 border border-slate-200
                      ${isGrandTotal ? 'bg-emerald-300 text-rose-900 text-[13px]'
                        : isSubTotal ? 'bg-orange-200 text-pink-800 text-[13px]' : 'bg-transparent'}
                      `}
                      >{formatDecimal(row.dailyBulk)}</td>
                      <td className={`py-0 px-2 border border-slate-200
                      ${isGrandTotal ? 'bg-emerald-300 text-rose-900 text-[13px]'
                        : isSubTotal ? 'bg-orange-200 text-pink-800 text-[13px]' : 'bg-transparent'}
                      `}
                      >{formatDecimal(row.dailyCorporate)}</td>
                      <td className={`py-0 px-2 border border-slate-200
                      ${isGrandTotal ? 'bg-emerald-300 text-rose-900 text-[13px]'
                        : isSubTotal ? 'bg-orange-200 text-pink-800 text-[13px]' : 'bg-transparent'}
                      `}
                      >{formatDecimal(row.dailyCommodityTrading)}</td>
                      <td className={`py-0 px-2 border border-slate-200
                      ${isGrandTotal ? 'bg-emerald-300 text-rose-900 text-[13px]'
                        : isSubTotal ? 'bg-orange-200 text-pink-800 text-[13px]' : 'bg-transparent'}
                      `}
                      >{formatDecimal(row.dailyTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};