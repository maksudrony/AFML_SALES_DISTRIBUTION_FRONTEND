import { useState, useEffect } from 'react';
import { apiClient } from '../../api/apiClient'; 
import { CommonDateRange } from '../../components/commonParameters/CommonDateRange';
import { ProductParameterSelect } from '../../components/commonParameters/ProductParameter'; 
import { ExcelDownloadButton } from '../../components/commonParameters/ExcelDownloadButton';
import type { IExcelColumnConfig } from '../../types/excelExport';

interface ReportRow {
  ProductId : number; 
  ProdCode : string; 
  ProdName : string;

  BagDelQty : number;
  DelTon : number;
  DeliveryValue: number;

  RatePerBag : number;
  RatePerMt : number;

  BagReturnQty : number; 
  TotReturnValue : number;
  ReturnQtyTon : number;

  NetDelQty : number;
  NetDelValue : number;
}

export const ProductWiseDeliveryReport = () => {
  const [userId, setUserId] = useState<string>('');
  const [errorBanner, setErrorBanner] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false);

  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<number | ''>('');

  const [reportData, setReportData] = useState<ReportRow[]>([]);

  useEffect(() => {
    setUserId(localStorage.getItem('afml_user_enroll') || '');
  }, []);

  const excelColumnsConfig: IExcelColumnConfig[] = [
    { header: 'Territory', dataKey: 'territoryName', align: 'left', isBold: true, cellBgColor: 'FFF6B3' },
    { header: 'Distributor', dataKey: 'distribName', align: 'left', cellBgColor: 'ECFAE5' },
    { header: 'SO Enrol', dataKey: 'soEnrol', align: 'center', cellBgColor: 'FFD6BA' },
    { header: 'SO Name', dataKey: 'empName', align: 'left', cellBgColor: 'DBFFCB' },
    { header: 'Joining Date', dataKey: 'joiningDate', align: 'left', cellBgColor: 'FFF5CE' }
  ];

  const handleShowReport = async () => {
    setErrorBanner('');
    if (!fromDate || !toDate) {
      setErrorBanner("Opps! Dates cannot be null!! Please select From Date and To Date first!");
      return;
    }

    setReportData([]);
    setIsLoading(true);

    try 
    {
      const response = await apiClient.get<ReportRow[]>('/ProductWiseDeliveryReport/product-wise-delivery-report', {
        params: {
          fromDate,
          toDate,
          entryBy: userId,
          productId: selectedProduct || null
        }
      });

      // 🚀 ফিক্স: ডাটাবেজ থেকে যাই আসুক, টেবিলে পুশ করার আগেই শুধুমাত্র channelId = 1 ফিল্টার করে নেওয়া হলো
      const serverData = response.data;
      const filteredData = serverData.filter(row => row.channelId === 1 || row.channelName?.toLowerCase().includes('consumer'));

      setReportData(filteredData);

      if (filteredData.length > 0) {
        setDynamicDayColumns(Object.keys(filteredData[0].daysData || {}));
      }
    } catch (err: unknown) 
    {
      if (err && typeof err === 'object' && 'response' in err) {
        const responseObj = (err as any).response;
        if (responseObj && responseObj.data) {
          setErrorBanner(responseObj.data.error || responseObj.data.message || "Server Error.");
          setIsLoading(false);
          return;
        }
      }
      setErrorBanner("Opps! Failed to connect with server.");
    } finally 
    {
      setIsLoading(false);
    }
  };

  const handleDateChangeReset = () => {
    setReportData([]);
  }

  return (
  <div className="w-full flex flex-col gap-2 font-sans text-slate-800 p-1 bg-white 
  min-h-screen box-border shadow-none">

    {errorBanner && (
    <div className="p-2 bg-red-100 border border-red-300 rounded-md text-red-700 text-xs 
    font-bold shadow-sm flex items-center justify-between w-full">
      <span>😣 {errorBanner} </span>
      <button 
          type="button" 
          onclick={ ()=> setErrorBanner('')} 
          className="text-red-500 hover:text-red-800 text-sm ml-2">
              ✕
      </button>
    </div>
    )}

    <div className="bg-gradient-to-r from-orange-200 to-red-50 p-3 rounded-xl border 
    border-slate-200 shadow-sm w-full box-border flex flex-col gap-1">
      <div className="flex items-center justify-between relative w-full">
        <div className="w-[120px] hidden sm:block" />

        <div className="text-center flex-1">
          <h3 className="text-[16px] font-black text-slate-900 tracking-wide uppercase">
            AKIJ FLOUR MILLS LTD.
          </h3>
          <p className="text-[14px] font-bold text-[#D91656] uppercase tracking-wider mt-0.5">
            PRODUCT WISE DELIVERY REPORT
          </p>
        </div>

        <ExcelDownloadButton<ReportRow>
          reportTitle="Akij Flour Mills Ltd. - Product Wise Delivery Report"
          fileName="Product Wise Delivery Report"
          columns={excelColumnsConfig}
          data={reportData}
          onError={setErrorBanner}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-1 items-end w-full">

        <CommonDateRange
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={(val) => { setFromDate(val); handleDateChangeReset(); }}
          onToDateChange={(val) => { setToDate(val); handleDateChangeReset(); }}
        />

        <ProductParameterSelect 
          value={selectedProduct}
          onChange={(val) => {
            setSelectedProduct(val);
            setReportData([]);
          }}
          onError={setErrorBanner}
        />


        <ShowReportButton
          onClick={handleShowReport}
          buttonAnimate={false}
          isLoading={isLoading}
        />

      </div>

    </div>




  
  </div>
  )
}
