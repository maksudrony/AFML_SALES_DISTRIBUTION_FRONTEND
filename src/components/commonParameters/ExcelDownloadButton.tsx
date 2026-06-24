import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { IExcelColumnConfig } from '../../types/excelExport';

interface ExcelDownloadButtonProps<T> {
  reportTitle: string;
  fileName: string;
  columns: IExcelColumnConfig[];
  data: T[];
  onError: (errorMsg: string) => void;
}

export const ExcelDownloadButton = <T extends Record<string, any>>({
  reportTitle,
  fileName,
  columns,
  data,
  onError
}: ExcelDownloadButtonProps<T>) => {

  const exportToExcel = async () => {
    if (!data || data.length === 0) {
      onError("Opps! please click show report At first!");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    const totalCols = columns.length;

    // ১. টাইটেল রো ফরম্যাটিং
    worksheet.mergeCells(1, 1, 1, totalCols);
    const titleCell = worksheet.getCell(1, 1);
    titleCell.value = reportTitle.toUpperCase();
    titleCell.font = { name: 'Arial', size: 13, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 35;

    worksheet.addRow([]); // স্পেসিং রো

    // ২. হেডার রো জেনারেশন
    const headerLabels = columns.map(col => col.header);
    const headerRow = worksheet.addRow(headerLabels);
    headerRow.height = 24;

    headerRow.eachCell((cell, colNumber) => {
      const colConfig = columns[colNumber - 1];
      
      // 🚀 ফিক্স ২: হেডার কালার যদি রিপোর্টে কাস্টম থাকে (যেমন ডে কলাম #FFD09B) তবে সেটা বসবে, নয়তো ডিফল্ট গ্রিন
      const bgHex = colConfig.headerBgColor || '10B981'; 
      
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgHex }
      };
      cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: bgHex === 'FFD09B' ? '000000' : 'FFFFFF' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'CBD5E1' } },
        bottom: { style: 'medium', color: { argb: '94A3B8' } },
        left: { style: 'thin', color: { argb: 'CBD5E1' } },
        right: { style: 'thin', color: { argb: 'CBD5E1' } }
      };
    });

    // ৩. ডাটা রো জেনারেশন (রিপোর্টের হুবহু কালার ও স্টাইল কম্বিনেশন কপি)
    data.forEach((row) => {
      const rowData = columns.map((col) => {
        if (col.nestedKey) {
          const nestedObject = row[col.nestedKey];
          return nestedObject?.[col.dataKey] !== undefined ? nestedObject[col.dataKey] : 0;
        }
        return row[col.dataKey] !== undefined ? row[col.dataKey] : '';
      });

      const insertedRow = worksheet.addRow(rowData);
      insertedRow.height = 20;

      insertedRow.eachCell((cell, colNumber) => {
        const colConfig = columns[colNumber - 1];

        cell.font = { 
          name: 'Arial', 
          size: 9, 
          bold: colConfig.isBold ?? false 
        };
        
        cell.border = {
          top: { style: 'thin', color: { argb: 'E2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
          left: { style: 'thin', color: { argb: 'E2E8F0' } },
          right: { style: 'thin', color: { argb: 'E2E8F0' } }
        };

        cell.alignment = { 
          vertical: 'middle', 
          horizontal: colConfig.align || 'left' 
        };

        // 🚀 ফিক্স ৩: মেইন রিপোর্টের টেবিল ডিজাইনের হুবহু সেম কালার এক্সেলে রিফ্লেক্ট করা
        if (colConfig.cellBgColor) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: colConfig.cellBgColor }
          };
        }
      });
    });

    // ৪. ক模拟ল উইডথ অটো-ফিট
    worksheet.columns.forEach((column) => {
      let maxColumnLength = 0;
      column.eachCell?.({ includeEmpty: false }, (cell, rowNumber) => {
        if (rowNumber > 1) {
          const cellLength = cell.value ? cell.value.toString().length : 0;
          if (cellLength > maxColumnLength) {
            maxColumnLength = cellLength;
          }
        }
      });
      column.width = Math.min(Math.max(maxColumnLength + 4, 12), 50);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  };

  return (
    <div className="min-w-[120px] text-right">
      <button 
        type="button"
        onClick={exportToExcel}
        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-md shadow-sm cursor-pointer transition-colors"
      >
        <span>EXCEL DOWNLOAD</span> 
        <FileSpreadsheet className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};