import { useEffect, useState, useRef } from 'react';
import { FromDateSelect } from '../../components/commonParameters/FromDateParameter';
import { ToDateSelect } from '../../components/commonParameters/ToDateParameter';
import { QuantityTypeSelect } from '../../components/commonParameters/QuantityTypeParameter';
import { PdfPrintButton } from '../../components/commonParameters/PdfPrintButton';
import { RGBSpinner } from '../../components/RGBSpinner';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updateReportFilters, ReportKeys } from '../../features/reportCache/reportFiltersCacheSlice';
import { useGetSalesDashboardSummaryQuery } from '../../services/salesDashboard/salesDashboardApi';
import ReactECharts from 'echarts-for-react';

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

    const { data : dashboardData, isLoading, isFetching, isError, } = 
    useGetSalesDashboardSummaryQuery({
        fromDate,
        toDate,
        typeId: selectedQuantityType === 0 ? null : selectedQuantityType,
        entryBy: userId,
    });

	const summary = dashboardData?.summary;

  const channelWiseLifting =dashboardData?.channelWiseLifting ?? [];

  const channelWiseSales = dashboardData?.channelWiseSales ?? [];

	const channelWiseLiftingOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },

    legend: {
      top: 0,
      data: ['Lifting Qty', 'Trend'],
    },

    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '15%',
      containLabel: true,
    },

    xAxis: {
      type: 'category',
      data: channelWiseLifting.map(
        (item) => item.channelName
      ),

      axisLabel: {
        interval: 0,
        rotate: channelWiseLifting.length > 5 ? 25 : 0,
        fontSize: 10,
      },
    },

    yAxis: {
      type: 'value',
      name: 'Quantity',
    },

    series: [
      {
        name: 'Lifting Qty',
        type: 'bar',

        data: channelWiseLifting.map(
          (item) => item.liftingQty
        ),

        barMaxWidth: 45,

        label: {
          show: true,
          position: 'top',
          fontSize: 10,
          formatter: (params: any) =>
            formatDecimal(params.value),
        },
      },

      {
        name: 'Trend',
        type: 'line',

        smooth: true,

        data: channelWiseLifting.map(
          (item) => item.liftingQty
        ),

        symbol: 'circle',
        symbolSize: 7,

        lineStyle: {
          width: 3,
        },
      },
    ],
  };



	const channelWiseSalesPieOption = {
    tooltip: {
      trigger: 'item',

      formatter: (params: any) => {
        return `
          ${params.name}<br/>
          Quantity: ${formatDecimal(params.value)}<br/>
          Percentage: ${params.percent}%
        `;
      },
    },

    legend: {
      type: 'scroll',
      bottom: 0,
      left: 'center',
      textStyle: {
        fontSize: 10,
      },
    },

    series: [
      {
        name: 'Sales Qty',
        type: 'pie',

        radius: ['35%', '70%'],

        center: ['50%', '45%'],

        avoidLabelOverlap: true,

        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2,
        },

        label: {
          show: true,
          formatter: '{b}\n{d}%',
          fontSize: 10,
        },

        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold',
          },
        },

        data: channelWiseSales.map((item) => ({
          name: item.channelName,
          value: item.salesQty,
        })),
      },
    ],
  };


  const formatDecimal = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(Number(num))) return '0.00';
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(num));
  };

  const showSpinner = !dashboardData && (isFetching || isLoading);

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
					<PdfPrintButton 
						contentRef={reportPrintRef} 
						hasData={Boolean(dashboardData)} 
						documentTitle="Day Wise Delivery Report"
						orientation="portrait"
						onError={setErrorBanner} 
					/>
        </div>
      </div>

      {/* Main Master Report Container */}
      <div ref={reportPrintRef} className="w-full box-border printable-report-area">
        
        <div className="print-only-preview-header text-center mb-4 hidden print:block">
          <h2 className="page-main-header">AKIJ FLOUR MILLS LTD.</h2>
          <h3 className="page-sub-header">DAY WISE DELIVERY REPORT</h3>
        </div>

        {showSpinner && <RGBSpinner />} 
				
				<div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">

          <div className="bg-blue-100 rounded-xl p-4 border border-blue-200 shadow-sm
					min-h-[110px] flex flex-col justify-center">
            <span className="text-xs font-semibold text-blue-700 uppercase">
              Lifting
            </span>
            <span className="text-2xl font-bold text-slate-800 mt-1">
              {formatDecimal(summary?.liftingQty)}
            </span>
            <span className="text-[10px] text-slate-500">
              Total Lifting
            </span>
          </div>

					<div className="bg-cyan-100 rounded-xl p-4 border border-cyan-200 shadow-sm
					min-h-[110px] flex flex-col justify-center">
            <span className="text-xs font-semibold text-cyan-700 uppercase">
              Sales
            </span>
            <span className="text-2xl font-bold text-slate-800 mt-1">
              {formatDecimal(summary?.salesQty)}
            </span>
            <span className="text-[10px] text-slate-500">
              Total Sales
            </span>
          </div>

					<div className="bg-amber-100 rounded-xl p-4 border border-amber-200 shadow-sm
					min-h-[110px] flex flex-col justify-center">
            <span className="text-xs font-semibold text-amber-700 uppercase">
              IMS
            </span>
            <span className="text-2xl font-bold text-slate-800 mt-1">
              {formatDecimal(summary?.imsQty)}
            </span>
            <span className="text-[10px] text-slate-500">
              Total IMS
            </span>
          </div>

					<div className="bg-rose-100 rounded-xl p-4 border border-rose-200 shadow-sm
					min-h-[110px] flex flex-col justify-center">
            <span className="text-xs font-semibold text-rose-700 uppercase">
              PENDING
            </span>
            <span className="text-2xl font-bold text-slate-800 mt-1">
              {formatDecimal(summary?.pendingQty)}
            </span>
            <span className="text-[10px] text-slate-500">
              Total Pending
            </span>
          </div>
				
				</div>


				<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

					<div className="lg:col-span-2 bg-white rounded-xl border border-slate-200
					shadow-sm p-3">
						<div className="mb-2">
							<h3 className="text-sm font-bold text-slate-800">
								Channel Wise Lifting
							</h3>

							<p className="text-[10px] text-slate-500">
								Channel wise lifting quantity analysis
							</p>
						</div>

						{channelWiseLifting.length > 0 ? (
							<ReactECharts
								option={channelWiseLiftingOption}
								style={{
									height: '320px',
									width: '100%',
								}}
								notMerge={true}
								lazyUpdate={true}
							/>
						) : (
							<div className="h-[320px] flex items-center justify-center text-slate-400 text-sm">
								No Channel Wise Lifting Data Found
							</div>
						)}
					</div>

					<div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-slate-800">
                Channel Wise Sales
              </h3>
              <p className="text-[10px] text-slate-500">
                Channel wise sales quantity distribution
              </p>
            </div>

            {channelWiseSales.length > 0 ? (
              <ReactECharts
                option={channelWiseSalesPieOption}
                style={{
                  height: '320px',
                  width: '100%',
                }}
                notMerge={true}
                lazyUpdate={true}
              />
            ) : (
              <div className="h-[320px] flex items-center justify-center text-slate-400 text-sm">
                No Channel Wise Sales Data Found
              </div>
            )}

          </div>

				</div>

      </div>
    </div>
  );
};