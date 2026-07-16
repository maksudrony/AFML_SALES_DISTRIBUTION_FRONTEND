import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface ExcelDownloadButtonProps {
  tableId: string;
  reportTitle: string;
  fileName: string;
  hasData: boolean;
  onError: (errorMsg: string) => void;
}

export const ExcelDownloadButton = ({
  tableId,
  reportTitle,
  fileName,
  hasData,
  onError
}: ExcelDownloadButtonProps) => {

  const exportToExcel = async () => {
    if (!hasData) {
      onError("Opps! please click show report At first");
      return;
    }

    const tableElement = document.getElementById(tableId) as HTMLTableElement;
    if (!tableElement) {
      onError("Error: Report table not found in DOM");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    const totalCols = tableElement.rows[0]?.cells.length || 12;
    worksheet.mergeCells(1, 1, 1, totalCols);
    const titleCell = worksheet.getCell(1, 1);
    titleCell.value = reportTitle.toUpperCase();
    titleCell.font = { name: 'Arial', size: 13, bold: true, color: { argb: 'FFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BF124D' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 40;

    worksheet.addRow([]); 

    // HTML Table er row loop kora hoise
    const rows = tableElement.rows;
    
    for (let i = 0; i < rows.length; i++) {
      const htmlRow = rows[i];
      const cellValues: any[] = [];
      const isHead = htmlRow.parentElement?.tagName.toLowerCase() === 'thead';
      
      const firstCellText = htmlRow.cells[0]?.innerText.trim() || '';
      const isGrandTotal = firstCellText === 'Grand-Total' || htmlRow.className.includes('bg-[#DB005B]');

      for (let j = 0; j < htmlRow.cells.length; j++) {
        const text = htmlRow.cells[j].innerText.trim();
        const cleanNum = text.replace(/,/g, '');
        if (!isHead && cleanNum !== '' && !isNaN(Number(cleanNum))) {
          cellValues.push(Number(cleanNum));
        } else {
          cellValues.push(text);
        }
      }

      const excelRow = worksheet.addRow(cellValues);
      excelRow.height = isHead ? 26 : 22;

      for (let j = 0; j < htmlRow.cells.length; j++) {
        const htmlCell = htmlRow.cells[j];
        const excelCell = excelRow.getCell(j + 1);

        excelCell.border = {
          top: { style: 'thin', color: { argb: 'CBD5E1' } },
          bottom: { style: isHead ? 'medium' : 'thin', color: { argb: '94A3B8' } },
          left: { style: 'thin', color: { argb: 'CBD5E1' } },
          right: { style: 'thin', color: { argb: 'CBD5E1' } }
        };

        let cellAlignment = 'right';
        if (j === 0) cellAlignment = 'center';
        else if (j === 1) cellAlignment = 'left';
        
        excelCell.alignment = {
          vertical: 'middle',
          horizontal: isHead ? 'center' : (cellAlignment as any),
          wrapText: j === 1 
        };

        if (isHead) {
          excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C9EEFF' } };
          excelCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: '0F172A' } };
        } else if (isGrandTotal) {
          excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DB005B' } };
          excelCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFF' } };
        } else {
          excelCell.font = { name: 'Arial', size: 9, bold: false, color: { argb: '334155' } };
          
          if (j === 0) {
            excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD6BA' } };
          } else if (j === 1) {
            excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DBFFCB' } };
          } else {
            excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } };
          }
        }

        if (typeof excelCell.value === 'number') {
          excelCell.numFormat = '#,##0.00';
        }
      }
    }

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
      column.width = Math.min(Math.max(maxColumnLength + 5, 14), 50);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  };

  return (
    <div className="w-full">
      <button 
        type="button"
        onClick={exportToExcel}
        className="flex items-center justify-center w-full h-[30px] gap-1.5 px-4 
        bg-gradient-to-r from-[#00C853] via-[#00BFA5] to-[#00ACC1]
      hover:from-emerald-600 hover:via-teal-500 hover:to-cyan-500 shadaw-lg hover:shadow-xl
        text-white font-bold text-[10px] tracking-wider rounded-md 
        shadow-sm cursor-pointer transition-colors whitespace-nowrap !flex-nowrap text-ellipsis 
        overflow-hidden"
      >
        <span className="flex-shrink-0">EXCEL</span> 
        <FileSpreadsheet className="w-3.5 h-3.5 flex-shrink-0" />
      </button> 
    </div>
  );
};