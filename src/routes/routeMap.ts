import React from 'react';

import { SummaryImsReport } from '../pages/ims-reports/SummaryImsReport'; // পাথ আপডেট করা হলো
import { ProductWiseDeliveryReport } from '../pages/do-and-lifting-report/ProductWiseDeliveryReport';

export const routeMap: Record<string, () => React.JSX.Element> = {
  // '/basicdata/saleschannel': SalesChannel,
  '/imsreport/summeryimsreport': SummaryImsReport,
  '/doandliftingreport/productwisedeliveryreport': ProductWiseDeliveryReport,
};

// export const routeMap: Record<string, React.ComponentType> = {
//   // '/basicdata/saleschannel': SalesChannel,
// };