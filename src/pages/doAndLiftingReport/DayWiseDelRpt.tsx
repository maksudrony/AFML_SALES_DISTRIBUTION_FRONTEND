import { useEffect, useState, useRef } from 'react';
import { FromDateSelect } from '../../components/commonParameters/FromDateParameter';
import { ToDateSelect } from '../../components/commonParameters/ToDateParameter';
import { FromTimeSelect } from '../../components/commonParameters/FromTimeParameter';
import { ToTimeSelect } from '../../components/commonParameters/ToTimeParameter';
import { ExcelDownloadButton } from '../../components/commonParameters/ExcelDownloadButton';
import { PdfPrintButton } from '../../components/commonParameters/PdfPrintButton';
import { RGBSpinner } from '../../components/RGBSpinner';
import { Search, X } from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updateReportFilters, ReportKeys } from '../../features/reportCache/reportFiltersCacheSlice';
import { ChannelSelect } from '../../components/commonParameters/ChannelParameter';
import { ChallanDistributorSelect } from '../../components/commonParameters/ChallanDistributorParameter';
import { useGetDayWiseDelRptMstQuery, useLazyGetDayWiseDelRptDtlQuery } from '../../services/doAndLiftingReportService/dayWiseDelRptApi'; // Using your existing service file as requested

export const DayWiseDelRpt = () => {
  const dispatch = useAppDispatch();

  // Redux store filter cache read
  const cachedFilters = useAppSelector(
    (state) => state.reportFiltersCache[ReportKeys.DayWiseDelRpt]
  );

  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.empEnroll || '';
  const empName = user?.empName || '';

  const [errorBanner, setErrorBanner] = useState<string>('');

  // Dom reference for printing container area (Master Report Only)
  const reportPrintRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const tomorrow = new Date ();
  tomorrow.setDate (today.getDate() + 1);

  const defaultFromDate = formatDate(today);
  const defaultToDate = formatDate(today);

  // States with Cache Fallbacks
  const [fromDate, setFromDate] = useState<string>(
    (cachedFilters?.fromDate as string) ?? defaultFromDate
  );
  const [toDate, setToDate] = useState<string>(
    (cachedFilters?.toDate as string) ?? defaultToDate
  );
  const [fromTime, setFromTime] = useState<number>(
    (cachedFilters?.fromTime as number) ?? 1
  );
  const [toTime, setToTime] = useState<number>(
    (cachedFilters?.toTime as number) ?? 25
  );
  const [selectedChannel, setSelectedChannel] = useState<number>(
    (cachedFilters?.selectedChannel as number) ?? 0
  );
  const [selectedDistributor, setSelectedDistributor] = useState<number>(
    (cachedFilters?.selectedDistributor as number) ?? 0
  );

  // Automatic Redux Cache Sync
  useEffect(() => {
    dispatch(
      updateReportFilters({
        reportKey: ReportKeys.DayWiseDelRpt,
        filters: {
          fromDate,
          toDate,
          fromTime,
          toTime,
          selectedChannel,
          selectedDistributor,
        },
      })
    );
  }, [
    dispatch,
    fromDate,
    toDate,
    fromTime,
    toTime,
    selectedChannel,
    selectedDistributor,
  ]);

  // Modal Dialog states for Details
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDcNoForHeader, setSelectedDcNoForHeader] = useState<string>('');

  // RTK Query hooks (Master & Detail)
  const { data: masterReport=[], isFetching: isMasterFetching, } = 
		useGetDayWiseDelRptMstQuery({
			fromDate: fromDate, 
			toDate: toDate,
			fromTime: fromTime,
			toTime: toTime,
			channelId: selectedChannel === 0 ? null : selectedChannel,
			distribId: selectedDistributor === 0 ? null : selectedDistributor,
			entryBy: userId});

  const [triggerDetailReport, { data: detailReport=[], isFetching: isDetailFetching }] = useLazyGetDayWiseDelRptDtlQuery();

  const formatDecimal = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(Number(num))) return '';
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(num));
  };

  const handleDcClick = async (dcId: number, dcNo: string) => {
    setSelectedDcNoForHeader(dcNo);
    setIsModalOpen(true);

    try {
      await triggerDetailReport({
        dcId
      }, false).unwrap();
    } catch (err) {
      console.error(err);
      setErrorBanner("Opps! Failed to load details for Challan No: " + dcNo);
      setIsModalOpen(false);
    } 
  };

  const showSpinner = isMasterFetching;

  return (
    <div className="w-full flex flex-col gap-2 font-sans text-slate-800 p-1 bg-white 
    box-border shadow-none">
      
      {/* Error Banner */}
      {errorBanner && (
        <div className="p-1 bg-red-100 border border-red-300 rounded-md text-red-700 text-[15px] font-bold flex items-center justify-between w-full">
          <span>🤒 {errorBanner} ❗</span>
          <button type="button" onClick={() => setErrorBanner('')} className="text-red-500 hover:text-red-800 text-sm ml-2">✕</button>
        </div>
      )}

      {/* Parameter Control Panel */}
      <div className="report-parameter-box p-3 rounded-xl shadow-sm w-full flex flex-col gap-1">
        <div className="text-center w-full">
          <h3 className="page-main-header">AKIJ FLOUR MILLS LTD.</h3>
          <p className="page-sub-header">DAY WISE DELIVERY REPORT</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 items-end gap-1 w-full
				lg:w-[80%] mx-auto bg-transparent">
					<FromDateSelect
						fromDate={fromDate}
						onFromDateChange={(val) => { 
              setFromDate(val); 
            }}   
					/>
					<FromTimeSelect
						fromTime={fromTime}
						onFromTimeChange={(val) => { 
              setFromTime(val); 
            }}
						onError={setErrorBanner}
					/>
					<ToDateSelect
						toDate={toDate}
						onToDateChange={(val) => { 
              setToDate(val); 
            }}   
					/>
					<ToTimeSelect
						toTime={toTime}
						onToTimeChange={(val) => { 
              setToTime(val); 
            }}
						onError={setErrorBanner}
					/>
					<ChannelSelect 
            userId={userId} 
            value={selectedChannel} 
            onChange={(val) => { 
              setSelectedChannel(val); 
            }} 
            onError={setErrorBanner} 
						includeValues={[]}
          />
					<ChallanDistributorSelect 
						fromDate={fromDate} 
						toDate={toDate}
						channelId={selectedChannel}
						userId={userId} 
						value={selectedDistributor} 
						onChange={(val) => { 
              setSelectedDistributor(val); 
            }} 
						onError={setErrorBanner} 
					/>
					<ExcelDownloadButton 
						tableId="day-wise-del-mst-table" 
						reportTitle="Day Wise Delivery Report" 
						fileName="Day_Wise_Delivery_Report" 
						hasData={masterReport.length > 0}
						onError={setErrorBanner} 
					/>
					<PdfPrintButton 
						contentRef={reportPrintRef} 
						hasData={masterReport.length > 0} 
						documentTitle="Day Wise Delivery Report"
						orientation="portrait"
						onError={setErrorBanner} 
					/>
        </div>
      </div>

      {/* Main Master Report Container */}
      <div ref={reportPrintRef} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 max-h-[425px] w-full box-border printable-report-area">
        
        <div className="print-only-preview-header text-center mb-4 hidden print:block">
          <h2 className="page-main-header">AKIJ FLOUR MILLS LTD.</h2>
          <h3 className="page-sub-header">DAY WISE DELIVERY REPORT</h3>
        </div>

        {showSpinner && <RGBSpinner />} 

        {!showSpinner && masterReport.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-2">
            <Search className="w-8 h-8 text-slate-300" />
            <p className="text-xs font-medium">Please click 'Show Report'.</p>
          </div>
        )}

        {!showSpinner && masterReport.length > 0 && (
          <div className="w-full overflow-auto max-h-[420px]">
            <table id="day-wise-del-mst-table" className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="h-6 text-[10px] font-bold uppercase whitespace-nowrap">
                  <th className="p-1 px-2 table-header sticky top-0 z-30">DC No</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">DC Date</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Confirm Date</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">DO No</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Channel</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Zone</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Distributor Code</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Distributor</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Challan Qty (Bag)</th>
                </tr>
              </thead>
              <tbody className="text-[11px] divide-y divide-slate-200">
                {masterReport.map((row, index) => {
									const isGrandTotal = row.distribName === 'Grand Total';

                  let rowTotalClass = "table-data";

                  if (isGrandTotal) {
                    rowTotalClass = "bg-orange-200 text-rose-700";
                  } 
                  return (
                    <tr key={index} className={rowTotalClass}>
                      <td className="py-0 px-2 border border-slate-200 font-bold">
												<button
													type="button"
													onClick={() => handleDcClick(row.dcId, row.dcNo)}
													className="text-pink-600 text-left focus:outline-none"
												>
													{row.dcNo}
												</button>
                        
                      </td>
                      <td className="py-0 px-2 border border-slate-200">{row.dcDate}</td>
                      <td className="py-0 px-2 border border-slate-200">{row.confirmDate}</td>
                      <td className="py-0 px-2 border border-slate-200">{row.doNo}</td>
                      <td className="py-0 px-2 border border-slate-200">{row.channelName}</td>
                      <td className="py-0 px-2 border border-slate-200">{row.zoneName}</td>
                      <td className="py-0 px-2 border border-slate-200">{row.distribCode}</td>
                      <td className="py-0 px-2 border border-slate-200 font-semibold
											min-w-[250px] max-w-[500px] whitespace-normal text-[13px]
											">{row.distribName}</td>
                      <td className={`py-0 px-2 border border-slate-200 text-end text-[13px]
                      ${isGrandTotal ? 'bg-orange-200 text-rose-700 font-bold' 
												: 
											'bg-green-100 text-rose-900 font-semibold'}`}
                      >
                        {formatDecimal(row.challanQty)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Embedded Detail Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800">CHALLAN DETAILS</h4>
                <p className="text-xs text-slate-500">Challan Number: <span className="font-bold text-indigo-600">{selectedDcNoForHeader}</span></p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto flex-1 min-h-[250px] relative">
              {isDetailFetching && <RGBSpinner />}

              {!isDetailFetching && detailReport.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-1">
                  <Search className="w-6 h-6 text-slate-300" />
                  <p className="text-xs font-medium">No details found for this Challan.</p>
                </div>
              )}

              {!isDetailFetching && detailReport.length > 0 && (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                      <tr className="bg-slate-100 h-6 text-[10px] font-bold uppercase whitespace-nowrap">
                        <th className="p-1 px-3 table-header sticky top-0">Product Code</th>
                        <th className="p-1 px-3 table-header sticky top-0">Product Name</th>
                        <th className="p-1 px-3 table-header sticky top-0 text-center">Unit</th>
                        <th className="p-1 px-3 table-header sticky top-0 text-end">Challan Qty (Bag)</th>
                        <th className="p-1 px-3 table-header sticky top-0 text-end">Product Price</th>
                        <th className="p-1 px-3 table-header sticky top-0 text-end">Challan Value</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px] divide-y divide-slate-200">
                      {detailReport.map((row, index) => {
                        const isGrandTotal = row.prodCode === 'Grand Total';

                        let rowTotalClass = "table-data";

                        if (isGrandTotal) {
                          rowTotalClass = "bg-orange-200 text-rose-700";
                        } 
                        return (
                          <tr key={index} className={rowTotalClass}>
                            <td className={`py-1.5 px-3 border border-slate-100
                              ${isGrandTotal ? 'text-[14px] font-semibold' 
                              : 
                              'text-[11px] font-medium'}`}>{row.prodCode}</td>
                            <td className="py-1.5 px-3 border border-slate-100 text-[12px]">{row.prodName}</td>
                            <td className="py-1.5 px-3 border border-slate-100 text-center">{row.unitName}</td>
                            <td className={`py-1.5 px-3 border border-slate-100 text-end font-semibold
                              ${isGrandTotal ? 'bg-orange-200 text-rose-700 text-[14px]'
                                :
                                'bg-green-100 text-rose-900 text-[12px]'
                              }`}
                            >
                              {formatDecimal(row.challanQty)}
                            </td>
                            <td className={`py-1.5 px-3 border border-slate-100 text-end font-semibold
                              ${isGrandTotal ? 'bg-orange-200 text-rose-700 text-[14px]'
                                :
                                'bg-green-100 text-rose-900 text-[12px]'
                              }`}
                            >
                              {formatDecimal(row.productPrice)}
                            </td>
                            <td className={`py-1.5 px-3 border border-slate-100 text-end font-semibold
                              ${isGrandTotal ? 'bg-orange-200 text-rose-700 text-[14px]'
                                :
                                'bg-green-100 text-rose-900 text-[12px]'
                              }`}
                            >
                              {formatDecimal(row.challanValue)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 bg-[#E90074] hover:bg-rose-700 text-white rounded
								text-xs font-semibold shadow-sm transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};