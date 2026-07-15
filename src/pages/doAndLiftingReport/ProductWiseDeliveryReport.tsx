import { useEffect, useState } from 'react';
import { CommonDateRange } from '../../components/commonParameters/CommonDateRange';
import { ProductParameterSelect } from '../../components/commonParameters/ProductParameter';
import { ShowReportButton } from '../../components/commonParameters/ShowReportButton'; 
import { ExcelDownloadButton } from '../../components/commonParameters/ExcelDownloadButton';
import { RGBSpinner } from '../../components/RGBSpinner';
import { Search } from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useLazyGetProductWiseDeliveryReportQuery } from '../../services/productWiseDeliveryReportApi';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updateReportFilters, ReportKeys } from '../../features/reportCache/reportFiltersCacheSlice';


export const ProductWiseDeliveryReport = () => {

  const dispatch = useAppDispatch();

  const cachedFilters = useAppSelector (
    (state) => state.reportFiltersCache [ReportKeys.ProductWiseDeliveryRpt]
  )

  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.empEnroll || '';
  const tokenId = useAppSelector((state) => state.auth.token) || '';

  const [errorBanner, setErrorBanner] = useState<string>('');

  /*const [fromDate, setFromDate] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<number | ''>('');*/

  const [fromDate, setFromDate] = useState(
		(cachedFilters?.fromDate as string) ?? ''
	);

	const [toDate, setToDate] = useState(
		(cachedFilters?.toDate as string) ?? ''
	);
  
	const [selectedProduct, setSelectedProduct] = useState<number | ''>(
		(cachedFilters?.selectedChannelType as number | '') ?? ''
	);

  // Report filter parameter change hole Redux cache automatically update hobe
  useEffect(() => {
  dispatch(
    updateReportFilters({
      reportKey: ReportKeys.ProductWiseDeliveryRpt,
      filters: {
        fromDate,
        toDate,
        selectedProduct,
      },
    })
  );
  }, [
    dispatch,
    fromDate,
    toDate,
    selectedProduct,
  ]);

  const [showReport, setShowReport] = useState<boolean>(false);

  const [isLocalLoading, setIsLocalLoading] = useState<boolean>(false);

  const [triggerReport, { data: reportData = [], isFetching }] = useLazyGetProductWiseDeliveryReportQuery();


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
    
    setShowReport(false);
    setIsLocalLoading(true);

    try {
      const res = await triggerReport({
        fromDate,
        todate: toDate,
        entryBy: userId,
        productId: selectedProduct === '' ? null : selectedProduct
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
          <p className="page-sub-header">PRODUCT WISE DELIVERY REPORT</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 items-end gap-3 w-full lg:w-[70%] mx-auto ">
          <CommonDateRange
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={(val) => { setFromDate(val); setShowReport(false);; }} 
            onToDateChange={(val) => { setToDate(val); setShowReport(false); }}   
          />
          <ProductParameterSelect 
            value={selectedProduct} 
            onChange={(val) => { setSelectedProduct(val); setShowReport(false); }} 
            onError={setErrorBanner} 
          />
          <ShowReportButton onClick={handleShowReport} buttonAnimate={false} isLoading={showSpinner} />
          <ExcelDownloadButton 
            tableId="delivery-report-table" 
            reportTitle="Akij Flour Mills Ltd. - Product Wise Delivery Report" 
            fileName="Product Wise Delivery Report" 
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
            <table id="delivery-report-table" className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="text-[10px] font-bold uppercase whitespace-nowrap">
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Product Code</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Product Name</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Delivery (Bag)</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Delivery (Ton)</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Delivery (Value)</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Rate Per Bag</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Rate Per MT</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Return (Bag)</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Return (Value)</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Return (Ton)</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Net Delivery (Bag)</th>
                  <th className="p-1 px-2 table-header sticky top-0 z-30">Net Delivery (Value)</th>
                </tr>
              </thead> 
              <tbody className="text-[11px] divide-y divide-slate-200 text-end">
                {reportData.map((row, index) => {
                  const isGrandTotal = row.prodCode === 'Grand Total';
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
                      <td className={`py-0 px-2 border border-slate-200 ${isGrandTotal ? 'bg-transparent text-white' : 'bg-[#ffd6ba] text-slate-600'}`}>{row.prodCode}</td>
                      <td className={`py-0 px-2 border border-slate-200 text-left min-w-[350px] max-w-[500px] whitespace-normal text-[12px] ${isGrandTotal ? 'bg-transparent text-white' : 'bg-[#dbffcb] text-slate-700'}`}>{row.prodName}</td>
                      <td className="py-0 px-2 border border-slate-200">{formatDecimal(row.bagDelQty)}</td>
                      <td className="py-0 px-2 border border-slate-200">{formatDecimal(row.delTon)}</td>
                      <td className="py-0 px-2 border border-slate-200">{formatDecimal(row.deliveryValue)}</td>
                      <td className="py-0 px-2 border border-slate-200">{formatDecimal(row.ratePerBag)}</td>
                      <td className="py-0 px-2 border border-slate-200">{formatDecimal(row.ratePerMt)}</td>
                      <td className="py-0 px-2 border border-slate-200">{formatDecimal(row.bagReturnQty)}</td> 
                      <td className="py-0 px-2 border border-slate-200">{formatDecimal(row.totReturnValue)}</td>
                      <td className="py-0 px-2 border border-slate-200">{formatDecimal(row.returnQtyTon)}</td>
                      <td className="py-0 px-2 border border-slate-200">{formatDecimal(row.netDelQty)}</td>
                      <td className="py-0 px-2 border border-slate-200">{formatDecimal(row.netDelValue)}</td>
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