export interface IExcelColumnConfig {
  header: string;                      
  dataKey: string;                    
  nestedKey?: string;                  
  align?: 'left' | 'center' | 'right'; 
  isBold?: boolean;
  cellBgColor?: string; // Report table cell background color
  headerBgColor?: string;
}