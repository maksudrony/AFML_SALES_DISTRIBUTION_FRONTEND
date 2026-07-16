import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface ExcelDownloadButtonV2Props {
  tableId: string;
  reportTitle: string;
  fileName: string;
  hasData: boolean;
  generatedBy: string;
  onError: (msg: string) => void;
  companyName?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  dayRange?: {
    from: string;
    to: string;
  };
}

export const ExcelDownloadButtonV2 = ({
  tableId,
  reportTitle,
  fileName,
  hasData,
  generatedBy,
  onError,
  companyName = 'AKIJ FLOUR MILLS PLC.',
  dateRange,
  dayRange,
}: ExcelDownloadButtonV2Props) => {

  // Tailwind and DOM Class mapping to exact ARGB hex colors matching your UI theme
  const getThemeColorByClassName = (cell: HTMLTableCellElement, row: HTMLTableRowElement, isText: boolean = false) => {
    const cellClasses = cell.className || '';
    const rowClasses = row.className || '';
    const isHead = row.parentElement?.tagName.toLowerCase() === 'thead';

    if (isText) {
      if (cellClasses.includes('text-slate-900') || cellClasses.includes('text-slate-800')) return '0F172A';
      if (cellClasses.includes('text-rose-900')) return '881337';
      if (cellClasses.includes('text-pink-800')) return '9D174D';
      return isHead ? '0F172A' : '334155';
    } else {
      // Cyan Header & Column Detections
      if (cellClasses.includes('bg-cyan-100') || cellClasses.includes('table-header')) return 'E0F2FE'; // Cute Cyan Blue
      if (cellClasses.includes('bg-teal-200')) return '99F6E4';       // Teal Header
      if (cellClasses.includes('bg-emerald-200')) return 'A7F3D0';    // Emerald Header
      if (cellClasses.includes('bg-purple-100')) return 'F3E8FF';     // Purple Sub-header
      if (cellClasses.includes('bg-fuchsia-200')) return 'F5D0FE';    // Fuchsia Sub-header
      
      // Totals & Highlight rows mapping
      if (cellClasses.includes('bg-green-200') || rowClasses.includes('bg-grand-total')) return 'BBF7D0'; // Grand Total
      if (cellClasses.includes('bg-emerald-300')) return '6EE7B7';   
      if (cellClasses.includes('bg-yellow-100') || rowClasses.includes('bg-sub-total')) return 'FEF08A';  // Sub Total
      if (cellClasses.includes('bg-orange-200')) return 'FED7AA';    

      // First column data background tint check (Channel Name column text-center style fallback)
      if (cellClasses.includes('text-center') && !isHead) return 'E0F2FE'; // Matches cyan column look

      return 'FFFFFF'; 
    }
  };

  const formatDateString = (dateStr: string | undefined): string => {
    if (!dateStr) return '';
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts[0].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    return dateStr;
  };

const getFormattedCurrentDateTime = (): string => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    
    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", 
        "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const monthName = months[now.getMonth()];
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const strHours = String(hours).padStart(2, '0');

    return `${day}-${monthName}-${year} ${strHours}:${minutes}:${seconds} ${ampm}`;
  };

  const exportToExcel = async () => {
    if (!hasData) {
      onError("Opps! please click show report At first");
      return;
    }

    const tableElement = document.getElementById(tableId) as HTMLTableElement;
    if (!tableElement) {
      onError(`Error: Report table with ID "${tableId}" not found in DOM`);
      return;
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = generatedBy;
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Report', {
      views: [] // Scrollable dynamic layout enabled
    });

    const htmlRows = tableElement.querySelectorAll('tr');
    let maxCols = 0;
    htmlRows.forEach(row => {
      let count = 0;
      for (let i = 0; i < row.cells.length; i++) {
        count += row.cells[i].colSpan || 1;
      }
      if (count > maxCols) maxCols = count;
    });

    const totalCols = maxCols || 13;

    // --- SUMMARY BANNER TOP INFO ---
    worksheet.mergeCells(1, 1, 1, totalCols);
    const compCell = worksheet.getCell(1, 1);
    compCell.value = companyName.toUpperCase();
    compCell.font = { name: 'Arial', size: 11, bold: true, color: { argb: '0F172A' } };
    compCell.alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getRow(1).height = 18;

    worksheet.mergeCells(2, 1, 2, totalCols);
    const titleCell = worksheet.getCell(2, 1);
    titleCell.value = reportTitle.toUpperCase();
    titleCell.font = { name: 'Arial', size: 9, bold: true, color: { argb: '475569' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getRow(2).height = 16;

    if (dateRange) {
      worksheet.mergeCells(3, 1, 3, totalCols);
      const dateCell = worksheet.getCell(3, 1);
      dateCell.value = `Date Range : ${formatDateString(dateRange.from)} To ${formatDateString(dateRange.to)}`;
      dateCell.font = { name: 'Arial', size: 8.5, bold: false, color: { argb: '334155' } };
      dateCell.alignment = { vertical: 'middle', horizontal: 'left' };
      worksheet.getRow(3).height = 14;
    }

    let currentBlockRow = 4;
    if (dayRange) {
      worksheet.mergeCells(currentBlockRow, 1, currentBlockRow, totalCols);
      const dayCell = worksheet.getCell(currentBlockRow, 1);
      dayCell.value = `Day Range : ${formatDateString(dayRange.from)} To ${formatDateString(dayRange.to)}`;
      dayCell.font = { name: 'Arial', size: 8.5, bold: false, color: { argb: '334155' } };
      dayCell.alignment = { vertical: 'middle', horizontal: 'left' };
      worksheet.getRow(currentBlockRow).height = 14;
      currentBlockRow++;
    }

    worksheet.mergeCells(currentBlockRow, 1, currentBlockRow, totalCols);
    const genByCell = worksheet.getCell(currentBlockRow, 1);
    genByCell.value = `Generated By : ${generatedBy}`;
    genByCell.font = { name: 'Arial', size: 8.5, bold: false, color: { argb: '334155' } };
    genByCell.alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getRow(currentBlockRow).height = 14;
    currentBlockRow++;

    worksheet.mergeCells(currentBlockRow, 1, currentBlockRow, totalCols);
    const genOnCell = worksheet.getCell(currentBlockRow, 1);
    genOnCell.value = `Generated On : ${getFormattedCurrentDateTime()}`;
    genOnCell.font = { name: 'Arial', size: 8.5, bold: false, color: { argb: '334155' } };
    genOnCell.alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getRow(currentBlockRow).height = 14;
    currentBlockRow++;

    worksheet.addRow([]);
    currentBlockRow++;

    const startTableExcelRow = currentBlockRow + 1;
    const cellMatrix: { [key: string]: boolean } = {};

    // --- DATA GRID PROCESSOR ---
    for (let rowIndex = 0; rowIndex < htmlRows.length; rowIndex++) {
      const htmlRow = htmlRows[rowIndex];
      const isHead = htmlRow.parentElement?.tagName.toLowerCase() === 'thead';
      
      const excelRowNumber = startTableExcelRow + rowIndex;
      const excelRow = worksheet.getRow(excelRowNumber);
      excelRow.height = isHead ? 20 : 17; 

      let excelColIndex = 1;

      for (let cellIndex = 0; cellIndex < htmlRow.cells.length; cellIndex++) {
        const htmlCell = htmlRow.cells[cellIndex];

        while (cellMatrix[`${excelRowNumber},${excelColIndex}`]) {
          excelColIndex++;
        }

        const colSpan = htmlCell.colSpan || 1;
        const rowSpan = htmlCell.rowSpan || 1;

        for (let r = 0; r < rowSpan; r++) {
          for (let c = 0; c < colSpan; c++) {
            cellMatrix[`${excelRowNumber + r},${excelColIndex + c}`] = true;
          }
        }

        const targetCell = excelRow.getCell(excelColIndex);
        const textValue = htmlCell.innerText.trim();
        const cleanNum = textValue.replace(/,/g, '');

        if (!isHead && cleanNum !== '' && !isNaN(Number(cleanNum))) {
          targetCell.value = Number(cleanNum);
          targetCell.numFormat = '#,##0.00';
        } else {
          targetCell.value = textValue;
        }

        if (colSpan > 1 || rowSpan > 1) {
          worksheet.mergeCells(
            excelRowNumber,
            excelColIndex,
            excelRowNumber + rowSpan - 1,
            excelColIndex + colSpan - 1
          );
        }

        const bgThemeColorHex = getThemeColorByClassName(htmlCell, htmlRow, false);
        const textThemeColorHex = getThemeColorByClassName(htmlCell, htmlRow, true);
        
        const cellClasses = htmlCell.className || '';
        const rowClasses = htmlRow.className || '';
        const isBoldText = isHead || cellClasses.includes('font-bold') || rowClasses.includes('bg-grand-total') || rowClasses.includes('bg-sub-total');

        targetCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: bgThemeColorHex }
        };

        targetCell.font = {
          name: 'Arial',
          size: isHead ? 8 : 8.5, 
          bold: isBoldText,
          color: { argb: textThemeColorHex }
        };

        let cellAlignment = 'right';
        if (excelColIndex === 1) cellAlignment = 'center'; 
        else if (excelColIndex === 2) cellAlignment = 'center'; 
        else if (excelColIndex === 3) cellAlignment = 'left'; 

        targetCell.alignment = {
          vertical: 'middle',
          horizontal: isHead ? 'center' : (cellAlignment as any),
          wrapText: excelColIndex === 3
        };

        targetCell.border = {
          top: { style: 'thin', color: { argb: 'CBD5E1' } },
          bottom: { style: isHead ? 'medium' : 'thin', color: { argb: '94A3B8' } },
          left: { style: 'thin', color: { argb: 'CBD5E1' } },
          right: { style: 'thin', color: { argb: 'CBD5E1' } }
        };

        excelColIndex += colSpan;
      }
    }

    worksheet.columns.forEach((column) => {
      let maxColumnLength = 0;
      column.eachCell?.({ includeEmpty: false }, (cell, rowNumber) => {
        if (rowNumber > startTableExcelRow) {
          const cellLength = cell.value ? cell.value.toString().length : 0;
          if (cellLength > maxColumnLength) {
            maxColumnLength = cellLength;
          }
        }
      });
      column.width = Math.min(Math.max(maxColumnLength + 3, 11), 38);
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
        cursor-pointer transition-colors whitespace-nowrap !flex-nowrap text-ellipsis 
        overflow-hidden"
      >
        <span className="flex-shrink-0">EXCEL</span> 
        <FileSpreadsheet className="w-3.5 h-3.5 flex-shrink-0" />
      </button> 
    </div>
  );
};