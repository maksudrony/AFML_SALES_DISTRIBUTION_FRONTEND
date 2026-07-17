import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// All Report Names
export const ReportKeys = {
  //DO AND LIFTING REPORT MENU
  DayWiseDelRpt: 'DayWiseDelRpt',
  AverageRateRpt: 'AverageRateRpt',
  LiftingAndDoRpt: 'LiftingAndDoRpt',
  DistribWisePendingRpt: 'DistribWisePendingRpt',
  ProductWiseDeliveryRpt: 'ProductWiseDeliveryRpt',
  //IMS REPORT MENU
  SummaryImsRpt: 'SummaryImsRpt',
} as const;

// Valid Keys for Report Names--> ReportKeys objects er value gula niye UNION TYPE create kora
export type ReportKeyType = typeof ReportKeys[keyof typeof ReportKeys];

// Key = Report Name mane ReportKeyType
// Value = Cached filter parameters of that report -> mane Record  
export type ReportFiltersCacheState = Partial<
  Record<ReportKeyType, Record<string, unknown>>
>;

const initialState: ReportFiltersCacheState = {};

export const reportFiltersCacheSlice = createSlice({
  name: 'reportFiltersCache',
  initialState,
  reducers: {
    updateReportFilters: (
      state,
      action: PayloadAction<{ reportKey: ReportKeyType; filters: Record<string, unknown> }>
    ) => {
      const { reportKey, filters } = action.payload;

      // ager state[reportKey] thakle, tar sathe notun filters merge kora hobe, na thakle notun 
      // entry create kora hobe
      state[reportKey] = {
        ...(state[reportKey] || {}),
        ...filters,
      };
    },

    // logout er somoy sob report filters clear hoye jabe
    clearAllReportFilters: () => {
      return initialState;
    },
  },
});

export const { updateReportFilters, clearAllReportFilters } = reportFiltersCacheSlice.actions;
export const reportFiltersCacheReducer = reportFiltersCacheSlice.reducer;