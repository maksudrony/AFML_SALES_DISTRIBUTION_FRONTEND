import { useState, useEffect } from 'react';
import { apiClient } from '../../api/apiClient'; 
import { CommonDateRange } from '../../components/commonParameters/CommonDateRange';
import { ProductParameterSelect } from '../../components/commonParameters/ProductParameter';
import { ShowReportButton } from '../../components/commonParameters/ShowReportButton'; 
import { ExcelDownloadButton } from '../../components/commonParameters/ExcelDownloadButton';
import { RGBSpinner } from '../../components/RGBSpinner';
import { Search } from 'lucide-react';

interface ReportRow {
  productId : number; 
  prodCode : string; 
  prodName : string;
  bagDelQty : number;
  delTon : number;
  deliveryValue: number;
  ratePerBag : number;
  ratePerMt : number;
  bagReturnQty : number; 
  totReturnValue : number;
  returnQtyTon : number;
  netDelQty : number;
  netDelValue : number;
}

export const ProductWiseDeliveryReport = () => {
  const [userId, setUserId] = useState<string>('');
  const [errorBanner, setErrorBanner] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<number | ''>('');

  const [reportData, setReportData] = useState<ReportRow[]>([]);

  useEffect(() => {
    setUserId(localStorage.getItem('afml_user_enroll') || '');
  }, []);

  const formatDecimal = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(Number(num))) return '0.00';
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(num));
  };

  const handleShowReport = async () => {
    setErrorBanner('');
    if (!fromDate || !toDate) {
      setErrorBanner("Opps! Dates cannot be null!! Please select From Date and To Date first!");
      return;
    }

    setReportData([]);
    setIsLoading(true);

    try {
      const response = await apiClient.get<ReportRow[]>('/ProductWiseDeliveryReport/product-wise-delivery-report', {
        params: { 
          fromDate, 
          todate: toDate, 
          entryBy: userId || null, 
          productId: selectedProduct || null 
        }
      });
      setReportData(response.data);
    } 

    catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const responseObj = (err as any).response;
        
        if (responseObj && responseObj.data) {
          const apiErrorMsg = responseObj.data.error || JSON.stringify(responseObj.data);
          
          if (apiErrorMsg && apiErrorMsg.includes("Connection request timed out")) {
            setErrorBanner("Opps! Failed to connect with server");
          } else {
            // Database procedure error or other server-side error
            setErrorBanner("Opps! Unable to generate Product Wise Delivery Report");
          }
          
          setIsLoading(false);
          return;
        }
      }
      // 👇 Fallback jodi direct server down thake ba status crash hoy
      setErrorBanner("Opps! Failed to connect with server");
    } 
    
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 font-sans text-slate-800 p-1 bg-white min-h-screen box-border shadow-none">
      {errorBanner && (
        <div className="p-1 bg-red-100 border border-red-300 rounded-md text-red-700 text-[15px] 
        font-bold shadow-sm flex items-center justify-between w-full">
          <span>🤒 {errorBanner} ❗</span>
          <button 
            type="button" 
            onClick={() => setErrorBanner('')} 
            className="text-red-500 hover:text-red-800 text-sm ml-2">✕
          </button>
        </div>
      )}

      <div className="bg-gradient-to-r from-orange-200 to-red-50 p-3 rounded-xl border border-slate-200 shadow-sm w-full box-border flex flex-col gap-1">
        <div className="text-center w-full">
          <h3 className="text-[16px] font-black text-slate-900 tracking-wide uppercase">AKIJ FLOUR MILLS LTD.</h3>
          <p className="text-[14px] font-bold text-[#D91656] uppercase tracking-wider mt-0.5">PRODUCT WISE DELIVERY REPORT</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 items-end gap-3 w-full 
        lg:w-[70%] bg-transparent justify-center mx-auto box-border relative z-[99]">

            <CommonDateRange
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={(val) => { setFromDate(val); setReportData([]); }}
              onToDateChange={(val) => { setToDate(val); setReportData([]); }}
            />

            <ProductParameterSelect 
              value={selectedProduct} 
              onChange={(val) => { 
                setSelectedProduct(val); 
                setReportData([]); 
              }} 
              onError={setErrorBanner} 
            />

          <div className="w-full">
            <ShowReportButton 
              onClick={handleShowReport} 
              buttonAnimate={false} 
              isLoading={isLoading} 
            />
          </div>

          <div className="w-full">
            <ExcelDownloadButton
              tableId="delivery-report-table"
              reportTitle="Akij Flour Mills Ltd. - Product Wise Delivery Report"
              fileName="Product Wise Delivery Report"
              hasData={reportData.length > 0}
              onError={setErrorBanner}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 min-h-[300px] w-full box-border">
        {isLoading && <RGBSpinner />}

        {!isLoading && reportData.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-2">
            <Search className="w-8 h-8 text-slate-300 stroke-[1.5]" />
            <p className="text-xs font-medium">Please click 'Show Report'.</p>
          </div>
        )}

        {!isLoading && reportData.length > 0 && (
          <div className="w-full overflow-auto max-h-[420px]">
            <table id="delivery-report-table" className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap text-slate-900">
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
                {reportData.map((row, index) => {
                  const isGrandTotal = row.prodCode === 'Grand-Total';
                  return (
                    <tr key={index} className={isGrandTotal ? "bg-[#DB005B] text-white font-bold" : "table-data"}>
                      <td className={`py-0 px-2 border border-slate-200 
                        ${isGrandTotal ? 'bg-transparent text-white' : 'bg-[#ffd6ba] text-slate-600'}`}>
                        {row.prodCode}
                      </td>
                      <td className={`py-0 px-2 border border-slate-200 text-left min-w-[350px] 
                      max-w-[500px] whitespace-normal text-[12px] 
                      ${isGrandTotal ? 'bg-transparent text-white' : 'bg-[#dbffcb] text-slate-700'}`}>
                        {row.prodName}
                      </td>
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