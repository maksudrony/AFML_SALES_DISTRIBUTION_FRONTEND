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
import { useLazyGetDistribWisePendingRptQuery } from '../../services/doAndLiftingReportService/distribWisePendingRptApi'
import { ZoneSelect } from '../../components/commonParameters/ZoneParameter';
import { DivisionSelect } from '../../components/commonParameters/DivisionParameter';
import { AreaSelect } from '../../components/commonParameters/AreaParameter';
import { TerritorySelect } from '../../components/commonParameters/TerritoryParameter';
import { ChannelDistributorSelect } from '../../components/commonParameters/ChannelDistributorParameter';
import { ProductParameterSelect } from '../../components/commonParameters/ProductParameter';

interface IOrderTypeOption {
  value: number;
  label: string;
}

const ORDER_TYPE_OPTIONS : IOrderTypeOption [] = [
  { value: 1, label: 'DO Date Desc' },
  { value: 2, label: 'Rate Asc' },
  { value: 3, label: 'Rate Desc' },
];

export const DistribWisePendingRpt = () => {
  const dispatch = useAppDispatch();

  // Redux store filter cache read
  const cachedFilters = useAppSelector(
    (state) => state.reportFiltersCache[ReportKeys.DistribWisePendingRpt]
  );

  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.empEnroll || '';
  const empName = user?.empName || '';

  const [errorBanner, setErrorBanner] = useState<string>('');

  // Dom reference for printing container area (Master Report Only)
  const reportPrintRef = useRef<HTMLDivElement>(null);

  // States with Cache Fallbacks
  const [fromDate, setFromDate] = useState<string>(
    (cachedFilters?.fromDate as string) ?? null
  );
  const [toDate, setToDate] = useState<string>(
    (cachedFilters?.toDate as string) ?? null
  );
  const [selectedChannel, setSelectedChannel] = useState<number>(
    (cachedFilters?.selectedChannel as number) ?? 0
  );
  const [selectedZone, setSelectedZone] = useState<number>(
    (cachedFilters?.selectedChannel as number) ?? 0
  );
  const [selectedDivision, setSelectedDivision] = useState<number>(
    (cachedFilters?.selectedChannel as number) ?? 0
  );
  const [selectedArea, setSelectedArea] = useState<number>(
    (cachedFilters?.selectedChannel as number) ?? 0
  );
  const [selectedTerritory, setSelectedTerritory] = useState<number>(
    (cachedFilters?.selectedChannel as number) ?? 0
  );
  const [selectedDistributor, setSelectedDistributor] = useState<number>(
    (cachedFilters?.selectedDistributor as number) ?? 0
  );
	const [selectedProduct, setSelectedProduct] = useState<number>(
		(cachedFilters?.selectedChannelType as number) ?? 0
	);

	const [selectedOrderType, setSelectedOrderType] = useState<number>(
		(cachedFilters?.selectedOrderType as number) ?? 1
	)

  // Automatic Redux Cache Sync
  useEffect(() => {
    dispatch(
      updateReportFilters({
        reportKey: ReportKeys.DayWiseDelRpt,
        filters: {
          fromDate,
          toDate,
					selectedChannel,
					selectedZone,
					selectedDivision,
					selectedArea,
					selectedTerritory,
          selectedDistributor,
					selectedProduct,
					selectedOrderType
        },
      })
    );
  }, [
    dispatch,
    fromDate,
    toDate,
		selectedChannel,
		selectedZone,
		selectedDivision,
		selectedArea,
		selectedTerritory,
		selectedDistributor,
		selectedProduct,
		selectedOrderType
  ]);

	const [showReport, setShowReport] = useState<boolean>(false);

	const [isLocalLoading, setIsLocalLoading] = useState<boolean>(false);

	const [triggerReport, { data: reportData = [], isFetching }] = useLazyGetDistribWisePendingRptQuery();

  const formatDecimal = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(Number(num))) return '';
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(num));
  };

   const handleShowReport = async () => {

    setErrorBanner('');
    if (!fromDate || !toDate) {
      setErrorBanner("Opps! Dates cannot be null!! Please select From Date and To Date first!");
      return;
    }
    
    setShowReport(false);
    setIsLocalLoading(true);

    try {
      const res = await triggerReport({
        fromDate,
        toDate,
				channelId: selectedChannel === 0 ? null : selectedChannel,
				zoneId: selectedZone === 0 ? null : selectedZone,
				divisionId: selectedDivision === 0 ? null : selectedDivision,
				areaId: selectedArea === 0 ? null : selectedArea,
				territoryId: selectedTerritory === 0 ? null : selectedTerritory,
				productId: selectedProduct === 0 ? null : selectedProduct,
				distribId: selectedChannel === 0 ? null : selectedChannel,
				orderTypeId: selectedOrderType
      }, false).unwrap();
      
      if (res) {
        //console.log(res);
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
					<ToDateSelect
						toDate={toDate}
						onToDateChange={(val) => { 
              setToDate(val); 
            }}   
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
					<ChannelDistributorSelect 
						channelId={selectedChannel}
						userId={userId} 
						value={selectedDistributor} 
						onChange={(val) => { 
              setSelectedDistributor(val); 
            }} 
						onError={setErrorBanner} 
					/>
          <ProductParameterSelect 
            value={selectedProduct} 
            onChange={(val) => { 
              setSelectedProduct(val); 
              setShowReport(false); 
            }} 
            onError={setErrorBanner} 
          />
					<select
						value={selectedOrderType}
						onChange={(e) => setSelectedOrderType(Number(e.target.value))}
					>
						{ORDER_TYPE_OPTIONS.map((item) => (
							<option key={item.value} value={item.value}>
								{item.label}
							</option>
						))}
					</select>
					<ExcelDownloadButton 
						tableId="distrib-wise-pending-rpt-table" 
						reportTitle="Distributor Wise Pending Report" 
						fileName="Distributor Wise Pending Report" 
						hasData={reportData.length > 0}
						onError={setErrorBanner} 
					/>
					<PdfPrintButton 
						contentRef={reportPrintRef} 
						hasData={reportData.length > 0} 
						documentTitle="Distributor Wise Pending Report"
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
    </div>
  );
};