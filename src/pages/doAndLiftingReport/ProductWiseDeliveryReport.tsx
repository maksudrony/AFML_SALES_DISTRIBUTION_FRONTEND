import { useState, useEffect } from 'react';
import { CommonDateRange } from '../../components/commonParameters/CommonDateRange';
import { ProductParameterSelect } from '../../components/commonParameters/ProductParameter';
import { ShowReportButton } from '../../components/commonParameters/ShowReportButton'; 
import { ExcelDownloadButton } from '../../components/commonParameters/ExcelDownloadButton';
import { RGBSpinner } from '../../components/RGBSpinner';
import { Search } from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useLazyGetProductWiseDeliveryReportQuery } from '../../services/productWiseDeliveryReportApi';

export const ProductWiseDeliveryReport = () => {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.empEnroll || '';

  const [errorBanner, setErrorBanner] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<number | ''>('');
  const [reportData, setReportData] = useState<any[]>([]);

  // 🚀 ডম রেন্ডারিং গ্যাপ ফিক্স করার জন্য লোকাল লোডিং স্টেট
  const [isLocalLoading, setIsLocalLoading] = useState<boolean>(false);

  const [triggerReport, { data: fetchedData, isFetching, error }] = useLazyGetProductWiseDeliveryReportQuery();

  // 🚀 ডাটা প্রসেস হয়ে লোকাল স্টেটে বসা শেষ হলে তবেই লোডিং অফ হবে
  useEffect(() => {
    if (fetchedData) {
      setReportData(fetchedData);
      setIsLocalLoading(false); // 🚀 ডম রেন্ডারিং সিঙ্ক কমপ্লিট
    }
  }, [fetchedData]);

  useEffect(() => {
    if (error) {
      setErrorBanner("Opps! Failed to connect with server or generate report");
      setIsLocalLoading(false);
    }
  }, [error]);

  const formatDecimal = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(Number(num))) return '0.00';
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(num));
  };

  const handleShowReport = () => {
    setErrorBanner('');
    if (!fromDate || !toDate) {
      setErrorBanner("Opps! Dates cannot be null!! Please select From Date and To Date first!");
      return;
    }
    setReportData([]); 
    setIsLocalLoading(true); // 🚀 ক্লিক করার সাথে সাথে লোকাল লোডিং অন হবে

    triggerReport({
      fromDate,
      todate: toDate,
      entryBy: userId,
      productId: selectedProduct === '' ? '' : selectedProduct
    }, false); 
  };

  // 🚀 নেটওয়ার্ক ফেচিং অথবা লোকাল রেন্ডারিং—যেকোনো একটা চালু থাকলেই স্পিনার ঘুরবে
  const showSpinner = isFetching || isLocalLoading;

  return (
    <div className="w-full flex flex-col gap-2 font-sans text-slate-800 p-1 bg-white min-h-screen box-border shadow-none">
      {errorBanner && (
        <div className="p-1 bg-red-100 border border-red-300 rounded-md text-red-700 text-[15px] font-bold flex items-center justify-between w-full">
          <span>🤒 {errorBanner} ❗</span>
          <button type="button" onClick={() => setErrorBanner('')} className="text-red-500 hover:text-red-800 text-sm ml-2">✕</button>
        </div>
      )}

      <div className="bg-gradient-to-r from-orange-200 to-red-50 p-3 rounded-xl border border-slate-200 shadow-sm w-full box-border flex flex-col gap-1">
        <div className="text-center w-full">
          <h3 className="text-[16px] font-black text-slate-900 uppercase">AKIJ FLOUR MILLS LTD.</h3>
          <p className="text-[14px] font-bold text-[#D91656] uppercase mt-0.5">PRODUCT WISE DELIVERY REPORT</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 items-end gap-3 w-full lg:w-[70%] mx-auto relative z-[99]">
          <CommonDateRange
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={(val) => { setFromDate(val); setReportData([]); }} 
            onToDateChange={(val) => { setToDate(val); setReportData([]); }}   
          />
          <ProductParameterSelect 
            value={selectedProduct} 
            onChange={(val) => { setSelectedProduct(val); setReportData([]); }} 
            onError={setErrorBanner} 
          />
          <ShowReportButton onClick={handleShowReport} buttonAnimate={false} isLoading={showSpinner} />
          <ExcelDownloadButton tableId="delivery-report-table" reportTitle="Akij Flour Mills Ltd. - Product Wise Delivery Report" fileName="Product Wise Delivery Report" hasData={reportData.length > 0} onError={setErrorBanner} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 min-h-[300px] w-full box-border">
        {/* 🚀 কম্বাইন্ড কন্ডিশনাল স্পিনার সাপোর্টেড লেয়ার */}
        {showSpinner && <RGBSpinner />}
        
        {!showSpinner && reportData.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-2">
            <Search className="w-8 h-8 text-slate-300" />
            <p className="text-xs font-medium">Please click 'Show Report'.</p>
          </div>
        )}
        
        {!showSpinner && reportData.length > 0 && (
          <div className="w-full overflow-auto max-h-[420px]">
            <table id="delivery-report-table" className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="text-[10px] font-bold uppercase text-slate-900 whitespace-nowrap">
                  <th className="p-1 px-2 bg-[#C9EEFF]">Product Code</th>
                  <th className="p-1 px-2 bg-[#C9EEFF]">Product Name</th>
                  <th className="p-1 px-2 bg-[#C9EEFF]">Delivery (Bag)</th>
                  <th className="p-1 px-2 bg-[#C9EEFF]">Delivery (Ton)</th>
                  <th className="p-1 px-2 bg-[#C9EEFF]">Delivery (Value)</th>
                  <th className="p-1 px-2 bg-[#C9EEFF]">Rate Per Bag</th>
                  <th className="p-1 px-2 bg-[#C9EEFF]">Rate Per MT</th>
                  <th className="p-1 px-2 bg-[#C9EEFF]">Return (Bag)</th>
                  <th className="p-1 px-2 bg-[#C9EEFF]">Return (Value)</th>
                  <th className="p-1 px-2 bg-[#C9EEFF]">Return (Ton)</th>
                  <th className="p-1 px-2 bg-[#C9EEFF]">Net Delivery (Bag)</th>
                  <th className="p-1 px-2 bg-[#C9EEFF]">Net Delivery (Value)</th>
                </tr>
              </thead> 
              <tbody className="text-[11px] font-medium text-slate-700 divide-y divide-slate-200 text-end">
                {reportData.map((row: any, index: number) => {
                  const isGrandTotal = row.prodCode === 'Grand-Total';
                  return (
                    <tr key={index} className={isGrandTotal ? "bg-[#DB005B] text-white font-bold" : "table-data"}>
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