import { useLocation } from 'react-router-dom';
import { routeMap } from './routeMap';
import { HomeDashboard } from '../pages/HomePage'; // directly import the HomeDashboard component

export default function DynamicRouter() {
  const location = useLocation();
  const currentNormalizedPath = location.pathname ? location.pathname.toLowerCase() : '';

  // JODI URL /home hoy tahole directly HomeDashboard component render korbe
  if (currentNormalizedPath === '/home') {
    return <HomeDashboard />;
  }

  // will check if the current path exists in the routeMap and render the corresponding component
  const TargetComponent = routeMap[currentNormalizedPath];

  if (!TargetComponent) {
    return (
      <div className="bg-white p-6 rounded-xl border border-red-200 text-center font-sans m-4">
        <h3 className="text-red-500 font-bold text-sm">⚠️ Component Mapping Missing</h3>
        <p className="text-xs text-slate-400 mt-1">
          The path <code className="bg-slate-100 px-1 rounded text-blue-600 font-mono">{location.pathname || '/'}</code> exists in Database, but has not been mapped inside routeMap yet.
        </p>
      </div>
    );
  }

  return <TargetComponent />;
}