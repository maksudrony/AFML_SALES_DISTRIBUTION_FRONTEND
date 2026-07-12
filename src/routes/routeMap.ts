import React from 'react';

import { SummaryImsReport } from '../pages/imsReports/SummaryImsReport';
import { ProductWiseDeliveryReport } from '../pages/doAndLiftingReport/ProductWiseDeliveryReport';
import { LiftingAndDoReport } from '../pages/doAndLiftingReport/LiftingAndDoReport';
import { AverageRateRpt } from '../pages/doAndLiftingReport/AverageRateRpt';

export const routeMap: Record<string, () => React.JSX.Element> = {
  //IMS REPORT MENU
  '/imsreport/summeryimsreport': SummaryImsReport,

  //DO AND LIFTING REPORT MENU
  '/doandliftingreport/productwisedeliveryreport': ProductWiseDeliveryReport,
  '/doandliftingreport/liftingreport&doreport': LiftingAndDoReport,
  '/doandliftingreport/avgrateonlifting&do&pending': AverageRateRpt,
};
