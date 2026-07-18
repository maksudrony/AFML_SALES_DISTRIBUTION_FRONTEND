import { useEffect, useState, useRef } from 'react';
import { FromDateSelect } from '../../components/commonParameters/FromDateParameter';
import { ToDateSelect } from '../../components/commonParameters/ToDateParameter';
import { ExcelDownloadButton } from '../../components/commonParameters/ExcelDownloadButton';
import { PdfPrintButton } from '../../components/commonParameters/PdfPrintButton';
import { ShowReportButton } from '../../components/commonParameters/ShowReportButton';
import { RGBSpinner } from '../../components/RGBSpinner';
import { Search, X } from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updateReportFilters, ReportKeys } from '../../features/reportCache/reportFiltersCacheSlice';
import { ChannelSelect } from '../../components/commonParameters/ChannelParameter';
import { useLazyGetDistribWisePendingRptQuery } from '../../services/doAndLiftingReportService/distribWisePendingRptApi';
import type { IDistribWisePendingRptRow } from '../../services/doAndLiftingReportService/distribWisePendingRptApi';
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
    (cachedFilters?.selectedZone as number) ?? 0
  );
  const [selectedDivision, setSelectedDivision] = useState<number>(
    (cachedFilters?.selectedDivision as number) ?? 0
  );
  const [selectedArea, setSelectedArea] = useState<number>(
    (cachedFilters?.selectedArea as number) ?? 0
  );
  const [selectedTerritory, setSelectedTerritory] = useState<number>(
    (cachedFilters?.selectedTerritory as number) ?? 0
  );
  const [selectedDistributor, setSelectedDistributor] = useState<number>(
    (cachedFilters?.selectedDistributor as number) ?? 0
  );
	const [selectedProduct, setSelectedProduct] = useState<number>(
		(cachedFilters?.selectedProduct as number) ?? 0
	);

	const [selectedOrderType, setSelectedOrderType] = useState<number>(
		(cachedFilters?.selectedOrderType as number) ?? 1
	)

  // Automatic Redux Cache Sync
  useEffect(() => {
    dispatch(
      updateReportFilters({
        reportKey: ReportKeys.DistribWisePendingRpt,
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
    if (selectedOrderType === null ) {
      setErrorBanner("Opps! Please Select Order Type!");
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
				distribId: selectedDistributor === 0 ? null : selectedDistributor,
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
    <div className="w-full flex flex-col gap-2 font-sans text-slate-800 p-1 bg-white  box-border shadow-none">
      
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
          <p className="page-sub-header">DISTRIBUTOR WISE PRNDING REPORT</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 items-end gap-1 w-full
			  mx-auto bg-transparent">
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
              setShowReport(false);
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
          <div className="w-full flex flex-col">
            <label htmlFor="order-type-select" className="text-[10px] font-bold text-slate-700 uppercase truncate">Order Type</label>
            <select 
              id="order-type-select" 
              title="Select Order Type" 
              value={selectedOrderType} 
              onChange={(e) => {
                 setSelectedOrderType(Number(e.target.value));
                 setShowReport(false);
              }} 
              className="border border-slate-300 rounded-md px-1 text-[11px] font-semibold w-full h-[30px] 
              focus:outline-none focus:border-blue-500 bg-white truncate box-border cursor-pointer">
              {/* <option value={0}>--Select--</option> */}
              {ORDER_TYPE_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
          <ShowReportButton 
            onClick={handleShowReport} 
            buttonAnimate={false} 
            isLoading={showSpinner} 
          />
					<ExcelDownloadButton 
						tableId="distrib-wise-pending-rpt-table" 
						reportTitle="Distributor Wise Pending Report" 
						fileName="Distributor Wise Pending Report" 
						hasData={reportData.length > 0}
						onError={setErrorBanner} 
					/>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 
      max-h-[425px] w-full box-border">
        {showSpinner && <RGBSpinner />}
        
        {!showSpinner && ( !showReport || reportData.length === 0 ) && (
          <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-2">
            <Search className="w-8 h-8 text-slate-300" />
            <p className="text-xs font-medium">Please click 'Show Report'.</p>
          </div>
        )}
        
        {!showSpinner && showReport && reportData.length > 0 && (
          <div className="w-full overflow-auto max-h-[420px]">
            <table id="distrib-wise-pending-rpt-table" className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="text-[10px] font-bold uppercase whitespace-nowrap">
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Channel</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Division</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Territory</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Distributor</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Do No</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Po No</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Delivery Point</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Do Date</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Product</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Do Qty (Bag)</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Do Qty (M.Ton)</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Pending (Bag)</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Pending (M.Ton)</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Rate</th>
                </tr>
              </thead> 
              <tbody className="text-[11px] divide-y divide-slate-200 text-left">
                {reportData.map((row: IDistribWisePendingRptRow, index: number) => {
                  const isGrandTotal = row.channelName === 'Grand Total';
                  // const isSubTotal = row.prodCode.includes('Total');

                  let rowTotalClass = "table-data";

                  if (isGrandTotal) {
                    rowTotalClass = "bg-grand-total";
                  } 
                  // else if (isSubTotal) {
                  //   rowTotalClass = "bg-sub-total";
                  // }
                  return (
                    <tr key={index} className={rowTotalClass}>
                      <td className={`py-0 px-2 border border-slate-200 text-left min-w-[140px]
                        ${isGrandTotal ? 'bg-transparent text-white' : 'bg-[#ffd6ba] text-slate-600'}
                        `}>{row.channelName}</td>
                      <td className="py-0 px-2 border border-slate-200 min-w-[150px]">{row.divisionName}</td>
                      <td className="py-0 px-2 border border-slate-200 min-w-[150px]">{row.territoryName}</td>
                      <td className="py-0 px-2 border border-slate-200
                      text-left min-w-[350px] max-w-[500px] whitespace-normal
                      ">{row.distribName}</td>
                      <td className="py-0 px-2 border border-slate-200 min-w-[150px]">{row.doNo}</td>
                      <td className="py-0 px-2 border border-slate-200">{row.poNo}</td>
                      <td className="py-0 px-2 border border-slate-200
                      text-left min-w-[350px] max-w-[500px] whitespace-normal
                      ">{row.deliveryPoint}</td>
                      <td className="py-0 px-2 border border-slate-200 min-w-[100px]">{row.doDate}</td>
                      <td className="py-0 px-2 border border-slate-200
                      text-left min-w-[350px] max-w-[500px] whitespace-normal
                      ">{row.prodName}</td>
                      <td className="py-0 px-2 border border-slate-200 text-end">{formatDecimal(row.doQtyBag)}</td>
                      <td className="py-0 px-2 border border-slate-200 text-end">{formatDecimal(row.doQtyTon)}</td>
                      <td className="py-0 px-2 border border-slate-200 text-end">{formatDecimal(row.pendingQtyBag)}</td>
                      <td className="py-0 px-2 border border-slate-200 text-end">{formatDecimal(row.pendingQtyTon)}</td>
                      <td className="py-0 px-2 border border-slate-200 text-end">{formatDecimal(row.productPrice)}</td>
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