import { useEffect, useState, useRef } from 'react';
import { FromDateSelect } from '../../components/commonParameters/FromDateParameter';
import { ToDateSelect } from '../../components/commonParameters/ToDateParameter';
import { QuantityTypeSelect } from '../../components/commonParameters/QuantityTypeParameter';
import { DashboardPdfButton } from '../../components/commonParameters/DashboardPdfButton';
import { RGBSpinner } from '../../components/RGBSpinner';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updateReportFilters, ReportKeys } from '../../features/reportCache/reportFiltersCacheSlice';
import { useGetSalesDashboardSummaryQuery } from '../../services/salesDashboard/salesDashboardApi';
import { ChannelWiseLiftingChart } from './components/ChannelWiseLiftingChart';
import { ChannelWiseLiftingPieChart } from './components/ChannelWiseLiftingPieChart';
import { ChannelWiseSalesChart } from './components/ChannelWiseSalesChart';
import { ChannelWiseSalesPieChart } from './components/ChannelWiseSalesPieChart';
import { MonthlyChannelWiseLiftingChart } from './components/MonthlyChannelWiseLiftingChart';
import { MonthlyChannelWiseLiftingLine } from './components/MonthlyChannelWiseLiftingLine';
import { MonthlySalesVsLiftingLine } from './components/MonthlySalesVsLiftingLine'

export const SalesDashboard = () => {
  const dispatch = useAppDispatch();

  // Redux store filter cache read
  const cachedFilters = useAppSelector(
    (state) => state.reportFiltersCache[ReportKeys.SalesDashboard]
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
	const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const tomorrow = new Date ();
  tomorrow.setDate (today.getDate() + 1);

  const defaultFromDate = formatDate(firstDayOfMonth);
  const defaultToDate = formatDate(today);

  // States with Cache Fallbacks
  const [fromDate, setFromDate] = useState<string>(
    (cachedFilters?.fromDate as string) ?? defaultFromDate
  );
  const [toDate, setToDate] = useState<string>(
    (cachedFilters?.toDate as string) ?? defaultToDate
  );
const [selectedQuantityType, setSelectedQuantityType] = useState<number>(
    (cachedFilters?.selectedQuantityType as number) ?? 4
);


  // Automatic Redux Cache Sync
  useEffect(() => {
    dispatch(
      updateReportFilters({
        reportKey: ReportKeys.SalesDashboard,
        filters: {
          fromDate,
          toDate,
          selectedQuantityType,
        },
      })
    );
  }, [
    dispatch,
    fromDate,
    toDate,
    selectedQuantityType,
  ]);

	const { data : dashboardData, isLoading, isFetching, } = 
	useGetSalesDashboardSummaryQuery({
			fromDate,
			toDate,
			typeId: selectedQuantityType === 0 ? null : selectedQuantityType,
			entryBy: userId,
	});

	const summary = dashboardData?.summary;

  const channelWiseLifting =dashboardData?.channelWiseLifting ?? [];

  const channelWiseSales = dashboardData?.channelWiseSales ?? [];

	const monthlyChannelWiseLifting = dashboardData?.monthlyChannelWiseLifting ?? [];

	const monthlySalesVsLifting = dashboardData?.monthlySalesVsLifting ?? [];


  const formatDecimal = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(Number(num))) return '0.00';
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(num));
  };

  const showSpinner = isFetching || isLoading;

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
          <p className="page-sub-header">SALES DASHBOARD SUMMARY</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 items-end gap-1 w-full
				lg:w-[60%] mx-auto bg-transparent">
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
					<QuantityTypeSelect 
						value={selectedQuantityType} 
						onChange={(val) => { 
							setSelectedQuantityType(val); 
						}} 
						onError={setErrorBanner} 
						includeValues={[]}
					/>
				<DashboardPdfButton
					contentRef={reportPrintRef}
					hasData={Boolean(dashboardData)}
					documentTitle="Main Sales Dashboard"
					onError={setErrorBanner}
				/>
        </div>
      </div>

      {/* Main Master Report Container */}
      <div ref={reportPrintRef} className="w-full box-border printable-report-area">
        
        <div className="print-only-preview-header text-center mb-4 hidden print:block">
          <h2 className="page-main-header">AKIJ FLOUR MILLS LTD.</h2>
          <h3 className="page-sub-header">MAIN SALES DASHBOARD</h3>
        </div>

        {showSpinner && <RGBSpinner />} 
				
				{!showSpinner && channelWiseLifting.length > 0 && (
				<>
				<div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">

					<div
						className="rounded-xl p-4 min-h-[110px] flex flex-col justify-center
						bg-gradient-to-br from-cyan-100 via-blue-200 to-violet-300
						border border-cyan-200/60 shadow-md
						transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
					>
						<span className="text-xs font-bold text-blue-900 uppercase">
							Lifting
						</span>

						<span className="text-2xl font-bold text-slate-900 mt-1">
							{formatDecimal(summary?.liftingQty)}
						</span>

						<span className="text-[10px] font-medium text-slate-700">
							Total Lifting
						</span>
					</div>

					<div
						className="rounded-xl p-4 min-h-[110px] flex flex-col justify-center
						bg-gradient-to-br from-emerald-100 via-cyan-200 to-blue-300
						border border-emerald-200/60 shadow-md
						transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
					>
						<span className="text-xs font-bold text-emerald-900 uppercase">
							Sales
						</span>

						<span className="text-2xl font-bold text-slate-900 mt-1">
							{formatDecimal(summary?.salesQty)}
						</span>

						<span className="text-[10px] font-medium text-slate-700">
							Total Sales
						</span>
					</div>

					<div
						className="rounded-xl p-4 min-h-[110px] flex flex-col justify-center
						bg-gradient-to-br from-yellow-100 via-orange-200 to-pink-200
						border border-yellow-200/60 shadow-md
						transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
					>
						<span className="text-xs font-bold text-orange-900 uppercase">
							IMS
						</span>

						<span className="text-2xl font-bold text-slate-900 mt-1">
							{formatDecimal(summary?.imsQty)}
						</span>

						<span className="text-[10px] font-medium text-slate-700">
							Total IMS
						</span>
					</div>

					<div
						className="rounded-xl p-4 min-h-[110px] flex flex-col justify-center
						bg-gradient-to-br from-pink-200 via-rose-200 to-purple-300
						border border-pink-200/60 shadow-md
						transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
					>
						<span className="text-xs font-bold text-rose-900 uppercase">
							PENDING
						</span>

						<span className="text-2xl font-bold text-slate-900 mt-1">
							{formatDecimal(summary?.pendingQty)}
						</span>

						<span className="text-[10px] font-medium text-slate-700">
							Total Pending
						</span>
					</div>
				
				</div>


				<div className="dashboard-chart-grid grid grid-cols-1 lg:grid-cols-3 gap-3">

					<div className="dashboard-chart-card lg:col-span-2 bg-white rounded-xl border border-slate-200
					shadow-sm p-3">
						<div className="mb-2">
							<h3 className="text-sm font-bold text-slate-800">
								Channel Wise Lifting
							</h3>

							<p className="text-[10px] text-slate-500">
								Channel wise lifting quantity analysis
							</p>
						</div>

						<ChannelWiseLiftingChart
							data={channelWiseLifting}
						/>

					</div>

					<div className="dashboard-chart-card bg-white rounded-xl border border-slate-200 shadow-sm p-3">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-slate-800">
                Channel Wise Lifting
              </h3>
              <p className="text-[10px] text-slate-500">
                Channel wise Lifting quantity distribution
              </p>
            </div>

						<ChannelWiseLiftingPieChart
							data={channelWiseLifting}
						/>

          </div>

					<div className="dashboard-chart-card lg:col-span-2 bg-white rounded-xl border border-slate-200
					shadow-sm p-3">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-slate-800">
                Channel Wise Sales
              </h3>
              <p className="text-[10px] text-slate-500">
                Channel wise Sales quantity distribution
              </p>
            </div>

						<ChannelWiseSalesChart
							data={channelWiseSales}
						/>

          </div>

					<div className="dashboard-chart-card bg-white rounded-xl border border-slate-200 shadow-sm p-3">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-slate-800">
                Channel Wise Sales
              </h3>
              <p className="text-[10px] text-slate-500">
                Channel wise Sales quantity distribution
              </p>
            </div>

						<ChannelWiseSalesPieChart
							data={channelWiseSales}
						/>

          </div>

					<div className="dashboard-chart-card lg:col-span-3 bg-white rounded-xl border border-slate-200
					shadow-sm p-3">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-slate-800">
                Monthly Channel Wise Lifting
              </h3>
              <p className="text-[10px] text-slate-500">
                Channel wise Lifting quantity distribution
              </p>
            </div>

						<MonthlyChannelWiseLiftingChart
							monthlyData={monthlyChannelWiseLifting}
						/>

          </div>

					<div className="dashboard-chart-card lg:col-span-3 bg-white rounded-xl border border-slate-200
					shadow-sm p-3">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-slate-800">
                Monthly Channel Wise Lifting
              </h3>
              <p className="text-[10px] text-slate-500">
                Channel wise Lifting quantity distribution
              </p>
            </div>

						<MonthlyChannelWiseLiftingLine
							monthlyData={monthlyChannelWiseLifting}
						/>

          </div>

					<div className="dashboard-chart-card lg:col-span-3 bg-white rounded-xl border border-slate-200
					shadow-sm p-3">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-slate-800">
                Monthly Sales Vs Lifting
              </h3>
              <p className="text-[10px] text-slate-500">
                Monthly Sales Vs Lifting quantity distribution
              </p>
            </div>

						<MonthlySalesVsLiftingLine
							data={monthlySalesVsLifting}
						/>

          </div>

					

				</div>
				</>
				)}
      </div>
    </div>
  );
};