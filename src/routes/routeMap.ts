import React from 'react';

import { SummaryImsReport } from '../pages/ims-reports/SummaryImsReport'; // পাথ আপডেট করা হলো

export const routeMap: Record<string, () => React.JSX.Element> = {
  // '/basicdata/saleschannel': SalesChannel,
  '/imsreport/summeryimsreport': SummaryImsReport,
};

// export const routeMap: Record<string, React.ComponentType> = {
//   // '/basicdata/saleschannel': SalesChannel,
// };